// Main cryptalk module
define({
	data: {
		// If no host is given it will default to localhost.
		host: ''
	},
	compiles: ['$'],
	requires: ['templates', 'sound', 'fandango']
}, function ($, requires, data) {
	var socket,
		key,
		room,
		hash,
		nick,

		mute = false,

		history = [],
		history_pos = -1,
		history_keep = 4,
		history_timer,

		// Collection of DOM components
		components = {
			chat: 	$('#chat'),
			input: 	$('#input')
		},

		// Shortcut
		fandango = requires.fandango;
		templates = requires.templates;
		sound = requires.sound;

		// Adds a new message to the DOM
		post = function (type, text, clearChat, clearBuffer, nick) {
			var tpl = templates.post[type],
				post = $.template(tpl, text && {
					text: text,
					nick: nick
				});

			// Always clear the input after a post
			if (clearBuffer) {
				clearInput();
			}

			// Append the post to the chat DOM element
			components.chat[clearChat ? 'html' : 'append'](post);
		},

		// Chat related commands
		commands = {
			help: function () {
				post('motd', templates.help);
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
				// Make sure the key meets the length requirements
				if (payload.length < 8) {
					return post('error', templates.messages.key_weak);
				}

				// Set key
				key = payload;

				// Inform that the key has been set
				post('info', (room ? templates.messages.key_ok_ready : templates.messages.key_ok_but_no_room));
			},

			nick: function (payload) {
				// Make sure the nick meets the length requirements
				if (payload.length < 2) {
					return post('error', templates.messages.nick_short);
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
				return (
					room
						? post('error', $.template(templates.messages.already_in_room, { roomName: room}))
						: socket.emit('room:join', payload)
				);
			},

			generate: function (payload) {
				return (
					room
						? post('error', $.template(templates.messages.already_in_room, { roomName: room}))
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
			if (components.input[0] !== $.activeElement() && !e.ctrlKey && !e.altKey) {
				return components.input.focus();
			}

			// Reset command history clear timer
			clearTimeout(history_timer);
			history_timer = setTimeout(clearHistory, 60000);

			// Check for escape key, this does nothing but clear the input buffer and reset history position
			if ( e.keyCode == 27 ) {
				history_pos = -1;
				clearInput();

				return;
			} 

			// Check for up or down-keys, they handle the history position
			if( e.keyCode == 38 || e.keyCode == 40) {

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

				// Execute command handler
				commands[command](payload);

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

	// Connect to server
	socket = $.Websocket.connect(data.host);

	// Bind socket events
	socket
		.on('connect', function () {
			$(document).on('keydown', onKeyDown);
			components.input.focus();
		})

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
				if( !mute ) sound.playTones(sound.messages.message);
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
					if (sound.messages[sanitized] !== undefined && !mute ) sound.playTones(sound.messages[sanitized]);

				} else {
					post('error', templates.server.bogus);
				}
			} else {
				post('error', templates.server.bogus);
			}
		});

	// Post the help/welcome message
	post('motd', templates.motd, true);

	// It's possible to provide room and key using the hashtag.
	// The room and key is then seperated by semicolon (room:key).
	// If there is no semicolon present, the complete hash will be treated as the room name and the key has to be set manually.
	if (hash = window.location.hash) {
		parts = hash.slice(1).split(':');

		parts[0] && commands.join(parts[0]);
		parts[1] && commands.key(parts[1]);
	}
});