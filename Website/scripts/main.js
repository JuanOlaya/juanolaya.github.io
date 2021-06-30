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

function setup() {
  createCanvas(windowWidth, windowHeight);
  

  //for (let i = 0; i < 100; i++) {
	for (let i = 0; i < width/8; i++) {
    carListVertical.push(new VerticalCar(i * 10 + 5 ,random(height),0,speed,color("#FE9601")));
  }

  for (let i = 0; i < height/8; i++) {
    carListHorizontal.push(new HorizontalCar(random(width), i * 10, speed, 0, color("#67759D")));
  }

  tiempoInicio = 0;
  tiempoEspera = 1500; // 3 segundos

  background("#231726");
	//background(0);
}

function draw() {
  /*
  if (mouseIsPressed) {
    background("#503354"); // #F5EFFF BBC7CE
  }
  */
	//console.log({speed});
  if(running==true){
		if (millis() - tiempoInicio > tiempoEspera) {
			//background(0);
			background("#231726");
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

  /*
  	//fill("#B1DDF1");
	fill("#472F4C");
	//fill(0);
  	rect(80, 80, 600, 350);
	//fill();
	textSize(30);
	//fill("#FE9601");
	fill(255);
	textStyle(BOLD);
	text("Juan Olaya", 120,140);
	*/
  //bordes();
}

function mousePressed() {
  //running=!running;
	if(mouseX> width/2){
		speed++;
	}else if(speed>0){
		speed--;
	}
	
	
	/*
  if (mouseX > width / 2 ) {
    if(running==true){
    background("#503354");
    if (status < 3) {
      status++;
    } else {
      status = 1;
    }
  }
  }
  else{
    running=!running;
  }
	*/
}


