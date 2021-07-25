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

let numCity=2;
var canvas;


/////*************//////

const timeSaoEl = document.getElementById("timeSao"); 
const dateSaoEl = document.getElementById("dateSao");
const weatherSaoEl = document.getElementById("weatherSao");


const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const API_KEY="1dd359b1b668b6011fdd5c163f521f6b";

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay(); 
    const hour = time.getHours();
    //const hoursIn12HrFormat = hour >= 13 ? hour %12: hour;
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM';

    timeSaoEl.innerHTML = hour + ":" + minutes;
    dateSaoEl.innerHTML = days[day]+", "+date+" "+months[month];

    
},6000);

getWeatherData(); 
function getWeatherData(){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=-23.42&lon=-46.48&exclude=hourly,minutely,alerts&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data =>{
        console.log(data);
        showWeatherData(data);
    });
}

function showWeatherData(data){
    let {temp} = data.current;
    temp=Math.round(temp);
    let {icon} = data.current.weather[0];
    console.log({icon});
    

    //weatherSaoEl.innerHTML = `<div class="cityWeather" id="weatherSao"><div>${temp}° C</div><img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon"></div></div>`;
 
    
    weatherSaoEl.innerHTML = `
    <div class="cityIcon">
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" width=75 height=75>
    </div>
    <div class="cityTemperature">
        ${temp}° C
    </div>`;

    console.log(weatherSaoEl);
    
    //iconSaoEl.innerHTML = `<div id="weatherIconSao"><img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon"></div>`;

}

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
        infoRomania.style.display = "block"
        

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
        infoChina.style.display = "none"
        
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