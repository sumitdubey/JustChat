var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var userList = [];
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('new user', function(userName){
    userList.push(userName);
    io.emit('user list', userList);
  });
  
  socket.on('chat message', function(payload){
    //payload = JSON.parse(payload);
    io.emit('chat message', msg);
  });
});

http.listen(server_port, server_ip_address, function(){
  console.log('listening on *:8080');
});
