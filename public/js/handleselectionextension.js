// *******************************************
// Handle Selection Extension
// *******************************************
function HandleSelectionExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

HandleSelectionExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
HandleSelectionExtension.prototype.constructor = HandleSelectionExtension;

HandleSelectionExtension.prototype.load = function () {
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

HandleSelectionExtension.prototype.onToolbarCreated = function () {
    this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
};

HandleSelectionExtension.prototype.createUI = function () {
    //??? what does this line of code do?
    var _this = this;


    // prepare to execute the button action
    var handleSelectionToolbarButton = new Autodesk.Viewing.UI.Button('handleSelectionButton');
    handleSelectionToolbarButton.onClick = function (e) {

        /// get current selection
        var selection = _this.viewer.getSelection();
        _this.viewer.clearSelection();
        console.log("this is getSelection:",selection);
        console.log("this is the dbid:",selection[0]);
        // anything selected?
        if (selection.length > 0) {
            // create an array to store dbIds to isolate
            var dbIdsToChange = [];

            // iterate through the list of selected dbIds
            selection.forEach(function (dbId) {
                // get properties of each dbId
                _this.viewer.getProperties(dbId, function (props, selectionDBID) {
                    // output on console, for fun...
                    //console.log(props);
                    var selectionDBID = props.dbId;
                    //console.log(selectionDBID);
                    //console.log(finalGroupedObjects);

                    var obj_selected = _.findWhere(finalGroupedObjects, {dbId: selectionDBID});
                    console.log(obj_selected);
                    //I need to ... 
                    //...1... identify if an object in finalGroupedObjects has a DBID=selectionDBID [if not=no action, if so...]
                    //...2... set obj_selected = its parent object (store the selections object and work with just it)

                    if (typeof obj_selected !== "undefined") {
                        // hide existing properties
                        obj_selected.properties.forEach(function (prop) {
                            var propObj = {
                                name: prop.displayName,
                                value: prop.displayValue,
                                category: prop.displayCategory,
                                dataType: 'text'
                            };
                            console.log(propObj);
                            // _panel.addMetaProperty(propObj);
                        });
                    } else {
                        // do nothing for now / keep default props
                    }
                    

                    //...3... hide existing properties in properties panel [waiting on Stack overflow to answer]
                    //...4... unpack that object into the needed format for displaying as custom properties
                    //...5... once this is working implement instead of the properties button
                    
                    // ask if want to isolate
                    if (confirm('Confirm ' + props.name + ' (' + props.externalId + ')?')) {
                        dbIdsToChange.push(dbId);

                        // at this point we know which elements to isolate
                        if (dbIdsToChange.length > 0) {
                            // isolate selected (and confirmed) dbIds
                            _this.viewer.isolate(dbIdsToChange);
                        }
                    }
                })
            })

        }
else {
    // if nothing selected, restore
    _this.viewer.isolate(0);
}

    };
    // handleSelectionToolbarButton CSS class should be defined on your .css file
    // you may include icons, below is a sample class:
    handleSelectionToolbarButton.addClass('handleSelectionToolbarButton');
    handleSelectionToolbarButton.setToolTip('Handle current selection');

    // SubToolbar
    this.subToolbar = (this.viewer.toolbar.getControl("MyAppToolbar") ?
        this.viewer.toolbar.getControl("MyAppToolbar") :
        new Autodesk.Viewing.UI.ControlGroup('MyAppToolbar'));
    this.subToolbar.addControl(handleSelectionToolbarButton);

    this.viewer.toolbar.addControl(this.subToolbar);
};

HandleSelectionExtension.prototype.unload = function () {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('HandleSelectionExtension', HandleSelectionExtension);