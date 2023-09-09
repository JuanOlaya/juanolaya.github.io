var diameter=80;
var status=0;

function setup() {
  createCanvas(windowWidth , windowHeight);
}

function draw() {
  background("#1C3147");
  
  fill("#E23C12");
  noStroke();
  ellipse(15*width/100, 43*height/100,diameter,diameter);
  
  fill("#BD320F");
  noStroke();
  ellipse(38*width/100, 43*height/100,diameter,diameter);
  
  fill("#97280C");
  noStroke();
  ellipse(62*width/100, 43*height/100,diameter,diameter);
  
  fill("#711E09");
  noStroke();
  ellipse(85*width/100, 43*height/100,diameter,diameter);
  
  
   fill("#E23C12");
  noStroke();
  ellipse(15*width/100, 76*height/100,diameter,diameter);
  
  fill("#BD320F");
  noStroke();
  ellipse(38*width/100, 76*height/100,diameter,diameter);
  
  fill("#189CD8");      //#97280C
  noStroke();
  ellipse(62*width/100, 76*height/100,diameter,diameter);
  

  if(mouseIsPressed)
  {
    if(50>dist(mouseX,mouseY,62*width/100, 43*height/100))  
    {
      console.log("Entra");
      status=-1;
    }
  }
  if(status==-1)
  {
    if(diameter>0)
    {
         diameter--;
    }
  }  
}