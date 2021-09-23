/*
    INSPIRATIONAL WALL
*/


var piePieceList = [];
var titles = ["Science","Origami", "Ecology", "Installation Art","Material Ecology","Bionics"];
var amount=6;
var pieColors  = [];
var rotVel = 0;

var velRotFort=0;
var accelRotFort;
var stateFort=0;

var diameterButton=10;
var velDiameterButton=0.2;

var fortuneTextOpacity=54;
var velFortuneTextOpacity=2;
var showTextFortune=true;

function fortuneWheelShow(){
	push();
	translate(width/2, height/2);
	noStroke();
	fill("#B30844");     // background   
	ellipse(0,0,1300,1300);
	fill("#A3083E");    //  background
	ellipse(0,0,900,900);

	fill("#F4D00C");   // Yellow wheel
	ellipse(0,0,535,535);

	let numPoints = 30;
		//rotVel = rotVel+Math.round((PI/300)*100000)/100000;
		for (let i = 0; i < numPoints; i+=1){
			let x1,y1;
			x1=y1=0;
			x1 = 260*cos(i*2*PI/numPoints+velRotFort);
			y1 = 260*sin(i*2*PI/numPoints+velRotFort);	
			fill("#A48C08");
			ellipse(x1,y1,10,10);
		}


		for(let i=0; i<piePieceList.length; i++){
			piePieceList[i].show(velRotFort);
		}
		fill("#F4D00C"); // middle
		ellipse(0,0,70,70);
		fill("#A48C08");  // middle
		ellipse(0,0,30,30);

		diameterButton=diameterButton+velDiameterButton;
		fortuneTextOpacity=fortuneTextOpacity+velFortuneTextOpacity;
		
		if(diameterButton>25){
			velDiameterButton=velDiameterButton*-1;
			velFortuneTextOpacity=velFortuneTextOpacity*-1;
		}
		if(diameterButton<9){
			velDiameterButton=velDiameterButton*-1;
			velFortuneTextOpacity=velFortuneTextOpacity*-1;
		}

		fill(255);    // right-hand-side needle
		ellipse(295 ,0,45,45);
		quad(290,-15,290,15,240,8,240,-8);
		ellipse(235,0,23,23);
		fill(0);
		ellipse(295,0,diameterButton,diameterButton);
		

	if(showTextFortune){ 
			let pushmeFort="PUSH ME"; 
			let gapLettersFort = 20;
			let initialGapFort = PI+PI/4; 
			textSize(10);
			
			/*
			compassTextOpacity=compassTextOpacity+velCompassTextOpacity;
			if(compassTextOpacity>255){
				velCompassTextOpacity=velCompassTextOpacity*-1;
			}
			if(compassTextOpacity<50){
				velCompassTextOpacity=velCompassTextOpacity*-1;
			}
			*/
	
			fill(color(255,255,255,fortuneTextOpacity));
			noStroke();
	
			for (let i = 0; i < pushmeFort.length; i+=1){  // ROUNDED TEXT
				let x1,y1;
				x1=y1=0;
				x1 = 295+30*cos((i*2*PI/gapLettersFort)+initialGapFort);
				y1 = 0+30*sin((i*2*PI/gapLettersFort)+initialGapFort);
				
				push();
				translate(x1,y1);
				rotate((i*2*PI/gapLettersFort)+initialGapFort+PI/2);
				text(pushmeFort[i],0,0);
				pop();
			}
	}
	pop();
}

function fortuneWheelMovement(){

	velRotFort=velRotFort+accelRotFort;
	
	if(mouseIsPressed){
		if(dist(width/2,height/2,mouseX,mouseY)<450){
			if(stateFort==0){
				stateFort=1;
				accelRotFort=0.0;
				showTextFortune=false;
			}
		}
	}
	if(stateFort==1){
		accelRotFort=accelRotFort+0.0069;
		if(accelRotFort>=0.45){
			stateFort=2;
		}
	}
	if(stateFort==2){
		accelRotFort=accelRotFort-0.0015;
		if(accelRotFort<=0){
			accelRotFort=0;
			
			if(!initialTimeTaken){
				initialTime=millis();
				initialTimeTaken=true;
			}
			if (millis() - initialTime > 3000) {
				showTextFortune=true;
				screen=21;
				stateFort=0;
				velRotFort=0;
				initialTimeTaken=false;
			}	
		}
	}
	if(stateFort==0){
		accelRotFort=0;
	}
}

function materialEcology(){
	//text("URBAN GARDENING",100,100);
	//imageGardening.style.display = "block";
	videoAguahoja.style.display = "block";
	document.getElementById("aguahojaHeading").style.display = "block";
	defaultCanvas.style.display = "none";
	if(playAguahoja==true){
		videoAguahoja.play();
	}
	/*
	if(mouseIsPressed ) {
		videoAguahoja.style.display = "none";
		defaultCanvas.style.display = "block";
		document.getElementById("aguahojaHeading").style.display = "none";
		//videoAguahoja.pause();
		videoAguahoja.currentTime = 0;
		screen=0;
	}
	*/
}

function livingRootBridge(){
	defaultCanvas.style.display = "none";
	document.getElementById("BridgeDiv").style.display = "block";
    document.getElementById("styleDots").style.display = "block";
}

function installationArt(){
	defaultCanvas.style.display = "none";
	document.getElementById("installationArtDiv").style.display = "block";
    document.getElementById("styleDotsInstallationArt").style.display = "block";
}