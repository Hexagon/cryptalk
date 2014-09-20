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
		'	/mute  				Toggle notification sounds						\n' +
		'	/key		OurStrongPassphrase	Sets encryption key                 \n' +
		'	/leave					Leave the room                              \n' +
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
		info: 		'<li>INF&gt; <i class="info">{text}</i></li>',
		server: 	'<li>SRV&gt; <i class="server">{text}</i></li>',
		error: 		'<li>ERR&gt; <i class="error">{text}</i></li>',
		message: 	'<li><i class="nick">{nick}&gt;</i> <i class="message">{text}</i></li>'
	},

	messages: {
		key_weak: 				'Hmm, that\'s a weak key, try again...',
		key_ok_ready: 			'Key set, you can now start communicating.',
		key_ok_but_no_room: 	'Key set, you can now join a room and start communicating.',
		msg_no_room: 			'You have to join a room before sending messages. See /help.',
		not_in_room: 			'You have to be in a room to count participants...',
		msg_no_key: 			'You have to set an encryption key before sending a message. See /help.',
		nick_short: 			'Nickname is too short, try again.',
		nick_set: 				'From now on, you\'re referred to as \'{nick}\'.',
		leave_from_nowhere: 	'How are you supposed to leave, while being nowhere?',

		// Sounds
		muted: 					'Notification sounds is now muted.',
		unmuted: 					'Notifications sounds is now on.',

		// Available variables: 'commandName'
		unrecognized_command: 	'Unrecognized command: "{commandName}"',

		// Available variables: 'roomName'
		joined_room: 			'Joined room {roomName}',
		left_room: 				'Left room {roomName}',
		already_in_room: 		'You are already in a room ({roomName}), stoopid.',

		unable_to_decrypt: 		'Unabled to decrypt received message, keys does not match.'
	},

	server: {
		person_joined: 			'A person joined this room.',
		person_left: 			'A person left this room.',
		person_count: 			'There is {payload} person(s) in this room, including you.',
		command_failed: 		'Server command failed, you\'re probably trying to du something bogus.',
		bogus: 					'Received a bogus message from server.',
	}
});