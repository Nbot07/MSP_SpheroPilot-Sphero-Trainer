"use strict";

var sphero = require("../");
var orb = sphero("COM5");

orb.connect(function() {
  orb.streamOdometer();

  orb.on("odometer", function(data) {
    console.log("::STREAMING ODOMETER::");
    console.log("  data:", data);
  });

  orb.roll(180, 0);
});
