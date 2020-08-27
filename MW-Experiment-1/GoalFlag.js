class GoalFlag{

    constructor(posX,rw){
        this.w=75; //100
        this.h=50; //150

        this.posX=posX+rw/2-(this.w/4);
        this.posY=-120;
        this.colW=100; //100
        this.colH=120; //150
    }

    show(y){
        this.posY=y-100;
        fill(255);
        rect(this.posX,this.posY,this.w,this.h);
        fill(0);
        stroke(0);
        triangle( this.posX+this.w , this.posY , this.posX+this.w , this.posY+this.h, this.posX+4*this.w/6,this.posY+this.h/2);

        fill(255);
        noStroke();
        rect(this.posX,this.posY-8,6,115);
        ellipse(this.posX+3,this.posY-10,15,15);
    }
}