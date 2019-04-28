var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var app = express();
var server = http.createServer(app);

let options = {
  cert: fs.readFileSync('./cert/certificate.crt'),
  ca: fs.readFileSync('./cert/ca_bundle.crt'),
  key: fs.readFileSync('./cert/private.key'),
};

var serverHTTPS = https.createServer(options, app);

app.use(
  '/',
  express.static('./hero-home/', {
    maxAge: 0,
  })
);
server.listen(80);
serverHTTPS.listen(443);
