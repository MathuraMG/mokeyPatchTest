var shadowDOMElement;

const BLACKLIST = [
  'createCanvas',
  'color'
];

function createShadowDOMElement() {
  var c = document.getElementsByTagName('canvas')[0];
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
    if(!shadowDOMElement){
      createShadowDOMElement();
    }
    var content= '';
    for(var j =0;j<arguments.length;j++) {
      content = content.concat(x.params[j].description + ' ' + arguments[j] + ' \n');
    }
    content = content.concat(' \n');
    shadowDOMElement.innerHTML = shadowDOMElement.innerHTML.concat(content);
  }


});
