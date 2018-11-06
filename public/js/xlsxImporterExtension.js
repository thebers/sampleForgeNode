// *******************************************
// My Awesome Extension
// *******************************************
function xlsxImporterExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

xlsxImporterExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
xlsxImporterExtension.prototype.constructor = xlsxImporterExtension;

xlsxImporterExtension.prototype.load = function () {
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

xlsxImporterExtension.prototype.onToolbarCreated = function () {
  this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
  this.onToolbarCreatedBinded = null;
  this.createUI();
};



xlsxImporterExtension.prototype.createUI = function () {
  var _this = this;
 
  // prepare to execute the button action
  var myAwesomeToolbarButton = new Autodesk.Viewing.UI.Button('runMyAwesomeCode2');
  myAwesomeToolbarButton.onClick = function(e){

    xlsxImport()

    // **********************
    //
    //
    // Execute an action here
    //
    //
    // **********************
 
   
    alert('there should be a little goodie here!');

  };
  // myAwesomeToolbarButton CSS class should be defined on your .css file
  // you may include icons, below is a sample class:
  myAwesomeToolbarButton.addClass('xlsxImporterToolbarButton');
  myAwesomeToolbarButton.setToolTip('XLS to JSON Data');

  // SubToolbar
  this.subToolbar = (this.viewer.toolbar.getControl("MyAppToolbar") ?
    this.viewer.toolbar.getControl("MyAppToolbar") :
    new Autodesk.Viewing.UI.ControlGroup('MyAppToolbar'));
  this.subToolbar.addControl(myAwesomeToolbarButton);

  this.viewer.toolbar.addControl(this.subToolbar);
};

xlsxImporterExtension.prototype.unload = function () {
  this.viewer.toolbar.removeControl(this.subToolbar);
  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('xlsxImporterExtension', xlsxImporterExtension);