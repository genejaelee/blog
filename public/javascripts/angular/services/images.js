var imagesModule = angular.module('imagesModule', []);

imagesModule.factory('imageProcessorMethods', function($http){
  return {
    editImage: function(image){
      
    },
    
    analyzePixels: function(image, event){
      console.log(event.target);
    }
  }
});