/*
	***** MIND WANDERING - EXPERIMENT 3  ****
  by Juan Olaya
  https://juanolaya.github.io/
*/

/* 
TO-DO list
  1. We will minimize any risks by [describe how confidentiality will be secured, maintained, and how data will be disposed of]
  2. required/ not questions?
  3. Mind wandering propensity question 2
  4. During the game you were asked if you were thinking about something unrelated to the game. Now below is a list of thoughts, some of which you might have had then. Please indicate roughly how often you had each type of thought.
  5. Check the questions of the questionnaires one by one
  6. is possible to add note or manipulate questions?? 
  7. Max/Stephanie ask about -> Last page
  8. <p>If you are interested in the results please check out our website or write me an email</p>
  9. <p>We would like to thank you very much for helping us.</p>
*/

/// GENERAL
var screenMuseFlow="intro";
var platforms = [];
var amountPlatforms = 0;  //156  336
var interruption=false;
var endDate;
var endHour;
var totalTimeMillis=0;

/// RING PROBES
var undemandingRingReset=[];  //  67,109,153
var undemandingRingProbesLocations=[];   //4,34,36,39,68,72,92,107,110,117,120,122
var undemandingRingProbesDone=[];  //false,false,false,false,false,false,false,false,false,false,false,false
var undemandingRingTrainingProbesLocations=[];  //7,15,24,28
var undemandingRingTrainingProbesDone=[];  //false,false,false,false

var amountBars = 0;
var tiempoInicioRings = 0;
var tiempoEsperaRings = 3000; // 3 segundos 
var ringsChanging=false;


/// FADING
var fading=false;
var fadingCount=0;
var playerBorder=false;
var variables=true;

/// UNDEMANDING TRAINING 
var trainingPlatforms = [];
var amountTrainingPlatforms = 0;
var flatDemandingTraining = 35;
var flatUndemandingTraining = 24;
var flatLocationDemanding = [5];        // undemanding 
var flatLocationUndemanding = [5];  
var goalFlagTraining=0;
var undemandingTrainingProbe0=false;
var undemandingTrainingProbesLocations=[];  //3
var undemandingTrainingFadingProbesLocations=[];

/// DEMANDING TRAINING 
var demandingTrainingProbe0=false;
var demandingTrainingProbesLocations=[];    //4
var demandingTrainingFadingProbesLocations=[];

/// UNDEMANDING GAME
var stairsPattern1 = [43,81];       // undemanding 
var flatPattern1 = [5,124];      // undemanding
var amountStairs=27;
var amountFlatPlatforms=30;
var undemandingThoughtProbesLocations=[];  // 32,53,78,116,142      
var undemandingFadingProbesLocations=[]; //
var undemandingThoughtProbesUpDown1=[];      //  33,34,35
var undemandingThoughtProbesUpDown3=[];  //  75,76,77,78
var undemandingThoughtProbesUpDown4=[];   //  113,114,115,116
var waitingHorizontalPlatform=46;
/// implemented for stairs version
var undemandingToughtProbe0=false;
var undemandingToughtProbe1=false;
var undemandingToughtProbe2=false;
var undemandingToughtProbe3=false;
var undemandingToughtProbe4=false;
var undemandingToughtProbe5=false;

var demandingToughtProbe0=false;
var demandingToughtProbe1=false;
var demandingToughtProbe2=false;
var demandingToughtProbe3=false;
var demandingToughtProbe4=false;
var demandingToughtProbe5=false;
///
var fadingProbe0=false;
var fadingProbe1=false;
var fadingProbe2=false;
var fadingProbe3=false;
var fadingProbe4=false;
var fadingProbeWaiting=false;
var fadingProbeNumber=0;
var fadingProbeResults=[];
var demandingGamingFadingProbesLocations=[];
///
var undemandingThoughtProbesUpDownFlag1=false;
var undemandingThoughtProbesUpDownFlag2=false;
var undemandingTooughtProbeTwoFlag=false;
var undemandingTooughtProbeFourFlag=false;
var waitingHorizontalPlatformFlag=false;
var horizontalPlatformsLocation=[39,72,110,120];   //38,47,114,120
var thoughtProbeNumber=0;


/// DEMANDING GAME
var demandingThoughtProbesLocations=[]; //44,70,100,148,180 
var flatPatternDemanding = [5,164];      
var stairsPatternDemanding = [51,103];  
var amountFlatDemanding=36;
var amountStairsDemanding=42;
var horizontalPlatformsLocationDemanding=[48,95,152,156,161];  
//var demandingGamingFadingProbesLocations=[39,95,120];



/// BASELINE
var baselinePlatforms = [];
var pressBarBaseline=false;

/// MISC ////
var indexStairsPattern = 0;
var indexFlatPattern = 0;
var amountCutEndPlats = 1;
//var goalFlagNum=(amountPlatforms-1)-amountCutEndPlats;
var goalFlagNum=0;
var playerMovement=true;
var numCurrentPlat=0;
var playerObstructed=false;
var playerNotObstructed=false;
var missedOpportunities=0;
var flow=0;
var resultDB1=true;
var resultDB2=true;
var posXpowerUps;

var thoughtProbesIndex=0;
var flagProbesIndex=false;
var thoughtProbes=[-1,-1,-1,-1,-1,-1];
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
var allPlatformsDemanding;
var undemandingTrainingJSON;
var demandingTrainingJSON;
var baselineJSON;
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
var condition="undemanding";

var canvasMuseFlow;
var urnRandom=-1;
//let img;
var undemandingInstructions;
var demandingInstructions;
/// FADING PROBES
var tiempoInicioFading = 0;
var tiempoInicioBaseline= 0;
var tiempoEsperaBaseline = 5000; 
var tiempoInicioBaselineExit= 0;
var tiempoEsperaBaselineExit = 2500; 
var initialTime=false;
var pressBar=false;
var baselineDone=false;
var baselineWating=false;
var reactionTimeSinceUnobs=-1;
var hasReactionTimeSinceUnobs=false;

/// Mind wandering content
var question1X;
var question2X;
var question3X;
var question4X;
var question5X;
var question6X;
var question7X;
var question8X;
var question9X;
var question10X;
var sizeLine = 200;
var widthRect=160;
var mindWanderingContent=false;
var thoughtProbePage = 1;

var scoreQ1=50;
var scoreQ2=50;
var scoreQ3=50;
var scoreQ4=50;
var scoreQ5=50;
var scoreQ6=50;
var scoreQ7=50;
var scoreQ8=50;
var scoreQ9=50;
var scoreQ10=50;
///




//**************************************************************************************************//    
//**************************************************************************************************//                           
//                                  Beginning SETUP()
//**************************************************************************************************// 
//**************************************************************************************************//




//**********************************************************************************************************************************//    
//**************************************************************************************************//                           
//                                 Beginning DRAW()
//**************************************************************************************************// 
//*********************************************************************************************************************************//


//**************************************************************************************************//
//**************************************************************************************************//                              
//                               End DRAW 
//**************************************************************************************************//
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


/*
function mousePressed(){

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
*/
function probeButtons(){

  //thoughtProbeSelected=false;
  //timeThoughtProbeSelected=0;
  //waitTimeThoughtProbeSelected

  if(thoughtProbePage == 1){
    if( thoughtProbeSelected1==true ){
      if( millis() > timeThoughtProbeSelected + waitTimeThoughtProbeSelected){
        if(mindWanderingContent){
          thoughtProbePage = 2;
          thoughtProbeSelected1=false;
        }
        else{
          interruption=false;
          thoughtProbeSelected1=false;
          timeThoughtProbeSelected=0;
        }
        //console.log("Entra thoughtProbeSelected1");
        
      }
    }

    if( thoughtProbeSelected2==true ){
      //console.log("entra Thought");
      if( millis() > timeThoughtProbeSelected + waitTimeThoughtProbeSelected){
        if(mindWanderingContent){
          thoughtProbePage = 2;
          thoughtProbeSelected2=false;
        }
        else{
          interruption=false;
          thoughtProbeSelected2=false;
          timeThoughtProbeSelected=0;
        }
        
      }
    }

    if( thoughtProbeSelected3==true ){
      if( millis() > timeThoughtProbeSelected + waitTimeThoughtProbeSelected){
        if(mindWanderingContent){
          thoughtProbePage = 2;
          thoughtProbeSelected3=false;
        }
        else{
          interruption=false;
          thoughtProbeSelected3=false;
          timeThoughtProbeSelected=0;
        }
        
      }
    }

    if( thoughtProbeSelected4==true ){
      if( millis() > timeThoughtProbeSelected + waitTimeThoughtProbeSelected){
        if(mindWanderingContent){
          thoughtProbePage = 2;
          thoughtProbeSelected4=false;
        }
        else{
          interruption=false;
          thoughtProbeSelected4=false;
          timeThoughtProbeSelected=0;
        }
        
      }
    }

    if( thoughtProbeSelected5==true ){
      if( millis() > timeThoughtProbeSelected + waitTimeThoughtProbeSelected){
        if(mindWanderingContent){
          thoughtProbePage = 2;
          thoughtProbeSelected5=false;
        }
        else{
          interruption=false;
          thoughtProbeSelected5=false;
          timeThoughtProbeSelected=0;
        }
      }
    }

    if( thoughtProbeSelected6==true ){
      if( millis() > timeThoughtProbeSelected + waitTimeThoughtProbeSelected){
        if(mindWanderingContent){
          thoughtProbePage = 2;
          thoughtProbeSelected6=false;
        }
        else{
          interruption=false;
          thoughtProbeSelected6=false;
          timeThoughtProbeSelected=0;
        }
      }
    }
    

    fill(150,150,150,230);
    rect(player.location.x - translateDistance , 0, 3000 , height );
    rectMode(CENTER);
    //fill(240,50);
    //rect(player.location.x - translateDistance + width/2+10, height/2+10, 1000 , 550 );
    
    fill(255);
    rect(player.location.x - translateDistance + width/2, height/2, 830 , 500 );
    textAlign(CENTER);
    fill(0);
    textStyle(BOLD);
    textSize(38);
    //text("Just now, were your thoughts on or off task? ",player.location.x - translateDistance + width/2,200);
    text("Just now, where was your attention? ",player.location.x - translateDistance + width/2,37*height/100);
    textSize(20);
    //textStyle(NORMAL);
    //text("<Strong>Off task</Strong> is thinking about anything unrelated to the game", player.location.x - translateDistance + width/2,height/2-100);
    textStyle(BOLD);
    text("Off-task                                                                   ", (player.location.x - translateDistance + width/2) -50,61*height/100);
    textStyle(NORMAL);
    text("               is thinking about anything unrelated to play the game", player.location.x - translateDistance + width/2,61*height/100);
    textStyle(BOLD);
    text("On-task                                        ", (player.location.x - translateDistance + width/2) -35,65*height/100);
    textStyle(NORMAL);
    text("                 is thinking about to play the game", player.location.x - translateDistance + width/2,65*height/100);
    //text("Please respond honestly", player.location.x - translateDistance + width/2,265);
    rectMode(CORNER);

    textSize(27);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    //text("Completely",(player.location.x - translateDistance) + width/2 +241 , height / 2+10);
    text("Off-task",(player.location.x - translateDistance) + width/2 +241 , height / 2);
    textAlign(RIGHT, CENTER);
    text("On-task",(player.location.x - translateDistance) + width/2 -241 , height / 2);

    textAlign(CENTER, CENTER);
    textSize(22);
    

    if(!thoughtProbeSelected1){
      fill(0);
    }else{
      fill(highLightColor);
    }
    rect( (player.location.x - translateDistance) + width/2 -215 , height / 2 -25 ,50,50);
    fill(255);
    text("1",(player.location.x - translateDistance) + width/2 -215+25 , height / 2);

    if(!thoughtProbeSelected2){
      fill(0);
    }else{
      fill(highLightColor);
    }
    rect( (player.location.x - translateDistance) + width/2 -139 , height / 2 -25 ,50,50);
    fill(255);
    text("2",(player.location.x - translateDistance) + width/2 -139+25 , height / 2);

    if(!thoughtProbeSelected3){
      fill(0);
    }else{
      fill(highLightColor);
    }
    rect( (player.location.x - translateDistance) + width/2 -63 , height / 2 -25 ,50,50);
    fill(255);
    text("3",(player.location.x - translateDistance) + width/2 -63+25 , height / 2);

    if(!thoughtProbeSelected4){
      fill(0);
    }else{
      fill(highLightColor);
    }
    rect( (player.location.x - translateDistance) + width/2 +13 , height / 2 -25 ,50,50);
    fill(255);
    text("4",(player.location.x - translateDistance) + width/2 +13+25 , height / 2);

    if(!thoughtProbeSelected5){
      fill(0);
    }else{
      fill(highLightColor);
    }
    rect( (player.location.x - translateDistance) + width/2 +89 , height / 2 -25 ,50,50);
    fill(255);
    text("5",(player.location.x - translateDistance) + width/2 +89+25 , height / 2);

    if(!thoughtProbeSelected6){
      fill(0);
    }else{
      fill(highLightColor);
    }
    rect( (player.location.x - translateDistance) + width/2 +165 , height / 2 -25 ,50,50);
    fill(255);
    text("6",(player.location.x - translateDistance) + width/2 +165+25 , height / 2);
    rectMode(CORNER);
  }

  if(thoughtProbePage == 2){  /////////////////////////////////////////////////////////////////////////////
    let offsetY = 6;
    let rectX=23;
    let rectY=46;
    
    fill(150,150,150,230);
    rect(player.location.x - translateDistance , 0, 3000 , height );
    rectMode(CENTER);
    fill(255);
    rect(player.location.x - translateDistance + width/2, height/2, 1000 , height );
    //rect(player.location.x - translateDistance + width/2+10, height/2+10, 1000 , 550 );
    
    //fill(255);
    //rect(player.location.x - translateDistance + width/2, height/2, 830 , 500 );

    textAlign(CENTER);
    textSize(20);

    
    fill(0);
    text("Please move the grey bar with the mouse to rate the following questions about", player.location.x - translateDistance + width / 2, height / 100 * 5);
    text("the thoughts you just had, before the interruption of the video game:", player.location.x - translateDistance + width / 2, height / 100 * 8);
    rectMode(CENTER);
    fill(0);
    text("1. My thoughts involved future events", player.location.x - translateDistance + width / 2, height / 100 * 16.6 - offsetY);
    strokeWeight(10);
    stroke(0);
    line(player.location.x - translateDistance + width / 2 - sizeLine, height / 100 * 20, player.location.x - translateDistance +width / 2 + sizeLine, height / 100 * 20);
    noStroke();
    textAlign(RIGHT,CENTER);
    text("Not at all", player.location.x - translateDistance + width / 2 - sizeLine - 20, height / 100 * 20 );
    textAlign(LEFT);
    text("Completely", player.location.x - translateDistance + width / 2 + sizeLine + 20, height / 100 * 20 );
    textAlign(CENTER);
    fill(150);
    noStroke();
    rect(player.location.x - translateDistance + question1X, height / 100 * 20, rectX, rectY);
    fill(0);
    text("2. My thoughts involved past events", player.location.x - translateDistance + width / 2, height / 100 * 33.2 - offsetY);
    strokeWeight(10);
    stroke(0);
    line(player.location.x - translateDistance + width / 2 - sizeLine, height / 100 * 36.6, player.location.x - translateDistance + width / 2 + sizeLine, height / 100 * 36.6);
    noStroke();
    textAlign(RIGHT);
    text("Not at all", player.location.x - translateDistance + width / 2 - sizeLine - 20, height / 100 * 36.6 + 6);
    textAlign(LEFT);
    text("Completely", player.location.x - translateDistance + width / 2 + sizeLine + 20, height / 100 * 36.6 + 6);
    textAlign(CENTER);
    fill(150);
    noStroke();
    rect(player.location.x - translateDistance + question2X, height / 100 * 36.6, rectX, rectY);
    fill(0);
    text("3. My thoughts involved myself", player.location.x - translateDistance + width / 2, height / 100 * 50 - offsetY);
    strokeWeight(10);
    stroke(0);
    line(player.location.x - translateDistance + width / 2 - sizeLine, height / 100 * 53.4, player.location.x - translateDistance + width / 2 + sizeLine, height / 100 * 53.4);
    noStroke();
    textAlign(RIGHT);
    text("Not at all", player.location.x - translateDistance + width / 2 - sizeLine - 20, height / 100 * 53.4 + 6);
    textAlign(LEFT);
    text("Completely", player.location.x - translateDistance + width / 2 + sizeLine + 20, height / 100 * 53.4 + 6);
    textAlign(CENTER);
    fill(150);
    noStroke();
    rect(player.location.x - translateDistance + question3X, height / 100 * 53.4, rectX, rectY);
    fill(0);
    text("4. My thoughts involved other people", player.location.x - translateDistance + width / 2, height / 100 * 66.6 - offsetY); //
    strokeWeight(10);
    stroke(0);
    line(player.location.x - translateDistance + width / 2 - sizeLine, height / 100 * 70, player.location.x - translateDistance + width / 2 + sizeLine, height / 100 * 70);
    noStroke();
    textAlign(RIGHT);
    text("Not at all", player.location.x - translateDistance + width / 2 - sizeLine - 20, height / 100 * 70 + 6);
    textAlign(LEFT);
    text("Completely", player.location.x - translateDistance + width / 2 + sizeLine + 20, height / 100 * 70 + 6);
    textAlign(CENTER);
    fill(150);
    noStroke();
    rect(player.location.x - translateDistance + question4X, height / 100 * 70, rectX, rectY);
    fill(0);
    text("5. The content of my thought was:", player.location.x - translateDistance + width / 2, height / 100 * 83 - offsetY);
    strokeWeight(10);
    stroke(0);
    line(player.location.x - translateDistance + width / 2 - sizeLine, height / 100 * 86.4, player.location.x - translateDistance + width / 2 + sizeLine, height / 100 * 86.4);
    noStroke();
    textAlign(RIGHT);
    text("Negative", player.location.x - translateDistance + width / 2 - sizeLine - 20, height / 100 * 86.4 + 6);
    textAlign(LEFT);
    text("Positive", player.location.x - translateDistance + width / 2 + sizeLine + 20, height / 100 * 86.4 + 6);
    textAlign(CENTER);
    fill(150);
    noStroke();
    rect(player.location.x - translateDistance + question5X, height / 100 * 86.4, rectX, rectY);
    
    noStroke();
    rectMode(CORNER);
    fill(180,0,0);
    
    rect(player.location.x - translateDistance + width / 2 - widthRect, height / 100 * 93.7, widthRect,38,7);
    textAlign(CENTER,CENTER);
    fill(255);
    textSize(20);
    text("Next",player.location.x - translateDistance + width / 2 - (widthRect/2), height / 100 * 93+26);
    fill(0);
    textAlign(LEFT,CENTER);
    textSize(15);
    text("Please press the button",player.location.x - translateDistance + width / 2+10 , height / 100 * 91.5+(35));
    text("when you finish",player.location.x - translateDistance + width / 2+10 , height / 100 * 91.5+(50));
    rectMode(CORNER);
    
  }

  if(thoughtProbePage == 3){
    let offsetY = 6;
    let rectX=23;
    let rectY=46;
    fill(150,150,150,230);
    rect(player.location.x - translateDistance , 0, 3000 , height );
    rectMode(CENTER);
    //fill(240,50);
    //rect(player.location.x - translateDistance + width/2+10, height/2+10, 1000 , 550 );
    
    fill(255);
    rect(player.location.x - translateDistance + width/2, height/2, 1000 , height );

    textAlign(CENTER);
    textSize(20);

    
    fill(0);
    text("Please move the grey bar with the mouse to rate the following questions", player.location.x - translateDistance + width / 2, height / 100 * 5);
    text("about the unrelated thoughts you just had while playing the video game:", player.location.x - translateDistance + width / 2, height / 100 * 8);
    rectMode(CENTER);
    noFill();
    strokeWeight(2);
    fill(0);
    text("6. My thoughts were in the form of images", player.location.x - translateDistance + width / 2, height / 100 * 16.6 - offsetY);
    strokeWeight(10);
    stroke(0);
    line(player.location.x - translateDistance+ width / 2 - sizeLine, height / 100 * 20, player.location.x - translateDistance + width / 2 + sizeLine, height / 100 * 20);
    noStroke();
    textAlign(RIGHT);
    text("Not at all", player.location.x - translateDistance + width / 2 - sizeLine - 20, height / 100 * 20 + 6);
    textAlign(LEFT);
    text("Completely", player.location.x - translateDistance + width / 2 + sizeLine + 20, height / 100 * 20 + 6);
    textAlign(CENTER);
    fill(150);
    noStroke();
    rect(player.location.x - translateDistance + question6X, height / 100 * 20, rectX, rectY);
    fill(0);
    text("7. My thoughts were in the form of words", player.location.x - translateDistance + width / 2, height / 100 * 33.2 - offsetY);
    strokeWeight(10);
    stroke(0);
    line(player.location.x - translateDistance + width / 2 - sizeLine, height / 100 * 36.6, player.location.x - translateDistance + width / 2 + sizeLine, height / 100 * 36.6);
    noStroke();
    textAlign(RIGHT);
    text("Not at all", player.location.x - translateDistance + width / 2 - sizeLine - 20, height / 100 * 36.6 + 6);
    textAlign(LEFT);
    text("Completely", player.location.x - translateDistance + width / 2 + sizeLine + 20, height / 100 * 36.6 + 6);
    textAlign(CENTER);
    fill(150);
    noStroke();
    rect(player.location.x - translateDistance + question7X, height / 100 * 36.6, rectX, rectY);
    fill(0);
    text("8. My thoughts were intrusive", player.location.x - translateDistance + width / 2, height / 100 * 50 - offsetY);
    strokeWeight(10);
    stroke(0);
    line(player.location.x - translateDistance + width / 2 - sizeLine, height / 100 * 53.4, player.location.x - translateDistance + width / 2 + sizeLine, height / 100 * 53.4);
    noStroke();
    textAlign(RIGHT);
    text("Not at all", player.location.x - translateDistance + width / 2 - sizeLine - 20, height / 100 * 53.4 + 6);
    textAlign(LEFT);
    text("Completely", player.location.x - translateDistance + width / 2 + sizeLine + 20, height / 100 * 53.4 + 6);
    textAlign(CENTER);
    fill(150);
    noStroke();
    rect(player.location.x - translateDistance + question8X, height / 100 * 53.4, rectX, rectY);
    fill(0);
    text("9. My thoughts were vague and non-specific", player.location.x - translateDistance + width / 2, height / 100 * 66.6 - offsetY); //
    strokeWeight(10);
    stroke(0);
    line(player.location.x - translateDistance + width / 2 - sizeLine, height / 100 * 70, player.location.x - translateDistance + width / 2 + sizeLine, height / 100 * 70);
    noStroke();
    textAlign(RIGHT);
    text("Not at all", player.location.x - translateDistance + width / 2 - sizeLine - 20, height / 100 * 70 + 6);
    textAlign(LEFT);
    text("Completely", player.location.x - translateDistance + width / 2 + sizeLine + 20, height / 100 * 70 + 6);
    textAlign(CENTER);
    fill(150);
    noStroke();
    rect(player.location.x - translateDistance + question9X, height / 100 * 70, rectX, rectY);
    fill(0);
    text("10. My thoughts revolved around an unrelated task or project", player.location.x - translateDistance + width / 2, height / 100 * 83 - offsetY - 6);
    strokeWeight(10);
    stroke(0);
    line(player.location.x - translateDistance + width / 2 - sizeLine, height / 100 * 86.4, player.location.x - translateDistance + width / 2 + sizeLine, height / 100 * 86.4);
    noStroke();
    textAlign(RIGHT);
    text("Not at all", player.location.x - translateDistance + width / 2 - sizeLine - 20, height / 100 * 86.4 + 6);
    textAlign(LEFT);
    text("Completely", player.location.x - translateDistance + width / 2 + sizeLine + 20, height / 100 * 86.4 + 6);
    textAlign(CENTER);
    fill(150);
    noStroke();
    rect(player.location.x - translateDistance + question10X, height / 100 * 86.4, rectX, rectY);
    
    noStroke();
    rectMode(CORNER);
    fill(180,0,0);
    let widthRect=160;
    rect(player.location.x - translateDistance + width / 2 , height / 100 * 93.7, widthRect,38,7);
    textAlign(CENTER,CENTER);
    fill(255);
    textSize(20);
    text("Next",player.location.x - translateDistance+ width / 2 + (widthRect/2), height / 100 * 93+26);
    fill(0);
    textAlign(RIGHT,CENTER);
    textSize(15);
    text("Please press the button", player.location.x - translateDistance + width / 2-10 , height / 100 * 91.5+(35));
    text("when you finish",player.location.x - translateDistance + width / 2-10 , height / 100 * 91.5+(50));
  }
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
  console.log(endDate);

  let user = { 
    CaseNumber: caseNumber,
    Probe0: thoughtProbes[0],
    Probe1: thoughtProbes[1],
    Probe2: thoughtProbes[2],
    Probe3: thoughtProbes[3],
    Probe4: thoughtProbes[4],
    Probe5: thoughtProbes[5],
    ScoreQ1: scoreQ1,
    ScoreQ2: scoreQ2,
    ScoreQ3: scoreQ3,
    ScoreQ4: scoreQ4,
    ScoreQ5: scoreQ5,
    ScoreQ6: scoreQ6,
    ScoreQ7: scoreQ7,
    ScoreQ8: scoreQ8,
    ScoreQ9: scoreQ9,
    ScoreQ10: scoreQ10,
    TotalTime: totalTimeMillis,
    Cond: condition,
    EndDate: endDate,
    EndHour: endHour
  };

  //console.log("user :"+JSON.stringify(user));
  
  let response = await fetch('https://cors-anywhere.herokuapp.com/https://hci.w-hs.de/data/futurework/MW-Experiment-8/php/thoughtProbes-db.php', { 
  //let response = await fetch('https://hci.w-hs.de/data/futurework/MW-Experiment-8/php/thoughtProbes-db.php', {

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
      ReactionTimeSinceUnobstructed: platforms[i].reactionTimeSinceUnobstructed,
      TimeSpentSinceUnobstructed: platforms[i].timeSpentSinceUnobstructed,
      TotalMissedOpportGame: missedOpportunities
    };
    arrayPlatforms.levels.push(platform);
    levels.push(platform);
    /*if(i==4){
      console.log("platform 2 :"+JSON.stringify(platform));
    }*/
  }
  var abc= JSON.stringify(arrayPlatforms);
  var zeta= JSON.stringify(levels);

  let response = await fetch('https://cors-anywhere.herokuapp.com/https://hci.w-hs.de/data/futurework/MW-Experiment-8/php/platforms-db.php', {
  //let response = await fetch('https://hci.w-hs.de/data/futurework/MW-Experiment-8/php/platforms-db.php', {

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

  /*
  if(keyCode==32){ //SPACE BAR
    pressBar=true;
    fading=false;
    player.opacity=255;
    player.status=0;
    //baselineDone=true;
    
    if(fadingProbeWaiting){
      pressBarBaseline=true;
    }
  }

  if(keyCode==86){  // V: Variable on screen
    if(variables){
      variables=false;
    }else{
      variables=true;
    }
  }


  if(keyCode === 66){  // B: Border
    if(playerBorder){
      playerBorder=false;
    }else{
      playerBorder=true;
    }
  }

  if(keyCode === 67){  // C: Confort Zone ++
    if(amountBars<4){
      amountBars++;
    }
    else{
      amountBars=0;
    }
  }
  

  if(keyCode === 70){ // F: Fading
    fading=true;
    fadingCount++;
    console.log("Fading starts ... "+fadingCount);
  }
  
 
  if (keyCode === 73) {
    interruption=true;
  } 
  */
  if (keyCode === RIGHT_ARROW){
    arrowRight=true;
    countRightArrow++;

    /*playerNotObstructed &&*/
    //console.log("hasReactionTimeSinceUnobs: "+hasReactionTimeSinceUnobs);
    if(/*takenStartReaction &&*/ !hasReactionTimeSinceUnobs){
      reactionTimeSinceUnobs=Math.round(millis());
      //console.log("reactionTimeSinceUnobs: "+reactionTimeSinceUnobs);
      //console.log("reactionTimeSinceUnobs: "+reactionTimeSinceUnobs);
      //hasReactionTimeSinceUnobs=true;
    }
  }
  if (keyCode === LEFT_ARROW){
    arrowLeft=true;
    playerMovement=true;
    countLeftArrow++;
  }
  
  if( screenMuseFlow == "undemandingTraining" || screenMuseFlow == "demandingTraining" ){
    if(keyCode === 69){  // e
      //player.location.x=trainingPlatforms[amountTrainingPlatforms-2].rx;
      player.location.x=trainingPlatforms[amountTrainingPlatforms-2].rx;
      player.location.y=height/8;
    }
  }
  
  if( screenMuseFlow == "undemanding" || screenMuseFlow == "demanding" ){
    if(keyCode === 69){  // e
      player.location.x=platforms[amountPlatforms-2].rx;
      player.location.y=height/8;
    }
  }
  
  
  
  // [32,53,78,116,140];
  if(condition=="undemanding"){
    if(keyCode === 49 ){ // #1
      if(platforms.length>36){
        player.location.x=platforms[36].rx;
        player.location.y=height/8;
      }
    }
    if(keyCode === 50 ){
      if(platforms.length>52){
        player.location.x=platforms[52].rx;
        player.location.y=height/8;
      }
    }
    if(keyCode === 51 ){
      if(platforms.length>77){
        player.location.x=platforms[77].rx;
        player.location.y=height/8;
      }
    }
    if(keyCode === 52 ){
      if(platforms.length>115){
        player.location.x=platforms[115].rx;
        player.location.y=height/8;
      }
    }
    if(keyCode === 53 ){  // #5
      if(platforms.length>141){
        player.location.x=platforms[141].rx;
        player.location.y=height/8;
      }
    }
  }
  
  //[3,56,207,290,325]
  /*
  if(condition=="demanding"){
    if(keyCode === 49 ){   // 1
      if(platforms.length>42){
        player.location.x=platforms[42].rx;
        player.location.y=height/8;
      }
    }
    if(keyCode === 50 ){  // 2
      if(platforms.length>56){
        player.location.x=platforms[56].rx;
        player.location.y=height/8;
      }
    }
    if(keyCode === 51 ){  // 3
      if(platforms.length>207){
        player.location.x=platforms[207].rx;
        player.location.y=height/8;
      }
    }
    
    if(keyCode === 52 ){  // 4
      console.log("Tecla4");
      if(platforms.length>201){
        player.location.x=platforms[201].rx;
        player.location.y=height/8;
      }
    }
    
    if(keyCode === 53 ){  // 5
      if(platforms.length>333){
        player.location.x=platforms[333].rx;
        player.location.y=height/8;
      }
    }
    
  }
  
  
  if(keyCode === 68){   // d 
    //console.log("ENTra E");
    condition="demanding";
  }

  if(keyCode === 85){   // u 
    //console.log("ENTra U");
    condition="undemanding";
  }
  */
}

function keyReleased() {
  /*
  if (keyCode === 73) {  // i
    interruption=false;

    gotExtratime=false;
    interruptionTime=0;
    interruptionTime2=0;
    extraTime=0;
  }
  */
  if(keyCode==32){
    pressBar=false;
    pressBarBaseline=false;
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
  let isCurrentHorizontalPlatUndemanding=false;
  if(condition=="undemanding"){
    for(let i=0;i<horizontalPlatformsLocation.length;i++){
      if(horizontalPlatformsLocation[i]==numCurrentPlat){
        isCurrentHorizontalPlatUndemanding=true;  
      }
    }
  }

  let isCurrentHorizontalPlatDemanding=false;
  if(condition=="demanding"){
    for(let i=0;i<horizontalPlatformsLocationDemanding.length;i++){
      if(horizontalPlatformsLocationDemanding[i]==numCurrentPlat){
        isCurrentHorizontalPlatDemanding=true;  
      }
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
      if(isCurrentHorizontalPlatUndemanding==true){
        player.location.x=player.location.x+platforms[numCurrentPlat].speedX;
      }
    }
    if(!arrowLeft && !arrowRight){
      if(isCurrentHorizontalPlatDemanding==true){
        player.location.x=player.location.x+platforms[numCurrentPlat].speedXDemanding;
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
  fill("#BB4430");  // International Orange Golden Gate Color
  rect(width / 2 - 100, height / 2 + 50, 200, 100,10);
  //rect(width / 2 - 100, height / 2 + 50, 200, 100);

  fill(255); // '#5E5D53'
  textStyle(BOLD);
  textSize(28);
  textAlign(CENTER, CENTER);
  text("Introduction", width / 2, height / 2 +100);
  
  if(mouseIsPressed){
    if(mouseX>width / 2 - 100 && mouseX< width / 2 + 100){
      if(mouseY>height / 2 + 50 && mouseY<height / 2 + 150){
        //screen="baseline";
        
        if(condition=="undemanding"){
          screenMuseFlow="undemandingInstructions";
        }
        if(condition=="demanding"){
          screenMuseFlow="demandingInstructions";
        }
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
  fill("#BB4430");   // International Orange Golden Gate Color
  rect(width / 2 - 100, height / 2 + 150, 200, 100,10);
  //rect(width / 2 - 100, height / 2 + 50, 200, 100);

  fill(255); // '#5E5D53'
  textStyle(BOLD);
  textSize(28);
  textAlign(CENTER,CENTER);
  text("Training", width / 2, height / 2 + 200);
  
  if(mouseIsPressed){
    if(mouseX>width / 2 - 100 && mouseX< width / 2 + 100){
      if(mouseY>height / 2 + 150 && mouseY<height / 2 + 250){
        
        //screen=condition;
        if(condition=="demanding"){
          screenMuseFlow="demandingTraining";
        }
        if(condition=="undemanding"){
          screenMuseFlow="undemandingTraining";
        }
        let fs = fullscreen();
        fullscreen(!fs);
      }
    }
  }
}

function transitionButton(){
  noStroke();
  fill("#BB4430");      // International Orange Golden Gate Color
  rect(width / 2 - 100, height / 2 + 150, 200, 100,10);
  //rect(width / 2 - 100, height / 2 + 50, 200, 100);

  fill(255); // '#5E5D53'
  textStyle(BOLD);
  textSize(28);
  textAlign(CENTER,CENTER);
  text("Game", width / 2, height / 2 + 200);
  
  if(mouseIsPressed){
    if(mouseX>width / 2 - 100 && mouseX< width / 2 + 100){
      if(mouseY>height / 2 + 150 && mouseY<height / 2 + 250){
        
        //screen=condition;
        if(condition=="demanding"){
          screenMuseFlow="demanding";
        }
        if(condition=="undemanding"){
          screenMuseFlow="undemanding";
        }
        
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if(condition=="demanding"){
    for(let j=0;j<horizontalPlatformsLocationDemanding.length;j++){
      if(horizontalPlatformsLocationDemanding[j]+1<platforms.length){
        platforms[horizontalPlatformsLocationDemanding[j]].ry = height/2;
        platforms[horizontalPlatformsLocationDemanding[j]].rh = height/2;
        platforms[horizontalPlatformsLocationDemanding[j]-1].rh=height/2;
        platforms[horizontalPlatformsLocationDemanding[j]-1].ry=height/2;
        platforms[horizontalPlatformsLocationDemanding[j]+1].rh=height/2;
        platforms[horizontalPlatformsLocationDemanding[j]+1].ry=height/2;
      }
    }

    for(let i=0;i<flatPatternDemanding.length; i++){
      platforms[flatPatternDemanding[i]].rh=45*height/100;
    }
    
    for(let i=0;i< stairsPatternDemanding.length; i++){
      platforms[stairsPatternDemanding[i]].rh=15*height/100 + (25);
    }
  }

  if(condition=="undemanding"){
    for(let j=0;j<horizontalPlatformsLocation.length;j++){
      if(horizontalPlatformsLocation[j]+1<platforms.length){
        platforms[horizontalPlatformsLocation[j]].ry = 50*height/100;
        platforms[horizontalPlatformsLocation[j]].rh = 50*height/100;
        platforms[horizontalPlatformsLocation[j]-1].rh=50*height/100;
        platforms[horizontalPlatformsLocation[j]-1].ry=50*height/100;
        platforms[horizontalPlatformsLocation[j]+1].rh=50*height/100;
        platforms[horizontalPlatformsLocation[j]+1].ry=50*height/100;
      }
    }

    for(let i=0;i<flatPattern1.length; i++){
      if( flatPattern1[i] <amountPlatforms){
        platforms[flatPattern1[i]].rh=50*height/100; //////////////////////////
      }
    }
  
    for(let i=0;i<stairsPattern1.length; i++){
      if( stairsPattern1[i] <amountPlatforms){
        platforms[stairsPattern1[i]].rh= -(13) + (60*height/100);   /////////////////////////////
      }
    }
  }
}


function mouseDragged() {
  if (thoughtProbePage == 2) {
    
    if( mouseX>width / 2 - widthRect && mouseX < width / 2){
      if(mouseY>height / 100 * 93.7 && mouseY< height / 100 * 93.7 +38 ){
         //thoughtProbePage = 3;
         interruption = false;
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
  
  if (thoughtProbePage == 3) {
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