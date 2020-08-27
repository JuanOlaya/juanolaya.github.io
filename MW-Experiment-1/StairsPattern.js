class StairsPattern{
	constructor(posX,rw){
        this.posX=posX+rw/2;
        this.posY=0;
		this.radius=60;
	}
	show(y){
		this.posY=y-40;
		/*
		fill(255,150,0);
		noStroke();
		ellipse(this.posX,this.posY,this.radius,this.radius);
		fill(0);
        ellipse(this.posX,this.posY,15,15);
        fill(255);
		text("Stairs",this.posX,this.posY);
		*/

		fill(255,150,0);
		noStroke();
		//rectMode(CENTER);
		rect(this.posX-40,this.posY-80,20,100);
		rect(this.posX-18,this.posY-60,20,80);
		rect(this.posX+4,this.posY-40,20,60);
		rect(this.posX+26,this.posY-20,20,40);
		//rectMode(CORNER);
	}
}