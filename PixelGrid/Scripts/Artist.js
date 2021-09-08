/*
	INSPIRATIONAL WALL
*/

class Artist{

	constructor(posX,posY,name,type,photo){
		this.posX=posX;
		this.posY=posY;
		this.diameter=140;
		this.photo = photo;
		this.name = name;
		this.type = type;
	}
	
	show(){
		fill("#EB5278 ");  //#596869
		ellipse(this.posX,this.posY,this.diameter,this.diameter);
		fill("#EB5278");   // #2B2B2B
		textStyle(BOLD);
		textAlign(LEFT,TOP);
		textSize(30);
		//ellipse(this.posX+80,this.posY-70,40,40);
		text(this.name,this.posX+80,this.posY-(this.diameter/5));
		textStyle(NORMAL);
		textSize(20);
		fill("#98A5B1");
		text(this.type,this.posX+80,this.posY-(this.diameter/5)+30);
		//image(this.photo, this.posX,this.posY);
	}
}