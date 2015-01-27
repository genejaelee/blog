var postsModule = angular.module('postsModule');

postsModule.directive('fileDropzone', function(){
  return {
    restrict: 'A',
    scope: {
      file: '=',
      fileName: '='
    },
    
    link: function(scope, element, attrs) {
      console.log('file drop');
      var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
      processDragOverOrEnter = function(event) {
        if(event != null) {
          event.preventDefault();
        }
        event.dataTransfer.effectAllowed = 'copy';
        return false;
      };
      validMimeTypes = attrs.fileDropzone;
      checkSize = function(size){
        var _ref;
        if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
          return true;
        } else {
          alert("File must be smaller than " + attrs.maxFileSize + " MB");
          return false;
        }
      };
      isTypeValid = function(type) {
        if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
          return true;
        } else {
          alert("Invalid file type.  File must be one of following types " + validMimeTypes);
          return false;
        }
      };
      element.bind('dragover', processDragOverOrEnter);
      element.bind('dragenter', processDragOverOrEnter);
      return element.bind('drop', function(event) {
        var file, name, reader, size, type;
        if (event != null) {
          event.preventDefault();
        }
        reader = new FileReader();
        reader.onload = function(evt) {
          if (checkSize(size) && isTypeValid(type)) {
            return scope.$apply(function() {
              scope.file = evt.target.result;
              if (angular.isString(scope.fileName)) {
                return scope.fileName = name;
              }
            });
          }
        };
        file = event.dataTransfer.files[0];
        name = file.name;
        type = file.type;
        size = file.size;
        reader.readAsDataURL(file);
        return false;
      });
    }
  }
});

postsModule.directive('fileUpload', function () {
  return {
    scope: true,        //create a new scope
    link: function (scope, el, attrs) {
      el.bind('change', function (event) {
        var files = event.target.files;
        //iterate files since 'multiple' may be specified on the element
        for (var i = 0;i<files.length;i++) {
          //emit event upward
          scope.$emit("fileSelected", { file: files[i] });
        }                                       
      });
    }
  };
});