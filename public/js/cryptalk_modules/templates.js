// The templating function only supports variables.
// Define a variable as so: {variable_name}
define({
	help: '' +
		'<li>																				\n' +
		'Cryptalk, encrypted instant chat.													\n' +
		' 																					\n' +
		'----------------------------------------------------------------------------------	\n' +
		' 																					\n' +
		'Available commands: 																\n' +
		' 	/create 					Creates a room 										\n' +
		'	/join		RoomId				Joins a room									\n' +
		'	/leave		RoomId				Leaves a room									\n' +
		'	/key		OurStrongPassphrase		Sets the password used for 					\n' +
		'	 						encryption/decryption 									\n' +
		'	/clear						Clears on-screen buffer 							\n' +
		'	/help						This 												\n' +
		'	 																				\n' +
		'	Besides that, it\'s just to talk! 												\n' +
		'	 																				\n' +
		'Code available for review at https://www.github.com/hexagon/cryptalk 				\n' +
		'																					\n' +
		'---------------------------------------------------------------------------------	\n' +
		'</li>																				',

	post: {
		info: 		'<li>INF> <i class="info">{text}</i></li>',
		server: 	'<li>SRV> <i class="server">{text}</i></li>',
		error: 		'<li>ERR> <i class="error">{text}</i></li>',
		message: 	'<li>MSG> <i class="message">{text}</i></li>'
	},

	messages: {
		key_weak: 				'Hmm, that\'s a weak key, try again...',
		key_ok_ready: 			'Key set, you can now start communicating.',
		key_ok_but_no_room: 	'Key set, you can now join a room and start communicating.',
		msg_no_room: 			'You have to join a room before sending messages. See /help.',
		msg_no_key: 			'You have to set an encryption key before sending a message. See /help.',

		// Available variables: 'commandName'
		unrecognized_command: 	'Unrecognized command: "{commandName}"',

		// Available variables: 'roomName'
		joined_room: 			'Joined room {roomName}',
		left_room: 				'Left room {roomName}',
		already_in_room: 		'You are already in room {roomName}, stoopid.',

		unable_to_decrypt: 		'Unabled to decrypt received message, keys does not match.'
	}
});