function setup() {
	createCanvas(1366, 768);
	background(100);
}

function draw() {
	fill(0);
	ellipse(mouseX, mouseY, 20, 20);
	fill(200,0,0);
	rect(200,200,200,200);
}
