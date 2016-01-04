define(['fandango', 'websocket', 'aes', 'SHA1'], function (fandango, websocket, aes, SHA1) {

	var exports = {
			selector: 0,
			utilities: {},
			prototype: {}
		},

		// Shortcuts
		utils = exports.utilities,
		proto = exports.prototype,

		each = fandango.each,

		/**
		 * Regex for matching NaN.
		 *
		 * @property reNaN
		 * @type {Regex}
		 * @private
		 */
		reDigits = /^\d+$/;

	// The DOM selector engine
	exports.selector = function (selector) {
		var match,
			matches = [];

		if (selector === document) {
			matches.push(document);
		} else {
			selector = selector.slice(1);

			if ((match = document.getElementById(selector))) {
				matches.push(match);
			}
		}

		// Must ALWAYS return a native array: []
		return matches;
	};

	// Namespace SHA1
	utils.SHA1 = function (string) {
		return SHA1(string).toString();
	};

	// Namespace encode
	utils.AES = {
		decrypt: function (string, fgh) {
			return aes.decrypt(string, fgh).toString(CryptoJS.enc.Utf8);
		},
		
		encrypt: function (string, fgh) {
			return aes.encrypt(string, fgh).toString();
		}
	};

	// Namespace websocket
	utils.io = websocket;

	utils.ssplit = function (string, seperator) {
		var components = string.split(seperator);
		return [components.shift(), components.join(seperator)];
	};

	utils.activeElement = function () {
		try { return document.activeElement; } catch (e) {}
	};

	/**
	 * Removes all characters but 0 - 9 from given string.
	 *
	 * @method digits
	 * @param {String} str The string to sanitize
	 * @return {String} The sanitized string
	 * @example
	 * 	$.digits('foo8bar'); // `8`
	 * 	$.digits('->#5*duckM4N!!!111'); // `54111`
	 */
	utils.isDigits = function(value) {
		return reDigits.test(value);
	};

	/**
	 * A very simple templating function.
	 * @param  {} str [description]
	 * @param  {[type]} map [description]
	 * @return {[type]}     [description]
	 */
	utils.template = function (str, map) {
		return str && str.replace(/{(\w+)}/gi, function(outer, inner) {
			return map.hasOwnProperty(inner) ? map[inner] : outer /* '' */;
		});
	};

	utils.getJSON = function (path, onSuccess, onError) {
		var data, request = new XMLHttpRequest();
		request.open('GET', path, true);

		request.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status >= 200 && this.status < 400) {
					try {
						onSuccess && onSuccess(JSON.parse(this.responseText));
					} catch (e) {
						onError && onError();
					}
				} else {
					onError && onError();
				}
			}
		};

		request.send();
		request = null;
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

	proto.first = function () {
		return this[0];
	};

	// Naive implementations of .on()
	proto.on = function (eventName, callback) {
		each(this, function (element) {
			if (element.addEventListener) {
				element.addEventListener(eventName, callback, false);
			} else if (element.attachEvent) {
				element.attachEvent('on' + eventName, callback);
			}
		});
		return this;
	};

	proto.focus = function () {
		// It doesn't make sense to focus all matched elements. So we settle for the first one
		if(this[0]) {
			this[0].focus();
		}
		return this;
	};

	return exports;
})