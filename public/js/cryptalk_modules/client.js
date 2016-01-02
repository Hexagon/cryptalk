/*

	Accepts:
		mediator.on('command:help', ...);
		mediator.on('command:nick', ...);
		mediator.on('command:key', ...);
		mediator.on('command:key', ...);
		mediator.on('command:torch', ...);
		mediator.on('command:title', ...);

	Emits:
		mediator.emit('nick:changed',...);
		mediator.emit('key:changed',...);
		mediator.emit('console:clear',...);
		mediator.emit('console:info',...);
		mediator.emit('console:error',...);


*/
define(
	{
		compiles: ['$'],
		requires: ['castrato','settings','templates']
	}, function ($, requires, data) { 

	var 
		// Private properties
		nick,
		key,

		// Require shortcuts
		mediator = requires.castrato,
		settings = requires.settings,
		templates = requires.templates,

		setKey = function(payload) {
			/*if (!host) {
				return post('error', templates.messages.key_no_host);
			}*/

			// Make sure the key meets the length requirements
			if (payload.length > settings.key.maxLen) {
				return mediator.emit('console:error',templates.messages.key_to_long);
			} else if (payload.length < settings.key.minLen) {
				return mediator.emit('console:error',templates.messages.key_to_short);
			}

			// Set key
			key = payload;

			// Keep other modules informed
			mediator.emit('key:changed',key);

			// Inform that the key has been set
			return mediator.emit('console:info', templates.messages.key_ok );
		},

		help = function () { mediator.emit('console:motd', templates.help); },

		clear = function () { mediator.emit('console:clear'); },

		setTorch = function (payload) { mediator.emit('console:torch',payload); },

		nick = function (payload) {

			// Make sure the nick meets the length requirements
			if (payload.length > settings.nick.maxLen) {
				return mediator('console:error', $.template(templates.messages.nick_to_long, { nick_maxLen: settings.nick.maxLen } ));
			} else if (payload.length < settings.nick.minLen) {
				return mediator('console:error', $.template(templates.messages.nick_to_short, {nick_minLen: settings.nick.minLen } ));
			}

			// Set nick
			nick = payload;

			// Keep other modules informed
			mediator.emit('nick:changed',nick);

			// Inform that the nick has been set
			mediator.emit('console:info', $.template(templates.messages.nick_set, { nick: $.escapeHtml(nick)}));

		},

		title = function(payload) {
			mediator.emit('window:title',payload);
			mediator.emit('console:info', $.template(templates.messages.title_set, { title: $.escapeHtml(payload)}));
		};

	mediator.on('command:help', help);
	mediator.on('command:clear', clear);
	mediator.on('command:nick', nick);
	mediator.on('command:key', setKey);
	mediator.on('command:torch', setTorch);
	mediator.on('command:title', title);
	
});