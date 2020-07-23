class GoalFlag{

    constructor(){
        this.posX=900;
        this.posY=height/3+20;
        this.w=100;
        this.h=50;
    }

    show(){
        fill(255);
        rect(this.posX,this.posY,this.w,this.h);
        fill(0);
        stroke(0);
        triangle( this.posX+this.w , this.posY , this.posX+this.w , this.posY+this.h, this.posX+4*this.w/6,this.posY+this.h/2);

        fill(255);
        noStroke();
        rect(this.posX,this.posY-8,6,135);
        ellipse(this.posX+3,this.posY-10,15,15);
    }
}