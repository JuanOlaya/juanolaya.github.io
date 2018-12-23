var pointList = [];
var tiempoEspera;
var tiempoInicio;
//var x1;
//var x2;
var figura;
var entro;
var xx1;
var entra;

function setup() {
  createCanvas(windowWidth, windowHeight);
  //background(255);
  tiempoInicio = 0;
  figura=true;
  entro=true;
	entra=false;
  for (var i=0; i<15; i++) {
    pointList[i]=(new Point(random(width-20), random(height-20), random(-0.01, 0.01), 
      random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01) ));
  }
  //x1=random(width);
  //x2=random(width);
  xx1=new Point(random(width-20), height-1, random(-2, 2), 0, 0, 0);
}

function draw() {
  background(0,0,0,30);
	//background(255);
  xx1.mover();
	if(mouseIsPressed){
  	tiempoEspera=map(mouseY, 0,height,0,500);
	}
	else{
		tiempoEspera=1000;
	}
  //tiempoEspera=mouseY;
  //println(tiempoEspera);
  for (var i=0; i<pointList.length; i++) {
    pointList[i].mover();
   
    fill(0); 
    
    stroke(255,0,255);

    strokeWeight(3);
      
    line(pointList[i].location.x, pointList[i].location.y, xx1.location.x , height-1);

    if (millis() - tiempoInicio > tiempoEspera) {
			if(entra==false){
      	xx1.location.x=random(width/3);
				entra=true;
			}
			else{
				xx1.location.x=random((width/3)*2,width);
				entra=false;
			}
      xx1.velocity.x=random(-1, 1);
      tiempoInicio = millis();
      }
			
    }
  //print(tiempoEspera);
}