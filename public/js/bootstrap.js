// This Javascript file is the only file besides fandango.js that will be fetched through DOM.

// Setup fandango
fandango.defaults({
	baseUrl: 'js/cryptalk_modules/',
	paths: {
		websocket: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js',
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

// Fetch our modules asynchronously, when the DOM is finished loading.
//define('bootstrap_module', ['domReady'], function (domReady) {
//	domReady(function () {
//		require(['cryptalk']);
//	});
//});

// No need to wait for DOM - the Javascript is at the bottom
require(['cryptalk']);