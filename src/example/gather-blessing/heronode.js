
var express = require('express');
var http = require('http');
var fs = require('fs');
var app = express();
var server = http.createServer(app);
var proxy = require('express-http-proxy');

app.use('/', express.static('../../', {
  maxAge: 0,
}));

var sockets = [];
var paths = ['./','./app'];
for (var i = 0; i < paths.length; i++) {
  var path = paths[i];
  fs.watch(path, (eventType, filename) => {
    for (var i = 0; i < sockets.length; i++) {
      var socket = sockets[i];
      socket.emit('message',{command:'refresh'});
    };
  });
};

var socketProcess = function(socket){
  sockets.push(socket);
  socket.on('message', function(obj){
    console.log(obj);
  });
  socket.on('disconnect', function(){
  });
};
var io = require('socket.io')(server);
io.on('connection',socketProcess);
server.listen(3000);
console.log('service at http://127.0.0.1:3000/example/gather-blessing/');



