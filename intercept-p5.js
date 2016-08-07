var shadowDOMElement;
var canvasLocation ='';

//for object in setpu (??)
var setupObject = {
  objectArray : [],
  objectCount : 0,
  objectTypeCount : {}
};
var drawObject = {
  objectArray : [],
  objectCount : 0,
  objectTypeCount : {}
};

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
      setupObject = populateObject(x,arguments, setupObject,  document.getElementById('shadowDOM-content-details'),false);
      // getSummary(setupObject,drawObject,document.getElementById('shadowDOM-content-summary'));
    }

    else if(frameCount%100 == 0 ) {
      // drawObject = MergeObjRecursive(setupObject, drawObject);
      // setupObject = populateTable(x,arguments, setupObject,  document.getElementById('shadowDOM-content-details'),false);
      drawObject = populateObject(x,arguments, drawObject, document.getElementById('shadowDOM-content-details'),true);
      // drawObject = populateTable(document.getElementById('shadowDOM-content-details'),drawObject);
    }
    //reset some of the variables
    else if(frameCount%100 == 1 ) {
      if(drawObject.objectCount>0){
        var table = document.getElementById('shadowDOM-content-details');
        table.innerHTML = '';
        populateTable(table,setupObject);
        populateTable(table,drawObject);
      }
      getSummary(setupObject,drawObject,document.getElementById('shadowDOM-content-summary'));
      drawObject = clearVariables(drawObject);
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
