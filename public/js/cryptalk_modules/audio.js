/* Usage:
 
	mediator.emit('audio:play',message);
	mediator.emit('audio:on');
	mediator.emit('audio:off');
 
*/
 
// Sounds module, used for emitting those annoying bl-up sounds when receiving a message
define(['queue','mediator'], function (queue,mediator) {
 
	var ac = false,
		enabled = true,
 
		// Recursive function for playing tones, takes an array of [tone,start_ms,duration_ms] - entries
		// i is only used for recursion
		playTones = function (tones, i) {
 
			// Parameter defaults
			i = (i === undefined) ? 0 : i;
 
			// Stop if we've reached the end of iteration, and require ac
			if (!ac || !enabled || !(i < Object.keys(tones).length)) {
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
			queue.add_function_delayed(start,function() { o.noteOn(0); });
			queue.add_function_delayed(start+duration,function() { o.noteOff(0); });
 
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
		};
 
	if (window.AudioContext || window.webkitAudioContext) {
		ac = new (window.AudioContext || window.webkitAudioContext);
	}
 
	mediator.on('audio:play', function (message) { playTones(message); });
	mediator.on('audio:on', function (message) { on(); });
	mediator.on('audio:off', function (message) { off(); });
 
});