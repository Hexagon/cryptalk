// The templating function only supports variables.
// Define a variable as so: {variable_name}
define({
	motd: '\n\n' + 
		'▄████▄   ██▀███ ▓██   ██▓ ██▓███  ▄▄▄█████▓ ▄▄▄       ██▓     ██ ▄█▀  \n' +
		'▒██▀ ▀█  ▓██ ▒ ██▒▒██  ██▒▓██░  ██▒▓  ██▒ ▓▒▒████▄    ▓██▒     ██▄█▒  \n'+
		'▒▓█    ▄ ▓██ ░▄█ ▒ ▒██ ██░▓██░ ██▓▒▒ ▓██░ ▒░▒██  ▀█▄  ▒██░    ▓███▄░  \n'+
		'▒▓▓▄ ▄██▒▒██▀▀█▄   ░ ▐██▓░▒██▄█▓▒ ▒░ ▓██▓ ░ ░██▄▄▄▄██ ▒██░    ▓██ █▄  \n'+
		'▒ ▓███▀ ░░██▓ ▒██▒ ░ ██▒▓░▒██▒ ░  ░  ▒██▒ ░  ▓█   ▓██▒░██████▒▒██▒ █▄ \n'+
		'░ ░▒ ▒  ░░ ▒▓ ░▒▓░  ██▒▒▒ ▒▓▒░ ░  ░  ▒ ░░    ▒▒   ▓▒█░░ ▒░▓  ░▒ ▒▒ ▓▒ \n'+
		'  ░  ▒     ░▒ ░ ▒░▓██ ░▒░ ░▒ ░         ░      ▒   ▒▒ ░░ ░ ▒  ░░ ░▒ ▒░ \n'+
		'░          ░░   ░ ▒ ▒ ░░  ░░         ░        ░   ▒     ░ ░   ░ ░░ ░  \n'+
		'░ ░         ░     ░ ░                             ░  ░    ░  ░░  ░    \n'+
		'░                 ░ ░                                                 \n'+
		'                                  https://github.com/hexagon/cryptalk \n'+
		'                                                                      \n'+
		' Tip of the day: /help                                                \n'+
		'                                                                      \n'+
		'----------------------------------------------------------------------',

	help: '                                                                       \n' +
		'Cryptalk, encrypted instant chat.                                      \n' +
		'                                                                       \n' +
		'----------------------------------------------------------------------	\n' +
		'                                                                       \n' +
		'Available commands:                                                    \n' +
		' 	/generate 				Generate random room                        \n' +
		'	/join		RoomId			Join a room	                            \n' +
		'	/count					Count participants of room                  \n' +
		'	/nick		NickName		Sets an optional nick                   \n' +
		'	/mute  					Toggle notification sounds					\n' +
		'	/key		OurStrongPassphrase	Sets encryption key                 \n' +
		'	/leave					Leave the room                              \n' +
		'	/clear					Clear on-screen buffer                      \n' +
		'	/help					This                                        \n' +
		'                                                                       \n' +
		'                                                                       \n' +
		'You can select any of the five last commands/messages with up/down key.\n' +
		'                                                                       \n' + 
		'Due to security reasons, /key command is not saved, and command        \n' + 
  		'history is  automatically cleared after one minute of inactivity.      \n' + 
		'                                                                       \n' +
		'<strong>It is highly recommended to use incognito mode while chatting, \n' +
		'to prevent browsers from keeping history or cache.</strong>            \n' +
		'                                                                       \n' +
		'----------------------------------------------------------------------	\n' +
		'                                                                    ',

	default_nick: 'Anonymous',

	// All post templates will have access to the properties in the 'settings' module, 
	// along with the current nick, room, mute-status and of course the message ('text').
	post: {
		motd: 		'<li><i class="motd">{text}</i></li>',
		info: 		'<li>INF&gt; <i class="info">{text}</i></li>',
		server: 	'<li>SRV&gt; <i class="server">{text}</i></li>',
		error: 		'<li>ERR&gt; <i class="error">{text}</i></li>',
		message: 	'<li><i class="nick">{nick}&gt;</i> <i class="message">{text}</i></li>'
	},

	// All message templates will have access to the properties in the 'settings' module, 
	// along with the current nick, room and mute-status.
	messages: {
		key_to_short: 			'Hmm, that\'s a weak key, try again...',
		key_to_long: 			'Man that\'s a long key. Make it a tad short, \'kay?',
		key_ok_ready: 			'Key set, you can now start communicating.',
		key_ok_but_no_room: 	'Key set, you can now join a room and start communicating.',

		nick_to_short: 			'Nickname is too short, it has to be at least {nick_minLen} characters long. Try again.',
		nick_to_long: 			'Nickname is too long, it can be at most {nick_maxLen} characters long. Try again.',
		nick_set: 				'From now on, you\'re referred to as \'{nick}\'.',

		msg_no_room: 			'You have to join a room before sending messages. See /help.',
		not_in_room: 			'You have to be in a room to count participants...',
		msg_no_key: 			'You have to set an encryption key before sending a message. See /help.',
		leave_from_nowhere: 	'How are you supposed to leave, while being nowhere?',

		// Sounds
		muted: 					'Notification sounds is now muted.',
		unmuted: 				'Notifications sounds is now on.',

		// Extra variables: 'commandName'
		unrecognized_command: 	'Unrecognized command: "{commandName}"',

		joined_room: 			'Joined room {room}',
		left_room: 				'Left room {room}',
		already_in_room: 		'You are already in a room ({room}), stoopid.',

		unable_to_decrypt: 		'Unabled to decrypt received message, keys does not match.',

		socket_error: 			'A network error has occurred. A restart may be required to bring back full functionality.<br>Examine the logs for more details.',
		connecting: 			'Connecting to host {host}...',
		connected: 				'A connection to the server has been established. Happy chatting!'
	},

	server: {
		person_joined: 			'A person joined this room.',
		person_left: 			'A person left this room.',
		room_generated: 		'Room {payload} generated.',
		person_count: 			'There is {payload} person(s) in this room, including you.',
		command_failed: 		'Server command failed, you\'re probably trying to du something bogus.',
		bogus: 					'Received a bogus message from server.',
	}
});