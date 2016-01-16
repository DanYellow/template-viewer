# template-viewer
template-viewer is a node module to generate printscreens of your html projects. But there is more : it create a javascript object to inject in your templates, so you can create a toolbar (see example) to access quickly to every templates of your project.


##Dependencies
- object-assign | Version : "4.0.1"
- pageres | Version : "3.0.2"
- slugify-url | Version : "1.2.0"
- underscore | Version : "1.8.3

## How use it
1. Install the node module : 
npm install https://github.com/DanYellow/template-viewer#server -D
2. Add it to your gulpfile.js
```
var hello = require('template-viewer');
var data = require('gulp-data');

gulp.task('my-task', function() {
  return gulp.src('__your_gulp_code__') <- your html files sources
    .pipe(data(hello({tplToRender: ['index'], port:3000, rootDir:'./public', optimization: false}) ))
    .pipe('__your_gulp_code__') <- your template engine rendering
    .pipe('__your_gulp_code__'); <- Files destination 
});

gulp.task('default', ['my-task']);
```
3. And start your gulp

And _voila_

Note : We use "gulp-data" because the module return an array of objects. And gulp-data is the best options to make it available for your templates.

## Property :
- options :
    - tplToRender {Array}: Array of templates to render 
    - dist {String}: directory destination for printscreens. **PRINTSCREENS** ARE ALWAYS PUT IN "printscreens" folder. | **Default : ".public/".** Note : If this directory don't exist he will be created
    - src {String}: Directory of source files | **Default './dev'**
    - port {Number}: Server port. | **Default 3000**
    - optimization {Boolean}: Precise if you want to optimize the printscreen rendering. When it sets to "YES", ONLY new pages are rendered, the old one keep their old image | **Default : true**
    - tplExtension {String}: Extension of your source file | **Default ".html"**
    - delayForOldFiles {Number}: Delay (in milliseconds) before recreate of screenshot already here | **Default 300000 (5 minutes)**
- Return : An object.
    - Key 'templates' : Array of objects. Example of object : <br> 
**{name: __name_of_the_template__ (aka name of the html file), imgPath: __image_path__, url: __link_to_the_template__}**
    - Key 'port' : Current server port 


## Note :
A project is availaible to test. It's in the folder "example".
To start it :
- cd example
- npm install 
- cd node_modules/template-viewer && npm install
- cd ../..
- Start the node server : node server.js then type "gulp" in your terminal
