class PowerUp{
	constructor(posX,posY){
		this.posX=posX;
		this.w=60;
		this.h=60;
	}
	show(y,w){
		fill(255,150,0);
		noStroke();
		ellipse(this.posX+(w/2)/*-(this.w/2)*/,y-50,this.w,this.h);
		fill(0);
		ellipse(this.posX+(w/2)/*-(this.w/2)*/,y-50,15,15);
	}
}