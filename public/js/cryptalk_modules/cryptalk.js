// Main cryptalk module
define({
	compiles: ['$'],
	requires: ['castrato','console','host','client']
}, function ($, requires, data) {

	// Require shortcut
	var mediator = requires.castrato;

	// Route mediator messages
	mediator.on('window:focused',function() {
		mediator.emit('audio:off');
		mediator.emit('notification:off');
	});

	mediator.on('window:blurred',function() {
		mediator.emit('audio:on');
		mediator.emit('notification:on');
	});

	mediator.on('command:mute', function () { mediator.emit('audio:mute'); } );
	mediator.on('command:unmute', function () { mediator.emit('audio:unmute'); } );

	// Help console and host keep track of current states
	mediator.on('room:changed', function(room) { 
		mediator.emit('console:param',{ room: room});
		mediator.emit('host:param',{ room: room}); 
	});
	mediator.on('nick:changed', function(nick) { 
		mediator.emit('console:param',{ nick: nick}); 
	});
	mediator.on('key:changed', function(key) { 
		mediator.emit('console:param',{ key: key}); 
		mediator.emit('host:param',{ key: key}); 
		
	});

	// Connect to the default host
	mediator.emit('command:connect', undefined, function() {
		// Join room and set key if a hash in the format #Room:Key has been provided
		if (hash = window.location.hash) {
			parts = hash.slice(1).split(':');

			parts[0] && mediator.emit('command:join',parts[0]);
			parts[1] && mediator.emit('command:key',parts[1]);
		}
	});

});