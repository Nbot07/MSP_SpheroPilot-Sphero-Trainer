"use strict";

var sphero = require("../");
var orb = sphero("COM5");

var fs = require('fs');
//var writeStream = fs.createWriteStream("gyro720dpsRate800Sum80Scale048.xls");
var header="X"+"\t"+"Y"+"\t"+"Z"+"\n";
var rows = "";

var x =0
var y =0
var z =0
var t=0
//var buffer =0
var i=0
var angle=0
 var opts = {
  lmode: 0x01,
  lpower: 100,
  rmode: 0x02,
  rpower: 100
  }
orb.connect(function() {
  orb.streamGyroscope(10);
  orb.startCalibration();
  orb.on("gyroscope", function(data) {
  	//console.log(data)
  	if(data.zGyro.value[0]<-50)
  		console.log("clockwise");
  	if(data.zGyro.value[0]>50)
  		console.log("counterclockwise")
  	// if(i<80){
  	// 	i++
  	// 	buffer+= data.yGyro.value[0]
  	// }
  	// else{
	  // 	i=0
	  // 	buffer = buffer/80
	  // 	x+= buffer
	  // 	console.log("x=",x)
  	// }
  	//t++
  // 	if (Math.abs(data.yGyro.value[0])>5){
  // 	y+= data.yGyro.value[0]/100000*18;
  	
  // }
  	//console.log("angle=",y*t)
    //console.log("::STREAMING GYROSCOPE::");
    //console.log("  data:", data);
   
    //console.log("zGyro=",data.zGyro.value[0])
    //console.log("yGyro=",data.yGyro.value[0])
    //console.log("xGyro=",data.xGyro.value[0])

  //   orb.setRawMotors(opts, function(err, data) {
  // console.log(err || "data: " + data);
  // });

    // if(i<40){
    // 	i++
    // 	x+=data.xGyro.value[0]*.048
    //     y+=data.yGyro.value[0]*.048
    //     z+=data.zGyro.value[0]*.048
    // }
    // else{
    // 	 //console.log("t=",t/800)
    // rows+=x*.048+"\t"
    //     +y*.048+"\t"
    //     +z*.048+"\n";
    //     angle+=y
    //     i=0
    //     x=0
    //     y=0
    //     z=0
        
    //     console.log("angle=",angle)
    // }
    // if (t/800>10 && t/800<10.01){
    //  writeStream.write(header+rows);
    //  writeStream.close()
    //  console.log("Data Recorded>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    // }
  });

  //orb.roll(180, 0);
});
