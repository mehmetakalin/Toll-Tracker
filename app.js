/**
 * Built with Pebble.js
 *
 * TODO: This application detects location and adds a count to a variable
 */

var UI = require('ui');
var Vector2 = require('vector2');

// var locationOptions = { enableHighAccuracy: true, maximumAge: 10000,  timeout: 10000 };

var currentSpeed = {property: 0};
var currentCompassPosition =  {property: 0};
var count = 0;

var bountoll = { lat: 41.0418641, lon: 29.0381216 };
var fsmtoll = { lat: 41.09159, lon: 29.0670833 };

var main  = new UI.Window({
    fullscreen: true
  /*  icon: 'images/menu_icon.png',
    bodyColor: '#9a0036' */
  });

var speedtxt = new UI.Text({ position: new Vector2(0, 44), size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'No movement!',
    textAlign: 'center'
  });

var compasstxt = new UI.Text({ position: new Vector2(0, 94), size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'No direction!',
    textAlign: 'center'
  });

 main.add(speedtxt);
 main.add(compasstxt);

// navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
 navigator.geolocation.watchPosition(locationSuccess, locationError);

main.show();

function locationSuccess(pos) {
  var heading = pos.coords.heading;
  var speed = pos.coords.speed;
  var lat = pos.coords.latitude;
  var lon = pos.coords.longitude;
  
  console.log('c='+count+', lat='+lat + ', lon='+lon+ ', head='+heading+', speed='+speed);
  count++;
 
  if (heading !== null && speed !==null && speed > 0) { updateCompass(heading); }
  if (speed !== null) { updateSpeed(speed); }
  
  var bounpass = getDistanceFromLatLonInKm(lat,lon,bountoll.lat,bountoll.lon);                                 
  var fsmpass = getDistanceFromLatLonInKm(lat,lon,fsmtoll.lat,fsmtoll.lon);
  if (bounpass !== 0) { console.log('passing bosphorous over 1st bridge'); //TODO: check heading and update tollpass var
                  }
  if (fsmpass !== 0) { console.log('passing bosphorous over 2nd bridge'); //TODO: check heading and update tollpass var
                 }
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

function updateSpeed(speed) {
    // to is in the range of 45 to 315, which is 0 to 260 km
    //console.log(speed);
    var to = {property: Math.round((speed*3.6/250) *270) + 45};
    currentSpeed = to;
   speedtxt.text(currentSpeed);
   //speedtxt.text(speed);
}

function updateCompass(heading) {
    var to = {property: heading};
    currentCompassPosition=to;
    compasstxt.text(currentCompassPosition);
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}