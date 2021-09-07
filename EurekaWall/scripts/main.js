let canvas;

function setup() {
    canvas = createCanvas(windowWidth,windowHeight+50);
	canvas.position(0,0);	  
	canvas.style("z-index",-1);
}

function draw() {
    background(" #3A3A3A  ");
    fill("#D7B42A");
    noStroke();
    rect(0,0,width*0.29,height);
    /*ellipse(width,height,1.75*width);*/
    
  }



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
        document.getElementById("fullscreenIcon").innerHTML = `fullscreen_exit`;
    } else{
     if (document.fullscreenElement){
        if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) { // Safari 
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { // IE11 
            document.msExitFullscreen();
          }
          document.getElementById("fullscreenIcon").innerHTML = `fullscreen`;
        }
    }
});