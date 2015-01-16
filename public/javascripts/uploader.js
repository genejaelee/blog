// dependencies
var fs = require('fs');
var exec = require('child_process').exec;
var inspect = require('util').inspect;
var multiparty = require('multiparty');
var format = require('util').format;

// init variables
var selectedFile;
var files = {};
var FReader;
var name;

var initUploader = function(app){
  console.log('initUploader called');
  app.uploader.uploaderFunctions();
  
  //var uploadButton = doc.getElementById('uploadButton');
  //uploadButton.addEventListener('click', startUpload);  
  //var fileBox = doc.getElementById('fileBox');
  //fileBox.addEventListener('change', fileChosen);
}

var uploaderFunctions = function(){
  console.log('init uploader functions');
  
  function startUpload(event){
    
  }

  function updateBar(percent) {
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('percent').innerHTML = (Math.round(percent*100)/100) + '%';
    var MBDone = Math.round(((percent/100.0) * selectedFile.size) / 1048576);
    document.getElementById('MB').innerHTML = MBDone;
  }

  function fileChosen(event) {
    selectedFile = event.target.files[0];
    document.getElementById('nameBox').val = selectedFile.name;
  }

  function handler (req, res) {
    fs.readFile(__dirname + '/index.jade',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.jade');
      }
      res.writeHead(200);
      res.end(data);
    });
  }
}

// sockets event handlers
var socketEventHandler = function(io) {
  io.sockets.on('connection', function (socket) {
    socket.on('start', function(data) {
      files[name] = {
        fileSize : data['size'],
        data : "",
        downloaded : 0
      }
      var place = 0;
      try {
        var stat = fs.statSync('temp/' + name);
        if(stat.isFile()) {
          files[name]['downloaded'] = stat.size;
          place = stat.size / 524288;
        }
      }
      catch(error){}
        fs.open('temp/' + name, "a", 0755, function (error, fd) {
          if(error){
            console.log(error);
          } else {
            files[name]['handler'] = fd;
            socket.emit('moreData', {
              'place' : place,
              'percent' : 0
            });
          }
        });
    });
  
    socket.on('upload', function(data) {
      var name = data['name'];
      files[name]['downloaded'] += data['data'].length;
      files[name]['data'] += data['data'].length;
      if(files[name]['downloaded'] == files[name]['fileSize']) {
        fs.write(files[name]['handler'], files[name]['data'], null, 'binary', function(error, written) {
          var inp = fs.createReadStream("temp/" + name);
          var out = fs.createWriteStream("../videos/" + name);
          util.pump(inp, out, function(){
              fs.unlink("temp/" + name, function () { //This Deletes The Temporary File
                  //Moving File Completed
              });
          });
          ffmpeg('../videos/' + name)
            .screenshots({
              timestamps: ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%'],
              filename: 'thumbnail-at-%s-seconds.png',
              folder: '../videos/' + name + '-thumbnails/',
              size: '320x240'
            });
        });
      } else if(files[name]['data'].length > 10485760) {
        fs.write(files[name]['handler'], files[name]['data'], null, 'binary', function(error, written) {
          files[name]['data'] = ""; //reset buffer
          var place = files[name]['downloaded'] / 524288;
          var percent = (files[name]['downloaded'] / files[name]['fileSize']) * 100;
          socket.emit('moreData', {
            'place' : place,
            'percent' : percent
          });
        });
      } else {
        var place = files[name]['downloaded'] / 524288;
        var percent = (files[name]['downloaded'] / files[name]['fileSize']) * 100;
        socket.emit('moreData', {
          'place' : place,
          'percent' : percent
        });
      }
    });

    socket.on('moreData', function(data){
      updateBar(data['percent']);
      var place = data['place'];
      var newFile; // the var that will hold new block of data
      if (selectedFile.webkitSlice)
        newFile = selectedFile.webkitSlice(place, place + Math.min(524288, (selectedFile.size-place)));
      else
        newFile = selectedFile.mozSlice(place, place + Math.min(524288, (selectedFile.size-place)));
      FReader.readAsBinaryString(newFile);
    });
  
  });
}

module.exports = {
  socketEventHandler: socketEventHandler,
  initUploader: initUploader,
  uploaderFunctions: uploaderFunctions
}