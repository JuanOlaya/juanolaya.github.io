/* 
	***** HORIZONTALCAR CLASS *****
	#ConcreteClass #SubClass
	
	ECMAScript 6 Class Definition: 
	http://es6-features.org/#ClassDefinition
	
	ECMAScript 6 Class Inheritance: 
	http://es6-features.org/#ClassInheritance
*/

class HorizontalCar extends Car {
    constructor(posX, posY, veloX, veloY, colorcito) {
      super(posX, posY, veloX, veloY, colorcito);
      this.widthCar = 180;
      this.heightCar = 8;
    }
    moveRight() {
      if (this.availableMovement) {
        //this.xpos = this.xpos + this.xspeed;
              this.xpos = this.xpos + speed;
        if (this.xpos > width) {
          this.xpos = -this.widthCar;
        }
      }
    }
    moveLeft() {
      if (this.availableMovement) {
        //this.xpos = this.xpos - this.xspeed;
              this.xpos = this.xpos + speed;
        if (this.xpos < -this.widthCar) {
          this.xpos = width;
        }
      }
    }
  }
  