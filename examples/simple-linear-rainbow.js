//Based on the stream-gyroscope.js example
"use strict";

var sphero = require("../");
var orb = sphero("COM4");

orb.connect(function() {//800 ismax sample rate
  orb.streamOdometer(50,false);
//var clr = 0xffffff;
var red = 255;
var green = 0;
var blue = 0;
var i = 0;
orb.on("odometer", function(data) {
  //console.log("data:", data);
  
  if (i<255){
  	red--;
  	green++;
  }
  else if (i<510) {
  	green--;
  	blue++;
  }
  else
  {
    red++;
    blue--;
  }
   i++;
  if (i>=765)
  	i=0;
  orb.color({ red: red, green: green, blue: blue});
  //orb.color(clr);
  //clr+=350;
  //console.log("clr =", clr+1);
});

  //orb.roll(180, 0);
});
