// console.log('a test comment');
var inDraw = false;
var currentFrame = 0;
var currentColor = 'white';
var shadowDOMElement;
var canvasLocation ='';

//variables to check objects present in the canvas
var objectArray = [];
var objectCount = 0;
var objectTypeCount = {};

//temp variables for objects(??)
var tempObjectArray = [];
var tempObjectCount = 0;
var tempObjectTypeCount = {};

//for object in setpu (??)
var setupObjectArray = [];
var setupObjectCount = 0;
var setupObjectTypeCount = {};
const BLACKLIST = [
  'createCanvas',
  'color',
  'text'
  // 'fill'
];


funcNames = refData["classitems"].map(function(x){
  return {
    name: x["name"],
    params: x["params"],
    class: x["class"],
    module: x["module"]
  };
});

funcNames = funcNames.filter(function(x) {
  let className = x["class"];
  return (x["name"] && x["params"] && (className==='p5') && (BLACKLIST.indexOf(x["name"])<0) );
})


funcNames.forEach(function(x){
  var originalFunc = p5.prototype[x.name];
  p5.prototype[x.name] = function(){
    orgArg = arguments;
    if(!shadowDOMElement){
      createShadowDOMElement();
    }

    if(frameCount == 0) { //for setup
      if(!x.name.localeCompare('fill')) {
        currentColor = getColorName(arguments);
      }
      else if(!x.module.localeCompare('Shape')) {
        // console.log('the object you are drawing is a - ' + x.name + ' of colour ' + currentColor +  ' of type ' + x.module);
        var canvasLocation = canvasLocator(arguments[0], arguments[1],width,height);
        // console.log('the object starts in the ' + canvasLocation +  ' of the canvas.');
        setupObjectArray[setupObjectCount] = {
          'type' : x.name,
          'location': canvasLocation,
          'colour': currentColor
        };
        for(var i=0;i<arguments.length;i++) {
          setupObjectArray[setupObjectCount][x.params[i].name]=arguments[i];
        }
        if(setupObjectTypeCount[x.name]) {
          setupObjectTypeCount[x.name]++;
        }
        else {
          setupObjectTypeCount[x.name]=1;
        }
        var table = document.getElementById('shadowDOM-content-details-setup');
        var row = document.createElement('tr');
        var properties =  Object.keys(setupObjectArray[setupObjectCount]);
        for(var i =0;i<properties.length;i++) {
          var col = document.createElement('td');
          col.innerHTML = properties[i] + ' : ' + setupObjectArray[setupObjectCount][properties[i]];
          row.appendChild(col);
        }
        table.appendChild(row);
        setupObjectCount++;
      }
    }

    else if(frameCount%100 == 0 ) {
      if(!x.name.localeCompare('fill')) {
        currentColor = getColorName(arguments);
      }
      else if(!x.module.localeCompare('Shape')) {
        if(tempObjectCount==0) {

          var table = document.getElementById('shadowDOM-content-details-draw');
          table.innerHTML = '';
        }
        var canvasLocation = canvasLocator(arguments[0], arguments[1],width,height);
        tempObjectArray[tempObjectCount] = {
          'type' : x.name,
          'location': canvasLocation,
          'colour': currentColor
        };
        for(var i=0;i<arguments.length;i++) {
          tempObjectArray[tempObjectCount][x.params[i].name]=arguments[i];
        }
        if(tempObjectTypeCount[x.name]) {
          tempObjectTypeCount[x.name]++;
        }
        else {
          tempObjectTypeCount[x.name]=1;
        }
        var table = document.getElementById('shadowDOM-content-details-draw');
        var row = document.createElement('tr');
        var properties =  Object.keys(tempObjectArray[tempObjectCount]);
        for(var i =0;i<properties.length;i++) {
          var col = document.createElement('td');
          col.innerHTML = properties[i] + ' : ' + tempObjectArray[tempObjectCount][properties[i]];
          row.appendChild(col);
        }
        table.appendChild(row);
        tempObjectCount++;
      }
    }
    //reset some of the variables
    else if(frameCount%100 == 1 ) {
      if(tempObjectCount>0) {
        var overview = document.getElementById('shadowDOM-content-summary');
        var totalCount = tempObjectCount + setupObjectCount;
        overview.innerHTML = 'This canvas contains ' + totalCount + ' shapes. The shapes are ';
        totObjectTypeCount = MergeObjRecursive(tempObjectTypeCount, setupObjectTypeCount);
        var keys = Object.keys(totObjectTypeCount);
        for(var i=0;i<keys.length;i++) {
          overview.innerHTML = overview.innerHTML.concat( tempObjectTypeCount[keys[i]] + ' ' + keys[i] + ' ');
        }
      }

        tempObjectTypeCount = {};
        tempObjectCount = 0;
    }
    return originalFunc.apply(this,arguments);
  }
});


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
