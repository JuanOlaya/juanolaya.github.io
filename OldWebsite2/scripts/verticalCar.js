/* 
	***** VERTICALCAR CLASS *****
	#ConcreteClass #SubClass
	
	ECMAScript 6 Class Definition: 
	http://es6-features.org/#ClassDefinition
	
	ECMAScript 6 Class Inheritance: 
	http://es6-features.org/#ClassInheritance
*/ 

class VerticalCar extends Car { 
  
	constructor(posX, posY,veloX,veloY, colorcito) {
    super(posX, posY,veloX,veloY, colorcito);
		this.widthCar=8;
		//this.widthCar=90;
    this.heightCar=180;
  }
	moveUp() {
		if(this.availableMovement){
    	//this.ypos = this.ypos + this.yspeed;
			this.ypos = this.ypos + speed;
    	if (this.ypos > height) {
      	this.ypos = - this.widthCar;
				//this.xpos = random(0,width-this.heightCar);
    	}
		}
  }
  moveDown() {
		if(this.availableMovement){
    	//this.ypos = this.ypos - this.yspeed;
			this.ypos = this.ypos - speed;
    	if (this.ypos <  - this.heightCar) {
      	this.ypos = height;
				//this.xpos = Math.floor(random(0,10))*100;
    	}
		}
  }
}