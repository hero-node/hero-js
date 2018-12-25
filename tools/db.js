const OrbitDB = require('orbit-db');
const crypto = require('crypto');
const path = require('path');

var ipfs = IpfsApi('127.0.0.1', '5001');
var orbitdb = new OrbitDB(ipfs);

var dbconnections = [];

async function bind(socket, msg) {
  var from = msg.from;
  var to = msg.to;
  var db = new DB(ipfs, orbitdb, from, to);
  await db.load();

  if (msg.req === 'subscribe') {
    db.subscribe(payload => {
      socket.emit('heroChatSubscribeResponse', payload);
    });
  } else if (msg.req === 'post') {
    var payload = msg.payload;
    var pub = msg.pub;
    var encrypted = msg.encrypted;
    var hash = await db.add({
      from: from,
      to: to,
      payload: payload,
      pub: pub,
      encrypted: encrypted,
    });
    socket.emit('heroChatPostResponse', hash);
  }

  socket.on('disconnection', () => {
    var index = dbconnections.indexOf(db.db);
    if (index > 1) {
      dbconnections.splice(index, 1);
    }
  });
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
        this.db = conn;
        isExist = true;
        break;
      }
    }

    if (!isExist) {
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

  subscribe(cb) {
    this.db.events.on('write', async (dbname, hash, entry) => {
      var payload = this.getMessage(this._to);
      cb(payload);
    });

    this.db.events.on('replicated', async address => {
      var payload = this.getMessage(this._to);
      cb(payload);
    });
  }

  async getMessage(to) {
    var result = this.db
      .iterator({
        limit: -1,
        gt: this.lastHash,
      })
      .collect();
    let output;
    if (result.length > 0) {
      output = result
        .filter(e => e.payload.value.to === to)
        .map(e => e.payload.value);
      this.lastHash = result.slice(-1).pop().hash;
    }
    return output;
  }

  async deleteMessage(to, lastHash) {}

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

module.exports = bind;
