define(['$.utils', '$.proto'], function (utils, proto) {

	// Create a custom edition of Array, extended with  $.proto
	function ElementArray () {}
	ElementArray.prototype = new Array;
	for(var k in proto) ElementArray.prototype[k] = proto[k];

	// Create to actual dollar function
	function Dollar (selector) {

		var match,
			matches = new ElementArray();

		if (selector !== undefined) {
			if (selector === document) {
				matches.push(document);
			} else if (selector === window) {
				matches.push(window);
			} else {
				if ((match = document.querySelectorAll(selector))) {
					for( var i=0; i < match.length; i++) {
						matches.push(match[i]);
					}
				}
			}
		}

		return matches;

	}

	// Add utils to Dollar
	for(var l in utils) Dollar[l] = utils[l];

	return Dollar;

});