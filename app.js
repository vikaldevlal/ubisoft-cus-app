'use strict';
// Module Dependencies
// -------------------
var express     = require('express');
var bodyParser  = require('body-parser');
var errorhandler = require('errorhandler');
var http        = require('http');
var path        = require('path');
var request     = require('request');
var routes      = require('./routes');
var activity    = require('./routes/activity');
const axios = require('axios');
const CircularJSON = require('circular-json');
var token='';
var couponData = [];
var datafromCall =[];

var app = express();

// Configure Express
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.raw({type: 'application/jwt'}));
//app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.methodOverride());
//app.use(express.favicon());

app.use(express.static(path.join(__dirname, 'public')));

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

app.get('/', function(request, response) {
  response.send('Hello World!')
})
app.get('/getCouponCode', function(request, responsefromWeb) {
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
	responsefromWeb.send(response);
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
    responsefromWeb.send(CircularJSON.stringify(response));
  })
  .catch(function (error) {
    console.log(error);
    responsefromWeb.send(error);
  });
})

app.get('/connecttoMC', function(request, responsefromWeb) {
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
	  		token = response.data.accessToken;
	  	
	}).catch(function (error) {
	    console.log(error);
	    responsefromWeb.send(error);
	  });
})

app.get('/connecttoMCData', function(request, responsefromWeb) {
	
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
})
 

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
