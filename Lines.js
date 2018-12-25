
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
  	//print(i*8+30);
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
	
	
	if(mouseIsPressed){
		fill(255,170,0,170);
	}
	else{
		//fill(245,245,220,170);
		fill(254, 247, 229,190);
	}
	
	//textStyle(NORMAL);
	textSize(20);
	text("OpenProcessing", width/2, height - 3*(height/11) );
	//noFill();
	//stroke(254, 247, 229,190);
	fill(255,170,0,50);
	rect(width/2-200,height - 3*(height/11)-30,400,50);
	fill(254, 247, 229,190);
	
	
	text("Github Repository", width/2, height - 2*(height/11) );
	fill(255,170,0,50);
	rect(width/2-200,height - 2*(height/11)-30,400,50);
	fill(254, 247, 229,190);
	
	text("Youtube Videos", width/2, height - (height/11));
	fill(255,170,0,50);
	rect(width/2-200,height - (height/11)-30,400,50);
	fill(254, 247, 229,190);
}

function mousePressed(){
	if(mouseX > (width/2-200) && mouseX <(width/2+200) && mouseY> (height - 3*(height/11)-30) && mouseY<(height - 3*(height/11)+20) ){
		window.open('https://www.openprocessing.org/user/65585#sketches');
	}
	if(mouseX> (width/2-200) && mouseX<(width/2+200) && mouseY> (height - 2*(height/11)-30) && mouseY<(height - 2*(height/11)+20) ){
		window.open('https://github.com/JuanOlaya');
	}
	if(mouseX> (width/2-200) && mouseX<(width/2+200) && mouseY> (height - (height/11)-30) && mouseY<(height - (height/11)+20) ){
		window.open('https://www.youtube.com/playlist?list=PLBD3ein1xee3-U3jtAEAsn_oqIB82Vh5B');
	}
}
