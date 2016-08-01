console.log('a test comment');
var inDraw = false;

var shadowDOMElement;
// var syntax = esprima.parse('var answer = 42');

var callback = function(stackframes) {
  var stringifiedStack = stackframes.map(function(sf) {
    // console.log(sf.functionName);
    return sf.toString();
  }).join('\n');
  console.log(stringifiedStack);
};
var isInDraw = function(stackframes) {
  // console.log(stackframes);
  stringifiedStack = false;
  stackframes.forEach(function(sf) {
    // console.log(sf.functionName);
    if(sf.functionName.localeCompare('draw') === 0) {
      inDraw = true;
    } else {
      // inDraw = false;
    }
  })
  return inDraw;
};
var errback = function(err) { console.log(err.message); };



const BLACKLIST = [
  'createCanvas',
  'color'
];

function createShadowDOMElement() {

  var c = document.getElementsByTagName('canvas')[0];
  c.setAttribute("tabIndex","0");
  c.setAttribute("role","region");
  var p = document.createElement('p');
  p.id = "shadowDOM-content";
  c.appendChild(p);
  shadowDOMElement = document.getElementById('shadowDOM-content');
}

funcNames = refData["classitems"].map(function(x){
  return {
    name: x["name"],
    params: x["params"],
    class: x["class"]
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
    // console.log( arguments);
    orgArg = arguments;
    // StackTrace.get().then(isInDraw).catch(errback)
    if(!shadowDOMElement){
      createShadowDOMElement();
    }
    var content= '';
    console.log( orgArg);
    for(var j =0;j<orgArg.length;j++) {
      console.log('test == ' + x.params[j].description + ' ' + orgArg[j] + ' -- ');
      content = content.concat(x.params[j].description + ' ' + orgArg[j] + ' -- ');
    }
    var tempContent = document.getElementById('shadowDOM-content').innerHTML;
    tempContent = tempContent.split('\n');
    content = content.concat(' \n');
    shadowDOMElement.innerHTML = shadowDOMElement.innerHTML.concat(content);

  //TODO: Implement inside this
  var temp = StackTrace.get().then(isInDraw).then(function() {
    if(inDraw) {
      //TODO: Figure out what output goes in here - needs to be a bit different (??)
      // console.log('I dont know what I am doing here!!!');
    } else {
    }
  });

}
});
