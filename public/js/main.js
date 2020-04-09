'use strict';

requirejs.config({
	paths: {
		postmonger: 'postmonger'
	},
	shim: {
		
		'customActivity': {
			deps: ['postmonger']
		}
	}
});

requirejs(['customActivity'], function ($, customEvent) {
});

requirejs.onError = function (err) {
	if (err.requireType === 'timeout') {
		console.log('modules: ' + err.requireModules);
	}
	throw err;
};
