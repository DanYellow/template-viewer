var app = require('express')();
var http = require('http').Server(app);
var path = require("path");
var fs = require("fs");
var assign = require('object-assign');
var Pageres = require('pageres');

// @PrintscreensDatas
// @desc : Create an array of object to create printscreens
// @param {Object} options - Options of the module
//  options.tplToRender {Array}: Array of html file to rendered. Default : empty. NOTE : Avoid a big number of file or else your computer can be very slow
//  options.rootDir {String}: Root directory for printscreens. **PRINTSCREENS** ARE ALWAYS PUT IN "printscreens" folder - Default : ".public/". NOTE : if the directory doesn't exist it will be created 
//  option.port {Number}: Server port. 
var PrintscreensDatas = function PrintscreensDatas (options) {
  var imageFileTypeAccepted = [".jpg", ".jpeg", ".png"];
  var filesCountMax = 0; // Number of element eligible for printscreens
  var filesCount = 0;
  var opts;

  this.init = function (options) {
    opts = assign({}, options);

    if (!opts.tplToRender) opts.tplToRender = []; 
    if (!opts.rootDir) opts.rootDir = './public'; 
    if (!opts.port) opts.port = 3000; 

    var files = fs.readdirSync('./public')
    files.filter(function(file) { return file.substr(-5) === '.html' && opts.tplToRender.indexOf(file.split('.html')[0]) > -1 })
    .map(function (file) {
        // Prefix every html file by the root
        return 'http://127.0.0.1:'+ port + '/' + file;
    });

    filesCountMax = files.length;

    files.forEach(function (file) {
      // Prefix every html file by the root

      var pageres = new Pageres()
          .src(file, ['1000x1000'], {
            crop: false,
            filename: "<%= url %>",
            hide: ["#pages-overview-toolbar", "#__bs_notify__"],
            format: "jpg"
          })
          .dest(printscreensDestDirectory)
          .run()
          .then(() => dispatchGroupEmit());
    });
  }
  
  this.init(options);

  var dispatchGroupEmit = function dispatchGroupEmit() {
    if(filesCount >= filesCountMax-1) { 
      filesCount = 0;
      generatePrintScreensDatas();
    }
    filesCount++;
  }

  // @generatePrintScreensDatas
  // @desc : Generate a JSON Object contained every datas of the printscreens
  // @returs JSON Object
  return generatePrintScreensDatas = function generatePrintScreensDatas () {
    var printscreenPath = printscreensDestDirectory
    var printscreensArray = [];
    var fileName = "", url = "", tplName = "";

    try {
      var isFolderExists = fs.lstatSync(printscreenPath);
      if (isFolderExists.isDirectory()) {
        var files = fs.readdirSync(printscreenPath)

        files = files.map(function (file) {
          return path.join(printscreenPath, file);
        }).filter(function (file) {
            return fs.statSync(file).isFile();
        }).forEach(function (file) { 
            fileName = path.basename(file, path.extname(file))
            tplName = fileName.split('!')[fileName.split('!').length-1].split('.')[0];

            url = tplName + ".html";

            if (imageFileTypeAccepted.indexOf(path.extname(file)) > -1) {
              var tplToolbarObject = {tplName: tplName, imgPath: printscreensDirectory + '/' +fileName+path.extname(file), path: url};
              printscreensArray.push(tplToolbarObject);
            }
        });
      }
    } catch (e) {

    }

    return printscreensArray;
  }
}

module.exports = PrintscreensDatas;