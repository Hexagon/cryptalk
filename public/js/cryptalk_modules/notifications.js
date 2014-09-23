/*
Usage
 
Native notifications without fallback:
	notification.enableNative(); // Once
	notification.notify("Woop Woop");
	
Native notifications with fallback:
	notification.enableNative(); // Once
	notification.notify("Woop Woop",true); // True in 2nd parameter enables fallback
	
Title blink only:
	notifications.blinkTitleUntilFocus("Woop Woop",1000);
	
*/
define(function (){
 
	var exports = {},
 
		window_active,
		blur_delay_timer,
		native_supported = false,
 
		new_title,
		original_title,
		blink_timer,
		interval,

        now = function () {
            return performance.now() || Date.now();
        },
 
		focusCallback = function() {
			/* Reset everything after regaining focus */
			resetState();
		},
 
		resetState = function() {
			clearTimeout(blur_delay_timer);
			clearTimeout(blink_timer);
			if (original_title !== undefined) setTitle(original_title);
			original_title = undefined;
			new_title = undefined;
			window_active = true;
		},
 
		blurCallback = function() {
			/* Apply a slight delay to prevent notifications from popping when the notifications
			   cause the windows to lose focus */
			clearTimeout(blur_delay_timer);
			blur_delay_timer = setTimeout(function() { window_active = false; },1000);
		},
 
		setTitle = function(t) 	{ document.title = t; },
		getTitle = function() 	{ return document.title; },
 
		doBlink = function() {
			if(!window_active) {
				if( getTitle() == original_title )
					setTitle( new_title );
				else
					setTitle( original_title);
 
				blink_timer = setTimeout(doBlink,interval);
			} else {
				resetState();
			}
		};
 
	exports.enableNative = function() {
		if( native_supported && Notification.permission !== 'denied' ) {
			Notification.requestPermission(function (status) {
				Notification.permission = status;
			});
		}
	};

	exports.windowActive = function() {
		return window_active;
	};
 
	exports.blinkTitleUntilFocus = function(t,i) {
		interval = (i == undefined) ? 1000 : i;
		if (!window_active) {
			new_title = t;
			original_title = getTitle();
			doBlink();
		}
	};
 
	exports.notify = function(title,body,icon,fallback) {
		// Only notify while in background
		if( !window_active ) {

			// Set default value for fallback parameter
			if ( fallback === undefined) fallback = false;

			if ( native_supported && Notification.permission === "granted") {

				// Create notification
				var n = new Notification(title, {body: body, icon:icon});

				// Handle on show event
				n.onshow = function () { 
				  	// Automatically close the notification after 5000ms
					setTimeout(function(){n.close();},3000);
				}

			} else if ( fallback ) {
				exports.blinkTitleUntilFocus("Attention",1000);
			}
		}
	};
 
	native_supported = (window.Notification !== undefined);
 
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
 
	// Make sure we are at square one
	resetState();
 
	return exports;
 
});