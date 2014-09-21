define(['fandango', 'websocket', 'aes'], function (fandango, websocket, aes) {
	var exports = {
			selector: 0,
			utilities: {},
			prototype: {}
		},

		// Shortcuts
		utils = exports.utilities,
		proto = exports.prototype,

		each = fandango.each;
	
	// The DOM selector engine
	exports.selector = function (selector) {
		var match,
			matches = [];

		if (selector === document) {
			matches.push(document);
		} else {
			selector = selector.slice(1);

			if (match = document.getElementById(selector)) {
				matches.push(match);
			}
		}

		// Must ALWAYS return a native array: []
		return matches;
	};

	// Namespace AES
	utils.AES = {
		decrypt: aes.decrypt,
		encrypt: aes.encrypt
	};

	// Namespace encode
	utils.AES = {
		decrypt: function (string, fgh) {
			return aes.decrypt(string, fgh).toString(CryptoJS.enc.Utf8);
		},
		encrypt: function (string, fgh) {
			return aes.encrypt(string, fgh).toString();
		},
	};

	// Namespace websocket
	utils.Websocket = {
		connect: websocket.connect,
		on: websocket.on
	};

	utils.ssplit = function (string, seperator) {
		var components = string.split(seperator);
		return [components.shift(), components.join(seperator)];
	};

	utils.activeElement = function () {
		try { return document.activeElement; } catch (e) {}
	}

	/**
	 * A very simple implementation of sprintf()
	 * @param  {} str [description]
	 * @param  {[type]} map [description]
	 * @return {[type]}     [description]
	 */
	utils.template = function (str, map) {
		return str && str.replace(/{(\w+)}/gi, function(outer, inner) {
			return map.hasOwnProperty(inner) ? map[inner] : outer /* '' */;
		});
	};

	// Part of this is originating from mustasche.js
	// Code: 		https://github.com/janl/mustache.js/blob/master/mustache.js#L43
	// License: 	https://github.com/janl/mustache.js/blob/master/LICENSE
	utils.escapeHtml = (function () {
		var pattern = /[&<>"'\/]/g,
			entities = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
				'/': '&#x2F;'
			};

		return function (string) {
			return String(string).replace(pattern, function (s) {
				return entities[s];
			});
		};
	}());

	// Extremely naive implementations of .html() and .append()
	proto.html = function (string) {
		each(this, function (element) {
			element.innerHTML = string;
		});

		return this;
	};

	proto.append = function (string) {
		each(this, function (element) {
			element.innerHTML += string;
		});

		return this;
	};

	// Extremely naive implementations of .on()
	proto.on = function (eventName, callback) {
		each(this, function (element) {
			element.addEventListener(eventName, callback);
		});

		return this;
	};

	proto.focus = function () {
		this[0].focus();

		return this;
	};

	return exports;
})