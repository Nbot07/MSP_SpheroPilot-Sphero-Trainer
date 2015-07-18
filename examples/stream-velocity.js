"use strict";

var sphero = require("../");
var orb = sphero("COM5");

orb.connect(function() {
  orb.streamVelocity(10);
  var opts = {
  lmode: 0x01,
  lpower: 75,
  rmode: 0x02,
  rpower: 75
  }
  var t = 0;
  var xt =0;
  var yt =0;
  var xcv=0;
  var ycv=0;
  var xd =0;
  var yd =0;
  orb.on("velocity", function(data) {
    console.log("::STREAMING VELOCITY::");
    console.log("  data:", data);
    t++;
    console.log("total time(s) =", t/10);
    console.log("Xv=", data.xVelocity.value[0]);
    console.log("Yv=", data.yVelocity.value[0]);
    //Keep track of overall Xvelocity and compute distance
    /*if (data.xVelocity.value[0] != 0){
    	xcv+=data.xVelocity.value[0];
    	xt++;
    	xd+= xcv*xt;
    	console.log("Xcv in loop=", xcv);
    	console.log("Xt in loop=", xt);
    	console.log("Xd in loop=", xd);
    }*/
    if (data.xVelocity.value[0] != 0){
    	xd+= data.xVelocity.value[0]/10;
    }
    console.log("Xd=", xd);
    if (data.yVelocity.value[0] != 0){
    	yd+= data.yVelocity.value[0]/10;
    }
    console.log("Yd=", yd);
  // orb.setRawMotors(opts, function(err, data) {
  // console.log(err || "data: " + data);
  // });
  });

  
  
 
});
