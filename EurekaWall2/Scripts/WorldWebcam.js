var statusWebcam=0;

function camaraEnVivo(){
    console.log("statusWebcam: "+statusWebcam);
    //canvas.style("z-index",0);
    //brasovWebcam.style("z-index",-1);
    //background(255,255,255,0);
    //brasovWebcam.style.zIndex = "-3";
    
    
    textStyle(BOLD);
    textAlign(LEFT);
    textSize(20);
    /*
    if(statusWebcam==1){
        brasovWebcam.style.display = "block";
        tokyoWebcam.style.display = "none";

        text("Brașov - Romania",50,25);
        if(minute()<10){
            text((hour()+1)+":0"+minute(),50,50);
        }else{
            text((hour()+1)+":"+minute(),50,50);
        }
    }
    if(statusWebcam==2){
        brasovWebcam.style.display = "none";
        tokyoWebcam.style.display = "none";
        hongkongWebcam.style.display = "block";

        text("Hong Kong - China",50,25);
        if(minute()<10){
            text((hour()+6)+":0"+minute(),50,50);
        }else{
            text((hour()+6)+":"+minute(),50,50);
        }
    }
    if(statusWebcam==3){
        hongkongWebcam.style.display = "none";
        tokyoWebcam.style.display = "block";

        text("Tokyo - Japan",50,25);
        if(minute()<10){
            text((hour()+7)+":0"+minute(),50,50);
        }else{
            text((hour()+7)+":"+minute(),50,50);
        }
    }
    */
    rectMode(CORNER);
    fill(colorButtons);
    let widthB = 120;
    let heightB = 50;
    rect(width/2-widthB/2,20,widthB,heightB);
    textAlign(CENTER,CENTER);
    fill(backgroundColor);
    text("Next",width/2,45);


    //document.getElementById("worldCam").style.display = "block";
    noFill();
    stroke("#EFD8B9");
    strokeWeight(30);
    rectMode(CENTER);
    rect(width/2,height/2,834,468,300);
    
    noFill();
    stroke(0);
    strokeWeight(30);
    rectMode(CENTER);
    rect(width/2,height/2,834+56,468+56,300);
    
    stroke(0);
    strokeWeight(100);
    rectMode(CENTER);
    rect(width/2,height/2,834+170,468+170,300);
    noStroke();

    
}