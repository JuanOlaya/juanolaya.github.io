
var pointList = [];
var canvas;

function setup() {
	canvas=createCanvas(windowWidth, windowHeight);
	canvas.position(0,0);
	canvas.style('z-index',-1);

	background(50);

  for (var i=0; i<10; i++) {
    pointList.push(new Point(random(width-20), random(height-20), random(-0.01, 0.01),
      						random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01) ));
  }
}

function draw() {
  background(50);

  for (var i=0; i<pointList.length; i++) {
    pointList[i].mover();
    noStroke();
    fill( 253, 106, 2, i*11+30);
    triangle(pointList[i].location.x, pointList[i].location.y, width/4, height/8, width - width/4, height/8-25);
	}
	texto();
}

function texto(){
	noStroke();

	fill(254, 247, 229,190);
	textFont('Gotham');
	textAlign(CENTER);
	textStyle(BOLD);
	textSize(25);
	text("JUAN OLAYA", width/2, height - 4*(height/11) );
}

		document.querySelector("#btn1").addEventListener('click',function(){
			window.open( 'https://www.openprocessing.org/user/65585/');
		})
		document.querySelector("#btn2").addEventListener('click',function(){
			window.open('https://github.com/JuanOlaya/');
		})
