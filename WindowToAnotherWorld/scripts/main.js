let counter=0;

function setup(){
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.position(0,0);	  
    canvas.style("z-index",0);
    brasovWebcam=document.getElementById("brasovCam");
	brasovWebcam.style.display = "none";
}

function draw(){
    background(30,30,30,0);

    noStroke();
    fill(255);
    rectMode(CENTER);
    rect(120,100,100,50,30);

    fill("#E5E73C");
    strokeWeight(0);
    ellipse(100-10,100-30,50,50);

    textAlign(CENTER,CENTER);
    textSize(30);
    text("24°",105,155);

    /*
    counter=counter+0.8;
    fill("#E5E73C");
    rect(counter,height/2,100,50);
    */
    
    brasovWebcam.style.display = "block";
    
    /*
    noFill();
    stroke("#E67A01");   // #EFD8B9
    strokeWeight(20);
    rectMode(CENTER);
    rect(width/2,height/2,1230+19,685+19,300);
    */
    strokeWeight(44);
    stroke("#E67A01");
    line(width/2-382,height/2+352, width/2+382,height/2+352);

    strokeWeight(30);
    stroke("#E67A01");
    line(width/2-410,height/2+337, width/2+410,height/2+337);

    textSize(30);
    textAlign(CENTER,CENTER);
    textStyle(BOLD);
    fill("#1E1E1E");
    noStroke();
    text("Brașov, Romania",width/2,height/2+357);
    
    /*
    noFill();
    stroke("#E67A01");    //  #DE3D87
    strokeWeight(33);
    rectMode(CENTER);
    rect(width/2,height/2,1230+45,685+45,300);
    */

    /*
    noFill();
    stroke("#1E1E1E");    // DC3029
    strokeWeight(30);
    rectMode(CENTER);
    rect(width/2,height/2,1230+90,685+90,300);
    
    stroke("#1E1E1E");
    strokeWeight(30);
    rectMode(CENTER);
    rect(width/2,height/2,1230+130,685+130,300);

    stroke("#1E1E1E");
    strokeWeight(70);
    rectMode(CENTER);
    rect(width/2,height/2,1230+200,685+200,300);
    */
    
}