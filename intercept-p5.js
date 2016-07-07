var shadowDOMElement;

function createShadowDOMElement() {
  var c = document.getElementsByTagName('canvas')[0];
  var p = document.createElement('p');
  p.id = "shadowDOM-content";
  c.appendChild(p);
  shadowDOMElement = document.getElementById('shadowDOM-content');
}

function waitForElementToDisplay(selector,time) {
  if(document.querySelector(selector)!=null) {
		createShadowDOMElement();
    return;
  }
  else {
      setTimeout(function() {
          waitForElementToDisplay(selector, time);
      }, time);
  }
}
waitForElementToDisplay('#defaultCanvas0');

var originalRect = p5.prototype.rect;
p5.prototype.rect = function(x,y,w,h)
{
  originalRect.call(this,x,y,w,h);
  if(shadowDOMElement){
  } else {
    createShadowDOMElement();
  }
shadowDOMElement.innerHTML = shadowDOMElement.innerHTML.concat('Coordinates are - ' + x + ' ' + y + ' ' + w + ' ' + h );
};
