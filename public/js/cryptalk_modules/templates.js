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
		'	/leave					Leave the room                              \n' +
		'	/nick		NickName		Sets an optional nick                   \n' +
		'	/key		OurStrongPassphrase	Sets encryption key                 \n' +
		'	/clear					Clear on-screen buffer                      \n' +
		'	/help					This                                        \n' +
		'                                                                       \n' +
		'                                                                       \n' +
		'<strong>It is highly recommended to use incognito mode while chatting, \n' +
		'to prevent browsers from keeping history or cache.</strong>            \n' +
		'                                                                       \n' +
		'----------------------------------------------------------------------	\n' +
		'                                                                    ',

	default_nick: 'Anonymous',

	post: {
		motd: 		'<li><i class="motd">{text}</i></li>',
		info: 		'<li>INF> <i class="info">{text}</i></li>',
		server: 	'<li>SRV> <i class="server">{text}</i></li>',
		error: 		'<li>ERR> <i class="error">{text}</i></li>',
		message: 	'<li>{nick}> <i class="message">{text}</i></li>'
	},

	messages: {
		key_weak: 				'Hmm, that\'s a weak key, try again...',
		key_ok_ready: 			'Key set, you can now start communicating.',
		key_ok_but_no_room: 	'Key set, you can now join a room and start communicating.',
		msg_no_room: 			'You have to join a room before sending messages. See /help.',
		msg_no_key: 			'You have to set an encryption key before sending a message. See /help.',
		nick_short: 			'Nickname is too short, try again.',
		nick_set: 				'From now on, you\'re referred to as \'{nick}\'.',
		leave_from_nowhere: 	'How are you supposed to leave, while being nowhere?',

		// Available variables: 'commandName'
		unrecognized_command: 	'Unrecognized command: "{commandName}"',

		// Available variables: 'roomName'
		joined_room: 			'Joined room {roomName}',
		left_room: 				'Left room {roomName}',
		already_in_room: 		'You are already in a room ({roomName}), stoopid.',

		unable_to_decrypt: 		'Unabled to decrypt received message, keys does not match.'
	}
});