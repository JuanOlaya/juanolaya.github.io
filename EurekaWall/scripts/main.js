let canvas;

function setup() {
    canvas = createCanvas(windowWidth,windowHeight+50);
	canvas.position(0,0);	  
	canvas.style("z-index",-1);
}

function draw() {
    background(" #3A3A3A  ");
    fill("#D7B42A");
    noStroke();
    rect(0,0,width/4,height);
    /*ellipse(width,height,1.75*width);*/
    
  }