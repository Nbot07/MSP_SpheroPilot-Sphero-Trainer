"use strict";

var sphero = require("../");
var orb = sphero("COM5");

orb.connect(function() {
  orb.streamVelocity();
  orb.streamMotorsBackEmf(6);
  var i =0;
  orb.on("motorsBackEmf", function(data) {
    console.log("::STREAMING MOTORS BACK EMF::");
    //console.log("  data:", data);
    //console.log("  rMotorBackEmf:", data.rMotorBackEmf);
  	console.log("  lMotorBackEmf:", data.lMotorBackEmf.value);
  	i+= data.lMotorBackEmf.value[0];
  	console.log("i =", i);

  });

  //orb.roll(180, 0);
});
