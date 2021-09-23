/*
	INSPIRATIONAL WALL
*/


function needleMovement(){
	/*
	rot=rot+speed;
	
	if(mouseIsPressed){
		
		if(dist(width/2,height/2,mouseX,mouseY)<450){
			//console.log("ENTRA BOTON1 + state "+state);
			if(state==0){
				state=1;
				speed=0.0;
				showCountry=false;
				showTextCompass=false;
			}
		}
	}
	if(state==1){
		speed=speed+0.0069;
		if(speed>=0.5245){
			 state=2;
		}
	}
	if(state==2){
		speed=speed-0.002;
		if(speed<=0){
			speed=0;
			 //state=0;
			showCountry=true;
			if(!initialTimeTaken){
				initialTime=millis();
				initialTimeTaken=true;
			}
			if (millis() - initialTime > 3500) {
				//defaultCanvas.hidden = true;
				defaultCanvas.style.display = "none";
				//console.log("defaultCanvas0 estatusss "+defaultCanvas.hidden);
				videoAustralia.currentTime = 0;
				screen=11;
				state==0;
				showTextCompass=true;
				initialTimeTaken=false;
				showCountry=false;
				rot=3*PI/2;
			}	
		}
	}
	if(state==0){
		 speed=0;
	}
	*/
}

function needleDisplay(){
	/*
	push();  //
	translate(width/2, height/2);
	rotate(rot);
	noStroke();
	fill('#AD343E');    
	//rectMode(CENTER);
	triangle(-35,0,0,30,180,0);
	fill('#474747');  
	triangle(-35,0,0,-30,180,0);
	//rect(-20, -20, 40, 180,50);  // Rectangle
	//triangulo(0, 150, 45);
    //fill('#9E3039');
    fill(255);
	ellipse(0,0,8,8);
	pop(); // 

	if(showTextCompass){ 
		textSize(20);
		let pushme="EM HSUP"; 
		let gapLettersP = 20;
		let initialGapP = 10*(PI/50); 
		
		compassTextOpacity=compassTextOpacity+velCompassTextOpacity;
		if(compassTextOpacity>280){
			velCompassTextOpacity=velCompassTextOpacity*-1;
		}
		if(compassTextOpacity<40){
			velCompassTextOpacity=velCompassTextOpacity*-1;
		}

		fill(color(255,255,255,compassTextOpacity));
		noStroke();

		for (let i = 0; i < pushme.length; i+=1){  // ROUNDED TEXT
			let x1,y1;
			x1=y1=0;
			x1 = width/2+120*cos((i*2*PI/gapLettersP)+initialGapP);
			y1 = 5*height/10+120*sin((i*2*PI/gapLettersP)+initialGapP);
			
			push();
			translate(x1,y1);
			rotate((i*2*PI/gapLettersP)+initialGapP-PI/2);
			text(pushme[i],0,0);
			pop();
		}
	}
	*/
}

function reticle(){
	/*
	push();  // small lines
	translate(width/2, height/2);
	let num2=36;

    noStroke();
	fill("#343954");  // background big
    ellipse(0,0,1200,1200);
    
	fill("#1D2341");    //  background middle
	ellipse(0,0,900,900);

	pop();

	country();

	push();
	
	translate(width/2, height/2);
	fill("#070D2F");  //#618FF5 background compass
	ellipse(0,0,540,540);
	
	
    
    strokeWeight(20);    // Frame
	stroke('#AD343E');    //150,0,0  
	noFill();
	ellipse(0,0,555,555);
	
	
    
    strokeWeight(5);
    ellipse(0,-320,40,40);
    noStroke();
    fill('#AD343E');
    rectMode(CENTER);
    rect(0,-290,10,25);

	for (let i = 0; i < num2; i+=1){
		let x1,y1,x2,y2;
		x1=y1=x2=y2=0;
		
    x1 = (225)*cos(i*2*PI/num2);
    y1 = (225)*sin(i*2*PI/num2);
    x2 = (245)*cos(i*2*PI/num2);
    y2 = (245)*sin(i*2*PI/num2);
		
		strokeCap(SQUARE);
		stroke('#AD343E');   //150,0,0
		//stroke('#818699');
		strokeWeight (3);
		line(x1, y1, x2, y2);
	}
	pop();
	
	push();  // MAIN COORDINATES
	translate(width/2, height/2);
	let num=4;
	for (let i = 0; i < num; i+=1){
		let x1,y1;
		x1 = (235)*cos(i*2*PI/num);
    	y1 = (235)*sin(i*2*PI/num);
		textStyle(BOLD);
		textAlign(CENTER, CENTER);
		textSize(40);
		fill(7,13,47);
		noStroke();
		rectMode(CENTER);
		rect(x1,y1,40,40);
		
		if(i==0){
			fill(255);
			text("E",x1,y1);
			 }
		
		if(i==1){
			fill(255);
			text("S",x1,y1);
			 }
		
		if(i==2){
			fill(255);
			text("W",x1,y1);
		}
		if(i==3){
			fill(255);
			text("N",x1,y1);
		}
	}
	pop();
	*/
}

function country(){
	/*
	textSize(35);
	textAlign(LEFT);
	fill('#B4464F');

	if(showCountry==true){
	
		arc(width/2,height/2,680,680, 14*(PI/50), 37*(PI/50) );
		fill(255);
		let australia="AIRTSUA"; 
		let gapLettersP = 40;
		let initialGapP = 37*(PI/100); 
		for (let i = 0; i < australia.length; i+=1){  // ROUNDED TEXT
			let x1,y1;
			x1=y1=0;
			x1 = width/2+310*cos((i*2*PI/gapLettersP)+initialGapP);
			y1 = height/2+310*sin((i*2*PI/gapLettersP)+initialGapP);
				
			push();
			translate(x1,y1);
			rotate((i*2*PI/40)+initialGapP-PI/2);
			text(australia[i],0,0);
			pop();
	}
}
*/

		/*
		fill('#AD343E');
		rectMode(CENTER);
		noStroke();
		rect(width/2,height-32,250,48);
		rectMode(CORNER);
		
		textSize(40);
		textAlign(CENTER,CENTER);
		fill(255);
		text("AUSTRALIA",width/2,height-26);
		*/
	
}