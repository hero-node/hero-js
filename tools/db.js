const OrbitDB = require('orbit-db');
const IpfsApi = require('ipfs-api');
const crypto = require('crypto');
const path = require('path');
const util = require('util');

var ipfs = IpfsApi('127.0.0.1', '5001');
var orbitdb = new OrbitDB(ipfs);

var dbconnections = [];

async function binding(socket, msg) {
  if (msg === 'disconnect') {
    console.log('连接中断', socket.db._from);
    var index = dbconnections.indexOf(socket.db.db);
    if (index > 1) {
      dbconnections.splice(index, 1);
    }
    socket.db.db.events.removeListener('write', socket.writeListener);
    socket.db.db.events.removeListener('replicated', socket.replicatedListener);
    socket.db = null;
    return;
  }

  socket.on('error', function(error) {
    console.log(error);
  });

  if (msg.req === 'chatConnect') {
    console.log('有连接进入', msg.from);
    var from = msg.from;
    var to = msg.to;
    var db = new DB(ipfs, orbitdb, from, to);
    await db.load();
    socket.emit('chatConnected');
    socket.db = db;
  } else if (msg.req === 'subscribe') {
    console.log('subscribe');

    socket.writeListener = (dbname, hash, entry) => {
      if (entry[0].payload.op === 'DEL') {
        // 删除历史数据时不发送
        return;
      }
      console.log('订阅回调');
      var output = socket.db.getMessage();
      if (output && output.length > 0) {
        console.log('\n');
        console.log(output);
        socket.emit('newMessage', output);
        console.log('sended');
        socket.db.deleteMessage();
      }
    };
    socket.replicatedListener = () => {
      console.log('订阅回调');
      var output = socket.db.getMessage();
      if (output && output.length > 0) {
        console.log('\n');
        console.log(output);
        socket.emit('newMessage', output);
        console.log('sended');
        socket.db.deleteMessage();
      }
    };
    socket.db.db.events.on('write', socket.writeListener);
    socket.db.db.events.on('replicated', socket.replicatedListener);

    socket.emit('subscribeResponse', 'success');
  } else if (msg.req === 'post') {
    var payload = msg.payload;
    var pub = msg.pub;
    var encrypted = msg.encrypted;
    var hash = await socket.db.add({
      from: socket.db._from,
      to: socket.db._to,
      payload: payload,
      pub: pub,
      encrypted: encrypted,
    });
    socket.emit('postResponse', hash);
  } else if (msg.req === 'fetch') {
    console.log(socket.db._from, 'fetch');
    var output = socket.db.getMessage();
    if (output && output.length > 0) {
      socket.emit('newMessage', output);
      socket.db.deleteMessage();
    }
  }
}

class DB {
  constructor(ipfs, orbitdb, from, to) {
    this._from = from;
    this._to = to;
    this._orbitdb = orbitdb;
    this._ipfs = ipfs;
  }

  async load() {
    var addr = await this.address(this._from, this._to);
    var isExist = false;
    for (var i = 0; i < dbconnections.length; i++) {
      var conn = dbconnections[i];
      if (conn.address.toString() === addr) {
        console.log('发现已有连接');
        this.db = conn;
        isExist = true;
        break;
      }
    }

    if (!isExist) {
      console.log('创建新的数据库连接', addr);
      this.db = await this._orbitdb.feed(addr, {
        write: ['*'],
      });
      await this.db.load();
      dbconnections.push(this.db);
    }
  }

  async address(from, to) {
    var hash = this.ethAddressToHash(from, to);
    var manifest = await this.createDBManifest(hash);
    return path.join('/orbitdb', manifest, hash);
  }

  async createDBManifest(name) {
    const manifest = {
      name: name,
      type: 'feed',
      accessController: path.join(
        '/ipfs',
        'QmX43NJHrfDCEdRo3LjQrmHwNJ9wL4bERkHeGBJwZmqQSo'
      ),
    };
    const dag = await this._ipfs.object.put(
      Buffer.from(JSON.stringify(manifest))
    );
    return dag.toJSON().multihash.toString();
  }

  getMessage() {
    var result = this.db
      .iterator({
        limit: -1,
        gt: this.lastHash,
      })
      .collect();
    let output;
    if (result && result.length > 0) {
      output = result
        .filter(e => e.payload.value.to === this._from)
        .map(e => e.payload.value);
      this.lastHash = result.slice(-1).pop().hash;
    }
    return output;
  }

  async deleteMessage() {
    console.log('delete message');
    var result = this.db
      .iterator({
        limit: -1,
        lte: this.lastHash,
      })
      .collect();

    if (result) {
      for (var i = 0; i < result.length; i++) {
        var hash = result[i].hash;
        await this.db.remove(hash);
      }
    }
    this.lastHash = undefined;
  }

  async add(value) {
    return await this.db.add(value);
  }

  ethAddressToHash(from, to) {
    const hash = crypto.createHash('sha256');
    const sorted = from > to ? from + to : to + from;
    hash.update(sorted);
    return hash.digest('hex');
  }
}

exports.binding = binding;
