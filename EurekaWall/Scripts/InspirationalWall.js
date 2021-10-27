function inspirationWall(){
    //console.log("colorSelected: "+colorSelected);
    var currtime = millis();
		//console.log(showingCursor);
		//console.log(screen);
		//console.log("shapeSelected: "+shapeSelected);
		if ((mouseX != pmouseX) || (mouseY != pmouseY)) { // if mouse moved,
			if (!showingCursor) { // and if they're hidden,
			cursor(); // show pointer and relevant image
			showingCursor = true; 
			}
			if (waitress < currtime + 1000) { // if not in first 10 seconds,
			waitress = currtime + 1000; // hide stuff 2 seconds from now
			}
		} else { // mouse has not moved
			if (showingCursor) {
			if (currtime > waitress) { // they've been visible long enough,
				noCursor(); 
				showingCursor = false; // so hide pointer and images
			}
		}
		}

		if(screen==0){  // MENU

			background(backgroundColor);
			defaultCanvas.style.display = "block";
			balconitySection.style.display = "none";
			loading.style.display = "none";
			
			//homeEureka.style.display = "block";
			//videoAustralia.style.display = "none";
			//videoAguahoja.pause();

			//paintingPixels();
			//menu();
			menu2();
			
			//pixelWave();
			fill(0);
		}
		
		/*
		if(screen==10 || screen==11 || screen==12 ){ // COMPASS
			windowAnotherWorld();
		}
		*/
		if(screen==10 || screen==11 || screen==12 ){ // COMPASS
			console.log("screen10");
			paintingPixels();
			//tools();
		}

		if(screen==20){ // GENERATIVE ART
			
			/*
			if(isTriviaSubjectCalculated==false){
				//triviaSubject=Math.round(random(1,2));
				isTriviaSubjectCalculated=true;
			}
			
			background("#B91E55");    
			fortuneWheelShow()
			fortuneWheelMovement();	
			homeButton();
			*/
			//background(backgroundColor);
			
			generativeArt();
			//console.log("mode3: "+mode3);
			
			//console.log("showShapes: "+showShapes);
			//console.log("GENERATIVE ART");
		}

		if(screen==21){ // FORTUNE WHEEL 21 - GARDENING
			
			/*
			if(triviaSubject==1){
				materialEcology();
			}
			if(triviaSubject==2){
				livingRootBridge();
			}
			if(triviaSubject==3){
				installationArt();
			}
			*/
		}

		if(screen==30 ){ // WINDOW TO ANOTHER WORLD
			//background("#00203A");  //#00203A  FFFFFF
			//artwork();
			//homeButton(); 
			//background(backgroundColor);
			//console.log({screen});
			//background(backgroundColor);
			//camaraEnVivo();
		}

		if(screen==31){ // PROFILE
			background("#FFFFFF");
			profile1();
		}

		//fill(255);
		//text(stateFort,30,30);
		//textSize(20);
		//text("EraserDragging: "+eraserDragging,150,20);

		textSize(20);
		fill(255);
		//text("Touches Length: "+touches.length+"    Status: "+pixelList[0].hasChangedStatus,150,20);

		if(screen==40){

			museFlowMain();
			
		}
}



