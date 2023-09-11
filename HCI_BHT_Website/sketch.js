var diameter=80;
var statusMenu=0;
var statusGeneral=1;
let img;

function setup() {
    createCanvas(windowWidth , windowHeight);
    canvas.position(0,0);	  
	canvas.style("z-index",-1);
    defaultCanvas=document.getElementById("defaultCanvas0");
    //img = loadImage('assets/HCI_logo.svg');
}

function draw() {
    background("#1C3147");
    //image(img, 178, 45, 234*2, 29*2);

    console.log("MouseX: "+mouseX+" MouseY: "+mouseY);

    fill("#E23C12");
    noStroke();
    ellipse(20*width/100, 30*height/100,diameter,diameter);

    fill("#D10B5B");  //#BD320F
    noStroke();
    ellipse(50*width/100, 30*height/100,diameter,diameter);

    /*
    fill("#711E09");
    noStroke();
    ellipse(85*width/100, 43*height/100,diameter,diameter);
    */

    
    //fill("#E23C12");
    fill("#189CD8");      //#97280C
    noStroke();
    ellipse(20*width/100, 60*height/100,diameter,diameter);

    fill("#BD320F");
    noStroke();
    ellipse(50*width/100, 60*height/100,diameter,diameter);

    /*
    fill("#189CD8");      //#97280C
    noStroke();
    ellipse(62*width/100, 76*height/100,diameter,diameter);
    */

    fill("#DE2697");  // #97280C
    noStroke();
    ellipse(20*width/100, 90*height/100,diameter,diameter);


    if(mouseIsPressed)
    {
    if(50>dist(mouseX,mouseY,80*width/100, 43*height/100))  
    {
        console.log("Entra");
        statusMenu=-1;
    }
    }
    if(statusMenu==-1)
    {
    if(diameter>0)
    {
            diameter--;
    }
    }  
}