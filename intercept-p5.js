console.log('a test comment');
var inDraw = false;
var objectArray = [];
var currentFrame = 0;
var objectCount = 0;
var currentColor = '';
var shadowDOMElement;
var canvasLocation ='';

const BLACKLIST = [
  'createCanvas',
  'color'
  // 'fill'
];

function createShadowDOMElement() {

  var c = document.getElementsByTagName('canvas')[0];
  c.setAttribute("tabIndex","0");
  c.setAttribute("role","region");
  var section = document.createElement('section');
  section.id = "shadowDOM-content";
  c.appendChild(section);
  var summary = document.createElement('div');
  summary.id = "shadowDOM-content-summary";
  section.appendChild(summary);
  var details = document.createElement('div');
  details.id = "shadowDOM-content-details";
  section.appendChild(details);
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
    if(frameCount%100 == 0 ) {
      if(!x.name.localeCompare('fill')) {
        if(arguments.length==3) {
          var color = '#' + arguments[0].toString(16).paddingLeft("00") + arguments[1].toString(16).paddingLeft("00") + arguments[2].toString(16).paddingLeft("00");
          var n_match  = ntc.name(color);
          currentColor = n_match[1];
        }
      }
      if(!x.module.localeCompare('Shape')) {
        console.log('the object you are drawing is a - ' + x.name + ' of colour ' + currentColor +  ' of type ' + x.module);
        var canvasLocation = canvasLocator(arguments[0], arguments[1],width,height);
        console.log('the object starts in the ' + canvasLocation +  ' of the canvas.');
        objectCount++;
      }
    }
    if(frameCount%100 == 1 ) {
      console.log('the total number of objects is - ' + objectCount);
      objectCount =0;
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

String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
};

function canvasLocator(x,y,canvasX,canvasY) {
  if(x<0.35*canvasX) {
    if(y<0.35*canvasY) {
      return 'top left';
    }
    else if(y>0.7*canvasY) {
      return 'bottom left';
    }
    else {
      return 'mid left';
    }
  }
  else if(x>0.7*canvasX) {
    if(y<0.35*canvasY) {
      return 'top right';
    }
    else if(y>0.7*canvasY) {
      return 'bottom right';
    }
    else {
      return 'mid right';
    }
  }
  else {
    if(y<0.35*canvasY) {
      return 'top middle';
    }
    else if(y>0.7*canvasY) {
      return 'bottom middle';
    }
    else {
      return 'middle';
    }
  }
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
