/*
  by Juan Olaya
  https://juanolaya.github.io/
*/

var balls = [];
var colores = [];
var oprimido=false;
var oprimidoHorizontal=false;
var backColor;
var canvas;
var horizontalObjectCollisions=0;
var diagonalObjectCollisions=0;
var mobile=false;
var startTime= 0;
var pressTimeHorizontal; 
var releaseTimeHorizontal;
var pressTimeDiagonal;
var releaseTimeDiagonal;
var thresholdDiagonalCollisions=4;


function windowsResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function setup() {
	
	if(windowWidth<windowHeight){
		canvas = createCanvas(400,850);
		mobile=true;

		pressTimeHorizontal = 750; 
		releaseTimeHorizontal = 1000;
		pressTimeDiagonal = 500;  
		releaseTimeDiagonal = 1000;
		thresholdDiagonalCollisions=3;

	}else{
		canvas = createCanvas(windowWidth,windowHeight);

		pressTimeHorizontal = 3000; 
		releaseTimeHorizontal = 3250;
		pressTimeDiagonal = 4500;  
		releaseTimeDiagonal = 5000;
		thresholdDiagonalCollisions=5;
	}
	
	
	canvas.position(0,0);	  
	canvas.style("z-index",-1);
	                                                // Names of colors from coolors.co/app
	colores[0] = color('rgba(196,130,8, 0.25)');      //Orange
	colores[1] = color('rgba(25,139,198, 0.25)');    // Cyan Cornflower Blue ->'#198BC6'
	//colores[0] = color('rgba(228, 53, 37, 0.25)');   // red
	//colores[1] = color('rgba(232, 82, 67, 0.25)');    // Carmine Pink -> '#E85243'
	//colores[1] =color('rgba(255, 165, 0, 0.25)')        // Orange (Yellow) Web -> #FFA500
	//colores[0] = color('rgba(104, 100, 145, 0.25)');   // Dark Blue-Gray -> '#686491'
	
	
	if(mobile==true){
		balls.push( new Ball(random(100, width / 2), random(86, height / 2), 3, 3, 0, 0.1, colores[0]));
		balls.push( new Ball(width-90, 100, 4, 4, 0, 0.1, colores[1]));
		
	}else{
		balls.push( new Ball(random(100, width / 2), random(86, height / 3), 3, 3, 0, 0.1, colores[0]));
		balls.push( new Ball(random( 2*width / 3, width-95), random(2*height/3, height - 100), 4, 4, 0, 0.1, colores[1]));
	}

	backColor=40;
	background(backColor);
}

function draw() {
	console.log("Mobile:"+mobile);

	if(diagonalObjectCollisions<thresholdDiagonalCollisions){
		balls[0].showDiagonal(oprimido);
		balls[0].applyGravity();
		balls[0].edgeCollision();
	}

	if(horizontalObjectCollisions==0){
		balls[1].showHorizontal(oprimidoHorizontal);
		if(mobile==true){
			balls[1].moveDown();
		}else{
			balls[1].moveLeft();
		}
		balls[1].edgeCollisionHorizontal();
	}

	if (millis() - startTime > pressTimeHorizontal) {
		oprimidoHorizontal=true;
	}
	if (millis() - startTime > releaseTimeHorizontal) {
		oprimidoHorizontal=false;
	}

	if (millis() - startTime > pressTimeDiagonal) {
		oprimido=true;
	}
	if (millis() - startTime > releaseTimeDiagonal) {
		oprimido=false;
	}
}



class Ball {
	
	constructor(posX, posY, velX, velY, gravX, gravY, col) {
		this.localizacion = createVector(posX, posY);
		this.velocity = createVector(velX, velY);
		this.gravity = createVector(gravX, gravY);
		this.c = color(col);
		this.radius = 86;
	}
	  
	showHorizontal(oprimidoHorizontal) {
		if(oprimidoHorizontal){
			noStroke();
			fill(this.c);
		}else{
			noFill();
			stroke(this.c);
		}
		ellipse(this.localizacion.x, this.localizacion.y, this.radius * 2, this.radius * 2);
	}
	
	showDiagonal(oprimido) {
		if(oprimido){
			noStroke();
			fill(this.c);
		}else{
			noFill();
			stroke(this.c);
		}
		ellipse(this.localizacion.x, this.localizacion.y, this.radius * 2, this.radius * 2);
	}
	
	applyGravity(){
		this.localizacion.add(this.velocity); 
	}

	moveLeft(){
		this.localizacion.x = this.localizacion.x - this.velocity.x; 
	}
	moveDown(){
		this.localizacion.y = this.localizacion.y + this.velocity.y; 
	}
	
	edgeCollision() {
		if (this.localizacion.x > width* 0.8 - this.radius) {
			//horizontalObjectCollisions++;
			diagonalObjectCollisions++;
			this.velocity.x = this.velocity.x * (-1);
			this.localizacion.x = width* 0.8 - this.radius-7;
		}

		if (this.localizacion.x < this.radius) {
			horizontalObjectCollisions++;
			diagonalObjectCollisions++;
			this.velocity.x = this.velocity.x * (-1);
			this.localizacion.x = this.radius+7;
		}

		if (this.localizacion.y > height - this.radius) {
			//horizontalObjectCollisions++;
			diagonalObjectCollisions++;
			this.velocity.y = this.velocity.y * (-1);
			this.localizacion.y = height - this.radius-7;
		}

		if (this.localizacion.y < this.radius) {
			//horizontalObjectCollisions++;
			diagonalObjectCollisions++;
			this.velocity.y = this.velocity.y * (-1);
			this.localizacion.y = this.radius+7;
		}
	}

	edgeCollisionHorizontal() {
		if (this.localizacion.x > width - this.radius) {
			//horizontalObjectCollisions++;
			diagonalObjectCollisions++;
			this.velocity.x = this.velocity.x * (-1);
			this.localizacion.x = width - this.radius-7;
		}

		if (this.localizacion.x < this.radius) {
			horizontalObjectCollisions++;
			diagonalObjectCollisions++;
			this.velocity.x = this.velocity.x * (-1);
			this.localizacion.x = this.radius+7;
		}

		if (this.localizacion.y > height - this.radius) {
			//horizontalObjectCollisions++;
			diagonalObjectCollisions++;
			this.velocity.y = this.velocity.y * (-1);
			this.localizacion.y = height - this.radius-7;
		}

		if (this.localizacion.y < this.radius) {
			//horizontalObjectCollisions++;
			diagonalObjectCollisions++;
			this.velocity.y = this.velocity.y * (-1);
			this.localizacion.y = this.radius+7;
		}
	}
}