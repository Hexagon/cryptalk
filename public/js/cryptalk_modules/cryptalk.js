// Main cryptalk module
define({
	compiles: ['$'],
	requires: ['hosts', 'templates', 'sound', 'fandango','notifications']
}, function ($, requires, data) {
	var socket,
		key,
		host,
		room,
		hash,
		nick,
		mute,

		settings = {},

		history = [],
		history_pos = -1,
		history_keep = 4,
		history_timer,

		// Collection of DOM components
		components = {
			chat: 	$('#chat'),
			input: 	$('#input'),
			inputWrapper: $('#input_wrapper')
		},

		// Shortcut
		hosts = requires.hosts.hosts,
		fandango = requires.fandango,
		templates = requires.templates,
		sound = requires.sound,
		notifications = requires.notifications,

		lockInput = function () {
			components.input[0].setAttribute('disabled', 'disabled');
			components.inputWrapper[0].className = 'loading';
		},

		unlockInput = function () {
			components.input[0].removeAttribute('disabled');
			components.inputWrapper[0].className = '';
			components.input.focus();
		},

		showNotification = function (type, nick, text) {
			if (!mute) {
				if ( type == 'message') {
					notifications.notify(nick.substring(0, 20), text.substring(0, 80),'gfx/icon_128x128.png',true);
				} else if ( type == 'error' ) {
					notifications.notify('Cryptalk', text.substring(0, 80),'gfx/icon_128x128_error.png',true);
				} else {
					notifications.notify('Cryptalk', text.substring(0, 80),'gfx/icon_128x128_info.png',true);
				}
				
			}
		},

		// Adds a new message to the DOM
		post = function (type, text, clearChat, clearBuffer, nick) {

			var tpl = templates.post[type],
				post,
				data = fandango.merge({}, settings, {
					nick: nick,
					room: room,
					mute: mute
				});

			data.text = $.template(text, data);
			post = $.template(tpl, data);

			// Always clear the input after a post
			if (clearBuffer) {
				clearInput();
			}

			showNotification(type, nick, text)


			// Append the post to the chat DOM element
			components.chat[clearChat ? 'html' : 'append'](post);
		},

		// Chat related commands
		commands = {
			help: function (payload, done) {
				post('motd', templates.help);
				done();
			},

			hosts: function (force, done) {
				var i = 0,
					left = hosts.length,
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

							if (!--left) {
								post('info', strhosts);
								done();
							}
						}
					};

				// 
				force = (force && force.toLowerCase() === 'force');

				// Loop through all the hosts
				while (host = hosts[i]) {
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

			connect: function (toHost, done) {
				var request;

				if (host && host.connected) {
					done();
					return post('error', $.template(templates.messages.already_connected, {
						host: host.name || 'localhost'
					}));
				}

				if ($.isDigits(toHost)) {
					if (host = hosts[+toHost]) {
						if (host.settings) {
							settings = host.settings;
						} else {
							request = host.path;
						}
					} else {
						return post('error', 'Undefined host index: ' + toHost);
					}
				} else if (fandango.is(toHost, 'untyped')) {
					settings = toHost.settings;
				} else { // Assume string
					request = toHost;
				}

				if (request) {
					return require([request], function (settings) {
						host.settings = settings;
						commands.connect(toHost, done);
					}, function () {
						return post('error', 'Could not fetch host settings: ' + request);
					});
				}

				// Push 'Connecting...' message
				post('info', $.template(templates.messages.connecting, {
					host: host.name || 'localhost'
				}));

				// The one  and only socket
				socket = $.Websocket.connect(host.host, {
					forceNew: true,
					'force new connection': true
				});

				// Bind socket events
				socket
					.on('room:generated', function (data) {
						var sanitized = $.escapeHtml(data);
						post('server', $.template(templates.server.room_generated, { payload: sanitized }));
						socket.emit('room:join', sanitized);
					})

					.on('room:joined', function (data) {
						room = data;
						post('info', $.template(templates.messages.joined_room, { roomName: room }));

						// Automatically count persons on join
						socket.emit('room:count');
					})

					.on('room:left', function () {
						post('info', $.template(templates.messages.left_room, { roomName: room }));

						// Clear history on leaving room
						clearHistory();

						room = false;
					})

					.on('message:send', function (data) {
						var decrypted = $.AES.decrypt(data.msg, room + key),
							sanitized = $.escapeHtml(decrypted),
							nick = 		(data.nick == undefined || !data.nick ) ? templates.default_nick : $.escapeHtml($.AES.decrypt(data.nick, room + key));

						if (!decrypted) {
							post('error', templates.messages.unable_to_decrypt);
						} else {
							post('message', sanitized, false, false, nick);
							//if( !mute && !notifications.windowActive()) sound.playTones(sound.messages.message);
						}
					})

					.on('message:server', function (data) {
						if( data.msg ) {
							var sanitized = $.escapeHtml(data.msg);
							if( templates.server[sanitized] ) {
								if( data.payload !== undefined ) {
									var sanitized_payload = $.escapeHtml(data.payload);
									post('server', $.template(templates.server[sanitized], { payload: sanitized_payload }));
								} else {
									post('server', templates.server[sanitized]);
								}

								// Play sound
								//if (sound.messages[sanitized] !== undefined && !mute && !notifications.windowActive() ) sound.playTones(sound.messages[sanitized]);

							} else {
								post('error', templates.server.bogus);
							}
						} else {
							post('error', templates.server.bogus);
						}
					})

					.on('connect', function () {
						// Tell the user that the chat is ready to interact with
						post('info', $.template(templates.messages.connected, {
							host: host.name || 'localhost'
						}));

						host.connected = 1;

						done();
					})

					.on('disconnect', function () {
						room = 0;
						key = 0;
						host.connected = 0;

						// Tell the user that the chat is ready to interact with
						post('info', $.template(templates.messages.disconnected, {
							host: host.name || 'localhost'
						}));
					})

					.on('error', function () {
						room = 0;
						key = 0;
						host.connected = 0;
						post('error', templates.messages.socket_error);
						done();
					});
			},

			reconnect: function (foo, done) {
				if (host) {
					if (host.connected) {
						commands.disconnect()
						commands.connect(host, done);
					} else {
						commands.connect(host, done);
					}
				} else {
					done();
					return post('error', templates.messages.reconnect_no_host);
				}
			},

			disconnect: function () {
				socket.disconnect();
			},

			clear: function () {
				components.chat.html('');
				
				// Clear command history on clearing buffer
				clearHistory();
			},

			leave: function () {
				if (room) {
					socket.emit('room:leave', room);
				} else {
					post('error', templates.messages.leave_from_nowhere);
				}
			},

			count: function () {
				if (room) {
					socket.emit('room:count');
				} else {
					post('error', templates.messages.not_in_room);
				}
			},

			key: function (payload) {
				if (!host) {
					return post('error', templates.messages.key_no_host);
				}

				// Make sure the key meets the length requirements
				if (payload.length > settings.key_maxLen) {
					return post('error', templates.messages.key_to_long);
				} else if (payload.length < settings.key_minLen) {
					return post('error', templates.messages.key_to_short);
				}

				// Set key
				key = payload;

				// Inform that the key has been set
				post('info', (room ? templates.messages.key_ok_ready : templates.messages.key_ok_but_no_room));
			},

			nick: function (payload) {
				// Make sure the key meets the length requirements
				if (payload.length > settings.nick_maxLen) {
					return post('error', templates.messages.nick_to_long);
				} else if (payload.length < settings.nick_minLen) {
					return post('error', templates.messages.nick_to_short);
				}

				// Set nick
				nick = payload;

				// Inform that the key has been set
				post('info', $.template(templates.messages.nick_set, { nick: nick}));
			},

			mute: function () {
				// Invert mute
				mute = !mute;

				// Inform that the key has been set
				post('info', $.template(templates.messages[mute ? 'muted' : 'unmuted']));
			},

			join: function (payload) {
				if (!host) {
					return post('error', templates.messages.join_no_host);
				}

				return (
					room
						? post('error', templates.messages.already_in_room)
						: socket.emit('room:join', payload)
				);
			},

			generate: function (payload) {
				return (
					room
						? post('error', templates.messages.already_in_room)
						: socket.emit('room:generate')
				);
			}
		},

		// Push input buffer to history
		pushHistory = function (b) {
			history.push(b); 

			// Shift oldest buffer if we have more than we should keep
			if (history.length > history_keep) {
				history.shift();
			}
		},

		// Clear input buffer history
		clearHistory = function() {
			history = [];
			history_pos = -1;
		},

		// Clear input buffer
		clearInput = function() {
			fandango.subordinate(function () {
				components.input[0].value = '';
			});
		},
					
		// Handler for the document`s keyDown-event.
		onKeyDown = function (e) {
			var buffer,
				parts,
				payload,
				command,
				save;

			// The Document object is bound to this element.
			// If the active element is not the input, focus on it and exit the function.
			// Ignore this when ctrl and/or alt is pressed!
			if (!e.ctrlKey && !e.altKey && components.input[0] !== $.activeElement()) {
				return components.input.focus();
			}

			// Reset command history clear timer
			clearTimeout(history_timer);
			history_timer = setTimeout(clearHistory, 60000);

			// Check for escape key, this does nothing but clear the input buffer and reset history position
			if (e.keyCode == 27) {
				history_pos = -1;
				clearInput();

				return;
			} 

			// Check for up or down-keys, they handle the history position
			if (e.keyCode == 38 || e.keyCode == 40) {

				if 	(e.keyCode == 38 ) { history_pos = (history_pos > history.length - 2) ? -1 : history_pos = history_pos + 1; } 
				else { history_pos = (history_pos <= 0) ? -1 : history_pos = history_pos - 1; }

				var input = components.input[0];
				input.value = (history_pos == -1) ? '' : history[history.length-1-history_pos];

				// Wierd hack to move caret to end of input-box
				setTimeout(function() {if(input.setSelectionRange) input.setSelectionRange(input.value.length, input.value.length);}, 0);

	            return;
	        }
			
			// Return immediatly if the buffer is empty or if the hit key was not <enter>
			if (e.keyCode !== 13 || !(buffer = components.input[0].value)) {
				return;
			}

			// Reset current history position to 0 (last command)
			history_pos = -1;

			// Handle command
			if (buffer[0] === '/') {
				parts = $.ssplit(buffer.slice(1), ' ');
				command = parts[0];
				payload = parts[1];

				// Check that there is an handler for this command
				if (!commands[command]) {
					pushHistory(buffer);
					return post('error', $.template(templates.messages.unrecognized_command, { commandName: command }));
				}

				// Some commands are asynchrounous;
				// If the command expects more than one argument, the second argument is a callback that is called when the command is done.
				if (commands[command].length > 1) {
					// Lock the input from further interaction
					lockInput();

					// Execute command handler with callback function.
					commands[command](payload, unlockInput);
				} else {
					// Execute normally.
					commands[command](payload);
				}

				// Clear input field
				clearInput();

				// Save to history
				if(command !== 'key') {
					pushHistory(buffer);
				}

			} else /* Handle ordinary message */ {

				if (!room || !key) {
					// Push buffer to history and clear input field
					pushHistory(buffer); clearInput();

					// Make sure that the user has joined a room and the key is set
					return (!room) ? post('error', templates.messages.msg_no_room) : post('error', templates.messages.msg_no_key);
				}

				// Before sending the message.
				// Encrypt message using room UUID as salt and key as pepper.
				socket.emit('message:send', {
					room: room,
					msg: $.AES.encrypt(buffer, room + key).toString(),
					nick: (nick && nick != undefined) ? $.AES.encrypt(nick, room + key).toString() : false
				});

				// And clear the the buffer
				clearInput();

				// Save to history
				pushHistory(buffer);
			}
		};

	// Bind the necessary DOM events
	$(document).on('keydown', onKeyDown);

	// Put focus on the message input
	components.input.focus();

	// Post the help/welcome message
	post('motd', templates.motd, true);

	unlockInput();

	notifications.enableNative();

	// It's possible to provide room and key using the hashtag.
	// The room and key is then seperated by semicolon (room:key).
	// If there is no semicolon present, the complete hash will be treated as the room name and the key has to be set manually.
	commands.connect(0, function() {
		if (host && (hash = window.location.hash)) {
			parts = hash.slice(1).split(':');

			parts[0] && commands.join(parts[0]);
			parts[1] && commands.key(parts[1]);
		}	
	});

});