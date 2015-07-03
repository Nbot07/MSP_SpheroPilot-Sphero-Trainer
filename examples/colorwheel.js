"use strict";

var sphero = require("../");
var orb = sphero("COM5");

orb.connect(function() {
  orb.streamVelocity();
  orb.streamMotorsBackEmf(6); //6 is a good value for 360 degrees to generate around 765
  var red = 255;
  var green = 0;
  var blue = 0;
  var i = 0;

  orb.on("motorsBackEmf", function(data) {
    console.log("::STREAMING MOTORS BACK EMF::");
    console.log("  data:", data);
    i+= data.lMotorBackEmf.value[0]; 
    if (i<0){
      i = 765 + i;}
    if (i<255){
    red= 255-i;
    green = i;
  }
  else if (i<510) {
    green = 510-i;
    blue=i;
  }
  else
  {
    red=i;
    blue = 765-i;
  }
  
   
   console.log("Back EMF = ", data.lMotorBackEmf.value[0]);
   console.log("i =", i);
  if (i>=765){
    i=0;}
  orb.color({ red: red, green: green, blue: blue});
  });

  //orb.roll(180, 0);
});