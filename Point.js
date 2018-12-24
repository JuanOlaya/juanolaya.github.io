class Point {
	//PVector location= new PVector();
  //PVector velocity= new PVector();
  //PVector gravity = new PVector();
  //float radius;

  constructor(xposi, yposi, velX,velY, gravX,gravY) {
    this.location = createVector(xposi,yposi);   
  	this.velocity = createVector(velX,velY);      
  	this.gravity = createVector(gravX,gravY); 
		this.radius = 0.1;
		/*
		location.x = xposi;
    location.y = yposi;
    velocity.x=velX;
    velocity.y=velY;
    gravity.x=gravX;
    gravity.y=gravY;
    radius = 0.1;
  	*/
	}

  mover() {
    this.location.add(this.velocity);  
    this.velocity.add(this.gravity);   

    if (this.location.x > width -this.radius) {
      this.velocity.x = this.velocity.x*(-1);
      this.location.x = width-this.radius;
    }
    if ( this.location.x < -this.radius) {
      this.velocity.x = this.velocity.x*(-1);
      this.location.x = this.radius;
    }
    if (this.location.y > height -this.radius) {
      this.velocity.y = this.velocity.y *(-1);
      this.location.y = height-this.radius;
    }
    if (this.location.y < this.radius) {
      this.velocity.y = this.velocity.y *(-1);
      this.location.y = this.radius;
    }
  }
}