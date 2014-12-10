var Materializer= function() {
  this.path = '';
  this.initFuncs = new Array();

  /* Elements */
  this.greylayer = null;
  this.sidemenu = null;
  this.fab = null;
  this.content = null;

  this.observer = null;
}

Materializer.prototype.initListener= function(func) {
  this.initFuncs.push(func);
}

Materializer.prototype.init= function() {
  // Init materializer path
  var url = document.querySelector("link[href*='materializer.css']").href;
  this.path = url ? url.substring(0, url.indexOf('materializer.css')) : '';

  // Init elements
  if (!document.querySelector('md-greylayer')) {
    document.body.appendChild(document.createElement('md-greylayer'));
  }

  // Init materializer objects
  var elements = document.getElementsByTagName('*');
  var length = elements.length;
  for(var i=0; i<elements.length; i++) {
    //console.log("ELEMENTOS ESTATICO " + length + " ELEMENTOS DINAMICO " + elements.length);
    var el = elements[i];
    //console.log("ENCONTRADO " + el.tagName);
    if(el.tagName.indexOf('MD') === 0) {
      //console.log("VOY A PROCESAR " + el.tagName);
      this.addMDMethods(el);
      //console.log("PROCESADO " + el.tagName);
    }    
  }

  // Mutation observer initializing...
  this.observer = new MutationObserver(this.observeMDElements);
  var config = { attributes: false, childList: true, characterData: false, subtree: true };
  this.observer.observe(document.body, config);

  this.initFuncs.forEach(function(initFunc){
    initFunc();
    //var loadEvent = new Event('md-load');
    //window.dispatchEvent(loadEvent);
  });
};

Materializer.prototype.addMDMethods= function(element) {
  var tag = element.tagName.toLowerCase();

  if(tag.indexOf("md-") >= 0) {
    if(element.alreadyInitialized) {
      //console.log("ELEMENT " + element.tagName + " ALREADY INITIALIZED");
      return;
    }
    // INCICIALIZACION DE FUNCIONES GENERALES
    initGlobalMDFunctions(element, this);

    if(tag=="md-snackbar") {
      initMDSnackBar(element, this);
    } else if(tag=="md-button") {
      initMDButton(element, this);
    } else if(tag=="md-input-submit") {
      initMDInputSubmit(element, this);
    } else if(tag=="md-input") {      
      initMDInput(element, this);
    } else if(tag=="md-list") {
      initMDList(element, this);
    } else if(tag=="md-icon" || tag=="md-avatar") {
      initMDIcon(element, this);
    } else if(tag=="md-sidemenu") {
      initMDSidemenu(element, this);
      this.sidemenu = element;
    } else if(tag=="md-icon-button") {
      initMDIconButton(element, this);
    } else if(tag=="md-greylayer") {
      initMDGreylayer(element, this);
      this.greylayer = element;
    } else if(tag=="md-menu") {
      initMDMenu(element, this);
    } else if(tag=="md-tabbar") {
      initMDTabBar(element, this);
    } else if(tag=="md-toolbar") {
      initMDToolBar(element, this);
      this.toolbar = element;
    } else if(tag=="md-switch") {
      initMDSwitch(element, this);
    } else if(tag=="md-fab") {
      initMDFab(element, this);
      this.fab = element;
    } else if(tag=="md-content") {
      this.content = element;
    }
  }
};

Materializer.prototype.create= function(what,opt){
  if (what === "snackbar") {
    var newSnackbar = document.createElement('md-snackbar');
    if (opt.text) {
      var text = document.createElement('md-text');
      text.innerText = opt.text;
      newSnackbar.appendChild(text);
    }
    if (opt.position) {
      newSnackbar.setAttribute('md-position',opt.position);
    } else {
      newSnackbar.setAttribute('md-position','bottom right');
    }
    document.body.appendChild(newSnackbar);
    initMDSnackBar(newSnackbar);
  }
};

Materializer.prototype.observeMDElements = function(mutations) {
  var mat = this;

  mutations.forEach(function(mutation) {
    if(mutation.type === 'childList') {
      [].forEach.call(mutation.addedNodes, function(node) {
        if(!node.tagName) {
          //console.log("ADDED NODE " + node);
          return;
        }
        if(node.tagName.indexOf("MD-") === 0) {
          //console.log("ADDED NODE (%s), INITIALIZING.", node.tagName);
          Materializer.prototype.addMDMethods(node);
        }
      });
    }
  });
}


var properties = {
  logEnabled: false,
  log: function(what){
    if (properties.logEnabled) {
      //console.log(what);
    }
  },
  change: function(element,classOut,classIn){
    if (element) {
      if (classOut) {
        if (element.classList.contains(classOut)) {
          element.classList.remove(classOut);
        }
      }
      if (classIn) {
        if (element.classList.contains(classIn) != true) {
          element.classList.add(classIn);
        }
      }
      // properties.log("properties.change | " + query);
    } else {
      // properties.log("!! properties.change | query not specified or not valid");
    }
  }
}

var transitionEndEventName= function() {
    var i,
        undefined,
        el = document.createElement('div'),
        transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

    for (i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
        }
    }
}

var transitionend = transitionEndEventName();

var executeFunctionByName= function(functionName, context, args) {
       //console.log(args);
       var namespaces = functionName.split(".");
       var func = namespaces.pop();
       if (!context) {
           var context = window;
       }
       for (var i = 0; i < namespaces.length; i++) {
           context = context[namespaces[i]];
       }
       if (args) {
           return context[func].apply(this, args);
       } else {
           return context[func].apply(this, ['false']);
       }
   }

var getViewport = function() {
  var e = window;
  var a = 'inner';
  if ( !( 'innerWidth' in window ) )
    {
      a = 'client';
      e = document.documentElement || document.body;
    }
  return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}

var isMobile = function() {
  if (getViewport().width < 768) {
    return true;
  } else {
    return false;
  }
}


Materializer.prototype.justInCase= function(dowhat){
  if (dowhat=="reload") {
    var elements = document.getElementsByTagName('*');
    var length = elements.length;
    for(var i=0; i<elements.length; i++) {
      //console.log("ELEMENTOS ESTATICO " + length + " ELEMENTOS DINAMICO " + elements.length);
      var el = elements[i];
      //console.log("ENCONTRADO " + el.tagName);
      if(el.tagName.indexOf('MD') === 0) {
        //console.log("VOY A PROCESAR " + el.tagName);
        this.addMDMethods(el);
        //console.log("PROCESADO " + el.tagName);
      }    
    }
  }
}

Materializer.prototype.ajaxInsert= function(what, where, onload, param) {
  var xhr = new XMLHttpRequest;
  xhr.open("GET", what);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  where.classList.add('op-0-child');
  xhr.addEventListener('load',function(){
    getEl(where).innerHTML = xhr.responseText;
    setTimeout(function(){
      where.classList.add('op-1-child');
      where.classList.remove('op-0-child');
      setTimeout(function(){
        where.classList.remove('op-1-child');
      },750);
    },250);
    onload(xhr.responseText,where);
  });
  xhr.send();
}

Materializer.prototype.consoleBanner= "M! ";
/**
 * Action initializer draft
 * @param  {element} el  Element being initialized
 * @param  {object} opt Options
 * @return {boolean}     True on success, false on error
 */
// Materializer.prototype.init.action = function(el, opt) {

//   /**
//    * Action listener, has multiple predetermined actions and a custom one
//    * @param  {event} e Event fired that contains the element with md-action
//    */
//   el.actionListener = function(e) {
//     var el = e.currentTarget;
//     var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

//     switch(action) {
//       case 'submit': 
//         submitForm(el);
//         break;
//       case 'reset':
//         resetForm(el);
//         break;
//       case 'snackbar-dismiss':
//         snackbarDismiss(el);
//         break;
//       case 'morph':
//         transition.morph(el);
//         break;
//       case 'chrome-app-close':
//         chrome.app.window.current().close();
//         break;
//       default:
//         if(action.indexOf('custom:') != -1) {
//           var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
//           this.callFunction(f, el);
//         } else if (action = "chrome-app-close") {
//           chrome.app.window.current().close();
//         }
//         break;
//     }
//   };

//   var submitForm= function(target) {
//     console.log("submit from clicked!");
//     var form = findParentForm(target);
//     if(form) {
//       form.submit();
//     }    
//   }

//   var resetForm= function(target) {
//     console.log("reset form clicked!");
//     var form = findParentForm(target);
//     if(form) {
//       form.submit();  
//     }    
//   }

//   var snackbarDismiss= function(target) {
//     console.log("snackbar dismiss clicked!")
//   }

//   el.callFunction= function(f, target) {
//     console.log("calling function " + f);
//     executeFunctionByName(f, window, [ target ]);
//   }

//   var findParentForm= function(element) {
//     var el = element.parentNode;

//     do {
//       if(el.tagName=="FORM") {
//         return el;
//       } else if(el.tagName=="BODY") {
//         return null;
//       }
//     } while((el = el.parentNode) != null);
//     return null;
//   }

//   // Initialize listener and parent form keypress listener
//   el.addEventListener('click', el.clickListener);

//   // If not md-action then submit is the default, set form key listener
//   if(!el.getAttribute('md-action')) {
//       var parentForm = findParentForm(el);
//       if(parentForm) {
//         parentForm.addEventListener('keypress', el.enterKeyListener);
//       }    
//   }

//   // SET INITIAL PROPERTIES
//   if(el.getAttribute('md-action')) {
//     el.attributeChangedCallback('md-action', '', el.getAttribute('md-action'));
//   }

//   // INIT OBSERVER
//   var observer = new MutationObserver(function(mutations) { 
//       mutations.forEach(function(mutation) {
//         var element = mutation.target;
//         element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
//       });
//   });

//   var config = { attributes: true, childList: false, characterData: false };
//   observer.observe(el, config);

// }
var initMDButton = function(MDButton) {
  MDButton.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if(attrname==='md-action' && newvalue==='submit') {
      var parentForm = findParentForm(this);
      if(parentForm) {
        parentForm.addEventListener('keypress', this.enterKeyListener);
      }
    } else if(attrname==='md-action' && (oldvalue!=='submit' || oldvalue==='')) {
      var parentForm = findParentForm(this);
      if(parentForm) {
        parentForm.removeEventListener('keypress', this.enterKeyListener);
      }
    } 
  };

  MDButton.enterKeyListener = function(e) {
    var el = e.currentTarget;
    if(e.keyCode===13) {
      el.submit();
    }
  }

  MDButton.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch(action) {
      case 'submit': 
        submitForm(el);
        break;
      case 'reset':
        resetForm(el);
        break;
      case 'snackbar-dismiss':
        snackbarDismiss(el);
        break;
      case 'morph':
        transition.morph(el);
        break;
      case 'chrome-app-close':
        chrome.app.window.current().close();
        break;
      default:
        if(action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          this.callFunction(f, el);
        } else if (action = "chrome-app-close") {
          chrome.app.window.current().close();
        }
        break;
    }   
  };

  var submitForm= function(target) {
    console.log("submit from clicked!");
    var form = findParentForm(target);
    if(form) {
      form.submit();
    }    
  }

  var resetForm= function(target) {
    console.log("reset form clicked!");
    var form = findParentForm(target);
    if(form) {
      form.submit();  
    }    
  }

  var snackbarDismiss= function(target) {
    console.log("snackbar dismiss clicked!")
  }

  MDButton.callFunction= function(f, target) {
    console.log("calling function " + f);
    executeFunctionByName(f, window, [ target ]);
  }

  var findParentForm= function(element) {
    var el = element.parentNode;

    do {
      if(el.tagName=="FORM") {
        return el;
      } else if(el.tagName=="BODY") {
        return null;
      }
    } while((el = el.parentNode) != null);
    return null;
  }

  // Initialize listener and parent form keypress listener
  MDButton.addEventListener('click', MDButton.clickListener);

  // If not md-action then submit is the default, set form key listener
  if(!MDButton.getAttribute('md-action')) {
      var parentForm = findParentForm(MDButton);
      if(parentForm) {
        parentForm.addEventListener('keypress', MDButton.enterKeyListener);
      }    
  }

  // SET INITIAL PROPERTIES
  if(MDButton.getAttribute('md-action')) {
    MDButton.attributeChangedCallback('md-action', '', MDButton.getAttribute('md-action'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDButton, config);

}
var initMDFab = function(MDFab) {
  MDFab.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if(attrname==='md-action' && newvalue==='submit') {
      var parentForm = findParentForm(this);
      if(parentForm) {
        parentForm.addEventListener('keypress', this.enterKeyListener);
      }
    } else if(attrname==='md-action' && (oldvalue!=='submit' || oldvalue==='')) {
      var parentForm = findParentForm(this);
      if(parentForm) {
        parentForm.removeEventListener('keypress', this.enterKeyListener);
      }
    } 
  };

  MDFab.enterKeyListener = function(e) {
    var el = e.currentTarget;
    if(e.keyCode===13) {
      el.submit();
    }
  }

  MDFab.set = function(key,value){
    if (key=='image' || key=='md-image') {
      MDFab.querySelector('md-icon').setAttribute('md-image',value);
    } else if (key.indexOf('md-') === -1) {
      MDFab.setAttribute('md-'+key,value);
    }
  }

  MDFab.hide = function(){
    MDFab.style.bottom = "-56px";
  }

  MDFab.show = function(){
    MDFab.style.bottom = "";
  }

  MDFab.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch(action) {
      case 'submit': 
        submitForm(el);
        break;
      case 'reset':
        resetForm(el);
        break;
      case 'snackbar-dismiss':
        snackbarDismiss(el);
        break;
      case 'morph':
        transition.morph(el);
        break;
      case 'chrome-app-close':
        chrome.app.window.current().close();
        break;
      default:
        if(action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          this.callFunction(f, el);
        } else if (action = "chrome-app-close") {
          chrome.app.window.current().close();
        }
        break;
    }
  };

  MDFab.onClick = function(action) {
    if (action) {
      MDFab.setAttribute('md-action', action);
      console.log(MDFab.materializer.consoleBanner + "md-fab has a new action: " + action);
    } else {
      MDFab.removeAttribute('md-action');
      console.log(MDFab.materializer.consoleBanner + "md-fab has no action");
    }
  }

  var submitForm= function(target) {
    console.log("submit from clicked!");
    var form = findParentForm(target);
    if(form) {
      form.submit();
    }    
  }

  var resetForm= function(target) {
    console.log("reset form clicked!");
    var form = findParentForm(target);
    if(form) {
      form.submit();  
    }    
  }

  var snackbarDismiss= function(target) {
    console.log("snackbar dismiss clicked!")
  }

  MDFab.callFunction= function(f, target) {
    console.log("calling function " + f);
    executeFunctionByName(f, window, [ target ]);
  }

  var findParentForm= function(element) {
    var el = element.parentNode;

    do {
      if(el.tagName=="FORM") {
        return el;
      } else if(el.tagName=="BODY") {
        return null;
      }
    } while((el = el.parentNode) != null);
    return null;
  }

  // Initialize listener and parent form keypress listener
  MDFab.addEventListener('click', MDFab.clickListener);

  // If not md-action then submit is the default, set form key listener
  if(!MDFab.getAttribute('md-action')) {
      var parentForm = findParentForm(MDFab);
      if(parentForm) {
        parentForm.addEventListener('keypress', MDFab.enterKeyListener);
      }    
  }

  // SET INITIAL PROPERTIES
  if(MDFab.getAttribute('md-action')) {
    MDFab.attributeChangedCallback('md-action', '', MDFab.getAttribute('md-action'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDFab, config);

}
var initGlobalMDFunctions = function(MDElement, materializer) {
  MDElement.materializer = materializer;
  MDElement.changeProperty= function(property, oldvalue, newvalue) {
    var attribute = this.getAttribute(property); 

    if(attribute) {
      var values = attribute.split(' ');
      var oldvalueIndex = values.indexOf(oldvalue);

      if(oldvalueIndex >= 0) {
        values.splice(oldvalueIndex, 1, newvalue);
      } else {
        values.push(newvalue);
      }

      this.setAttribute(property, values.join(' '));    
    }    
  }

  MDElement.makeId= function()
  {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 5; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

  MDElement.alreadyInitialized = true;
}
var initMDGreylayer = function(MDGreylayer) {
  MDGreylayer.show = function() {
    MDGreylayer.removeEventListener(transitionend, MDGreylayer.noZIndex);
    MDGreylayer.style.zIndex = "400";
    MDGreylayer.setAttribute("md-state", "on");
  }

  MDGreylayer.hide = function() {
    MDGreylayer.setAttribute("md-state", "off");
    MDGreylayer.addEventListener(transitionend, MDGreylayer.noZIndex);
  }

  MDGreylayer.switch = function() {
    if (MDGreylayer.getAttribute('md-state') !== "on") {
      MDGreylayer.show();
    } else {
      MDGreylayer.hide();
    }
  }

  MDGreylayer.noZIndex = function() {
    MDGreylayer.style.zIndex = "";
  }
 
  MDGreylayer.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDGreylayer, config);
}
var initMDIconButton = function(MDIconButton) {
  initMDButton(MDIconButton);

  MDIconButton.removeEventListener('click', MDIconButton.clickListener);

  MDIconButton.clickListener = function(e) {
    var el = e.currentTarget;
    var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'submit';

    switch(action) {
      case 'chrome-app-close':
        chrome.app.window.current().close();
        break;
      default:
        if(action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          el.callFunction(f, el);
        } else if(action.indexOf('menu:') != -1) {
          var f = action.substring(action.indexOf('menu:') + 'menu:'.length).trim();
          el.openMenu(f, el);
        }
        break;
    }   
  };

  MDIconButton.openMenu= function(menuName, el) {
    var menu=document.getElementById(menuName);
    if(menu) {
      if(menu.status=="closed") {
        menu.open(el);
        document.addEventListener('click', closeListener);
        if (event.stopPropagation) {
          event.stopPropagation()
        } else {
          event.cancelBubble = true
        }
      } else {
        menu.close();
        document.removeEventListener('click', closeListener);
      }
    }
  }

  function closeListener(e) {
    var action=MDIconButton.getAttribute("md-action");
    var menuName = action.substring(action.indexOf('menu:') + 'menu:'.length).trim();
    var menu=document.getElementById(menuName);
    menu.close();

    /*
    * This event goes down-up, once it reaches the target tile there is no need to
    * go down, let's cancel event bubbling. It acts "almost" like a background modal layer
    */
    if(e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble=true;
    }    

    document.removeEventListener('click', closeListener);
  }

  MDIconButton.addEventListener('click', MDIconButton.clickListener);
}
var initMDIcon = function(MDIcon, materializer) {
  MDIcon.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if(this.tagName==='MD-ICON') {
      if(attrname==='md-image' && newvalue!="") {
        var svgFileURI = materializer.path + "resources/icon/" + newvalue + ".svg";
        loadSVG(svgFileURI, this);
      }
    } else {
      if(attrname==='md-image' && newvalue!="") {
        var imgFileURI = newvalue;
        var imgName = this.makeId();
        var svgData = avatarSVG.replace('$$IMAGE$$', imgFileURI).replace(/\$\$IMAGENAME\$\$/g, imgName);
        replaceSVG(svgData, this);
      } else if(attrname==='md-image') {
        var svgFileURI = materializer.path + "resources/icon/account_circle.svg";
        loadSVG(svgFileURI, this);
      }
    }
  };

  var avatarSVG= "<svg width=\"40\" height=\"40\">"+
          "<defs>" +
            "<pattern id=\"$$IMAGENAME$$\" x=\"0\" y=\"0\" patternUnits=\"userSpaceOnUse\" height=\"40\" width=\"40\">"+
              "<image x=\"0\" y=\"0\" height=\"40\" width=\"40\" xlink:href=\"$$IMAGE$$\"></image>"+
            "</pattern>"+
          "</defs>"+
          "<circle id=\"top\" cx=\"20\" cy=\"20\" r=\"20\" fill=\"url(#$$IMAGENAME$$)\"/>"+
        "</svg>";

  var createSVG= function(svgData) {
      var div = document.createElement('div');
      div.innerHTML = svgData;
      var svg = div.children[0];
      div.removeChild(svg);
      return svg;
  }

  var replaceSVG= function(svgData, element) {
    var newSVG = createSVG(svgData);
    var oldSVG = element.children[0];

    if(oldSVG) {
      oldSVG.removing = new Date().getTime();
      oldSVG.newimagename = element.getAttribute("md-image");
      // Si hay svg antiguo, se le pone opacidad 0
      oldSVG.style.opacity="0";
      // Se elimina cuando la transición acaba
      oldSVG.addEventListener(transitionend, function(e) {
        console.log("NEW:" + oldSVG.newimagename);
        console.log("TIME:" + oldSVG.removing);
        element.removeChild(oldSVG);
      });
      // Se inicializa el nuevo svg desde opacity 0
      newSVG.style.opacity="0";
      element.insertBefore(newSVG, oldSVG);
    } else {
      // Se añade, independientemente de si había svg antiguo o no
      element.appendChild(newSVG);              
    }

    // Se elimina la opacity 0 inline, por lo que transiciona al opacity 1 del propio elemento
    setTimeout(function(){
      newSVG.style.opacity="";
    },50);
  }

  var loadSVG= function(svgName, element) {
    var svg;
    var xhr= new XMLHttpRequest;
    xhr.open("GET", svgName, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.addEventListener("load",function(){ replaceSVG(xhr.responseText, element); });
    xhr.send();
  }

  // Init image
  MDIcon.attributeChangedCallback('md-image','', MDIcon.getAttribute('md-image') ? MDIcon.getAttribute('md-image'): '');

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDIcon, config);
}
/**
 * Select input element initializer
 * @param  {element} el Element being initialized
 */
var initMDInputSelect = function(el, materializer) {
	var spanText;

	el.initElements = function() {
		var value = this.getAttribute('value');
		if (this.querySelector('option[value="' + value + '"')) {
			var valueText = this.querySelector('option[value="' + value + '"').innerText;
		}

		this.spanText = document.createElement("span");
		this.spanText.classList.add('text');
		this.spanText.innerText = valueText;
		this.appendChild(this.spanText);

		var icon = document.createElement('md-icon');
		icon.setAttribute('md-image','arrow_drop_down');
		icon.setAttribute('md-fill','grey');
		initMDIcon(icon, materializer);
		this.appendChild(icon);

		var divLine = document.createElement("div");
		divLine.classList.add("line");
		this.appendChild(divLine);

		this.addEventListener('click',function(){
			if (document.getElementById(this.id + '-menu')) {
				var menu = document.getElementById(this.id + '-menu');
			} else {
				var menu = document.createElement('md-menu');
				menu.id = this.id + '-menu';
				var list = document.createElement('md-list');
				list.setAttribute('md-action','');
				[].forEach.call(el.querySelectorAll('option'), function(option){
					console.log(option);
					var tile = document.createElement('md-tile');
					tile.innerHTML = '<md-text>' + option.innerText + '</md-text>';
					tile.setAttribute('value',option.getAttribute('value'));
					if (el.getAttribute('value')==option.getAttribute('value') || option.getAttribute('selected')) {
						tile.classList.add('selected');
					}
					list.appendChild(tile);
				});
				console.log(list);
				menu.appendChild(list);
				document.body.appendChild(menu);
				initMDMenu(menu);
			}
		    if(menu) {
		      if(menu.status!="open") {
		        menu.open(el,{"select": true, "selectEl": el});
		        document.addEventListener('click', menu.close);
		        if (event.stopPropagation) {
		          event.stopPropagation();
		        } else {
		          event.cancelBubble = true;
		        }
		      } else {
		        menu.close(true);
		        document.removeEventListener('click', menu.close);
		      }
		    }
		});
	}
	el.initElements();
}
var initMDInputText = function(MDInput) {
	var spanHint;
	var input;

	MDInput.initElements = function() {
		var value = this.getAttribute('value');

		this.spanHint = document.createElement("span");
		this.spanHint.innerHTML = this.getAttribute("placeholder");
		this.appendChild(this.spanHint);

		this.input = document.createElement("input");
		this.input.id=this.id + "-input";
		this.input.type = this.getAttribute("type");
		this.input.value = this.getAttribute("value");
		this.input.name = this.getAttribute("name");
		this.appendChild(this.input);

		var spanError = document.createElement("span");
		spanError.classList.add("error");
		this.appendChild(spanError);

		var divLine = document.createElement("div");
		divLine.classList.add("line");
		this.appendChild(divLine);

		// Sets initial status
		var mode= this.getAttribute("md-mode") ? this.getAttribute("md-mode") : "animated";

		if(mode==="hint") {
			this.spanHint.classList.add("hint");
		} else if(mode==="placeholder") {
			if(this.input.value && this.input.value!=="") {
				this.spanHint.style.visibility="hidden";
			}			
			this.input.addEventListener('input', MDInput.setFocus.bind(this));
		} else {
			if(this.input.value && this.input.value!=="") {
				this.spanHint.classList.add("hint");
			}
			this.input.addEventListener('focus', MDInput.setFocus.bind(this));
			this.input.addEventListener('blur', MDInput.removeFocus.bind(this));			
		}
 
	} 

	/**
	 * Sets hint or placeholder mode.
	 * @param {string} mode the mode to set, "placeholder" or "hint"
	 */
	MDInput.setHintMode = function(mode) {
		if(mode==="placeholder") {
			this.spanHint.classList.remove("hint");
		} else if(mode==="hint") {
			this.spanHint.classList.add("hint");
		}		
	}

	/* ---- EVENT LISTENERS ---- */
	/**
	 * Listener for focus entry and content change, handles focus and input event for input object
	 * moves placeholder to hint.
 	 * @param {event} e Event object @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
	 */
	MDInput.setFocus = function(e) {
		if(this==MDInput) { // sanity check
			var mode= this.getAttribute("md-mode") ? this.getAttribute("md-mode") : "animated";

			if(mode==="placeholder") {
				if(this.input.value==="") {
					this.spanHint.style.visibility="visible";
				} else {
					this.spanHint.style.visibility="hidden";
				}				
			} else if(mode==="animated") {
				this.setHintMode('hint');	
			}
			
			// this.input.focus();
		}		
	}

	/**
	 * Listener for focus exit, handles blur event for input object
	 * moves hint to placeholder if there is content.
   * @param {event} e Event object @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event}
	 */
	MDInput.removeFocus = function(e) {
		if(this==MDInput) { // sanity check
			if(this.input.value==="") {
				this.setHintMode('placeholder');
			}
		}
	}

	/**
	 * Attribute change listener.
	 * Actually only checks for changes in the placeholder.
	 * 
	 * @param  {string} attrname Name of the changed attribute.
	 * @param  {string} oldvalue Old value of the attribute, or null if no old value.
	 * @param  {string} newvalue New value of the attribute.
	 */
  MDInput.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
    if(attrname="placeholder") {
    	this.spanHint.innerHTML= newvalue;
    }
  };

  /* ---- OBJECT INITIALIZATION ---- */
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDInput, config);

	MDInput.initElements();
}

var initMDInput = function(MDInput, materializer) {
	var inputtype=MDInput.getAttribute("type");

	if(inputtype==="text" || inputtype==="password" || inputtype==="email" || inputtype==="tel" || inputtype==="number" || inputtype==="url") {
		initMDInputText(MDInput, materializer);
	} else if(inputtype==="select") {
		initMDInputSelect(MDInput, materializer);
	} 
}
var initMDList = function(MDList,materializer) {
  MDList.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDList.clickListener = function(e) {
    var el = e.currentTarget;

    console.log("Fired click on " + el.tagName);
    if(el.tagName==='MD-TILE' && el.parentElement===MDList) {
      if(el.getAttribute('md-action')) {
        var action = el.getAttribute('md-action');
      } else {
        var action = el.parentElement && el.parentElement.getAttribute("md-action") ? el.parentElement.getAttribute('md-action') : 'none';
      }

      switch(action) {
        case 'none':
          break;
        default:
          if(action.indexOf('custom:') != -1) {
            var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
            callFunction(f, el);
          } else if(action.indexOf('link:') != -1) {
            var f = action.substring(action.indexOf('link:') + 'link:'.length).trim();
            linkRedirect(f, el);
          } else if(action.indexOf('ajax:') != -1) {
            var f = action.substring(action.indexOf('ajax:') + 'link:'.length).trim();
            materializer.ajaxInsert(el.getAttribute('md-ajax'), getEl(f), function(){
              materializer.justInCase('reload');
              if (el.getAttribute('md-ajax-callback')) {
                executeFunctionByName(el.getAttribute('md-ajax-callback'));
              };
            });
          }
          break;
      }   
    }
  };

  var linkRedirect= function(linkattr, target) {
    var link = target.getAttribute(linkattr);
    document.location.href = link;
  }

  var callFunction= function(f, target) {
    console.log("calling function " + f);
    executeFunctionByName(f, window, [ target ]);
  };

  var initChildrenActions= function() {
    var children = MDList.children;    
    for(var i=0; i<children.length;i++) {
      if(children[i].tagName==='MD-TILE') {        
        var tile = children[i];
        tile.addEventListener('click', MDList.clickListener);
      }
    }
  }

  // Initialize listerner
  initChildrenActions();

  // SET INITIAL PROPERTIES  
  if(MDList.getAttribute('md-action')) {
    MDList.attributeChangedCallback('md-action', '', MDList.getAttribute('md-action'));
  }

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDList, config);
}
var initMDMenu = function(MDMenu) {
  MDMenu.setAttribute('md-status','closed');

  MDMenu.open = function(parent, opt) {
    MDMenu.style.display="";

    var parentRect= parent.getBoundingClientRect();
    var viewPort= getViewport();

    if (!opt) {
      // Positioning
      // Better support for Dani's ideas
      // it can be personalized with a md-menu attribute
      // or even with a parent attribute, have to see the best way
      MDMenu.style.right=(viewPort.width - parentRect.right) + "px";
      MDMenu.style.top= parentRect.top + "px";

      // Animation
      MDMenu.style.height="";
      MDMenu.setAttribute('md-status','open');
    } else {
      if (opt.select) {
        MDMenu.style.maxHeight= "200px";
        MDMenu.style.overflow= "auto";
        MDMenu.style.left= (parentRect.left - 16) + "px";
        MDMenu.style.top= (parentRect.top - 6) + "px";
        var menuRect = MDMenu.getBoundingClientRect();
        if (isMobile()) {
          var x = 28;
        } else {
          var x = 32;
        }
        var nX = (menuRect.width + 16) / x;
        MDMenu.style.width = ((nX + 1) * x) + "px";
        if (MDMenu.children.length<5 || true) {
          if(MDMenu.querySelector('md-list> md-tile.selected')) {
            var selected = MDMenu.querySelector('md-list> md-tile.selected');
            MDMenu.scrollTop = selected.offsetTop - 8;
            if (MDMenu.scrollTop != selected.offsetTop) {
              MDMenu.style.top= (parseInt(MDMenu.style.top) - (selected.offsetTop - MDMenu.scrollTop - 8)) + 'px';
            }
          }
        }
        menuRect = MDMenu.getBoundingClientRect();
        if (menuRect.top<32) {
          MDMenu.style.top = '32px';
        } else if (viewPort.height - menuRect.bottom < 32) {
          MDMenu.style.top = (viewPort.height - 32 - menuRect.height) + 'px';
        }
        [].forEach.call(MDMenu.querySelectorAll('md-tile'), function(tile){
          tile.addEventListener('click', function(e){
            elTile= e.currentTarget;
            opt.selectEl.spanText.innerText = tile.querySelector('md-text').innerText;
            opt.selectEl.querySelector('[selected]').removeAttribute('selected');
            opt.selectEl.querySelector('[value="' + elTile.getAttribute('value') + '"]').setAttribute('selected','');
            opt.selectEl.setAttribute('value',elTile.getAttribute('value'));
            MDMenu.close(true);
          });
        });
      } else if (opt.outset) {
        if (opt.xPosition === "right") {
          MDMenu.style.right=(viewPort.width - parentRect.right) + "px";
        } else {

        }

      } else {
        if (opt.xPosition === "right") {
          MDMenu.style.right=(viewPort.width - parentRect.right) + "px";
        } else {

        }
        if (opt.yPosition === "top") {
          MDMenu.style.top= parentRect.top + "px";

        } else {

        }
      }
    }
  }

  MDMenu.close = function(destroy) {
    MDMenu.style.height = "0px";
    MDMenu.addEventListener(transitionend, MDMenu.endOfTransition);
    MDMenu.status= "closed";
    if (destroy && (destroy == true || (destroy.nodeType && destroy.getAttribute('menu-destroy') == "true"))) {
      MDMenu.parentNode.removeChild(MDMenu);
      console.log('LOL I DIE');
    }
  }

  MDMenu.endOfTransition = function(e) {
    MDMenu.style.display="none";
    MDMenu.removeEventListener(transitionend, MDMenu.endOfTransition);
  }

  MDMenu.switch = function() {
    if (MDMenu.getAttribute('md-state') !== "open") {
      MDMenu.close();
    } else {
      MDMenu.open();
    }
  }
 
  MDMenu.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDMenu, config);
}
var initMDSidemenu = function(MDSidemenu) {
  MDSidemenu.open = function() {
    if (MDSidemenu.materializer.toolbar.getAttribute('md-drag') === "drag") {
      MDSidemenu.materializer.toolbar.setAttribute('md-drag','no-drag');
    }
    MDSidemenu.style.left = "";
    MDSidemenu.setAttribute("md-state", "open");
    MDSidemenu.materializer.greylayer.show();
    MDSidemenu.materializer.greylayer.addEventListener('click', function(){
      MDSidemenu.close();
    });
  }

  MDSidemenu.close = function() {
    if (MDSidemenu.style.width !== "") {
      MDSidemenu.style.left = "-" + MDSidemenu.style.width;
    };
    MDSidemenu.setAttribute("md-state", "closed");
    MDSidemenu.materializer.greylayer.hide();
    if (MDSidemenu.materializer.toolbar.getAttribute('md-drag') === "no-drag") {
      MDSidemenu.materializer.toolbar.setAttribute('md-drag','drag');
    }
  }

  MDSidemenu.switch = function() {
    if (MDSidemenu.getAttribute('md-state') !== "open") {
      MDSidemenu.close();
    } else {
      MDSidemenu.open();
    }
  }
 
  MDSidemenu.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDSidemenu.autoResize = function() {
    var viewport = getViewport();
    if (viewport.width <= 456) { // We should generate display vars from md-settings.json
      MDSidemenu.style.width = (viewport.width - 56) + "px";
      if (MDSidemenu.getAttribute('md-state') !== "open") {
        MDSidemenu.style.left = "-" + MDSidemenu.style.width;
      };
    } else {
      MDSidemenu.style.width = "";
    }
  }

  MDSidemenu.autoResize();

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDSidemenu, config);
}
var initMDSnackBar = function(MDSnackBar) {
  MDSnackBar.animationIn=function() {
    var position = this.getAttribute('md-position');

    if(!this.hasAttribute('md-notanimated')) {
      if(position.split(' ').indexOf('bottom') != -1) {    
          this.style.transitionProperty='bottom, opacity';
          this.style.transitionDuration="0.25s, 0.5s";      
      } else {
          this.style.transitionProperty='top, opacity';
          this.style.transitionDuration="0.25s, 0.5s";      
      }
      this.setAttribute("md-notanimated","");
    }  
  };  

  MDSnackBar.animationOut=function() {
    var position = this.getAttribute('md-position');

    if(position.split(' ').indexOf('bottom') != -1) {    
        this.style.transitionProperty='opacity';
        this.style.transitionDuration="0.5s";
        this.style.opacity="0";     
    } else {
        this.style.transitionProperty='opacity';
        this.style.transitionDuration="0.5s";
        this.style.opacity="0";
    }
  };

  MDSnackBar.animationEnd = function() {
    var position = this.getAttribute('md-position');

    this.style.transitionProperty='';
    this.style.transitionDuration="";      
    this.style.opacity="";
    this.removeAttribute("md-notanimated");

    this.removeEventListener(transitionend, this.animationEnd);
  };

  MDSnackBar.animate=function() {
    this.animationIn();
    var _this = this;
    setTimeout(function() { 
      _this.animationOut(); 
      _this.addEventListener(transitionend, _this.animationEnd);
    }, 2000);
  };

  MDSnackBar.createdCallback = function() {
    var action = this.getAttribute('md-action');

    if(action) {
      this.attributeChangedCallback('md-action', '', action);
    }
  };
}
var initMDSwitch = function(MDSwitch) {
  MDSwitch.toggle = function(e) {
    if (MDSwitch.getAttribute('value') !== "on") {
      MDSwitch.on();
    } else {
      MDSwitch.off();
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    } else { // Older IE.
        e.cancelBubble = true;
    }
  }

  MDSwitch.on = function() {
    MDSwitch.setAttribute("value", "on");
    MDSwitch.value = "on";
  }

  MDSwitch.off = function() {
    MDSwitch.setAttribute("value", "off");
    MDSwitch.value = "off";
  }

  MDSwitch.addEventListener('click', MDSwitch.toggle);
 
  MDSwitch.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDSwitch.value = "off";

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDSwitch, config);
}
var initMDTabBar = function(MDTabBar) {
  MDTabBar.width = 0;
  MDTabBar.selector = null;
  MDTabBar.tabs = MDTabBar.getElementsByTagName("md-tab");
  MDTabBar.selected = 0;



  MDTabBar.callFunction= function(f, target) {
    console.log("calling function " + f);
    executeFunctionByName(f, window, [ target ]);
  }

  MDTabBar.clickHandler= function(e) {
    var el = e.currentTarget;
    if(el.tagName==="MD-TAB") {
      var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'none';

      if(action==='none') {
        /* Nothing to do */
      } else if(action==='showpage') {
        MDTabBar.showPage(el.index);
      } else {
        if(action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          MDTabBar.callFunction(f, el);
        }
        MDTabBar.showPage(el.index);
      }

      MDTabBar.moveIndicatorToTab(el.index);
    }
  };

  MDTabBar.moveIndicatorToTab= function(tabNumber) {
    var tabBarRect = MDTabBar.getBoundingClientRect();
    var newLeft = tabNumber * MDTabBar.width;
    var newRight = (((MDTabBar.tabs.length - tabNumber - 1) * MDTabBar.width));
    if(parseInt(MDTabBar.selector.style.left) < newLeft) {
      MDTabBar.selector.style.transition = "right 0.25s ease-out, left 0.25s ease-out 0.12s";
    } else {
      MDTabBar.selector.style.transition = "left 0.25s ease-out, right 0.25s ease-out 0.12s";
    }
    
    MDTabBar.selector.style.left =  newLeft + "px";
    MDTabBar.selector.style.right =  newRight + "px";
  }

  MDTabBar.showPage=function(tabNumber) {
    var rel = MDTabBar.getAttribute('md-rel');
    [].forEach.call(MDTabBar.tabs, function(tab, index) {
      var page = document.querySelector('*:not(md-tabbar)[md-rel=' + rel + '] md-page[md-tab=' + tab.getAttribute('md-page') + ']');
      var position = index - tabNumber;
      page.style.left=(position * 100) + "%";
    });
  }

  MDTabBar.initTabs= function() {
    [].forEach.call(MDTabBar.tabs, function(tab, index) { 
      MDTabBar.width = tab.getBoundingClientRect().width > MDTabBar.width ? tab.getBoundingClientRect().width : MDTabBar.width;
    });

    [].forEach.call(MDTabBar.tabs, function(tab, index) { 
      tab.style.flex = "1";
      tab.index=index;
      tab.addEventListener('click', MDTabBar.clickHandler);
    });

    MDTabBar.style.minWidth = (MDTabBar.width * MDTabBar.tabs.length) + "px";
  }

  MDTabBar.injectSelector= function() {
    if(!MDTabBar.selector) {
      MDTabBar.selector = document.createElement('div');
      MDTabBar.selector.id="selector";
      if (MDTabBar.getAttribute('md-selector-color')) {
        MDTabBar.selector.style.backgroundColor = MDTabBar.getAttribute('md-selector-color');
      }
      MDTabBar.appendChild(MDTabBar.selector);
    }
  }

  MDTabBar.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  // Init tabs
  MDTabBar.injectSelector();
  MDTabBar.initTabs();
  MDTabBar.showPage(0);
  MDTabBar.moveIndicatorToTab(0);

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDTabBar, config);
}
var initMDToolBar = function(MDToolBar) {
  MDToolBar.set = function(key,value){
    if (key=='image' || key=='md-image') {
      MDToolBar.querySelector('md-icon').setAttribute('md-image',value);
    } else if (key.indexOf('md-') === -1) {
      MDToolBar.setAttribute('md-'+key,value);
    }
  }

  MDToolBar.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDToolBar, config);
}
var transition = {
	status: {
		lastMorphFrom: false
	},
	copyRect: function(what,where,notrans,nobg) {
		what = getEl(what);
		if (!where) {
			return false;
		}
		if (notrans) {
			what.style.transition = "none";
		} else if (!notrans) {
			what.style.transition = "all 0.5s";
		}
		if (where === "full") {
			what.style.borderRadius = "0";
			what.style.position = "fixed";
			what.style.top = "0";
			what.style.left = "0";
			what.style.width = "100%";
			what.style.height = "100%";
		} else {
			whereStyle = window.getComputedStyle(getEl(where));
			where = getEl(where).getBoundingClientRect();
			what.style.borderRadius = whereStyle.borderRadius;
			if (whereStyle.backgroundColor != 'rgba(0, 0, 0, 0)' && !nobg) {
				what.style.backgroundColor = whereStyle.backgroundColor;
			} else if (!nobg) {
				what.style.backgroundColor = "#fff";
			}			
			console.log("HEYHEYHEY: " + whereStyle.backgroundColor);
			what.style.position = "fixed";
			what.style.top = where.top + "px";
			what.style.left = where.left + "px";
			what.style.width = where.width + "px";
			what.style.height = where.height + "px";
		}
	},
	morph: function(what,where,callback,id){
		if (what) {
			transition.status.lastMorphFrom = getEl(what);
		} else {
			return false;
		}
		var whatStyle = window.getComputedStyle(getEl(what));
		if (!where) {
			var where = "full";
		}
		var whatClon = document.createElement('div');
		if (id) {
			whatClon.id = id;
		} else {
			whatClon.id = "md-morph";
		}
		whatClon.setAttribute("md-shadow","shadow-0");
		whatStyle = window.getComputedStyle(getEl(what));
		if (whatStyle.zIndex >= 400) {
			whatClon.style.zIndex = whatStyle.zIndex + 1;
		} else {
			whatClon.style.zIndex = "400";
		}
		whatClon.style.backgroundColor = "transparent";
		transition.copyRect(whatClon,what,false,true);
		document.body.appendChild(whatClon);
		setTimeout(function(){
			whatClon.setAttribute("md-shadow","shadow-3");
			if (whatStyle.backgroundColor != 'rgba(0, 0, 0, 0)') {
				whatClon.style.backgroundColor = whatStyle.backgroundColor;
			} else {
				whatClon.style.backgroundColor = "#fff";
			}
		},10);
		setTimeout(function(){
			whatClon.style.transitionTimingFunction = 'ease-in';
			transition.copyRect(whatClon,where);
			setTimeout(function(){
				if (callback) {
					callback(whatClon);
				}				
			},500);
			getEl(what).style.opacity = 0;
		},210);
		return whatClon;
	},
	morphBack: function(target,callback){
		var morphEl = document.getElementById('md-morph');
		if (!morphEl) {
			return false;
		}
		if (target && target.nodeType && target.getAttribute('md-morph-back')) {
			var to = getEl(target.getAttribute('md-morph-back'));
		} else if (getEl(target)) {
			var to = getEl(target);
		} else if (transition.status.lastMorphFrom) {
			var to = transition.status.lastMorphFrom;
		} else {
			return false;
		}
		transition.copyRect(morphEl,to);
		morphEl.classList.add('op-0-child');
		setTimeout(function(){
			morphEl.setAttribute('md-shadow','shadow-0');
			morphEl.style.backgroundColor = 'transparent';
			setTimeout(function(){
				document.body.removeChild(morphEl);
				if(callback) {
					callback(morphEl);
				}
			},500);
			to.style.opacity = '';
		},510);
	}
};

function getEl(el){
	if (el) {
		if (el.nodeType) {
			return el;
		} else if (document.querySelector(el)) {
			return document.querySelector(el);
		}
	} else {
		return false;
	}
	
}