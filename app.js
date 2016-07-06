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

  console.log("Appending p5 sound");
  const p5InterceptScript = document.createElement('script');
  p5InterceptScript.src = '/p5.sound.js';
  p5InterceptScript.async = false;
  doc.appendChild(p5InterceptScript);
  console.log("Done appending p5 sound");

  console.log("Appending drawing");
  const sketchScript = document.createElement('script');
  sketchScript.textContent = `
  function setup() {
    createCanvas(400, 400);
    rect(20,20,20,20);
    osc = new p5.Oscillator();
    osc.setType('sine');
    osc.freq(200);
    osc.start();
    osc.amp(0.2)
  }

  function draw() {

  }`;
  sketchScript.async = false;
  doc.appendChild(sketchScript);
  console.log("Done appending drawing");
}
window.onload = function() {
  // console.log('hello');
  test();

}
