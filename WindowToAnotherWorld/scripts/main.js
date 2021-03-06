let counter=0;
let arregloCarros=[];


function setup(){
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.position(0,0);	  
    // canvas.style("z-index",0);
    canvas.style("z-index",-2);
    brasovWebcam=document.getElementById("brasovCam");
	  brasovWebcam.style.display = "none";

    for( let i=0; i<120; i++) {  
		let tempCar = new Car(random(height),random(1,7), color(random(170,200),random(70,100),0,200)); 
		arregloCarros.push(tempCar); 
	}
}

function draw(){
    background(10,10,10);

    /*
    //  Weather //
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
    */

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
    /*
    strokeWeight(44);
    stroke("#E67A01");
    line(width/2-382,height/2+352, width/2+382,height/2+352);

    strokeWeight(30);
    stroke("#E67A01");
    line(width/2-410,height/2+337, width/2+410,height/2+337);
    */

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

    for( let i=0; i<arregloCarros.length; i++){
        arregloCarros[i].display();    // 3. Invoca el método display() -> Para mostrar el rectángulo en el sketch
          if(mouseX>width/2){
              arregloCarros[i].moveRight();  // 4. Invoca el método moveRight() -> Para mover el rectángulo a la derecha
          }
          else{
              arregloCarros[i].moveLeft();
          }
      }
    
}

class Car {  
  
	constructor(posY,veloX, colorcito) {
    this.localizacion = createVector(random(width), posY);
		this.velocity = createVector(veloX, 0);
		this.colour = colorcito;  // color('#FE9601')
		//this.colour = color('#7180AC');
		//this.xpos = ;
    //this.ypos = posY;
    this.widthCar=180;
    this.heightCar=6;
		//this.xspeed = veloX;
  }

  display() {
    // El carro es sólo un rectángulo
    noStroke();
    fill(this.colour);
    rect(this.localizacion.x, this.localizacion.y, this.widthCar, this.heightCar,15);
  }
  moveRight() {
    this.localizacion.x = this.localizacion.x + this.velocity.x;
		//this.localizacion.y = this.localizacion.y + this.velocity.y;
    if (this.localizacion.x > width) {
      this.localizacion.x = -180;
    }
  }

  moveLeft() {
    this.localizacion.x = this.localizacion.x - this.velocity.x;
    if (this.localizacion.x < -180) {
      this.localizacion.x = width;
    }
  }
}


//  <iframe class="window" id="brasovCam" src="https://www.youtube.com/embed/G05wmWFDtSo?autoplay=1&mute=1&vq=hd1080" width="1248" height="702"  allow='autoplay'></iframe>

//  <iframe class="window" id="brasovCam" src="https://www.youtube.com/embed/JSEetXHijiE?autoplay=1&mute=1&vq=hd1080" width="1248" height="702"  allow='autoplay'></iframe>

// https://www.youtube.com/embed/JSEetXHijiE