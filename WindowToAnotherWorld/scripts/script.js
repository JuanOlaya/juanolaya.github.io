let camRomania;
let titleRomania;
let infoRomania;
let camBrazil;
let titleBrazil;
let infoBrazil;
let camChina;
let titleChina;
let infoChina;

let camAmsterdam;
let titleAmsterdam;
let infoAmsterdam;

let numCity=1;
var canvas;

function preload(){
    /*background("#F4A523");*/
}

function setup(){
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.position(0,0);	  
	canvas.style("z-index",-1);

    camRomania=document.getElementById("brasovCam");
	camRomania.style.display = "none";
    titleRomania=document.getElementById("brasovTitle");
    titleRomania.style.display = "none";
    infoRomania=document.getElementById("brasovInfo");
    infoRomania.style.display = "none";

    camBrazil=document.getElementById("saoPauloCam");
    camBrazil.style.display = "none";
    titleBrazil=document.getElementById("saoPauloTitle");
    titleBrazil.style.display = "none";
    infoBrazil=document.getElementById("saoPauloInfo");
    infoBrazil.style.display = "none";

    camChina=document.getElementById("hongKongCam");
    camChina.style.display = "none";
    titleChina=document.getElementById("hongKongTitle");
    titleChina.style.display = "none";
    infoChina=document.getElementById("hongKongInfo");
    infoChina.style.display = "none";

    camAmsterdam=document.getElementById("amsterdamCam");
    camAmsterdam.style.display = "none";
    /*
    titleAmsterdam=document.getElementById("amsterdamTitle");
    titleAmsterdam.style.display = "none";
    infoAmsterdam=document.getElementById("amsterdamInfo");
    infoAmsterdam.style.display = "none";
    */
}

function draw(){

    if(numCity==1){
        camRomania.style.display = "block";
        titleRomania.style.display = "block";
        infoRomania.style.display = "block";

        camBrazil.style.display = "none";
        titleBrazil.style.display = "none";
        infoBrazil.style.display = "none";

        camChina.style.display = "none";
        titleChina.style.display = "none";
        infoChina.style.display = "none";
    }
    if(numCity==2){
        camRomania.style.display = "none";
        titleRomania.style.display = "none";
        infoRomania.style.display = "none";

        camBrazil.style.display = "block";
        titleBrazil.style.display = "block";
        infoBrazil.style.display = "block";

        camChina.style.display = "none";
        titleChina.style.display = "none";
        infoChina.style.display = "none";
    }
    if(numCity==3){
        camRomania.style.display = "none";
        titleRomania.style.display = "none";
        infoRomania.style.display = "none";

        camBrazil.style.display = "none";
        titleBrazil.style.display = "none";
        infoBrazil.style.display = "none";

        camChina.style.display = "block";
        titleChina.style.display = "block";
        infoChina.style.display = "block";
    }
}

function mousePressed(){
    if(numCity<3){
        numCity++;
    }else{
        numCity=1;
    }

    if(mouseX>80*width/100 && mouseY>80*height/100){
        let fs = fullscreen();
        fullscreen(!fs);
    }
}