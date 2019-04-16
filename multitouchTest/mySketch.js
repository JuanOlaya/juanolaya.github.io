function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(0);
	noStroke();
	for(let i=0;i<touches.length;i++){
		fill(200,0,0);
		ellipse(touches[i].x, touches[i].y, 70, 70); 
		fill(200,0,0,70);
		ellipse(touches[i].x, touches[i].y, 125, 125); 
		fill(200,0,0,70);
		text("X: "+Math.floor(touches[i].x)+"  Y:"+Math.floor(touches[i].y), 5, 10*i+10);
	}
}