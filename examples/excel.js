var fs = require('fs');
var writeStream = fs.createWriteStream("file.xls");

var header="Sl No"+"\t"+" Age"+"\t"+"Name"+"\n";
var row1 = "0"+"\t"+" 21"+"\t"+"Rob"+"\n";
var row2 = "1"+"\t"+" 22"+"\t"+"bob"+"\n";

writeStream.write(header+row1+row2);
//writeStream.write(row1);
//writeStream.write(row2);

writeStream.close();

fs.readFile('file.xls', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});