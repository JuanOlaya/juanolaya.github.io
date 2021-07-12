/*
	***** INHERITANCE + ASYNCHRONOUS *****
	#OOP #Example #AbstractClass #SuperClass
	#ConcreteClass #SubClass
	by Juan Olaya
  https://juanolaya.github.io/
*/


var carListVertical = [];
var carListHorizontal = [];
let speedArray = [0, 1 , 10];

var tiempoEspera;
var tiempoInicio;
var status = 1;
var running=true;
let speed = 1;
let speedPos = 1;
let diameter=50;
var canvas;

function windowsResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function setup() {
  canvas = createCanvas(windowWidth,windowHeight);
  canvas.position(0,0);	  
  canvas.style("z-index",-1);
  
  //for (let i = 0; i < width/8; i++) {
  for (let i = 0; i < width/8; i=i+4) {
    carListVertical.push(new VerticalCar(i * 10 + 5 ,random(height),0,speed,color("#FE9601")));
  }

  //for (let i = 0; i < height/8; i++) {
  for (let i = 0; i < height/8; i=i+4) {
    carListHorizontal.push(new HorizontalCar(random(width), i * 10, speed, 0, color("#67759D")));
  }

  tiempoInicio = 0;
  tiempoEspera = 12000; // 3 segundos

  //background("#533747");
  background("#301F33");
  //background("#1E1E1E");
  
  //background(10);
  frameRate(50);
}

function draw() {
  if(running==true){
		if (millis() - tiempoInicio > tiempoEspera) {
			//background("#533747");
			background("#301F33");
			//background("#1E1E1E");
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

  
}