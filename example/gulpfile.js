var hello = require('template-viewer');
var gulp = require('gulp');
var swig = require('gulp-swig');
var data = require(' ');


gulp.task('json-test', function() {
  return gulp.src('./public/index.html')
    .pipe(data(hello({tplToRender: ['index'], port:8000, rootDir:'./public'}) ))
    .pipe(swig())
    .pipe(gulp.dest('./public/'));
});

gulp.task('default', ['json-test']);