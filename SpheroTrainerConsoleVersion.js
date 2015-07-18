"use strict";

var sphero = require("../");
var orb = sphero("COM4");

var fs = require('fs');
var keypress = require("keypress");
var prompt = require("prompt")

var writeStream
var header="Yaw"+"\t"
          +"Pitch"+"\t"
          +"Roll"+"\t"
          +"xAccel"+"\t"
          +"yAccel"+"\t"
          +"zAccel"+"\n";
var rows = "";
var stillReading = true
var readingTime=0
var t = 0;

var yaw =0;
var pitch =0;
var roll =0;
                                                              
var x =0;
var y=0;
var z =0;

var initialX =0;
var initialY =0;
var initialZ =0;

var record = false;
var perform = false;

var tailOn=false;

var promptingUser=false

var movename=""
var moveduration=0
var accuracy=0

var luminence=0

console.log("Sphero-Trainer Console Version 1.0");
console.log("Connecting to Sphero...");

orb.connect( function() {
  orb.streamImuAngles(10); //update sensor values 10 times a second
  orb.streamAccelerometer(10);
  listen();
  console.log("Connection Successful, press e to turn on the tail light.");

  orb.on("accelerometer", function(data) {
    x = data.xAccel.value[0];
    y = data.yAccel.value[0];
    z = data.zAccel.value[0];
  });

  orb.on("imuAngles", function(data) {  
    yaw = data.yawAngle.value[0];
    pitch = data.pitchAngle.value[0];
    roll = data.rollAngle.value[0];
    if (tailOn){
      if (perform && !promptingUser && !record){
        //console.log("Debug: t=",t)
        t++
        //wait for 3s then flash green 3 times and stay green while recording
        if(t%5==0 && t>29 && t<61){
          luminence = 255-luminence
          orb.color({ red: 0, green: luminence, blue: 0});
          if (t==60){//Initialize sensors on third green flash
            initialize(false)
            console.log("Sphero is looking up the move "+movename+"...")
          }
        }
        if(t>60){
          if(stillReading)
            t--;
          else
            var endCondition = writeStream.length+59;
        }
        //record data after flashing green 3 times
        if (t>60&&t< endCondition){
          //console.log("Debug: writeStrem", writeStream)
          
          //console.log("Debug: row",writeStream[t-60])
          var row = writeStream[t-60].split('\t')
          var range = 10+1.7*moveduration;//the var moveduration stored the accuracy mark that was input
          var accelRange = 100*(1+moveduration)
          var ra = Math.abs(row[0]-yaw)<=range ? 1 : 0;
          var rp = Math.abs(row[1]-pitch)<=range ? 1 : 0;
          var rr = Math.abs(row[2]-roll)<=range ? 1 : 0; 
          var rx = Math.abs(row[3]-x)<=accelRange ? 1 : 0;
          var ry = Math.abs(row[4]-y)<=accelRange ? 1 : 0;
          var rz = Math.abs(row[5]-z)<=accelRange ? 1 : 0; 
          //console.log("Debug: range=", range)
          //console.log("Debug: row[0] yaw", row[0], yaw)
          //console.log("Debug: %yaw=", Math.abs(row[0]-yaw))
          //console.log("Debug: ra rp rr :",ra,rp,rr)
          accuracy += (ra+rp+rr+rx+ry+rz)/6.0;    
          console.log("Debug accuracy:", accuracy)
        }
        else if (t==endCondition){
          console.log("Debug accuracy:", accuracy)
          accuracy = 100*accuracy/(endCondition-61);
          console.log("Debug accuracy:", accuracy)
          if (accuracy<0){
            accuracy = 0
          }
        }
        //flash blue 3 times for an accuarte move or red 3 times for an inaccurate move
        if(t%5==0 && t>endCondition){
          luminence = 255-luminence
          if (accuracy>=90)
            orb.color({ red: 0, green: 0, blue: luminence});
          else
            orb.color({ red: luminence, green: 0, blue: 0});
          if(t>endCondition+30){
            if(accuracy>=90){
              console.log("Great move, I knew you could do it.");
            }
            else
              console.log("Good effort, you'll get this move down in no time.");
            console.log("You stayed within range "+accuracy+"% of the time.")
            console.log("To preform another move, press p, or press r to record a move.")
            stillReading=true
            accuracy = 0
            perform = false
            rows =""
            t=0
          }
        }
      }
      if(record && !promptingUser && !perform){
        t++
        //wait for 3s then flash green 3 times and stay green while recording
        if(t%5==0 && t>29 && t<61){
          luminence = 255-luminence
          orb.color({ red: 0, green: luminence, blue: 0});
          if (t==60){//Initialize sensors on third green flash
            initialize(true)
          }
        }
        //record data after flashing green 3 times
        if (t>60&&t<moveduration){
          rows+=yaw+"\t"
              +pitch+"\t"
              +roll+"\t"
              +(x-initialX)+"\t"
              +(y-initialY)+"\t"
              +(z-initialZ)+"\n";
        }
        else if (t==moveduration){
          console.log("recording move")
          writeStream.write(header+rows);
          writeStream.close()
        }
        //flash blue 3 times when the recording is finished
        if(t%5==0 && t>moveduration-1){
          luminence = 255-luminence
          orb.color({ red: 0, green: 0, blue: luminence});
          if(t>moveduration+30){
            console.log("Sphero has learned the move, "+movename+".")
            console.log("To record another move, press r, or press p to perform a move.")
            record = false
            t=0
          }
        }
      }
    }
  });
});
function handle(ch, key) {
  if (!promptingUser){
    if (key.ctrl && key.name === "c") {
      console.log("Goodbye")
      process.stdin.pause();
      process.exit();
    }
    if (key.name === "e") {
      if(tailOn)
        console.log("\nThe tail light is already on.");
      tailOn=true
      orb.startCalibration() //Turns on tail light and turns off stabilization 
      console.log("\nTurn the Sphero so that the tail light is facing you.")
      console.log("Press r to record or p to perform a move.")
    }
    if(tailOn){
      if (key.name === "p" && !record) {
        promptUser(true)
        perform=true
      }
      if (key.name === "r" && !perform) {
        promptUser(false)
        record=true 
      }
    }
  }
}
function initialize (write) {
  if (write)
    writeStream = fs.createWriteStream(movename+".xls");
  else{
    fs.readFile(movename+".xls", 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      writeStream = data.split("\n")
      //console.log("Debug: writeStream.length-2=", writeStream.length-2)
      //console.log("Debug: writeStream in readFile\n", writeStream)
      stillReading = false
    });
  }
  orb.finishCalibration() //resets sphero's sensors
  orb.startCalibration()        
  initialX = x;
  initialY = y;
  initialZ = z;
  console.log("INITIALIZED")
}
function listen() {
  keypress(process.stdin);
  process.stdin.on("keypress", handle);
  process.stdin.setRawMode(true);
  process.stdin.resume();
}
function promptUser(performing){
  prompt.start();
  promptingUser=true
  var intInput = performing ? 'margin' : 'moveduration';
  prompt.get(['movename', intInput], function (err, result) {
    if (err) { return onErr(err); }
    console.log('Command-line input received:');
    console.log('  Move Name: ' + result.movename);
    if(performing){
      console.log('  %Margin For Error: ' + result.margin);
      moveduration = result.margin
    }
    else{
      console.log('  Move Duration(s): ' + result.moveduration);
      console.log("Get ready to make your move.")
      console.log("Start moving immediately after Sphero flashes green 3 times.")
      moveduration = 60+result.moveduration*10//convert move duration for recording conditionals
    } 
    movename = result.movename
    //console.log("Debug: movename", movename)      
    promptingUser=false
    prompt.pause()
    listen()
  });
  function onErr(err) {
        console.log("Debug err:",err);
        console.log("Sphero could not find the move "+movename+".")
        console.log("Press r to record or p to perform a move.")
        return 1;
  }  
}