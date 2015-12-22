# template-viewer
template-viewer is a node module to generate printscreens of your html projects. It works as a gulp task (see example/gulpfile to see examples)


##Dev dependencies
- object-assign | Version : "^4.0.1"
- pageres | Version : "3.0.2"
- slugify-url | Version : 1.2.0"

## How use it
1. Install the node module : 
npm install https://github.com/DanYellow/template-viewer#server -D
Because the module is node on npm yet. You have to install manually its dependencies :
cd node_modules/template-viewer && npm install
2. Add it to your gulpfile.js
```
var hello = require('template-viewer');
var data = require('gulp-data');
gulp.task('my-task', function() {
  return gulp.src('__your_gulp_code__') <- your html files sources
    .pipe(data(hello({tplToRender: ['index'], port:8000, rootDir:'./public', optimization: false}) ))
    .pipe('__your_gulp_code__') <- your template engine rendering
    .pipe('__your_gulp_code__'); <- Files destination 
});

3. And start your gulp

```
And _voila_

Note : We use "gulp-data" because the module return an array of objects. And gulp-data is the best options to make it available for your templates.

## Property :
- options :
	- tplToRender {Array}: Array of templates to render 
	- rootDir {String}: Root directory for printscreens. **PRINTSCREENS** ARE ALWAYS PUT IN "printscreens" folder - Default : ".public/".
	- port {Number}: Server port. - Default 3000
	- optimization {Boolean}: Precise if you want to optimize the printscreen rendering. When it sets to "YES", ONLY new pages are rendered, the old one keep their old image - Default : true
@returns {Array} : Array of objects. Example of object : 
**{name: __name_of_the_template__ (aka name of the html file), imgPath: __image_path__, url: __link_to_the_template__}**


## Note :
A project is availaible to test. It's in the folder "example"
To start it :
- cd example
- npm install 
- cd node_modules/template-viewer && npm install
- cd ../..
- Start the node server : node server.js then type "gulp" in your terminal
