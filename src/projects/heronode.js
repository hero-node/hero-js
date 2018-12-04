var express = require('express');
var http = require('http');
var fs = require('fs');
var app = express();
var server = http.createServer(app);
var proxy = require('express-http-proxy');
var serveIndex = require('serve-index');
var chokidar = require('chokidar');
var siofu = require('socketio-file-upload');

app.use(siofu.router);
app.use(
  '/',
  express.static('../../', {
    maxAge: 0,
  })
);
app.use('/', express.static('../'), serveIndex('../', { icons: true }));

var sockets = [];
var paths = ['./'];

var watcher = chokidar.watch('./', { ignored: /^\./, persistent: true });
var sendRefresh = function(path) {
  for (var i = 0; i < sockets.length; i++) {
    var socket = sockets[i];
    socket.emit('message', { command: 'refresh' });
  }
};
watcher
  .on('add', sendRefresh)
  .on('change', sendRefresh)
  .on('unlink', sendRefresh)
  .on('error', sendRefresh);

var socketProcess = function(socket) {
  sockets.push(socket);
  socket.on('message', function(obj) {
    console.log(obj);
  });
  socket.on('disconnect', function() {});
  var uploader = new siofu();
  uploader.dir = './uploads';
  uploader.listen(socket);
};
var io = require('socket.io')(server);
io.on('connection', socketProcess);
server.listen(3000);
console.log('service at http://127.0.0.1:3000/projects/');
