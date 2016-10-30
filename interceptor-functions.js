String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
};

function MergeObjRecursive(obj1, obj2) {
  var obj3 = {};
  for(p in obj1) {
    obj3[p] = obj1[p];
  }
  for(p in obj2) {
    if(Object.keys(obj3).indexOf(p)<0){
      obj3[p] = obj2[p];
    }
    else {
      obj3[p] = obj3[p] + obj2[p];
    }
  }
  return obj3;
}

if(Array.prototype.equals)
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


var Interceptor = {
  prevTotalCount :0,
  totalCount : 0,
  currentColor : 'white',
  bgColor : 'white',
  objectArea : 0,
  coordinates : [],
  canvasDetails : {
    width : 0,
    height: 0
  },
  setupObject : {
    objectArray : [],
    objectCount : 0,
    objectTypeCount : {}
  },
  drawObject : {
    objectArray : [],
    objectCount : 0,
    objectTypeCount : {}
  },
  isCleared : false,
  createShadowDOMElement : function() {

    // var c = document.getElementsByTagName('canvas')[0];
    var c = document.getElementById('canvas-sub');
    c.setAttribute("tabIndex","0");
    c.setAttribute("role","region");

    var section = document.createElement('section');
    section.id = "shadowDOM-content";
    section.className = "shadowDOM-content";
    c.appendChild(section);

    var summary = document.createElement('div');
    summary.setAttribute("tabIndex","0");
    summary.setAttribute("role","region");
    summary.id = "shadowDOM-content-summary";
    summary.className = "shadowDOM-content-summary";
    section.appendChild(summary);

    var details = document.createElement('div');
    details.setAttribute("tabIndex","0");
    details.setAttribute("role","region");
    details.id = "shadowDOM-content-details";
    details.className = "shadowDOM-content-details";
    section.appendChild(details);

    var contentTable = document.createElement('table');
    contentTable.id="shadowDOM-content-table";
    contentTable.className ="shadowDOM-content-table";
    contentTable.setAttribute('summary','details of object in the canvas');

    details.appendChild(contentTable);
    shadowDOMElement = document.getElementById('shadowDOM-content');
  },
  getColorName : function(arguments) {
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
  },

  canvasLocator : function(arguments,canvasX,canvasY){
    var x,y;
    var isNum1 = false;
    var isNum2 = false;
    for(var i=0;i<arguments.length;i++) {
      a = arguments[i];
      if(!isNum1 && !isNum2 && !(typeof(a)).localeCompare('number')) {
        x = a;
        isNum1 = true;
      } else if (isNum1 && !isNum2 && !(typeof(a)).localeCompare('number')) {
        y = a;
        isNum2 = true;
      }
    }

    if(x<0.4*canvasX) {
      if(y<0.4*canvasY) {
        return 'top left';
      }
      else if(y>0.6*canvasY) {
        return 'bottom left';
      }
      else {
        return 'mid left';
      }
    }
    else if(x>0.6*canvasX) {
      if(y<0.4*canvasY) {
        return 'top right';
      }
      else if(y>0.6*canvasY) {
        return 'bottom right';
      }
      else {
        return 'mid right';
      }
    }
    else {
      if(y<0.4*canvasY) {
        return 'top middle';
      }
      else if(y>0.6*canvasY) {
        return 'bottom middle';
      }
      else {
        return 'middle';
      }
    }
  },
  clearVariables : function(object) {
    object.objectTypeCount = {};
    object.objectCount = 0;
    this.isCleared = true;
    return object;
  },

  populateObject : function(x,arguments, object ,table, isDraw) {
    objectCount = object.objectCount;
    objectArray = object.objectArray;
    objectTypeCount = object.objectTypeCount;
    if(!isDraw) {
      //check for special function in setup -> createCanvas
      if(!x.name.localeCompare('createCanvas')) {
        this.canvasDetails.width = arguments[0];
        this.canvasDetails.height = arguments[1];
      }
    }
    //check for speacial functions in general -> background/fill
    if(!x.name.localeCompare('fill')) {
      this.currentColor = this.getColorName(arguments);
    }
    else if(!x.name.localeCompare('background')) {
      this.bgColor = this.getColorName(arguments);
    }
    else if(!x.module.localeCompare('Shape') || !x.module.localeCompare('Typography') &&((!x.submodule)||(x.submodule.localeCompare('Attributes')!=0)) ){
      this.objectArea = this.getObjectArea(x.name, arguments);
      var canvasLocation = this.canvasLocator(arguments ,width,height);

      objectArray[objectCount] = {
        'type' : this.currentColor + ' ' + x.name ,
        'location': canvasLocation,
        // 'colour': this.currentColor,
        'area': this.objectArea,
        'co-ordinates': this.coordinates
      };
      this.coordinates = [];

      //add the object(shape/text) parameters in objectArray
      for(var i=0;i<arguments.length;i++) {
        if(!(typeof(arguments[i])).localeCompare('number')){
          arguments[i] = round(arguments[i]);
        }
        if(x.params[i].description.indexOf("x-coordinate")>-1) {
          this.coordinates.push(arguments[i]+'x')
        }
        else if(x.params[i].description.indexOf("y-coordinate")>-1) {
          this.coordinates.push(arguments[i]+'y')
        }
        else{
          objectArray[objectCount][x.params[i].description]=arguments[i];
        }
      }
      if(objectTypeCount[x.name]) {
        objectTypeCount[x.name]++;
      }
      else {
        objectTypeCount[x.name]=1;
      }
      //creating the table to contain the object(shape/text) details

      objectCount++;
    }
    return ({
      objectCount : objectCount,
      objectArray : objectArray,
      objectTypeCount : objectTypeCount
    });
  },

  populateTable : function(table, objectArray) {
    if(this.totalCount<100) {
      if(this.prevTotalCount > this.totalCount) {
        for(var j =0;j<this.totalCount;j++) {
          var row = table.children[j];
          var tempCol = row.children.length;
          var properties =  Object.keys(objectArray[j]);

          // var col = document.createElement('td');
          // col.innerHTML = objectArray[j]["colour"] + ' ' + objectArray[j]["type"];
          // row.appendChild(col);
          //
          // var col = document.createElement('td');
          // col.innerHTML = "Area = " + objectArray[j]["area"]
          // row.appendChild(col);

          if(tempCol<properties.length){ //ie - there are more cols now
            for(var i =0;i<tempCol;i++) {
              row.children[i].innerHTML = properties[i] + ' : ' + objectArray[j][properties[i]];
            }
            for(var i=tempCol;i < properties.length;i++) {
              var col = document.createElement('td');
              col.innerHTML = properties[i] + ' : ' + objectArray[j][properties[i]];
              row.appendChild(col);
            }
          }

          else{ // ie - there are fewer cols now
            for(var i =minCols;i<properties.length;i++) {
              row.children[i].innerHTML = properties[i] + ' : ' + objectArray[j][properties[i]];
            }
            for(var i=properties.length;i<tempCol;i++) {
              var tempCol = row.children[i];
              row.removeChild(tempCol);
            }
          }

        }
        for(var j = this.totalCount;j<this.prevTotalCount;j++) {
          var tempRow = table.children[j];
          table.removeChild(tempRow);
        }
      } else if(this.prevTotalCount <= this.totalCount) {
        for(var j =0;j<this.prevTotalCount;j++) {
          var row = table.children[j];
          var tempCol = row.children.length;
          var properties =  Object.keys(objectArray[j]);

          if(tempCol<properties.length){ //ie - there are more cols now
            for(var i =minCols;i<=tempCol;i++) {
              row.children[i].innerHTML = properties[i] + ' : ' + objectArray[j][properties[i]];
            }
            for(var i=tempCol;i < properties.length;i++) {
              var col = document.createElement('td');
              col.innerHTML = properties[i] + ' : ' + objectArray[j][properties[i]];
              row.appendChild(col);
            }
          }

          else{ // ie - there are fewer cols now
            for(var i =0;i<properties.length;i++) {
              row.children[i].innerHTML = properties[i] + ' : ' + objectArray[j][properties[i]];
            }
            for(var i=properties.length;i<tempCol;i++) {
              var tempCol = row.children[i];
              row.removeChild(tempCol);
            }
          }

        }
        for(var j = this.prevTotalCount;j<this.totalCount;j++) {
          var row = document.createElement('tr');
          var properties =  Object.keys(objectArray[j]);
          for(var i =0;i<properties.length;i++) {
            var col = document.createElement('td');
            col.innerHTML = properties[i] + ' : ' + objectArray[j][properties[i]];
            row.appendChild(col);
          }
          table.appendChild(row);
        }
      }

    }
  },

  getObjectArea : function(objectType,arguments){
    var objectArea = 0;
    if(!objectType.localeCompare('arc')) {
      objectArea = 0;
    }
    else if(!objectType.localeCompare('ellipse')) {
      objectArea = 3.14 * arguments[2]*arguments[3]/4;
    }
    else if(!objectType.localeCompare('line')) {
      objectArea = 0;
    }
    else if(!objectType.localeCompare('point')) {
      objectArea = 0;
    }
    else if(!objectType.localeCompare('quad')) {
      //x1y2+x2y3+x3y4+x4y1−x2y1−x3y2−x4y3−x1y4
      objectArea = (arguments[0]*arguments[1]+arguments[2]*arguments[3]+arguments[4]*arguments[5]+arguments[6]*arguments[7]) - (arguments[2]*arguments[1]+arguments[4]*arguments[3]+arguments[6]*arguments[5]+arguments[0]*arguments[7]);
    }
    else if(!objectType.localeCompare('rect')) {
      objectArea = arguments[2]*arguments[3];
    }
    else if(!objectType.localeCompare('triangle')) {
      objectArea = arguments[0]*(arguments[3] - arguments[5]) + arguments[2]*(arguments[5] - arguments[1]) + arguments[4]*(arguments[1] - arguments[3]);
      //A	x 	 (	 B	y 	−	 C	y 	) 	+	 B	x 	 (	 C	y 	−	 A	y 	) 	+	 C	x 	 (	 A	y 	−	 B	y 	)
    }
    return objectArea;
  },

  getSummary : function(object1, object2, element) {
    this.prevTotalCount = this.totalCount;
    this.totalCount = object1.objectCount + object2.objectCount;
    element.innerHTML = '';
    element.innerHTML += 'Canvas size is ' + this.canvasDetails.width + ' by ' + this.canvasDetails.height + ' pixels ';
    element.innerHTML += ' and has a background colour of ' + this.bgColor + '. ';
    element.innerHTML += 'This canvas contains ' + this.totalCount;
    if(this.totalCount > 1 ) {
      element.innerHTML += ' objects. The objects are ';
    }
    else {
      element.innerHTML += ' object. The object is ';
    }

    if(object2.objectCount>0 || object1.objectCount>0 ) {

      totObjectTypeCount = MergeObjRecursive(object1.objectTypeCount, object2.objectTypeCount);
      var keys = Object.keys(totObjectTypeCount);
      for(var i=0;i<keys.length;i++) {
        element.innerHTML += totObjectTypeCount[keys[i]] + ' ' + keys[i] + ' ';
      }

      var objectList = document.createElement('ul');

      if(this.totalCount<100){
        for(var i=0; i <object1.objectArray.length; i++) {
          var objectListItem = document.createElement('li');
          objectListItem.id = 'object' + i;
          objectList.appendChild(objectListItem);
          var objKeys = Object.keys(object1.objectArray[i]);
          for(var j=0;j<objKeys.length;j++) {
            objectListItem.innerHTML += objKeys[j] + ' is ' + object1.objectArray[i][objKeys[j]] + ' ';
          }
        }
        for(var i=0; i <object2.objectArray.length; i++) {
          var objectListItem = document.createElement('li');
          objectListItem.id = 'object' + (object1.objectArray.length + i);
          objectList.appendChild(objectListItem);
          var objKeys = Object.keys(object2.objectArray[i]);
          for(var j=0;j<objKeys.length;j++) {
            objectListItem.innerHTML += objKeys[j] + ' is ' + object2.objectArray[i][objKeys[j]] + ' ';
          }
        }
        element.appendChild(objectList);
      }

    }
  }
};
