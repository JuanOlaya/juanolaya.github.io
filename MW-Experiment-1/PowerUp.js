class PowerUp{
	constructor(posX,rw){
		this.posY=0;
		this.radius=60;
	}
	show(y,w){
		this.posY=y-40;
		fill(255,150,0);
		noStroke();
		ellipse(this.posX,this.posY,this.radius,this.radius);
		fill(0);
		ellipse(this.posX,this.posY,15,15);
	}
}