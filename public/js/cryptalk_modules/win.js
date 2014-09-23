/*

	Emits:
		'window:focused'
		'window:blurred'
	
	Exports:
		title = window.getTitle();
		window.setTitle(title);

*/
define(['mediator'],function (mediator){
 
	var exports = {},
		channel = mediator(),

		focusCallback = function() {
			channel.emit('window:focused');
		},
 
		blurCallback = function() {
			channel.emit('window:blurred');
		};

	exports.setTitle = function(t) 	{ document.title = t; },
	exports.getTitle = function() 	{ return document.title; };
 
	// Keep track of document focus/blur
	if (window.addEventListener){
		// Normal browsers
		window.addEventListener("focus", focusCallback, true);
		window.addEventListener("blur", blurCallback, true);
	} else {
		// IE
		window.observe("focusin", focusCallback);
		window.observe("focusout", blurCallback);
	}
 
	return exports;
 
});