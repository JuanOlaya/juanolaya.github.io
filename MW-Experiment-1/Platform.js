/* 
	***** PLATFORM CLASS *****
	ECMAScript 6 Class Definition:
	http://es6-features.org/#ClassDefinition
*/ 

class Platform {
  constructor(posX,index) {
   
		this.rw = random(300, 350);
		//this.rw = wi;
    	//this.rh = random(30, 370);
		this.rh = 300;
		this.rx = posX;
    	this.ry = height - this.rh;   //height - heightPlatform
    	this.colour = color(100); // red
		//this.alea=random(-1,1);	 
		//if(random(-1,1)<=0){
		this.index=index;
		this.entro=false;
		this.tiempoInicio=0;
		this.timePlat=0;
		this.blocked=platStatus;  // 0 = up/down   1=up
		
		//this.speed=speed
		
		if(index%2==0){
			//this.speed=-1*random(0.3,1.2);
			this.speed=-1*random(0.3,0.5);
			//this.speed=-1;
			 }
		else{
			//this.speed=random(0.3,1.2);
			//this.speed=1*random(0.4,0.8);
			this.speed=0.6;
		}
		
		this.visited=false;
		
		if(this.index==stairsPattern1 || this.index==flatPattern1){
			this.powerUp = new PowerUp(this.rx,this.rw);
		}
  }
	
	setColour(){	
		this.visited=true;
		this.colour =color("#E85243");
	}

	show (numPlatCol,posPlayer){
		
		if(this.index==numPlatCol && this.visited==true){
			if(this.entro==false){
				this.entro=true;
				this.tiempoInicio=millis();
			}
			this.timePlat=Math.round((millis()-this.tiempoInicio)/1000);
			if(mouseX>7*width/8 && mouseY>5){
				textSize(15);
				textAlign(RIGHT);
				fill("#E85243");
				text("Waiting Time on Current Platform: "+this.timePlat+" seconds",posPlayer-translateDistance+width-20,110);
				text("Number Current Platform: "+numPlatCol,posPlayer-translateDistance+width-20,140);
			}
		}
		//text("Waiting time: "+this.timePlat+" seconds",posPlayer+30,30*(this.index+1));  //LIST
		
		if(/*this.blocked==0*/ platStatus==0){
			this.rh=this.rh+this.speed;
			if(this.rh>70*height/100){ // height is aprox. 1075
				this.speed=this.speed*-1;
			}
			if(this.rh<4*height/100){
				this.speed=this.speed*-1;
			}
		}
		
		this.ry = height - this.rh;
		fill(this.colour);
    	//stroke(100);
    	//strokeWeight(1);
		rect(this.rx, this.ry+15 , this.rw, this.rh);
		
		if(this.index==stairsPattern1 || this.index==flatPattern1){
			this.powerUp.show(this.ry,this.rw);
		}
	}
}