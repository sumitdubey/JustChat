var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1' 

var sockets = [];
var userList = [];
var count = 0;

app.use(express.static(__dirname))
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
   sockets.push(socket);
   
  socket.on('new user', function(userName){
    userList.push(userName);
	console.log("new user: ",userName);
	console.log("total users: ",userList);
    io.emit('user list', userList);
  });
  
  socket.on('chat message', function(payload){
    console.log("chat message: ",payload)
	payload["count"] = ++count;
    io.emit('chat message', payload);
  });
  socket.on('disconnect', function(){
	  var index = sockets.indexOf(socket);
	  sockets.splice(index, 1);
	  console.log("user disconnected: ",userList[index])
	  console.log("index: ",index)
	  userList.splice(index, 1);
	  io.emit('user list', userList);
  });
});

server.listen(server_port, server_ip_address, function(){
  console.log('listening on *:8080');
});
