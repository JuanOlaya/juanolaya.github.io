/*
	***** MIND WANDERING - PLATFORMER  ****
  by Juan Olaya
  https://juanolaya.github.io/
*/

/// GENERAL
var screen="intro";
var goalFlag;
var fs;
////
var platforms = [];
var player;
var widthGame;
var points = 0;
var longestTime = 0;
var stairsPattern1 = 33;
var flatPattern1 = 1;
var translateDistance;
//var corner=false;
var tiempoEspera;
var tiempoInicio;
var startedTime = false;
var startedTimeFlat = false;
var platStatus=0;
var stairs=30;
var flatPlat=30;
var caseNumber=0;



function preload() {
   caseNumber=document.getElementById('caseNum').value;
   if(caseNumber!="%caseNumber%"){
    SoSciTools.submitButtonsHide();
   }
}

function setup() {
  //createCanvas(windowWidth, windowHeight);
  createCanvas(1366, 768);
  //createCanvas(1024, 768);
	//createCanvas(1200, 550);
 
	translateDistance = width / 5;
	//translateDistance = 250;
  player = new Player();
	
  //console.log(allPlatforms.plataformas[10].ancho);
  //console.log(allPlatforms.plataformas.length);

  //print("loadedPlatforms = ",allPlatforms);
  //print("plataformas",allPlatforms.plataformas);
  let countDistanceX = 0;
  for (let i = 0; i < 100; i++) {
    let platformTemp = new Platform(countDistanceX, i);
    platforms.push(platformTemp);

    countDistanceX = countDistanceX + platformTemp.rw + 15; // 130 = gap between platforms
  }
  widthGame = countDistanceX - 130;

  tiempoInicio = 0;
  tiempoEspera = 20000; //  segundos
  console.log( caseNumber);
  goalFlag=new GoalFlag();

  fs = require('fs');

  fs.writeFile("\\experimentGame.txt", "Hey there! "+caseNumber, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  }); 

}

function draw() {
  
  if(screen=="intro"){
    background(0);
    textAlign(CENTER);
    textSize(35);
    fill(255);
    text("Please adjust this rectangle to be visible in your web browser",width/2,80);
    textSize(20);
    text("When you are ready please click on the button to start",width/2,220);
    button();
  }

  if(screen=="undemanding"){
    background(0);
    translate(-player.location.x + translateDistance, 0);

    //console.log(  player.location.x );
    goalFlag.show();
    player.show();

    player.bounceEdges();
  
    playerMovementInput();

    var flag = false;
    for (let i = 0; i < platforms.length; i++) {
      //platforms[i].show();

      player.collisionCircleRect(platforms[i].rx, platforms[i].ry, platforms[i].rw, platforms[i].rh);
      if (player.side == 2 && (player.distance <= player.radius)) {
        //currentPlat=i;
        platforms[i].setColour();
        platforms[i].show(i, player.location.x);

        if (i == stairsPattern1) {
          //console.log("ENTRA stairs");
          if (startedTime == false) {
            tiempoInicio = millis();
            startedTime = true;
            player.location.y = height / 2;
          }
        }

        if (i == flatPattern1) {
          //console.log("ENTRA flat");
          if (startedTimeFlat == false) {
            tiempoInicio = millis();
            startedTimeFlat = true;
            player.location.y = height / 2;
          }
        }
      } else {
        platforms[i].show(-1);
      }
      if (platforms[i].visited == true) {
        points++;
      }

      //if(i>1){
      if (platforms[i].timePlat > longestTime) {
        //console.log("ENTRA");
        longestTime = platforms[i].timePlat;
      }
      //}
    }
    player.applyVelocityGravity();
    
    platforms[flatPattern1].powerUp
    
    /*
    if (i == stairsPattern1) {
      //console.log("ENTRA stairs");
      if (startedTime == false) {
        tiempoInicio = millis();
        startedTime = true;
        player.location.y = height / 2;
      }
    }
    */
   
    if( player.collisionFlag(goalFlag.posX, goalFlag.posY, goalFlag.w, goalFlag.h) ){
      console.log("llego a la meta");
      screen="goalAchieved";
      background(0);
      if(caseNumber!="%caseNumber%"){
        SoSciTools.submitButtonsDisplay();
      }    
    }


    if(startedTime == true){
      let end= map(millis()-tiempoInicio,0,tiempoEspera,0,360);
      /*strokeWeight(20);
      stroke(255,150,0);
      noFill();*/
      textAlign(CENTER,CENTER);
      textSize(15);
      textStyle(BOLD);
      fill(255,150,0);
      //stroke();
      ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,14*height/100,120,120);
      fill(0);
      arc(player.location.x + translateDistance -13*height/100 /*+ width / 2 - translateDistance*/,14*height/100,120,120,-PI/2,radians(end)-PI/2,PIE);
      //arc(player.location.x /*+ width / 2 - translateDistance*/,8*height/100,100,100,0,2*PI,PIE);
      fill(255,150,0);
      text("STAIRS", player.location.x + translateDistance -13*height/100/*+ width / 2 - translateDistance*/, 4*height/100  /*125*/);
      stroke(255,150,0);
      strokeWeight(2);
      fill(0);
      //stroke();
      ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,14*height/100,25,25);
      noFill();
      ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,14*height/100,120,120);
      noStroke();
      
      if (millis() < tiempoInicio + tiempoEspera) {
        for (let j = stairsPattern1, h = 1; j < stairs + stairsPattern1; j++, h++) {
          //platforms[j].blocked = platStatus;
          //platforms[j].blocked = true;
          platStatus=1;
          //console.log("Set1: "+70*height/100+"Set rest: " +(50 - (h * 3)) * height / 100);
          platforms[j].rh =  - (h * 13) + (60*height/100) ;
        }
        /*
        for (let k = stairsPattern1 + stairs, m = 1; k < stairsPattern1 + stairs+flatPlat; k++, m++) {   //platforms.length
              //platforms[k].blocked = platStatus;
              //platforms[k].blocked = true;
              platStatus=1;
              platforms[k].rh = (60 - (15 * 3)) * height / 100;
        }/*/
        } else {
            platStatus=0;
            startedTime = false;
            //console.log("ENTRA");
            //platforms[i].blocked = false;
        }	   
    }
    
    if(startedTimeFlat == true){
      let end= map(millis()-tiempoInicio,0,tiempoEspera,0,360);
      /*strokeWeight(20);
      stroke(255,150,0);
      noFill();*/
      textAlign(CENTER,CENTER);
      textSize(15);
      textStyle(BOLD);
      fill(255,150,0);
      //stroke();
      ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,14*height/100,120,120);
      fill(0);
      arc(player.location.x + translateDistance -13*height/100 /*+ width / 2 - translateDistance*/,14*height/100,120,120,-PI/2,radians(end)-PI/2,PIE);
      //arc(player.location.x /*+ width / 2 - translateDistance*/,8*height/100,100,100,0,2*PI,PIE);
      fill(255,150,0);
      text("FLAT", player.location.x + translateDistance -13*height/100/*+ width / 2 - translateDistance*/, 4*height/100  /*125*/);
      stroke(255,150,0);
      strokeWeight(2);
      fill(0);
      //stroke();
      ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,14*height/100,25,25);
      noFill();
      ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,14*height/100,120,120);
      noStroke();
      
      if (millis() < tiempoInicio + tiempoEspera) {
        
        for (let k = flatPattern1; k < flatPattern1 + flatPlat; k++) {   //platforms.length
          //platforms[k].blocked = platStatus;
          //platforms[k].blocked = true;
          platStatus=1;
          //platforms[k].rh = (60 - (15 * 3)) * height / 100;
          platforms[k].rh =  45*height/100;
        }
      } else {
            platStatus=0;
            startedTimeFlat = false;
            //console.log("ENTRA");
            //platforms[i].blocked = false;
      }	   
    }

    //previousPlat=
    fill(255);
    textSize(140);
    textAlign(CENTER,CENTER);
    //console.log("Points: "+points);
    textStyle(NORMAL);
    text(points, player.location.x - translateDistance +13*height/100 /*70*/ /*+ width / 2 - translateDistance*/, /*100*/ 14*height/100 );
    textSize(15);
    textStyle(BOLD);
    text("POINTS", player.location.x - translateDistance +13*height/100 /*70*/ /*+ width / 2 - translateDistance*/, /*125*/ 4*height/100 );
    if (mouseX > 7*width / 8 && mouseY > 5) {
      textAlign(RIGHT);
      text("Game time: " + Math.round(millis() / 1000), player.location.x - translateDistance+width-20, 50);
      text("Longest time on a platform: " + longestTime, player.location.x - translateDistance+width-20, 80);
      fill(250,200,0);
      text("Questionnaire Number: " + caseNumber, player.location.x - translateDistance+width-20, 170);
    }
    points = 0;

    edgeLines();
    fill(255);
    //text(mouseY,15,15);
    //console.log("Location "+player.location.y+" height: "+height);
    //physicsInfo();
  }

  if(screen=="goalAchieved"){
    background(0);
    textAlign(CENTER);
    textSize(20);
    fill(255);
    text(" You have finish the video game ",player.location.x - translateDistance,150);
    text("Please click on the Next button on the top right corner", player.location.x - translateDistance,250);
  }
}

function playerMovementInput() {
  if (keyIsDown(LEFT_ARROW)) {
    player.moveLeft();
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.moveRight();
  }
	/*
  if (keyIsDown(UP_ARROW)) {
    player.moveUp();
  }
	*/
}

function edgeLines() {
  /*
  stroke(100);
  strokeWeight(80);
  line(-39,0,-39,height);
  */
  //line(widthGame+39,0,widthGame+39,height);
  noStroke();
}

function button(){
	noStroke();
    
    fill("#E85243");
    rect(width / 2 - 100, height / 2 - 50, 200, 100);

    fill(0); // '#5E5D53'
    textStyle(BOLD);
    textSize(28);
    textAlign(CENTER);
    text('Start', width / 2, height / 2 + 10);
  
  if(mouseIsPressed){
    if(mouseX>width / 2 - 100 && mouseX< width / 2 + 100){
      if(mouseY>height / 2 - 50 && mouseY<height / 2 + 50){
      screen="undemanding";
      }
    }
  }
}