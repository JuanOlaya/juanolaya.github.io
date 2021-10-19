class GoalFlag{

    constructor(posX,rw){
        this.w=75; //100
        this.h=50; //150

        this.posX=posX+rw/2-(this.w/4);
        this.posY=-120;
        this.colW=100; //100
        this.colH=120; //150
        //this.colour="#F15152";
        this.colour="#F04242";
        console.log("Creada Flag"+this.posX);
    }

    show(y){
        this.posY=y-100;
         //fill(255);
        //fill(139,0,0);
        fill(this.colour);
        rect(this.posX,this.posY,this.w,this.h);
        fill("#9FBDE3");
        stroke("#9FBDE3");
        strokeWeight(2);
        triangle( this.posX+this.w , this.posY , this.posX+this.w , this.posY+this.h, this.posX+4*this.w/6,this.posY+this.h/2);

        //fill(255);
        //fill(139,0,0);
        fill(this.colour);
        noStroke();
        rect(this.posX,this.posY-8,6,115,20);
        ellipse(this.posX+3,this.posY-10,15,15);
    }
}