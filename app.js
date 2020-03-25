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
var weatherData = [];

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
app.get('/getweather', function(request, responsefromWeb) {
  axios.get('https://api.weather.gov/alerts/active/area/MN')
  .then(function (response) {
  	var datafromCall = response.data.features;
  	for(var x=0;x<datafromCall.length;x++){
  		var weatherItem = {
  			"keys":{
  				"theid" : datafromCall[x].properties.id
  			},
  			"values":{
					"field1": datafromCall[x].type,
					"field2": datafromCall[x].properties.sender
  			}
  		}
  		weatherData.push(weatherItem);
  	}
    responsefromWeb.send(response.data.features);
  })
  .catch(function (error) {
    console.log(error);
    responsefromWeb.send(error);
  });
})

app.get('/connecttoMC', function(request, responsefromWeb) {
	console.log('Client ID : '+process.env.CLIENT_ID);
	var conData = {
    'clientId': '6c904kcbpl8plxcyb671eu2a',
    'clientSecret': '75ZDElqnzzg2AglCNaU5D7Ih'  
  	}
	axios({
	  method:'post',
	  url:'https://mc7gdqrf6hn02-0-h9j22dns1twq.auth.marketingcloudapis.com/v1/requestToken',
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
	    url: 'https://mc7gdqrf6hn02-0-h9j22dns1twq.rest.marketingcloudapis.com/hub/v1/dataevents/key:testdataextension1/rowset',
	    data: weatherData,
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
