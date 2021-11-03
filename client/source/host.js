/*

	Accepts:
		mediator.on('command:host', host);
		mediator.on('command:connect', connect);
		mediator.on('command:disconnect', disconnect);
		mediator.on('command:reconnect', disconnect);

	Emits:
		mediator.on('socket:emit', emit); 

	eslint no-console: ["error", { allow: ["warn", "error"] }]
	
*/
import $ from './$.js';

export default function (mediator, settings, templates) {

	var 
		// Private properties
		socket,
		host = {
			host: '',
			connected: false
		},

		// Collection of parameters
		parameters = {},

		emit = function(payload) {
			// Route message from mediator to socket
			if(socket) socket.emit(payload.data,payload.payload);
		},

		hostInfo = function () {
			mediator.emit('info', JSON.stringify(host || {}));
		},

		connect = function (toHost, done) {

			mediator.emit('console:lockInput');

			if (host && host.connected) {
				mediator.emit('console:error', $.template(templates.messages.already_connected, {
					host: host.host
				}));
				mediator.emit('console:unlockInput');
				return;
			}
			
			// Push 'Connecting...' message
			mediator.emit('console:info', $.template(templates.messages.connecting, {host: host.host}));

			// Show motd (placed here to enable server specific motds in future)
			mediator.emit('console:motd', settings.motd);

			// The one  and only socket
			socket = $.io(host.host, {
				forceNew: true,
				'force new connection': true
			});

			// Bind socket events
			socket
				.on('room:joined', function () {

					mediator.emit('console:info', $.template(templates.messages.joined_room, { roomName: $.escapeHtml(parameters.room) } ));

					// Automatically count persons on join
					socket.emit('room:count');
				})
				.on('room:left', function () {
					mediator.emit('console:info', $.template(templates.messages.left_room, { roomName:  $.escapeHtml(parameters.room) } ));
					mediator.emit('room:changed',false);
				})

				.on('message:send', function (data) {
					var decrypted = $.AES.decrypt(data.msg, $.SHA1(parameters.room) + parameters.key),
						sanitized = $.escapeHtml(decrypted),
						nick = 		!data.nick ? templates.default_nick : $.escapeHtml($.AES.decrypt(data.nick, $.SHA1(parameters.room) + parameters.key));

					if (!decrypted) {
						mediator.emit('console:error', templates.messages.unable_to_decrypt);
					} else {
						mediator.emit('console:message', { message: sanitized, nick: nick } );
					}
				})

				.on('message:server', function (data) {
					if( data.msg ) {
						var sanitized = $.escapeHtml(data.msg);
						if( templates.server[sanitized] ) {
							if( data.payload !== undefined ) {
								var sanitized_payload = $.escapeHtml(data.payload);
								mediator.emit('console:server', $.template(templates.server[sanitized], { payload: sanitized_payload }));
							} else {
								mediator.emit('console:server', templates.server[sanitized]);
							}
						} else {
							mediator.emit('console:error', templates.server.bogus);
						}
					} else {
						mediator.emit('console:error', templates.server.bogus);
					}
				})

				.on('connect', function () {

					// Tell the user that the chat is ready to interact with
					mediator.emit('console:info', $.template(templates.messages.connected, {
						host: host.host
					}));

					// Set window title
					mediator.emit('window:title', settings.title);

					// Unlock input
					mediator.emit('console:unlockInput');

					done();

					host.connected = true;
				})

				.on('disconnect', function () {

					host.connected = false;

					// Tell the user that the chat is ready to interact with
					mediator.emit('console:info', $.template(templates.messages.disconnected, {
						host: host.host
					}));

					// Revert title
					mediator.emit('room:changed',undefined);
					mediator.emit('window:title',templates.client.title);
				})

				.on('connect_error', function () {

					host.connected = false;
					mediator.emit('console:error', templates.messages.socket_error);

					// Unlock input
					mediator.emit('console:unlockInput');
				});

			return;
		},

		reconnect = function (foo, done) {
			if (host) {
				if (host.connected) {
					disconnect();
					connect(host, done);
				} else {
					connect(host, done);
				}
			} else {
				done();
				return mediator.emit('console:error', templates.messages.reconnect_no_host);
			}
		},

		disconnect = function () {
			socket.disconnect();
		},

		param = function (p) {
			parameters = Object.assign({}, parameters, p );
		};

	mediator.on('command:host', hostInfo);
	mediator.on('command:connect', connect);
	mediator.on('command:disconnect', disconnect);
	mediator.on('command:reconnect', reconnect);

	mediator.on('socket:emit', emit);
	mediator.on('host:param', param);
}