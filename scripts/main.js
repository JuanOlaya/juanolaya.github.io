/*
	***** INHERITANCE + ASYNCHRONOUS *****
	#OOP #Example #AbstractClass #SuperClass
	#ConcreteClass #SubClass
	by Juan Olaya
  https://juanolaya.github.io/
*/

var carListVertical = [];
var carListHorizontal = [];

var tiempoEspera;
var tiempoInicio;
var status = 1;
var running=true;
let speed = 1;
let diameter=50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for (let i = 0; i < width/8; i++) {
    carListVertical.push(new VerticalCar(i * 10 + 5 ,random(height),0,speed,color("#FE9601")));
  }

  for (let i = 0; i < height/8; i++) {
    carListHorizontal.push(new HorizontalCar(random(width), i * 10, speed, 0, color("#67759D")));
  }

  tiempoInicio = 0;
  tiempoEspera = 1500; // 3 segundos

  background("#301F33");
  frameRate(50);
}

function draw() {
  if(running==true){
		if (millis() - tiempoInicio > tiempoEspera) {
			background("#301F33");
			tiempoInicio = millis();
		}


			if (status == 1 || status == 2) {
				for (let i = 0; i < carListVertical.length; i++) {
					carListVertical[i].display();
					if (i % 2 == 0) {
						carListVertical[i].moveDown();
					} else {
						carListVertical[i].moveUp();
					}
				}
			}

			if (status == 1 || status == 3) {
				//if (millis() > 3500) {
					for (let i = 0; i < carListHorizontal.length; i++) {
						carListHorizontal[i].display();
						if (i % 2 == 0) {
							carListHorizontal[i].moveRight();
						} else {
							carListHorizontal[i].moveLeft();
						}
					}
				//}
			}
  }

  fill("#3B2640");
  circle(5*width/100+(diameter/2),height-(5*height/100),diameter);
  stroke("#F4F0F9");
  strokeWeight(5);
  line(5*width/100+(diameter/2),height-(5*height/100)+8.5,   5*width/100+(diameter/2)-10 ,height-(5*height/100)-9);
  line(5*width/100+(diameter/2),height-(5*height/100)+8.5,   5*width/100+(diameter/2)+10 ,height-(5*height/100)-9);
  noStroke();
  circle(5*width/100+(diameter/2)+diameter*1.3,height-(5*height/100),diameter);
  stroke("#F4F0F9");
  strokeWeight(5);
  line(5*width/100+(diameter/2)+diameter*1.3,height-(5*height/100)-11,   5*width/100+(diameter/2)+diameter*1.3-10 ,height-(5*height/100)+6.5);
  line(5*width/100+(diameter/2)+diameter*1.3,height-(5*height/100)-11,   5*width/100+(diameter/2)+diameter*1.3+10 ,height-(5*height/100)+6.5);
  noStroke();  
}

function mousePressed() {
	if(dist(5*width/100+(diameter/2)+diameter*1.3,height-(5*height/100),mouseX,mouseY)<diameter/2){
		speed++;
	}else if(speed>0 && dist(5*width/100+(diameter/2),height-(5*height/100),mouseX,mouseY)<diameter/2){
		speed--;
	}
}

function doubleCick(){
	console.log("doubleClick");
}