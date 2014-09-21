// Sounds module, used for emitting those annoying bl-up sounds when receiving a message
define(['queue'], function (queue) {

	var exports = { messages: {} },

		ac = false;

	if( window.AudioContext || window.webkitAudioContext ) ac = new ( window.AudioContext || window.webkitAudioContext );

	// Recursive function for playing tones, takes an array of [tone,start_ms,duration_ms] - entries
	// i is only used for recursion
	exports.playTones = function (tones, i) {

		// Parameter defaults
		i = (i === undefined) ? 0 : i;

		// Stop if we've reached the end of iteration, and require ac
		if( !(i < Object.keys(tones).length) || !ac ) return;

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
			exports.playTones(tones,i);
		} else {
			queue.run();

		}

	}; 

	exports.messages = { 
		message: [
			[261.63*2,0,50],
			[261.63*3,0,50],
			[261.63*4,50,50],
			[261.63*5,50,50]
		],
		person_joined: [
			[261.63*3,0,200],
			[261.63*1,0,200],
			[261.63*3,200,500],
			[261.63*2,200,500]
		],
		person_left: [
			[261.63*3,0,200],
			[261.63*2,0,200],
			[261.63*3,200,500],
			[261.63*1,200,500]
		]
	};

	return exports;

});