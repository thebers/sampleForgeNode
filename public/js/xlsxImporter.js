var finalGroupedObjects = [];

function xlsxImport (){
    /* set up XMLHttpRequest */
    var url = "/files/test.xlsx";
    var oReq = new XMLHttpRequest();
    oReq.open ("GET", url, true);
    oReq.responseType = "arraybuffer";
    
    oReq.onload = function(e){
        var arraybuffer = oReq.response;
        
        /*convert data to binary string */
        var data = new Uint8Array(arraybuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        
        /* Call XLSX */
        var workbook = XLSX.read(bstr, {type:"binary"});
        
        /* DO SOMETHING WITH workbook HERE*/
        var first_sheet_name = workbook.SheetNames[0];

        console.log(first_sheet_name);
        
        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];

        var obj_imported = XLSX.utils.sheet_to_json(worksheet);
        //var finalGroupedObjects = [];
        obj_imported.forEach(function(objRow, rowIndex) {
            var singalParsedObject = {
                "dbId": objRow["Viewer ID"],
                "name": objRow["Name"] + " [" + objRow["Revit ID"] + "]",
                "properties": []
            }
            for (var objProperty in objRow) {
                if (objProperty !== 'Viewer ID' && objProperty !== 'Revit ID' && objProperty !== 'Name') {
                    var parsedProperty = {
                        "displayName": objProperty.split(':')[1],
                        "displayValue": objRow[objProperty],
                        "displayCategory": objProperty.split(':')[0],
                        "attributeName": objProperty.split(':')[1],
                        "type": 20,
                        "units": null,
                        "hidden": 1,
                        "precision": 0
                    };
                    singalParsedObject.properties.push(parsedProperty);
                }
            };
            finalGroupedObjects.push(singalParsedObject);
        });
        console.log(finalGroupedObjects);
    }
    oReq.send()
};