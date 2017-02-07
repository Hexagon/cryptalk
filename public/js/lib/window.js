/*
	Accepts:
		'window:title'

	Emits:
		'window:focused'
		'window:blurred'
	
	Exports:
		title = window.getTitle();
		window.setTitle(title);

*/
define(['castrato'],function (mediator){

	var exports = {},

		focusCallback = function() {
			mediator.emit('window:focused');
		},
 
		blurCallback = function() {
			mediator.emit('window:blurred');
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

	mediator.on('window:title',exports.setTitle);
 
	return exports;

});