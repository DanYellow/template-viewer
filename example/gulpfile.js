var hello = require('template-viewer');
var gulp = require('gulp');
var swig = require('gulp-swig');
var data = require('gulp-data');


gulp.task('template-viewer-example', function() {
  return gulp.src(['./dev/*.html', './dev/*.swig'])
    .pipe(data(hello({tplToRender: ['index', 'settings'], port:8000, src:'./dev', optimization: true, delayForOldFiles: 300000, tplExtension: '.html'}) ))
    .pipe(swig())
    .pipe(gulp.dest('./public'));
});

gulp.task('default', ['template-viewer-example']);