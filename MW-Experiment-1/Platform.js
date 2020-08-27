/* 
	***** PLATFORM CLASS *****
	ECMAScript 6 Class Definition:
	http://es6-features.org/#ClassDefinition
*/ 

class Platform {
	constructor(posX,index, speedMin, speedMax) {
   
		if(caseNumber%2==0 || caseNumber%2!=0){
			this.rw = speedMax; //cambiar speedMax luego por widthPlat
			this.speed=speedMin;
		}
		/*else{
			this.rw = random(100, 230);
			if(index%2==0){
				//this.speed=-1*random(0.3,1.2);
				this.speed=-1*random(speedMin,speedMax);   // 0.3 - 0.5
				//this.speed=-1;
				//this.speed=speedMin;
				 }
			else{
				//this.speed=random(0.3,1.2);
				//this.speed=1*random(0.4,0.8);
				this.speed=random(speedMin,speedMax);    // 0.6
			}
		}*/


		if(caseNumber%2==-1){
			this.rw = random(100, 230);
		}

		//this.rw = wi;
    	//this.rh = random(30, 370);
		this.rh = 300;
		this.rx = posX;
    	this.ry = height - this.rh;   //height - heightPlatform
    	this.colour = color(100);     // 
		//this.alea=random(-1,1);	 
		//if(random(-1,1)<=0){
		this.index=index;					//db
		this.entro=false;
		this.tiempoInicio=0;
		this.partialTimesOnPlat=[];
		this.tempTotalTimeOnPlat=0;
		this.totalTimeOnPlat=0;				//db
		this.timeCurrentVisitOnPlat=0;		//db
		this.longestTime=0;
		this.blocked=platStatus;  				  // 0 = up/down   1=up
		this.amountTimesOnPlatform=0;		//db
		this.partialRightArrowStrokes=[];
		this.partialLeftArrowStrokes=[];
		this.tempLeftStrokes=0;
		this.tempRightStrokes=0;
		this.currentStrokesRightArrow=0;	//db
		this.currentStrokesLeftArrow=0;		//db
		this.totalStrokesLeftArrow = 0;     //db
		this.totalStrokesRightArrow = 0;	//db
		this.tempAmountRightArrow=0;
		this.tempAmountLeftArrow=0;
		this.tempMissedOpportunitiesVisit=0;
		this.partialMissedOpport=[];
		this.tempMisssedOpport=0;
		this.currentMissedOpport=0;
		this.totalMissedOpport=0;
		this.horizontalPlatform=false;
		this.speedX=2.4;
		this.previousPlatform=0;
		this.nextPlatform=0;
		this.reactionTime=0;
		this.specialPlatform=false;		
		this.visited=false;

		for(let i=0;i<flatPattern1.length;i++){
			if(this.index==flatPattern1[i]){
				
				this.flatPattern= new FlatPattern(this.rx,this.rw);
				this.specialPlatform=true;
			}
		}
		
		for(let i=0;i<stairsPattern1.length;i++){
			if(this.index==stairsPattern1[i]){
				this.stairsPattern = new StairsPattern(this.rx,this.rw);
				this.specialPlatform=true;
			}
		}

		if(this.index==goalFlagNum){
			this.goalFlag = new GoalFlag(this.rx,this.rw);
			this.specialPlatform=true;
		}

		if(this.specialPlatform){
			this.colour = color('#00158F');	// E64637     00158F  
		}else{
			this.colour = color(100);
		}
  	}
	
	setColour(){	
		this.visited=true;
		if(!this.specialPlatform){
			this.colour =color("#E85243");  //E85243  #A32014
		}
	}

	show (numPlatCol,posPlayer){
		
		if(this.index==numPlatCol && this.visited==true){
			if(this.entro==false){
				this.entro=true;
				this.tiempoInicio=millis();
				playerNotObstructed=false;
				playerObstructedRectionTime=false; 
				if(takenStartReaction==true){
					
					if(startIndex<numPlatCol){
						endReactionTime=millis();
						this.reactionTime=endReactionTime - startReactionTime;
						takenStartReaction=false; 
						//console.log("ReactionTime: "+this.reactionTime+" startIndex: "+startIndex+" numPlatCol: "+numPlatCol);
					}
				}
				  

				this.amountTimesOnPlatform++;
				this.tempAmountPressLeft=countLeftArrow;
				this.tempAmountPressRight=countRightArrow;
				this.tempTotalTimeOnPlat=0;
				this.tempMissedOpportunities=missedOpportunities;
				if(this.partialTimesOnPlat.length>=1){
					for(let i=0;i<this.partialTimesOnPlat.length;i++){
						this.tempTotalTimeOnPlat=this.tempTotalTimeOnPlat+this.partialTimesOnPlat[i];
					}
				}
				this.tempRightStrokes=0;
				if(this.partialRightArrowStrokes.length>=1){
					for(let i=0;i<this.partialRightArrowStrokes.length;i++){
						this.tempRightStrokes=this.tempRightStrokes+this.partialRightArrowStrokes[i];
					}
				}
				this.tempLeftStrokes=0;
				if(this.partialLeftArrowStrokes.length>=1){
					for(let i=0;i<this.partialLeftArrowStrokes.length;i++){
						this.tempLeftStrokes=this.tempLeftStrokes+this.partialLeftArrowStrokes[i];
					}
				}

				this.tempMisssedOpport=0;
				if(this.partialMissedOpport.length>=1){
					for(let i=0;i<this.partialMissedOpport.length;i++){
						this.tempMisssedOpport=this.tempMisssedOpport+this.partialMissedOpport[i];
					}
				}

				for(let i=0;i<this.partialTimesOnPlat.length;i++){
					if (this.partialTimesOnPlat[i] > this.longestTime) {
						this.longestTime = this.partialTimesOnPlat[i];
				  	}
				}
			}

			this.partialTimesOnPlat[this.amountTimesOnPlatform-1]=Math.round((millis()-this.tiempoInicio)/1000);
			this.totalTimeOnPlat=this.tempTotalTimeOnPlat+this.partialTimesOnPlat[this.amountTimesOnPlatform-1];
			this.timeCurrentVisitOnPlat=this.partialTimesOnPlat[this.amountTimesOnPlatform-1];
			
			this.partialLeftArrowStrokes[this.amountTimesOnPlatform-1]=countLeftArrow-this.tempAmountPressLeft;
			this.partialRightArrowStrokes[this.amountTimesOnPlatform-1]=countRightArrow-this.tempAmountPressRight;
			
			this.totalStrokesLeftArrow = this.tempLeftStrokes + this.partialLeftArrowStrokes[this.partialLeftArrowStrokes.length-1];
			this.totalStrokesRightArrow = this.tempRightStrokes + this.partialRightArrowStrokes[this.partialRightArrowStrokes.length-1];

			this.currentStrokesRightArrow=this.partialRightArrowStrokes[this.partialRightArrowStrokes.length-1];
			this.currentStrokesLeftArrow=this.partialLeftArrowStrokes[this.partialLeftArrowStrokes.length-1];

			this.partialMissedOpport[this.amountTimesOnPlatform-1] = missedOpportunities - this.tempMissedOpportunities;
			this.currentMissedOpport = missedOpportunities - this.tempMissedOpportunities;
			this.totalMissedOpport = this.tempMisssedOpport+this.partialMissedOpport[this.amountTimesOnPlatform-1];
			//console.log("Missed Opport: "+this.totalMissedOpport);

			if(this.partialTimesOnPlat[this.amountTimesOnPlatform-1]>this.longestTime){
				this.longestTime = this.partialTimesOnPlat[this.amountTimesOnPlatform-1];
			}

			if(mouseX>7*width/8 && mouseY>5 && mouseY < height/7 ){
				textSize(15);
				textAlign(RIGHT);
				fill("#E85243");
				//text("Number Current Platform: "+numPlatCol,posPlayer-translateDistance+width-20,110);
				text("Time Spent on Platform in the Current Visit : "+this.timeCurrentVisitOnPlat+" seconds",posPlayer-translateDistance+width-20,140);
				text("Total Time on Plat (including multiple visits): "+this.totalTimeOnPlat,posPlayer-translateDistance+width-20,170);
				text("Amount visits to current Platform: "+this.amountTimesOnPlatform,posPlayer-translateDistance+width-20,200);
				text("Amount Strokes Right Arrow current visit: "+this.currentStrokesRightArrow,posPlayer-translateDistance+width-20,230);
				text("Amount Strokes Left Arrow current visit: "+this.currentStrokesLeftArrow,posPlayer-translateDistance+width-20,260);
				text("Total Strokes Right Arrow: "+this.totalStrokesRightArrow,posPlayer-translateDistance+width-20,290);
				text("Total Strokes Left Arrow: "+this.totalStrokesLeftArrow,posPlayer-translateDistance+width-20,320);
				fill(250,200,0);
				text("Reaction Time (to reach current platform): "+Math.round(this.reactionTime)+" milliseconds ",posPlayer-translateDistance+width-20,350);
			}
		}
		
		if(this.index!=amountPlatforms-1){
			fill(this.colour);
			rect(this.rx, this.ry+15 , this.rw, this.rh);
		}

		for(let i=0;i<flatPattern1.length;i++){
			if(this.index==flatPattern1[i]){
				this.flatPattern.show(this.ry);
			}
		}

		for(let i=0;i<stairsPattern1.length;i++){
			if(this.index==stairsPattern1[i]){
				this.stairsPattern.show(this.ry,this.rw);
			}
		}
		
		if(this.index==goalFlagNum){
			this.goalFlag.show(this.ry);
		}
	}

	move(){
		if(!this.horizontalPlatform){
			if(/*this.blocked==0*/ platStatus==0){
				this.rh=this.rh+this.speed;
				if(this.rh>80*height/100){ // height is aprox. 1075
					this.speed=this.speed*-1;
				}
				if(this.rh<14*height/100){
					this.speed=this.speed*-1;
				}
			}
			this.ry = height - this.rh;
		}else{
			this.rx=this.rx+this.speedX;
			if(this.rx+this.rw>this.nextPlatform-15){
				this.speedX=this.speedX*-1;
			}
			if(this.rx<this.previousPlatform+15){
				this.speedX=this.speedX*-1;
			}
		}
	}
}