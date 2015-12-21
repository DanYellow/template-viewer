require('handlebars');

var io = require('socket.io-client');
var toolbarTemplate = require("./toolbar.hbs");
var printscreensTemplate = require("./printscreens.hbs");
console.log(io);
var TemplateViewerToolbar = function TemplateViewerToolbar (socketServerPort) {
  if (!socketServerPort) {
      socketServerPort = 5555;
  }

  var self = this;

  var socket = io.connect('localhost:' + socketServerPort);

  this.toolBar = document.getElementById('pages-overview-toolbar');
  var toolbarManager = document.getElementById('toolbar__display-manager');
  var printscreensList = document.getElementsByClassName('printscreens-list')[0];
  var printscreensListItems = document.getElementsByClassName('printscreens-list__item');
  var generatePSBtn = document.getElementById('generatePS');
  
  this.isToolbarCollapsed = true;

  this.init = function() {
    toolbarManager.addEventListener('click', function (e) {
      this.toolbarStatusManager(this.isToolbarCollapsed);
    }, this);

    var elementSelectedIndex = null;
    var getItemSelected = function getItemSelected (index) {
      var currentPage = {index: index, isToolbarCollapsed: self.isToolbarCollapsed}
      window.sessionStorage.setItem('_toolbarCurrentPage', JSON.stringify(currentPage));
    };

    window.addEventListener("load", function() {
      document.body.insertAdjacentHTML('afterend', toolbarTemplate({printscreensDatas: "message.printscreensDatas", port: window.location.port}));

      var elementSelectedIndex = JSON.parse(window.sessionStorage.getItem('_toolbarCurrentPage')).index;
      if (!isNaN(elementSelectedIndex) ) {
        printscreensListItems[elementSelectedIndex].classList.add("active");
        printscreensListItems[elementSelectedIndex].scrollIntoView();
      };
    });

    for (var i = 0; i < printscreensListItems.length; i++) {
        printscreensListItems[i].addEventListener('click', getItemSelected.bind(null, i), false);
    }

    generatePSBtn.addEventListener('click', function (e) {
      if (!socket.connected) {
        alert("Wow ! It looks like the socket server is not started");
        return;
      };
      generatePSBtn.disabled = true;
      socket.emit('doPrintscreens', {port: window.location.port});
    });

    socket.on('printScreensEnded', function(message){
      generatePSBtn.disabled = false;
      printscreensList.innerHTML = printscreensTemplate({printscreensDatas: message.printscreensDatas, port: window.location.port})
      //document.location.reload();
    });
  }

  this.init();

  this.toolbarStatusManager = function toolbarStatusManager () {
    if (this.isToolbarCollapsed) {
      this.toolBar.classList.remove("collapsed");
    } else {
      this.toolBar.classList.add("collapsed");
    }
    this.isToolbarCollapsed = !this.isToolbarCollapsed;
  }
}

module.exports = TemplateViewerToolbar;