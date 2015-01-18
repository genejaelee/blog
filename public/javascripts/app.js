var blogApp = angular.module('blogApp', ['postsModule', 'imagesModule']);

blogApp.controller('mainController', function($scope, $http) {
  console.log('config AWS S3');
  AWS.config.update({accessKeyId: 'AKIAJWMQEUTI2HUPY5GA', secretAccessKey: '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'});
  AWS.config.region = 'us-west-1';
});
