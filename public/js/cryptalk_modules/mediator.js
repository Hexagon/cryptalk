(function (self, factory) {
    if (typeof define === 'function' && define.amd) {
    	// AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') { // Node
        module.exports = factory();
    } else {
    	// Attaches to the current context
        self.castrato = factory;
  	}
}(this, (function () {
	var
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
		 * An empty function.
		 * This method does not accept any arguments.
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
	 * @param {Function} func A function to execute when the event is triggered.
	 */
	function on (fromId, event, func) {
		(subs[event] || (subs[event] = [])).push([fromId, func, func.length]);
	}

	/**
	 * Removes all event handlers originating from `fromId` and optionally filter by handler.
	 *
	 * @method off
	 * @private
	 * @param {Integer} fromId The unique subscriber ID.
	 * @param {String} event The event to unsubscribe from.
	 * @param {Function} [func=null] The original handler that was attached to this event. If not passed, all subscriptions will be removed.
	 */
	function off (fromId, event, func) {
		var sub,
			i = 0,
			toSubs = subs[event];

		if (toSubs) {
			while ((sub = toSubs[i++])) {
				if (sub[0] === fromId && (!func || func === sub[1])) {
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
	 * @param {Function} [func=undefined] A function to execute when all event handlers has returned.
	 */
	function emit (persistent, event, data, func) {
		var sub,
			toSubs = subs[event] || [],
			total = toSubs.length,
			left = total,
			loop = total,
			answers = [],
			done;

		if (loop) {
			done = !func ? noop : function (data) {
				if (data) {
					answers.push(data);
				}

				if (!--left) {
					func(answers, total);
					func = 0;
				}
			};

			while ((sub = toSubs[--loop])) {
				sub[1](data, (sub[2] > 1) ? done : left--);
			}
		}

		// `func` get destructed when called.
		// It has to be called at least once - even if no one was subscribing.
		// Execute it if it still exists.
		if (func) {
			func(answers, total);
		}
	}

	return function () {
		var nodeId = index++;

		return {
			/**
			 * Execute all handlers attached to the given event.
			 *
			 * @method emit
			 * @param {String} event The event to emit
			 * @param {Object} [data=undefined] Parameters to pass along to the event handler.
			 * @param {Function} [func=undefined] A function to execute when all event handlers has returned.
			 * @return {Object} `this`
			 * @example
			 * 	$.emit('something');
			 * 	$.emit('something', { foo: 'bar' });
			 * 	$.emit('something', { foo: 'bar' }, function (data, subscribers) {
			 * 		console.log('Emit done, a total of ' + subscribers + ' subscribers returned: ', data);
			 * 	});
			 */
			emit: function (persistent, event, data, func) {
				// emit('something', { data: true }, function () {});
				if (persistent !== true || persistent !== false) {
					func = data;
					data = event;
					event = persistent;
					persistent = false;
				}

				emit(persistent, event, data, func);

				return this;
			},

			/**
			 * Attach an event handler function for one event.
			 *
			 * @method on
			 * @param {String} event The event to subscribe to.
			 * @param {Function} func A function to execute when the event is triggered.
			 * @return {Object} `this`
			 * @example
			 * 	$.on('something', function (data) {
			 * 		console.log('Got something!', data);
			 * 	});
			 */
			on: function (event, func) {
				on(nodeId, event, func);
				return this;
			},

			/**
			 * Removes an event handler function for one event.
			 *
			 * @method off
			 * @param {String} event The event to unsubscribe from.
			 * @param {Function} [func=null] The original handler that was attached to this event. If not passed, all subscriptions will be removed.
			 * @return {Object} `this`
			 * @example
			 * 	$.off('something');
			 * 	$.off('something else', handler);
			 */
			off: function (event) {
				off(nodeId, event);
				return this;
			}
		};
	};
}())));