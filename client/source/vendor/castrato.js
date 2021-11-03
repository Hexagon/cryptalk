/**
 * Licensed under the MIT License
 * 
 * Copyright (c) 2014 Pehr Boman (github.com/unkelpehr)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/** @license Licenced under MIT - castrato - ©2014 Pehr Boman <github.com/unkelpehr> */

let
	/**
	 * Contains the next unique node id.
	 *
	 * @property index
	 * @type {Integer}
	 * @private
	 */
	index = 0,

	/**
	 * Contains all subscriptions
	 *
	 * @property subs
	 * @type {Object}
	 * @private
	 */
	subs = {},

	/**
	 * Contains all emits that has been done with the `persistent` parameter set to `true`.
	 *
	 * @property emits
	 * @type {Object}
	 * @private
	 */
	emits = {},

	/**
	 * An empty function that does not accept any arguments.
	 * 
	 * @property noop
	 * @type {function}
	 * @private
	 */
	noop = function () {};

/**
 * Creates a new entry in the `subs` object.
 *
 * @method on
 * @private
 * @param {Integer} fromId The unique subscriber ID.
 * @param {String} event The event to subscribe to.
 * @param {Function} handler A function to execute when the event is triggered.
 */
function on (fromId, event, handler, once) {
	let i, item, subscription = [fromId, handler, handler.length > 1];

	// Create if needed a namespace for this event and push the subscription.
	(subs[event] || (subs[event] = [])).push(subscription);

	// If it exists a persistent event that matches that which is currently being bound;
	// loop through and each of them and emit to this handler.
	if (emits[event]) {
		i = 0;
		subscription = [subscription];
		while ((item = emits[event][i++])) {
			emit(
				0, // `persistent`
				0, // `event`
				item[0], // `data`
				item[1], // `handler`
				subscription // `explicitSubs`
			);

			if (once) {
				break;
			}
		}
	}
}

/**
 * Removes all event handlers originating from `fromId` and optionally filter by handler.
 *
 * @method off
 * @private
 * @param {Integer} fromId The unique subscriber ID.
 * @param {String} event The event to unsubscribe from.
 * @param {Function} [handler=null] The original handler that was attached to this event. If not passed, all subscriptions will be removed.
 */
function off (fromId, event, handler) {
	let sub,
		i = 0,
		toSubs = subs[event];

	if (toSubs) {
		while ((sub = toSubs[i++])) {
			if (sub[0] === fromId && (!handler || handler === sub[1])) {
				toSubs.splice(--i, 1);
			}
		}
	}
}

/**
 * Loops through all subscriptions, calling all handlers attached to given `event`.
 *
 * @method emit
 * @private
 * @param {Integer} fromId The unique subscriber ID.
 * @param {String} event The event to emit
 * @param {Object} [data=undefined] Parameters to pass along to the event handler.
 * @param {Function} [handler=undefined] A function to execute when all event handlers has returned.
 */
function emit (persistent, event, data, callback, explicitSubs) {
	let sub,
		toSubs = explicitSubs || subs[event] || [],
		total = toSubs.length,
		left,
		loop,
		answers = [],
		done;

	// Add any wildcard subscriptions to the target subscriptions.
	if (subs['*']) {
		toSubs = toSubs.concat(subs['*']);
	}

	// Wildcard subscriptions shouldn't be counted as subscribers when passed to a possible emit callback.
	loop = left = toSubs.length;

	// Don't continue setup for calling all the subscribers if there isn't any.
	if (loop) {
		// If the emit function does not include a callback;
		// we still have to set `done` to `noop` so that event callbacks
		// does not try to execute something that is not a function.
		done = !callback ? noop : function (data) {
			if (data) {
				answers.push(data);
			}

			if (!--left) {
				callback(answers, total);
				callback = 0;
			}
		};

		// Execute all handlers that are bound to this event.
		// Passing `done` if the handler expects it - otherwise decrementing the `left` variable.
		while ((sub = toSubs[--loop])) {
			sub[1](data, sub[2] ? done : left--, event);
		}
	}

	// `func` get destructed when called.
	// It has to be called at least once - even if no one was subscribing.
	// Execute it if it still exists.
	if (!left && callback) {
		callback(answers, total);
	}

	// Save this emit if the `persistent` parameter is set to `true`.
	if (persistent) {
		(emits[event] || (emits[event] = [])).push([data, callback]);
	}
}

/**
 * Castrato entrypoint
 * 
 * @constructor
 * @returns {Castrato}
 */
function Castrato () {
	this.nodeId = index++;
	
	return this;
}

/**
 * Execute all handlers attached to the given event.
 *
 * @method emit
 * @param {String} event The event to emit
 * @param {Object} [data=undefined] Parameters to pass along to the event handler.
 * @param {Function} [func=undefined] A function to execute when all event handlers has returned.
 * @return {Castrato} `this`
 * @example
 * 	$.emit('something');
 * 	$.emit('something', { foo: 'bar' });
 * 	$.emit('something', { foo: 'bar' }, function (data, subscribers) {
 * 		console.log('Emit done, a total of ' + subscribers + ' subscribers returned: ', data);
 * 	});
 */
Castrato.prototype.emit = function (persistent, event, data, handler) {
	// emit('something', { data: true }, function () {});
	if (persistent !== true && persistent !== false) {
		handler = data;
		data = event;
		event = persistent;
		persistent = false;
	}

	emit(persistent, event, data, handler);

	return this;
};

/**
 * Attach an event handler function for an event.
 *
 * @method on
 * @param {String} event The event to subscribe to.
 * @param {Function} handler A function to execute when the event is triggered.
 * @return {Castrato} `this`
 * @example
 * 	$.on('something', function (data) {
 * 		console.log('Got something!', data);
 * 	});
 */
Castrato.prototype.on = function (event, handler) {
	on(this.nodeId, event, handler);
	return this;
};

/**
 * Attach an event handler function for an event which will only be fired once.
 *
 * @method once
 * @param {String} event The event to subscribe to.
 * @param {Function} handler A function to execute when the event is triggered.
 * @return {Castrato} `this`
 * @example
 * 	$.once('something', function (data) {
 * 		console.log('Got something!', data);
 * 	});
 */
Castrato.prototype.once = function (event, handler) {
	on(this.nodeId, event, function wrapper (data, done) {
		off(this.nodeId, event, wrapper);
		handler(data, (handler.length > 1) ? done : done());
	}, true);

	return this;
};

/**
 * Removes an event handler function for an event.
 *
 * @method off
 * @param {String} event The event to unsubscribe from.
 * @param {Function} [handler=null] The original handler that was attached to this event. If not passed, all subscriptions will be removed.
 * @return {Castrato} `this`
 * @example
 * 	$.off('something');
 * 	$.off('something else', handler);
 */
Castrato.prototype.off = function (event, handler) {
	off(this.nodeId, event, handler);
	return this;
};

// Only used in testing.
// Should get removed in production (and will be removed in the minified version)
Castrato.prototype.destroy = function () {
	this.nodeId = 0;
	index = 0;
	subs = {};
	emits = {};
	return this;
};


// Always return instance?
/**
 * @type {Castrato}
 */
let castrato = new Castrato();

// Export both named and default
export default castrato;
export { castrato };