define({
	// Used to autoconnect to specific host.
	// Points to a specific index in the 'hosts' array.
	// Use -1 to not autoconnect.
	autoconnect: 0,

	// A collection of hosts to choose from
	hosts: [
		{
			name: 'default',
			host: '',
			path: '/js/cryptalk_modules/settings.js'
		}/*,
		{
			name: 'Example',
			host: 'http://www.example.com',
			path: 'http://www.example.com/js/cryptalk_modules/settings.js'
		}*/
	]
});
