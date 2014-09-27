/*

	Accepts:
		mediator.on('console:clear', clear);
		mediator.on('console:motd', motd);
		mediator.on('console:info', info);
		mediator.on('console:error', error);
		mediator.on('console:server', server);
		mediator.on('console:message', message);
		mediator.on('console:lockinput', lockInput);
		mediator.on('console:unlockInput', unlockInput);
		mediator.on('console:param', param);

	Emits:
		mediator.emit('notification:send',...);
		mediator.emit('audio:play',...);
		ToDo
*/
define(
	{
		compiles: ['$'],
		requires: ['castrato','fandango','settings','templates','sounds','room','notifications','audio']
	}, function ($, requires, data) { 

	var 

		// Require shortcuts
		fandango = requires.fandango,
		mediator = requires.castrato,
		settings = requires.settings,
		templates = requires.templates,
		sounds = requires.sounds,

		// Collection of DOM components
		components = {
			chat: 	$('#chat'),
			input: 	$('#input'),
			inputWrapper: $('#input_wrapper')
		},

		// Collection of parameters
		parameters = {},

		// Adds a new message to the DOM
		post = function (type, text, nick) {

			var tpl = templates.post[type],
				post,
				data = fandango.merge({}, settings, {
					nick: nick,
					timestamp: new Date().toLocaleTimeString()
				});

			data.text = $.template(text, data);
			post = $.template(tpl, data);

			// Request a notification
			showNotification(type, nick, text);

			// Append the post to the chat DOM element
			components.chat.append(post);

		},

		param = function (p) {
			parameters = fandango.merge({}, parameters, p );
		},

		showNotification = function (type, nick, text) {

			var title = (type!='message') ? 'Cryptalk' : nick,
				icon = (type == 'message') ? 'gfx/icon_128x128.png' : (type == 'error') ? 'gfx/icon_128x128_error.png' : 'gfx/icon_128x128_info.png';

			// Emit notification
			mediator.emit('notification:send', 
				{ 
					title: 	title.substring(0, 20), 
					body: 	text.substring(0, 80), 
					icon: 	icon
				});

			// Emit sound
			if ( type == 'message' ) mediator.emit('audio:play', sounds.message);
		
		},

		motd = function (payload) { post('motd', settings.motd); },
		info = function (payload, done) { post('info', payload); },
		error = function (payload, done) { post('error', payload); },
		message = function (payload, done) { post('message', payload.message , payload.nick ); },
		server = function (payload, done) { post('server', payload); },

		clearInput = function () {  
			fandango.subordinate(function () {
				components.input[0].value = '';
			});
		},

		clear = function () { 
			fandango.subordinate(function () {
				components.chat[0].innerHTML = '';
			});
		},

		lockInput = function () {
			components.input[0].setAttribute('disabled', 'disabled');
			components.inputWrapper[0].className = 'loading';
		},

		unlockInput = function () {
			components.input[0].removeAttribute('disabled');
			components.inputWrapper[0].className = '';
			components.input.focus();
		},

		_require = function (filepath, done) {
			lockInput();
			post('info', 'Requiring ' + filepath + '...');
			require([filepath], function () {
				post('info', 'Successfully required ' + filepath + '.');
				unlockInput();
				done();
			}, function (e) {
				post('error', 'An error occurred while trying to load "' + filepath + '":\n' + e);
				unlockInput();
				done();
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

			// Return immediatly if the buffer is empty or if the hit key was not <enter>
			if (e.keyCode !== 13 || !(buffer = components.input[0].value)) {
				return;
			}

			// Handle command
			if ((buffer[0] || buffer.slice(0, 1)) === '/') {
				parts = $.ssplit(buffer.slice(1), ' ');
				command = parts[0];
				payload = parts[1];

				// Shout this command to all modules
				mediator.emit(
					'console:' + command,
					payload,
					function(retvals, recipients) {
						if(!recipients) {
							return post('error', $.template(templates.messages.unrecognized_command, { commandName: command }));
						} else {
							clearInput();
						}
					}
				);

			} else /* Handle ordinary message */ {

				if(!parameters.room || !parameters.key ) {
					// Make sure that the user has joined a room and the key is set
					return (!parameters.room) ? post('error', templates.messages.msg_no_room) : post('error', templates.messages.msg_no_key);
				}

				// Before sending the message.
				// Encrypt message using room UUID as salt and key as pepper.
				mediator.emit(
					'socket:emit',
					{ 
						data: 'message:send', 
						payload: {
							room: $.SHA1(parameters.room),
							msg: $.AES.encrypt(buffer, $.SHA1(parameters.room) + parameters.key).toString(),
							nick: parameters.nick ? $.AES.encrypt(parameters.nick, $.SHA1(parameters.room) + parameters.key).toString() : false
						}
					}
				);

				// And clear the the buffer
				clearInput();

			}
		};

	// Bind the necessary DOM events
	$(document).on('keydown', onKeyDown);

	// Put focus on the message input
	components.input.focus();

	// Connect events
	mediator.on('console:clear', clear);
	mediator.on('console:motd', motd);
	mediator.on('console:info', info);
	mediator.on('console:error', error);
	mediator.on('console:server', server);
	mediator.on('console:message', message);
	mediator.on('console:lockinput', lockInput);
	mediator.on('console:unlockinput', unlockInput);
	mediator.on('console:param', param);
	mediator.on('console:require', _require);
	mediator.on('console:post', function (data) {
		post(data.type, data.data, data.nick);
	});
});