"use strict";

var sphero = require("../");
var orb = sphero("COM5");

var fs = require('fs');
//var writeStream = fs.createWriteStream("toss_and_place_back_and_forth.xls");

var header="X"+"\t"+"Y"+"\t"+"Z"+"\n";
var rows = "";

var t = 0;
orb.connect(function() {
  orb.streamAccelerometer(10);

  orb.on("accelerometer", function(data) {
  	t+=0.1
  	orb.startCalibration();
    console.log("::STREAMING ACCELEROMETER::");
    console.log("  data:", data);
    console.log("t=",t)
    rows+=data.xAccel.value[0]+"\t"
    	 +data.yAccel.value[0]+"\t"
    	 +data.zAccel.value[0]+"\n";
    // if (t>=20 && t<20.1){
    // 	writeStream.write(header+rows);
    // 	writeStream.close()
    // 	console.log("Data Recorded>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    // }
  });


  
  //orb.roll(180, 0);
});
