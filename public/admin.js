'use strict';

define('admin/plugins/dev-tracker', ['settings'], function (Settings) {
	var ACP = {};

	ACP.init = function () {
		Settings.load('dev-tracker', $('.dev-tracker-settings'));

		$('#save').on('click', function () {
			Settings.save('dev-tracker', $('.dev-tracker-settings'));
		});
	};

	return ACP;
});
