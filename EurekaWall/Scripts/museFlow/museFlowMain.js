//**********************************************************************************************************************************//    
//**************************************************************************************************//                           
//                                 Beginning DRAW()
//**************************************************************************************************// 
//*********************************************************************************************************************************//


function museFlowMain() {

    if(width>height){
    posXpowerUps=player.location.x - translateDistance +width/2;
    console.log("Current platform:  "+numCurrentPlat);
    //console.log("Fading Probe Number:  "+fadingProbeNumber);
    
    //console.log("timeThoughtProbeSelected: "+timeThoughtProbeSelected1);
    //console.log("speedX: "+player.speedX);
    console.log("playerPosX: "+player.location.x);
    //console.log(indexthoughtProbe);
    //console.log("thoughtProbeNumber: "+thoughtProbeNumber);
    //console.log("counter: "+countError);
    //console.log("Screen: "+screen);
    //console.log("Condition: "+condition);
    //console.log("amountTrainingPlatforms:"+amountTrainingPlatforms);
    //console.log("JumpingMode: "+jumpingMode);
    //console.log("81 plat"+platforms[81].ry);
    
    //console.log(" Platforms missedOpportunities: "+platforms[numCurrentPlat].reactionTime);
    
    //console.log("missedOpor: "+missedOpportunities);
    //console.log("Fading process: "+fading);
    //console.log("MouseX: "+mouseX);
    //console.log("Width: "+width);
    //console.log(fadingProbeResults);
    
    //**************************************************************************************************//                              
    //                                     Missed oportunities (draw)
    //**************************************************************************************************//
    if(numCurrentPlat>=0  && numCurrentPlat+1<platforms.length-1 ){                   
      if(platforms[numCurrentPlat].ry-30 < platforms[numCurrentPlat+1].ry){               // 1. Is not obstructed
        if(platforms[numCurrentPlat].timeCurrentVisitOnPlat>1){
          playerNotObstructed=true;   // Not Obstructed
          
        }
        //console.log("Player is NOT obstructed:  ");
      }
    }
    if(playerNotObstructed){                                                              // 2.1. Was not obstructed 
      if(platforms[numCurrentPlat].ry > platforms[numCurrentPlat+1].ry+30){              // 2.2. Become Obstructed
        playerObstructed=true;                                                                     
        
        if(playerNotObstructed){      // Not Obstructed
          missedOpportunities++;
          playerNotObstructed=false;
          playerObstructed=false;
        }
      }
    }
    //**************************************************************************************************//                              
    //                                 Time Spent Unobstructed  (draw)
    //**************************************************************************************************//
    //Is Not Obstructed // Se debe verificar primero que haya sido obstruido antes  // Si no se ha obstruido antes no se debe contar
    // pensar como hacer para que comience si no ha oprimido la tecla derecha
  
    if(numCurrentPlat>=0 && numCurrentPlat+1<platforms.length-1){                     
      if(platforms[numCurrentPlat].ry-30 > platforms[numCurrentPlat+1].ry){   // 1. Is obstructed
        if(platforms[numCurrentPlat].timeCurrentVisitOnPlat>1){     
          playerObstructedRectionTime=true;  
          hasReactionTimeSinceUnobs=false;
          takenStartReaction=false;
          //console.log(" startReactionTime: dfsdfds");
        }
      }
    }
  
    //console.log("playerObstructedRectionTime: "+playerObstructedRectionTime);
  
    if(playerObstructedRectionTime){               
      if(platforms[numCurrentPlat].ry-30 < platforms[numCurrentPlat+1].ry){   // 1. Is Not Obstructed // Se debe verificar primero que haya sido obstruido antes  // Si no se ha obstruido antes no se debe contar 
        //console.log(" startReactionTime: dfsdfds");
        if(!takenStartReaction){    //Reaction Time
          startReactionTime = Math.round(millis());
          //console.log(" startReactionTime: "+startReactionTime);
          takenStartReaction = true;
          startIndex = numCurrentPlat;
          playerObstructedRectionTime = false;
        }
      }
    }
    //**************************************************************************************************//                              
    //                                     Reaction Time  (draw)
    //**************************************************************************************************//
    //console.log("hasReactionTimeSinceUnobs: "+hasReactionTimeSinceUnobs);
    if(numCurrentPlat>=0  && numCurrentPlat+1<platforms.length-1 ){                   
      if(platforms[numCurrentPlat].ry-30 < platforms[numCurrentPlat+1].ry){      // 1. Is not obstructed
        //hasReactionTimeSinceUnobs=false;
        //ballIsOsbructructed=false;
        }
      if(platforms[numCurrentPlat].ry-30 > platforms[numCurrentPlat+1].ry){     // 2. Is obstructed
        //ballIsOsbructructed=true;
      }
        //console.log("Player is NOT obstructed:  ");
    }
    
    /*
    if(playerObstructedRectionTime==true){                                       // Obstructed
      if(numCurrentPlat>=0 && numCurrentPlat+1<platforms.length-1){             
        //playerNotObstructedRectionTime=true;
        if(player.location.x> platforms[numCurrentPlat].rx+7*platforms[numCurrentPlat].rw/10){  // Not Obstructed
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
    */
    
  
    //console.log("StartTime: "+startReactionTime);
    //console.log("EndTime: "+endReactionTime);
     
    //**************************************************************************************************//                              
    //                                     Interruption (Thought probe) (draw)
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
  
    if(interruption && condition=="undemanding"){
      player.location.y=height-platforms[numCurrentPlat].rh-player.radius+15;
    }
  
    //**************************************************************************************************//
    //                              
    //                                0.  Fading Baseline - Intro (draw)
    //
    //**************************************************************************************************//
  
    if(screenMuseFlow=="intro"){
      background(40);
      background("#001529");
      
      //image(img, 0, 0);
      
      //noCanvas();
      textAlign(CENTER);
      textSize(25);
      fill(255);
      textStyle(BOLD);
      text("INTRODUCTION",width/2,8*height/100);
      textSize(20);
      textStyle(NORMAL);
      text("You will now start training on a simple video game for around 2 minutes.",width/2,16*height/100);
      text("We would kindly ask you to turn off your mobile phone, find a quiet place,",width/2,21*height/100);
      text("do not listen to music and not conduct any other activities for the duration",width/2,24*height/100);
      text("of the game.",width/2,27*height/100);
      //text("please press the space bar when you realize the ball has a dot in the middle.",width/2,31*height/100);
      //text("The point in the middle always appears after 3 rings are displayed.",width/2,34*height/100);
      //text("Please be prepared to press the space bar.",width/2,37*height/100);
      
      //text("When you press the \"First Task\" button, the system will show the game in full screen mode.",width/2,40*height/100);
      //text("It is not possible to move the player",width/2,24*height/100);
      //text("(The fading starts after 3 seconds )",width/2,28*height/100);
      //text("You will now start training on a simple video game for around 2 minutes.",width/2,16*height/100);
      //text("We would kindly ask you to turn off your mobile phone and not",width/2,20*height/100);
      //text("conduct any other activities for the duration of the game.",width/2,24*height/100);
      textSize(20);
      text("Please click on the button when you are ready.",width/2,48*height/100);
      buttonInstructions();
    }
  
    //**************************************************************************************************//
    //                              
    //                                   0.  Fading Baseline (draw)
    //
    //**************************************************************************************************//
  
    if(screen=="baseline"){
      background("#9FBDE3");
      fill("#3A2E39");
      rect(-width/3,0,widthGame+width,115);
      translate(-player.location.x + translateDistance, 0);
  
      player.show();
      //console.log("baselinePlatforms: "+baselinePlatforms.length);
      for (let i = 0; i < baselinePlatforms.length ; i++) {
        player.collisionCircleRect(baselinePlatforms[i].rx, baselinePlatforms[i].ry, baselinePlatforms[i].rw, baselinePlatforms[i].rh);
        if (player.side == 2 && (player.distance <= player.radius)) {
          //currentPlat=i;
          baselinePlatforms[i].setColour();
          baselinePlatforms[i].show(i, player.location.x);
          numCurrentPlat=i;
        } else {
          baselinePlatforms[i].show(-1);
          baselinePlatforms[i].entro=false;
        }
      }
      player.applyVelocityGravity();
  
      if(!initialTime){
        tiempoInicioBaseline = millis();
        initialTime=true;
      }
      if(!baselineDone){
        if (millis() - tiempoInicioBaseline > tiempoEsperaBaseline) {
          //fading=true;
          //fadingProbeWaiting=true;
          //fadingProbeNumber=0;
          
          baselineDone=true;
          ringsChanging=true;
        }	
      }
  
      if(ringsChanging==true){
        if (millis() - tiempoInicioRings > tiempoEsperaRings) {
          amountBars++;
          tiempoInicioRings = millis();
          tiempoEsperaRings = random(2500,4000);
        }
        if(amountBars==4){
          tiempoInicioFading = millis();
          fadingProbeWaiting=true;
          ringsChanging=false;
        }	
      }
  
      //console.log("FadingProbeWaiting: "+fadingProbeWaiting);
      if(fadingProbeWaiting==true && pressBarBaseline==true){
        tiempoInicioBaselineExit=millis();
        fadingProbeResults[fadingProbeNumber]=millis()-tiempoInicioFading;
        fadingProbeWaiting=false;
        baselineWating=true;
      }
      if(baselineWating){
        if (millis() - tiempoInicioBaselineExit > tiempoEsperaBaselineExit) {
          baselineWating=false;
          amountBars=0;
          if(condition=="undemanding"){
            screenMuseFlow="undemandingInstructions";
          }
          if(condition=="demanding"){
            screenMuseFlow="demandingInstructions";
          }
        }
      }
    }
  
    //**************************************************************************************************//
    //                              
    //                                        Instructions (draw)
    //
    //**************************************************************************************************//
  
    if(screenMuseFlow=="undemandingInstructions"){
      background(40);
      background("#001529");
      
      image(undemandingInstructions,width/12,(16*height/100)-30,40*width/100,23*width/100);  // 755,430
      textSize(30);
      fill(255);
      textStyle(BOLD);
      text("TRAINING INSTRUCTIONS",width/2,8*height/100);
      textAlign(LEFT,TOP);
      textSize(14);
      textStyle(NORMAL);
      /*
      text("Your goal is to move a ball through the game by steering it towards the right side of the screen from one",width/2,16*height/100);
      text("moving platform to the next one. You can use the left and right arrow keys of the keyboard to move the ball.",width/2,20*height/100);
      text("On the top left, you will see your progress in the level. A flag will signal the end of the level. ",width/2,26*height/100);
      text("On the top right, you will see the points which you receive for reaching a new platform.",width/2,30*height/100);
      text("The duration of the game is around 10 minutes.",width/2,34*height/100);
      text("When you press the \"Next\" button, the system will show the game in full screen mode.",width/2,40*height/100);
      */
      let offset=20;
      //Your goal is to move a ball through the game by steering it towards the right side of the screen from one
      //text("You will now start playing a simple video game as training for around 2 minutes.",width/2,11*height/100+offset);
      text("Your goal is to move a ball through the game by steering it towards the",width/2,20*height/100+offset);
      text("right side of the screen, from one moving platform to the next one. You",width/2,23*height/100+offset);
      text("can use the left and right arrow keys of the keyboard to move the ball.",width/2,26*height/100+offset);
      //text("While you are playing the game, please press the space bar as soon as you",width/2,27*height/100+offset);
      //text("realize that the ball has a dot in the middle, such as you did in the first task.",width/2,30*height/100+offset);
      //text("Therefore, please keep both hands on the keyboard to be prepared.",width/2,33*height/100+offset);
      text("On the top left, you will see your progress in the level. A flag will",width/2,30*height/100+offset);
      text("signal the end of the level. On the top half, you will see a timer when",width/2,33*height/100+offset);
      text("the player gets a power-up.",width/2,36*height/100+offset);
      //text("The duration of the game is around 10 minutes.",width/2,36*height/100+offset);
      //text("",width/2,34*height/100+offset);
      text("When you press the \"Training\" button, the system will show the game in",width/2,40*height/100+offset);
      text("full screen mode.",width/2,43*height/100+offset);
  
      //textSize(20);
      textAlign(CENTER);
      text("Please click \"Training\" whenever you are ready to start the game!",width/2,57*height/100+offset+30);
      buttonStart();
    }
  
    if(screenMuseFlow=="demandingInstructions"){
      background(40);
      background("#001529");
      image(demandingInstructions,width/12,(16*height/100)-30,40*width/100,23*width/100);
      textSize(30);
      fill(255);
      textStyle(BOLD);
      text("TRAINING INSTRUCTIONS",width/2,8*height/100);
      textAlign(LEFT,TOP);
      textSize(14);
      textStyle(NORMAL);
      /*
      text("Your goal is to move a ball through the game by steering it towards the right side of the screen from one",width/2,16*height/100);
      text("moving platform to the next one. You can use the left and right arrow keys of the keyboard to move the ball.",width/2,20*height/100);
      text("On the top left, you will see your progress in the level. A flag will signal the end of the level. ",width/2,26*height/100);
      text("On the top right, you will see the points which you receive for reaching a new platform.",width/2,30*height/100);
      text("The duration of the game is around 10 minutes.",width/2,34*height/100);
      text("When you press the \"Next\" button, the system will show the game in full screen mode.",width/2,40*height/100);
      */
  
     let offset=20;
      //text("You will now start playing a simple video game as training for around 2 minutes.",width/2,11*height/100+offset);
      text("Your goal is to move a ball through the game by steering it towards the",width/2,20*height/100+offset);
      text("right side of the screen, from one moving platform to the next one. You",width/2,23*height/100+offset);
      text("can use the left and right arrow keys of the keyboard to move the ball.",width/2,26*height/100+offset);
      //text("While you are playing the game, please press the space bar as soon as you",width/2,27*height/100+offset);
      //text("realize that the ball has a dot in the middle, such as you did in the first task.",width/2,30*height/100+offset);
      //text("Therefore, please keep both hands on the keyboard to be prepared.",width/2,33*height/100+offset);
      text("On the top left, you will see your progress in the level. A flag will",width/2,30*height/100+offset);
      text("signal the end of the level. On the top half, you will see a timer when",width/2,33*height/100+offset);
      text("the player gets a power-up. On the top right, you will see the points,",width/2,36*height/100+offset);
      text("if the ball reaches a platform you will get one point but if the ball ",width/2,39*height/100+offset);
      text("falls between the gaps you will lose two points.",width/2,42*height/100+offset);
      //text("The duration of the game is around 10 minutes.",width/2,36*height/100+offset);
      //text("",width/2,34*height/100+offset);
      text("When you press the \"Training\" button, the system will show the game in",width/2,46*height/100+offset);
      text("full screen mode.",width/2,49*height/100+offset);
      
      /*
      text("You will now start playing a simple video game as training for around 2 minutes.",width/2,11*height/100+offset);
      text("Your goal is to move a ball through the game by steering it towards the right",width/2,16*height/100+offset);
      text("side of the screen, from one moving platform to the next one. You can use the",width/2,19*height/100+offset);
      text("left and right arrow keys of the keyboard to move the ball.",width/2,22*height/100+offset);
      text("While you are playing the game, please press the space bar as soon as you",width/2,27*height/100+offset);
      text("realize that the ball has a dot in the middle, such as you did in the first task.",width/2,30*height/100+offset);
      text("Therefore, please keep both hands on the keyboard to be prepared.",width/2,33*height/100+offset);
      text("On the top left, you will see your progress in the level. A flag will signal",width/2,38*height/100+offset);
      text("the end of the level. On the top half, you will see a timer when the player",width/2,41*height/100+offset);
      text("gets a power-up.",width/2,44*height/100+offset);
      //text("The duration of the game is around 10 minutes.",width/2,36*height/100+offset);
      //text("",width/2,34*height/100+offset);
      text("When you press the \"Training\" button, the system will show the game in",width/2,49*height/100+offset);
      text("full screen mode.",width/2,52*height/100+offset);
      */
      //textSize(20);
      textAlign(CENTER);
      text("Please click \"Training\" whenever you are ready to start the game!",width/2,57*height/100+offset+30);
      buttonStart();
    }
  
    //**************************************************************************************************//
    //**************************************************************************************************//                              
    //                               1. Undemanding Training (draw)
    //**************************************************************************************************//
    //**************************************************************************************************//
  
    if(screenMuseFlow=="undemandingTraining"){
      background("#9FBDE3");
      //console.log("screen: "+screen+"   trainingPlatforms.length: "+trainingPlatforms.length);
      //console.log("TrainingPlatforms locationX: "+trainingPlatforms[0].rx+"   TrainingPlatforms locationY: "+trainingPlatforms[0].ry);
      //console.log("Player: "+player.location.x);
      //console.log("goalFlagTraining: "+goalFlagTraining);
      
      //fill(0);
      //rect(0,582,200,200);
      
      //fill("#454547");
      fill("#3A2E39");
      //fill("#80585B");
      rect(-width/3,0,widthGame+width,115);
      translate(-player.location.x + translateDistance, 0);
  
      //**************************************************************************************************//                              
      //                          1.  Undemanding  Training - Progress Bar (draw)
      //**************************************************************************************************//
      
      
      textAlign(CENTER,CENTER);
      textSize(15);
      textStyle(BOLD);
      fill(255);
      noStroke();
      text("Game Progress", player.location.x - translateDistance +220,25);
      stroke(255);
      strokeWeight(2);
      noFill();
      rect(player.location.x - translateDistance +70,40,300,50,10);
      noStroke();
      let progres = map(numCurrentPlat, 0,amountTrainingPlatforms-1,0,290);
      //fill(255,0,0);
      
      fill(255,150,0);
      //fill("#F15152");
      fill("#E08300");
      rect(player.location.x - translateDistance +70+5,40+5,progres,40,10);
  
      //console.log(  player.location.x );
      
      player.show();
      player.bounceEdges();
      playerMovementInput();
  
      var flag = false;
       
      for (let i = 0; i < trainingPlatforms.length ; i++) {
        
        if(!interruption){
          trainingPlatforms[i].move();
        }else{
          //player.location.y = height/3;
          //player.location.x = 4303;
        }
  
        player.collisionCircleRect(trainingPlatforms[i].rx, trainingPlatforms[i].ry, trainingPlatforms[i].rw, trainingPlatforms[i].rh);
        if (player.side == 2 && (player.distance <= player.radius)) {
          //currentPlat=i;
          trainingPlatforms[i].setColour();
          trainingPlatforms[i].show(i, player.location.x);
          numCurrentPlat=i;
  
          /// RINGS
          for(let i=0;i<undemandingRingTrainingProbesLocations.length;i++){
            if(undemandingRingTrainingProbesDone[i]==false){
              if(undemandingRingTrainingProbesLocations[i]==numCurrentPlat){
                undemandingRingTrainingProbesDone[i]=true;
                amountBars++;
                if(amountBars==4){
                  fadingProbeWaiting=true;
                  tiempoInicioFading = millis();
                }	
              }
            }
          }
          if(fadingProbeWaiting==true && pressBarBaseline==true){
            //tiempoInicioBaselineExit=millis();
            fadingProbeNumber++;
            fadingProbeResults[fadingProbeNumber]=millis()-tiempoInicioFading;
            fadingProbeWaiting=false;
            baselineWating=true;
            amountBars++;
          }
  
          // stairs version Thought Probe 1
          //console.log(player.location.x);
          if(undemandingTrainingProbe0==false){
            if(numCurrentPlat==undemandingTrainingProbesLocations[0]){
              
              interruption=true;
              thoughtProbeNumber=0;
              undemandingTrainingProbe0=true;
              
            }
          }
  
          // FADING UNDEMANDING TRAINING
          /*
          if(fadingProbe0==false){
            if(numCurrentPlat==undemandingTrainingFadingProbesLocations[0]){
              fading=true;
              fadingProbe0=true;
              tiempoInicioFading = millis();
              fadingProbeWaiting=true;
              fadingProbeNumber=1;
              //tiempoTomadoFading = false;
            }
          }
          */
        } else {
          trainingPlatforms[i].show(-1);
          trainingPlatforms[i].entro=false;
        }
        if (trainingPlatforms[i].visited == true) {
          points++;
        }
  
        for(let j=0;j<trainingPlatforms[i].partialTimesOnPlat.length ;j++){
          if (trainingPlatforms[i].partialTimesOnPlat[j] > longestTime) {
            longestTime = trainingPlatforms[i].longestTime;
          }
        }
      }
      /*
      if(fadingProbeWaiting==true && pressBar==true){
        fadingProbeResults[fadingProbeNumber]=millis()-tiempoInicioFading;
        fadingProbeWaiting=false;
      }
      */
      player.applyVelocityGravity();
     
      for(let i=0;i<flatLocationUndemanding.length;i++){
        if( flatLocationUndemanding[i] <trainingPlatforms.length){
          if(player.collisionPowerUp( trainingPlatforms[flatLocationUndemanding[i]].flatPattern.posX , trainingPlatforms[flatLocationUndemanding[i]].flatPattern.posY , trainingPlatforms[flatLocationUndemanding[i]].flatPattern.radius)){
            //console.log("flatLocationUndemanding[ ]: "+flatLocationUndemanding[i]+"flatUndemandingTraining" + flatUndemandingTraining  );
            if( flatLocationUndemanding[i] + flatUndemandingTraining < amountTrainingPlatforms - amountCutEndPlats ){
              if (startedTimeFlat == false) {
                tiempoInicio = millis();
                startedTimeFlat = true;
                indexFlatPattern = i;
                player.location.y = height / 2;
              }
            }else{
              console.log("There are no enough platforms for the flat pattern iii");  
            }
          }
        }
      }
     
      if(goalFlagTraining<trainingPlatforms.length){
        if( player.collisionFlag( trainingPlatforms[goalFlagTraining].goalFlag.posX, trainingPlatforms[goalFlagTraining].goalFlag.posY, trainingPlatforms[goalFlagTraining].goalFlag.colW, trainingPlatforms[goalFlagTraining].goalFlag.colH) ){
          console.log("reach the flag");
          fadingProbeNumber=1;
          screenMuseFlow="UndemandingTransition";
          background(0);
          player.location = createVector(250, 25);
          numCurrentPlat=0;
          amountBars=0;
          //totalTimeMillis=Math.round(millis()/1000);
          //dorequestThoughtProbes().catch( catchErrorThoughtProbes ); 
  
          //dorequestPlatforms().catch( catchError );
  
          //let fs = fullscreen();
          //fullscreen(!fs);
        }
      }
      
      
  
      //**************************************************************************************************//                      
      //                         1. Undemanding Training - Flat Pattern  (draw)
      //**************************************************************************************************//
      
      
      if(startedTimeFlat == true){
        let end = map(millis()-tiempoInicio-extraTime,0,tiempoEspera,0,360);
        textAlign(CENTER,CENTER);
        textSize(15);
        textStyle(BOLD);
        fill(255,150,0);
        ellipse(posXpowerUps,60,90,90);
        fill(40);
        arc(posXpowerUps,60,90,90,-PI/2,radians(end)-PI/2,PIE);
        fill(255,150,0);
        stroke(255,150,0);
        strokeWeight(2);
        fill("#454547");
        ellipse(posXpowerUps,60,25,25);
        noFill();
        ellipse(posXpowerUps,60,90,90);
        noStroke();
        
        if (millis() < tiempoInicio + tiempoEspera + extraTime) {
            for (let k = flatLocationUndemanding[indexFlatPattern]; k < flatLocationUndemanding[indexFlatPattern] + flatUndemandingTraining; k++) {   
  
              platStatus=1;
              //console.log("k "+k);
              trainingPlatforms[k].easing();
              trainingPlatforms[k].targetY = 50*height/100;
            }
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
      points = 0;
  
      edgeLines();
      
    }
  
    // End Undemanding Training (draw)
    //**************************************************************************************************//                      
    //                     1.1. Undemanding Transition  (draw)
    //**************************************************************************************************//
  
    if(screenMuseFlow=="UndemandingTransition"){
      background(20);
      background("#001529");
      textAlign(CENTER);
      textSize(30);
      fill(255);
      textStyle(BOLD);
      text(" ",width/2,8*height/100);
      textSize(25);
      
      //text("Now you are going to play a platform video game",width/2,100);
  
      text("Well done!",width/2,16*height/100);
      textSize(20);
      textStyle(NORMAL);
      let offset=20;
      text("Now you are ready to play the game for around 10 minutes.",width/2,20*height/100+offset);
      //text("The duration of the game is around 10 minutes. ",width/2,26*height/100);
      //text("",width/2,30*height/100);
      //text("Please remember press the space bar as soon as you realize that the ball has a dot in,",width/2,27*height/100+offset);
      //text("the middle, such as you did previously. Therefore, please keep both hands on the keyboard.",width/2,30*height/100+offset);
      text("We would kindly ask you to keep your mobile phone off and not",width/2,27*height/100+offset);
      text("conduct any other activities for the duration of the game. ",width/2,30*height/100+offset);
      //text("",width/2,160);
      textSize(20);
      text("Please click \"Game\" whenever you are ready to start the game!",width/2,height/2+100);
      //buttonStart();
      transitionButton();
    }
  
    //**************************************************************************************************//
    //**************************************************************************************************//                              
    //                              2.  Undemanding Condition (draw)
    //**************************************************************************************************//
    //**************************************************************************************************//
  
    if(screenMuseFlow=="undemanding"){
      //background(0); 
      background("#9FBDE3");
      //points=0;
      negativePoints=0;
      //fill("#454547");
      fill("#3A2E39");
      rect(-width/3,0,widthGame+width,115);
      
      translate(-player.location.x + translateDistance, 0);
  
      //**************************************************************************************************//                              
      //                         2.   Undemanding Gaming  -   Progress Bar (draw)
      //**************************************************************************************************//
      
      posXpowerUps=player.location.x - translateDistance +width/2;
      textAlign(CENTER,CENTER);
      textSize(15);
      textStyle(BOLD);
      fill(255);
      noStroke();
      text("Game Progress", player.location.x - translateDistance +220,25);
      stroke(255);
      strokeWeight(2);
      noFill();
      rect(player.location.x - translateDistance +70,40,300,50,10);
      noStroke();
      let progres = map(numCurrentPlat, 0,amountPlatforms-1,0,290);
      //fill(255,0,0);
      fill(255,150,0);
      rect(player.location.x - translateDistance +70+5,40+5,progres,40,10);
  
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
  
          /// RINGS
          for(let i=0;i<undemandingRingProbesLocations.length;i++){
            //console.log("entra for");
            if(undemandingRingProbesDone[i]==false){
              if(undemandingRingProbesLocations[i]==numCurrentPlat){
                undemandingRingProbesDone[i]=true;
                amountBars++;
                if(amountBars==4){
                  fadingProbeWaiting=true;
                  tiempoInicioFading = millis();
                }	
              }
            }
          }
          if(fadingProbeWaiting==true && pressBarBaseline==true){
            //tiempoInicioBaselineExit=millis();
            fadingProbeNumber++;
            fadingProbeResults[fadingProbeNumber]=millis()-tiempoInicioFading;
            fadingProbeWaiting=false;
            baselineWating=true;
            amountBars=0;
          }
          for(let i=0;i<undemandingRingReset.length;i++){
            if(undemandingRingReset[i]==numCurrentPlat){
              amountBars=0;
            }
          }
  
          // Thought Probe 0 
          /*
          if(undemandingThoughtProbesUpDownFlag1==false){
            for(let j=0;j<undemandingThoughtProbesUpDown1.length;j++){
              if(undemandingThoughtProbesUpDown1[j]==i){
                //console.log("entrii");
                if(platforms[numCurrentPlat].timeCurrentVisitOnPlat>4){
                  interruption=true;
                  thoughtProbeNumber=0;
                  undemandingThoughtProbesUpDownFlag1=true;
                  
                }
              }
            }
          }
          */
  
          // THOUGHTS PROBES UNDEMANDING GAMING
          if(undemandingToughtProbe1==false){
            for(let j=0;j<undemandingThoughtProbesUpDown1.length;j++){
              //if(undemandingThoughtProbesLocations[0]==numCurrentPlat){
              if(undemandingThoughtProbesUpDown1[j]==numCurrentPlat){
                if(platforms[numCurrentPlat].timeCurrentVisitOnPlat>3){
                  interruption=true;
                  thoughtProbeNumber=1;
                  undemandingToughtProbe1=true;
                }
              }
            }
          }
  
          if(undemandingToughtProbe2==false){
            if(numCurrentPlat==undemandingThoughtProbesLocations[1]){
              interruption=true;
              thoughtProbeNumber=2;
              undemandingToughtProbe2=true;
            }
          }
  
          if(undemandingToughtProbe3==false){
            for(let j=0;j<undemandingThoughtProbesUpDown3.length;j++){
              if(numCurrentPlat==undemandingThoughtProbesUpDown3[j]){
                if(platforms[numCurrentPlat].timeCurrentVisitOnPlat>3){
                  interruption=true;
                  thoughtProbeNumber=3;
                  undemandingToughtProbe3=true;
                }
              }
            }
          }
  
          if(undemandingToughtProbe4==false){
            for(let j=0;j<undemandingThoughtProbesUpDown4.length;j++){
              if(numCurrentPlat==undemandingThoughtProbesUpDown4[j]){
                if(platforms[numCurrentPlat].timeCurrentVisitOnPlat>3){
                  interruption=true;
                  thoughtProbeNumber=4;
                  undemandingToughtProbe4=true;
                }
              }
            }
          }
  
          if(undemandingToughtProbe5==false){
            if(numCurrentPlat==undemandingThoughtProbesLocations[4]){
              interruption=true;
              thoughtProbeNumber=5;
              undemandingToughtProbe5=true;
              mindWanderingContent=true;
            }
          }
  
          // FADING PROBES - UNDEMANDING GAMING 
  
          if(fadingProbe1==false){
            if(numCurrentPlat==undemandingFadingProbesLocations[0]){
              fading=true;
              fadingProbe1=true;
              fadingProbeWaiting=true;
              fadingProbeNumber=2;
              tiempoInicioFading = millis();
            }
          }
  
          if(fadingProbe2==false){
            if(numCurrentPlat==undemandingFadingProbesLocations[1]){
              fading=true;
              fadingProbe2=true;
              fadingProbeWaiting=true;
              fadingProbeNumber=3;
              tiempoInicioFading = millis();
            }
          }
  
          if(fadingProbe3==false){
            if(numCurrentPlat==undemandingFadingProbesLocations[2]){
              fading=true;
              fadingProbe3=true;
              fadingProbeWaiting=true;
              fadingProbeNumber=4;
              tiempoInicioFading = millis();
            }
          }
          if(fadingProbe4==false){
            if(numCurrentPlat==undemandingFadingProbesLocations[3]){
              fading=true;
              fadingProbe4=true;
              fadingProbeWaiting=true;
              fadingProbeNumber=5;
              tiempoInicioFading = millis();
            }
          }
        } else {
          platforms[i].show(-1);
          platforms[i].entro=false;
        }
        if (platforms[i].visited == true) {
          points++;
        }
  
        for(let j=0;j<platforms[i].partialTimesOnPlat.length ;j++){
          if (platforms[i].partialTimesOnPlat[j] > longestTime) {
            longestTime = platforms[i].longestTime;
          }
        }
      }
  /*
      if(fadingProbeWaiting==true && pressBar==true){
        fadingProbeResults[fadingProbeNumber]=millis()-tiempoInicioFading;
        fadingProbeWaiting=false;
      }
  */
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
                player.location.y = height / 3;
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
          screenMuseFlow="goalAchieved";
          background(0);
          //dorequest();
          /*
          dorequestThoughtProbes().catch( function(error){
            console.log(error);
            console.log("There was an error in ThoughtProbes ");
          });
          */
          totalTimeMillis=Math.round(millis()/1000);
          //dorequestThoughtProbes().catch( catchErrorThoughtProbes ); 
  
          //dorequestPlatforms().catch( catchError /*{
            //console.log(error);
            //console.log("There was an error in Platforms");
          //}*/);
  
          /*
          dorequestPlatforms().catch(function(error){
            console.log(error);
            console.log("There was an error in Platforms");
            //tryAgainRequestPlatforms=true;
          });
          */
          let fs = fullscreen();
          fullscreen(!fs);
          //resizeCanvas(windowWidth, windowHeight);
        }
      }
  
      //**************************************************************************************************//                      
      //                        2.  Undemanding Gaming - Stairs Pattern (draw)
      //**************************************************************************************************//
  
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
        ellipse(posXpowerUps,/*14*height/100*/60,90,90);
        //ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,/*14*height/100*/60,90,90);
        fill(40);
        
        arc(posXpowerUps ,/*14*height/100*/60,90,90,-PI/2,radians(end)-PI/2,PIE);
        //arc(player.location.x + translateDistance -13*height/100 ,/*14*height/100*/60,90,90,-PI/2,radians(end)-PI/2,PIE);
        //arc(player.location.x + translateDistance -13*height/100 ,/*14*height/100*/60,90,90,-PI/2,radians(end)-PI/2,PIE);
        //arc(player.location.x /*+ width / 2 - translateDistance*/,8*height/100,100,100,0,2*PI,PIE);
        fill(255,150,0);
        //text("STAIRS", player.location.x + translateDistance -13*height/100/*+ width / 2 - translateDistance*/, 4*height/100  /*125*/);
        stroke(255,150,0);
        strokeWeight(2);
        
        //stroke();
        fill("#454547");
        ellipse(posXpowerUps,/*14*height/100*/60,25,25);
        //ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,/*14*height/100*/60,25,25);
        noFill();
        ellipse(posXpowerUps,/*14*height/100*/60,90,90);
        //ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,/*14*height/100*/60,90,90);
        noStroke();
        
        if (millis() < tiempoInicio + tiempoEspera+extraTime) {
          //if( stairsPattern1[indexStairsPattern] + amountStairs < amountPlatforms - amountCutEndPlats ){
            for (let j = stairsPattern1[indexStairsPattern], h = 1; j < amountStairs + stairsPattern1[indexStairsPattern]; j++, h++) {
              //platforms[j].blocked = platStatus;
              //platforms[j].blocked = true;
              //console.log("Set1: "+70*height/100+"Set rest: " +(50 - (h * 3)) * height / 100);
              platStatus=1;
              
              //platforms[j].rh =  - (h * 13) + (60*height/100) ;
              platforms[j].easing();
              platforms[j].targetY =  - (h * 13) + (60*height/100) ;
              
              //platforms[j].activatedEasing=true;
              //platforms[j].endTimeEasing=millis()+2000;
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
  
  
      //**************************************************************************************************//                      
      //                        2.  Undemanding Gaming - Flat Pattern (draw)
      //**************************************************************************************************//
      
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
        ellipse(posXpowerUps,60,90,90);
        //ellipse(player.location.x /*+ translateDistance -13*height/100*/  + width / 2 - translateDistance,14*height/100,120,120);
        fill(40);
        
        arc(posXpowerUps,60,90,90,-PI/2,radians(end)-PI/2,PIE);
        //arc(player.location.x /*+ translateDistance -13*height/100*/ + width / 2 - translateDistance,14*height/100,120,120,-PI/2,radians(end)-PI/2,PIE);
        //arc(player.location.x /*+ width / 2 - translateDistance*/,8*height/100,100,100,0,2*PI,PIE);
        fill(255,150,0);
        //text("FLAT", player.location.x /*+ translateDistance -13*height/100 */  + width / 2 - translateDistance, 4*height/100  /*125*/);
        stroke(255,150,0);
        strokeWeight(2);
        fill("#454547");
        //stroke();
        ellipse(posXpowerUps,60,25,25);
        //ellipse(player.location.x /*+ translateDistance -13*height/100*/  + width / 2 - translateDistance,14*height/100,25,25);
        noFill();
        ellipse(posXpowerUps,60,90,90);
        //ellipse(player.location.x /*+ translateDistance -13*height/100*/  + width / 2 - translateDistance,14*height/100,120,120);
        noStroke();
        
        if (millis() < tiempoInicio + tiempoEspera + extraTime) {
          //if( flatPattern1[indexFlatPattern] + amountFlatPlatforms < amountPlatforms - amountCutEndPlats ){
            for (let k = flatPattern1[indexFlatPattern]; k < flatPattern1[indexFlatPattern] + amountFlatPlatforms; k++) {   //platforms.length
              //platforms[k].blocked = platStatus;
              //platforms[k].blocked = true;
              //console.log("k: "+ k);
              //platforms[k].rh = (60 - (15 * 3)) * height / 100;
  
              platStatus=1;
              
              //platforms[k].rh =  45*height/100;
              
              platforms[k].easing();
              platforms[k].targetY =50*height/100;
            }
          // }else{
          //   console.log("There are no enough platforms for the flat pattern");
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
  
      /*
      fill(250,250,0);
      rect(player.location.x + translateDistance -13*height/100,height/4,50,50);
      rect(player.location.x - translateDistance +90*width/100,height/2,80,80);
      */
  
      //points
      //fill(255);
      //textSize(55);
      //textAlign(CENTER,TOP);
      //console.log("Points: "+points);
      //textStyle(NORMAL);
      //text(points+negativePoints, player.location.x-translateDistance +90*width/100, /*14*height/100*/40 );
      //textSize(15);
      //textStyle(BOLD);
      //text("POINTS", player.location.x - translateDistance +90*width/100, /*4*height/100*/20 );
  
      /*
      fill(255);
      textSize(55);
      textAlign(CENTER,TOP);
      //console.log("Points AQUI DEMANDING: "+points);
      textStyle(NORMAL);
      text(points+negativePoints, player.location.x-translateDistance +90*width/100, 40 );
      textSize(15);
      textStyle(BOLD);
      text("POINTS", player.location.x - translateDistance +90*width/100, 20 );
      
      */ 
      if (mouseX > 7*width / 8 && mouseY > 5 && mouseY < height/7 ) {
        textAlign(RIGHT);
        /*
        text("Number Current Platform: "+numCurrentPlat,player.location.x-translateDistance+width-20,110);
        text("Game time:   " + Math.floor( ( ( millis()/1000) % 3600  / 60 ) )  +":"+ Math.floor( ( (millis()/1000) %3600) % 60 ) , player.location.x - translateDistance+width-20, 50);
        //text("Game time: " + Math.round(millis() / 1000), player.location.x - translateDistance+width-20, 50);
        text("Longest time on a platform: " + longestTime, player.location.x - translateDistance+width-20, 80);
        fill(250,200,0);
        text("Case Number: " + caseNumber, player.location.x - translateDistance+width-20, 380);
        text("Missed Opportunities: "+missedOpportunities, player.location.x - translateDistance+width-20, 410);
        //text("Case Number: "+caseNumber, player.location.x - translateDistance+width-20, 440);
        */
      }
      points = 0;
  
      edgeLines();
      //fill(255);
      //text(mouseY,15,15);
      //console.log("Location "+player.location.y+" height: "+height);
      
    }
  
  
    //**************************************************************************************************//
    //**************************************************************************************************//                              
    //                               3. Demanding Training (draw)
    //**************************************************************************************************//
    //**************************************************************************************************//
  
    if(screenMuseFlow=="demandingTraining"){
      background("#9FBDE3");
      //console.log("screen: "+screen+"   trainingPlatforms.length: "+trainingPlatforms.length);
      //console.log("TrainingPlatforms locationX: "+trainingPlatforms[0].rx+"   TrainingPlatforms locationY: "+trainingPlatforms[0].ry);
      //console.log("Player: "+player.location.x);
      //console.log("goalFlagTraining: "+goalFlagTraining);
      
      //fill(0);
      //rect(0,582,200,200);
      
      //fill("#454547");
      fill("#3A2E39");
      rect(-width/3,0,widthGame+width,115);
      translate(-player.location.x + translateDistance, 0);
  
  
      //**************************************************************************************************//                              
      //                       3.  Demanding  Training  -  Progress Bar (draw)
      //**************************************************************************************************//
      
      posXpowerUps=player.location.x - translateDistance +width/2;
      textAlign(CENTER,CENTER);
      textSize(15);
      textStyle(BOLD);
      fill(255);
      noStroke();
      text("Game Progress", player.location.x - translateDistance +220,25);
      stroke(255);
      strokeWeight(2);
      noFill();
      rect(player.location.x - translateDistance +70,40,300,50,10);
      noStroke();
      let progres = map(numCurrentPlat, 0,amountTrainingPlatforms-1,0,290);
      //fill(255,0,0);
      fill(255,150,0);
      rect(player.location.x - translateDistance +70+5,40+5,progres,40,10);
  
      //console.log(  player.location.x );
      
      player.show();
      player.bounceEdges();
      playerMovementInput();
  
      var flag = false;
       
      for (let i = 0; i < trainingPlatforms.length ; i++) {
        
        if(!interruption){
          trainingPlatforms[i].move();
        }
  
        player.collisionCircleRect(trainingPlatforms[i].rx, trainingPlatforms[i].ry, trainingPlatforms[i].rw, trainingPlatforms[i].rh);
        // stairs version Thought Probe 1
        if(demandingTrainingProbe0==false){
          if(player.location.y < trainingPlatforms[i].ry && player.location.x < trainingPlatforms[i].rx+trainingPlatforms[i].rw && player.location.x > trainingPlatforms[i].rx && demandingTrainingProbesLocations[0]==i){
          //if(numCurrentPlat==demandingTrainingProbesLocations[0]){
            console.log("Entra if + numCurrentPlat"+numCurrentPlat);
            interruption=true;
            //thoughtProbeNumber=1;
            thoughtProbeNumber=0;
            demandingTrainingProbe0=true;
            
          }
        }
        // FADING****
        if(fadingProbe0==false){
          if(player.location.y < trainingPlatforms[i].ry && player.location.x < trainingPlatforms[i].rx+trainingPlatforms[i].rw && player.location.x > trainingPlatforms[i].rx && demandingTrainingFadingProbesLocations[0]==i){
            fading=true;
            fadingProbe0=true;
            tiempoInicioFading = millis();
            fadingProbeWaiting=true;
            fadingProbeNumber=1;
            //tiempoTomadoFading = false;
          }
        }
        
        if (player.side == 2 && (player.distance <= player.radius)) {
          //currentPlat=i;
          trainingPlatforms[i].setColour();
          trainingPlatforms[i].show(i, player.location.x);
          numCurrentPlat=i;
  
          
        } else {
          trainingPlatforms[i].show(-1);
          trainingPlatforms[i].entro=false;
        }
        if (trainingPlatforms[i].visited == true) {
          points++;
        }
  
        for(let j=0;j<trainingPlatforms[i].partialTimesOnPlat.length ;j++){
          if (trainingPlatforms[i].partialTimesOnPlat[j] > longestTime) {
            longestTime = trainingPlatforms[i].longestTime;
          }
        }
      }
  /*
      if(fadingProbeWaiting==true && pressBar==true){
        fadingProbeResults[fadingProbeNumber]=millis()-tiempoInicioFading;
        fadingProbeWaiting=false;
      }
  */
      player.applyVelocityGravity();
     
      //
      //  Demanding  Training - TRYING TO FIXXX  
      //
  
      for(let i=0;i<flatLocationDemanding.length;i++){
        if( flatLocationDemanding[i] <trainingPlatforms.length){
          if(player.collisionPowerUp( trainingPlatforms[flatLocationDemanding[i]].flatPattern.posX , trainingPlatforms[flatLocationDemanding[i]].flatPattern.posY , trainingPlatforms[flatLocationDemanding[i]].flatPattern.radius)){
            //console.log("entra aqui if ooo"); 
            //console.log("flatLocationUndemanding.length"+flatLocationUndemanding.length);
            if( flatLocationDemanding[i] + flatDemandingTraining < amountTrainingPlatforms - amountCutEndPlats ){
              if (startedTimeFlat == false) {
                tiempoInicio = millis();
                startedTimeFlat = true;
                indexFlatPattern = i;
                player.location.y = height / 2;
                jumpingMode=true;
                player.velocity= createVector(0, 0);
                player.acceleration  = createVector(0, 0.31); 
              }
            }else{
              console.log("There are no enough platforms for the flat pattern");  
            }
          }
        }
      }
     
      if(goalFlagTraining<trainingPlatforms.length){
        //console.log("Entra al if: ");
        if( player.collisionFlag( trainingPlatforms[goalFlagTraining].goalFlag.posX, trainingPlatforms[goalFlagTraining].goalFlag.posY, trainingPlatforms[goalFlagTraining].goalFlag.colW, trainingPlatforms[goalFlagTraining].goalFlag.colH) ){
          console.log("reach the flag");
          screenMuseFlow="undemandingTransition";
          background(0);
          player.location = createVector(250, 25);
          numCurrentPlat = 0;
          //totalTimeMillis=Math.round(millis()/1000);
          //dorequestThoughtProbes().catch( catchErrorThoughtProbes ); 
  
          //dorequestPlatforms().catch( catchError );
  
          //let fs = fullscreen();
          //fullscreen(!fs);
        }
      }
      
      
  
      //**************************************************************************************************//                      
      //                         3. Demanding Training - Flat Pattern  (draw)
      //**************************************************************************************************//
      
      
      if(startedTimeFlat == true){
        let end = map(millis()-tiempoInicio-extraTime,0,tiempoEspera,0,360);
        textAlign(CENTER,CENTER);
        textSize(15);
        textStyle(BOLD);
        fill(255,150,0);
        ellipse(posXpowerUps,60,90,90);
        fill(40);
        
        arc(posXpowerUps,60,90,90,-PI/2,radians(end)-PI/2,PIE);
        fill(255,150,0);
        stroke(255,150,0);
        strokeWeight(2);
        
        fill("#454547");
        ellipse(posXpowerUps,60,25,25);
        noFill();
        ellipse(posXpowerUps,60,90,90);
        noStroke();
        
        if (millis() < tiempoInicio + tiempoEspera + extraTime) {
            for (let k = flatLocationDemanding[indexFlatPattern]; k < flatLocationDemanding[indexFlatPattern] + flatDemandingTraining; k++) {   
  
              platStatus=1;
              //console.log("k "+k);
              trainingPlatforms[k].easing();
              trainingPlatforms[k].targetY = 50*height/100;
            }
        } else {
              //
              //  Demanding  Training - TRYING TO FIXXX  
              //
          platStatus=0;
          startedTimeFlat = false;
          //platforms[i].blocked = false;
          gotExtratime=false;
          interruptionTime=0;
          interruptionTime2=0;
          extraTime=0;
          jumpingMode=false;
                player.velocity = createVector(0, 15);
                player.acceleration  = createVector(0, 40);
        }	   
      }
      fill(255);
      textSize(55);
      textAlign(CENTER,TOP);
      //console.log("Points AQUI DEMANDING: "+points);
      textStyle(NORMAL);
      text( points+negativePoints , posXpowerUps + 40*width/100 , 40 );
      //text(points+negativePoints, player.location.x-translateDistance +90*width/100, 40 );
      textSize(15);
      textStyle(BOLD);
      text("Points", posXpowerUps + 40*width/100, 20 );
  
      points = 0;
  
      edgeLines();
    }
  
    //**************************************************************************************************//                      
    //                     3.1. Demanding Transition  (draw)
    //**************************************************************************************************//
  
    if(screenMuseFlow=="undemandingTransition"){
      background(20);
      background("#001529");
      textAlign(CENTER);
      textSize(30);
      fill(255);
      textStyle(BOLD);
      text(" ",width/2,8*height/100);
      textSize(25);
      
      //text("Now you are going to play a platform video game",width/2,100);
  
      text("Well done!",width/2,16*height/100);
      textSize(20);
      textStyle(NORMAL);
      let offset=20;
      text("Now you are ready to play the game for around 10 minutes.",width/2,20*height/100+offset);
      //text("The duration of the game is around 10 minutes. ",width/2,26*height/100);
      //text("",width/2,30*height/100);
      //text("Please remember press the space bar as soon as you realize that the ball has a dot in,",width/2,27*height/100+offset);
      //text("the middle, such as you did previously. Therefore, please keep both hands on the keyboard.",width/2,30*height/100+offset);
      text("We would kindly ask you to keep your mobile phone off and not",width/2,27*height/100+offset);
      text("conduct any other activities for the duration of the game. ",width/2,30*height/100+offset);
      //text("",width/2,160);
      textSize(20);
      text("Please click \"Game\" whenever you are ready to start the game!",width/2,height/2+100);
      //buttonStart();
      transitionButton();
    }
  
    //**************************************************************************************************//
    //**************************************************************************************************//                              
    //                              4.  Demanding Condition (draw)
    //**************************************************************************************************//
    //**************************************************************************************************//
  
    if(screenMuseFlow=="demanding"){
      background("#9FBDE3");
      translate(-player.location.x + translateDistance, 0);
  
      //points=0;
      negativePoints=0;
      //fill("#454547");
      fill("#3A2E39");
      rect(-width/3,0,widthGame+width,115);
  
      /*
      let backgroundBegin = color("#015B65");
      let backgroundEnd = color("#70CCE1");
  
      for(let i=0;i<height;i++){
        //let outcome = lerpColor(backgroundBegin, backgroundEnd, i/height);
        let outcome = lerpColor( backgroundEnd,backgroundBegin, i/height);
        stroke(outcome);
        line(0,i,width,i);
      }
      */
  
      //**************************************************************************************************//                              
      //                              4.  Demanding Gaming -  Progress Bar
      //**************************************************************************************************//
      posXpowerUps=player.location.x - translateDistance +width/2;
      textAlign(CENTER,CENTER);
      textSize(15);
      textStyle(BOLD);
      fill(255);
      noStroke();
      text("Game Progress", player.location.x - translateDistance +220,25);
      stroke(255);
      strokeWeight(2);
      noFill();
      rect(player.location.x - translateDistance +70,40,300,50,10);
      noStroke();
      let progres = map(numCurrentPlat, 0,amountPlatforms-1,0,290);
      //fill(255,0,0);
      fill(255,150,0);
      rect(player.location.x - translateDistance +70+5,40+5,progres,40,10);
      
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
        
        /// OLD THOUGHT PROBES
        /*
        if(player.location.y < platforms[i].ry && player.location.x < platforms[i].rx+platforms[i].rw && player.location.x > platforms[i].rx && demandingThoughtProbesLocations[thoughtProbesIndex]==i){  
          interruption=true;
            if(!flagProbesIndex){
              thoughtProbesIndex++;
              flagProbesIndex=true;
            }
        }
        */
  
        // THOUGHT PROBES
        if(demandingToughtProbe1==false){
          if(player.location.y < platforms[i].ry && player.location.x < platforms[i].rx+platforms[i].rw && player.location.x > platforms[i].rx && demandingThoughtProbesLocations[0]==i){
            interruption=true;
            thoughtProbeNumber=1;
            demandingToughtProbe1=true;
          }
        }
  
        if(demandingToughtProbe2==false){
          if(player.location.y < platforms[i].ry && player.location.x < platforms[i].rx+platforms[i].rw && player.location.x > platforms[i].rx && demandingThoughtProbesLocations[1]==i){
            interruption=true;
            thoughtProbeNumber=2;
            demandingToughtProbe2=true;
          }
        }
  
        if(demandingToughtProbe3==false){
          if(player.location.y < platforms[i].ry && player.location.x < platforms[i].rx+platforms[i].rw && player.location.x > platforms[i].rx && demandingThoughtProbesLocations[2]==i){
            interruption=true;
            thoughtProbeNumber=3;
            demandingToughtProbe3=true;
          }
        }
        if(demandingToughtProbe4==false){
          if(player.location.y < platforms[i].ry && player.location.x < platforms[i].rx+platforms[i].rw && player.location.x > platforms[i].rx && demandingThoughtProbesLocations[3]==i){
            interruption=true;
            thoughtProbeNumber=4;
            demandingToughtProbe4=true;
          }
        }
        if(demandingToughtProbe5==false){
          if(player.location.y < platforms[i].ry && player.location.x < platforms[i].rx+platforms[i].rw && player.location.x > platforms[i].rx && demandingThoughtProbesLocations[4]==i){
            interruption=true;
            thoughtProbeNumber=5;
            demandingToughtProbe5=true;
            mindWanderingContent=true;
          }
        }
        
        if (player.side == 2 && (player.distance <= player.radius)) {
          //currentPlat=i;
          platforms[i].setColour();
          platforms[i].show(i, player.location.x);
          numCurrentPlat=i;
          /*   MUY RARO QUE ESTO ESTE COMENTADOOOOOOOOOOOOOOOOOOOOOOOOOOO    
          R1// creo que esta en el if de arriba    
          R2// creo que esta ya no se utiliza de esta manera, se utiliza directo con algo asi como thougtProbe=1, creo
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
      /*
      if(fadingProbeWaiting==true && pressBar==true){
        fadingProbeResults[fadingProbeNumber]=millis()-tiempoInicioFading;
        fadingProbeWaiting=false;
      }
  */
      player.applyVelocityGravity();
  
      for(let i=0;i<flatPatternDemanding.length;i++){
        if( flatPatternDemanding[i] <platforms.length){
          if(player.collisionPowerUp( platforms[flatPatternDemanding[i]].flatPattern.posX , platforms[flatPatternDemanding[i]].flatPattern.posY , platforms[flatPatternDemanding[i]].flatPattern.radius)){
            if( flatPatternDemanding[i] + amountFlatDemanding < amountPlatforms - amountCutEndPlats ){
              //console.log("There are enough platforms for the flat pattern FLAT DEMANDING");
              if (startedTimeFlat == false) {
                tiempoInicio = millis();
                startedTimeFlat = true;
                indexFlatPattern = i;
                player.location.y = height / 3;
                jumpingMode=true;
                player.velocity= createVector(0, 0);
                player.acceleration  = createVector(0, 0.31); 
              }
            }
            //amountFlatDemanding
            else{
              console.log("There are NO enough platforms for the flat pattern FLAT DEMANDING");
            }
          }
        }
      }
  
      for(let i=0;i<stairsPatternDemanding.length;i++){
        if(stairsPatternDemanding[i]<platforms.length){
          if(player.collisionPowerUp( platforms[stairsPatternDemanding[i]].stairsPattern.posX , platforms[stairsPatternDemanding[i]].stairsPattern.posY , platforms[stairsPatternDemanding[i]].stairsPattern.radius)){
            if( stairsPatternDemanding[i] + amountStairs < amountPlatforms - amountCutEndPlats ){
              if (startedTimeStairs == false) {
                tiempoInicio = millis();
                startedTimeStairs = true;
                indexStairsPattern = i;
                player.location.y = height / 3;
                jumpingMode=true;
                player.velocity= createVector(0, 0);
                player.acceleration  = createVector(0, 0.31); 
              }
            }else{
              console.log("There are no enough platforms for the stairs pattern STAIRS DEMANDING");
            }
          }
        }
      }
  
      //**************************************************************************************************//                      
      //                            4.  Demanding Gaming - Reaching the flag 
      //**************************************************************************************************//
     
      if(goalFlagNum<platforms.length){
        if( player.collisionFlag( platforms[goalFlagNum].goalFlag.posX, platforms[goalFlagNum].goalFlag.posY, platforms[goalFlagNum].goalFlag.colW, platforms[goalFlagNum].goalFlag.colH) ){
          console.log("reach the flag");
          screenMuseFlow="goalAchieved";
          background(0);
          
          //dorequestThoughtProbes();
          //dorequestPlatforms();
          totalTimeMillis=Math.round(millis()/1000);
          //dorequestThoughtProbes().catch( catchErrorThoughtProbes ); 
          //dorequestPlatforms().catch( catchError );
  
          let fs = fullscreen();
          fullscreen(!fs);
          //resizeCanvas(windowWidth, windowHeight);
        }
      }
  
      //**************************************************************************************************//                      
      //                           4.  Demanding Gaming - Stairs Pattern
      //**************************************************************************************************//
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
        ellipse(posXpowerUps,/*7*height/100*/60,90,90);
        //ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,/*7*height/100*/60,90,90);
        fill(40);
        arc(posXpowerUps,/*7*height/100*/60,90,90,-PI/2,radians(end)-PI/2,PIE);
        //arc(player.location.x + translateDistance -13*height/100 /*+ width / 2 - translateDistance*/,/*7*height/100*/60,90,90,-PI/2,radians(end)-PI/2,PIE);
        //arc(player.location.x /*+ width / 2 - translateDistance*/,8*height/100,100,100,0,2*PI,PIE);
        fill(255,150,0);
        //text("STAIRS", player.location.x + translateDistance -13*height/100/*+ width / 2 - translateDistance*/, 4*height/100  /*125*/);
        stroke(255,150,0);
        strokeWeight(2);
        
        //stroke();
        fill("#454547");
        ellipse(posXpowerUps,/*7*height/100*/60,25,25);
        //ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,/*7*height/100*/60,25,25);
        noFill();
        ellipse(posXpowerUps,/*7*height/100*/60,90,90);
        //ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,/*7*height/100*/60,90,90);
        noStroke();
        
        //if (millis() < tiempoInicio + tiempoEspera + extraTime) {
  
        if (millis() < tiempoInicio + demandingWaitTime + extraTime) {
          let startedPoint1=0;
          for (let j = stairsPatternDemanding[indexStairsPattern], h = 1; j < amountStairsDemanding/3 + stairsPatternDemanding[indexStairsPattern]; j++, h++) {
            platStatus=1;
            platforms[j].easing();
            platforms[j].targetY =  15*height/100 + (h * 25);
            startedPoint1=15*height/100 + (h * 25);
          }
          //console.log("Cuenta: "+amountStairsDemanding/2 + stairsPatternDemanding[indexStairsPattern]);
          let startedPoint2=0;
          for (let k = stairsPatternDemanding[indexStairsPattern] + amountStairsDemanding/3, m = 1; k < 2*amountStairsDemanding/3 + stairsPatternDemanding[indexStairsPattern]; k++, m++) {  
            platStatus=1;
            platforms[k].easing();
            platforms[k].targetY =  startedPoint1 - (m * 25);
            startedPoint2=startedPoint1 - (m * 25);
          }
          for (let k = stairsPatternDemanding[indexStairsPattern] + 2*amountStairsDemanding/3, m = 1; k < amountStairsDemanding + stairsPatternDemanding[indexStairsPattern]; k++, m++) {   
            platStatus=1;
            platforms[k].easing();
            platforms[k].targetY =  startedPoint2 + (m * 25);
          }
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
  
      //**************************************************************************************************//                      
      //                            4.  Demanding Gaming - Flat Pattern
      //**************************************************************************************************//
      
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
        ellipse(posXpowerUps,/*6*height/100*/60,90,90);
        //ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,/*6*height/100*/60,90,90);
        fill(40);
        arc(posXpowerUps,/*6*height/100*/60,90,90,-PI/2,radians(end)-PI/2,PIE);
        //arc(player.location.x + translateDistance -13*height/100 /*+ width / 2 - translateDistance*/,/*6*height/100*/60,90,90,-PI/2,radians(end)-PI/2,PIE);
        //arc(player.location.x /*+ width / 2 - translateDistance*/,8*height/100,100,100,0,2*PI,PIE);
        fill(255,150,0);
        //text("FLAT", player.location.x + translateDistance -13*height/100/*+ width / 2 - translateDistance*/, 4*height/100  /*125*/);
        stroke(255,150,0);
        strokeWeight(2);
        fill("#454547");
        //stroke();
        ellipse(posXpowerUps,/*6*height/100*/60,25,25);
        //ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,/*6*height/100*/60,25,25);
        noFill();
        ellipse(posXpowerUps,/*6*height/100*/60,90,90);
        //ellipse(player.location.x + translateDistance -13*height/100  /*+ width / 2 - translateDistance*/,/*6*height/100*/60,90,90);
        noStroke();
  
        if (millis() < tiempoInicio + demandingWaitTime + extraTime) {
          //if( flatPatternDemanding[indexFlatPattern] + amountFlatPlatforms < amountPlatforms - amountCutEndPlats ){
            for (let k = flatPatternDemanding[indexFlatPattern]; k < flatPatternDemanding[indexFlatPattern] + amountFlatDemanding; k++) {  //platforms.length   
              //platforms[k].blocked = platStatus;
              //platforms[k].blocked = true;
              //console.log("k: "+ k);
              //platforms[k].rh = (60 - (15 * 3)) * height / 100;
  
              platStatus=1;
              
              //platforms[k].rh =  45*height/100;
  
              platforms[k].easing();
              platforms[k].targetY =  45*height/100;
            }
          //}else{
          //  console.log("There are no enough platforms for the flat pattern");
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
  
      /*
      fill(250,250,0);
      rect(player.location.x + translateDistance -13*height/100,height/4,50,50);
      rect(player.location.x - translateDistance +90*height/100,height/4,80,80);
      */ 
  
      //previousPlat=
      fill(255);
      textSize(55);
      textAlign(CENTER,TOP);
      //console.log("Points AQUI DEMANDING: "+points);
      textStyle(NORMAL);
      text( points+negativePoints , posXpowerUps + 40*width/100 , 40 );
      //text(points+negativePoints, player.location.x-translateDistance +90*width/100, 40 );
      textSize(15);
      textStyle(BOLD);
      text("Points", posXpowerUps + 40*width/100, 20 );
      //text("POINTS", player.location.x - translateDistance +90*width/100, 20 );
      if ( mouseX > 7*width / 8 && mouseY > 5 && mouseY < height/7 ) {
        textAlign(RIGHT);
        /*
        text("Number Current Platform: "+numCurrentPlat,player.location.x-translateDistance+width-20,110);
        text("Game time:   " + Math.floor( ( ( millis()/1000) % 3600  / 60 ) )  +":"+ Math.floor( ( (millis()/1000) %3600) % 60 ) , player.location.x - translateDistance+width-20, 50);
        //text("Game time: " + Math.round(millis() / 1000), player.location.x - translateDistance+width-20, 50);
        text("Longest time on a platform: " + longestTime, player.location.x - translateDistance+width-20, 80);
        fill(250,200,0);
        text("Case Number: " + caseNumber, player.location.x - translateDistance+width-20, 380);
        text("Missed Opportunities: "+missedOpportunities, player.location.x - translateDistance+width-20, 410);
        //text("Case Number: "+caseNumber, player.location.x - translateDistance+width-20, 440);
        */
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
  
    if(screenMuseFlow=="goalAchieved"){
      //console.log("ENTRa goal achieved");
      background(0);
      textAlign(CENTER);
      textSize(20);
      fill(255);
      
  
      text("You have finished the video game.",translateDistance+height/2,150);
      text("Please wait!", translateDistance+height/2,250);
      text("The system is storing the data...", translateDistance+height/2,350);
      
      if(resultDB1 && resultDB2){
        screenMuseFlow="end";
      }
    }
    if(screenMuseFlow=="end"){
      background(0);
      if(document.querySelector(".questionary")){
        document.querySelector(".questionary").style.display='block';
      }
      text("Please click on the \"Next\" button on the top!", translateDistance+height/2,250);
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
        startTimeMessage=millis()+1000;
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
  
    /*
    if(variables){
      if(screen=="undemandingTraining" || screen=="demandingTraining" || screen=="undemanding" || screen=="demanding" || screen=="baseline"){
        fill(0);
        textSize(15);
        textAlign(LEFT);
        text("Fading probes (milliseconds) ",posXpowerUps-width/4,150);
        if(fadingProbeWaiting==true){
          text("Current fading: "+(Math.round(millis()-tiempoInicioFading))+"    ",posXpowerUps-width/4,170);
        }
        for(let i=0;i<fadingProbeResults.length;i++){
          text("#"+i+":   "+Math.round(fadingProbeResults[i]),posXpowerUps-width/4,(170+(i+1)*22));
        }
      }
    }
    */
  
    if(baselineWating &&  screenMuseFlow=="baseline"){
      text(" Well done! ",posXpowerUps,200);
    }
    //console.log("Baseline: "+baselineWating);
    //console.log("FadingProbeWaiting: "+fadingProbeWaiting);
    }else{
        textAlign(CENTER);
        fill(200);
        textSize(30);
        textStyle(NORMAL);
        text("MuseFlow is not available for mobiles since it needs a keyboard.",width/2,height/2-70);
        text("We invite you to open MuseFlow on a laptop or desktop computer.",width/2,height/2);
        textStyle(BOLD);
        text("See you there!",width/2,height/2+120);
    }
  }
  //**************************************************************************************************//
  //**************************************************************************************************//                              
  //                               End DRAW 
  //**************************************************************************************************//
  //**************************************************************************************************//
  