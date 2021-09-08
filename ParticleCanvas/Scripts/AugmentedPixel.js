class AugmentedPixel{
    constructor(xpos,ypos){
        this.posX=xpos;
        this.posY=ypos;
        this.hasPressed=false;
    }

    show(){
        if(this.hasPressed==false){
            fill(180,0,0);
            
            rect(this.posX,this.posY,6,6);
        }else{
            //fill(backgroundColor);
            fill(255);
            rect(this.posX,this.posY,6,6);
        }
    }
    
    detectCollision(){
        //if(mouseIsPressed){
            console.log("MousePressedddd");
            if(mouseX>=this.posX && mouseX<=this.posX+6){
                if(mouseY>=this.posY && mouseY<=this.posY+6){
                    this.hasPressed=true;
                }
            }
        //}
    }
}