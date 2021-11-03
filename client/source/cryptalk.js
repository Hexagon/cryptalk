import mediator from './vendor/castrato.js';
import win from './window.js';
import notifications from './notifications.js';
import templates from './templates.js';
import settings from './settings.js';
import host from './host.js';
import client from './client.js';
import cons from './console.js';
import room from './room.js';
import sounds from './sounds.js';

// Inititalize modules
let wind = win(mediator);
cons(mediator, settings, templates,sounds);
notifications(mediator, settings, wind);
client(mediator, settings, templates);
host(mediator, settings, templates);
room(mediator, settings, templates);

// Mediate between modules
mediator
	.on('window:focused', function() {
		mediator.emit('audio:off');
		mediator.emit('notification:off');
	})

	.on('window:blurred',function() {
		mediator.emit('audio:on');
		mediator.emit('notification:on');
	})

	.on('command:mute', function () {
		mediator.emit('audio:mute');
	})

	.on('command:unmute', function () {
		mediator.emit('audio:unmute');
	})

	// Help console and host keep track of current states
	.on('room:changed', function(room) { 
		mediator
			.emit('console:param', {
				room: room
			})
			.emit('host:param', {
				room: room
			}); 
	})

	.on('nick:changed', function(nick) { 
		mediator.emit('console:param', {
			nick: nick
		}); 
	})

	.on('key:changed', function(key) { 
		mediator
			.emit('console:param', {
				key: key
			})
			.emit('host:param', {
				key: key
			});
	});

// Connect to the default host
mediator.emit('command:connect', undefined, function() {
	// Join room and set key if a hash in the format #Room:Key has been provided
	var hash = window.location.hash;
	if ( hash ) {
		var parts = hash.slice(1).split(':');

		if ( parts[0] ) {
			mediator.emit('command:join', parts[0]);
		}

		if ( parts[1] ) {
			mediator.emit('command:key', parts[1]);
		}
	}
});