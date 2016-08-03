String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
};

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

function getColorName(arguments) {
  if(arguments.length==3) {
    //assuming that we are doing RGB - convert RGB values to a name
    var color = '#' + arguments[0].toString(16).paddingLeft("00") + arguments[1].toString(16).paddingLeft("00") + arguments[2].toString(16).paddingLeft("00");
    var n_match  = ntc.name(color);
    return n_match[1];
  }
  else if(arguments.length==1) {
    if(!(typeof(arguments[0])).localeCompare("number")) {
      //assuming that we are doing RGB - this would be a grayscale number
      if(arguments[0]<10) {
        return 'black';
      }
      else if(arguments[0]>240) {
        return 'white';
      }
      else {
        return 'grey';
      }
    }
    else if(!(typeof(arguments[0])).localeCompare("string")) {
      if(!arguments[0].charAt(0).localeCompare('#')) {
        //if user has entered a hex color
        var n_match = ntc.name(arguments[0]);
        return n_match[1];
      }
      else {
        return arguments[0];
      }
    }
  }
}

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

if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

function MergeObjRecursive(obj1, obj2) {
  for(p in obj2) {
    if(Object.keys(obj1).indexOf(p)<0){
      obj1[p] = obj2[p];
    }
    else {
      obj1[p] = obj1[p] + obj2[p];
    }
  }
  return obj1;
}
