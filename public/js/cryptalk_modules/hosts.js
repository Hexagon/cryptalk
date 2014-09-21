define({
	// Used to autoconnect to specific host.
	// Points to a specific index in the 'hosts' array.
	// Use -1 to not autoconnect.
	autoconnect: 0,

	// A collection of hosts to choose from
	hosts: [
		{
			name: 'localhost',
			host: 'http://localhost:8080',
			path: 'http://localhost:8080/js/cryptalk_modules/settings.js'
		}
	]
});