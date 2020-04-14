'use strict';


// Deps


var express     = require('express');
var bodyParser  = require('body-parser');
var errorhandler = require('errorhandler');
var http        = require('http');
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require( 'util' );
const jwt = require('jsonwebtoken');
var req     = require('request');
const axios = require('axios');
const CircularJSON = require('circular-json');
var token='';
var segmentData = [];
var couponData2=[];
var datafromCall =[];

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + util.inspect(req.headers));
    console.log("trailers: " + util.inspect(req.trailers));
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " +req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*Get Connection */

function getConnection()
{
var conData = {
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET,
    'grant_type': process.env.grant_type
  	}
	axios({
	  method:'post',
	  url:process.env.AUTHENDPOINT,
	  data: conData,
	  headers:{
       'Content-Type': 'application/json',
	  }
	})
	  .then(function(response) {
		//responsefromWeb.send('Authorization Sent');
	  		token = response.data.access_token;
}).catch(function (error) {
	    console.log(error);
	    //responsefromWeb.send(error);
	  });
}

/* Save Coupon Data**/

function saveContactCoupon(journeyCouponCode,contactFirstName,contactLastName,ContactKey,JourneyDefinitionId,journeyName,
				 eventDefinitionKey,CustomObjectKey,JourneyDefinitionInstanceId,JourneyPublicationId,
			    JourneyVersionNumber, res)
{  var d = new Date();
  var n = d.getTime();
 var conUniqueKey=ContactKey+n;
	
	var couponItem = {"keys":{"conUniqueKey":conUniqueKey},
  			"values":{
					
					"FirstName": contactFirstName,
				        "CouponCode": journeyCouponCode,
				        "LastName": contactLastName,
				        "ContactKey": ContactKey,
				        "CustomObjectKey": CustomObjectKey,
				        "JourneyDefinitionId": JourneyDefinitionId,
				        "eventDefinitionKey": eventDefinitionKey,
				        "JourneyDefinitionInstanceId": JourneyDefinitionInstanceId,
				        "JourneyPublicationId": JourneyPublicationId,
				        "JourneyVersionNumber": JourneyVersionNumber,
				        "JourneyName": journeyName
				
  			}
  		}
  		couponData2.push(couponItem);
	
    axios({
	    method: 'post',
	    url: process.env.RESTENDPOINT+'/hub/v1/dataevents/key:cjacouponpost/rowset',
	    data: couponData2,
	    headers:{
	       'Authorization': 'Bearer ' + token,
	       'Content-Type': 'application/json',
	    }
	  })
	    .then(function(response) {
				var json = CircularJSON.stringify(response);
	      console.log("Data Saved");
	      //responsefromWeb.send(json);
		}) 
		 .catch(function (error) {
			console.log(error);
		});



}


/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    //res.send(200, 'Edit');-express deprecated res.send(status, body)
    res.status(200).send('Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    //res.send(200, 'Save');;-express deprecated res.send(status, body)
     res.status(200).send('Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
	couponData2=[];
	
         // example on how to decode JWT
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {

        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            
            // decoded in arguments
            var decodedArgs = decoded.inArguments[0];
		console.log("decodedArgs : " + util.inspect(decodedArgs));
		console.log("Stringify decodedArgs : " + JSON.stringify(decodedArgs));
		console.log("DEC Contact key : " + decodedArgs.ContactKey);
		console.log("DEC Email : " + decodedArgs.emailAddress);
		console.log("DEC FirstName : " + decodedArgs.FirstName);
		console.log("DEC Region : " + decodedArgs.region);
		console.log("DEC Segment : " + decodedArgs.segment);
		console.log("DEC Event FirstName : " + decodedArgs.EventFirstName);
		console.log("DEC Event journeyCouponCode : " + decodedArgs.journeyCouponCode);
		var journeyCouponCode=decodedArgs.journeyCouponCode;
		var contactFirstName=decodedArgs.EventFirstName;
		var contactLastName=decodedArgs.EventLastName;
		var ContactKey=decodedArgs.ContactKey;
		var JourneyDefinitionId=decodedArgs.JourneyDefinitionId;
		var journeyName=decodedArgs.journeyName;
		var eventDefinitionKey=decodedArgs.eventDefinitionKey;
		var CustomObjectKey=decodedArgs.CustomObjectKey;
		var JourneyDefinitionInstanceId=decodedArgs.JourneyDefinitionInstanceId;
		var JourneyPublicationId=decodedArgs.JourneyPublicationId;
		var JourneyVersionNumber=decodedArgs.JourneyVersionNumber;
		getConnection();
		saveContactCoupon(journeyCouponCode,contactFirstName,contactLastName,ContactKey,JourneyDefinitionId,journeyName,
				 eventDefinitionKey,CustomObjectKey,JourneyDefinitionInstanceId,JourneyPublicationId,JourneyVersionNumber, res);
	
	       logData(req);
            res.send(200, 'Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    //res.send(200, 'Publish');;-express deprecated res.send(status, body)
    res.status(200).send('Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    //res.send(200, 'Validate');;-express deprecated res.send(status, body)
     res.status(200).send('Validate');
};


/*
 * POST Handler for /connecttoMC/ route of Activity.
 */
exports.connecttoMC = function (req, responsefromWeb) {
    // Data from the req and put it in an array accessible to the main app.	
    
    var conData = {
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET,
    'grant_type': process.env.grant_type	    
  	}
	axios({
	  method:'post',
	  url:process.env.AUTHENDPOINT,
	  data: conData,
	  headers:{
       'Content-Type': 'application/json',
	  }
	})
	  .then(function(response) {
		responsefromWeb.send('Authorization Sent');
	  		//responsefromWeb.status(200).send('connecttoMC');
	  		token = response.data.access_token;
		console.log('token : '+token);
	  	
	}).catch(function (error) {
	    console.log(error);
	    responsefromWeb.send(error);
	  });
     
};

/*
 * POST Handler for /getCouponCode/ route of Activity.
 */
exports.getSegmentName = function (req, responsefromWeb) {
getConnection();

segmentData=[];
  axios({
	    method: 'get',
	    url: process.env.RESTENDPOINT+'/data/v1/customobjectdata/key/OFFER_MGMT_SEGMENTS_POC/rowset',
	    data: segmentData,
	    headers:{
	       'Authorization': 'Bearer ' + token,
	       'Content-Type': 'application/json',
	    }
	  })
  .then(function (response) { 
	  
  	datafromCall = response.data.items;
	  
  	for(var x=0;x<datafromCall.length;x++){
  		var couponItem = {
  			"keys":{
  				"SegmentID" : datafromCall[x].keys.Segment_ID
  			},
  			"values":{
					
					"Segment_Name": datafromCall[x].values.Segment_Name
  			}
  		}
  		couponData.push(couponItem);
  	}

    responsefromWeb.send(couponData);
  })
  .catch(function (error) {
    console.log(error);
    responsefromWeb.send(error);
  });
};
