/*

	Accepts:
		mediator.on('command:host', host);
		mediator.on('command:hosts', hosts);
		mediator.on('command:connect', connect);
		mediator.on('command:disconnect', disconnect);
		mediator.on('command:reconnect', disconnect);

	Emits:
		mediator.on('socket:emit', emit); 
*/
define(
	{
		compiles: ['$'],
		requires: ['fandango','castrato','settings','templates','hosts','window']
	}, function ($, requires, data) { 

	var 

		// Private properties
		socket,
		host,

		// Require shortcuts
		fandango = requires.fandango,
		mediator = requires.castrato,
		settings = requires.settings,
		templates = requires.templates,
		hostconfig = requires.hosts,

		// Collection of parameters
		parameters = {},

		emit = function(payload) {
			// Route message from mediator to socket
			if(socket) socket.emit(payload.data,payload.payload);
		},

		host = function () {
			mediator.emit('info', JSON.stringify(host || {}));
		},

		hosts = function (force, done) {

			var i = 0,
				left = hostconfig.hosts.length,
				host,
				strhosts = '\n',
				callback = function (host, index, isUp) {
					return function (hostSettings) {
						host.settings = (isUp ? hostSettings : 0);

						strhosts += $.template(templates.messages[(isUp ? 'host_available' : 'host_unavailable')], {
							name: host.name,
							path: host.path,
							index: index
						});

						if (--left === 0) {
							mediator.emit('console:info', strhosts);
							done();
						}
					};
				};
			
			force = (force && force.toLowerCase() === 'force');

			// Loop through all the hosts
			while ((host = hostconfig.hosts[i])) {
				if (!force && host.settings !== undefined) {
					if (host.settings) {
						callback(host, i, 1)();
					} else {
						callback(host, i, 0)();
					}
				} else {
					require([host.path], callback(host, i, 1), callback(host, i, 0));
				}

				i++;
			}
		},

		connect = function (toHost, done) {

			mediator.emit('console:lockInput');

			var 
				request,

				// Use hostconfig.autoconnect as default host
				toHost = (toHost == undefined) ? hostconfig.autoconnect : toHost;

			if (host && host.connected) {
				mediator.emit('console:error', $.template(templates.messages.already_connected, {
					host: host.name || 'localhost'
				}));
				mediator.emit('console:unlockInput');
				return;
			}

			if ($.isDigits(toHost)) {
				if ((host = hostconfig.hosts[+toHost])) {
					if (host.settings) {
						settings = host.settings;
					} else {
						request = host.path;
					}
				} else {
					mediator.emit('console:error', 'Undefined host index: ' + toHost);
					mediator.emit('console:unlockInput');
					return;
				}

			} else if (fandango.is(toHost, 'untyped')) {
				settings = toHost.settings;
			} else { // Assume string
				request = toHost.settings;
			}

			if (request) {
				return require([request], function (settings) {
					host.settings = settings;
					return connect(toHost, done);
				}, function () {
					mediator.emit('console:error', 'Could not fetch host settings: ' + request);
					mediator.emit('console:unlockInput');
					return;
				});
			}

			// Push 'Connecting...' message
			mediator.emit('console:info', $.template(templates.messages.connecting, {host: host.name || 'localhost'}));

			// Show motd (placed here to enable server specific motds in future)
			mediator.emit('console:motd', host.settings.motd);

			// The one  and only socket
			socket = $.io(host.host, {
				forceNew: true,
				'force new connection': true
			});

			// Bind socket events
			socket
				.on('room:joined', function (data) {

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
						host: host.name || 'localhost'
					}));

					// Set window title
					mediator.emit('window:title', host.settings.title);

					// Unlock input
					mediator.emit('console:unlockInput');

					done();

					host.connected = 1;
				})

				.on('disconnect', function () {

					room = 0;
					key = 0;
					host.connected = 0;

					// Tell the user that the chat is ready to interact with
					mediator.emit('console:info', $.template(templates.messages.disconnected, {
						host: host.name || 'localhost'
					}));

					// Revert title
					mediator.emit('room:changed',undefined);
					mediator.emit('window:title',templates.client.title);
				})

				.on('connect_error', function () {

					room = 0;
					key = 0;
					host.connected = 0;
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
			parameters = fandango.merge({}, parameters, p );
		};
	
	mediator.on('command:host', host);
	mediator.on('command:hosts', hosts);
	mediator.on('command:connect', connect);
	mediator.on('command:disconnect', disconnect);
	mediator.on('command:reconnect', disconnect);

	mediator.on('socket:emit', emit);
	mediator.on('host:param', param);
});