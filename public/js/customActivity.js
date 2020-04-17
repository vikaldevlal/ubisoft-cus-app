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

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }

    function initialize(data) {
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
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        
    }
	

connection.trigger('requestTriggerEventDefinition');

connection.on('requestedTriggerEventDefinition',
function(eventDefinitionModel) {
    if(eventDefinitionModel){

        eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
	   journeyName= eventDefinitionModel.name; 
        /*If you want to see all*/
        console.log('eventDefinitionModel : '+JSON.stringify(eventDefinitionModel));
    }

});	

	connection.trigger('requestInteraction');
	
	connection.on('requestedInteraction',
function(Interaction) {
    if(Interaction){
        /*If you want to see all*/
        //console.log('Interaction : '+JSON.stringify(Interaction));
    }

});
	
	
    function save() {

	    var firstName="FirstName";
	    var lastName="LastName";
	    var customObjectKey="_CustomObjectKey";
	    var email="EmailAddress";
	    
	    var journeySegmentName = $("#segmentName").val();
	    var journeySegmentID = $("#segmentName").val();
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
					"ActivityId":"{{Activity.Id}}",
					"SegmentName":"{{Interaction.REST-1.SegmentName}}",
			                "JourneyDefinitionInstanceId": "{{Context.DefinitionInstanceId}}",
		                        "JourneyDefinitionId": "{{Context.DefinitionId}}",
		                        "JourneyPublicationId": "{{Context.PublicationId}}",
		                        "JourneyVersionNumber": "{{Context.VersionNumber}}"
        }];
        
        payload['metaData'].isConfigured = true;

	 console.log('payload 2 : '+JSON.stringify(payload));
        connection.trigger('updateActivity', payload);
    }


});
