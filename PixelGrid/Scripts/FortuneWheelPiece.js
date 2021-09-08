/*
	INSPIRATIONAL WALL
*/

class PiePiece {
  
	constructor(startA, stopA,texto,colour){
		this.startAngle=startA;
		this.stopAngle=stopA;
		this.radius=500;
		this.texto=texto;
		this.pieceAmount=5;
		this.color=colour;
	}
	
	show(rotF) {
		stroke(this.color);
		strokeWeight(1);
		fill(this.color);
		arc(0,0, this.radius, this.radius, this.startAngle+rotF, this.stopAngle+rotF,PIE);
		
		fill(0);
		noStroke();

		push();
		rotate((this.startAngle+rotF)+PI/this.pieceAmount);
		textAlign(CENTER,CENTER);
		textSize(25);
		textStyle(BOLD);
		fill(255);
			push();
			//rotate(PI/2);
			text(this.texto,150,0);
			pop();
		pop();
  	}
}