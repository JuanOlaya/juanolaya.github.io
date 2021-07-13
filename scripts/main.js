/*
  ***** *****
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

		pressTimeHorizontal = 4000; 
		releaseTimeHorizontal = 4250;
		pressTimeDiagonal = 8500;  
		releaseTimeDiagonal = 9000;
		thresholdDiagonalCollisions=5;
	}
	
	//canvas = createCanvas(400,windowHeight);
	
	canvas.position(0,0);	  
	canvas.style("z-index",-1);
	                                                // Names of colors from coolors.co/app
	colores[0] = color('rgba(196,130,8, 0.25)');      //Orange
	colores[1] = color('rgba(25,139,198, 0.25)');    // Cyan Cornflower Blue ->'#198BC6'
	//colores[0] = color('rgba(228, 53, 37, 0.25)');   // red
	//colores[1] = color('rgba(232, 82, 67, 0.25)');    // Carmine Pink -> '#E85243'
	//colores[1] =color('rgba(255, 165, 0, 0.25)')        // Orange (Yellow) Web -> #FFA500
	//colores[0] = color('rgba(104, 100, 145, 0.25)');   // Dark Blue-Gray -> '#686491'

	/*for (let i = 0; i < 2; i++) {
		balls.push( new Ball(random(86, width / 2), random(86, height / 2), 2, 2, 0, 0.1, colores[i%4]));
	}*/
	
	
	if(mobile==true){
		balls.push( new Ball(random(100, width / 2), random(86, height / 2), 3, 3, 0, 0.1, colores[0]));
		balls.push( new Ball(width-90, 100, 4, 4, 0, 0.1, colores[1]));
		
	}else{
		balls.push( new Ball(random(100, width / 2), random(86, height / 3), 3, 3, 0, 0.1, colores[0]));
		balls.push( new Ball(random( 2*width / 3, width-95), random(100, height - 100), 4, 4, 0, 0.1, colores[1]));
	}

	//backColor=color(244,237,221);
	backColor=40;
	background(backColor);
	/*
	console.log("windowWidth: "+windowWidth);
	console.log("windowHeight: "+windowHeight);

	console.log("Width: "+width);
	console.log("height: "+height);
	*/
}

function draw() {
	console.log("Mobile:"+mobile);
	//if(width>height){
	//for (let j = 0; j < balls.length; j++) {
		//if(mouseX<6*width/7){
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
		//}
	//}
	//}
	
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
	
	//MÉTODO MOSTRAR    
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
		//this.velocity.add(this.gravity); //velocity.x = velocity.x + gravity.x;
		this.localizacion.add(this.velocity); //location.x = location.x + velocity.x; 
	}

	moveLeft(){
		this.localizacion.x = this.localizacion.x - this.velocity.x; 
		//this.localizacion.sub(this.velocity);
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


/*
  fill("#3B2640");
  circle(5*width/100+(diameter/2),height-(5*height/100),diameter);
  stroke("#F4F0F9");
  strokeWeight(5);
  line(5*width/100+(diameter/2),height-(5*height/100)+8.5,   5*width/100+(diameter/2)-10 ,height-(5*height/100)-9);
  line(5*width/100+(diameter/2),height-(5*height/100)+8.5,   5*width/100+(diameter/2)+10 ,height-(5*height/100)-9);
  noStroke();
  circle(5*width/100+(diameter/2)+diameter*1.3,height-(5*height/100),diameter);
  stroke("#F4F0F9");
  strokeWeight(5);
  line(5*width/100+(diameter/2)+diameter*1.3,height-(5*height/100)-11,   5*width/100+(diameter/2)+diameter*1.3-10 ,height-(5*height/100)+6.5);
  line(5*width/100+(diameter/2)+diameter*1.3,height-(5*height/100)-11,   5*width/100+(diameter/2)+diameter*1.3+10 ,height-(5*height/100)+6.5);
  noStroke();  
  */


  //function mousePressed() {
	/*
	if(dist(5*width/100+(diameter/2)+diameter*1.3,height-(5*height/100),mouseX,mouseY)<diameter/2){
		speed++;
	}else if(speed>0 && dist(5*width/100+(diameter/2),height-(5*height/100),mouseX,mouseY)<diameter/2){
		speed--;
	}
	*/

	/*
	if(speedPos<2){
		speedPos++;
	}else {
		speedPos=0;
	}
	speed=speedArray[speedPos];
	*/
//}
