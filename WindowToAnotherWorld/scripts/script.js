let camRomania;
let titleRomania;
let infoRomania;
let camBrazil;
let titleBrazil;
let infoBrazil;
let camChina;
let titleChina;
let infoChina;
let numCity=1;

function setup(){
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
}