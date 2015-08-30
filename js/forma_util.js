/*--------------------------------------------------------------
	FORMA JS UTILITIES
--------------------------------------------------------------*/
	'use strict';

	// Selectors
	var $id = function(el, id) {
		return el.getElementById(id);
	};

	var $qr = function(el, qr) {
		return el.querySelector(qr);
	};

	var klass = {
		add : function(el, cl) {
			return el.classList.add(cl.trim());	
		},
		remove : function(el, cl) {
			return el.classList.remove(cl.trim());	
		},
		toggle : function(el, cl) {
			return el.classList.toggle(cl.trim());	
		},
		has : function(el, cl) {
			return el.classList.contains(cl.trim());
		}
	};

	// Utils
	var isString = function(val) {
		if (typeof val === 'string' || val instanceof String) return true;
	};

	var htmlEntities = function(val) {
		return String(val)
				.replace( /&/g, '&amp;'  )
				.replace( /</g, '&lt;'   )
				.replace( />/g, '&gt;'   )
				.replace( /"/g, '&quot;' );
	};

	var createEl = function(tag, args) {
		var el = document.createElement(tag);

		if (args){
			if (args.className) el.className = args.className;
			if (args.appendTo) args.appendTo.appendChild(el);
		}
		return el;
	};