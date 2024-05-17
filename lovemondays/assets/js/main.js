(function () {
	'use strict';
	requirejs.config({
		urlArgs: "bust=" + (new Date()).getTime(),
		baseUrl: 'assets/js'
	});

	requirejs(['custom/app'], function (App) {
		return App.init.call(App);
	});
}.call(this));