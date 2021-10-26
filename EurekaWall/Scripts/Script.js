/*
	INSPIRATIONAL WALL
*/

// GENERAL
var defaultCanvas;
var videoAustralia;
var videoAguahoja;
var worldWebcam;
var brasovWebcam;
var tokyoWebcam;
var hongkongWebcam;
var imageAustralia;
var imageGardening;

var showingCursor = true;
var waitress;
var eraserDragging=false;
var shapeSelected=0;
var colorSelected=0;
var bordeAbajo;
var onOffBar=false;
var colores=[];
var generalMode=1;
var colorButtons="#EFD8B9";
/*var backgroundColor="#2C302F";*/
var backgroundColor="#1E1E1E";

// TOOLS
var augmentedPixels=[];

// CLOCK
let cx, cy;
let cxNY, cyNY;
let cxWeather, cyWeather;
let secondsRadius;
let minutesRadius;
let hoursRadius;
let clockDiameter;  

// MENU
var pixelList=[];
let pixelGrid;
var screen = 0;
let cols=10;
let rows=10;
let cols2=0;
let rows2=0;
var initialTimePortalTransition;
var delayPortalTransition;
var initialTimeTakenPortal;
var transitionTriggerPortal;
var sizePixel=50;   // laptop testing 130  //50
var menuButtonsDiameter=160;  // ORIGINAL 160
var roundedTextRadius=menuButtonsDiameter/2;

// 	WINDOW TO ANOTHER WORLD
/*
var rot;
var speed;
var colour;
var state;
var mouseDragged;
var showCountry;
var initialTime=0.0;
var initialTimeTaken=false;

var compassTextOpacity=54;
var velCompassTextOpacity=3;
var showTextCompass=true;
*/
// FORTUNE WHEEL
var playAguahoja=true;
var isTriviaSubjectCalculated=false;
var triviaSubject=1;

// ARTWORK
var artistList=[];
var amountArt=4;
var numArtist=-1;
var randomArtist=0;
var rotArt=0;
var photo1;
var aumento;
var step=0;

// MENU
var firstIconX;
var firstIconY;
var secondIconX;
var secondIconY;
var thirdIconX;
var thirdIconY;

// GENERATIVE ART
let damping = 1;
let group= [];
let group2= [];
let palette =["#8ecae6","#219ebc","#023047","#ffb703","#fb8500"];
let crossPalette =['#FE9601','#686491','#D93240','#0B99BC'];
let rectPalette = ["#9b5de5","#f15bb5","#fee440","#00bbf9","#00f5d4"];
var canvas;

var showShapes=false;
var modePencil=false;


function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
}


function preload() {
	
	img1 = loadImage("assets/demo.svg");
	img2 = loadImage("assets/museFlow4.svg");
	img3 = loadImage("assets/particleCanvas.svg");
	img4 = loadImage("assets/balconity.svg");
	img5 = loadImage("assets/grid.svg");
	
	//photo1 = loadImage('Assets/Images/woman1.png');
	//photo1 = loadImage("file:///C:/Users/juanf/OneDrive/Documentos/PhD/Interactive%20Wall/Assets/Images/woman1.png");
	//photo1= createImg('file:///C:/Users/juanf/OneDrive/Documentos/PhD/Interactive%20Wall/Assets/Images/woman1.png' /*, undefined, 'anonymous'*/);
  preloadMuseFlow();
}

function preloadMuseFlow(){
    //img = loadImage('https://juanolaya.github.io/assets/chair.png');
    undemandingInstructions= loadImage('https://juanolaya.github.io/assets/undemandingInstructions.png');
    demandingInstructions= loadImage('https://juanolaya.github.io/assets/demandingInstructions.png');
    
    if(document.getElementById('caseNum').value!="%caseNumber%"){ 
      caseNumber=document.getElementById('caseNum').value;
      //SoSciTools.submitButtonsHide();
    }else{
      caseNumber=0;  // %2!=0 -> undemanding   //   %2==0 -> demanding
    }
  
    if(document.getElementById('urnRand').value!="%urn%"){ 
      urnRandom=document.getElementById('urnRand').value;
      console.log("Took urnRandom: "+urnRandom);
    }else{
      urnRandom=0;  // %2!=0 -> undemanding   //   %2==0 -> demanding
    }
  
    if(document.querySelector(".questionary")){
      document.querySelector(".questionary").style.display='none';
    }
  
    let urlUndemanding = 'https://gist.githubusercontent.com/JuanOlaya/8a640395d09db4b2ef8220fd510c5c19/raw/19fe558aa2a4e8960832b0aadc581aeded2d539e/platforms-undemanding-gaming.json';
    allPlatforms = loadJSON(urlUndemanding);
    
    let urlDemanding = 'https://gist.githubusercontent.com/JuanOlaya/34efce4dcf723ccb77d14f1f5c996a5c/raw/611d67750c9fd2e6b932886081e9692413c8ef89/DemandingPlatforms.json';
    allPlatformsDemanding = loadJSON(urlDemanding);
  
    let urlUndemandingTraining = 'https://gist.githubusercontent.com/JuanOlaya/49fc53a64026d8c2af4ccccf3eb839ce/raw/0f80791e9f83bb13b32fac046f7eddd0b1146c60/platforms-undemanding-training.json';
    undemandingTrainingJSON = loadJSON(urlUndemandingTraining);
    
    let urlDemandingTraining = 'https://gist.githubusercontent.com/JuanOlaya/93abe3a2db9969062467407499b1f1b9/raw/e2b32722048733d48a0f07aba9ebaf807ee1fba9/platforms-demanding-training.json';
    demandingTrainingJSON = loadJSON(urlDemandingTraining);
  
    let urlBaseline = 'https://gist.githubusercontent.com/JuanOlaya/44dc3efb6a79032174cfb71ff75d30af/raw/cf6c40a857e12c3f336854d91b9b915ea187a963/baseline.json';
    baselineJSON = loadJSON(urlBaseline);
}

function make2DArray(cols,rows){
	let arr = new Array(cols);
	for(let i=0;i<arr.length;i++){
		arr[i]= new Array(rows);
	}
	return arr;
}



function setup() {
	canvas = createCanvas(windowWidth,windowHeight);
	canvas.position(0,0);	  
	canvas.style("z-index",0);
	// GENERAL
	waitress = millis() + 1000; 
	//ubuntuFont = loadFont("Assets/Fonts/Ubuntu-Medium.ttf");
	bordeAbajo=height-3*sizePixel/2;
	colores=["#484B78","#E4AA2D","#C62F40","#58875D","#D0692E",backgroundColor];

	//textFont('Ubuntu');
	//textFont('IBM Plex Sans');
	//textFont('Monda');
	//textFont('Roboto');
	textFont('Work Sans');

	
	defaultCanvas=document.getElementById("defaultCanvas0");
	
  
  //defaultCanvas.style.zIndex = "0";
	/*
	videoAustralia=document.getElementById("videoAus");
	videoAustralia.style.display = "none";  					// none-> element to not be displayed
	videoAguahoja=document.getElementById("aguahojaVideo");
	videoAguahoja.style.display = "none";

	imageAustralia=document.getElementById("Australia");
	imageAustralia.style.display = "none";
	imageGardening=document.getElementById("Gardening");
	imageGardening.style.display = "none";
	*/

	/*
	worldWebcam=document.getElementById("worldCam");
	worldWebcam.style.display = "none";

	brasovWebcam=document.getElementById("brasovCam");
	brasovWebcam.style.display = "none";
	//brasovWebcam.style.zIndex = "-1";

	tokyoWebcam=document.getElementById("tokyoCam");
	tokyoWebcam.style.display = "none";

	hongkongWebcam=document.getElementById("hongKongCam");
	hongkongWebcam.style.display = "none";
	*/

	// MENU
	initialTimePortalTransition=0;
	delayPortalTransition=2400;
	initialTimeTakenPortal=false;
	transitionTriggerPortal=false;

	cols=Math.round(16*(width/20)/32);
	rows=Math.round(19*(height/20)/32);
	
	pixelGrid=make2DArray(cols,rows);
	
	for(let x=width/20,i=0;x<cols;x=x+32,i++){
		for(let y=height/20,j=0;y<rows;y=y+32,j++){
			//pixelGrid[i][j].push(new Pixel(x,y,30)); 
        }
	}

	cols2=Math.round(38*(width/40));
	rows2=Math.round(36*(height/40));
	
	/*
	for(let x=width/25;x<cols2;x=x+45){
		for(let y=width/25;y<rows2;y=y+45){
			pixelList.push(new Pixel(x,y,33));
        }
	}
	*/
	let gap=7;
	for(let x=width/18;x<cols2;x=x+(sizePixel+gap) ){
		for(let y=width/25;y<rows2;y=y+(sizePixel+gap) ){
			pixelList.push(new Pixel(x,y,sizePixel));
        }
	}
	
	// WINDOW TO ANOTHER WORLD
	rot=3*PI/2;
	speed=0.0;
	colour='#B1B7D1';
	contador=0;
	state=0;
	showCountry=false;

	// FORTUNE WHEEL
	accelRotFort=PI/300;
  	pieColors[0] = color("#006495");     
	pieColors[1] = color("#3D5A80");  
	  
	//photo1 = loadImage("/Assets/Images/woman1.png");
  
	//photo1 = loadImage("Assets/Images/woman1.png");

	for(let i=0; i<amount; i++){
		piePieceList.push(new PiePiece( (2*PI/amount)*(i) , (2*PI/amount)*(1+i) , titles[i] , pieColors[i%2] ,photo1 ));
	}
	// ARTWORK
	/*
	for(let i=0;i<amountArt;i++){
		artists.push( new Artist( (1+i*2)*width/(amount*2) , height/2));
	}*/
	aumento = random(100);

	artistList.push( new Artist( 9*width/50, 13*height/50 , "ANNA SCHMIDT" , "Plastische Künstlerin") );
	artistList.push( new Artist( 9*width/50, 37*height/50 , "ALEX MÜLLER" , "Maler" ) );
	artistList.push( new Artist( 30*width/50, 13*height/50 , "KAROLINE BECKER" , "Fotografin ") );
	artistList.push( new Artist( 30*width/50, 37*height/50 , "THOMAS KAUFMANN" , "Elektronischer Künstler" ) );

	randomArtist=Math.round(random(0,3));
	
	tiempoInicio = 0;
  	tiempoEspera = 700; // 
	tiempoInicio2 = 0;
  	tiempoEspera2 = 6950; //  segundos

	let radius = min(width, height) / 5;
	secondsRadius = radius * 0.71;
	minutesRadius = radius * 0.6;
	hoursRadius = radius * 0.5;
	clockDiameter = radius * 1.7;

	cx = width / 4;
	cy = height / 4;

	cxNY = 3*width / 4;
	cyNY = 3*height / 4;

	cxWeather = 2*width / 4;
	cyWeather = height / 4;

	// AugmentedPixel
	/*
	for(let x=0;x<=width;x=x+6){
        for(let y=0;y<=height;y=y+6){
            augmentedPixels.push(new AugmentedPixel(x,y) );
        }
    }
	console.log("augmentedPixels.length: "+augmentedPixels.length);
	*/

	// MENU
	firstIconX=width/4;
	firstIconY=height/2;
	secondIconX=width/2;
	secondIconY=height/2;
	thirdIconX=3*width/4;
	thirdIconY=height/2;

	accelRotFort = PI / 300;
	pieColors[0] = color("#3C3C68");
	pieColors[1] = color("#314991");

	//photo1 = loadImage("/Assets/Images/woman1.png");

	//photo1 = loadImage("Assets/Images/woman1.png");

	for (let i = 0; i < amount; i++) {
		piePieceList.push(
		new PiePiece(
			((2 * PI) / amount) * i,
			((2 * PI) / amount) * (1 + i),
			titles[i],
			pieColors[i % 2],
			i
		)
		);
	}

  setupMuseFlow();
}

function setupMuseFlow(){
  //createCanvas(windowWidth, windowHeight);
  //createCanvas(1024, 768);
  //createCanvas(1200, 550);
  console.log(" baseline length: "+baselineJSON.platforms.length  );
  //createCanvas(windowWidth, 768);
  
    //museFlowCanvas = createCanvas(windowWidth, windowHeight);

  //museFlowCanvas.style.display= "none";

  //canvas.style();
  
    //frameRate(30);


  translateDistance = width / 4;
  player = new Player();
  highLightColor= color(200,0,0);
  
  /*
  if(amountPlatforms>=allPlatforms.platforms.length){
    amountPlatforms=allPlatforms.platforms.length;
  }
  */
  if( /*caseNumber%2!=0*/ urnRandom==0 ){
    condition="undemanding";
    amountPlatforms=156;
    amountTrainingPlatforms = 32;
  }

  if( /*caseNumber%2==0*/ urnRandom==1 ){
    condition="demanding"
    amountPlatforms=203;  //292   336
    amountTrainingPlatforms = 42;
  }
  goalFlagNum=(amountPlatforms-1)-amountCutEndPlats;
  goalFlagTraining=(amountTrainingPlatforms-1)-amountCutEndPlats;

  //************************************************* */
  //      0. BASELINE (setup)
  //************************************************* */
  let countDistanceX = 0;
  for (let i = 0; i < baselineJSON.platforms.length; i++) {
    gap=15;
    let platformTemp = new Platform(countDistanceX, i,baselineJSON.platforms[i].speed, baselineJSON.platforms[i].width,"baseline");
    baselinePlatforms.push(platformTemp);
    countDistanceX = countDistanceX + platformTemp.rw + gap; // 130 = gap between platforms
  }
  //widthGame = countDistanceX - gap;


  // ** UNDEMANDING CONDITION ** //
  if( condition=="undemanding" ){
    //condition="undemanding";
    //amountPlatforms=156;

    //************************************************* */
    //      1. UNDEMANDING GAMING (setup)
    //************************************************* */
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
      let platformTemp = new Platform(countDistanceX, i,allPlatforms.platforms[i].speed, allPlatforms.platforms[i].width, "gaming");
      platforms.push(platformTemp);
      countDistanceX = countDistanceX + platformTemp.rw + gap; // 130 = gap between platforms
    }
    widthGame = countDistanceX - gap;
    
    for(let j=0;j<horizontalPlatformsLocation.length;j++){
      if( horizontalPlatformsLocation[j] <amountPlatforms){  // horizontal platform
        platforms[ horizontalPlatformsLocation[j] ].horizontalPlatform=true;
      }
    }

    for(let i=0;i<flatPattern1.length; i++){
      
      if( flatPattern1[i] <amountPlatforms){
        //if(i==81){
          console.log("ENTRA "+flatPattern1[i]+" amountPlatforms "+amountPlatforms);
        //}
        platforms[flatPattern1[i]].rh=height/2;
      }
    }
  
    for(let i=0;i<stairsPattern1.length; i++){
      if( stairsPattern1[i] <amountPlatforms){
        platforms[stairsPattern1[i]].rh=-(13) + (60*height/100);
      }
    }
    platforms[47].waitingHorizontalPlatform=true;

    //************************************************* */
    //     2. UNDEMANDING TRAINING (setup)
    //************************************************* */

    let countDistanceXTraining = 0;
    
    for (let i = 0; i < amountTrainingPlatforms; i++) {
      gap=15;
      /*
      for(let j=0;j<horizontalPlatformsLocation.length;j++){
        if(horizontalPlatformsLocation[j]==i){
          gap=800;
        }
      }
      */
      let platformTemp = new Platform(countDistanceXTraining, i,undemandingTrainingJSON.platforms[i].speed, undemandingTrainingJSON.platforms[i].width,"training");
      trainingPlatforms.push(platformTemp);
      countDistanceXTraining = countDistanceXTraining + platformTemp.rw + gap; // 130 = gap between platforms
    }
    //widthGame = countDistanceXTraining - gap;
    /*
    for(let j=0;j<horizontalPlatformsLocation.length;j++){
      if( horizontalPlatformsLocation[j] <amountTrainingPlatforms){  // horizontal platform
        platforms[ horizontalPlatformsLocation[j] ].horizontalPlatform=true;
      }
    }
    */
    /*
    for(let i=0;i<flatLocationDemanding.length; i++){
      
      if( flatLocationDemanding[i] <amountTrainingPlatforms){
        //if(i==81){
          console.log("ENTRA "+flatLocationUndemanding[i]+" amountTrainingPlatforms "+amountTrainingPlatforms);
        //}
        trainingPlatforms[flatLocationUndemanding[i]].rh=height/2;
      }
    }
    */
    //
    //************************************************* */
    /*
    for(let i=0;i<stairsPattern1.length; i++){
      if( stairsPattern1[i] <amountPlatforms){
        platforms[stairsPattern1[i]].rh=-(13) + (60*height/100);
      }
    }
    platforms[47].waitingHorizontalPlatform=true;
    */
  }

   //** DEMANDING CONDITION ** //
  if( condition == "demanding"){
    //condition="demanding";
    //amountPlatforms=336;

    //************************************************* */
    //      3. DEMANDING GAMING (setup)
    //************************************************* */
    
    speedMin=7;
    speedMax=9;

    let countDistanceX = 0;
    for (let i = 0; i < allPlatformsDemanding.platforms.length /*amountPlatforms*/; i++) {
      gap=138;
      for(let j=0;j<horizontalPlatformsLocationDemanding.length;j++){
        if(horizontalPlatformsLocationDemanding[j]==i){
          gap = 500;
        }
      }
      let platformTemp = new Platform(countDistanceX, i,allPlatformsDemanding.platforms[i].speed, allPlatformsDemanding.platforms[i].width, "gaming");
      platforms.push(platformTemp);
      countDistanceX = countDistanceX + platformTemp.rw + gap; // 130 = gap between platforms
    }
    widthGame = countDistanceX - gap;

    for(let i=0;i<flatPatternDemanding.length; i++){
      if(flatPatternDemanding[i]<allPlatformsDemanding.platforms.length){
        platforms[flatPatternDemanding[i]].rh=45*height/100;
      }
    }
    
    for(let i=0;i< stairsPatternDemanding.length; i++){
      if(stairsPatternDemanding[i]<allPlatformsDemanding.platforms.length){
        platforms[stairsPatternDemanding[i]].rh=15*height/100 + (25);
      }
    }

    for(let j=0;j<horizontalPlatformsLocationDemanding.length;j++){
      if( horizontalPlatformsLocationDemanding[j] <allPlatformsDemanding.platforms.length){  // horizontal platform
          platforms[horizontalPlatformsLocationDemanding[j]].horizontalPlatform=true;
      }
    }

    //************************************************* */
    //     4. DEMANDING TRAINING (setup)
    //************************************************* */

    let countDistanceXTraining = 0;
    
    for (let i = 0; i < amountTrainingPlatforms; i++) {
      gap=138;
      /*
      for(let j=0;j<horizontalPlatformsLocation.length;j++){
        if(horizontalPlatformsLocation[j]==i){
          gap=800;
        }
      }
      */
      let platformTemp = new Platform(countDistanceXTraining, i,demandingTrainingJSON.platforms[i].speed, demandingTrainingJSON.platforms[i].width, "training");
      trainingPlatforms.push(platformTemp);
      countDistanceXTraining = countDistanceXTraining + platformTemp.rw + gap; // 130 = gap between platforms
    }
    //widthGame = countDistanceXTraining - gap;
    
    /*
    for(let j=0;j<horizontalPlatformsLocation.length;j++){
      if( horizontalPlatformsLocation[j] <amountTrainingPlatforms){  // horizontal platform
        platforms[ horizontalPlatformsLocation[j] ].horizontalPlatform=true;
      }
    }
    */
    /*
    for(let i=0;i<flatLocationDemanding.length; i++){
      
      if( flatLocationDemanding[i] <amountTrainingPlatforms){
        //if(i==81){
          console.log("ENTRA "+flatLocationDemanding[i]+" amountTrainingPlatforms "+amountTrainingPlatforms);
        //}
        trainingPlatforms[flatLocationDemanding[i]].rh=height/2;
      }
    }
    */
    //
    //************************************************* */
  
    /*
    for(let i=0;i<stairsPattern1.length; i++){
      if( stairsPattern1[i] <amountPlatforms){
        platforms[stairsPattern1[i]].rh=-(13) + (60*height/100);
      }
    }
    platforms[47].waitingHorizontalPlatform=true;
    */

  }

  for(let i=0;i<platforms.length;i++){
    if(i+1<platforms.length){  // Next platform
      platforms[i].nextPlatform=platforms[i+1].rx;
    }
    if(i-1>=0){               // Previous platform
      platforms[i].previousPlatform = platforms[i-1].rx+platforms[i-1].rw;
    } 
  }

  tiempoInicio = 0;
  tiempoEspera = 20000;         //  milliseconds
  demandingWaitTime = 25000;   //  milliseconds

  question1X = width / 2;
  question2X = width / 2;
  question3X = width / 2;
  question4X = width / 2;
  question5X = width / 2;
  question6X = width / 2;
  question7X = width / 2;
  question8X = width / 2;
  question9X = width / 2;
  question10X = width / 2;



  console.log("caseNumber:  "+ caseNumber);
  console.log("Condition:  "+ condition);
  console.log("amountPlatforms:  "+ platforms.length);
  console.log("amount Platforms JSON (undemanding):  "+allPlatforms.platforms.length);
  console.log("amount Platforms JSON (demanding):  "+allPlatformsDemanding.platforms.length);
  console.log("goal flag location :  "+goalFlagNum);
  //console.log("CaseNumber: "+ caseNumber);
  //console.log("81 plat"+platforms[81].ry);
  endDate = new Date().toISOString().slice(0, 10);
  var date = new Date();
  endHour = date.getHours()+":"+date.getMinutes();
  //console.log(endDate);
  //console.log(endHour);

}



function draw() {
	//console.log("StatusWebcam: "+statusWebcam);
	//console.log("showShapes: "+showShapes);

	//console.log("Screen: "+screen);

	if(generalMode==1){
		inspirationWall();
	}

	if(generalMode==2){
		background("#3F1801");
	}
	fill(200,200,200);
	//ellipse(50,height-50,57,57);
}

function homeButton(){
	//noFill();
	//strokeWeight(2);
	//stroke(255,255,255,50);
	//rect(width-2*height/12-5,10*height/12,height/6,height/6-5);
	fill(230,0,126);
	//textSize(20);
	//textAlign(CENTER,CENTER);
	noStroke();
	//text("HOME",width-height/12,11*height/12);
	for(let i=0,x=375*width/400;i<4;i++,x=x+20){
		for(let j=0,y=358*height/400 ;j<3;j++,y=y+20){
			ellipse(x,y,10,10);
		}
	}
}

function home() {
	//window.open('index.html');
	screen=0;
	videoAguahoja.currentTime = 0;
	videoAguahoja.pause();

	videoAguahoja.style.display = "none";
	document.getElementById("aguahojaHeading").style.display = "none";
	defaultCanvas.style.display = "block";
	
	isTriviaSubjectCalculated=false;
	if(triviaSubject<3){
		//console.log("flaggg");
		triviaSubject++;
	}else{
		triviaSubject=1;
	}
	//videoAguahoja.pause();
	//location.replace("index.html")
}

function homeInstallationArt() {
	//window.open('index.html');
	screen=0;

	defaultCanvas.style.display = "block";
	document.getElementById("installationArtDiv").style.display = "none";
    document.getElementById("styleDotsInstallationArt").style.display = "none";
	
	isTriviaSubjectCalculated=false;
	if(triviaSubject<3){
		//console.log("flaggg");
		triviaSubject++;
	}else{
		triviaSubject=1;
	}
	//videoAguahoja.pause();
	//location.replace("index.html")
}


function pause(){
	videoAguahoja.pause();
	if(playAguahoja){
		playAguahoja=false;
	}else{
		playAguahoja=true;
	}	
}

//function keyPressed() {
function keyPressedSwarmCanvas(){
	if(keyCode === 49 ){
		generalMode=1;		
	}
	if(keyCode === 50 ){
		generalMode=2;		
	}
  /*
	if(keyCode === 51 ){
		modePencil=!modePencil;		
	}
  */
}
/*
function mousePressed(){
	console.log("Entra mousePressed");
	
}

function mouseReleased(){
	showShapes=false;
}
*/

/*
// 1. Create the button
var button = document.createElement("button");
button.innerHTML = "Do Something";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

// 3. Add event handler
button.addEventListener ("click", function() {
alert("did something");
});
*/


/*
// 1. Create the buttonTrace
var buttonTrace = document.createElement("button");
buttonTrace.innerHTML = "Trace";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(buttonTrace);

// 3. Add event handler
buttonTrace.addEventListener ("click", function() {
	backgroundStatus=!backgroundStatus;
});

// 1. Create the buttonPause
var buttonPause = document.createElement("button");
buttonPause.innerHTML = "Pause";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(buttonPause);

// 3. Add event handler
buttonPause.addEventListener ("click", function() {
	pausa=!pausa;
});
*/
