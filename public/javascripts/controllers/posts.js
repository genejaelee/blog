var postsModule = angular.module('postsModule', ['imagesModule', 'angularFileUpload']);

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
postsModule.controller('postsNewController', function(uploaderMethods, $scope, $http, $upload) {
  console.log('init new post controller');

  $scope.post = {};
  $scope.post.filepaths = [];
  
  $scope.$on("fileSelected", function (event, args) {
    $scope.$apply(function() {
      $scope.files.push(args.file)
      $scope.post.filepaths.push(args.file.name);
    });
  });
  
  $scope.getAWSCredentials = function(file, callback){
    $http({
      method: "POST",
      url: "/api/aws/credentials",
      headers: {
        "Content-Type": 'application/json'
      },
      data: {
        'file': JSON.stringify(file)
      }
    }).
    success(function (data, status, headers, config) {
      callback(data);
    }); // promise
  }
  
  $scope.postFilesToS3 = function(files, callback) {
    console.log(files);
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      console.log('uploading ' + JSON.stringify(file) + ' client-side');
      // get policy, key, and signature
      $scope.getAWSCredentials(file, function(credentials){
        // now POST
        console.log('about to post to s3');
        $scope.upload = $upload.upload({
          url: 'https://genejaelee-assets.s3.amazonaws.com/',
          method: 'POST',
          data: {
            'bucket' : 'genejaelee-assets',
            'key': file.name,
            'AWSAccessKeyId': credentials.key,
            'acl': 'public-read',
            'policy': credentials.policy,
            'x-amz-algorithm': 'AWS4-HMAC-SHA256',
            'x-amz-credential': credentials.credential,
            'signature': credentials.signature,
            'x-amz-date': credentials.date,
            "Content-Type": 'multipart/form-data',
            'filename': file.name
          },
          file: file,
        }).
        success(function (data, status, headers, config) {
          callback(true);
        });
      });
    }
  }
  
  $scope.$watch('files', function(){
    console.log('length of files changed');
    var toUpload = $scope.files.length;
    var uploaded = 0
    $scope.postFilesToS3($scope.files, function(bool){
      if (bool == true) {
        console.log('succeeded');
        uploaded++;
        if (uploaded == toUpload) {
          console.log('all images uploaded');
          // now post information to server
        }
      }
    });
  });
  
});