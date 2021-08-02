/*
  by Juan Olaya
  https://juanolaya.github.io/
*/

let balls = [];
let colores = [];
let oprimido=false;
let oprimidoHorizontal=false;
let backColor;
let canvas;
let horizontalObjectCollisions=0;
let diagonalObjectCollisions=0;
let mobile=false;
let startTime= 0;
let pressTimeHorizontal; 
let releaseTimeHorizontal;
let pressTimeDiagonal;
let releaseTimeDiagonal;
let thresholdDiagonalCollisions=4;
let gridStatus=true;
let gridContainer = document.getElementById("cardGrid");


let fullscreen = document.getElementById("fullscreenIcon");
fullscreen.style.display = "none";

/*
let gridOff = document.getElementById("gridOffIcon");
gridOff.style.display = "none";
*/
let gridOn = document.getElementById("gridOnIcon");
gridOn.style.display = "none";


let refreshIcon = document.getElementById("refreshIcon");
refreshIcon.style.display = "none";
/*
let oneUnselected = document.getElementById("oneUnselected");
oneUnselected.style.display = "none";
let twoUnselected = document.getElementById("twoUnselected");
twoUnselected.style.display = "none";
let threeUnselected = document.getElementById("threeUnselected");
threeUnselected.style.display = "none";
*/

/*
var w = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;
*/

/*
function windowsResized(){
	resizeCanvas(windowWidth,windowHeight);
}
*/


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
		balls.push( new Ball(random(100, width / 2), random(86, height / 2), 3, 3, 0, 0.1, colores[0]));  //orange
		balls.push( new Ball(width-90, 100, 4, 4, 0, 0.1, colores[1]));
		
	}else{
		balls.push( new Ball(random(100, width / 2), random(86, height / 3), 3, 3, 0, 0.1, colores[0]));     //orange
		balls.push( new Ball(random( 2*width / 3, width-95), random(2*height/3, height - 100), 4, 4, 0, 0.1, colores[1]));
	}

	backColor=40;
	background(backColor);
}

function draw() {
	//console.log({windowWidth},{windowHeight},{w},{h});


	//console.log("Mobile:"+mobile);
	/*
	if(gridStatus==true){
		gridOff.style.display = "block";
		gridOn.style.display = "none";
		
		
	}else{
		gridOff.style.display = "none";
		gridOn.style.display = "block";
		
	}
	*/

	if(gridStatus){
		gridContainer.style.display = "block";
		fullscreen.style.display = "none";
		/*gridOff.style.display = "none";*/
		gridOn.style.display = "none";
		refreshIcon.style.display = "none";

	}else{
		gridContainer.style.display = "none";
		fullscreen.style.display = "block";
		//gridOff.style.display = "block";
		gridOn.style.display = "block";
		refreshIcon.style.display = "block";
	}

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
			diagonalObjectCollisions++;
			this.velocity.y = this.velocity.y * (-1);
			this.localizacion.y = height - this.radius-7;
		}

		if (this.localizacion.y < this.radius) {
			diagonalObjectCollisions++;
			this.velocity.y = this.velocity.y * (-1);
			this.localizacion.y = this.radius+7;
		}
	}
}

document.addEventListener('keyup', event => {
	if (event.code === 'Space') {
		gridStatus=!gridStatus;
		//console.log('Space pressed')
	}
});

//var elemBody = document.body; // Make the body go full screen.

var elem = document.documentElement;

document.getElementById("fullscreenIcon").addEventListener("click", function() {
	console.log("fuulllyy");
	/*
	let fs = fullscreen();
    fullscreen(!fs);
	*/

	if (!document.fullscreenElement){
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { // Safari 
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE11 
            elem.msRequestFullscreen();
        }
    } else{
     if (document.fullscreenElement){
        if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) { // Safari 
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { // IE11 
            document.msExitFullscreen();
          }
        }
    }
});

/*
document.getElementById("gridOffIcon").addEventListener("click", function() {

	gridStatus=!gridStatus;
	if(!gridStatus){
		gridContainer.style.display = "none";
		gridOff.style.display = "none";
		gridOn.style.display = "block";
		gridContainer.style.cursor = "pointer";
		refreshIcon.style.display = "block";
	
		oneUnselected.style.display = "block";
		twoUnselected.style.display = "block";
		threeUnselected.style.display = "block";
	
	}
});
*/

document.getElementById("gridOnIcon").addEventListener("click", function() {

	gridStatus=!gridStatus;
	if(gridStatus){
		gridContainer.style.display = "block";
		/*gridOff.style.display = "block";*/
		gridOn.style.display = "none";
		gridContainer.style.cursor = "default";
		refreshIcon.style.display = "none";
		/*
		oneUnselected.style.display = "none";
		twoUnselected.style.display = "none";
		threeUnselected.style.display = "none";
		*/
	}
});

document.getElementById("refreshIcon").addEventListener("click", function() {
	background(backColor);
	diagonalObjectCollisions=0;
	horizontalObjectCollisions=0;

	if(mobile==true){
		balls[0].localizacion.x=random(100, width / 2);  //orange
		balls[0].localizacion.y=random(86, height / 2);
		balls[1].localizacion.x=width-90;
		balls[1].localizacion.y= 100;

		pressTimeHorizontal = millis()+750; 
		releaseTimeHorizontal = millis()+1000;
		pressTimeDiagonal = millis()+500;  
		releaseTimeDiagonal = millis()+1000;
	}else{
		balls[0].localizacion.x=random(100, width / 2);    //orange
		balls[0].localizacion.y=random(86, height / 3);
		balls[1].localizacion.x=random(2*width / 3, width-95);
		balls[1].localizacion.y=random(100, height - 100);
		balls[1].velocity.x=3;

		pressTimeHorizontal = millis()+3000; 
		releaseTimeHorizontal = millis()+3250;
		pressTimeDiagonal = millis()+4500;  
		releaseTimeDiagonal = millis()+5000;
	}
});