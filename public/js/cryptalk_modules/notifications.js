/*
Usage

	// Send an notification
	mediator.emit('notification:send',{
		title: 'Woop',
		body: 'Woop woop',
		icon: 'gfx/icon.png'
	});

	// Turn notifications on
	mediator.emit('notification:on');

	// Turn notifications off
	mediator.emit('notification:off');

*/
define(['mediator','win'],function (mediator, win){
 
	var enabled = true,
 
		native_supported = false,
 
		new_title,
		original_title,
		blink_timer,
		interval,

		now = function () {
			return performance.now() || Date.now();
		},

		on = function () {
			enabled = true;
		},

		off = function () {
			enabled = false;
		},

		resetState = function() {
			clearTimeout(blink_timer);
			if (original_title !== undefined) setTitle(original_title);
			original_title = undefined;
			new_title = undefined;
			window_active = true;
		},

		doBlink = function() {
			if(enabled) {
				if( win.getTitle() == original_title )
					win.setTitle( new_title );
				else
					win.setTitle( original_title);
 
				blink_timer = setTimeout(doBlink,interval);
			} else {
				resetState();
			}
		},

		enableNative = function() {
			if( native_supported && Notification.permission !== 'denied' ) {
				Notification.requestPermission(function (status) {
					Notification.permission = status;
				});
			}
		},
 
		blinkTitleUntilFocus = function(t,i) {
			interval = (i == undefined) ? 1000 : i;
			if ( enabled ) {
				new_title = t;
				original_title = getTitle();
				doBlink();
			}
		},
 
		notify = function(title,body,icon,fallback) {
			// Only notify while in background
			if( enabled) {

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

	mediator.on('notification:send',function(data) { notify(data.title,data.body,data.icon,true); });
	mediator.on('notification:on',function() { on(); });
	mediator.on('notification:off',function() { off(); });

 	enableNative();

 	off();

	// Make sure we are at square one
	resetState();
 
});