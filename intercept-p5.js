var inDraw = false;
var currentFrame = 0;
var currentColor = 'white';
var shadowDOMElement;
var canvasLocation ='';

//temp variables for objects(??)
var drawObject = {};
var drawObjectArray = [];
var drawObjectCount = 0;
var drawObjectTypeCount = {};

//for object in setpu (??)
var setupObject = {};
var setupObjectArray = [];
var setupObjectCount = 0;
var setupObjectTypeCount = {};

funcNames = refData["classitems"].map(function(x){
  return {
    name: x["name"],
    params: x["params"],
    class: x["class"],
    module: x["module"],
    submodule: x["submodule"]
  };
});

funcNames = funcNames.filter(function(x) {
  let className = x["class"];
  return (x["name"] && x["params"] && (className==='p5'));
})


funcNames.forEach(function(x){
  var originalFunc = p5.prototype[x.name];
  p5.prototype[x.name] = function(){
    orgArg = arguments;
    if(!shadowDOMElement){
      createShadowDOMElement();
    }

    if(frameCount == 0) { //for setup
      setupObject = populateTable(x,arguments, setupObjectCount,setupObjectArray, setupObjectTypeCount,  document.getElementById('shadowDOM-content-details-setup'),false)
      setupObjectCount = setupObject.objectCount;
      setupObjectArray = setupObject.objectArray;
      setupObjectTypeCount = setupObject.objectTypeCount;
    }

    else if(frameCount%100 == 0 ) {
      drawObject = populateTable(x,arguments, drawObjectCount,drawObjectArray, drawObjectTypeCount, document.getElementById('shadowDOM-content-details-draw'),true)
      drawObjectCount = drawObject.objectCount;
      drawObjectArray = drawObject.objectArray;
      drawObjectTypeCount = drawObject.objectTypeCount;
    }
    //reset some of the variables
    else if(frameCount%100 == 1 ) {
      if(drawObjectCount>0) {
        var overview = document.getElementById('shadowDOM-content-summary');
        var totalCount = drawObjectCount + setupObjectCount;
        overview.innerHTML = 'This canvas contains ' + totalCount + ' shapes. The shapes are ';
        totObjectTypeCount = MergeObjRecursive(drawObjectTypeCount, setupObjectTypeCount);
        var keys = Object.keys(totObjectTypeCount);
        for(var i=0;i<keys.length;i++) {
          overview.innerHTML = overview.innerHTML.concat( drawObjectTypeCount[keys[i]] + ' ' + keys[i] + ' ');
        }
      }
        drawObjectTypeCount = {};
        drawObjectCount = 0;
    }
    return originalFunc.apply(this,arguments);
  }
});

function populateTable(x,arguments, objectCount,objectArray, objectTypeCount,table, isDraw) {

  if(isDraw && objectCount < 1) {
    table.innerHTML = ''
  };
  if(!x.name.localeCompare('fill')) {
    currentColor = getColorName(arguments);
  }
  else if(!x.module.localeCompare('Shape') || !x.module.localeCompare('Typography') &&((!x.submodule)||(x.submodule.localeCompare('Attributes')!=0)) ){

  if(!x.module.localeCompare('Typography')) {
      var canvasLocation = canvasLocator(arguments[1], arguments[2],width,height);
    } else {
      var canvasLocation = canvasLocator(arguments[0], arguments[1],width,height);
    }


  objectArray[objectCount] = {
      'type' : x.name,
      'location': canvasLocation,
      'colour': currentColor
    };

    for(var i=0;i<arguments.length;i++) {
      if(!(typeof(arguments[i])).localeCompare('number')){
        arguments[i] = round(arguments[i]);
      }
      objectArray[objectCount][x.params[i].description]=arguments[i];
    }
    if(objectTypeCount[x.name]) {
      objectTypeCount[x.name]++;
    }
    else {
      objectTypeCount[x.name]=1;
    }
    var row = document.createElement('tr');
    var properties =  Object.keys(objectArray[objectCount]);
    for(var i =0;i<properties.length;i++) {
      var col = document.createElement('td');
      col.innerHTML = properties[i] + ' : ' + objectArray[objectCount][properties[i]];
      row.appendChild(col);
    }
    table.appendChild(row);
    objectCount++;
  }
  return ({
    'objectCount' : objectCount,
    'objectArray' : objectArray,
    'objectTypeCount' : objectTypeCount
  });
}

/*** PSUEDO CODE

* Run @fc = 0
* make a list of all the objects/shapes that are present - make a list of the objects using data.json
* check if the same ones are present in fc=1 ??
* and update the content

*Caveats
- if there is already a circle, we can actually update the values on the same one if there is the SAME number of circles.
-else we can update the SAME ones and add the rest

links
- Color converter -   http://chir.ag/projects/ntc/
***/
