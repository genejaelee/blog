var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var concat = require('gulp-concat');

gulp.task('browserify', function(){
  var bundler = browserify({
    entries: ['./server.js'],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  });
  var watcher = watchify(bundler);
  
  return watcher
  .on('update', function(){
    var updateStart = Date.now();
    console.log('Updating!');
    watcher.bundle() // Create new bundle that uses the cache for high performance
    .pipe(source('server.js'))
    // This is where you add uglifying etc.
    .pipe(gulp.dest('./build/'));
    console.log('Updated!', (Date.now() - updateStart) + 'ms');
  })
  .bundle()
  .pipe(source('server.js'))
  .pipe(gulp.dest('build/'));
});

// Just run browserify
gulp.task('default', ['browserify']);