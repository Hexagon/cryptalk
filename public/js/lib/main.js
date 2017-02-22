require.config({
	baseUrl: 'js/lib/',
	paths: {
		websocket: '/socket.io/socket.io'
	},
	packages: [
		{
			name: 'crypto-js',
			location: '../vendor/crypto-js-3.1.9',
			main: 'index'
		},
		{
			name: 'castrato',
			location: '../vendor/castrato',
			main: 'castrato'
		}
	]
});

require(['cryptalk']);