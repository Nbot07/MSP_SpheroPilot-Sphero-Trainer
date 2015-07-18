"use strict";

var sphero = require("../");
var orb = sphero("COM5");

orb.connect(function() {
  orb.streamImuAngles(10);
  orb.startCalibration()
  orb.on("imuAngles", function(data) {
    console.log("::STREAMING IMU ANGLES::");
    console.log("  data:", data);
  });

  //orb.roll(180, 0);
});
