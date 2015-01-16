var postsModule = angular.module('postsModule', ['imagesModule']);

postsModule.factory('uploaderMethods', function($http){
  return {
    postUpload: function(post) {
      console.log('POSTING : ' + post);
      console.log(post.title);
      console.log(post.body);
      console.log(post.fileName);
      
      var request = $http({
        method: "post",
        url: "/posts",
        data: post
      });
      
      request.success(
        function(html) {
          console.log(html);
        }
      )
    },
    
    postForm: function(post, files) {
      $http({
        method: "Post",
        url: "/posts/create",
        headers: { 'Content-Type' : 'application/json' },
        data: {
          'post': post,
          'path': files[0].name
        }
      }).
      success(function (data, status, headers, config) {
        console.log('success ' + data);
      }).
      error(function (data, status, headers, config) {
        alert("failed!");
      });
    },
    
    saveLocalFile: function(files) {
      console.log("about to post:" + files);
      $http({
        method: "Post",
        url: "/posts/save_image",
        headers: { 'Content-Type' : 'multipart/form-data;boundary=xxxxxxxx' },
        data: {
          'files': files
        }
      }).
      success(function (data, status, headers, config) {
        var fileName = files[0].name;
        return fileName;
      }); // promise
    },
    
    startUpload: function(event) {
      console.log('starting upload!');
      if (document.getElementById('fileBox').val != "") {
        FReader = new FileReader();
        name = document.getElementById('nameBox').val;
        var content = "<span id='nameArea'>Uploading " + selectedFile.name + " as " + name + "</span>";
        content += "<div id='progressContainer'><div id='progressBar'></div></div><span id='percent'>0%</span>";
        content += "<span id='uploaded'> - <span id='MB'>0</span>/" + Math.round(selectedFile.size / 1048576) + "MB</span>";
        document.getElementById('uploadArea').innerHTML = content;
        FReader.onload = function(event) {
          socket.emit('upload', { 
            'name' : name,
            'data' : event.target.result
          });
        }
        socket.emit('start', {
          'name' : name,
          'size' : selectedFile.size
        });
      } else {
        alert("Please select a file");
      }
    }
  }
})

//////////// VIEW CONTROLLER ////////////
postsModule.controller('postsViewController', function($scope, $http, imageProcessorMethods) {
  console.log('init post view controller');
  $scope.images = [];
  console.log('images loaded ' + $scope.images);
  
  $scope.stringifyImages = function(object) {
    console.log('stringifying')
    return JSON.stringify(object);
  }
  
  $scope.clickImage = function(image, $event){
    imageProcessorMethods.analyzePixels(image, $event);
  }
});

//////////// NEW CONTROLLER ////////////
postsModule.controller('postsNewController', function(uploaderMethods, $scope, $http) {
  console.log('init new post controller');

  $scope.files = [];
  $scope.post = {};
  $scope.post.filepaths = [];
  
  $scope.$on("fileSelected", function (event, args) {
    $scope.$apply(function() {
      $scope.files.push(args.file)
      $scope.post.filepaths.push(args.file.name);
    });
  });
  
  $scope.startUpload = function (){
    console.log('POSTING : ' + JSON.stringify($scope.post));
    uploaderMethods.saveLocalFile($scope.files);
    uploaderMethods.postForm($scope.post, $scope.files);
    //uploaderMethods.postUpload($scope.post);
  }
});