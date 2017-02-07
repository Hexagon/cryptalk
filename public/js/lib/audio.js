/* Usage:
 
	mediator.on('audio:play', playTones );
	mediator.on('audio:on', on );
	mediator.on('audio:off', off );
	mediator.on('audio:mute', mute );
	mediator.on('audio:unmute', unmute );
 
*/
 
// Sounds module, used for emitting those annoying bl-up sounds when receiving a message
define(['queue','castrato','templates'], function (queue,mediator,templates) {
 
	var 
		// Private variables
		ac = false,
		enabled = true,
		muted = false,
 
		// Recursive function for playing tones
		//   accepts an array of [tone,start_ms,duration_ms] - entries
		playTones = function (tones, i) {

			// Parameter defaults
			i = (i === undefined) ? 0 : i;
 
			// Stop if we've reached the end of iteration, and require ac, also stop if we're muted
			if (!ac || !enabled || !(i < Object.keys(tones).length) || muted) {
				return;
			}
 
			// Add tones to execution queue
			var 	current_tones = tones[i],
					freqs = current_tones[0],
					start = current_tones[1],
					duration = current_tones[2];
 
			var o = ac.createOscillator();
			var g = ac.createGain();
			o.frequency.value = freqs;
			o.connect(g);
			g.gain.value = 0.25;
			g.connect(ac.destination);
			queue.add_function_delayed(start,function() { o.noteOn ? o.noteOn(0) : o.start(0); });
			queue.add_function_delayed(start+duration,function() { o.noteOff ? o.noteOff(0) : o.stop(0); });
 
			// Iterate, or start playing
			i++;
			if( i < Object.keys(tones).length  ) {
				playTones(tones,i);
			} else {
				queue.run();
 
			}
 
		},
 
		on = function() {
			enabled = true;
		},
 
		off = function() {
			enabled = false;
		},

		mute = function() {
			muted = true;
			mediator.emit('console:info',templates.messages.muted);
		},
 
		unmute = function() {
			muted = false;
			mediator.emit('console:info',templates.messages.unmuted);
		};
 
 	// Find audio context
	if (window.AudioContext || window.webkitAudioContext) {
		ac = new (window.AudioContext || window.webkitAudioContext);
	}

 	// Connect events
	mediator.on('audio:play', function(tones) {playTones(tones); } );
	mediator.on('audio:on', on );
	mediator.on('audio:off', off );
	mediator.on('audio:mute', mute );
	mediator.on('audio:unmute', unmute );

});