define( function( require ) {

    'use strict';
    
	var Postmonger = require( 'postmonger' );

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    var eventDefinitionKey="";
    var	journeyName="";
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
	   journeyName= eventDefinitionModel.name; 
        console.log("Event Definition Key : " + eventDefinitionKey);
        /*If you want to see all*/
        console.log('eventDefinitionModel : '+JSON.stringify(eventDefinitionModel));
    }

});	

    function save() {

	    var firstName="FirstName";
	    var lastName="LastName";
	    var customObjectKey="_CustomObjectKey";
	    var email="EmailAddress";
	    
	    var journeySegmentName = $("#segmentName").val();
	    var journeySegmentID = $("#segmentID").val();
        payload['arguments'].execute.inArguments = [{
            				"ContactKey":"{{Contact.Key}}",
					"EventFirstName":'{{Event.' + eventDefinitionKey + '.\"' + firstName + '\"}}',
		                        "EventLastName":'{{Event.' + eventDefinitionKey + '.\"' + lastName + '\"}}',
		                        "CustomObjectKey":'{{Event.' + eventDefinitionKey + '.\"' + customObjectKey + '\"}}',
		                        "Email":'{{Event.' + eventDefinitionKey + '.\"' + email + '\"}}',
			                "JourneyDefinitionId": "{{Context.DefinitionId}}",
			                "journeySegmentName": journeySegmentName,
		                        "journeySegmentID":journeySegmentID,
		                        "eventDefinitionKey": eventDefinitionKey,
		                        "journeyName": journeyName,
			                "JourneyDefinitionInstanceId": "{{Context.DefinitionInstanceId}}",
		                        "JourneyDefinitionId": "{{Context.DefinitionId}}",
		                        "JourneyPublicationId": "{{Context.PublicationId}}",
		                        "JourneyVersionNumber": "{{Context.VersionNumber}}"
        }];
        
        payload['metaData'].isConfigured = true;

        console.log('payload : '+payload);
	 console.log('payload 2 : '+JSON.stringify(payload));
        connection.trigger('updateActivity', payload);
    }


});
