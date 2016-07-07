function test()
{
  var doc = document.body;
  console.log(doc);
  // debugger;

  console.log("Appending p5min");
  const p5Script = document.createElement('script');
  p5Script.src = '/p5.min.js';
  p5Script.async = false;
  doc.appendChild(p5Script);
  console.log("Done appending p5min");

  p5Script.onload = function() { console.log('p5min laoded');}

  console.log("Appending intercept p5min");
  const p5InterceptScript = document.createElement('script');
  p5InterceptScript.src = '/intercept-p5.js';
  p5InterceptScript.async = false;
  doc.appendChild(p5InterceptScript);
  console.log("Done appending intercept p5min");

  p5InterceptScript.onload = function() { console.log('intercept p5min laoded');}

  console.log("Appending drawing");
  const sketchScript = document.createElement('script');
  sketchScript.textContent = `
  function setup() {
    createCanvas(400, 400);
    console.log("I am about to draw the  rectangle");
    rect(20,20,20,20);
  }

  function draw() {

  }

  `;
  sketchScript.async = false;
  doc.appendChild(sketchScript);
  console.log("Done appending drawing");


}
window.onload = function() {
  test();
}
