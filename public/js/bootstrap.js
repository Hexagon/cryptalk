// This Javascript file is the only file besides fandango.js that will be fetched through DOM.

// Setup fandango
fandango.defaults({
	baseUrl: 'js/cryptalk_modules/',
	paths: {
		websocket: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js',
		// Newer version:
		// We'll have to fix the Access Control issue first though (https://github.com/Automattic/socket.io-client/issues/641).
		// websocket: 'https://cdn.socket.io/socket.io-1.1.0.js',
		aes: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js',
		domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min.js'
	},

	// CryptoJs AES does not support AMD modules. We'll have to create a shim.
	shim: {
		aes: {
			exports: function () { // String (the global variable name) or a function; returning the desired variable.
				return CryptoJS.AES;
			}
		}
	}
});

// Require main cryptalk module.
require(['cryptalk'], function () {}, function (e) {
	document.getElementById('chat').innerHTML = '<li><i class="fatal">Fatal: An error was thrown during initialization causing the application to stop.<br>Examine the logs for more details.</i></li>';

	if (console.log) {
		console.log(e);
	}
	
	throw e;
});