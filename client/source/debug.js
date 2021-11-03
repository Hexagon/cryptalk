export default function (mediator, debug) {
	if (debug) {
		mediator.on('*', function (data, done, name) {
			if (name !== 'console:post' && name !== 'notification:send') {
				mediator.emit('console:post', {
					type: 'server',
					data: name + (data ? '(' + JSON.stringify(data) + ')' : ''),
					debug: 1
				});
			}

			done();
		});
	}
}