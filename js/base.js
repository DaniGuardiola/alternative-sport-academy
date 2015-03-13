// Base class
var Belast = function() {
  // Settings
  this.settings = {
    log: {
      banner: "[belast]"
    }
  };

  this.logInfo("Alive!");
};

// Logs
Belast.prototype.logInfo = function(what) {
  this.log(what, "info");
};

Belast.prototype.log = function(what, type) {
  type = type || "log";
  var banner = this.settings.log.banner + " ";
  console[type](banner + what);
};

Belast.prototype.logError = function(what) {
  this.log(what, "error");
};

Belast.prototype.logWarn = function(what) {
  this.log(what, "warn");
};

// Temporal tools
Belast.prototype.inConstruction = function(tile) {
  b.log("This page is in construction, sorry!");
  var tinted = tile.parentNode.querySelector("md-tile[md-fill]");
  tinted.removeAttribute("md-fill");
  tinted.removeAttribute("md-font-color");
  tile.setAttribute("md-fill", "purple");
  tile.setAttribute("md-font-color", "purple");
  setTimeout(md.sidemenu.close, 200);
};

Belast.prototype.closeMovement = function() {
  transition.morphBack();
};

Belast.prototype.favoriteMovement = function(button) {
  if (button.getAttribute("md-fill") === "white") {
    button.setAttribute("md-fill", "red");
  } else {
    button.setAttribute("md-fill", "white");
  }
};

Belast.prototype.infoMovement = function(button) {
  if (button.getAttribute("md-image") === "icon: info_outline") {
    button.setAttribute("md-image", "icon: info");
  } else {
    button.setAttribute("md-image", "icon: info_outline");
  }
};

Belast.prototype.errorsMovement = function(button) {
  if (button.getAttribute("md-image") === "icon: comment-alert-outline") {
    button.setAttribute("md-image", "icon: comment-alert");
  } else {
    button.setAttribute("md-image", "icon: comment-alert-outline");
  }
};


Belast.prototype.switchListGrid = function(fab) {
  if (fab.querySelector("md-icon").getAttribute("md-image") === "icon: view_list") {
    fab.querySelector("md-icon").setAttribute("md-image", "icon: view_module");
  } else {
    fab.querySelector("md-icon").setAttribute("md-image", "icon: view_list");
  }
};


Belast.prototype.loadMovements = function(fab) {
  if (fab.querySelector("md-icon").getAttribute("md-image") === "icon: view_list") {
    fab.querySelector("md-icon").setAttribute("md-image", "icon: view_module");
  } else {
    fab.querySelector("md-icon").setAttribute("md-image", "icon: view_list");
  }
};
