var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var app = express();
var server = http.createServer(app);
var options = {
  key: fs.readFileSync('./cert/key'),
  cert: fs.readFileSync('./cert/cert'),
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
