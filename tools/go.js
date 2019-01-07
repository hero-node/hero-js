require('shelljs/global');
var shell = require('shelljs');
var proxy = require('http-proxy-middleware');
var express = require('express');
var app = express();
var fs = require('fs');

var isRunIpfs = exec('ps -ef | grep ipfs | grep -v grep');
var isRunGeth = exec('ps -ef | grep geth | grep -v grep');

var standalone = shell.env['HERO_STANDALONE'];
var rootNodeEth =
  // 'enode://e3dd0392a2971c4b0c4c43a01cd682e19f31aaa573c43a9b227685af7ffed5070217392ae5ada278968d5c4bfddd9c93547bcf4592852196a8facbcdad64d257@172.16.1.99:30301?discport=0';
  'enode://d947393cce56b57c1735996185b89ec464c98fac1f8ec099fd2b33558bc36af951179a3f7026b0892e0193f6f7bab92f6a856bb120939630704c08b4a9ccb737@47.52.172.254:40303?discport=0';
var rootNodeIpfs =
  '/ip4/47.52.172.254/tcp/14001/ipfs/QmV7sgbQeJfq2UAWKnCbAGLBg5cT6AFFkBN7KZ6BV2q8yJ';
function go() {
  cd('../../tools');
  var nodeDir = '../node';

  // init env
  if (!fsExists(nodeDir)) {
    console.log('init env...');
    exec('mkdir ' + nodeDir);
    exec('mkdir ' + nodeDir + '/eth');
    exec('mkdir ' + nodeDir + '/ipfs');
    shell.env['IPFS_PATH'] = nodeDir + '/ipfs';
    exec('./ipfs init');

    exec('./geth --datadir ' + nodeDir + '/eth init ./HeroEth.json');
  }

  // 启动ipfs
  if (isRunIpfs.toString().indexOf('ipfs daemon') === -1) {
    console.log('start ipfs');

    exec(
      './ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin \'["*"]\''
    );

    exec('./ipfs config --json Bootstrap []');

    if (!standalone) {
      exec('./ipfs bootstrap add ' + rootNodeIpfs);
    }
    exec('./ipfs daemon --enable-namesys-pubsub', (err, stdout, stderr) => {
      console.log(stdout);
      if (err) {
        console.log(err);
      }
    });
  } else {
    console.log('ipfs is started');
  }

  // 启动geth
  if (isRunGeth.toString().indexOf('geth') === -1) {
    console.log('start geth');
    var ethExec =
      './geth --datadir ' +
      nodeDir +
      '/eth ' +
      '--rpc --rpcaddr 0.0.0.0 --ws --wsaddr 0.0.0.0 --wsorigins="*"  --rpccorsdomain "*"';
    if (standalone) {
      ethExec =
        './geth --datadir ' +
        nodeDir +
        '/eth ' +
        '--rpc --rpcaddr 0.0.0.0 --ws --wsaddr 0.0.0.0 --wsorigins="*"  --rpccorsdomain "*" --nodiscover';
    } else {
      exec('cp ./static-nodes.json ' + nodeDir + '/eth/geth/');
    }
    exec(ethExec, function(err, stdout, stderr) {
      if (err) {
        console.log(err);
      }
    });
  } else {
    console.log('geth is started');
  }
  cd('..');
}

var ipfsProxy = proxy('/ipfs', {
  target: 'http://localhost:8080',
  changeOrigin: true,
});

// start geth
function eth(req, res, next) {
  var options = {
    url: 'http://localhost:8545',
    method: req.method,
  };
  if (req.method === 'POST') {
    options.body = JSON.stringify(req.body);
  }
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', '*');
      res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type');
      res.send(body);
      res.end();
    } else {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', '*');
      res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type');
      res.send(error);
      res.end();
    }
  });
}

function fsExists(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = {
  go,
  ipfsProxy,
  eth,
};
