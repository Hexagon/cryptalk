// This Javascript file is the only file besides fandango.js that will be fetched through DOM.

// Setup fandango
fandango.defaults({
	
	baseUrl: 'js/cryptalk_modules/',

	paths: {
		websocket: '/socket.io/socket.io.js',
		aes: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js',
		SHA1: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/sha1.js'
	},

	// CryptoJs AES does not support AMD modules. We'll have to create a shim.
	shim: {
		aes: {
			exports: function () { // String (the global variable name) or a function; returning the desired variable.
				return CryptoJS.AES;
			}
		},
		SHA1: {
			exports: function () {
				return CryptoJS.SHA1;
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
