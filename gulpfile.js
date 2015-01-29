var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('gulp-browserify');
var watch = require('gulp-watch');
var reactify = require('reactify');
var concat = require('gulp-concat');
var rename = require("gulp-rename");

gulp.task('reactify', function(){
  return gulp.src('./public/javascripts/components/*.jsx')
    .pipe(browserify({
      transform: [reactify]
    }))
    .pipe(rename(function(path){
      path.extname = ".js"
    }))
    .pipe(gulp.dest('public/javascripts/build'));
    console.log('updated');
});

// Just reactify
gulp.task('default', ['reactify']);

gulp.task('watch', function(){
  gulp.watch('./public/javascripts/components/*.jsx', ['reactify']);
})