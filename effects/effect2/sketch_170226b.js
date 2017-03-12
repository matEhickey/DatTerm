var colums = 20;
var factor = 8;

var backgroundAlpha = 20;

var col;

var signs = [];

function setup() {
  //fullscreen();
  var wid = 300;
  var hei = 260;
  createCanvas(wid,hei);
  
  var intervall = width/colums;
  for (var i = 0; i < colums; i++) {
    for (var j = 0; j < factor; j++) {
      var s = new Sign((intervall*i) + intervall/2, random(0, height));
      s.initialize();
      signs.push(s);
    }
  }

  col = color(0, 255, 0);
  
  fill(0, 255, 0);
  textSize(width/colums);
  background(0);
}

function draw() {
  background('rgba(28,30,34,0.2)');
  fill(col);
  for (var i = 0; i < signs.length; i++) {
    signs[i].update();
    signs[i].display();
  }
}