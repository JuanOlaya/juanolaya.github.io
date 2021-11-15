/*
	INSPIRATIONAL WALL
*/

// ******new home**********

let piePieceList = [];
let titles = [" ", " ", " ", " ", " ", " "];
let amount = 10;
let pieColors = [];
let rotVel = 0;

let velRotFort = 0;
let accelRotFort;
let stateFort = 0;

let diameterButton = 10;
let velDiameterButton = 0.07;

let fortuneTextOpacity = 54;
let velFortuneTextOpacity = 2;
let showTextFortune = true;
let initialTimeTaken = false;
var numApp = 5;
var tiempoInicioHome = 0;
var tiempoEsperaHome = 12000; // 12 seconds
var indice = 0;
let img1;
let img2;
let img3;
let img4;
let img5;
let indexSelected=5;
let color5="#947BD3";
let color6="#E0AC00";
let color7="#1E9CC9";  // 29833B 2A878D 2F969D 1C90BA 1D96C2 1E9CC9 4FC3CB #00FFC7 #17799C 
let color8="#f48c06";
let color9="#DC4141";
let demoSection;
let museFlowSection;
var defaultCanvas1;
var timerPencilMode=false;
var startingTimePencilMode = 0;


demoSection=document.getElementById("demoSec");
demoSection.style.display = "none";

museFlowSection=document.getElementById("museFlowSec");
museFlowSection.style.display = "none";

document.getElementsByTagName('canvas');

swarmCanvasSection.style.display = "none";
shapyGridSection.style.display = "none";
//homeEureka.style.display = "none";

//defaultCanvas=document.getElementById("defaultCanvas0");
//defaultCanvas.style.display = "none";

/*
defaultCanvas1=document.getElementById("defaultCanvas1");
defaultCanvas1.style.display = "none";
*/

//let homeEureka;
//homeEureka=document.getElementById("homeEureka");
//homeIcons.style.display = "none";



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
 

function menu2(){
    background("#292929");    // 333333                   3D3D3D
    homeEureka.style.display = "block";
    if(indexSelected==5){
        rectMode(CENTER);
        fill(color5);
        rect(width/2,700*height/1000,150,60,10);
        rectMode(CORNER);
    }
    if(indexSelected==6){
        rectMode(CENTER); 
        fill(color6);    // F54E00
        rect(width/2,700*height/1000,150,60,10);
        rectMode(CORNER);
    }
    if(indexSelected==7){
        rectMode(CENTER);
        fill(color7);
        rect(width/2,700*height/1000,150,60,10);
        rectMode(CORNER);
    }
    if(indexSelected==8){
        rectMode(CENTER);
        fill(color8);
        rect(width/2,700*height/1000,150,60,10);
        rectMode(CORNER);
    }
    if(indexSelected==9){
        rectMode(CENTER);
        fill(color9);
        rect(width/2,700*height/1000,150,60,10);
        rectMode(CORNER);
    }
    textAlign(CENTER,CENTER);
    fill("#333333");
    textSize(30);
    textStyle(BOLD);
    text("Start",width/2,700*height/1000);
    textAlign(LEFT,BOTTOM);
  
    fortuneWheelShow();
    appDescription();
  
    if (millis() - tiempoInicioHome > tiempoEsperaHome) {
      tiempoInicioHome = millis();
      if (numApp < 9) {
        numApp++;
      } else {
        numApp = 5;
      }
    }
  
    
    //text("Eureka", width / 2 - 80, (85 * height) / 100 - 170);
    //text("Wall", width / 2 - 40, (85 * height) / 100 - 100);
    
    stroke(255,230,0);
    //stroke(255);
    strokeWeight(3);
    strokeCap(SQUARE);
    //line(15, 61,202,61);
    //line(15, 119,138,119);
    noStroke();
    
    fill(255);
    textSize(70);
    textStyle(BOLD);
    textSize(55);
    text("EurekaWall", 15, 65);
    //text("Wall", 15, 123);

    fill(0);

    //ellipse(width/2-473,height/2+190,150,150); // Demo
    //ellipse(width/2-295,height/2-60,150,150);  // MuseFlow
    //ellipse(width/2,height/2-158,150,150);  // ParticleCanvas
    //ellipse(width/2+295,height/2-60,150,150); // Balconity
    //ellipse(width/2+473,height/2+190,150,150);  // ShapeGrid

    
    image(img1, width / 2 - 515+12, (85 * height) / 100 - 196+3, 53, 63);
    image(img2, width / 2 - 333+10, (85 * height) / 100 - 451+10, 70, 70);
    image(img3, width / 2 - 34+10, (85 * height) / 100 - 541+10, 60, 60);
    image(img4, width / 2 + 263+10, (85 * height) / 100 - 440+10, 60, 60);
    image(img5, width / 2 + 440+10, (85 * height) / 100 - 182+10, 60, 60);
}

function fortuneWheelShow() {
    push();
    translate(width / 2, (85 * height) / 100);
  
    noStroke();
    /*
    fill("#B30844");     // background   
    ellipse(0,0,1300,1300);
    fill("#A3083E");    //  background
    ellipse(0,0,900,900);
    */
  
    //fill("#3A549C");   // Yellow wheel
    //ellipse(0,0,535,535);
  
    for (let i = 0; i < piePieceList.length; i++) {
      if (i == numApp) {
        indexSelected=i;
        piePieceList[i].show(velRotFort, true, i);
        //console.log(i);
      } else {
        piePieceList[i].show(velRotFort, false, i);
      }
    }
    /*
    fill("#F4D00C"); // middle
    ellipse(0,0,70,70);
    fill("#A48C08");  // middle
    ellipse(0,0,30,30);
    */
  
    diameterButton = diameterButton + velDiameterButton;
    fortuneTextOpacity = fortuneTextOpacity + velFortuneTextOpacity;
    //console.log(fortuneTextOpacity);
  
    if (diameterButton > 25) {
      velDiameterButton = velDiameterButton * -1;
      velFortuneTextOpacity = velFortuneTextOpacity * -1;
    }
    if (diameterButton < 9) {
      velDiameterButton = velDiameterButton * -1;
      velFortuneTextOpacity = velFortuneTextOpacity * -1;
    }
  
    /*
    fill(255);    // right-hand-side needle
    ellipse(295 ,0,45,45);
    quad(290,-15,290,15,240,8,240,-8);
    ellipse(235,0,23,23);
    fill(0);
    ellipse(295,0,diameterButton,diameterButton);
    */
  
    
    if(showTextFortune){ 
        /*
      let pushmeFort="Push one"; 
      let gapLettersFort = 90;
      let initialGapFort = PI+426*PI/1000; 
      textSize(20);
      textStyle(NORMAL);
  
      fill(color(150,150,150,fortuneTextOpacity));
      //fill(255);
      noStroke();
  
      for (let i = 0; i < pushmeFort.length; i+=1){  // ROUNDED TEXT
          let x1,y1;
          x1=y1=0;
          x1 = 0+670*cos((i*2*PI/gapLettersFort)+initialGapFort);
          y1 = 0+670*sin((i*2*PI/gapLettersFort)+initialGapFort);
  
          push();
          translate(x1,y1);
          rotate((i*2*PI/gapLettersFort)+initialGapFort+PI/2);
          text(pushmeFort[i],0,0);
          pop();
      }
      */
    }
    
  
    pop();
    noStroke();
    fill("#333333");  // 333333  292929
    //fill("#296d55");
    rect(0, (85 * height) / 100 - 4, width, height);
  }
  
  
  
class PiePiece {
    constructor(startA, stopA, texto, colour, i) {
      this.startAngle = startA;
      this.stopAngle = stopA;
      this.radius = 1000;
      this.texto = texto;
      this.pieceAmount = 5;
      this.color = colour;
      this.indice = i;
      console.log("Indice: " + this.indice);
    }
  
    show(rotF, border1, index) {
      stroke(this.color);
      strokeWeight(0.1);
      fill(this.color);
      //arc(0,0, this.radius, this.radius, this.startAngle+rotF, this.stopAngle+rotF,PIE);
  
      fill(0);
      noStroke();

      push();
      rotate(this.startAngle + rotF + PI / this.pieceAmount);
      textAlign(CENTER, CENTER);
      textSize(25);
      textStyle(BOLD);
      fill(255);
      push();
      
      /*
        stroke("#947BD3");
        strokeWeight(4);
        noFill();
        */
        //fill("#333333");
        fill(240);
        ellipse(480, -150, 120, 120);
        
        //console.log("EN IND1"+border1);
        
      if (index == 5) {
          stroke(color5);
          strokeWeight(11);
          noFill();
          ellipse(480, -150, 120, 120);
      }
      if (index == 6) {
        stroke(color6);  //  #073E89  #CC4100
        strokeWeight(11);
        noFill();
        ellipse(480, -150, 120, 120);
      }
      if (index == 7) {
        stroke(color7);
        strokeWeight(11);
        noFill();
        ellipse(480, -150, 120, 120);
      }
      if (index == 8) {
        stroke(color8);
        strokeWeight(11);
        noFill();
        ellipse(480, -150, 120, 120);
      }
      if (index == 9) {
        stroke(color9);
        strokeWeight(11);
        noFill();
        ellipse(480, -150, 120, 120);
      }
  
      if (border1) {
        indice = index;
        //stroke("#F04749");   // #5ACAEC   #F04749
        
        if (index == 5) {
          stroke(color5); //3a9c79
          strokeWeight(11);
          //fill(255);
          noFill();
          ellipse(480, -150, 130, 130);
          noStroke();
          
          noFill();
          stroke(color5); // 3a9c79
          strokeWeight(11);
          arc(480, -150, 170, 170, (-25 * PI) / 100, (10 * PI) / 100, OPEN);
          arc(480, -150, 170, 170, (70 * PI) / 100, (105 * PI) / 100, OPEN);
        }
        
        if( index == 6){
          stroke(color6); //  #073E89 #F54E00 3a9c79
          strokeWeight(10);
          //fill(255);
          noFill();
          ellipse(480, -150, 130, 130);
          noStroke();
          
          noFill();
          stroke(color6); // #073E89
          strokeWeight(11);
          arc(480, -150, 170, 170, (-25 * PI) / 100, (10 * PI) / 100, OPEN);
          arc(480, -150, 170, 170, (70 * PI) / 100, (105 * PI) / 100, OPEN);
           
          }
        
        if( index == 7){
          stroke(color7); //3a9c79
          strokeWeight(10);
          //fill(255);
          noFill();
          ellipse(480, -150, 130, 130);
          noStroke();
          
          noFill();
          stroke(color7); // 
          strokeWeight(11);
          arc(480, -150, 170, 170, (-25 * PI) / 100, (10 * PI) / 100, OPEN);
          arc(480, -150, 170, 170, (70 * PI) / 100, (105 * PI) / 100, OPEN);
           
          }
        
        if( index == 8){
          stroke(color8); //3a9c79
          strokeWeight(10);
          //fill(255);
          noFill();
          ellipse(480, -150, 130, 130);
          noStroke();
          
          noFill();
          stroke(color8); // 
          strokeWeight(11);
          arc(480, -150, 170, 170, (-25 * PI) / 100, (10 * PI) / 100, OPEN);
          arc(480, -150, 170, 170, (70 * PI) / 100, (105 * PI) / 100, OPEN);
           
          }
        if( index == 9){
          stroke(color9); //3a9c79
          strokeWeight(10);
          //fill(255);
          noFill();
          ellipse(480, -150, 130, 130);
          noStroke();
          
          noFill();
          stroke(color9); // 
          strokeWeight(11);
          arc(480, -150, 170, 170, (-25 * PI) / 100, (10 * PI) / 100, OPEN);
          arc(480, -150, 170, 170, (70 * PI) / 100, (105 * PI) / 100, OPEN);
        }
      }
      
      //text(this.texto, 150, 0);
      pop();
      pop();
    }
  }
  
function appDescription(index) {

    if (indice == 5) {

        stroke(color5);
        strokeWeight(4);
        //rect(width / 2 - 500 -10, (85 * height) / 100 + 40 -24,1190,75,5); // stroke
        rectMode(CENTER);
        rect(width / 2 , (85 * height) / 100 + 40 ,155,35,9);
        noStroke();

        fill(255);
        textSize(23);
        textAlign(CENTER,CENTER);
        text("Introduction", width / 2 , (85 * height) / 100 + 40);
        textStyle(NORMAL);
        textSize(23);
        text(
            "Watch a video to learn the concepts behind EurekaWall.",
            width / 2 ,
            (85 * height) / 100 + 82
        );
        noStroke();
    }

    if (indice == 6) {

        stroke(color6);
        strokeWeight(5);
        //rect(width / 2 - 500 -10, (85 * height) / 100 + 40 -24,1190,75,5); // stroke
        rectMode(CENTER);
        rect(width / 2 , (85 * height) / 100 + 40 , 129 ,35,9);
        noStroke();

        fill(255);
        textSize(23);
        textAlign(CENTER,CENTER);
        text("MuseFlow", width / 2, (85 * height) / 100 + 40);
        textStyle(NORMAL);
        textSize(23);
        text(
            "Play an undemanding video game to unlock your creativity.",
            width / 2,
            (85 * height) / 100 + 82
        );
        noStroke();
    }

    if (indice == 7) {

        stroke(color7);
        strokeWeight(5);
        //rect(width / 2 - 500 -10, (85 * height) / 100 + 40 -24,1190,75,5); // stroke
        rectMode(CENTER);
        rect(width / 2 , (85 * height) / 100 + 41,175,35,9);
        noStroke();

        fill(255);
        textSize(23);
        textAlign(CENTER,CENTER);
        text("SwarmCanvas", width / 2 , (85 * height) / 100 + 42);
        textStyle(NORMAL);
        textSize(23);
        text(
            "Create a visual work by exploring different brushes.",
            width / 2 ,
            (85 * height) / 100 + 82
        );
        noStroke();
    }

    if (indice == 8) {
        
        /*fill("#FEAD34");*/
        stroke(color8);
        strokeWeight(5);
        //rect(width / 2 - 500 -10, (85 * height) / 100 + 40 -24,1190,75,5); // stroke
        rectMode(CENTER);
        rect(width / 2 , (85 * height) / 100 + 42,155,36,9);
        noStroke();

        /*
        fill("#FEAD34");
        rect(width / 2 - 500 -10, (85 * height) / 100 + 40 -24,120,33); //background
        */

        /*
        fill("#FEAD34");
        rect(width / 2 - 500 -10, (85 * height) / 100 + 40 +1,120,8);  // highlighted
            

        fill("#FEAD34");
        rect(width / 2 - 500 +110, (85 * height) / 100 + 40 -24,33,33,25);  // circle
        */

        fill(255);
        textSize(23);
        textAlign(CENTER,CENTER);
        text("Balcondipity", width / 2, (85 * height) / 100 + 42);
        textStyle(NORMAL);
        textSize(23);
        fill(255);
        text(
            "Find serendipitous inspiration by looking through this observation point.",
            width / 2 ,
            (85 * height) / 100 + 89
        );
        noStroke();
    }

    if (indice == 9) {

        stroke(color9);
        strokeWeight(5);
        //rect(width / 2 - 500 -10, (85 * height) / 100 + 40 -24,1190,75,5); // stroke
        
        
        //rect(width / 2 - 500 -9, (85 * height) / 100 + 40 -29,132,36,9);
        rectMode(CENTER);
        rect(width / 2, (85 * height) / 100 + 42 ,132,36,9);
        noStroke();

        fill(255);
        textSize(23);
        //text("ShapyGrid", width / 2 - 500, (85 * height) / 100 + 40);
        textAlign(CENTER,CENTER);
        text("ShapyGrid", width / 2 , (85 * height) / 100 + 42);
        textStyle(NORMAL);
        textSize(23);
        text(
            "Sketch your ideas by painting them with shapes.",
            width / 2,
            (85 * height) / 100 + 89
        );
        //text("Create a meaninful visualization by painting with shapes on a grid",width/2-500,85*height/100+80);
        // customization sketching
        noStroke();
    }
    rectMode(CORNER);
    textAlign(LEFT,BOTTOM);
}




function mousePressed(){
    var entered=0;

    if(modeSwarmCanvas==3){
        //console.log("entra modePencil");
        showShapes=true;
        startingTimePencilMode = millis();
        
        for(let agent of group){
            agent.pos.x=mouseX;
            agent.pos.y=mouseY;
        }
        for(let agent of group2){
            agent.pos.x=mouseX;
            agent.pos.y=mouseY;
        }
    }
    
    if(screen==0 && entered==0){
        
        entered=1;

        if(dist(width/2-473,height/2+190,mouseX,mouseY)<=240/2){  // Demo
            tiempoInicioHome = millis();
            numApp=5;
            console.log(numApp);
        }

        if(dist(width/2-295,height/2-60,mouseX,mouseY)<=240/2){  //  MuseFlow
            tiempoInicioHome = millis();
            numApp=6;
            console.log(numApp);
        }
       
        if(dist(width/2,height/2-158,mouseX,mouseY)<=240/2){  // SwarmCanvas
            tiempoInicioHome = millis();
            numApp=7;
            console.log(numApp);
            /*
            homeEureka.style.display = "none";
            particleCanvasSec.style.display = "block";
            screen=20;
            */
        }
        if(dist(width/2+295,height/2-60,mouseX,mouseY)<=240/2){   //Balconity
            tiempoInicioHome = millis();
            numApp=8;
            console.log(numApp);
            /*
            homeEureka.style.display = "none";
            balconitySection.style.display = "block";
            defaultCanvas.style.display = "none";
            screen=30;
            */
        }

        if(dist(width/2+473,height/2+190,mouseX,mouseY)<=230/2){  // ShapyGrid
            tiempoInicioHome = millis();
            numApp=9;
            console.log(numApp);
            /*
            homeEureka.style.display = "none";
            screen=10;
            */
        }

        if(mouseX>width/2-150 && mouseX<width/2+150){
            if(mouseY>700*height/1000-60 && mouseY<700*height/1000+60){
                if(numApp==5){
                    //console.log("entra boton");
                    demoSection.style.display = "block";
                    defaultCanvas.style.display = "none";
                    defaultCanvas.style.zIndex = "-1";
                    homeEureka.style.display = "none";
                    screen=50;
                }
                if(numApp==6){  // MuseFlow
                    
                    
                    museFlowSec.style.display = "block";
                    homeEureka.style.display = "none";
                    defaultCanvas.style.zIndex = "-1";
                    screen=40;
                    
                }
                if(numApp==7){
                    background(backgroundColor);
                    homeEureka.style.display = "none";
                    swarmCanvasSection.style.display = "block";
                    defaultCanvas.style.zIndex = "-1";
                    screen=20;
                }
                if(numApp==8){
                    homeEureka.style.display = "none";
                    balconitySection.style.display = "block";
                    defaultCanvas.style.display = "none";
                    screen=30;
                }
                if(numApp==9){
                    shapyGridSection.style.display = "block";
                    homeEureka.style.display = "none";
                    defaultCanvas.style.zIndex = "-1";
                    screen=10;
                }
            }
        } 
    }
    
    if(screen==10 && entered==0){
        entered=1;
        for(let i=0;i<pixelList.length;i++){
            pixelList[i].pixelIsPressed();    
        }
        /*
        if(mouseX>width-height/6 && mouseX<width){
            if(mouseY>10*height/12 && mouseY<height){
                screen=0;
                tiempoInicio=millis();
                tiempoInicio2=millis(); 
            }
        }
        */
       /*
        if(mouseX<width/6 && mouseY<height/6){
            screen=0;
        }
        */
    }

    if(screen==20 || screen==21 && entered==0){   // GENART
        entered=1;
        
        /*
        if(mouseX>width-height/6 && mouseX<width){
            if(mouseY>10*height/12 && mouseY<height){
                screen=0;
            }
        }
        */
       /*
        if(mouseX<width/6 && mouseY<height/6){
            screen=0;
        }
        */

        if(dist(50,height-50,mouseX,mouseY)<29){
            //backgroundStatus=!backgroundStatus;
        }
        if(dist(120,height-50,mouseX,mouseY)<29){
            //pausa=!pausa;
        }
        if(dist(190,height-50,mouseX,mouseY)<29){
            //shapeGenArt=2;
        }
        if(dist(260,height-50,mouseX,mouseY)<29){
            //shapeGenArt=3;
        }
        if(dist(330,height-50,mouseX,mouseY)<29){
            //shapeGenArt=1;
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
            /*
            if(amountShapes<150){
                amountShapes=amountShapes+3;
            }*/
        }
        if(dist(610,height-50,mouseX,mouseY)<29){
            /*
            if(amountShapes>6){
                
                amountShapes=amountShapes-3;
            }*/
        }
        if(dist(680,height-50,mouseX,mouseY)<29){  // PRINT 
            console.log("ENTRA mail");
            //mailWindow=!mailWindow;
            //printCanvas();
        }
    }

    if(screen==30 || screen==31 && entered===0){    // BRIDGE/BALCONITY
        entered=1;
        /*
        if(mouseX>width-3*height/20 && mouseX<width){
            if(mouseY>69*height/80 && mouseY<height){
                screen=0;
            }
        }
        */

        /*
        if(mouseX<width/6 && mouseY<height/6){
            screen=0;
            //console.log("index -1");
            canvas.style("z-index",0);
        }
        */

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
    mousePressedMuseFlow();
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

//  function mouseReleased(){
function mouseReleasedSwarmCanvas() {
    if(modeSwarmCanvas==3){
    //modeSwarmCanvas
        showShapes=false;
        //timerPencilMode=false;
    }
    eraserDragging=false;
    if(screen==10){
        for(let i=0;i<pixelList.length;i++){
            pixelList[i].hasChangedColor=false;
            pixelList[i].hasChangedStatus=false;
        }
    }

    /*
    if( dist(mouseX,mouseY,width/25+(sizePixel*10+12*10),bordeAbajo)<sizePixel){
		if(onOffBar){
			onOffBar=false;
		}
		else{
			onOffBar=true;
		}
	}
    */
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

/*
document.getElementById("eurekaBalconity").addEventListener("click", function() {
    
    balconitySection.style.display = "block";
    homeEureka.style.display = "none";
    screen=30;
});

document.getElementById("eurekaPixelGrid").addEventListener("click", function() {
    
    defaultCanvas.style.display = "block";
    homeEureka.style.display = "none";
    screen=10;
});

document.getElementById("eurekaParticleCanvas").addEventListener("click", function() {
    
    defaultCanvas.style.display = "block";
    homeEureka.style.display = "none";
    particleCanvasSec.style.display = "block";
    screen=20;
});
*/

document.getElementById("rightArrowIcon").addEventListener("click", function() {
    
    tiempoInicioHome = millis();
    if (numApp < 9) {
        numApp++;
    } else {
        numApp = 5;
    }
});

document.getElementById("leftArrowIcon").addEventListener("click", function() {
    tiempoInicioHome = millis();
    if (numApp > 5) {
        numApp--;
    } else {
        numApp = 9;
    }
});

document.getElementById("goBackDemoSec").addEventListener("click", function() {
    demoSection.style.display = "none";
    defaultCanvas.style.display = "block";
    //defaultCanvas.style.zIndex = "0";
    screen=0;
});

document.getElementById("goBackMuseFlowSec").addEventListener("click", function() {
    //demoSection.style.display = "none";
    //defaultCanvas.style.display = "block";
    museFlowSec.style.display = "none";
    //defaultCanvas.style.zIndex = "0";
    homeEureka.style.display = "block";
    screen=0;
});

document.getElementById("goBackSwarmCanvas").addEventListener("click", function() {
    //demoSection.style.display = "none";
    //defaultCanvas.style.display = "block";
    swarmCanvasSection.style.display = "none";
    //defaultCanvas.style.zIndex = "0";
    homeEureka.style.display = "block";
    screen=0;
});






var elem = document.documentElement;

document.getElementById("fullscreenIcon").addEventListener("click", function() {
    
    if (!document.fullscreenElement){
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { // Safari 
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE11 
            elem.msRequestFullscreen();
        }
        document.getElementById("fullscreenIcon").innerHTML = `fullscreen_exit`;
    } else{
     if (document.fullscreenElement){
        if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) { // Safari 
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { // IE11 
            document.msExitFullscreen();
          }
          document.getElementById("fullscreenIcon").innerHTML = `fullscreen`;
        }
    }
});


