define(['castrato'], function (castrato) {
	var exports = {};

	castrato.on('*', function (data, done, name) {
		if (name !== 'console:post' && name !== 'notification:send') {
			castrato.emit('console:post', {
				type: 'server',
				data: name + (data ? '(' + JSON.stringify(data) + ')' : ''),
				debug: 1
			});
		}

		done();
	});

	return exports;
});