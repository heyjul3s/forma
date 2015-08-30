/*--------------------------------------------------------------
	FORMA JS CHAR COUNTER
--------------------------------------------------------------*/

//CHARACTER COUNTER

	'use strict';

	var charCount = {
		setupCounter : function(el, counter){
			
			var counter = counter;
			var maxLength;

			if ( el.hasAttribute('max-length') ) {
				maxLength = el.getAttribute('max-length');
				if ( el.value.length > maxLength ) {
					el.value = el.value.substring(0, maxLength);
				} else {
					counter.textContent = maxLength - el.value.length;
				}
			}
			
		},
		showCounter : function(counter) {
			if ( !klass.has(counter, 'active') )  klass.add(counter, 'active');
		},
		hideCounter : function(counter) {
			if ( klass.has(counter, 'active') )  klass.remove(counter, 'active');
		}
	};
