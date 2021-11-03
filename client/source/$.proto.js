var 
	exports = {};

// Extremely naive implementations of .html() and .append()
exports.html = function (string) {
	this.forEach(function (element) {
		element.innerHTML = string;
	});
	return this;
};

exports.append = function (string) {
	this.forEach(function (element) {
		element.innerHTML += string;
	});
	return this;
};

exports.first = function () {
	return this[0];
};

// Naive implementations of .on()
exports.on = function (eventName, callback) {
	this.forEach(function (element) {
		if (element.addEventListener) {
			element.addEventListener(eventName, callback, false);
		} else if (element.attachEvent) {
			element.attachEvent('on' + eventName, callback);
		}
	});
	return this;
};

exports.focus = function () {
	// It doesn't make sense to focus all matched elements. So we settle for the first one
	if(this[0]) {
		this[0].focus();
	}
	return this;
};

export default exports;