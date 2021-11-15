
class Pixel{
    constructor(xpos, ypos, diameter){
        this.posX=xpos;
        this.posY=ypos;
        this.diameter=diameter;  
        //this.color=["#2A9D8F", "#FF6E00","#FF1493","#10203A"];
        //this.colores=["#3A417E", "#FF6E00","#FF1493","#000000","#10203A"];   //   
                //  blue        orange    pink                  blue
       let colorRand=Math.round(random(0,4));
       if(colorRand==0 || colorRand==1){
        this.indexColor=5;
       }else{
        this.indexColor=Math.round(random(0,4));
       }

                
        this.opacity=Math.round(random(51,254));
        this.brightness=Math.round(random(50,87));;
        this.velOpacity=3;
        this.velBrightness=1;
        this.upDown=floor(random(2));
        //this.colores=["#3A417E","#EAD367","#7F6A93","#EFD8B9"]; //  1. HANSA YELLOW     //000000  #381501
        //this.colores=["#3A417E","#A349A4","#E0AB62","#EFD8B9","#381501"]; //      E0CB62 1. Purpureus (Purple) 2.HANSA YELLOW (E8D366) // EAD367  EAD467
        this.colores=["#484B78","#E4AA2D","#C62F40","#58875D","#D0692E","#1E1E1E"];
        this.hasChangedColor=false;
        this.hasChangedStatus=false;
        this.status=1;
        this.colorTemp=0;
    }

    show(){

        if(this.upDown==0){
            this.opacity=this.opacity-this.velOpacity;
        }
        if(this.upDown==1){
            this.opacity=this.opacity+this.velOpacity;
        }
        if(this.opacity>255){
            this.velOpacity=this.velOpacity*-1;
        }
        if(this.opacity<50){
            this.velOpacity=this.velOpacity*-1;
        }

        //this.colores[0] = color('rgba(222, 90, 4,'+this.opacity/255+')');

        if(this.upDown==0){
            this.brightness=this.brightness-this.velBrightness;
        }
        if(this.upDown==1){
            this.brightness=this.brightness+this.velBrightness;
        }
        if(this.brightness>80){
            this.velBrightness=this.velBrightness*-1;
        }
        if(this.brightness<35){
            this.velBrightness=this.velBrightness*-1;
        }

        //this.colores[0] = color('hsb(24, 98%,'+this.brightness+'%)');
        //this.colores[0] = color("#de5a04");


        fill(this.colores[this.indexColor]);
        
        if(this.status==1){
            if(transitionTriggerPortal){
                this.diameter=this.diameter-1.5;
                if(this.diameter<10){
                    this.diameter=10;
                }
            }

            
            //this.colores[0] = color('hsb(24, 98% , 87%)');
            //fill(this.colores[this.indexColor]);
            ellipse(this.posX,this.posY,this.diameter);
            
            noFill();
            strokeWeight(5);
            stroke(this.colores[this.indexColor]);
            ellipse(this.posX,this.posY,sizePixel);
            noStroke();
        }

        // 4 rings
        if(this.status==2){ 
            //this.colores[0] = color('hsb(24, 98%,'+this.brightness+'%)');
            //this.colores[0] = color('hsb(24, 98% , 87%)');
            /*
            for(let i=0; i<4 ;i++){
                stroke(this.colores[this.indexColor]);
                strokeWeight(2.2);
                noFill();
                ellipse(this.posX,this.posY,(i+1)*this.diameter/4);
            }
            */
            //fill(0);
            rectMode(CENTER);
            stroke(this.colores[this.indexColor]);
            rect(this.posX,this.posY,50,50);
            rectMode(CORNER);
            noStroke();
        }

        if(this.status==3){
            //this.colores[0] = color('hsb(24, 98%,'+this.brightness+'%)');
            //this.colores[0] = color('hsb(24, 98% , 87%)');
            //fill(this.colores[this.indexColor]);
            //ellipse(this.posX,this.posY,this.diameter/2);
            
            //noFill();
            //strokeWeight(5);
            //fill(0);
            //elllipse
            strokeWeight(5);
            stroke(this.colores[this.indexColor]);
            arc(this.posX-this.diameter/2-0,this.posY-this.diameter/2-0,this.diameter*2+0,this.diameter*2+0,0,PI/2,PIE);
            //stroke(this.colores[this.indexColor]);
            //ellipse(this.posX,this.posY,sizePixel);
            //noStroke();
        }

        if(this.status==4){
            
            /*
            push();
            translate(this.posX,this.posY);
            fill(this.colores[this.indexColor]);
            
            for(let i=0;i<PI;i=i+PI/8){
                rotate(i);
                rect(-this.diameter/2,-1.8,this.diameter,3.6);
            }
            pop();
            */
            strokeWeight(5);
            stroke(this.colores[this.indexColor]);
            arc(this.posX+this.diameter/2+2,this.posY-this.diameter/2-2,this.diameter*2+3,this.diameter*2+3,PI/2,PI);
        }

        if(this.status==5){
            /*
            push();
				let offset=2;
				translate(this.posX,this.posY);
				fill(this.colores[this.indexColor]);
				stroke(this.colores[this.indexColor]);
				strokeWeight(1);
				
				for(let i=PI/2;i<=2*PI;i=i+PI/2){
					arc(0,0,sizePixel,sizePixel,i-PI/2,i,OPEN);
				}
				
				push();
				translate(-sizePixel/2,-sizePixel/2);
				arc(0,0,sizePixel-offset,sizePixel-offset,0,PI/2,CHORD);
				pop();
				
				push();
				translate(sizePixel/2,-sizePixel/2);
				arc(0,0,sizePixel-offset,sizePixel-offset,PI/2,PI,CHORD);
				pop();
				
				push();
				translate(sizePixel/2,sizePixel/2);
				arc(0,0,sizePixel-offset,sizePixel-offset,PI,3*PI/2,CHORD);
				pop();
				
				push();
				translate(-sizePixel/2,sizePixel/2);
				arc(0,0,sizePixel-offset,sizePixel-offset,3*PI/2,2*PI,CHORD);
				pop();
			pop();
            */
            strokeWeight(5);
            stroke(this.colores[this.indexColor]);
            arc(this.posX-this.diameter/2-2,this.posY+this.diameter/2+2,this.diameter*2+3,this.diameter*2+3,3*PI/2,2*PI);
        }
        if(this.status==6){
            strokeWeight(5);
            stroke(this.colores[this.indexColor]);
            arc( this.posX+this.diameter/2+2,this.posY+this.diameter/2+2,this.diameter*2+2,this.diameter*2+0 ,PI,3*PI/2);
        }
        if(this.status==7){
            strokeWeight(2);
            stroke(this.colores[this.indexColor]);
            triangle(this.posX-(this.diameter/2),this.posY-(this.diameter/2), this.posX-(this.diameter/2),this.posY+(this.diameter/2), this.posX+(this.diameter/2),this.posY-(this.diameter/2));
        }
        if(this.status==8){
            strokeWeight(2);
            stroke(this.colores[this.indexColor]);
            triangle(this.posX-(this.diameter/2),this.posY-(this.diameter/2), this.posX+(this.diameter/2),this.posY+(this.diameter/2), this.posX+(this.diameter/2),this.posY-(this.diameter/2));
        }
        if(this.status==9){
            strokeWeight(2);
            stroke(this.colores[this.indexColor]);
            triangle(this.posX-(this.diameter/2),this.posY-(this.diameter/2), this.posX+(this.diameter/2),this.posY+(this.diameter/2), this.posX-(this.diameter/2),this.posY+(this.diameter/2));
        }

        if(this.status==10){
            strokeWeight(2);
            stroke(this.colores[this.indexColor]);
            triangle(this.posX+(this.diameter/2),this.posY-(this.diameter/2), this.posX+(this.diameter/2),this.posY+(this.diameter/2), this.posX-(this.diameter/2),this.posY+(this.diameter/2));

            //triangle( width/25 +(sizePixel/2),    width/25-(sizePixel/2),    width/25+(sizePixel/2),         width/25+(sizePixel/2),       width/25-(sizePixel/2),    width/25+(sizePixel/2) );
        }

        if(this.status==11){
			// Leaf shape
			push();
				let offset=2;
                translate(this.posX/*+(this.diameter/2)*/,this.posY/*+(this.diameter/2)*/);
				//translate(width/25+(sizePixel*23+12*23),width/25+(sizePixel*13+12*13));
				//fill(222, 90, 4);
				stroke(this.colores[this.indexColor]);
				strokeWeight(1.7);

				push();
				//translate(-sizePixel/2,-sizePixel/2);
                translate(-this.diameter/2,-this.diameter/2);
				arc(0,0,this.diameter*2+2,this.diameter*2+2,0,PI/2,CHORD);
                //arc(0,0,sizePixel*2,sizePixel*2,0,PI/2,CHORD);
				pop();
				
				push();
                //translate(sizePixel/2,sizePixel/2);
				translate(this.diameter/2,this.diameter/2);
				arc(0,0,this.diameter*2+2,this.diameter*2+2,PI,3*PI/2,CHORD);
                //arc(0,0,sizePixel*2,sizePixel*2,PI,3*PI/2,CHORD);
				pop();
			pop(); 
        }
        if(this.status==12){
			// Leaf shape
			push();
				let offset=2;
                translate(this.posX/*+(this.diameter/2)*/,this.posY/*+(this.diameter/2)*/);
				//translate(width/25+(sizePixel*23+12*23),width/25+(sizePixel*13+12*13));
				//fill(222, 90, 4);
				stroke(this.colores[this.indexColor]);
				strokeWeight(1.7);

				push();
				//translate(-sizePixel/2,-sizePixel/2);
                translate(this.diameter/2,-this.diameter/2);
				arc(0,0,this.diameter*2+2,this.diameter*2+2,PI/2,PI,CHORD);
                //arc(0,0,sizePixel*2,sizePixel*2,0,PI/2,CHORD);
				pop();
				
				push();
                //translate(sizePixel/2,sizePixel/2);
				translate(-this.diameter/2,this.diameter/2);
				arc(0,0,this.diameter*2+2,this.diameter*2+2,3*PI/2,2*PI,CHORD);
                //arc(0,0,sizePixel*2,sizePixel*2,PI,3*PI/2,CHORD);
				pop();
			pop(); 
        }
    }

    /*
    showColor(color){
        fill(color);
        ellipse(this.posX,this.posY,this.diameter);
    }
    */

    pixelIsPressed(){
        if(touches.length==1  || touches.length==0){
            if(eraserDragging==false){
                if(dist( mouseX, mouseY, this.posX,this.posY )<(this.diameter/2+7)){
                    if(this.hasChangedColor==false && this.hasChangedStatus==false){
                        this.status=shapeSelected;
                        this.hasChangedColor=true;
                        this.indexColor=colorSelected;

                        //this.colorTemp=this.indexColor;
                        if(this.indexColor<4){
                            //this.indexColor=this.indexColor+1;
                        }else{
                            //this.indexColor=0;
                        }
                    }
                }
                else{
                    this.hasChangedColor=false;
                }
            }
        }
    }

    pixelPinched(){
        if(touches.length==2){
            if(eraserDragging==false){
                if(dist( touches[0].x, touches[0].y , this.posX,this.posY )<(this.diameter/2) && dist(touches[1].x, touches[1].y , this.posX,this.posY )<(this.diameter/2) ){
                    //this.diameter=this.diameter+20;
                    if(this.hasChangedStatus==false && this.hasChangedColor==false){
                        if(this.status<4){
                            this.status=this.status+1;
                        }else{
                            this.status=1;
                        }
                        this.hasChangedStatus=true;
                        //this.indexColor=this.colorTemp;
                    }
                }else{
                    this.hasChangedStatus=false;
                }
                
                /*if(dist( mouseX, mouseY , this.posX,this.posY )>(this.diameter/2)){
                    //this.hasChangedStatus=false;
                }*/
            }
        }
    }

    /*
    changeStatus(){
        if(dist( mouseX, mouseY, this.posX,this.posY )<(this.diameter/2+7)){
            this.status++;
            if(this.status>2){
                this.status=1;
            }
            
            if(this.indexColor>=1){
                this.indexColor=this.indexColor-1;
            }else{
                this.indexColor=3;
            }
        }
    }*/

    resetPixel(){
        if(eraserDragging==true && mouseX>this.posX){
            this.status=1;
            this.indexColor=5;
            this.diameter=sizePixel;
        }
    }
}