var viewerApp;
//added urn as a global variable in an attempt to reach it in the xls exporter
var thisURN = "yo!!";
//

function launchViewer(urn) {
  //ben added to test
  var thisURN = urn;
  //

  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };
  

  var documentId = 'urn:' + urn;
  Autodesk.Viewing.Initializer(options, function onInitialized() {
    viewerApp = new Autodesk.Viewing.ViewingApplication('forgeViewer');
    viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D, { extensions: ['bensAwesomeExtension', 'HandleSelectionExtension', 'ModelSummaryExtension','MyColorExtension'] });
    viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
    
    //ben added to test
    console.log(urn)
    const thisURN = urn
    console.log('thisURN = ',thisURN)
    //
  });
}

//testing to see if I can create a function here that will store the URN that I can call from FORGExls...this did not work
//because ForgeViewer is not defined in the extension

function logURN(thisURN, urn){
  console.log(thisURN)
  console.log(urn)
}

function onDocumentLoadSuccess(doc) {
  // We could still make use of Document.getSubItemsWithProperties()
  // However, when using a ViewingApplication, we have access to the **bubble** attribute,
  // which references the root node of a graph that wraps each object from the Manifest JSON.
  var viewables = viewerApp.bubble.search({ 'type': 'geometry' });
  console.log('viewables array: ', viewables)
  if (viewables.length === 0) {
    console.error('Document contains no viewables.');
    return;
  }

  // Choose any of the available viewables
  viewerApp.selectItem(viewables[1].data, onItemLoadSuccess, onItemLoadFail);


}

  // need to build this so I can load new views
function loadNewVieable(){
  viewerApp.selectItem(viewables[1].data, onItemLoadSuccess, onItemLoadFail);
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function onItemLoadSuccess(viewer, item) {
  // item loaded, any custom action?
}

function onItemLoadFail(errorCode) {
  console.error('onItemLoadFail() - errorCode:' + errorCode);
}

function getForgeToken(callback) {
  jQuery.ajax({
    url: '/api/forge/oauth/token',
    success: function (res) {
      callback(res.access_token, res.expires_in)
    }
  });
}