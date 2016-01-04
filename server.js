#!/usr/bin/env node
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    port = process.env.PORT || 8080;

server.listen(port, function(){
  console.log('listening on *:'+port);
});

// Serve /public/* as /
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {

  socket.on('room:join', function(req) {
      if( req ) {
        socket.emit('room:joined',req);
        socket.join(req);
        socket.broadcast.to(req).emit('message:server', {msg:'person_joined'} );
        socket.current_room = req;
      } else {
        socket.emit('message:server', {msg:'command_failed'} );
      }
  });

  socket.on('room:leave', function(req) {
        if( req ) {
          socket.emit('room:left');
          socket.leave(req);
          socket.broadcast.to(req).emit('message:server', {msg:'person_left'} );
          socket.current_room = undefined;
        } else {
          socket.emit('message:server', {msg:'command_failed'} );
        }
  });

  socket.on('room:count', function (req) {
        if( socket.current_room !== undefined ) {
          var clientsList = io.sockets.adapter.rooms[socket.current_room];
          socket.emit('message:server', {msg:'person_count', payload: Object.keys(clientsList).length } );
        } else {
          socket.emit('message:server', {msg:'command_failed'} );
        }
  });

  socket.on('message:send', function(req) {

        // Check that the user is in a room
        if(req && req.room) {

          // Check that the message size is within bounds
          var total_msg_size = (req.msg) ? req.msg.length : 0 + (req.nick) ? req.nick.length : 0;
          if( total_msg_size <= 4096) {

            // Check that at least 100ms has passed since last message
            if( socket.last_message === undefined || new Date().getTime() - socket.last_message > 100 ) {

              socket.broadcast.to(req.room).emit('message:send', { msg: req.msg, nick: req.nick} );
              socket.emit('message:send', { msg: req.msg, nick: req.nick} );

              socket.last_message = new Date().getTime();

            } else {

              // Do not complain if message rate is too fast, that would only generate more traffic

            }

          } else {

            // Message size is out of bounds, complain
            socket.emit('message:server', {msg:'command_failed'} );
          }

        } 

  });

 socket.on('disconnect', function() {
    // Notify other users of the room
    if( socket.current_room !== undefined ) {
      socket.broadcast.to(socket.current_room).emit('message:server', {msg:'person_left'} );
    }
  });

});
