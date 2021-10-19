#!/usr/bin/env node

const
	handler = require('serve-handler'),
	port = process.env.PORT || 8080,
	path = require('path');

let
	server,
	io;

// Create http server, handle files.assets
server = require('http').createServer(function (req, res) {
	return handler(req, res, {
		public: path.resolve(__dirname, 'public')
	});
});

// Append socket.io to http server
io = require('socket.io')(server),

// Listen to port env:PORT or 8080
server.listen(port, function(){
	console.log('listening on *:' + port); // eslint-disable-line no-console
});

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

	socket.on('room:count', function () {
		if( socket.current_room !== undefined ) {
			let clientsInRoom = 0;
			if( io.sockets.adapter.rooms.has(socket.current_room) ) {
				clientsInRoom = io.sockets.adapter.rooms.get(socket.current_room).size;
			} 
			if( clientsInRoom > 1) {
				socket.emit('message:server', {msg:'person_count', payload: clientsInRoom } );
			} else {
				socket.emit('message:server', {msg:'person_single'} );
			}
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
