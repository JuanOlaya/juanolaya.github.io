/* 
	***** PLAYER CLASS *****
	ECMAScript 6 Class Definition: 
	http://es6-features.org/#ClassDefinition

	** CIRCLE vs RECTANGLE COLLISION **
	(Player vs Platform)
	Collision Detection based on Jeff Thompson's algorithm
	http://www.jeffreythompson.org/collision-detection/
	and modified by Juan Olaya as can be seen in the example: 
	12 Sides Collision Detection
	https://www.openprocessing.org/sketch/627378
*/

class Player {
	
	constructor() {
		this.location = createVector(250, 25);
		//this.location = createVector(0, 25);
		this.velocity = createVector(0, 15);
		this.acceleration  = createVector(0, 40);
		this.colour = color(255);  //   #1B998B #6F8CFB
		this.radius = 40;
		this.side=0;		  // (ES) Atributo que almacena el lado de la colisión detectada
		this.speedX=8;
		this.minSpeed=0;  // (ES) Atributo que almacena la mínima velocidad alcanzada por el player
		this.distance=0;
	}
	
	// (ES) Método que muestra el objeto en la pantalla     
	show() {
		noStroke();
		//console.log("Location "+this.location.y+" height: "+height);
		fill(this.colour);
		ellipse(this.location.x, this.location.y, this.radius * 2, this.radius * 2);
		textSize(20);
		
		noFill();
		stroke(0);
		strokeWeight(5);
		arc(this.location.x, this.location.y, this.radius * 2-12, this.radius * 2-12, PI-PI/8, PI+PI/8);
		arc(this.location.x, this.location.y, this.radius * 2-12, this.radius * 2-12, 2*PI-PI/8, 2*PI+PI/8);
		noStroke();
		
		// (ES) this.minSpeed -> Atributo que almacena la mínima velocidad alcanzada por el player
		/*
		if(this.velocity.y < this.minSpeed){
			this.minSpeed=this.velocity.y;
		}
		*/
	}
	
	applyVelocityGravity() {
		if(this.side!=2 && this.distance <= this.radius){
			this.velocity.add(this.acceleration); //velocity.x = velocity.x + acceleration.x; //velocity.y = velocity.y + acceleration.y;
			
		}
		this.location.add(this.velocity);     //location.x = location.x + velocity.x; //location.y = location.y + velocity.y; 
	}
	
	// (ES) Este método hace rebotar la bola si toca los bordes de la pantalla
	// (EN) Bounce on the edges of the screen
	bounceEdges(){
	//console.log("Location "+this.location.y+" height: "+height);
		if (this.location.y > height ) {
			//console.log("Entra ");

			this.location = createVector(250, 25);			
			this.velocity = createVector(0, 15);
			this.side=0;
		}
		/*
		if (this.location.y < this.radius-100) {
			this.velocity.y = this.velocity.y * (-1);
			this.location.y = this.radius;
		}
		*/
	}

	collisionCircleRect(rx, ry, rw, rh) {

		// (EN) temporary variables to set edges for testing
		let testX = this.location.x;
		let testY = this.location.y;

		if(this.location.x<rx && this.location.y<ry){  // Está arriba a la izquierda?
			this.side=1;
			testX = rx;
		}

		/*
		if (this.location.y < ry)  {         // (ES) Está arriba? 
			testY = ry;        // (EN) top edge
			this.side=2;
		}else if (this.location.y > ry+rh) {  // (ES) Está abajo? 
			testY = ry+rh;     // (EN) bottom edge
			this.side=6;
		}
	
		if(this.location.x>rx+rw && this.location.y<ry){ // Está arrriba a la derecha?
			this.side=3;
			testX = rx+rw;
		}
		*/
		
			// (EN) which edge is closest?
		if (this.location.x < rx){           // (ES) Está a la izquierda? 
				testX = rx;        // (EN) compare to left edge
				this.side=8;
		}
		else if (this.location.x > rx+rw) {  // (ES) Está a la derecha? 
				testX = rx+rw;     // (EN) right edge
				this.side=4;
		}
		
		
		if (this.location.y < ry)  {         // (ES) Está arriba? 
				testY = ry;        // (EN) top edge
				this.side=2;
		}
		else if (this.location.y > ry+rh) {  // (ES) Está abajo? 
					testY = ry+rh;     // (EN) bottom edge
					this.side=6;
		}

		
		
		if(this.location.x>rx+rw && this.location.y>ry+rh){   // Está abajo a la derecha?
			testY = ry+rh;
			this.side=5;
		}
		
		if(this.location.x<rx && this.location.y>ry+rh){ // Está abajo a la izquierda?
			testY = ry+rh;
			this.side=7;
		}
		
		// (EN) get distance from closest edges
		let distX = this.location.x - testX;
		let distY = this.location.y - testY;
		//let distance = sqrt((distX * distX) + (distY * distY));
		this.distance = sqrt((distX * distX) + (distY * distY));

		// (EN) if the distance is less than the radius, collision!

		if (this.distance <= this.radius) {
			if( this.side == 1){ 
				this.location.x =rx;
				this.location.y = ry - this.radius;	
				//this.velocity.x = abs(this.velocity.y) *-1 ;
				//this.velocity.x = this.velocity.x *-1 ;
				//this.location.x = rx - this.radius;  
			}
			
			if( this.side == 2){ 
				//this.cambiaColor
				this.location.y = ry - this.radius;	
			}
			
			if( this.side == 3){ 
				//this.location.y = ry - this.radius;	
				//this.velocity.x = abs(this.velocity.y) *-1 ;
				this.velocity.x = this.velocity.x *-1
			}
			
			if(this.side == 4){ 
				this.velocity.x = this.velocity.x  *-1 ;
				this.location.x = rx+rw + this.radius; 
			}
			if(this.side == 5){ 
				this.velocity.x = this.velocity.x * (-1);
				//this.location.x = rx+rw + this.radius;
			}
			if(this.side == 6){ 
				this.velocity.y = this.velocity.y * (-1);
				//this.location.x = rx+rw + this.radius; 
			}
			if(this.side == 7){ 
				this.velocity.y = this.velocity.y * (-1);
				//this.location.y = ry +rh +this.radius; 
			}
			if(this.side == 8 ){ 
				//this.velocity.x = this.velocity.x * (-1);
				this.location.x = rx - this.radius;
			}
			return true;
		}
		return false;
	}
	
	moveLeft(){
    //this.location.x = constrain(this.location.x-this.speedX, this.radius, widthGame-this.radius);
		this.location.x = constrain(this.location.x-this.speedX, this.radius, widthGame);
  }

  moveRight(){
    //this.location.x = constrain(this.location.x+this.speedX, this.radius, widthGame-this.radius);
		this.location.x = constrain(this.location.x+this.speedX, this.radius, widthGame);
  }
	/*
	moveUp() {
		if(this.velocity.y<0){
			this.velocity.y=this.velocity.y-0.6;
			if(this.velocity.y<-9){
				this.velocity.y=-9;
			}
		}
	}
	*/
}