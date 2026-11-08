/* 
	***** CAR CLASS *****
	#AbstractClass #SuperClass

	ECMAScript 6 Class Definition: 
	http://es6-features.org/#ClassDefinition
	
	ECMAScript 6 Class Inheritance: 
	http://es6-features.org/#ClassInheritance
*/ 

class Car { 
	constructor(posX, posY,veloX,veloY, colorcito) {
    this.colour = colorcito;
    this.xpos = posX;
    this.ypos = posY;
	this.xspeed = speed;
	this.yspeed = speed;
	this.tiempoInicio=0;
	this.tiempoEspera=random(1000,7000);
	this.availableMovement=true;
  }
	display() {
    noStroke();
		fill(this.colour);
    rect(this.xpos, this.ypos, this.widthCar, this.heightCar,15);
		if(millis()-this.tiempoInicio>this.tiempoEspera){
			this.tiempoInicio=millis();
			this.availableMovement=!this.availableMovement;
			if(this.availableMovement==true){  // ON
				this.tiempoEspera=random(4000,10000);
			} 
			else if (this.availableMovement==false){  // OFF
				this.tiempoEspera=random(1000,7000);
			}
		}
  }
}