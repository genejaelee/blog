var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('gulp-browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var concat = require('gulp-concat');

gulp.task('reactify', function(){
  return gulp.src('./public/javascripts/components/**')
    .pipe(browserify({
      transform: [reactify]
    }))
    .pipe(gulp.dest('./public/javascripts/build'));
});

// Just run browserify
gulp.task('default', ['reactify']);