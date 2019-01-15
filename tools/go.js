require('shelljs/global');
var shell = require('shelljs');
var proxy = require('http-proxy-middleware');
var express = require('express');
var app = express();
var fs = require('fs');

var isRunIpfs = exec("ps -ef |grep ipfs |awk '{print $2}'");
var isRunGeth = exec('ps -ef | grep geth | grep -v grep');

var standalone = shell.env['HERO_STANDALONE'];
var rootNodeEth =
  'enode://564b8969007d932b6781d946705eb1e882198af3403ce8c4a88f636666b7f8aa2e3d5707b4df70cf362ced8a5804f030011b970b8ba8c7ff54714ae163bbe26f@47.52.172.254:30303?discport=0';
var rootNodeIpfs =
  '/ip4/47.52.172.254/tcp/4001/ipfs/QmXKHZVkkcZ4Nh1ZNcygEnJgqPgkEUeiQSR9rCUbve7uYx';

function go() {
  cd('../../tools');
  var nodeDir = '../node';
  shell.env['IPFS_PATH'] = nodeDir + '/ipfs';
  // init env
  if (!fsExists(nodeDir)) {
    console.log('init env...');
    exec('mkdir ' + nodeDir);
    exec('mkdir ' + nodeDir + '/eth');
    exec('mkdir ' + nodeDir + '/ipfs');

    exec('./ipfs init');

    exec('./geth --datadir ' + nodeDir + '/eth init ./HeroEth.json');
  }

  // 启动ipfs
  if (true) {
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
