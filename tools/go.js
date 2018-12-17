require('shelljs/global');
var proxy = require('http-proxy-middleware');
var express = require('express');
var app = express();

var isRunIpfs = exec('ps -ef | grep ipfs | grep -v grep');
var isRunGeth = exec('ps -ef | grep geth | grep -v grep');

function go() {
  // 启动ipfs
  if (isRunIpfs.toString().indexOf('ipfs daemon') === -1) {
    console.log('start ipfs');
    exec('ipfs daemon', (err, stdout, stderr) => {
      console.log(stdout);
      if (err) {
        console.log(err);
      }
    });
  } else {
    console.log('ipfs is started');
  }
  // 启动geth
  // if (isRunGeth.toString().indexOf('geth') === -1) {
  //   console.log('start geth');
  //   cd('./').exec('geth',function (err, stdout, stderr){
  //   	if(err) {
  //   		console.log(err);
  //   	}
  //   });
  // } else {
  // 	console.log('geth is started');
  // }
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

module.exports = {
  go,
  ipfsProxy,
  eth,
};
