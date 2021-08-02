let camRomania;
let titleRomania;
let infoRomania;

let camBrazil;
let titleBrazil;
let infoBrazil;

let camTaiwan;
let titleTaiwan;
let infoTaiwan;

let camTaipei;
let titleTaiwan2;
let infoTaipei;

let camOdessa;
let titleUkraine;
let infoOdessa;

let camTokyo;
let titleJapan;
let infoTokyo;

let camVerbier;
let titleSwitzerland;
let infoVerbier;

let camVenice;
let titleItaly;
let infoVenice;

let camAmsterdam;
let titleNetherlands;
let infoAmsterdam;


let numCity=1;
var canvas;


camRomania=document.getElementById("brasovCam");
camRomania.style.display = "block";
titleRomania=document.getElementById("brasovTitle");
titleRomania.style.display = "block";
infoRomania=document.getElementById("brasovInfo");
infoRomania.style.display = "block";


camBrazil=document.getElementById("saoPauloCam");
camBrazil.style.display = "none";
titleBrazil=document.getElementById("saoPauloTitle");
titleBrazil.style.display = "none";
infoBrazil=document.getElementById("saoPauloInfo");
infoBrazil.style.display = "none";


camTaiwan=document.getElementById("taoyuanCam");
camTaiwan.style.display = "none";
titleTaiwan=document.getElementById("taoyuanTitle");
titleTaiwan.style.display = "none";
infoTaiwan=document.getElementById("taoyuanInfo");
infoTaiwan.style.display = "none";


camTaipei=document.getElementById("taipeiCam");
camTaipei.style.display = "none";
titleTaiwan2=document.getElementById("taipeiTitle");
titleTaiwan2.style.display = "none";


camOdessa=document.getElementById("odessaCam");
camOdessa.style.display = "none";
titleUkraine=document.getElementById("odessaTitle");
titleUkraine.style.display = "none";

camTokyo=document.getElementById("tokyoCam");
camTokyo.style.display = "none";
titleJapan=document.getElementById("tokyoTitle");
titleJapan.style.display = "none";

camVerbier=document.getElementById("verbierCam");
camVerbier.style.display = "none";
titleSwitzerland=document.getElementById("verbierTitle");
titleSwitzerland.style.display = "none";

camVenice=document.getElementById("veniceCam");
camVenice.style.display = "none";
titleItaly=document.getElementById("veniceTitle");
titleItaly.style.display = "none";

camAmsterdam=document.getElementById("amsterdamCam");
camAmsterdam.style.display = "none";
titleNetherlands=document.getElementById("amsterdamTitle");
titleNetherlands.style.display = "none";

/*
titleAmsterdam=document.getElementById("amsterdamTitle");
titleAmsterdam.style.display = "none";
infoAmsterdam=document.getElementById("amsterdamInfo");
infoAmsterdam.style.display = "none";
*/


/////*************//////

const timeSaoEl = document.getElementById("timeSao"); 
const dateSaoEl = document.getElementById("dateSao");
const weatherSaoEl = document.getElementById("weatherSao");

const timeBrasovEl = document.getElementById("timeBrasov"); 
const dateBrasovEl = document.getElementById("dateBrasov");
const weatherBrasovEl = document.getElementById("weatherBrasov");

const timeTaoyuanEl = document.getElementById("timeTaoyuan"); 
const dateTaoyuanEl = document.getElementById("dateTaoyuan");
const weatherTaoyuanEl = document.getElementById("weatherTaoyuan");

const API_KEY="1dd359b1b668b6011fdd5c163f521f6b";


setInterval(() => {
    // Sao Paulo // 
    let optionsSao = {
        timeZone: 'America/Sao_Paulo',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
        /*hour12: false, */
        hourCycle: 'h23',
    },
    
    saoDate = new Intl.DateTimeFormat([], optionsSao);

    var sao=[];
    sao=saoDate.formatToParts(new Date());
    //console.log(sao);

    dateSaoEl.innerHTML = sao[0].value +", "+sao[2].value+" "+sao[4].value;
    timeSaoEl.innerHTML = sao[6].value + ":" + sao[8].value;

    // Brasov //
    let optionsBrasov = {
        timeZone: 'Europe/Bucharest',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
        /*hour12: false, */
        hourCycle: 'h23',
    },
    
    brasovDate = new Intl.DateTimeFormat([], optionsBrasov);

    var brasov=[];
    brasov=brasovDate.formatToParts(new Date());
    //console.log(brasov);

    dateBrasovEl.innerHTML = brasov[0].value +", "+brasov[2].value+" "+brasov[4].value;
    timeBrasovEl.innerHTML = brasov[6].value + ":" + brasov[8].value;
    
    // Taoyuan // 
    let optionsTaoyuan = {
        timeZone: 'Asia/Taipei',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric', 
        hour12: false,
        hourCycle: 'h23', 
    },
    
    taoyuanDate = new Intl.DateTimeFormat([], optionsTaoyuan);

    var taoyuan=[];
    taoyuan=taoyuanDate.formatToParts(new Date());
    //console.log(taoyuan);

    dateTaoyuanEl.innerHTML = taoyuan[0].value +", "+taoyuan[2].value+" "+taoyuan[4].value;
    timeTaoyuanEl.innerHTML = taoyuan[6].value + ":" + taoyuan[8].value;

},1000);


getWeatherData(); 
function getWeatherData(){
    // Sao
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=-23.42&lon=-46.48&exclude=hourly,minutely,alerts&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data =>{
        //console.log(data);
        showWeatherDataSao(data);
    });
}



getWeatherDataBrasov();
function getWeatherDataBrasov(){
    // Brasov 45.64306929797585, 25.591688427132617
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=45.64&lon=25.59&exclude=hourly,minutely,alerts&units=metric&appid=${API_KEY}`).then(resB => resB.json()).then(dataBrasov =>{
        //console.log(dataBrasov);
        showWeatherDataBrasov(dataBrasov);
    });
}


getWeatherDataTaoyuan();
function getWeatherDataTaoyuan(){
    // Taoyuan 24.898973396740853, 121.28230201082584
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=24.89&lon=121.28&exclude=hourly,minutely,alerts&units=metric&appid=${API_KEY}`).then(res => res.json()).then(dataTaoyuan =>{
        //console.log(dataTaoyuan);
        showWeatherDataTaoyuan(dataTaoyuan);
    });
}



function showWeatherDataSao(data){
    let {temp} = data.current;
    temp=Math.round(temp);
    //console.log("temp: "+temp);
    let {icon} = data.current.weather[0];
    //console.log({icon});
    
    weatherSaoEl.innerHTML = `
    <div class="cityIcon">
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" width=75 height=75>
    </div>
    <div class="cityTemperature">
        ${temp}° C
    </div>`;

    //console.log(weatherSaoEl);
}


function showWeatherDataBrasov(dataBrasov){
    //console.log(dataBrasov);
    let {temp} = dataBrasov.current;
    temp=Math.round(temp);
    //console.log(temp);
    let {icon} = dataBrasov.current.weather[0];
    //console.log({icon});
    
    //weatherBrasovEl.innerHTML = `<div class="cityIcon"><img src="http://openweathermap.org/img/wn/01n@2x.png" alt="Weather Icon" width=75 height=75></div><div class="cityTemperature">18° C</div>`;

    weatherBrasovEl.innerHTML = `<div class="cityIcon"><img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" width=75 height=75></div><div class="cityTemperature">${temp}° C</div>`;
    //console.log(weatherSaoEl);
}

function showWeatherDataTaoyuan(dataTaoyuan){
    let {temp} = dataTaoyuan.current;
    temp=Math.round(temp);
    let {icon} = dataTaoyuan.current.weather[0];
    //console.log({icon});
    
    weatherTaoyuanEl.innerHTML = `
    <div class="cityIcon">
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" width=75 height=75>
    </div>
    <div class="cityTemperature">
        ${temp}° C
    </div>`;

    //console.log(weatherSaoEl);
}



document.getElementById("rightArrowIcon").addEventListener("click", function() {
    
    if(numCity<9){
        numCity++;
    }else{
        numCity=1;
    }
    updateDisplays();
});

document.getElementById("leftArrowIcon").addEventListener("click", function() {
    if(numCity>1){
        numCity--;
    }else{
        numCity=9;
    }
    updateDisplays();
});

var elem = document.documentElement;

document.getElementById("fullscreenIcon").addEventListener("click", function() {
    
    if (!document.fullscreenElement){
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { // Safari 
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE11 
            elem.msRequestFullscreen();
        }
    } else{
     if (document.fullscreenElement){
        if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) { // Safari 
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { // IE11 
            document.msExitFullscreen();
          }
        }
    }
    
});

function updateDisplays(){

    if(numCity==1){
        camRomania.style.display = "block";
        titleRomania.style.display = "block";
        infoRomania.style.display = "block"
        
        camBrazil.style.display = "none";
        titleBrazil.style.display = "none";
        infoBrazil.style.display = "none";

        camTaiwan.style.display = "none";
        titleTaiwan.style.display = "none";
        infoTaiwan.style.display = "none";

        camTaipei.style.display = "none";
        titleTaiwan2.style.display = "none";

        camOdessa.style.display = "none";
        titleUkraine.style.display = "none";

        camTokyo.style.display = "none";
        titleJapan.style.display = "none";

        camVerbier.style.display = "none";
        titleSwitzerland.style.display = "none";

        camVenice.style.display = "none";
        titleItaly.style.display = "none";

        camAmsterdam.style.display = "none";
        titleNetherlands.style.display = "none";
    }

    if(numCity==2){
        camRomania.style.display = "none";
        titleRomania.style.display = "none";
        infoRomania.style.display = "none";

        camBrazil.style.display = "block";
        titleBrazil.style.display = "block";
        infoBrazil.style.display = "block";

        camTaiwan.style.display = "none";
        titleTaiwan.style.display = "none";
        infoTaiwan.style.display = "none";

        camTaipei.style.display = "none";
        titleTaiwan2.style.display = "none";

        camOdessa.style.display = "none";
        titleUkraine.style.display = "none";

        camTokyo.style.display = "none";
        titleJapan.style.display = "none";

        camVerbier.style.display = "none";
        titleSwitzerland.style.display = "none";

        camVenice.style.display = "none";
        titleItaly.style.display = "none";

        camAmsterdam.style.display = "none";
        titleNetherlands.style.display = "none";
    }

    if(numCity==3){
        camRomania.style.display = "none";
        titleRomania.style.display = "none";
        infoRomania.style.display = "none";

        camBrazil.style.display = "none";
        titleBrazil.style.display = "none";
        infoBrazil.style.display = "none";

        camTaiwan.style.display = "block";
        titleTaiwan.style.display = "block";
        infoTaiwan.style.display = "block";

        camTaipei.style.display = "none";
        titleTaiwan2.style.display = "none";

        camOdessa.style.display = "none";
        titleUkraine.style.display = "none";

        camTokyo.style.display = "none";
        titleJapan.style.display = "none";

        camVerbier.style.display = "none";
        titleSwitzerland.style.display = "none";

        camVenice.style.display = "none";
        titleItaly.style.display = "none";

        camAmsterdam.style.display = "none";
        titleNetherlands.style.display = "none";
    }

    if(numCity==4){
        camRomania.style.display = "none";
        titleRomania.style.display = "none";
        infoRomania.style.display = "none";

        camBrazil.style.display = "none";
        titleBrazil.style.display = "none";
        infoBrazil.style.display = "none";

        camTaiwan.style.display = "none";
        titleTaiwan.style.display = "none";
        infoTaiwan.style.display = "none";

        camTaipei.style.display = "block";
        titleTaiwan2.style.display = "block";

        camOdessa.style.display = "none";
        titleUkraine.style.display = "none";

        camTokyo.style.display = "none";
        titleJapan.style.display = "none";

        camVerbier.style.display = "none";
        titleSwitzerland.style.display = "none";

        camVenice.style.display = "none";
        titleItaly.style.display = "none";

        camAmsterdam.style.display = "none";
        titleNetherlands.style.display = "none";
    }

    if(numCity==5){
        camRomania.style.display = "none";
        titleRomania.style.display = "none";
        infoRomania.style.display = "none";

        camBrazil.style.display = "none";
        titleBrazil.style.display = "none";
        infoBrazil.style.display = "none";

        camTaiwan.style.display = "none";
        titleTaiwan.style.display = "none";
        infoTaiwan.style.display = "none";

        camTaipei.style.display = "none";
        titleTaiwan2.style.display = "none";

        camOdessa.style.display = "block";
        titleUkraine.style.display = "block";

        camTokyo.style.display = "none";
        titleJapan.style.display = "none";

        camVerbier.style.display = "none";
        titleSwitzerland.style.display = "none";

        camVenice.style.display = "none";
        titleItaly.style.display = "none";

        camAmsterdam.style.display = "none";
        titleNetherlands.style.display = "none";
    }

    
    if(numCity==6){
        camRomania.style.display = "none";
        titleRomania.style.display = "none";
        infoRomania.style.display = "none";

        camBrazil.style.display = "none";
        titleBrazil.style.display = "none";
        infoBrazil.style.display = "none";

        camTaiwan.style.display = "none";
        titleTaiwan.style.display = "none";
        infoTaiwan.style.display = "none";

        camTaipei.style.display = "none";
        titleTaiwan2.style.display = "none";

        camOdessa.style.display = "none";
        titleUkraine.style.display = "none";

        camTokyo.style.display = "block";
        titleJapan.style.display = "block";

        camVerbier.style.display = "none";
        titleSwitzerland.style.display = "none";

        camVenice.style.display = "none";
        titleItaly.style.display = "none";

        camAmsterdam.style.display = "none";
        titleNetherlands.style.display = "none";
    }

    if(numCity==7){
        camRomania.style.display = "none";
        titleRomania.style.display = "none";
        infoRomania.style.display = "none";

        camBrazil.style.display = "none";
        titleBrazil.style.display = "none";
        infoBrazil.style.display = "none";

        camTaiwan.style.display = "none";
        titleTaiwan.style.display = "none";
        infoTaiwan.style.display = "none";

        camTaipei.style.display = "none";
        titleTaiwan2.style.display = "none";

        camOdessa.style.display = "none";
        titleUkraine.style.display = "none";

        camTokyo.style.display = "none";
        titleJapan.style.display = "none";

        camVerbier.style.display = "block";
        titleSwitzerland.style.display = "block";

        camVenice.style.display = "none";
        titleItaly.style.display = "none";

        camAmsterdam.style.display = "none";
        titleNetherlands.style.display = "none";
    }

    if(numCity==8){
        camRomania.style.display = "none";
        titleRomania.style.display = "none";
        infoRomania.style.display = "none";

        camBrazil.style.display = "none";
        titleBrazil.style.display = "none";
        infoBrazil.style.display = "none";

        camTaiwan.style.display = "none";
        titleTaiwan.style.display = "none";
        infoTaiwan.style.display = "none";

        camTaipei.style.display = "none";
        titleTaiwan2.style.display = "none";

        camOdessa.style.display = "none";
        titleUkraine.style.display = "none";

        camTokyo.style.display = "none";
        titleJapan.style.display = "none";

        camVerbier.style.display = "none";
        titleSwitzerland.style.display = "none";

        camVenice.style.display = "block";
        titleItaly.style.display = "block";

        camAmsterdam.style.display = "none";
        titleNetherlands.style.display = "none";
    }

    if(numCity==9){
        camRomania.style.display = "none";
        titleRomania.style.display = "none";
        infoRomania.style.display = "none";

        camBrazil.style.display = "none";
        titleBrazil.style.display = "none";
        infoBrazil.style.display = "none";

        camTaiwan.style.display = "none";
        titleTaiwan.style.display = "none";
        infoTaiwan.style.display = "none";

        camTaipei.style.display = "none";
        titleTaiwan2.style.display = "none";

        camOdessa.style.display = "none";
        titleUkraine.style.display = "none";

        camTokyo.style.display = "none";
        titleJapan.style.display = "none";

        camVerbier.style.display = "none";
        titleSwitzerland.style.display = "none";

        camVenice.style.display = "none";
        titleItaly.style.display = "none";

        camAmsterdam.style.display = "block";
        titleNetherlands.style.display = "block";
    }
}






// France Côte d'Azur Nature Beach in 4k
// https://www.youtube.com/watch?v=zr10KdpyWm0


//Place Centrale Verbier
//https://www.youtube.com/watch?v=yDKJMdZTEXQ