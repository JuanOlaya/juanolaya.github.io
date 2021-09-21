/*
	INSPIRATIONAL WALL
*/


function artwork(){
	for(let i=0 ; i<artistList.length;i++){
		artistList[i].show();
	}
    homeButtonArt();
}

function homeButtonArt(){
	/*
	noFill();
	stroke(200);
	strokeWeight(5);
	rect(width-3*height/20,69*height/80,height/7,height/7-5);
	fill(200);
	textSize(20);
	textAlign(CENTER,CENTER);
	noStroke();
	text("HOME",width-4*height/50,149*height/160);
	*/

	//fill(200);
	fill("#EB5278");
	noStroke();
	for(let i=0,x=375*width/400;i<4;i++,x=x+20){
		for(let j=0,y=358*height/400 ;j<3;j++,y=y+20){
			ellipse(x,y,10,10);
		}
	}
}

function profile1(){

	fill("#8C8C8C");
	rect(0,0,width,height/12);

	fill("#B7B7B7");
	let x=width/2-75;
	let y=height/24;
	
	ellipse(width/2, y ,height/14,height/14);
	
	//rectMode(CENTER);
	noFill();
	stroke("#D1D1D1");
	strokeWeight(2);
	rect(width/24,height/2-75,200,150);

	noStroke();
	rectMode(CORNER);
	fill("#2D3235");
	textStyle(BOLD);
	textAlign(LEFT,TOP);
	textSize(20);
	//ellipse(this.posX+80,this.posY-70,40,40);
	text("ANNA SCHMIDT", width/24 +15,height/2-60 );
	textStyle(NORMAL);
	textSize(20);
	fill("#98A5B1");
	text("Skulptur",width/24 +15,height/2-40);
	aumento=noise(step)* 300;
  	step = step + 0.009;
  
	aumento=noise(step)* 200;
	step = step + 0.0009;
	push();
	translate(width/2, height/2);
	rotate(frameCount / 50.0);
	polygon(0, 0, aumento, 5);  
	pop();

	homeButtonArt();
}

function polygon( x,  y, radius,npoints) {
	let angle = TWO_PI / npoints;
	  
	fill(45);
	beginShape();
	for (let a = 0; a < TWO_PI; a += angle) {
	  let sx = x + cos(a) * radius;
	  let sy = y + sin(a) * radius;
	  vertex(sx, sy);
	}
	endShape(CLOSE);
  }