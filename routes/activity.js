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
var couponData = [];
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
    console.log("route: " + util.inspect(req.route));
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
	
	
         logData(req);
	/*merge the array of objects.
	var aArgs = req.body.inArguments;
	var inArgs = {};
	for (var i=0; i<aArgs.length; i++) {  
		for (var key in aArgs[i]) { 
			inArgs[key] = aArgs[i][key]; 
		}
	}

	var email = inArgs.emailAddress;
	console.log('email :'+email);*/

	  res.status(200).send('Execute');
    
   
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
    'clientId': process.env.CLIENT_ID,
    'clientSecret': process.env.CLIENT_SECRET  
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
	  		token = response.data.accessToken;
		console.log('token : '+token);
	  	
	}).catch(function (error) {
	    console.log(error);
	    responsefromWeb.send(error);
	  });
     
};

/*
 * POST Handler for /getCouponCode/ route of Activity.
 */
exports.getCouponCode = function (req, responsefromWeb) {
  couponData=[];
  axios({
	    method: 'get',
	    url: process.env.RESTENDPOINT+'/data/v1/customobjectdata/key/getcouponcode/rowset',
	    data: couponData,
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
  				"CouponCode" : datafromCall[x].keys.couponcode
  			},
  			"values":{
					
					"FirstName": 'John'+x
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

/*
 * POST Handler for /postCouponData/ route of Activity.
 */
exports.postCouponData = function (req, responsefromWeb) {
    axios({
	    method: 'post',
	    url: process.env.RESTENDPOINT+'/hub/v1/dataevents/key:cjacouponpost/rowset',
	    data: couponData,
	    headers:{
	       'Authorization': 'Bearer ' + token,
	       'Content-Type': 'application/json',
	    }
	  })
	    .then(function(response) {
				var json = CircularJSON.stringify(response);
	      console.log(json);
	      responsefromWeb.send(json);
		}) 
		 .catch(function (error) {
			console.log(error);
		});
};
