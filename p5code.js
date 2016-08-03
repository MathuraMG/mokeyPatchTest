// CODE 1

function setup() {
  createCanvas(420, 430);background(220);
	fill(255, 0, 0);
	ellipse(80, 50, 80, 80);
	fill(0, 255, 255);
	rect(150, 100, 50, 50);
  ellipse(250, 100, 50, 50);
	fill(0, 0, 255);
	triangle(200, 200, 150, 350, 250, 350);
}

function draw() {
  fill(255,255,255);
  rect(10,10,40,20);
}

// CODE 2

// function setup() {
//   createCanvas(400, 400);
// 	background(250, 220, 40);
//   // fill(255, 0, 0);
//   ellipse(80, 50, 80, 80);
//   // fill(0);
//   text("Howdy!", 60, 55);
//   // fill(0, 255, 0);
//   rect(150, 100, 50, 50);
//   // fill(0);
//   text("Howdy!", 155, 130);
//   // fill(0, 0, 255);
//   triangle(200, 200, 150, 350, 250, 350);
//   // fill(255);
//   text("Howdy!", 180, 300);
// }
//
// function draw() {
//
// }

//CODE 3

// var maxX = 500;
// var maxY = 500;
// var balls = [];
// var gravity = 0.5;
// var elly =400;
//
//
// function setup() {
//   createCanvas(500, 500);
// }
//
// function draw() {
//   //The screen
//   background(0);
//
//   // The bouncing balls
//   for(var i =0;i<balls.length;i++)
//   {
//     balls[i].displayBall();
//   }
// }
//
// function mousePressed()
// {
//
//   if(dist(mouseX, mouseY,250,50) <40)
//     reset();
//   else if(mouseY< elly -100)
//   {
//     var i = balls.length;
//     var xspeed =  random(-4,3);
//     var r = random(0,255);
//     var g = random(0,255);
//     var b = random(0,255);
//     balls[i] = new ball(mouseX,mouseY,xspeed,8,r,g,b);
//     ballCount++;
//   }
//
// }
//
// function ball(xPos,yPos,xspeed,yspeed,r,g,b)
// {
//   this.xPos= xPos;
//   this.yPos= yPos;
//   this.yspeed= yspeed;
//   this.xspeed= xspeed;
//   this.isDown = 1;
//
//   this.displayBall = function() {
//
//     //Display the ball
//     fill(r,g,b);
//     noStroke();
//     ellipse(this.xPos, this.yPos, 25, 25);
//
//     //Move the ball
//     this.yPos = this.yPos + this.yspeed;
//     this.xPos = this.xPos + this.xspeed;
//     this.yspeed = this.yspeed + gravity;
//
//
//
//   //Bounce the ball
//     if (this.yPos > maxY) {
//       this.yPos = maxY;
//       //println("GO BACK GO BACK!");
//       this.isDown = 0;
//       this.yspeed = this.yspeed * -0.8;
//      // println(abs(this.yspeed));
//     }
//     if (this.xPos > maxX) {
//       this.xPos = maxX;
//       //println("GO LEFT!");
//       this.xspeed = this.xspeed * -0.8;
//     }
//     if (this.xPos < 0) {
//       this.xPos = 0;
//       //println("GO LEFT!");
//       this.xspeed = this.xspeed * -0.8;
//     }
//     if(abs(this.yspeed) <3.5 && this.yPos>495)
//     {
//       this.yspeed = 0;
//       this.xspeed = 0;
//     }
//   }
// }
