require('handlebars');

var io = require('socket.io-client');
var toolbarTemplate = require("./toolbar.hbs");
var printscreensTemplate = require("./printscreens.hbs");

var TemplateViewerToolbar = function TemplateViewerToolbar (socketServerPort) {
  if (!socketServerPort) {
      socketServerPort = 5555;
  }

  var self = this;

  this.socket = io.connect('localhost:' + socketServerPort);

  this.isToolbarCollapsed = true;

  this.init = function() {
    window.addEventListener("load", function() {
      document.body.insertAdjacentHTML('afterend', toolbarTemplate({printscreensDatas: "message.printscreensDatas", port: window.location.port}));

      self.bindEvents();

      if (window.sessionStorage.getItem('_toolbarCurrentPage')) {
        var elementSelectedIndex = JSON.parse(window.sessionStorage.getItem('_toolbarCurrentPage')).index;
        if (!isNaN(elementSelectedIndex) ) {
          self.printscreensListItems[elementSelectedIndex].classList.add("active");
          self.printscreensListItems[elementSelectedIndex].scrollIntoView();
        };
      };
    });
  }
    
  this.init();


  this.bindEvents = function bindEvents () {
    self.toolBar = document.getElementById('pages-overview-toolbar');
    self.toolbarManager = document.getElementById('toolbar__display-manager');
    self.printscreensList = document.getElementsByClassName('printscreens-list')[0];
    self.printscreensListItems = document.getElementsByClassName('printscreens-list__item');
    self.generatePSBtn = document.getElementById('generatePS');

    toolbarManager.addEventListener('click', function (e) {
      this.toolbarStatusManager(this.isToolbarCollapsed);
    }, this);

    for (var i = 0; i < self.printscreensListItems.length; i++) {
        self.printscreensListItems[i].addEventListener('click', self.getItemSelected.bind(null, i), false);
    }

    self.generatePSBtn.addEventListener('click', self.generatePrintscreens);
  };


  this.generatePrintscreens = function generatePrintscreens (e) {
    if (!self.socket.connected) {
      alert("Wow ! It looks like the socket server is not started");
      return;
    };
    generatePSBtn.disabled = true;
    self.socket.emit('doPrintscreens', {port: window.location.port});
  }


  this.getItemSelected = function getItemSelected (index) {
    var currentPage = {index: index, isToolbarCollapsed: self.isToolbarCollapsed};
    window.sessionStorage.setItem('_toolbarCurrentPage', JSON.stringify(currentPage));
  };

  this.toolbarStatusManager = function toolbarStatusManager () {
    if (this.isToolbarCollapsed) {
      this.toolBar.classList.remove("collapsed");
    } else {
      this.toolBar.classList.add("collapsed");
    }
    this.isToolbarCollapsed = !this.isToolbarCollapsed;
  };

  this.socket.on('printScreensEnded', function(message){
    self.generatePSBtn.disabled = false;
    self.printscreensList.innerHTML = printscreensTemplate({printscreensDatas: message.printscreensDatas, port: window.location.port});
  });
}

module.exports = TemplateViewerToolbar;