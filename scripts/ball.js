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