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
		this.side=0;		  // (ES) Atributo que almacena el lado de la colision detectada
		this.speedX;
		
		this.minSpeed=0;  // (ES) Atributo que almacena la mi­nima velocidad alcanzada por el player
		this.distance=0;
		this.inTheAir= false;

		this.radius = 40;
		this.count=0;
		this.radiusX=0;
		/*
		if(caseNumber%2==0){
			this.radius = 40;
		}else{
			this.radius = 25;
		}
		if(caseNumber%2==-1){
			this.radius = 25;
		}*/
	}
	
	// (ES) MÃ©todo que muestra el objeto en la pantalla     
	show() {
		if(screen=="undemanding"){
			this.speedX=12;
		}
		if(screen=="demanding"){
			this.speedX=15;
		}

		noStroke();
		//console.log("Location "+this.location.y+" height: "+height);
		
		if(playerMovement){
			fill(this.colour);
			ellipse(this.location.x, this.location.y, this.radius * 2, this.radius * 2);

			stroke(0);
			strokeWeight(5);
			ellipse(this.location.x, this.location.y, this.radius*1.25 , this.radius*1.25 );
			noStroke();
			/*
			rectMode(CENTER);
			rect(this.location.x, this.location.y, this.radius * 2, this.radius * 2,this.count);
			rectMode(CORNER);
			*/
			//textSize(20);	

			noFill();
			stroke(0);
			strokeWeight(5);
			//arc(this.location.x, this.location.y, this.radius * 2-12, this.radius * 2-12, PI-PI/8, PI+PI/8);
			//arc(this.location.x, this.location.y, this.radius * 2-12, this.radius * 2-12, 2*PI-PI/8, 2*PI+PI/8);
			

			noStroke();
			this.count=50;
			this.radiusX=0;
		}else{
			/*
			fill(130);
			ellipse(this.location.x, this.location.y, this.radius * 2, this.radius * 2);
			*/

			
			
			
			noStroke();
			fill(this.colour);
			rectMode(CENTER);
			rect(this.location.x, this.location.y, this.radius * 2, this.radius * 2,this.count);
			stroke(0);
			strokeWeight(5);
			rect(this.location.x, this.location.y, this.radius*1.25 , this.radius*1.25 ,this.count);
			noStroke();
			rectMode(CORNER);
			noStroke();

			this.count=this.count-7;
			if(this.count<15){
				this.count=15;
			}
			this.radiusX=this.radiusX+5;
			if(this.radiusX>25){
				this.radiusX=25;
			}
			//console.log(this.count);

			stroke(0);
			strokeWeight(5);
			let posX1 = this.location.x+this.radiusX*cos(PI+PI/4);
			let posY1 = this.location.y+this.radiusX*sin(PI+PI/4);
			let posX2 = this.location.x+this.radiusX*cos(PI/4);
			let posY2 = this.location.y+this.radiusX*sin(PI/4);
			line(posX1,posY1,posX2,posY2);

			let posX3 = this.location.x+this.radiusX*cos(3*PI/4);
			let posY3 = this.location.y+this.radiusX*sin(3*PI/4);
			let posX4 = this.location.x+this.radiusX*cos(7*PI/4);
			let posY4 = this.location.y+this.radiusX*sin(7*PI/4);
			line(posX3,posY3,posX4,posY4);
			noStroke();
			/*
			noFill();
			strokeWeight(4);
			stroke(0);
			rect(this.location.x, this.location.y, this.radius+5 , this.radius+5 ,6);
			rectMode(CORNER);
			noStroke();
			*/
		}
		// (ES) this.minSpeed -> Atributo que almacena la mÃ­nima velocidad alcanzada por el player
		/*
		if(this.velocity.y < this.minSpeed){
			this.minSpeed=this.velocity.y;
		}
		*/
	}
	
	applyVelocityGravity() {
		/*
		if(this.side!=2 && this.distance <= this.radius){
			this.velocity.add(this.acceleration); //velocity.x = velocity.x + acceleration.x; //velocity.y = velocity.y + acceleration.y;
			
		}
		this.location.add(this.velocity);     //location.x = location.x + velocity.x; //location.y = location.y + velocity.y; 
		*/
		if(!interruption){
			if(jumpingMode==false){
				if(this.side!=2 && this.distance <= this.radius){
					this.velocity.add(this.acceleration); //velocity.x = velocity.x + acceleration.x; //velocity.y = velocity.y + acceleration.y;
				}
			}
			else{
				this.velocity.add(this.acceleration); //velocity.x = velocity.x + acceleration.x; //velocity.y = velocity.y + acceleration.y;
			}
			this.location.add(this.velocity);     //location.x = location.x + velocity.x; //location.y = location.y + velocity.y; 
		}
	}
	
	// (ES) Este mÃ©todo hace rebotar la bola si toca los bordes de la pantalla
	// (EN) Bounce on the edges of the screen
	bounceEdges(){
	//console.log("Location "+this.location.y+" height: "+height);
		if (this.location.y > height ) {
			//console.log("Entra ");

			//this.location = createVector(this.location.x-this.radius * 3, 25);			
			
			this.location.x = platforms[numCurrentPlat].rx+this.radius*1;
			this.location.y = platforms[numCurrentPlat].ry-this.radius*3;
			this.velocity = createVector(0, 15);
			this.side=0;

			negativePoints=negativePoints-3;
		}
		/*
		if (this.location.y < this.radius-100) {
			this.velocity.y = this.velocity.y * (-1);
			this.location.y = this.radius;
		}
		*/
	}

	/*
	inTheAir(rx, ry, rw){
		if (this.location.y < ry && this.location.x < rx+rw && this.location.x > rx)  {         // (ES) EstÃ¡ arriba? 
			//this.inTheAir= false;
			return true;
		}
		return false;
	}*/

	collisionCircleRect(rx, ry, rw, rh) {

		// (EN) temporary variables to set edges for testing
		let testX = this.location.x;
		let testY = this.location.y;

		

		/*
		if (this.location.y < ry)  {         // (ES) EstÃ¡ arriba? 
			testY = ry;        // (EN) top edge
			this.side=2;
		}else if (this.location.y > ry+rh) {  // (ES) EstÃ¡ abajo? 
			testY = ry+rh;     // (EN) bottom edge
			this.side=6;
		}
	
		if(this.location.x>rx+rw && this.location.y<ry){ // EstÃ¡ arrriba a la derecha?
			this.side=3;
			testX = rx+rw;
		}
		*/
		
			// (EN) which edge is closest?
		if (this.location.x < rx){          
			//if(this.location.y> ry && this.location.y< ry+rh){	  // Nueva linea
				testX = rx;       	// (ES) EstÃ¡ a la izquierda? 
				this.side=8;		// (EN) compare to left edge
			//}
		}
		else if (this.location.x > rx+rw) {  
			//if(this.location.y> ry && this.location.y< ry+rh){	  // Nueva linea
				testX = rx+rw;      // (ES) EstÃ¡ a la derecha? 
				this.side=4;  		// (EN) right edge
			//}
		}
		
		if (this.location.y < ry)  {
			//if(this.location.x> rx && this.location.x< rx+rw){	// Nueva linea
				testY = ry;        		// (ES) EstÃ¡ arriba? 
				this.side=2;			// (EN) top edge
			//}
		}
		else if (this.location.y > ry+rh) {  
			//if(this.location.x> rx && this.location.x< rx-rw){	// Nueva linea	
				testY = ry+rh;     // (ES) EstÃ¡ abajo? 
				this.side=6;		// (EN) bottom edge
			//}
		}

		if(this.location.x<rx && this.location.y<ry){  // EstÃ¡ arriba a la izquierda?
			this.side=1;
			testX = rx;
		}

		if(this.location.x>rx+rw && this.location.y<ry){  // Esta arriba a la derecha?
			this.side=3;
			testX = rx;
		}

		if(this.location.x>rx+rw && this.location.y>ry+rh){   // EstÃ¡ abajo a la derecha?
			testY = ry+rh;
			this.side=5;
		}
		
		if(this.location.x<rx && this.location.y>ry+rh){ // EstÃ¡ abajo a la izquierda?
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
				//this.location.x =rx - this.radius-1;
				//this.location.x =rx;   // avoid go back
				this.location.y = ry - this.radius;	

				/*
				if(this.velocity.x>this.velocity.y){
					this.velocity.x = abs(this.velocity.x) *-1 ;
				}else{
					this.velocity.x = abs(this.velocity.y) *-1 ;
				}
				*/
				//this.velocity.x = this.velocity.x *-1 ;

				if(arrowLeft){
					this.location.x = rx - this.radius - 0; 
				}

				if(arrowRight){
					//this.location.x = rx + 2; 
				}
				 
				playerMovement=true;
			}
			
			if( this.side == 2){ 
				//this.cambiaColor
				//this.location.y = ry - this.radius;

				if(jumpingMode==false){
					this.location.y = ry - this.radius;
				}
				else{
					this.location.y = ry - this.radius;
					//this.velocity.y = this.velocity.y * (-1.02);
					this.velocity.y = -7;
					this.velocity.x = 0;
				}
			}
			
			if( this.side == 3){ 
				this.location.y = ry - this.radius;	
				/*
				if(this.velocity.x>this.velocity.y){
					this.velocity.x = abs(this.velocity.x)  *-1 ;
				}else{
					this.velocity.x = abs(this.velocity.y)
				}
				*/
				//this.location.x =rx+rw;
				if(arrowLeft){
					//this.location.x = rx +rw- 2; 
				}

				if(arrowRight){
					this.location.x = rx +rw+this.radius+0; 
				}
				//this.velocity.x = this.velocity.x *-1;
				playerMovement=true;
			}
			
			if(this.side == 4){ 
				this.velocity.x = this.velocity.x  *-1 ;
				this.location.x = rx+rw + this.radius;
				playerMovement=true; 
			}
			if(this.side == 5){ 
				this.velocity.x = this.velocity.x * (-1);
				//this.location.x = rx+rw + this.radius;
				playerMovement=true;
			}
			if(this.side == 6){ 
				this.velocity.y = this.velocity.y * (-1);
				//this.location.x = rx+rw + this.radius; 
				playerMovement=true;
			}
			if(this.side == 7){ 
				this.velocity.y = this.velocity.y * (-1);
				//this.location.y = ry +rh +this.radius; 
				playerMovement=true;
			}
			if(this.side == 8 ){ 
				//this.velocity.x = this.velocity.x * (-1);
				this.location.x = rx - this.radius-1;
				if (arrowRight == true){
					playerMovement=false;
				}
			}
			return true;
		}
		return false;
	}

	collisionFlag(/*cx, cy, radius,*/ rx,  ry, rw, rh) {
  
		// temporary variables to set edges for testing
		let testX = this.location.x;
		let testY = this.location.y;
		
		// which edge is closest?
		if (this.location.x < rx)         testX = rx;        // compare to left edge
			else if (this.location.x > rx+rw) testX = rx+rw;     // right edge
		if (this.location.y < ry)         testY = ry;        // top edge
			else if (this.location.y > ry+rh) testY = ry+rh;     // bottom edge
		
		// get distance from closest edges
		let distX = this.location.x-testX;
		let distY = this.location.y-testY;
		let distance = sqrt( (distX*distX) + (distY*distY) );
		
		// if the distance is less than the radius, collision!
		if (distance <= (this.radius/2-10)) {
		  return true;
		}
		return false;
	}

	collisionPowerUp(/*int x1, int y1, int d1, */x2, y2, d2) {

		// find distance between the two objects
		let xDist = this.location.x-x2;                                   // distance horiz
		let yDist = this.location.y-y2;                                   // distance vert
		let distance = sqrt((xDist*xDist) + (yDist*yDist));  // diagonal distance
	  
		// test for collision
		if ( (this.radius) + (d2)/2 > distance) {
		  return true;    // if a hit, return true
		}
		else {            // if not, return false
		  return false;
		}
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