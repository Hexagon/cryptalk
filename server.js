var express = require('express.io'),
    uuid = require('node-uuid');

app = express();app.http().io();

app.use(express.static(__dirname + '/public'));

app.io.route('room', {
    create: function(req) {
      var room = uuid.v4();
      req.socket.emit('message:server', 'Room ' + room + ' created');
      req.socket.emit('room:created',room);
    },
    join: function(req) {
      if(req.data) {
        req.socket.emit('room:joined',req.data);
        req.socket.join(req.data);
        req.socket.broadcast.to(req.data).emit('message:server', 'A person joined this room');
      }
    },
    leave: function(req) {
      if(req.data) {
        req.socket.emit('room:left');
        req.socket.leave(req.data);
        req.socket.broadcast.to(req.data).emit('message:server', 'A person left this room');
      }
    } 
});

app.io.route('message', {
    send: function(req) {
      if(req.data && req.data.room) req.socket.broadcast.to(req.data.room).emit('message:send', req.data.msg);
      req.socket.emit('message:send', req.data.msg);
    }
});

app.listen(8080, function(){
  console.log('listening on *:8080');
});