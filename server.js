var express = require('express.io'),
    uuid = require('node-uuid');

app = express();app.http().io();

app.use(express.static(__dirname + '/public'));

app.io.route('room', {
    generate: function(req) {
      var room = uuid.v4();
      req.socket.emit('message:server', 'Room ' + room + ' generated');
      req.socket.emit('room:generated',room);
    },
    join: function(req) {
      if(req.data) {
        req.socket.emit('room:joined',req.data);
        req.socket.join(req.data);
        req.socket.broadcast.to(req.data).emit('message:server', 'A person joined this room');
        req.socket.current_room = req.data;
      }
    },
    leave: function(req) {
      if(req.data) {
        req.socket.emit('room:left');
        req.socket.leave(req.data);
        req.socket.broadcast.to(req.data).emit('message:server', 'A person left this room');
        req.socket.current_room = undefined;
      }
    } 
});

app.io.route('message', {
    send: function(req) {
      if(req.data && req.data.room) req.socket.broadcast.to(req.data.room).emit('message:send', { msg: req.data.msg, nick: req.data.nick} );
      req.socket.emit('message:send', { msg: req.data.msg, nick: req.data.nick} );
    }
});

app.io.sockets.on('connection', function(socket) {
   socket.on('disconnect', function() {
      // Notify other users of the room
      if( socket.current_room !== undefined ) {
        socket.broadcast.to(socket.current_room).emit('message:server', 'A person left this room');
        console.log('Person left' + socket.current_room);
      }
   });
});

app.listen(8080, function(){
  console.log('listening on *:8080');
});