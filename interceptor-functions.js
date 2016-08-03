String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
};

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
        return 'white';
      }
      else if(arguments[0]>240) {
        return 'black';
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
