define( function( require ) {

    'use strict';
    
	var Postmonger = require( 'postmonger' );

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    var eventDefinitionKey="";	
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
	console.log('Inside Render');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }

    function initialize(data) {
        console.log('Inside initialize : data : '+data);
        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

       console.log('Inside initialize : inArguments : '+inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                
              console.log('Inside initialize : each inArguments : '+inArguments);
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log('Inside onGetTokens : '+tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        
        console.log('Inside onGetEndpoints : '+endpoints);
    }
	

connection.trigger('requestTriggerEventDefinition');

connection.on('requestedTriggerEventDefinition',
function(eventDefinitionModel) {
    if(eventDefinitionModel){

        eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
        console.log("Event Definition Key : " + eventDefinitionKey);
        /*If you want to see all*/
        console.log('eventDefinitionModel : '+JSON.stringify(eventDefinitionModel));
    }

});	

    function save() {

	    var idField="FirstName";
        payload['arguments'].execute.inArguments = [{
            				"ContactKey":"{{Contact.Key}}",
					"FirstName":"{{Contact.Attribute.WebHookAudienceDE.FirstName}}",
                		        "emailAddress": "{{Contact.Attribute.WebHookAudienceDE.Email}}",
					"region": "{{Contact.Attribute.WebHookAudienceDE.Region}}",
					"segment": "{{Contact.Attribute.WebHookAudienceDE.Segment}}",
					"EventFirstName":'{{Event.' + eventDefinitionKey + '.\"' + idField + '\"}}',
			"JourneyDefinitionId": "{{Context.DefinitionId}}",
			"JourneyDefinitionInstanceId": "{{Context.DefinitionInstanceId}}"
        }];
        
        payload['metaData'].isConfigured = true;

        console.log('payload : '+payload);
	 console.log('payload 2 : '+JSON.stringify(payload));
        connection.trigger('updateActivity', payload);
    }


});
