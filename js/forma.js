/*--------------------------------------------------------------
	FORMA JS 
--------------------------------------------------------------*/

	'use strict';

	// FORM
	var Form = {
		id : function(id) {
			return document.getElementById(id);
		},
		target : function(ev) {
			return ev.target;	
		},
		targetParent : function(ev) {
			return ev.target.parentNode;
		}
	};





	// FORM CONFIGURATION
	var formConfig = {
		'name' : {
			checks : ['required', 'name'],
			field : 'name'
		},
		'email' : {
			checks : ['required', 'email'],
			field : 'e-mail'
		},
		'comment' : {
			checks : ['required'],
			field : 'comment'
		}
	};





	// CONFIG HANDLER
	var configHandler = Object.create(Form);

		configHandler.checksArray = function(obj) {
			return Array.isArray(obj.checks) ? obj.checks : [obj.checks];
		};

		configHandler.getValidations = function(check) {
			
			if ( isString( check ) && validator.type[check] ) {
				return validator.type[check];	
			}
			
		};

		configHandler.setup = function(config) {
			
			var config   = config || {};
			var inputObj = [];

			for (var key in config) {
				if (config.hasOwnProperty(key)) {
					var checks = configHandler.checksArray(config[key]);

					checks.forEach(function(check, i){
						inputObj.push({
							ctrl: $id(document, key),
							check: configHandler.getValidations(check)
						});					 
					});
				}
			}
			
			return inputObj;
			
		};





	// VALIDATOR
	var validator = Object.create(configHandler);

		validator.type = {
			'required': {
				test: function(val) {
					var emptyString = isString(val) && val.trim() === '';
					return val !== undefined && val !== null && !emptyString;
				},
				hint: 'This field required'
			},
			'name' : {
				test: function(value) {
					var re = /^[a-z0-9_\-]+$/i;
					return re.test(value);
				},
				hint: 'Use " - ", " _ " and alphanumerics only.'
			},
			'email': {
				test: function(value) {
					var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
					return re.test(value);
				},
				hint: 'Enter ie. my@email.com'
			}
		};

		validator.setupField = function(elCreate, cl, parent) {
			
			var elExist = elCreate + '.' + cl;

			if ( !parent.contains($qr(parent, elExist)) ) {
				createEl( elCreate, {
					className: cl,
					appendTo: parent
				});
			}
			
		};

		validator.confirmField = function(el) {
			if ( isString(el.value) ) return el.check.test(htmlEntities(el.value)) === true;
		};

		validator.isNeutral = function(removals, el) {
			
			var elem 		= el,
				elemClasses = [].slice.call(elem.classList),
				toRemove 	= removals.split(' ');

			if ( el === undefined || el === null ) {
				return;
			} else {
				for (var i = 0; i < toRemove.length; i += 1) {
					elemClasses.some(function(cl, j){
						if (cl === toRemove[i]) {
							klass.remove(elem, cl);
						} else {
							return;
						}
					});	
				}
			}
			
		};

		validator.allTrue = function(el, i , vObjList) {
			return 	el === true;
		};

		validator.noSubmit = function(el) {
			return el.disabled = true;
		};

		//return all fields with configs in array vObjList
		validator.processValObj = function(config) {

			config = validator.setup(config);
			var checks = [],
				vObjList = [];

			config.forEach(function(field, i){
				checks.push(field);

				var fields = checks[i];

				vObjList.push({
					ctrl  : fields.ctrl,
					value : fields.ctrl.value,
					check : fields.check
				});
			});

			return vObjList;
		};

		validator.validateAllFields = function(config, ev){

			var inputField = validator.target(ev),
				results    = [];
			
			config.forEach(function(field, i){
				results.push( validator.confirmField(field) );
			});

			return results;
		};

		//promise to handle submit button states
		//if not all fields valid, disable, otherwise enable
		validator.isSubmitable = function(vObjList) {

			var promise = new Promise(function(resolve, reject){

				if ( vObjList.every(validator.allTrue) ) {
					resolve(vObjList);
				} else {
					reject(vObjList);
				}

			});

			promise.then(function(){

				$id(document, 'submit').disabled = false;

				klass.remove ( $id(document, 'submit'), 'disabled' );
				klass.add	 ( $id(document, 'submit'), 'enabled'  );

			}).catch(function(){

				$id(document, 'submit').disabled = true;

				klass.remove ( $id(document, 'submit'), 'enabled'  );
				klass.add	 ( $id(document, 'submit'), 'disabled' );

			});
		};

		//filter configs not specific to field for use in single field validation
		validator.processFieldValObj = function(config, ev) {
			
			var inputField  = validator.target(ev),
				fieldValObj = [];

			for (var i = 0; i < config.length; i += 1) {
				if (config[i].ctrl === inputField) {
					fieldValObj.push(config[i]);
				}
			}
			
			return fieldValObj;
			
		};

		validator.validateThisField = function(config) {
			
			var errorTxt = '';

			config.some(function(el, i){

				var hintSpan 	  = $qr( el.ctrl.parentNode, 'span.indicator' ),
					otherHintSpan = $qr( el.ctrl.parentNode.parentNode, 'span.hint' );

				if ( !validator.confirmField(el) ) {
					errorTxt += el.check.hint;
					otherHintSpan.textContent = errorTxt;

					klass.add(hintSpan, 'error');
					klass.add(otherHintSpan, 'visible');

					return errorTxt;
				} else if ( config.every(validator.confirmField) ) {

					klass.add(hintSpan, 'success');
					return true;
				}
			});
			
		};



		//FORMA
		var forma = Object.create(validator);

		forma.counterEvents = function(el, ev, fn) {
			
			var evs = ev.split(' ');

			for (var i = 0; i < evs.length; i += 1) {
				el.addEventListener(evs[i], fn, true);
			}
			
		};

		forma.init = function() {
			
			var form = forma.id('form');
			
			forma.noSubmit( $id(document, 'submit') );

			forma.counterEvents( form, 'focus keyup keydown', function(ev){
				
				charCount.setupCounter(
					forma.target(ev), 
					$qr(forma.targetParent(ev), 'span.char-count')
				);
				
			});
			
			form.addEventListener('submit', function(ev) {
				ev.preventDefault();
				return false;
			}, true);

			form.addEventListener('blur', function(ev){
				
				var formaConfig = forma.processValObj( formConfig );

				forma.isSubmitable		( forma.validateAllFields  (formaConfig, ev)     );
				forma.validateThisField ( forma.processFieldValObj (formaConfig, ev) 	 );
				charCount.hideCounter	( $qr(forma.targetParent(ev), 'span.char-count') );
				
			}, true);

			form.addEventListener('focus', function(ev){
				
				var parent 			= forma.targetParent(ev),
					grandparent 	= forma.targetParent(ev).parentNode,
					fieldReady 		= forma.setupField.bind ( this, 'span' ),
					neutraliseField = forma.isNeutral.bind  ( this, 'error success visible' );

				fieldReady	    	   ( 'indicator', parent 			);
				fieldReady	    	   ( 'hint', grandparent 		    );
				neutraliseField 	   ( $qr(parent, 'span.indicator') 	);
				neutraliseField 	   ( $qr(grandparent, 'span.hint')  );
				charCount.showCounter  ( $qr(parent, 'span.char-count') );
				
			}, true);	
		};




		//Initialise
		document.addEventListener('DOMContentLoaded', function() {
			forma.init();
		}, false);