// *******************************************
// My Awesome Extension
// *******************************************
function bensAwesomeExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

bensAwesomeExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
bensAwesomeExtension.prototype.constructor = bensAwesomeExtension;

bensAwesomeExtension.prototype.load = function () {
  if (this.viewer.toolbar) {
    // Toolbar is already available, create the UI
    this.createUI();
  } else {
    // Toolbar hasn't been created yet, wait until we get notification of its creation
    this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
    this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
  }
  return true;
};

bensAwesomeExtension.prototype.onToolbarCreated = function () {
  this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
  this.onToolbarCreatedBinded = null;
  this.createUI();
};



bensAwesomeExtension.prototype.createUI = function () {
  var _this = this;
 
  // prepare to execute the button action
  var benstoolbarbutton = new Autodesk.Viewing.UI.Button('runMyAwesomeCode');
  benstoolbarbutton.onClick = function(e){

    //I could not figure out how to get the URN... I can get it in the viewer.js... but not here for some reason.
    //it appears to return data about the mouse click event, instead of the URN of the model.  (TUTORIAL showed function as downloadXLS... but was actually downloadXLSX in .js)
  
    console.log(thisURN);
    urn = thisURN;
    token = thisToken;
    var callback;
  //console.log("the before hard coding",urn)
    ForgeXLS.downloadXLSX(urn, token, callback /*Optional*/);

    // **********************
    //
    //
    // Execute an action here
    //
    //
    // **********************
 
   
    alert('I am an extension');

  };
  // benstoolbarbutton CSS class should be defined on your .css file
  // you may include icons, below is a sample class:
  benstoolbarbutton.addClass('bensAwesomeToolbarButton');
  benstoolbarbutton.setToolTip('Bens Awesome extension');

  // SubToolbar
  this.subToolbar = (this.viewer.toolbar.getControl("MyAppToolbar") ?
    this.viewer.toolbar.getControl("MyAppToolbar") :
    new Autodesk.Viewing.UI.ControlGroup('MyAppToolbar'));
  this.subToolbar.addControl(benstoolbarbutton);

  this.viewer.toolbar.addControl(this.subToolbar);
};

bensAwesomeExtension.prototype.unload = function () {
  this.viewer.toolbar.removeControl(this.subToolbar);
  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('bensAwesomeExtension', bensAwesomeExtension);