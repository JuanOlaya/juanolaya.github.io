// Standalone Balcondipity/Balconity Application Script

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

let numCity = 1;
let balconitySection;

balconitySection = document.getElementById("balconity");
balconitySection.style.display = "block";

camRomania = document.getElementById("brasovCam");
camRomania.style.display = "block";
titleRomania = document.getElementById("brasovTitle");
titleRomania.style.display = "block";
infoRomania = document.getElementById("brasovInfo");
infoRomania.style.display = "block";

camBrazil = document.getElementById("saoPauloCam");
camBrazil.style.display = "none";
titleBrazil = document.getElementById("saoPauloTitle");
titleBrazil.style.display = "none";
infoBrazil = document.getElementById("saoPauloInfo");
infoBrazil.style.display = "none";

camTaiwan = document.getElementById("taoyuanCam");
camTaiwan.style.display = "none";
titleTaiwan = document.getElementById("taoyuanTitle");
titleTaiwan.style.display = "none";
infoTaiwan = document.getElementById("taoyuanInfo");
infoTaiwan.style.display = "none";

camTaipei = document.getElementById("taipeiCam");
camTaipei.style.display = "none";
titleTaiwan2 = document.getElementById("taipeiTitle");
titleTaiwan2.style.display = "none";
infoTaipei = document.getElementById("taipeiInfo");
infoTaipei.style.display = "none";

camOdessa = document.getElementById("odessaCam");
camOdessa.style.display = "none";
titleUkraine = document.getElementById("odessaTitle");
titleUkraine.style.display = "none";
infoOdessa = document.getElementById("odessaInfo");
infoOdessa.style.display = "none";

camTokyo = document.getElementById("tokyoCam");
camTokyo.style.display = "none";
titleJapan = document.getElementById("tokyoTitle");
titleJapan.style.display = "none";
infoTokyo = document.getElementById("tokyoInfo");
infoTokyo.style.display = "none";

camVerbier = document.getElementById("verbierCam");
camVerbier.style.display = "none";
titleSwitzerland = document.getElementById("verbierTitle");
titleSwitzerland.style.display = "none";
infoVerbier = document.getElementById("verbierInfo");
infoVerbier.style.display = "none";

camVenice = document.getElementById("veniceCam");
camVenice.style.display = "none";
titleItaly = document.getElementById("veniceTitle");
titleItaly.style.display = "none";
infoVenice = document.getElementById("veniceInfo");
infoVenice.style.display = "none";

camAmsterdam = document.getElementById("amsterdamCam");
camAmsterdam.style.display = "none";
titleNetherlands = document.getElementById("amsterdamTitle");
titleNetherlands.style.display = "none";
infoAmsterdam = document.getElementById("amsterdamInfo");
infoAmsterdam.style.display = "none";

let infoScreen = document.getElementById("infoScreen");
infoScreen.style.display = "block";

const timeSaoEl = document.getElementById("timeSao"); 
const dateSaoEl = document.getElementById("dateSao");
const weatherSaoEl = document.getElementById("weatherSao");

const timeBrasovEl = document.getElementById("timeBrasov"); 
const dateBrasovEl = document.getElementById("dateBrasov");
const weatherBrasovEl = document.getElementById("weatherBrasov");

const timeTaoyuanEl = document.getElementById("timeTaoyuan"); 
const dateTaoyuanEl = document.getElementById("dateTaoyuan");
const weatherTaoyuanEl = document.getElementById("weatherTaoyuan");

const timeTaipeiEl = document.getElementById("timeTaipei"); 
const dateTaipeiEl = document.getElementById("dateTaipei");
const weatherTaipeiEl = document.getElementById("weatherTaipei");

const timeOdessaEl = document.getElementById("timeOdessa"); 
const dateOdessaEl = document.getElementById("dateOdessa");
const weatherOdessaEl = document.getElementById("weatherOdessa");

const timeTokyoEl = document.getElementById("timeTokyo"); 
const dateTokyoEl = document.getElementById("dateTokyo");
const weatherTokyoEl = document.getElementById("weatherTokyo");

const timeVerbierEl = document.getElementById("timeVerbier"); 
const dateVerbierEl = document.getElementById("dateVerbier");
const weatherVerbierEl = document.getElementById("weatherVerbier");

const timeVeniceEl = document.getElementById("timeVenice"); 
const dateVeniceEl = document.getElementById("dateVenice");
const weatherVeniceEl = document.getElementById("weatherVenice");

const timeAmsterdamEl = document.getElementById("timeAmsterdam"); 
const dateAmsterdamEl = document.getElementById("dateAmsterdam");
const weatherAmsterdamEl = document.getElementById("weatherAmsterdam");

const API_KEY = "1dd359b1b668b6011fdd5c163f521f6b";

// Clocks Update loop
setInterval(() => {
    // Sao Paulo // 
    let optionsSao = {
        timeZone: 'America/Sao_Paulo',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23',
    },
    saoDate = new Intl.DateTimeFormat([], optionsSao);
    let sao = saoDate.formatToParts(new Date());
    dateSaoEl.innerHTML = sao[0].value + ", " + sao[2].value + " " + sao[4].value;
    timeSaoEl.innerHTML = sao[6].value + ":" + sao[8].value;

    // Brasov //
    let optionsBrasov = {
        timeZone: 'Europe/Bucharest',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23',
    },
    brasovDate = new Intl.DateTimeFormat([], optionsBrasov);
    let brasov = brasovDate.formatToParts(new Date());
    dateBrasovEl.innerHTML = brasov[0].value + ", " + brasov[2].value + " " + brasov[4].value;
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
    let taoyuan = taoyuanDate.formatToParts(new Date());
    dateTaoyuanEl.innerHTML = taoyuan[0].value + ", " + taoyuan[2].value + " " + taoyuan[4].value;
    timeTaoyuanEl.innerHTML = taoyuan[6].value + ":" + taoyuan[8].value;

    // Taipei
    let optionsTaipei = {
        timeZone: 'Asia/Taipei',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric', 
        hour12: false,
        hourCycle: 'h23', 
    },
    taipeiDate = new Intl.DateTimeFormat([], optionsTaipei);
    let taipei = taipeiDate.formatToParts(new Date());
    dateTaipeiEl.innerHTML = taipei[0].value + ", " + taipei[2].value + " " + taipei[4].value;
    timeTaipeiEl.innerHTML = taipei[6].value + ":" + taipei[8].value;

    // Odessa (using USA Florida timezone: America/New_York)
    let optionsOdessa = {
        timeZone: 'America/New_York',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric', 
        hour12: false,
        hourCycle: 'h23', 
    },
    odessaDate = new Intl.DateTimeFormat([], optionsOdessa);
    let odessa = odessaDate.formatToParts(new Date());
    dateOdessaEl.innerHTML = odessa[0].value + ", " + odessa[2].value + " " + odessa[4].value;
    timeOdessaEl.innerHTML = odessa[6].value + ":" + odessa[8].value;

    // Tokyo
    let optionsTokyo = {
        timeZone: 'Asia/Tokyo',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric', 
        hour12: false,
        hourCycle: 'h23', 
    },
    tokyoDate = new Intl.DateTimeFormat([], optionsTokyo);
    let tokyo = tokyoDate.formatToParts(new Date());
    dateTokyoEl.innerHTML = tokyo[0].value + ", " + tokyo[2].value + " " + tokyo[4].value;
    timeTokyoEl.innerHTML = tokyo[6].value + ":" + tokyo[8].value;

    // Verbier
    let optionsVerbier = {
        timeZone: 'Europe/Zurich',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric', 
        hour12: false,
        hourCycle: 'h23', 
    },
    verbierDate = new Intl.DateTimeFormat([], optionsVerbier);
    let verbier = verbierDate.formatToParts(new Date());
    dateVerbierEl.innerHTML = verbier[0].value + ", " + verbier[2].value + " " + verbier[4].value;
    timeVerbierEl.innerHTML = verbier[6].value + ":" + verbier[8].value;

    // Venice
    let optionsVenice = {
        timeZone: 'Europe/Rome',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric', 
        hour12: false,
        hourCycle: 'h23', 
    },
    veniceDate = new Intl.DateTimeFormat([], optionsVenice);
    let venice = veniceDate.formatToParts(new Date());
    dateVeniceEl.innerHTML = venice[0].value + ", " + venice[2].value + " " + venice[4].value;
    timeVeniceEl.innerHTML = venice[6].value + ":" + venice[8].value;

    // Amsterdam
    let optionsAmsterdam = {
        timeZone: 'Europe/Amsterdam',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric', 
        hour12: false,
        hourCycle: 'h23', 
    },
    amsterdamDate = new Intl.DateTimeFormat([], optionsAmsterdam);
    let amsterdam = amsterdamDate.formatToParts(new Date());
    dateAmsterdamEl.innerHTML = amsterdam[0].value + ", " + amsterdam[2].value + " " + amsterdam[4].value;
    timeAmsterdamEl.innerHTML = amsterdam[6].value + ":" + amsterdam[8].value;
}, 1000);

// Weather fetching
getWeatherData(); 
function getWeatherData() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=-23.42&lon=-46.48&units=metric&appid=${API_KEY}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => showWeatherDataSao(data))
        .catch(err => {
            console.error("Error fetching weather for Sao Paulo:", err);
            weatherSaoEl.innerHTML = `<div class="cityTemperature">Offline</div>`;
        });
}

getWeatherDataBrasov();
function getWeatherDataBrasov() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=45.64&lon=25.59&units=metric&appid=${API_KEY}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(dataBrasov => showWeatherDataBrasov(dataBrasov))
        .catch(err => {
            console.error("Error fetching weather for Brasov:", err);
            weatherBrasovEl.innerHTML = `<div class="cityTemperature">Offline</div>`;
        });
}

getWeatherDataTaoyuan();
function getWeatherDataTaoyuan() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=24.89&lon=121.28&units=metric&appid=${API_KEY}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(dataTaoyuan => showWeatherDataTaoyuan(dataTaoyuan))
        .catch(err => {
            console.error("Error fetching weather for Taoyuan:", err);
            weatherTaoyuanEl.innerHTML = `<div class="cityTemperature">Offline</div>`;
        });
}

getWeatherDataTaipei();
function getWeatherDataTaipei() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=25.03&lon=121.56&units=metric&appid=${API_KEY}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(dataTaipei => showWeatherDataTaipei(dataTaipei))
        .catch(err => {
            console.error("Error fetching weather for Taipei:", err);
            weatherTaipeiEl.innerHTML = `<div class="cityTemperature">Offline</div>`;
        });
}

getWeatherDataOdessa();
function getWeatherDataOdessa() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=46.49&lon=30.73&units=metric&appid=${API_KEY}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(dataOdessa => showWeatherDataOdessa(dataOdessa))
        .catch(err => {
            console.error("Error fetching weather for Odessa:", err);
            weatherOdessaEl.innerHTML = `<div class="cityTemperature">Offline</div>`;
        });
}

getWeatherDataTokyo();
function getWeatherDataTokyo() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=35.65&lon=139.70&units=metric&appid=${API_KEY}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(dataTokyo => showWeatherDataTokyo(dataTokyo))
        .catch(err => {
            console.error("Error fetching weather for Tokyo:", err);
            weatherTokyoEl.innerHTML = `<div class="cityTemperature">Offline</div>`;
        });
}

getWeatherDataVerbier();
function getWeatherDataVerbier() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=46.09&lon=7.22&units=metric&appid=${API_KEY}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(dataVerbier => showWeatherDataVerbier(dataVerbier))
        .catch(err => {
            console.error("Error fetching weather for Verbier:", err);
            weatherVerbierEl.innerHTML = `<div class="cityTemperature">Offline</div>`;
        });
}

getWeatherDataVenice();
function getWeatherDataVenice() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=45.44&lon=12.32&units=metric&appid=${API_KEY}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(dataVenice => showWeatherDataVenice(dataVenice))
        .catch(err => {
            console.error("Error fetching weather for Venice:", err);
            weatherVeniceEl.innerHTML = `<div class="cityTemperature">Offline</div>`;
        });
}

getWeatherDataAmsterdam();
function getWeatherDataAmsterdam() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=52.37&lon=4.89&units=metric&appid=${API_KEY}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(dataAmsterdam => showWeatherDataAmsterdam(dataAmsterdam))
        .catch(err => {
            console.error("Error fetching weather for Amsterdam:", err);
            weatherAmsterdamEl.innerHTML = `<div class="cityTemperature">Offline</div>`;
        });
}

function showWeatherDataSao(data) {
    if (!data || !data.main || !data.weather || !data.weather[0]) {
        weatherSaoEl.innerHTML = `<div class="cityTemperature">N/A</div>`;
        return;
    }
    let {temp} = data.main;
    temp = Math.round(temp);
    let {icon} = data.weather[0];
    
    weatherSaoEl.innerHTML = `
    <div class="cityIcon">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" width=75 height=75>
    </div>
    <div class="cityTemperature">
        ${temp}° C
    </div>`;
}

function showWeatherDataBrasov(dataBrasov) {
    if (!dataBrasov || !dataBrasov.main || !dataBrasov.weather || !dataBrasov.weather[0]) {
        weatherBrasovEl.innerHTML = `<div class="cityTemperature">N/A</div>`;
        return;
    }
    let {temp} = dataBrasov.main;
    temp = Math.round(temp);
    let {icon} = dataBrasov.weather[0];
    
    weatherBrasovEl.innerHTML = `<div class="cityIcon"><img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" width=75 height=75></div><div class="cityTemperature">${temp}° C</div>`;
}

function showWeatherDataTaoyuan(dataTaoyuan) {
    if (!dataTaoyuan || !dataTaoyuan.main || !dataTaoyuan.weather || !dataTaoyuan.weather[0]) {
        weatherTaoyuanEl.innerHTML = `<div class="cityTemperature">N/A</div>`;
        return;
    }
    let {temp} = dataTaoyuan.main;
    temp = Math.round(temp);
    let {icon} = dataTaoyuan.weather[0];
    
    weatherTaoyuanEl.innerHTML = `
    <div class="cityIcon">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" width=75 height=75>
    </div>
    <div class="cityTemperature">
        ${temp}° C
    </div>`;
}

function showWeatherDataTaipei(data) {
    if (!data || !data.main || !data.weather || !data.weather[0]) {
        weatherTaipeiEl.innerHTML = `<div class="cityTemperature">N/A</div>`;
        return;
    }
    let {temp} = data.main;
    temp = Math.round(temp);
    let {icon} = data.weather[0];
    
    weatherTaipeiEl.innerHTML = `
    <div class="cityIcon">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" width=75 height=75>
    </div>
    <div class="cityTemperature">
        ${temp}° C
    </div>`;
}

function showWeatherDataOdessa(data) {
    if (!data || !data.main || !data.weather || !data.weather[0]) {
        weatherOdessaEl.innerHTML = `<div class="cityTemperature">N/A</div>`;
        return;
    }
    let {temp} = data.main;
    temp = Math.round(temp);
    let {icon} = data.weather[0];
    
    weatherOdessaEl.innerHTML = `
    <div class="cityIcon">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" width=75 height=75>
    </div>
    <div class="cityTemperature">
        ${temp}° C
    </div>`;
}

function showWeatherDataTokyo(data) {
    if (!data || !data.main || !data.weather || !data.weather[0]) {
        weatherTokyoEl.innerHTML = `<div class="cityTemperature">N/A</div>`;
        return;
    }
    let {temp} = data.main;
    temp = Math.round(temp);
    let {icon} = data.weather[0];
    
    weatherTokyoEl.innerHTML = `
    <div class="cityIcon">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" width=75 height=75>
    </div>
    <div class="cityTemperature">
        ${temp}° C
    </div>`;
}

function showWeatherDataVerbier(data) {
    if (!data || !data.main || !data.weather || !data.weather[0]) {
        weatherVerbierEl.innerHTML = `<div class="cityTemperature">N/A</div>`;
        return;
    }
    let {temp} = data.main;
    temp = Math.round(temp);
    let {icon} = data.weather[0];
    
    weatherVerbierEl.innerHTML = `
    <div class="cityIcon">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" width=75 height=75>
    </div>
    <div class="cityTemperature">
        ${temp}° C
    </div>`;
}

function showWeatherDataVenice(data) {
    if (!data || !data.main || !data.weather || !data.weather[0]) {
        weatherVeniceEl.innerHTML = `<div class="cityTemperature">N/A</div>`;
        return;
    }
    let {temp} = data.main;
    temp = Math.round(temp);
    let {icon} = data.weather[0];
    
    weatherVeniceEl.innerHTML = `
    <div class="cityIcon">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" width=75 height=75>
    </div>
    <div class="cityTemperature">
        ${temp}° C
    </div>`;
}

function showWeatherDataAmsterdam(data) {
    if (!data || !data.main || !data.weather || !data.weather[0]) {
        weatherAmsterdamEl.innerHTML = `<div class="cityTemperature">N/A</div>`;
        return;
    }
    let {temp} = data.main;
    temp = Math.round(temp);
    let {icon} = data.weather[0];
    
    weatherAmsterdamEl.innerHTML = `
    <div class="cityIcon">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" width=75 height=75>
    </div>
    <div class="cityTemperature">
        ${temp}° C
    </div>`;
}

// Arrow Controls
document.getElementById("rightArrowIcon").addEventListener("click", function() {
    if (numCity < 9) {
        numCity++;
    } else {
        numCity = 1;
    }
    updateDisplays();
});

document.getElementById("leftArrowIcon").addEventListener("click", function() {
    if (numCity > 1) {
        numCity--;
    } else {
        numCity = 9;
    }
    updateDisplays();
});

// Info Modal controls
document.getElementById("infoIcon").addEventListener("click", function() {
    let modal = document.getElementById("infoScreen");
    if (modal.style.display == "block") {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
    }
    slideIndex = 1;
    showSlides(slideIndex);
});

document.getElementById("cancelInfoScreen").addEventListener("click", function() {
    document.getElementById("infoScreen").style.display = "none";
    slideIndex = 1;
    showSlides(slideIndex);
});

// Back Button Navigation
document.getElementById("goBackBalconity").addEventListener("click", function() {
    window.location.href = "../index.html";
});

function updateDisplays() {
    const cams = [camRomania, camBrazil, camTaiwan, camTaipei, camOdessa, camTokyo, camVerbier, camVenice, camAmsterdam];
    const titles = [titleRomania, titleBrazil, titleTaiwan, titleTaiwan2, titleUkraine, titleJapan, titleSwitzerland, titleItaly, titleNetherlands];
    const infos = [infoRomania, infoBrazil, infoTaiwan, infoTaipei, infoOdessa, infoTokyo, infoVerbier, infoVenice, infoAmsterdam];
    
    for (let i = 0; i < cams.length; i++) {
        if (i === numCity - 1) {
            cams[i].style.display = "block";
            titles[i].style.display = "block";
            infos[i].style.display = "block";
        } else {
            cams[i].style.display = "none";
            titles[i].style.display = "none";
            infos[i].style.display = "none";
        }
    }
}

// Slideshow implementation
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  if (slides[slideIndex-1]) {
      slides[slideIndex-1].style.display = "block";  
  }
  if (dots[slideIndex-1]) {
      dots[slideIndex-1].className += " active";
  }
}
