/*
	INSPIRATIONAL WALL
*/

function menu(){
    noStroke();
    textAlign(CENTER,CENTER);
    
    /*
    fill("#3A417E");        //  OUTSIDE DOWN
    ellipse(18*width/20,2*height/10,200,200);
    fill("#2B2B3B");        //  INSIDE DOWN
    ellipse(18*width/20,2*height/10,100,100);
    fill(98, 100, 207,130); //  OUTSIDE UP
    arc(18*width/20, 2*height/10, 200, 200, PI, 2*PI , OPEN);
    fill("#8E86BD");        //  INSIDE UP
    arc(18*width/20, 2*height/10, 100, 100, PI, 2*PI , OPEN);
    */
    //fill("#EFD8B9");        //  OUTSIDE DOWN
    
    //let colorButtons="#D3BEA2";
    //let colorButtons="#B9B097";
    //let colorButtons="#F3A263";
    //let colorButtons="#DA6E42";
    //let colorButtons="#4A2A18";
    //let colorButtons="#5C3F2F";
    //let colorButtons="#6E5446";
    //let colorButtons="#381501";
    fill(colorButtons);
    //ellipse(18*width/20,2*height/10,200,200);
 
    let portal="SLEXIP"; 
    let gapLettersP = 20;
    let initialGapP = 15*(PI/60); 

    strokeWeight(20);
    //arc(18*width/20, 2*height/10,40,40, 41*(PI/50)   ,9*(PI/50) );
    //fill("#381501");
    fill(colorButtons);
    noStroke();
    //let firstIconX=width/4;
    //let firstIconY=height/2;

    for (let i = 0; i < portal.length; i+=1){  // ROUNDED PORTAL/TOOLS TEXT
    	let x1 = firstIconX+(roundedTextRadius)*cos((i*2*PI/gapLettersP)+initialGapP);
        let y1 = firstIconY+(roundedTextRadius)*sin((i*2*PI/gapLettersP)+initialGapP);
        
        push();
        //rotate(i*2*PI/20+PI/4);
        translate(x1,y1);
        rotate((i*2*PI/20)+initialGapP-PI/2);
        
        fill(colorButtons);
        stroke(colorButtons);
        strokeWeight(1);
        textStyle(BOLD);
        textSize(25);
        text(portal[i],0,0);
        pop();
    }

    //fill("#381501");
    fill(backgroundColor);
    
    noStroke();
    arc(firstIconX, firstIconY,menuButtonsDiameter-25,menuButtonsDiameter-25, 9*(PI/50), 41*(PI/50) );

    noFill();
    //stroke("#381501");
    stroke("#EFD8B9");
    strokeWeight(12);
    strokeCap(SQUARE);
    arc(firstIconX, firstIconY,menuButtonsDiameter,menuButtonsDiameter, 41*(PI/50)   ,9*(PI/50) );

    stroke("#EFD8B9");
    strokeWeight(1.4);
    for(let i=0, r=138;i<11;i++,r=r-11){
        arc(firstIconX, firstIconY,r,r, 41*(PI/50)   ,9*(PI/50) );
    }
    
    /*
    fill("#3A417E"); // OUTSIDE DOWN
    ellipse(18*width/20,5*height/10,200,200);
    fill("#2B2B3B");  //  INSIDE (DOWN)
    ellipse(18*width/20,5*height/10,100,100);
    fill(98, 100, 207,130);   // OUTSIDE UP
    arc(18*width/20, 5*height/10, 200, 200, PI, 2*PI , OPEN);
    fill("#8E86BD");  // INSIDE UP
    arc(18*width/20, 5*height/10, 100, 100, PI, 2*PI , OPEN);
    */
    //fill("#EFD8B9");        //  OUTSIDE DOWN
    //fill(colorButtons);
    //ellipse(109*width/120,505*height/1000,menuButtonsDiameter*1.25,menuButtonsDiameter*1.25);

    let trivia = "TRANEG"
    let gapLettersT = 20;
    let initialGapT = 12*(PI/50);
    //text("TRIVIA",18*width/20,5*height/10);

    let initialPITrivia=PI-100*PI/550;
    let finalPITrivia=2*PI+100*PI/550;

 
    //let secondIconX=width/2;
    //let secondIconY=height/2;
    //arc(18*width/20, 2*height/10,40,40, 41*(PI/50)   ,9*(PI/50) );

    
    strokeWeight(1.4);

    for(let i=0; i<120 ;i=i+5.2){
        
        //let x1= 109*width/120 + (menuButtonsDiameter/13)*cos(i);
        //let y1 = 805*height/1000 + (menuButtonsDiameter/13)*sin(i);
        line(secondIconX-menuButtonsDiameter/2+5, secondIconY-menuButtonsDiameter/2+i, secondIconX+menuButtonsDiameter/2-5, secondIconY-menuButtonsDiameter/2+i);
    }


    /*  // DIAGONAL STRIPES - I didnt like it!!
    stroke(colorButtons);
    for(let  j=0 ; j<90 ; j=j+7){
        strokeWeight(1.5);
        let x1 = 109*width/120 + (menuButtonsDiameter/2+7)*cos(PI-100*PI/550);
        let y1 = 505*height/1000 + (menuButtonsDiameter/2+7)*sin(PI-100*PI/550);
        //let x2 = 109*width/120 ;
        //let y2 = 805*height/1000 ;
        line(x1,   y1-1-j, 109*width/120, 505*height/1000-j-1);
    }

    for(let j=0 ; j<90 ; j=j+7){
        strokeWeight(1.5);
        let x1 = 109*width/120 + (menuButtonsDiameter/2+7)*cos(2*PI+100*PI/550);
        let y1 = 505*height/1000 + (menuButtonsDiameter/2+7)*sin(2*PI+100*PI/550);
        //let x2 = 109*width/120 ;
        //let y2 = 805*height/1000 ;
        line(x1, y1-1-j, 109*width/120, 505*height/1000-j-1);
    }
    */

    


    //fill("#381501");
    fill(backgroundColor);
    
    noStroke();
    ellipse(secondIconX, secondIconY, 22,22);
    //rect(109*width/120-11, 505*height/1000,22,30);

    /*fill(255,0,0);
    triangle(109*width/120, 505*height/1000-menuButtonsDiameter/2-1, 109*width/120-menuButtonsDiameter/2-20, 505*height/1000-menuButtonsDiameter/2-1, 109*width/120-menuButtonsDiameter/2-20,505*height/1000-23*menuButtonsDiameter/100 );
    triangle(109*width/120, 505*height/1000-menuButtonsDiameter/2-1, 109*width/120+menuButtonsDiameter/2+20, 505*height/1000-menuButtonsDiameter/2-1, 109*width/120+menuButtonsDiameter/2+20,505*height/1000-23*menuButtonsDiameter/100 );
    */

    noFill();
    stroke(backgroundColor);
    strokeWeight(30);
    strokeCap(SQUARE);
    arc(secondIconX, secondIconY,menuButtonsDiameter+40,menuButtonsDiameter+40, initialPITrivia ,finalPITrivia );


    noFill();
    stroke(colorButtons);
    strokeWeight(12);
    strokeCap(SQUARE);
    arc(secondIconX, secondIconY,menuButtonsDiameter,menuButtonsDiameter, initialPITrivia ,finalPITrivia );

    fill(backgroundColor);
    noStroke();
    arc(secondIconX, secondIconY,menuButtonsDiameter-12,menuButtonsDiameter-12, finalPITrivia , initialPITrivia);

    fill(colorButtons);
    

    for (let i = 0; i < trivia.length; i+=1){  // ROUNDED TRIVIA/WINDOW TEXT 
	    let x1,y1;
		x1=y1=0;
    	x1 = secondIconX+(menuButtonsDiameter/2)*cos((i*2*PI/gapLettersT)+initialGapT);
        y1 = secondIconY+(menuButtonsDiameter/2)*sin((i*2*PI/gapLettersT)+initialGapT);
        
        push();
        //rotate(i*2*PI/20+PI/4);
        translate(x1,y1);
        rotate((i*2*PI/gapLettersT)+initialGapT-PI/2);
        
        fill(colorButtons);
        stroke(colorButtons);
        strokeWeight(1);
        textStyle(BOLD);
        textSize(22);
        text(trivia[i],0,0);
        pop();
    }

    //let numeroLineas=30;
    /*
    for(let l =4, r=0.85, numLines =59 ; l<12 ; l++,r=r-0.1 , numLines = numLines-5  ){
        //for (let i = 2; i < numLines; i+=1){
        
        for (let i = initialPITrivia; i < finalPITrivia; i+=2*PI/numLines){
        //let x1 = 109*width/120 + (menuButtonsDiameter/2)*r*cos(i*2*PI/numLines);
        //let y1 = 505*height/1000 + (menuButtonsDiameter/2)*r*sin(i*2*PI/numLines);

        let x1 = 109*width/120 + (menuButtonsDiameter/2)*r*cos(i);
        let y1 = 505*height/1000 + (menuButtonsDiameter/2)*r*sin(i);
        
        let mostrar = Math.round(random(1));
        //console.log(mostrar);
        //if(mostrar==1){
		    fill(colorButtons);
		    noStroke();
            ellipse(x1,y1,2+(1.2-l/8),2+(1.2-l/8));
        //    }
        }
    }
    */
    
    /*
    fill("#3A417E"); // OUTSIDE DOWN
    ellipse(18*width/20,8*height/10,200,200);
    fill("#2B2B3B");  //  INSIDE (DOWN)
    ellipse(18*width/20,8*height/10,100,100);
    fill(98, 100, 207,130);   // OUTSIDE UP
    arc(18*width/20, 8*height/10, 200, 200, PI, 2*PI , OPEN);
    fill("#8E86BD");  // INSIDE UP
    arc(18*width/20, 8*height/10, 100, 100, PI, 2*PI , OPEN);
    */

    //fill("#EFD8B9");        //  OUTSIDE DOWN
    //fill(colorButtons);
    //ellipse(109*width/120,805*height/1000,menuButtonsDiameter*1.25,menuButtonsDiameter*1.25);

    let colab = "EGDIRB"
    let gapLettersC = 20;
    let initialGapC = 7*(PI/29);
    //text("CO.LAB",18*width/20,8*height/10);
    let initialPICoLab=PI-100*PI/550;
    let finalPICoLab=2*PI+100*PI/550;
    
    //let thirdIconX=3*width/4;
    //let thirdIconY=height/2;
    /*
    for(let i=PI ; i<2*PI ; i+=2*PI/15){
        strokeWeight(1.2);
        let x1= 109*width/120 + (menuButtonsDiameter/13)*cos(i);
        let y1 = 805*height/1000 + (menuButtonsDiameter/13)*sin(i);
        line(x1, y1,x1,y1-menuButtonsDiameter/2);
    }
    */

    /*
    for(let i=0; i<25 ;i=i+5){
        strokeWeight(1.7);
        //let x1= 109*width/120 + (menuButtonsDiameter/13)*cos(i);
        //let y1 = 805*height/1000 + (menuButtonsDiameter/13)*sin(i);
        line(109*width/120+i-10, 805*height/1000,109*width/120+i-10, 805*height/1000-menuButtonsDiameter/2);
    }
    */


    stroke(colorButtons);
    strokeWeight(1.4);
     // RAYAS HACIA ABAJOOOO
    for(let i=0; i<145 ;i=i+5.2){
        
        //let x1= 109*width/120 + (menuButtonsDiameter/13)*cos(i);
        //let y1 = 805*height/1000 + (menuButtonsDiameter/13)*sin(i);
        line(thirdIconX+i-70, thirdIconY+menuButtonsDiameter/4, thirdIconX+i-70, thirdIconY-menuButtonsDiameter/2);
    }
    

    fill(backgroundColor);
    noStroke();
    ellipse(thirdIconX, thirdIconY, 22,22);
    rect(thirdIconX-11, thirdIconY,22,30);

    triangle(thirdIconX, thirdIconY-menuButtonsDiameter/2-1, thirdIconX-menuButtonsDiameter/2-20, thirdIconY-menuButtonsDiameter/2-1, thirdIconX-menuButtonsDiameter/2-20,thirdIconY-23*menuButtonsDiameter/100 );
    triangle(thirdIconX, thirdIconY-menuButtonsDiameter/2-1, thirdIconX+menuButtonsDiameter/2+20, thirdIconY-menuButtonsDiameter/2-1, thirdIconX+menuButtonsDiameter/2+20,thirdIconY-23*menuButtonsDiameter/100 );

    
    noFill();
    stroke(colorButtons);
    strokeWeight(12);
    strokeCap(SQUARE);
    arc(thirdIconX, thirdIconY,menuButtonsDiameter,menuButtonsDiameter, initialPICoLab   ,finalPICoLab );
    

    fill(backgroundColor);
    noStroke();
    arc(thirdIconX, thirdIconY,menuButtonsDiameter,menuButtonsDiameter, finalPICoLab , initialPICoLab);
    
    //strokeWeight(1);
    //arc(1018*width/1200, 735*height/1000,menuButtonsDiameter+50,menuButtonsDiameter+50,  0, 41*(PI/50) );
    strokeWeight(20);
    //arc(18*width/20, 2*height/10,40,40, 41*(PI/50)   ,9*(PI/50) );
    
    fill(colorButtons);
    noStroke();

    for (let i = 0; i < colab.length; i+=1){  // ROUNDED co.lab TEXT
	    let x1,y1;
    	x1 = thirdIconX+(menuButtonsDiameter/2)*cos((i*2*PI/gapLettersC)+initialGapC);
        y1 = thirdIconY+(menuButtonsDiameter/2)*sin((i*2*PI/gapLettersC)+initialGapC);
        
        push();
        //rotate(i*2*PI/20+PI/4);
        translate(x1,y1);
        rotate((i*2*PI/gapLettersC)+initialGapC-PI/2);
        fill(colorButtons);
        stroke(colorButtons);
        strokeWeight(1);
        textStyle(BOLD);
        textSize(25);
        text(colab[i],0,0);
        pop();
    }
    if(transitionTriggerPortal){
        //translate(109*width/120, 205*height/1000);

        if(!initialTimeTakenPortal){
            initialTimePortalTransition=millis();
            initialTimeTakenPortal=true;
        }
        if (millis() - initialTimePortalTransition > delayPortalTransition) {
            screen=10;
            
            initialTimeTakenPortal=false;
            transitionTriggerPortal=false;
            for(let i=0;i<pixelList.length;i++){
                pixelList[i].diameter=sizePixel;
            }
            roundedTextRadius=menuButtonsDiameter/2;
        }
        if(roundedTextRadius>45){
            roundedTextRadius=roundedTextRadius-0.5;
        }	
    }
}

function mousePressed(){
    var entered=0;
    if(screen==0 && entered==0){
        
        entered=1;
        
        if(dist(firstIconX,firstIconY,mouseX,mouseY)<=menuButtonsDiameter/2){  //buttonCompass
            //transitionTriggerPortal=true;
            
            screen=10;
            
        }
        if(dist(secondIconX,secondIconY,mouseX,mouseY)<=menuButtonsDiameter/2){  //buttonFortune
            screen=20;
            background(backgroundColor);
        }
        if(dist(thirdIconX,thirdIconY,mouseX,mouseY)<=menuButtonsDiameter/2){   //buttonArtwork
            screen=30;
        }
        
    }
    
    if(screen==10 && entered==0){
        entered=1;
        for(let i=0;i<pixelList.length;i++){
            pixelList[i].pixelIsPressed();    
        }

        if(mouseX>width-height/6 && mouseX<width){
            if(mouseY>10*height/12 && mouseY<height){
                screen=0;
                tiempoInicio=millis();
                tiempoInicio2=millis(); 
            }
        }
    }
    

    if(screen==20 || screen==21 && entered==0){
        entered=1;
        
        if(mouseX>width-height/6 && mouseX<width){
            if(mouseY>10*height/12 && mouseY<height){
                screen=0;
            }
        }
        if(dist(50,height-50,mouseX,mouseY)<29){
            backgroundStatus=!backgroundStatus;
        }
        if(dist(120,height-50,mouseX,mouseY)<29){
            pausa=!pausa;
        }
        if(dist(190,height-50,mouseX,mouseY)<29){
            shapeGenArt=2;
        }
        if(dist(260,height-50,mouseX,mouseY)<29){
            shapeGenArt=3;
        }
        if(dist(330,height-50,mouseX,mouseY)<29){
            shapeGenArt=1;
        }
        if(dist(400,height-50,mouseX,mouseY)<29){
            if(speedMore<10){
                for(let agent of group){
                    if(!pausa){
                        applyForce(agent, 1, 1);
                    }
                }
            }
        }
        if(dist(470,height-50,mouseX,mouseY)<29){
            if(speedMore>1){
                for(let agent of group){
                    if(!pausa){
                        applyForce(agent, -1, 1);
                    }
                }
            }
        }
        if(dist(540,height-50,mouseX,mouseY)<29){
            if(amountShapes<150){
                amountShapes=amountShapes+3;
            }
        }
        if(dist(610,height-50,mouseX,mouseY)<29){
            
            if(amountShapes>6){
                
                amountShapes=amountShapes-3;
            }
        }
        if(dist(680,height-50,mouseX,mouseY)<29){  // PRINT 
            console.log("ENTRA mail");
            //mailWindow=!mailWindow;
            printCanvas();
        }
    }

    if(screen==30 || screen==31 && entered===0){
        entered=1;
        if(mouseX>width-3*height/20 && mouseX<width){
            if(mouseY>69*height/80 && mouseY<height){
                screen=0;
            }
        }

        if(artistList.length>2){
            if(dist(artistList[0].posX,artistList[0].posY, mouseX,mouseY)<artistList[0].diameter/2){
                screen=31;
            }    
            if(dist(artistList[1].posX,artistList[1].posY, mouseX,mouseY)<artistList[1].diameter/2){
                screen=31;
            }
            if(dist(artistList[2].posX,artistList[2].posY, mouseX,mouseY)<artistList[2].diameter/2){
                screen=31;
            }
            if(dist(artistList[3].posX,artistList[3].posY, mouseX,mouseY)<artistList[3].diameter/2){
                screen=31;
            }
        }
    }
    if(screen==30){
        if(statusWebcam<3){
            statusWebcam++;
        }else{
            statusWebcam=1;
        }
    }

    if(screen==40){
        if(interruption){     
            if (thoughtProbePage == 1) {
              // Button 1
              if(mouseX > width/2 -215 && mouseX < width/2 -165){
                if(mouseY > height/2 -25 && mouseY < height/2 + 25){
                  //thoughtProbes[indexthoughtProbe]=1;
                  thoughtProbes[thoughtProbeNumber]=1;
                  
                  //indexthoughtProbe++;
                  console.log("probe option: 1");
                  
                  // cambiado para stairs version
                  //interruption=false;
        
        
                  flagProbesIndex=false;
        
                  thoughtProbeSelected1=true;
                  timeThoughtProbeSelected=millis();
                }
              }
        
              // Button 2
              if(mouseX > width/2 -139 && mouseX < width/2 -89){
                if(mouseY > height/2 -25 && mouseY < height/2 + 25){
                  //thoughtProbes[indexthoughtProbe]=2;
                  thoughtProbes[thoughtProbeNumber]=2;
                  //indexthoughtProbe++;
                  
                  console.log("probe option: 2");
                  //interruption=false;
                  flagProbesIndex=false;
        
                  thoughtProbeSelected2=true;
                  timeThoughtProbeSelected=millis();
                }
              }
        
              // Button 3
              if(mouseX > width/2 -63 && mouseX < width/2 -13){
                if(mouseY > height/2 -25 && mouseY < height/2 + 25){
                  //thoughtProbes[indexthoughtProbe]=3;
                  thoughtProbes[thoughtProbeNumber]=3;
                  //indexthoughtProbe++;
                  
                  console.log("probe option: 3");
                  //interruption=false;
                  flagProbesIndex=false;
        
                  thoughtProbeSelected3=true;
                  timeThoughtProbeSelected=millis();
                }
              }
        
              // Button 4
              if(mouseX > width/2 +13 && mouseX < width/2 +63){
                if(mouseY > height/2 -25 && mouseY < height/2 + 25){
                  //thoughtProbes[indexthoughtProbe]=4;
                  thoughtProbes[thoughtProbeNumber]=4;
                  //indexthoughtProbe++;
                  
                  console.log("probe option: 4");
                  //interruption=false;
                  flagProbesIndex=false;
                
                  thoughtProbeSelected4=true;
                  timeThoughtProbeSelected=millis();
                }
              }
        
              // Button 5
              if(mouseX > width/2 +89 && mouseX < width/2 +139){
                if(mouseY > height/2 -25 && mouseY < height/2 + 25){
                  //thoughtProbes[indexthoughtProbe]=5;
                  thoughtProbes[thoughtProbeNumber]=5;
                  //indexthoughtProbe++;
                  
                  console.log("probe option: 5");
                  //interruption=false;
                  flagProbesIndex=false;
        
                  thoughtProbeSelected5=true;
                  timeThoughtProbeSelected=millis();
                }
              }
        
              // Button 6
              if(mouseX > width/2 +165 && mouseX < width/2 +215){
                if(mouseY > height/2 -25 && mouseY < height/2 + 25){
                  //thoughtProbes[indexthoughtProbe]=6;
                  thoughtProbes[thoughtProbeNumber]=6;
                  
                  //indexthoughtProbe++;
                  console.log("probe option: 6");
                  //interruption=false;
                  flagProbesIndex=false;
        
                  thoughtProbeSelected6=true;
                  timeThoughtProbeSelected=millis();
                }
              }
            }
        
            if (thoughtProbePage == 2) {
            
              if( mouseX>width / 2 - widthRect && mouseX < width / 2){
                if(mouseY>height / 100 * 93.7 && mouseY< height / 100 * 93.7 +38 ){
                   thoughtProbePage = 3;
                }
              }
              
              if (mouseY > height / 100 * 14 && mouseY < height / 100 * 25) {
                if (mouseX > width / 2 - sizeLine && mouseX < width / 2 + sizeLine) {
                  question1X = constrain(mouseX, width / 2 - sizeLine, width / 2 + sizeLine);
                }
              }
              scoreQ1=map(question1X-width/2,-200,200,0,100);
              console.log("scoreQ1: "+scoreQ1);
              if (mouseY > height / 100 * 31 && mouseY < height / 100 * 42) {
                if (mouseX >= width / 2 - sizeLine && mouseX <= width / 2 + sizeLine) {
                  //question1X=mouseX;
                  question2X = constrain(mouseX, width / 2 - sizeLine, width / 2 + sizeLine);
                }
              }
              scoreQ2=map(question2X-width/2,-200,200,0,100);
              console.log("scoreQ2: "+scoreQ2);
              if (mouseY > height / 100 * 48 && mouseY < height / 100 * 59) {
                if (mouseX >= width / 2 - sizeLine && mouseX <= width / 2 + sizeLine) {
                  question3X = constrain(mouseX, width / 2 - sizeLine, width / 2 + sizeLine);
                }
              }
              scoreQ3=map(question3X-width/2,-200,200,0,100);
              console.log("scoreQ3: "+scoreQ3);
              if (mouseY > height / 100 * 64 && mouseY < height / 100 * 75) {
                if (mouseX >= width / 2 - sizeLine && mouseX <= width / 2 + sizeLine) {
                  question4X = constrain(mouseX, width / 2 - sizeLine, width / 2 + sizeLine);
                }
              }
              scoreQ4=map(question4X-width/2,-200,200,0,100);
              console.log("scoreQ4: "+scoreQ4);
              if (mouseY > height / 100 * 81 && mouseY < height / 100 * 90) {
                if (mouseX >= width / 2 - sizeLine && mouseX <= width / 2 + sizeLine) {
                  question5X = constrain(mouseX, width / 2 - sizeLine, width / 2 + sizeLine);
                }
              }
              scoreQ5=map(question5X-width/2,-200,200,0,100);
              console.log("scoreQ5: "+scoreQ5);
            }
            ///// thoughtProbePage == 3 /////////////
            if (thoughtProbePage == 3) {
              if( mouseX>width / 2 +2 && mouseX < width / 2  + widthRect){
                if(mouseY>height / 100 * 93.7 && mouseY< height / 100 * 93.7 +38 ){
                  interruption=false;
                  timeThoughtProbeSelected=0;
                }
              }
              if (mouseY > height / 100 * 14 && mouseY < height / 100 * 25) {
                if (mouseX >= width / 2 - sizeLine && mouseX <= width / 2 + sizeLine) {
                  question6X = constrain(mouseX, width / 2 - sizeLine, width / 2 + sizeLine);
                }
              }
              scoreQ6=map(question6X-width/2,-200,200,0,100);
              console.log("scoreQ6: "+scoreQ6);
              if (mouseY > height / 100 * 31 && mouseY < height / 100 * 42) {
                if (mouseX >= width / 2 - sizeLine && mouseX <= width / 2 + sizeLine) {
                  //question1X=mouseX;
                  question7X = constrain(mouseX, width / 2 - sizeLine, width / 2 + sizeLine);
                }
              }
              scoreQ7=map(question7X-width/2,-200,200,0,100);
              console.log("scoreQ7: "+scoreQ7);
              if (mouseY > height / 100 * 48 && mouseY < height / 100 * 59) {
                if (mouseX >= width / 2 - sizeLine && mouseX <= width / 2 + sizeLine) {
                  question8X = constrain(mouseX, width / 2 - sizeLine, width / 2 + sizeLine);
                }
              }
              scoreQ8=map(question8X-width/2,-200,200,0,100);
              console.log("scoreQ8: "+scoreQ8);
              if (mouseY > height / 100 * 64 && mouseY < height / 100 * 75) {
                if (mouseX >= width / 2 - sizeLine && mouseX <= width / 2 + sizeLine) {
                  question9X = constrain(mouseX, width / 2 - sizeLine, width / 2 + sizeLine);
                }
              }
              scoreQ9=map(question9X-width/2,-200,200,0,100);
              console.log("scoreQ9: "+scoreQ9);
              if (mouseY > height / 100 * 81 && mouseY < height / 100 * 90) {
                if (mouseX >= width / 2 - sizeLine && mouseX <= width / 2 + sizeLine) {
                  question10X = constrain(mouseX, width / 2 - sizeLine, width / 2 + sizeLine);
                }
              }
              scoreQ10=map(question10X-width/2,-200,200,0,100);
              console.log("scoreQ10: "+scoreQ10);
            }
          }
    }
}

function mouseDragged() {
    if(mouseX<1*width/25){
        eraserDragging=true;
    }
    if(screen==10){
        for(let i=0;i<pixelList.length;i++){
            
            pixelList[i].resetPixel();
            pixelList[i].pixelPinched();
            pixelList[i].pixelIsPressed();
        }
    }
  }

function mouseReleased() {
    eraserDragging=false;
    if(screen==10){
        for(let i=0;i<pixelList.length;i++){
            pixelList[i].hasChangedColor=false;
            pixelList[i].hasChangedStatus=false;
        }
    }

    if( dist(mouseX,mouseY,width/25+(sizePixel*10+12*10),bordeAbajo)<sizePixel){
		if(onOffBar){
			onOffBar=false;
		}
		else{
			onOffBar=true;
		}
	}
}

function printCanvas(){
    console.log("ENTRA print");
    const dataUrl = document.getElementById('defaultCanvas0').toDataURL(); 

    let windowContent = '<!DOCTYPE html>';
    windowContent += '<html>';
    windowContent += '<head><title>Print canvas</title></head>';
    windowContent += '<body>';
    windowContent += '<img src="' + dataUrl + '">';
    windowContent += '</body>';
    windowContent += '</html>';

    const printWin = window.open('', '', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
    printWin.document.open();
    printWin.document.write(windowContent); 

    printWin.document.addEventListener('load', function() {
        printWin.focus();
        printWin.print();
        printWin.document.close();
        printWin.close();            
    }, true);
}

