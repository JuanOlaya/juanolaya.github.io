/*
	***** MIND WANDERING - EXPERIMENT 1  ****
  by Juan Olaya
  https://juanolaya.github.io/
*/

/// GENERAL
var screen="intro";
var platforms = [];
var amountPlatforms = 156;  //156
var stairsPattern1 = [56,124];  // 45,115
var flatPattern1 = [5,81];      // 5,85,165,245
var stairsPatternDemanding = [45,125,205,285];  // 45,125,205,285
var flatPatternDemanding = [5,85,31,245];      // 5,85,165,245
var amountStairs=27;
var amountFlatPlatforms=30;
/// THOUGHT PROBES
var interruption=false;
var undemandingThoughtProbesLocations=[4,43,76,109,135];  //   // 2,3,4,5,6
var demandingThoughtProbesLocations=[2,4,6,8,10,12,14,16];   //25,70,92,130  //2,4,6,8,10,12,14,16


var horizontalPlatformsLocation=[38,47,114,120];   //38,47,114,120
var indexStairsPattern = 0;
var indexFlatPattern = 0;
var amountCutEndPlats = 1;
//var goalFlagNum=(amountPlatforms-1)-amountCutEndPlats;
var goalFlagNum=0;
var playerMovement=true;
var numCurrentPlat=-1;
var playerObstructed=false;
var playerNotObstructed=false;
var missedOpportunities=0;
var flow=0;
var resultDB1;
var resultDB2;


var thoughtProbesIndex=0;
var flagProbesIndex=false;
var thoughtProbes=[-1,-1,-1,-1,-1];
var indexthoughtProbe=0;
var initializedPlatforms=false;
var pressStart=false;
var thoughtProbeSelected1=false;
var thoughtProbeSelected2=false;
var thoughtProbeSelected3=false;
var thoughtProbeSelected4=false;
var thoughtProbeSelected5=false;
var thoughtProbeSelected6=false;
var timeThoughtProbeSelected=0;
var waitTimeThoughtProbeSelected=800;
var highLightColor;
var countRightArrow=0;
var countLeftArrow=0;

var player;
var widthGame;
var points = 0;
var negativePoints=0;
var longestTime = 0;
//var goalFlagNum=0;
var translateDistance;
//var corner=false;
var tiempoEspera;
var tiempoInicio;
var demandingWaitTime;
var extraTime=0;
var interruptionTime=0;
var interruptionTime2=0;
var gotExtratime=false;
var startedTimeStairs = false;
var startedTimeFlat = false;
var platStatus=0;
var caseNumber=0;
/// DEMANDING
var jumpingMode=false;
var arrowLeft=false;
var arrowRight=false;
var allPlatforms;
var startTimeMessage=0;
var gap=0;
var takenTime=false;
// REACTION TIME
var takenStartReaction=false;    
var startReactionTime=0;
var endReactionTime=0;
var startIndex=0;
var playerObstructedRectionTime=false;
var playerNotObstructedRectionTime=false;
//var endIndex=0;


function preload() {
  if(document.getElementById('caseNum').value!="%caseNumber%"){ 
    caseNumber=document.getElementById('caseNum').value;
    //SoSciTools.submitButtonsHide();
  }else{
    caseNumber=0;  // %2==0 -> undemanding   //   %2!=0 -> demanding
  }
  if(document.querySelector(".questionary")){
    document.querySelector(".questionary").style.display='none';
  }
  var url = 'https://gist.githubusercontent.com/JuanOlaya/baf69e5c8a8c888b1047026ec9fbeaac/raw/38c9dfce0ee4d15550f7e311738966d2f289d99e/infoPlaforms.json';
  allPlatforms = loadJSON(url);
  //allPlatforms = loadJSON("Platforms.json");
}

function setup() {
  //createCanvas(windowWidth, windowHeight);
  //createCanvas(1024, 768);
	//createCanvas(1200, 550);
  createCanvas(windowWidth, 768);
  frameRate(30);

  translateDistance = width / 4;
	//translateDistance = width / 5;
	//translateDistance = 250;
  player = new Player();
	highLightColor= color(200,0,0);
  //console.log(allPlatforms.plataformas[10].ancho);
  //console.log(allPlatforms.plataformas.length);

  //print("loadedPlatforms = ",allPlatforms);
  //print("plataformas",allPlatforms.plataformas);

  //let speedMin;
  //let speedMax;
  if(amountPlatforms>=allPlatforms.platforms.length){
    amountPlatforms=allPlatforms.platforms.length;
  }
 
  goalFlagNum=(amountPlatforms-1)-amountCutEndPlats;

  if(caseNumber%2==0 || caseNumber%2!=0){
    speedMin=0.7; // 0.7
    speedMax=1.1; // 1.1
    
    let countDistanceX = 0;
    
    for (let i = 0; i < amountPlatforms; i++) {
      gap=15;
      for(let j=0;j<horizontalPlatformsLocation.length;j++){
        if(horizontalPlatformsLocation[j]==i){
          gap=800;
        }
      }
      let platformTemp = new Platform(countDistanceX, i,allPlatforms.platforms[i].speed, allPlatforms.platforms[i].width);
      platforms.push(platformTemp);
      countDistanceX = countDistanceX + platformTemp.rw + gap; // 130 = gap between platforms
    }
    widthGame = countDistanceX - gap;

    for(let i=0;i<platforms.length;i++){
      if(i+1<platforms.length){
        platforms[i].nextPlatform=platforms[i+1].rx;
      }
      if(i-1>=0){
        platforms[i].previousPlatform = platforms[i-1].rx+platforms[i-1].rw;
      } 
    }
    
    for(let j=0;j<horizontalPlatformsLocation.length;j++){
      if( horizontalPlatformsLocation[j] <amountPlatforms){
        platforms[ horizontalPlatformsLocation[j] ].horizontalPlatform=true;
      }
    }
  }/*
  else{
    speedMin=7;
    speedMax=9;
    gap=138;

    let countDistanceX = 0;
    for (let i = 0; i < amountPlatforms; i++) {
      let platformTemp = new Platform(countDistanceX, i,speedMin,speedMax);
      platforms.push(platformTemp);
      countDistanceX = countDistanceX + platformTemp.rw + gap; // 130 = gap between platforms
    }
    widthGame = countDistanceX - gap;
  }*/

  tiempoInicio = 0;
  tiempoEspera = 20000;         //  milliseconds
  demandingWaitTime = 25000;   //  milliseconds
  console.log("caseNumber:  "+ caseNumber);
  console.log("amountPlatforms:  "+ platforms.length);
  console.log("amount Platforms JSON:  "+allPlatforms.platforms.length);
  console.log("goal flag location :  "+goalFlagNum);
  //console.log("CaseNumber: "+ caseNumber);
}

function draw() {
 
  //console.log("Interruption: "+interruption);
  //console.log("timeThoughtProbeSelected: "+timeThoughtProbeSelected1);
  //console.log("Number current platform:  "+numCurrentPlat);
  //console.log(indexthoughtProbe);
  console.log("counter: "+countError);

  //**************************************************************************************************//                              
  //                                     Missed oportunities
  //**************************************************************************************************//
  if(numCurrentPlat>=0  && numCurrentPlat+1<platforms.length-1 ){
    //previousPlat=numCurrentPlat 
    if(platforms[numCurrentPlat].ry-30 < platforms[numCurrentPlat+1].ry){
      
      if(platforms[numCurrentPlat].timeCurrentVisitOnPlat>1){
        playerNotObstructed=true;
        
      }
      //console.log("Player is NOT obstructed:  ");
    }
  }
  if(playerNotObstructed){
    if(platforms[numCurrentPlat].ry > platforms[numCurrentPlat+1].ry+30){
      playerObstructed=true;
      
      if(playerNotObstructed){
        missedOpportunities++;
        playerNotObstructed=false;
        playerObstructed=false;
      }
    }
  }
  //console.log("StartTime: "+startReactionTime);
  //console.log("EndTime: "+endReactionTime);

  //**************************************************************************************************//                              
  //                                     Reaction Time
  //**************************************************************************************************//
  if(numCurrentPlat>=0 && numCurrentPlat+1<platforms.length-1){
    if(platforms[numCurrentPlat].ry > platforms[numCurrentPlat+1].ry+30){   // Obstructed
      playerObstructedRectionTime=true;  
    }
  }

  if(playerObstructedRectionTime==true){                                       // Obstructed
    if(numCurrentPlat>=0 && numCurrentPlat+1<platforms.length-1){             // Not Obstructed
      //playerNotObstructedRectionTime=true;
      if(player.location.x> platforms[numCurrentPlat].rx+7*platforms[numCurrentPlat].rw/10){
        if(platforms[numCurrentPlat].ry-30 < platforms[numCurrentPlat+1].ry){
          //console.log("Start reaction time");
          if(!takenStartReaction){    //Reaction Time
            startReactionTime=millis();
            takenStartReaction=true;
            startIndex=numCurrentPlat;
          }
        }
      }
    }
  }
   
  //**************************************************************************************************//                              
  //                                     Interruption (Thought probe)
  //**************************************************************************************************//
  if(interruption && (startedTimeStairs == true || startedTimeFlat == true  ) ){
    
    if(gotExtratime==false){
      interruptionTime=millis()-tiempoInicio;
      interruptionTime2=millis();
      //console.log("interruptionTime2: "+interruptionTime2);
      gotExtratime=true;
    }
    extraTime=millis()-interruptionTime2;
  }


  //**************************************************************************************************//
  //                              
  //                                        Intro
  //
  //**************************************************************************************************//

  if(screen=="intro"){
    background(0);
    textAlign(CENTER);
    textSize(30);
    fill(255);
    text("INTRODUCTION",width/2,50);
    textSize(25);
    text("You are going to play a video game",width/2,100);
    text("Please do not do another activity for the duration of the game",width/2,150);
    text("Please do not use your mobile phone for the duration of the game",width/2,200);
    textSize(20);
    text("Please click on the button to see the instructions",width/2,300);
    buttonInstructions();
  }

  //**************************************************************************************************//
  //                              
  //                                        Instructions
  //
  //**************************************************************************************************//

  if(screen=="instructions"){
    background(0);
    textAlign(CENTER);
    textSize(30);
    fill(255);
    text("INSTRUCTIONS",width/2,50);
    textSize(25);
    text("You are going to play a platform video game",width/2,100);
    text("The player is a ball that needs to reach the next right platform",width/2,150);
    text("The aim of the game is to cross the platforms towards the right and reach the flag at the end of the level",width/2,200);
    text("You can use the left and right arrows of the keyboard to move the ball",width/2,250);
    text("The duration of the video game is 9 minutes",width/2,300);
    //text("",width/2,160);
    textSize(20);
    text("When you are ready please click on the button to start",width/2,height/2+100);
    buttonStart();
  }

  //**************************************************************************************************//
  //                              
  //                                Undemanding Condition
  //
  //**************************************************************************************************//

  if(screen=="undemanding"){
    background(0); 
    translate(-player.location.x + translateDistance, 0);

    //**************************************************************************************************//                              
    //                                     Progress Bar
    //**************************************************************************************************//
    
    textAlign(CENTER,CENTER);
    textSize(15);
    textStyle(BOLD);
    fill(255);
    text("GAME PROGRESS", player.location.x - translateDistance +30*height/100,30);
    stroke(255);
    strokeWeight(5);
    noFill();
    rect(player.location.x - translateDistance +10*height/100,40,300,50);
    noStroke();
    let progres = map(numCurrentPlat, 0,amountPlatforms-1,0,290);
    fill(255,0,0);
    rect(player.location.x - translateDistance +10*height/100+5,40+5,progres,40);

    //console.log(  player.location.x );
    
    player.show();

    player.bounceEdges();
  
    playerMovementInput();

    var flag = false;
    for (let i = 0; i < platforms.length ; i++) {
      //platforms[i].show();
      if(!interruption){
        platforms[i].move();
      }

      player.collisionCircleRect(platforms[i].rx, platforms[i].ry, platforms[i].rw, platforms[i].rh);
      if (player.side == 2 && (player.distance <= player.radius)) {
        //currentPlat=i;
        platforms[i].setColour();
        platforms[i].show(i, player.location.x);
        numCurrentPlat=i;

        if(undemandingThoughtProbesLocations[thoughtProbesIndex]==i){
          interruption=true;
          if(!flagProbesIndex){
            thoughtProbesIndex++;
            flagProbesIndex=true;
          }
        }
        longestTime = platforms[i].longestTime;
      } else {
        platforms[i].show(-1);
        platforms[i].entro=false;
      }
      if (platforms[i].visited == true) {
        points++;
      }

      //if(i>1){
      //if (platforms[i].timePlat > longestTime) {
      
      //}
      //}
    }
    player.applyVelocityGravity();

    for(let i=0;i<flatPattern1.length;i++){
      if( flatPattern1[i] <platforms.length){
        if(player.collisionPowerUp( platforms[flatPattern1[i]].flatPattern.posX , platforms[flatPattern1[i]].flatPattern.posY , platforms[flatPattern1[i]].flatPattern.radius)){
          if( flatPattern1[i] + amountFlatPlatforms < amountPlatforms - amountCutEndPlats ){
            if (startedTimeFlat == false) {
              tiempoInicio = millis();
              startedTimeFlat = true;
              indexFlatPattern = i;
              player.location.y = height / 2;
            }
          }else{
            console.log("There are no enough platforms for the flat pattern");  
          }
        }
      }
    }

    for(let i=0;i<stairsPattern1.length;i++){
      if(stairsPattern1[i]<platforms.length){
        if(player.collisionPowerUp( platforms[stairsPattern1[i]].stairsPattern.posX , platforms[stairsPattern1[i]].stairsPattern.posY , platforms[stairsPattern1[i]].stairsPattern.radius)){
          if( stairsPattern1[i] + amountStairs < amountPlatforms - amountCutEndPlats ){ 
            if (startedTimeStairs == false) {
              tiempoInicio = millis();
              startedTimeStairs = true;
              indexStairsPattern = i;
              player.location.y = height / 4;
            }
          }else{
            console.log("There are no enough platforms for the stairs pattern");
          }
        }
      }
    }
   
    if(goalFlagNum<platforms.length){
      if( player.collisionFlag( platforms[goalFlagNum].goalFlag.posX, platforms[goalFlagNum].goalFlag.posY, platforms[goalFlagNum].goalFlag.colW, platforms[goalFlagNum].goalFlag.colH) ){
        console.log("reach the flag");
        screen="goalAchieved";
        background(0);
        //dorequest();
        /*
        dorequestThoughtProbes().catch( function(error){
          console.log(error);
          console.log("There was an error in ThoughtProbes ");
        });
        */

        dorequestThoughtProbes().catch( catchErrorThoughtProbes ); 

        dorequestPlatforms().catch( catchError /*{
          //console.log(error);
          //console.log("There was an error in Platforms");
        }*/);

        /*
        dorequestPlatforms().catch(function(error){
          console.log(error);
          console.log("There was an error in Platforms");
          //tryAgainRequestPlatforms=true;
        });
        */
      }
    }

    if(startedTimeStairs == true){
      //let end= map(millis()-tiempoInicio,0,tiempoEspera,0,360);
      //console.log("ENTRA scala");
      //let end;
      //if(!interruption){
      let end= map(millis()-tiempoInicio-extraTime,0,tiempoEspera,0,360);
      //}else{
      //  end= map(interruptionTime,0,tiempoEspera,0,360);
      //}
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
      
      if (millis() < tiempoInicio + tiempoEspera+extraTime) {
        //if( stairsPattern1[indexStairsPattern] + amountStairs < amountPlatforms - amountCutEndPlats ){
          for (let j = stairsPattern1[indexStairsPattern], h = 1; j < amountStairs + stairsPattern1[indexStairsPattern]; j++, h++) {
            //platforms[j].blocked = platStatus;
            //platforms[j].blocked = true;
            platStatus=1;
            //console.log("Set1: "+70*height/100+"Set rest: " +(50 - (h * 3)) * height / 100);
            platforms[j].rh =  - (h * 13) + (60*height/100) ;
          }
        //}
        //else{
          //console.log("There are no enough platforms for the stairs pattern");
        //}
      } 
      else {
        platStatus=0;
        startedTimeStairs = false;
        //console.log("ENTRA");
        //platforms[i].blocked = false;
        gotExtratime=false;
        interruptionTime=0;
        interruptionTime2=0;
        extraTime=0;
        }	   
    }
    
    if(startedTimeFlat == true){
      //let end= map(millis()-tiempoInicio,0,tiempoEspera,0,360);
      let end= map(millis()-tiempoInicio-extraTime,0,tiempoEspera,0,360);
      /*strokeWeight(20);
      stroke(255,150,0);
      noFill();*/
      textAlign(CENTER,CENTER);
      textSize(15);
      textStyle(BOLD);
      fill(255,150,0);
      //stroke();
      ellipse(player.location.x /*+ translateDistance -13*height/100*/  + width / 2 - translateDistance,14*height/100,120,120);
      fill(0);
      arc(player.location.x /*+ translateDistance -13*height/100*/ + width / 2 - translateDistance,14*height/100,120,120,-PI/2,radians(end)-PI/2,PIE);
      //arc(player.location.x /*+ width / 2 - translateDistance*/,8*height/100,100,100,0,2*PI,PIE);
      fill(255,150,0);
      text("FLAT", player.location.x /*+ translateDistance -13*height/100 */  + width / 2 - translateDistance, 4*height/100  /*125*/);
      stroke(255,150,0);
      strokeWeight(2);
      fill(0);
      //stroke();
      ellipse(player.location.x /*+ translateDistance -13*height/100*/  + width / 2 - translateDistance,14*height/100,25,25);
      noFill();
      ellipse(player.location.x /*+ translateDistance -13*height/100*/  + width / 2 - translateDistance,14*height/100,120,120);
      noStroke();
      
      if (millis() < tiempoInicio + tiempoEspera + extraTime) {
        //if( flatPattern1[indexFlatPattern] + amountFlatPlatforms < amountPlatforms - amountCutEndPlats ){
          for (let k = flatPattern1[indexFlatPattern]; k < flatPattern1[indexFlatPattern] + amountFlatPlatforms; k++) {   //platforms.length
            //platforms[k].blocked = platStatus;
            //platforms[k].blocked = true;
            //console.log("k: "+ k);
            platStatus=1;
            //platforms[k].rh = (60 - (15 * 3)) * height / 100;
            platforms[k].rh =  45*height/100;
          }
        //}else{
        //  console.log("There are no enough platforms for the flat pattern");
        //}
      } else {
        platStatus=0;
        startedTimeFlat = false;
        //platforms[i].blocked = false;
        gotExtratime=false;
        interruptionTime=0;
        interruptionTime2=0;
        extraTime=0;
      }	   
    }

    //previousPlat=
    fill(255);
    textSize(140);
    textAlign(CENTER,CENTER);
    //console.log("Points: "+points);
    textStyle(NORMAL);
    text(points+negativePoints, player.location.x - translateDistance +90*width/100 /*70*/ /*+ width / 2 - translateDistance*/, /*100*/ 14*height/100 );
    textSize(15);
    textStyle(BOLD);
    text("POINTS", player.location.x - translateDistance +90*width/100 /*70*/ /*+ width / 2 - translateDistance*/, /*125*/ 4*height/100 );
    if (mouseX > 7*width / 8 && mouseY > 5 && mouseY < height/7 ) {
      textAlign(RIGHT);
      text("Number Current Platform: "+numCurrentPlat,player.location.x-translateDistance+width-20,110);
      text("Game time:   " + Math.floor( ( ( millis()/1000) % 3600  / 60 ) )  +":"+ Math.floor( ( (millis()/1000) %3600) % 60 ) , player.location.x - translateDistance+width-20, 50);
      //text("Game time: " + Math.round(millis() / 1000), player.location.x - translateDistance+width-20, 50);
      text("Longest time on a platform: " + longestTime, player.location.x - translateDistance+width-20, 80);
      fill(250,200,0);
      text("Questionnaire Number: " + caseNumber, player.location.x - translateDistance+width-20, 380);
      text("Missed Opportunities: "+missedOpportunities, player.location.x - translateDistance+width-20, 410);
      text("Case Number: "+caseNumber, player.location.x - translateDistance+width-20, 440);
    }
    points = 0;

    edgeLines();
    //fill(255);
    //text(mouseY,15,15);
    //console.log("Location "+player.location.y+" height: "+height);
    
  }

  

  //**************************************************************************************************//
  //                              
  //                                Demanding Condition
  //
  //**************************************************************************************************//

  if(screen=="demanding"){
    background(0);
    translate(-player.location.x + translateDistance, 0);

    //console.log(  player.location.x );
    
    player.show();

    player.bounceEdges();
  
    playerMovementInput();

    var flag = false;
    for (let i = 0; i < platforms.length ; i++) {
      //platforms[i].show();
      if(!interruption){
        platforms[i].move();
      }

      player.collisionCircleRect(platforms[i].rx, platforms[i].ry, platforms[i].rw, platforms[i].rh);

      //if(player.inTheAir(platforms[i].rx, platforms[i].ry, platforms[i].rw) && thoughtProbesLocations[thoughtProbesIndex]==i){
                        //this.location.y < ry && this.location.x < rx+rw && this.location.x > rx
      if(player.location.y < platforms[i].ry && player.location.x < platforms[i].rx+platforms[i].rw && player.location.x > platforms[i].rx && demandingThoughtProbesLocations[thoughtProbesIndex]==i){  
        interruption=true;
          if(!flagProbesIndex){
            thoughtProbesIndex++;
            flagProbesIndex=true;
          }
      }

      if (player.side == 2 && (player.distance <= player.radius)) {
        //currentPlat=i;
        platforms[i].setColour();
        platforms[i].show(i, player.location.x);
        numCurrentPlat=i;
        /*
        if(thoughtProbesLocations[thoughtProbesIndex]==i){
          interruption=true;
          if(!flagProbesIndex){
            thoughtProbesIndex++;
            flagProbesIndex=true;
          }
        }
        */
       longestTime = platforms[i].longestTime;
      } else {
        platforms[i].show(-1);
        platforms[i].entro=false;
        //playerNotObstructed=false;
      }

      if (platforms[i].visited == true) {
        points++;
      }

      //if(i>1){
      //if (platforms[i].timePlat > longestTime) {
        
        
      //}
      //}
    }
    player.applyVelocityGravity();

    for(let i=0;i<flatPattern1.length;i++){
      if( flatPattern1[i] <platforms.length){
        if(player.collisionPowerUp( platforms[flatPattern1[i]].flatPattern.posX , platforms[flatPattern1[i]].flatPattern.posY , platforms[flatPattern1[i]].flatPattern.radius)){
          if( flatPattern1[i] + amountFlatPlatforms < amountPlatforms - amountCutEndPlats ){
            if (startedTimeFlat == false) {
              tiempoInicio = millis();
              startedTimeFlat = true;
              indexFlatPattern = i;
              player.location.y = height / 2;
              jumpingMode=true;
              player.velocity= createVector(0, 0);
              player.acceleration  = createVector(0, 0.31); 
            }
          }
          else{
            console.log("There are no enough platforms for the flat pattern");
          }
        }
      }
    }

    for(let i=0;i<stairsPattern1.length;i++){
      if(stairsPattern1[i]<platforms.length){
        if(player.collisionPowerUp( platforms[stairsPattern1[i]].stairsPattern.posX , platforms[stairsPattern1[i]].stairsPattern.posY , platforms[stairsPattern1[i]].stairsPattern.radius)){
          if( stairsPattern1[i] + amountStairs < amountPlatforms - amountCutEndPlats ){
            if (startedTimeStairs == false) {
              tiempoInicio = millis();
              startedTimeStairs = true;
              indexStairsPattern = i;
              player.location.y = height / 4;
              jumpingMode=true;
              player.velocity= createVector(0, 0);
              player.acceleration  = createVector(0, 0.31); 
            }
          }else{
            console.log("There are no enough platforms for the stairs pattern");
          }
        }
      }
    }
   
    if(goalFlagNum<platforms.length){
      if( player.collisionFlag( platforms[goalFlagNum].goalFlag.posX, platforms[goalFlagNum].goalFlag.posY, platforms[goalFlagNum].goalFlag.colW, platforms[goalFlagNum].goalFlag.colH) ){
        console.log("reach the flag");
        screen="goalAchieved";
        background(0);
        //dorequest();
        dorequestThoughtProbes();
        dorequestPlatforms();
        /*
        if(document.querySelector(".questionary")){
          document.querySelector(".questionary").style.display='block';
        }  
        */
      }
    }

    if(startedTimeStairs == true){
      //console.log("ENTRA a stairs");
      //let end= map(millis()-tiempoInicio,0,undemandingWaitTime,0,360);
      let end= map(millis()-tiempoInicio-extraTime,0,demandingWaitTime,0,360);
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
      
      //if (millis() < tiempoInicio + tiempoEspera + extraTime) {

      if (millis() < tiempoInicio + demandingWaitTime + extraTime) {
        //if( stairsPattern1[indexStairsPattern] + amountStairs < amountPlatforms - amountCutEndPlats ){
          for (let j = stairsPattern1[indexStairsPattern], h = 1; j < amountStairs/2 + stairsPattern1[indexStairsPattern]; j++, h++) {
            platStatus=1;
            platforms[j].rh = height*0.15 + (h * 25);
          }
          
          for (let k = stairsPattern1[indexStairsPattern] + amountStairs/2, m = 1; k < amountStairs + stairsPattern1[indexStairsPattern]; k++, m++) {   //platforms.length
            platStatus=1;
            platforms[k].rh = height*0.7 - (m * 25);
          }
        //}else{
          //console.log("There are no enough platforms for the stairs pattern");
        //}
      } 
      else {
        platStatus=0;
        startedTimeStairs = false;
        jumpingMode=false;
			  player.velocity = createVector(0, 15);
			  player.acceleration  = createVector(0, 40);
        //console.log("ENTRA");
        //platforms[i].blocked = false;
        gotExtratime=false;
        interruptionTime=0;
        interruptionTime2=0;
        extraTime=0;
      }	   
    }
    
    if(startedTimeFlat == true){
      
      //let end= map(millis()-tiempoInicio,0,tiempoEspera,0,360);
      let end= map(millis()-tiempoInicio-extraTime,0,demandingWaitTime,0,360);
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

      if (millis() < tiempoInicio + demandingWaitTime + extraTime) {
        //if( flatPattern1[indexFlatPattern] + amountFlatPlatforms < amountPlatforms - amountCutEndPlats ){
          for (let k = flatPattern1[indexFlatPattern]; k < flatPattern1[indexFlatPattern] + amountFlatPlatforms; k++) {   //platforms.length
            //platforms[k].blocked = platStatus;
            //platforms[k].blocked = true;
            //console.log("k: "+ k);
            platStatus=1;
            //platforms[k].rh = (60 - (15 * 3)) * height / 100;
            platforms[k].rh =  45*height/100;
          }
        //}else{
          //console.log("There are no enough platforms for the flat pattern");
        //}
      } else {
          platStatus=0;
            
          startedTimeFlat = false;
          jumpingMode=false;
			    player.velocity = createVector(0, 15);
			    player.acceleration  = createVector(0, 40);
          //console.log("ENTRA");
          //platforms[i].blocked = false;
          gotExtratime=false;
          interruptionTime=0;
          interruptionTime2=0;
          extraTime=0;
      }	   
    }

    //previousPlat=
    fill(255);
    textSize(140);
    textAlign(CENTER,CENTER);
    //console.log("Points: "+points);
    textStyle(NORMAL);
    text(points+negativePoints, player.location.x - translateDistance +15*height/100 /*70*/ /*+ width / 2 - translateDistance*/, /*100*/ 14*height/100 );
    textSize(15);
    textStyle(BOLD);
    text("POINTS", player.location.x - translateDistance +15*height/100 /*70*/ /*+ width / 2 - translateDistance*/, /*125*/ 4*height/100 );
    if (mouseX > 7*width / 8 && mouseY > 5) {
      textAlign(RIGHT);
      text("Game time:   " + Math.floor( ( ( millis()/1000) % 3600  / 60 ) )  +":"+ Math.floor( ( (millis()/1000) %3600) % 60 ) , player.location.x - translateDistance+width-20, 50);
      //text("Game time: " + Math.round(millis() / 1000), player.location.x - translateDistance+width-20, 50);
      text("Longest time on a platform: " + longestTime, player.location.x - translateDistance+width-20, 80);
      fill(250,200,0);
      text("Questionnaire Number: " + caseNumber, player.location.x - translateDistance+width-20, 350);
    }
    points = 0;

    edgeLines();
    //fill(255);
    //text(mouseY,15,15);
    //console.log("Location "+player.location.y+" height: "+height);
  }
  
  //**************************************************************************************************//
  //                              
  //                                Interruption
  //
  //**************************************************************************************************//

  if(interruption){
    probeButtons();
  }

  //console.log(" thought probes length "+thoughtProbes.length);
  for(let i=0;i<thoughtProbes.length;i++){
    //console.log(thoughtProbes[i]);
  }

  
  //**************************************************************************************************//
  //                              
  //                                Goal Achieved
  //
  //**************************************************************************************************//

  if(screen=="goalAchieved"){
    //console.log("ENTRa goal achieved");
    background(0);
    textAlign(CENTER);
    textSize(20);
    fill(255);
    //text(" You have finish the video game ",player.location.x - translateDistance,150);
    //text("Please click on the Next button on the top right corner", player.location.x - translateDistance,250);

    text(" You have finished the video game ",translateDistance+height/2,150);
    text("Please wait", translateDistance+height/2,250);
    text("The system is storing the data", translateDistance+height/2,350);
    //text("Please click on the Next button on the top right corner", translateDistance+height/2,250);
    if(resultDB1 && resultDB2){
      screen="end";
    }
  }
  if(screen=="end"){
    background(0);
    if(document.querySelector(".questionary")){
      document.querySelector(".questionary").style.display='block';
    }
    text("Please click on the Next button on the top", translateDistance+height/2,250);
  }
  /*
  let tempX=mouseX+(-width/2);
  let tempY=mouseY+(-height/2);
  console.log("MouseX: "+tempX +"  MouseY: "+tempY);
  push();
  fill(200,200,50);
  rect(width/2 -215,height/2,50,50);
  pop();
  */
 /*
 if(result){
  console.log("Si hay algo");
}else{
  console.log("No hay nada");
}*/
  if(!playerMovement && playerNotObstructed){
    
    if(!takenTime){
      startTimeMessage=millis()+1200;
      takenTime=true;
    
    }
    if(startTimeMessage<millis()){
      //console.log("takenTIme");
      textAlign(CENTER,CENTER);
      textStyle(NORMAL);
      textSize(23);
      fill(255,200,0);
      text("Release the right arrow, then press again to move",player.location.x - translateDistance+width/2,height/6);
    }
  }
  if(playerMovement){
    takenTime=false;
  }
}
//**************************************************************************************************//
  //                              
  //                               End script 
  //
  //**************************************************************************************************//
var countError=0;
function catchError(error){
  
  countError++;
  /*
  if(countError>3){
    console.log("The limit was reached");
    //counter=0;
    return;
  }*/
  
  console.log(error);
  console.log("There was an error in Platforms");
  //dorequestPlatforms().catch(catchError );
  //setInterval(dorequestPlatforms().catch(catchError ),3000 );
  //setTimeout(dorequestPlatforms().catch(catchError ),3000);
  setTimeout(function(){dorequestPlatforms().catch(catchError)},3000);
}

function catchErrorThoughtProbes(error){
  
  console.log(error);
  console.log("There was an error in Thought Probes");
  setTimeout(function(){dorequestThoughtProbes().catch(catchErrorThoughtProbes)},3000);
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

function mousePressed(){

  if(interruption){     
    // Button 1
    if(mouseX > width/2 -215 && mouseX < width/2 -165){
      if(mouseY > height/2 && mouseY < height/2 + 50){
        thoughtProbes[indexthoughtProbe]=1;
        indexthoughtProbe++;
        
        console.log("probe option: 1");
        //interruption=false;
        flagProbesIndex=false;

        thoughtProbeSelected1=true;
        timeThoughtProbeSelected=millis();
      }
    }

    // Button 2
    if(mouseX > width/2 -139 && mouseX < width/2 -89){
      if(mouseY > height/2 && mouseY < height/2 + 50){
        thoughtProbes[indexthoughtProbe]=2;
        indexthoughtProbe++;
        
        console.log("probe option: 2");
        //interruption=false;
        flagProbesIndex=false;

        thoughtProbeSelected2=true;
        timeThoughtProbeSelected=millis();
      }
    }

    // Button 3
    if(mouseX > width/2 -63 && mouseX < width/2 -13){
      if(mouseY > height/2 && mouseY < height/2 + 50){
        thoughtProbes[indexthoughtProbe]=3;
        indexthoughtProbe++;
        
        console.log("probe option: 3");
        //interruption=false;
        flagProbesIndex=false;

        thoughtProbeSelected3=true;
        timeThoughtProbeSelected=millis();
      }
    }

    // Button 4
    if(mouseX > width/2 +13 && mouseX < width/2 +63){
      if(mouseY > height/2 && mouseY < height/2 + 50){
        thoughtProbes[indexthoughtProbe]=4;
        indexthoughtProbe++;
        
        console.log("probe option: 4");
        //interruption=false;
        flagProbesIndex=false;
      
        thoughtProbeSelected4=true;
        timeThoughtProbeSelected=millis();
      }
    }

    // Button 5
    if(mouseX > width/2 +89 && mouseX < width/2 +139){
      if(mouseY > height/2 && mouseY < height/2 + 50){
        thoughtProbes[indexthoughtProbe]=5;
        indexthoughtProbe++;
        
        console.log("probe option: 5");
        //interruption=false;
        flagProbesIndex=false;

        thoughtProbeSelected5=true;
        timeThoughtProbeSelected=millis();
      }
    }

    // Button 6
    if(mouseX > width/2 +165 && mouseX < width/2 +215){
      if(mouseY > height/2 && mouseY < height/2 + 50){
        thoughtProbes[indexthoughtProbe]=6;
        indexthoughtProbe++;
        
        console.log("probe option: 6");
        //interruption=false;
        flagProbesIndex=false;

        thoughtProbeSelected6=true;
        timeThoughtProbeSelected=millis();
      }
    }
  }
}

function probeButtons(){

  //thoughtProbeSelected=false;
  //timeThoughtProbeSelected=0;
  //waitTimeThoughtProbeSelected
  if( thoughtProbeSelected1==true ){
    if( millis() > timeThoughtProbeSelected + waitTimeThoughtProbeSelected){
      interruption=false;
      thoughtProbeSelected1=false;
      timeThoughtProbeSelected=0;
    }
  }

  if( thoughtProbeSelected2==true ){
    //console.log("entra Thought");
    if( millis() > timeThoughtProbeSelected + waitTimeThoughtProbeSelected){
      interruption=false;
      thoughtProbeSelected2=false;
      timeThoughtProbeSelected=0;
    }
  }

  if( thoughtProbeSelected3==true ){
    if( millis() > timeThoughtProbeSelected + waitTimeThoughtProbeSelected){
      interruption=false;
      thoughtProbeSelected3=false;
      timeThoughtProbeSelected=0;
    }
  }

  if( thoughtProbeSelected4==true ){
    if( millis() > timeThoughtProbeSelected + waitTimeThoughtProbeSelected){
      interruption=false;
      thoughtProbeSelected4=false;
      timeThoughtProbeSelected=0;
    }
  }

  if( thoughtProbeSelected5==true ){
    if( millis() > timeThoughtProbeSelected + waitTimeThoughtProbeSelected){
      interruption=false;
      thoughtProbeSelected5=false;
      timeThoughtProbeSelected=0;
    }
  }

  if( thoughtProbeSelected6==true ){
    if( millis() > timeThoughtProbeSelected + waitTimeThoughtProbeSelected){
      interruption=false;
      thoughtProbeSelected6=false;
      timeThoughtProbeSelected=0;
    }
  }
  
  rectMode(CENTER);
  //fill(240,50);
  //rect(player.location.x - translateDistance + width/2+10, height/2+10, 1000 , 550 );
  fill(255);
  rect(player.location.x - translateDistance + width/2, height/2, 1000 , 500 );
  textAlign(CENTER);
  fill(0);
  textStyle(BOLD);
  textSize(36);
  //text("Just now, were your thoughts on or off task? ",player.location.x - translateDistance + width/2,200);
  text("Just now where was your attention? ",player.location.x - translateDistance + width/2,200);
  textSize(16);
  textStyle(BOLD);
  text("Off task                                                                   ", player.location.x - translateDistance + width/2,260);
  textStyle(NORMAL);
  text("                         is thinking about anything unrelated to the game", player.location.x - translateDistance + width/2,260);
  textStyle(BOLD);
  text("On task                                        ", player.location.x - translateDistance + width/2,280);
  textStyle(NORMAL);
  text("                 is thinking about the game", player.location.x - translateDistance + width/2,280);
  //text("Please respond honestly", player.location.x - translateDistance + width/2,265);
  rectMode(CORNER);

  textSize(27);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  //text("Completely",(player.location.x - translateDistance) + width/2 +241 , height / 2+10);
  text("Off task",(player.location.x - translateDistance) + width/2 +241 , height / 2+25);
  textAlign(RIGHT, CENTER);
  text("On task",(player.location.x - translateDistance) + width/2 -241 , height / 2+25);

  textAlign(CENTER, CENTER);
  textSize(22);
  

  if(!thoughtProbeSelected1){
    fill(0);
  }else{
    fill(highLightColor);
  }
  rect( (player.location.x - translateDistance) + width/2 -215 , height / 2  ,50,50);
  fill(255);
  text("1",(player.location.x - translateDistance) + width/2 -215+25 , height / 2+25);

  if(!thoughtProbeSelected2){
    fill(0);
  }else{
    fill(highLightColor);
  }
  rect( (player.location.x - translateDistance) + width/2 -139 , height / 2  ,50,50);
  fill(255);
  text("2",(player.location.x - translateDistance) + width/2 -139+25 , height / 2+25);

  if(!thoughtProbeSelected3){
    fill(0);
  }else{
    fill(highLightColor);
  }
  rect( (player.location.x - translateDistance) + width/2 -63 , height / 2  ,50,50);
  fill(255);
  text("3",(player.location.x - translateDistance) + width/2 -63+25 , height / 2+25);

  if(!thoughtProbeSelected4){
    fill(0);
  }else{
    fill(highLightColor);
  }
  rect( (player.location.x - translateDistance) + width/2 +13 , height / 2  ,50,50);
  fill(255);
  text("4",(player.location.x - translateDistance) + width/2 +13+25 , height / 2+25);

  if(!thoughtProbeSelected5){
    fill(0);
  }else{
    fill(highLightColor);
  }
  rect( (player.location.x - translateDistance) + width/2 +89 , height / 2  ,50,50);
  fill(255);
  text("5",(player.location.x - translateDistance) + width/2 +89+25 , height / 2+25);

  if(!thoughtProbeSelected6){
    fill(0);
  }else{
    fill(highLightColor);
  }
  rect( (player.location.x - translateDistance) + width/2 +165 , height / 2  ,50,50);
  fill(255);
  text("6",(player.location.x - translateDistance) + width/2 +165+25 , height / 2+25);

}

async function dorequestThoughtProbes (){  
  //console.trace();
  //console.log("doRequesttt");
  /*
  let user = {
    CaseNumber: caseNumber,
    Probe1: thoughtProbes[0],
    Probe2: thoughtProbes[1],
    Probe3: thoughtProbes[2]
  };
  */

  let user = {
    CaseNumber: caseNumber,
    Probe1: thoughtProbes[0],
    Probe2: thoughtProbes[1],
    Probe3: thoughtProbes[2],
    Probe4: thoughtProbes[3],
    Probe5: thoughtProbes[4],
    totalTime: millis()/1000
  };

  //let response = await fetch('archivo.php', {
  //let response = await fetch ("https://hci.w-hs.de/data/futurework/Undemanding/archivo.php", {
  let response = await fetch('https://cors-anywhere.herokuapp.com/https://hci.w-hs.de/data/futurework/Undemanding/ThoughtProbesDB.php', {  
    method: 'POST',
    //mode: 'no-cors', 
    headers: {
      'Content-Type': 'application/json'
      //'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(user)
  });
  
  //let result = await response.json();
  resultDB1 = await response.json();
  
  console.log(resultDB1.message+" in ThoughtProbes table");
  //alert(result.message);
}


async function dorequestPlatforms (){
  //console.trace();
  var arrayPlatforms={levels:[]};
  var levels=[];
  for(let i=0;i<platforms.length ;i++){
    let platform = {
      CaseNumber: caseNumber,
      PlatformID: i,
      TotalVisitsPlatformGame: platforms[i].amountTimesOnPlatform,
      LastVisitTimeSpentOnPlat: platforms[i].amountTimesOnPlatform,
      TotalTimeSpentOnPlat: platforms[i].totalTimeOnPlat ,
      LastStrokesLeftArrow: platforms[i].currentStrokesLeftArrow ,
      LastStrokesRightArrow: platforms[i].currentStrokesRightArrow ,
      TotalStrokesLeftArrowOnPlat: platforms[i].totalStrokesLeftArrow ,
      TotalStrokesRightArrowOnPlat: platforms[i].totalStrokesRightArrow,
      LastVisitMissedOpporOnPlat: platforms[i].currentMissedOpport,
      TotalMissedOpportOnPlat: platforms[i].totalMissedOpport,
      ReactionTime: platforms[i].reactionTime,
      TotalMissedOpportGame: missedOpportunities
    };
    arrayPlatforms.levels.push(platform);
    levels.push(platform);
  }
  var abc= JSON.stringify(arrayPlatforms);
  var zeta= JSON.stringify(levels);

  let response = await fetch('https://cors-anywhere.herokuapp.com/https://hci.w-hs.de/data/futurework/Undemanding/PlatformsDB.php', { 
  //let response = await fetch('https://cors-proxy.htmldriven.com/?url=https://hci.w-hs.de/data/futurework/Undemanding/PlatformsDB.php', {   
  method: 'POST',
  //mode: 'no-cors', 
  headers: {
    'Content-Type': 'application/json'
    //'Content-Type': 'application/json;charset=utf-8'
  },
  //body: JSON.stringify(platform)
  body: JSON.stringify(arrayPlatforms)
  //body: JSON.stringify(levels)

  });

    //let result2 = await response.json();
    //console.log(resultDB2.message+" in Platforms table. Last Platform #: "+i);
    
    /*
    if(i==platforms.length-1){
      resultDB2 = await response.json();
      console.log(resultDB2.message+" in Platforms table. Last Platform #: "+i);
    }
    */
  //}
  resultDB2 = await response.json();
  // resultDB2 = await response.text();
  console.log(resultDB2.message+" in Platforms table ");
  // console.log(resultDB2);
}

function keyPressed() {
  //console.log("keypressed");
  if (keyCode === 73) {
    interruption=true;
  } 
  if (keyCode === RIGHT_ARROW){
    arrowRight=true;
    countRightArrow++;
  }
  if (keyCode === LEFT_ARROW){
    arrowLeft=true;
    playerMovement=true;
    countLeftArrow++;
  }
  if(keyCode === 69){
    player.location.x=platforms[amountPlatforms-2].rx;
    //player.location.y=platforms[amountPlatforms-2].ry-this.radius*3;
  }
}

function keyReleased() {
  if (keyCode === 73) {
    interruption=false;

    gotExtratime=false;
    interruptionTime=0;
    interruptionTime2=0;
    extraTime=0;
  }
  if (keyCode ===RIGHT_ARROW ) {
    playerMovement=true;
    //console.log("KeyReleased right");
  }

  if (keyCode === RIGHT_ARROW){
    arrowRight=false;
  }

  if (keyCode === LEFT_ARROW){
    arrowLeft=false;
  }
  return false; // prevent any default behavior
}

function playerMovementInput() {
  /*
  if(!interruption){
    if (keyIsDown(LEFT_ARROW)) {
      player.moveLeft();
    }
    if(playerMovement==true){
      if (keyIsDown(RIGHT_ARROW)) {
        player.moveRight();
      }
    }
  }
  */

  //arrowRight=true
  let isCurrentHorizontalPlat=false;
  for(let i=0;i<horizontalPlatformsLocation.length;i++){
    if(horizontalPlatformsLocation[i]==numCurrentPlat){
      isCurrentHorizontalPlat=true;  
    }
  }

  if(!interruption){
    if (arrowLeft==true) {
      player.moveLeft();
    }
    if(playerMovement==true){
      if (arrowRight==true) {
        player.moveRight();
      }
    }
    if(!arrowLeft && !arrowRight){
      if(isCurrentHorizontalPlat==true){
        player.location.x=player.location.x+platforms[numCurrentPlat].speedX;
      }
    }
  }

	/*
  if (keyIsDown(UP_ARROW)) {
    player.moveUp();
  }
	*/
}
  //**************************************************************************************************//
  //                              
  //                                Buttons
  //
  //**************************************************************************************************//

  function buttonInstructions(){
    noStroke();
    fill("#E85243");
    rect(width / 2 - 100, height / 2 - 50, 200, 100);
    //rect(width / 2 - 100, height / 2 + 50, 200, 100);
  
    fill(255); // '#5E5D53'
    textStyle(BOLD);
    textSize(28);
    textAlign(CENTER, CENTER);
    text('Instructions', width / 2, height / 2 );
    
    if(mouseIsPressed){
      if(mouseX>width / 2 - 100 && mouseX< width / 2 + 100){
        if(mouseY>height / 2 - 50 && mouseY<height / 2 + 50){
          screen="instructions";
        }
        /*
        if(mouseY>height / 2 + 50 && mouseY<height / 2 + 150){  
          //screen="demanding"; 
          //pressStart=true; 
        }
        */
      }
    }
  }

  function buttonStart(){
    noStroke();
    fill("#E85243");
    rect(width / 2 - 100, height / 2 + 150, 200, 100);
    //rect(width / 2 - 100, height / 2 + 50, 200, 100);
  
    fill(255); // '#5E5D53'
    textStyle(BOLD);
    textSize(28);
    textAlign(CENTER,CENTER);
    text('Start', width / 2, height / 2 + 200);
    
    if(mouseIsPressed){
      if(mouseX>width / 2 - 100 && mouseX< width / 2 + 100){
        if(mouseY>height / 2 + 150 && mouseY<height / 2 + 250){
          screen="undemanding";
        }
      }
    }
  }


  /*
INSERT INTO Platforms (CaseNumber, PlatformID, TotalVisitsPlatformGame, LastVisitTimeSpentOnPlat, TotalTimeSpentOnPlat, LastStrokesLeftArrow, LastStrokesRightArrow, TotalStrokesLeftArrowOnPlat, TotalStrokesRightArrowOnPlat, LastVisitMissedOpporOnPlat, TotalMissedOpportOnPlat, ReactionTime, TotalMissedOpportGame ) VALUES ('489', '0', '1', '1', '12', '0', '2', '0', '2', '1', '1', '0', '1');
INSERT INTO Platforms (CaseNumber, PlatformID, TotalVisitsPlatformGame, LastVisitTimeSpentOnPlat, TotalTimeSpentOnPlat, LastStrokesLeftArrow, LastStrokesRightArrow, TotalStrokesLeftArrowOnPlat, TotalStrokesRightArrowOnPlat, LastVisitMissedOpporOnPlat, TotalMissedOpportOnPlat, ReactionTime, TotalMissedOpportGame ) VALUES ('489', '1', '1', '1', '2', '0', '1', '0', '1', '0', '0', '383.1650000011', '1');
INSERT INTO Platforms (CaseNumber, PlatformID, TotalVisitsPlatformGame, LastVisitTimeSpentOnPlat, TotalTimeSpentOnPlat, LastStrokesLeftArrow, LastStrokesRightArrow, TotalStrokesLeftArrowOnPlat, TotalStrokesRightArrowOnPlat, LastVisitMissedOpporOnPlat, TotalMissedOpportOnPlat, ReactionTime, TotalMissedOpportGame ) VALUES ('489', '2', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1');


  
 {"name":"INSERT INTO Platforms (CaseNumber, PlatformID, TotalVisitsPlatformGame, LastVisitTimeSpentOnPlat, TotalTimeSpentOnPlat, LastStrokesLeftArrow, LastStrokesRightArrow, TotalStrokesLeftArrowOnPlat, TotalStrokesRightArrowOnPlat, LastVisitMissedOpporOnPlat, TotalMissedOpportOnPlat, ReactionTime, TotalMissedOpportGame ) VALUES ('493', '0', '1', '1', '2', '0', '1', '0', '1', '0', '0', '0', '0');INSERT INTO Platforms (CaseNumber, PlatformID, TotalVisitsPlatformGame, LastVisitTimeSpentOnPlat, TotalTimeSpentOnPlat, LastStrokesLeftArrow, LastStrokesRightArrow, TotalStrokesLeftArrowOnPlat, TotalStrokesRightArrowOnPlat, LastVisitMissedOpporOnPlat, TotalMissedOpportOnPlat, ReactionTime, TotalMissedOpportGame ) VALUES ('493', '1', '1', '1', '2', '0', '1', '0', '1', '0', '0', '0', '0');INSERT INTO Platforms (CaseNumber, PlatformID, TotalVisitsPlatformGame, LastVisitTimeSpentOnPlat, TotalTimeSpentOnPlat, LastStrokesLeftArrow, LastStrokesRightArrow, TotalStrokesLeftArrowOnPlat, TotalStrokesRightArrowOnPlat, LastVisitMissedOpporOnPlat, TotalMissedOpportOnPlat, ReactionTime, TotalMissedOpportGame ) VALUES ('493', '2', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0');","title":"You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'INSERT INTO Platforms (CaseNumber, PlatformID, TotalVisitsPlatformGame, LastVisi' at line 1"}

 {"name":"INSERT INTO Platforms (CaseNumber, PlatformID, TotalVisitsPlatformGame, LastVisitTimeSpentOnPlat, TotalTimeSpentOnPlat, LastStrokesLeftArrow, LastStrokesRightArrow, TotalStrokesLeftArrowOnPlat, TotalStrokesRightArrowOnPlat, LastVisitMissedOpporOnPlat, TotalMissedOpportOnPlat, ReactionTime, TotalMissedOpportGame ) VALUES ('494', '0', '1', '1', '4', '0', '1', '0', '1', '0', '0', '0', '1');\nINSERT INTO Platforms (CaseNumber, PlatformID, TotalVisitsPlatformGame, LastVisitTimeSpentOnPlat, TotalTimeSpentOnPlat, LastStrokesLeftArrow, LastStrokesRightArrow, TotalStrokesLeftArrowOnPlat, TotalStrokesRightArrowOnPlat, LastVisitMissedOpporOnPlat, TotalMissedOpportOnPlat, ReactionTime, TotalMissedOpportGame ) VALUES ('494', '1', '1', '1', '1', '0', '1', '0', '1', '0', '0', '0', '1');\nINSERT INTO Platforms (CaseNumber, PlatformID, TotalVisitsPlatformGame, LastVisitTimeSpentOnPlat, TotalTimeSpentOnPlat, LastStrokesLeftArrow, LastStrokesRightArrow, TotalStrokesLeftArrowOnPlat, TotalStrokesRightArrowOnPlat, LastVisitMissedOpporOnPlat, TotalMissedOpportOnPlat, ReactionTime, TotalMissedOpportGame ) VALUES ('494', '2', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1');\n","title":"You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'INSERT INTO Platforms (CaseNumber, PlatformID, TotalVisitsPlatformGame, LastVisi' at line 2"}
 
  */