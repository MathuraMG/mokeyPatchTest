console.log('a test comment');
var inDraw = false;
var currentFrame = 0;
var currentColor = '';
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
  'color'
  // 'fill'
];

function createShadowDOMElement() {

  // var c = document.getElementsByTagName('canvas')[0];
  var c = document.getElementById('canvas-sub');
  c.setAttribute("tabIndex","0");
  c.setAttribute("role","region");
  var section = document.createElement('section');
  section.id = "shadowDOM-content";
  c.appendChild(section);
  var summary = document.createElement('div');
  summary.setAttribute("tabIndex","0");
  summary.setAttribute("role","region");
  summary.id = "shadowDOM-content-summary";
  section.appendChild(summary);
  var details = document.createElement('div');
  details.setAttribute("tabIndex","0");
  details.setAttribute("role","region");
  details.id = "shadowDOM-content-details";
  section.appendChild(details);
  var setupTable = document.createElement('table');
  setupTable.id="shadowDOM-content-details-setup";
  setupTable.setAttribute('summary','details of object in setup');
  var drawTable = document.createElement('table');
  drawTable.id="shadowDOM-content-details-draw";
  drawTable.setAttribute('summary','details of object in draw');
  details.appendChild(setupTable);
  details.appendChild(drawTable);
  shadowDOMElement = document.getElementById('shadowDOM-content');
}

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

// debugger;

funcNames.forEach(function(x){
  var originalFunc = p5.prototype[x.name];
  p5.prototype[x.name] = function(){
    originalFunc.apply(this,arguments);
    orgArg = arguments;
    if(!shadowDOMElement){
      createShadowDOMElement();
    }

    if(frameCount == 0) { //for setup
      if(!x.name.localeCompare('fill')) {
        currentColor = getColorName(arguments);
      }
      else if(!x.module.localeCompare('Shape')) {
        console.log('the object you are drawing is a - ' + x.name + ' of colour ' + currentColor +  ' of type ' + x.module);
        var canvasLocation = canvasLocator(arguments[0], arguments[1],width,height);
        console.log('the object starts in the ' + canvasLocation +  ' of the canvas.');
        setupObjectArray[setupObjectCount] = {
          'type' : x.name,
          'arguments': arguments,
          'location': canvasLocation
        };
        if(setupObjectTypeCount[x.name]) {
          setupObjectTypeCount[x.name]++;
        }
        else {
          setupObjectTypeCount[x.name]=1;
        }
        var table = document.getElementById('shadowDOM-content-details-setup');
        var row = document.createElement('tr');
        var type = document.createElement('td');
        type.innerHTML = x.name;
        row.appendChild(type);
        var location = document.createElement('td');
        location.innerHTML = canvasLocation;
        row.appendChild(location);
        table.appendChild(row);
        setupObjectCount++;
      }
    }

    else if( frameCount == 1) { //first loop of draw
      console.log('setup object details - ');
      console.log(setupObjectCount);
      console.log(setupObjectTypeCount);
      console.log(setupObjectArray);
      objectArray[objectCount] = {
        'type' : x.name,
        'arguments': arguments,
        'location': canvasLocation
      };
      if(objectTypeCount[x.name]) {
        objectTypeCount[x.name]++;
      }
      else {
        objectTypeCount[x.name]=1;
      }
      objectCount++;
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
          'arguments': arguments,
          'location': canvasLocation
        };
        if(tempObjectTypeCount[x.name]) {
          tempObjectTypeCount[x.name]++;
        }
        else {
          tempObjectTypeCount[x.name]=1;
        }
        var table = document.getElementById('shadowDOM-content-details-draw');
        var row = document.createElement('tr');
        var type = document.createElement('td');
        type.innerHTML = x.name;
        row.appendChild(type);
        var location = document.createElement('td');
        location.innerHTML = canvasLocation;
        row.appendChild(location);
        table.appendChild(row);

        tempObjectCount++;



        // if((!x.name.localeCompare(objectArray[tempObjectCount-1]['type']))&&(arguments.equals(objectArray[tempObjectCount]['arguments']))) {
        //   //the object is the same. Move on.
        // }
        // else if((!x.name.localeCompare(objectArray[tempObjectCount]['type']))) {
        //   //TODO : How to diff the object?
        // }
        // else {
        //   objectArray[tempObjectCount] = {
        //     'type' : x.name,
        //     'arguments': arguments
        //   };
        //   if(tempObjectTypeCount[x.name]) {
        //     tempObjectTypeCount[x.name]++;
        //   }
        //   else {
        //     tempObjectTypeCount[x.name]=1;
        //   }
        //   tempObjectCount++;
        // }
        // tempObjectCount++;
      }
    }
    else if(frameCount%100 == 1 ) {

      console.log(frameCount);
      objectCount = tempObjectCount;

      console.log('the total number of objects drawn in previous frame is - ' + tempObjectCount);
      console.log(tempObjectCount);
      console.log(tempObjectArray);
      console.log(tempObjectTypeCount);

      tempObjectTypeCount = {};
      tempObjectCount = 0;
    }

    // var content= '';
    // for(var j =0;j<orgArg.length;j++) {
    //   content = content.concat(x.params[j].description + ' ' + orgArg[j] + ' -- ');
    // }
    // var tempContent = document.getElementById('shadowDOM-content').innerHTML;
    // tempContent = tempContent.split('\n');
    // content = content.concat(' \n');
    // shadowDOMElement.innerHTML = shadowDOMElement.innerHTML.concat(content);
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
