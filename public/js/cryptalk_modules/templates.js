// The templating function only supports variables.
// Define a variable as so: {variable_name}
define({

	help: '<pre>                                                                \n' +
		'Cryptalk, encrypted instant chat.                                      \n' +
		'                                                                       \n' +
		'----------------------------------------------------------------------	\n' +
		'                                                                       \n' +
		'Client:                                                    			\n' +
		'	/key		StrongPassphrase	Sets encryption key                 \n' +
		'	/nick		NickName		Sets an optional nick                   \n' +
		'	/mute  					Audio on									\n' +
		'	/unmute  				Audio off									\n' +
		'	/clear					Clear on-screen buffer                      \n' +
		'	/help					This                                        \n' +
		'	/title					Set your local page title					\n' +
		'	/torch		AfterSeconds		Console messages are torched  		\n' +
		'						after this amount of seconds 					\n' +
		'						(default 600).									\n' +
		'                                                                       \n' +
		'Room:                                                    				\n' +
		'	/join		RoomId			Join a room	                            \n' +
		'	/leave					Leave the room                              \n' +
		'	/count					Count participants                          \n' +
		'                                                                       \n' +
		'Host:  		                                                    	\n' +
		'	/hosts					List available hosts                   		\n' +
		'	/connect	HostIndex		Connect to selected host               	\n' +
		'	/disconnect				Disconnect from host    			        \n' +
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
		'</pre>',

	default_nick: 'Anonymous',

	// All post templates will have access to the properties in the 'settings' module, 
	// along with the current nick, room, mute-status and of course the message ('text').
	post: {
		motd: 		'<li id="{id}"><i class="motd">{text}</i></li>',
		info: 		'<li id="{id}"><i class="timestamp">[{timestamp}] </i>INF&gt; <i class="info">{text}</i></li>',
		server: 	'<li id="{id}"><i class="timestamp">[{timestamp}] </i>SRV&gt; <i class="server">{text}</i></li>',
		error: 		'<li id="{id}"><i class="timestamp">[{timestamp}] </i>ERR&gt; <i class="error">{text}</i></li>',
		message: 	'<li id="{id}"><i class="timestamp">[{timestamp}] </i>MSG&gt; <i class="nick">{nick}&gt;</i> <i class="message">{text}</i></li>'
	},

	// All message templates will have access to the properties in the 'settings' module, 
	// along with the current nick, room and mute-status.
	messages: {
		key_to_short: 			'Hmm, that\'s a weak key, try again...',
		key_to_long: 			'Man that\'s a long key. Make it a tad short, \'kay?',
		key_ok: 				'Key set, you can now start communicating.',
		key_no_host: 			'You have to connect to a host before setting the key.',

		join_no_host: 			'You have to connect to a host before joining a room.',

		nick_to_short: 			'Nickname is too short, it has to be at least {nick_minLen} characters long. Try again.',
		nick_to_long: 			'Nickname is too long, it can be at most {nick_maxLen} characters long. Try again.',
		nick_set: 				'From now on, you\'re referred to as \'{nick}\'.',

		msg_no_room: 			'You have to join a room before sending messages. See /help.',
		not_in_room: 			'You have to be in a room to count participants...',
		msg_no_key: 			'You have to set an encryption key before sending a message. See /help.',
		leave_from_nowhere: 	'How are you supposed to leave, while being nowhere?',

		torch_is_now: 			'Messages are now torched after {ttl} seconds.',
		torch_not_set: 			'Invalid torch delay entered, nothing changed. See /help.',

		title_set: 				'The title of this window is now \'{title}\'.',

		muted: 					'Notifications and sounds are now muted.',
		unmuted: 				'Notifications and sounds are now on.',

		unrecognized_command: 	'Unrecognized command: "{commandName}"',

		room_name_too_long: 	'Isn\'t that a bit long?',
		room_name_too_short: 	'Nah, too short.',

		joined_room: 			'Joined room {roomName}.',
		left_room: 				'Left room {roomName}.',
		already_in_room: 		'You are already in a room ({room}), stoopid.',

		unable_to_decrypt: 		'Unabled to decrypt received message, keys does not match.',

		socket_error: 			'A network error has occurred. A restart may be required to bring back full functionality.<br>Examine the logs for more details.',
		connecting: 			'Connecting to host {host}...',
		connected: 				'A connection to the server has been established. Happy chatting!',
		disconnected: 			'Disconnected from host {host}.',
		already_connected:		'You have to disconnect from {host} before joining another.',
		reconnect_no_host:		'There is no host to reconnect with.',

		host_available: 		'<span class="info">{index}</span>	<span class="good">[AVAILABLE]</span>	<span class="neutral">{name}</span>\n',
		host_unavailable: 		'<span class="info">{index}</span>	<span class="bad">[UNAVAILABLE]</span>	<span class="neutral">{name}</span>\n'
	},

	server: {
		person_joined: 			'A person joined this room.',
		person_left: 			'A person left this room.',
		person_count: 			'There is {payload} person(s) in this room, including you.',
		command_failed: 		'Server command failed, you\'re probably trying to du something bogus.',
		bogus: 					'Received a bogus message from server.'
	},

	client: {
		title: 					'Cryptalk - Offline'
	}
});