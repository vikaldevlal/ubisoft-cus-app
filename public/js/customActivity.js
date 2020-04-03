'use strict';

define(function (require) {
	var Postmonger = require('postmonger');
	var connection = new Postmonger.Session();
	var payload = {};

	$(window).ready(function () {
		connection.trigger('ready');
		connection.trigger('requestInteraction');
	});

	function initialize (data) {
		if (data) {
			payload = data;
		}
	}
	

	function save () {
		payload['arguments'] = payload['arguments'] || {};
		payload['arguments'].execute = payload['arguments'].execute || {};

		payload['arguments'].execute.inArguments = [{
            "ContactKey":"{{Contact.Key}}",
			"FirstName":"{{Contact.Attribute.LatestWebhook.FirstName}}",
            "emailAddress": "{{Contact.Attribute.LatestWebhook.Email}}",
			"region": "{{Contact.Attribute.LatestWebhook.Region}}",
			"JourneyDefinitionId": "{{Context.DefinitionId}}",
			"JourneyDefinitionInstanceId": "{{Context.DefinitionInstanceId}}"
        }];
		payload['metaData'] = payload['metaData'] || {};
		payload['metaData'].isConfigured = true;

		console.log(JSON.stringify(payload));

		connection.trigger('updateActivity', payload);
	}

	connection.on('initActivity', initialize);
	
});
