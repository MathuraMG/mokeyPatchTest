console.log("Saving old rect");
var originalRect = p5.prototype.rect;
console.log("Done saving old rect");
console.log("Changing to new rect");
p5.prototype.rect = function(x,y,w,h)
  {
    console.log('this is called right now');
    originalRect.call(this,x,y,w,h);
    console.log('Coordinates are - ' + x + ' ' + y + ' ' + w + ' ' + h );
  };
console.log("Done changing to new rect");
