require('shelljs/global');
var shell = require('shelljs');
var proxy = require('http-proxy-middleware');
var express = require('express');
var app = express();
var fs = require('fs');

var isRunIpfs = exec('ps -ef | grep ipfs | grep -v grep');
var isRunGeth = exec('ps -ef | grep geth | grep -v grep');

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
    exec(
      './geth --datadir ' +
        nodeDir +
        '/eth ' +
        '--rpc --rpcaddr 0.0.0.0 --ws --wsaddr 0.0.0.0 --wsorigins="*"  --rpccorsdomain "*"',
      function(err, stdout, stderr) {
        if (err) {
          console.log(err);
        }
      }
    );
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
