var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '10.120.57.18'
var userList = [];
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('new user', function(userName){
    userList.push(userName);
	console.log("new user: ",userName);
	console.log("total users: ",userList);
    io.emit('user list', userList);
  });
  
  socket.on('chat message', function(payload){
    console.log("chat message: ",payload)
    io.emit('chat message', payload);
  });
  socket.on('disconnect', function(data){
	  console.log("user disconnected: ",data)
  });
});

http.listen(server_port, server_ip_address, function(){
  console.log('listening on *:8080');
});
