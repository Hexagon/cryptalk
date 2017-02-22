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
			path: '/js/lib/settings.js'
		}/*,
		{
			name: 'Official host - cryptalk.56k.guru',
			host: 'https://cryptalk.56k.guru',
			path: 'https://cryptalk.56k.guru/js/cryptalk_modules/settings.js'
		}*/
	]
});
