let offsetX=107;
function paintingPixels(){
    
    background(backgroundColor);
    rectMode(CORNER);
    for(let i=0;i<pixelList.length;i++){
        pixelList[i].show();
        pixelList[i].pixelPinched();
    }
    //pixelList[0].show();

        // COLOR PALETTE //
    let cols3=Math.round((width/40));
    let rows3=Math.round((height/40));

    if(onOffBar){

        fill(50);
        
        rect(width/25+26,bordeAbajo-35,382,100,10);

        fill("#484B78");
        stroke(0);
        strokeWeight(4);
        ellipse(width/25+(sizePixel*1+12*1),bordeAbajo,sizePixel,sizePixel);

        if( dist(mouseX,mouseY,width/25+(sizePixel*1+12*1),bordeAbajo)<sizePixel/2){
            colorSelected=0;
        }

        fill("#E4AA2D");
        stroke(0);
        strokeWeight(4);
        ellipse(width/25+(sizePixel*2+12*2),bordeAbajo,sizePixel,sizePixel);

        if( dist(mouseX,mouseY,width/25+(sizePixel*2+12*2),bordeAbajo)<sizePixel/2){
            colorSelected=1;
        }

        fill("#C62F40");
        strokeWeight(4);
        ellipse(width/25+(sizePixel*3+12*3),bordeAbajo,sizePixel,sizePixel);

        if( dist(mouseX,mouseY,width/25+(sizePixel*3+12*3),bordeAbajo)<sizePixel/2){
            colorSelected=2;
        }

        fill("#58875D");
        strokeWeight(4);
        ellipse(width/25+(sizePixel*4+12*4),bordeAbajo,sizePixel,sizePixel);

        if( dist(mouseX,mouseY,width/25+(sizePixel*4+12*4),bordeAbajo)<sizePixel/2){
            colorSelected=3;
        }

        fill("#D0692E");
        strokeWeight(4);
        ellipse(width/25+(sizePixel*5+12*5),bordeAbajo,sizePixel,sizePixel);

        if( dist(mouseX,mouseY,width/25+(sizePixel*5+12*5),bordeAbajo)<sizePixel/2){
            colorSelected=4;
        }

        //fill("#EFD8B9");
        //stroke(0);
        
        //noFill();
        fill(backgroundColor);
        strokeWeight(4);
        ellipse(width/25+(sizePixel*6+12*6),bordeAbajo,sizePixel,sizePixel);
        noStroke();

        if( dist(mouseX,mouseY,width/25+(sizePixel*6+12*6),bordeAbajo)<sizePixel/2){
            colorSelected=5;
        }
    }

    // ON/OFF BAR BUTTON
    fill("#EFD8B9");
    if(!onOffBar){
        ellipse(350*width/1000,bordeAbajo,sizePixel/2,sizePixel/2);
    }else{
        ellipse(365*width/1000,bordeAbajo,sizePixel/2,sizePixel/2);
    }
    noFill();
    stroke("#EFD8B9");
    strokeWeight(2);
    rect(342*width/1000,bordeAbajo-sizePixel/4-2,60,sizePixel/2+4,20);
    noStroke();
    
    if(onOffBar){
        // Shape1: CONVENTIONAL PIXEL //

        
        fill(50);
        rect(-offsetX+441*width/1000,bordeAbajo-35,750,100,10);

        if( dist(mouseX,mouseY,width/25+(sizePixel*13+12*13),bordeAbajo)<sizePixel/2){
            shapeSelected=1;
        }

        fill(colores[colorSelected]);
        ellipse(width/25+(sizePixel*13+12*13),bordeAbajo,sizePixel,sizePixel);

        // Shape2: Square // 
        /*
        for(let i=0; i<4 ;i++){
            //stroke(this.colores[this.indexColor]);
            stroke(222, 90, 4);
            strokeWeight(2.2);
            noFill();
            ellipse(width/25+(sizePixel*14+12*14),width/25+(sizePixel*13+12*13),(i+1)*sizePixel/4);
        }
        noStroke();
        */
        rectMode(CENTER);
        rect(width/25+(sizePixel*14+12*14),bordeAbajo,sizePixel,sizePixel);
        rectMode(CORNER);

        if( dist(mouseX,mouseY,width/25+(sizePixel*14+12*14),bordeAbajo)<sizePixel/2){
            shapeSelected=2;
        }

        //  Shape3: Square rounded in right-down//
        
        /*
        strokeWeight(5);
        stroke(222, 90, 4);
        ellipse(width/25+(sizePixel*15+12*15),width/25+(sizePixel*13+12*13),sizePixel/2);
        //noFill();
        strokeWeight(5);
        stroke(222, 90, 4);
        ellipse(width/25+(sizePixel*15+12*15),width/25+(sizePixel*13+12*13),sizePixel);
        fill(255);
        noStroke();
        */
        
        //stroke(222, 90, 4);
        fill(colores[colorSelected]);
        noStroke();
        arc(width/25+(sizePixel*15+12*15)-(sizePixel/2),bordeAbajo-(sizePixel/2),sizePixel*2,sizePixel*2,0,PI/2);
        

        if( dist(mouseX,mouseY,width/25+(sizePixel*15+12*15),bordeAbajo)<sizePixel/2){
            shapeSelected=3;
        }

        
        //   Shape4: Square   //
        //stroke(222, 90, 4);
        noStroke();
        fill(colores[colorSelected]);
        strokeCap(SQUARE);
        arc(width/25+(sizePixel*16+12*16)+(sizePixel/2),bordeAbajo-(sizePixel/2),sizePixel*2,sizePixel*2,PI/2,PI);
        //
        /*
        push();
        translate(width/25+(sizePixel*16+12*16),width/25+(sizePixel*13+12*13));
        fill(222, 90, 4);
        
        for(let i=0;i<PI;i=i+PI/8){
            rotate(i);
            rect(-sizePixel/2,-1.8,sizePixel,3.6);
        }
        pop();


        */
        if( dist(mouseX,mouseY,width/25+(sizePixel*16+12*16),bordeAbajo)<sizePixel/2){
            shapeSelected=4;
        }

        // Shape 5:  //
        //stroke(222, 90, 4);
        fill(colores[colorSelected]);
        noStroke();
        strokeCap(SQUARE);
        arc( width/25+(sizePixel*17+12*17)-(sizePixel/2),bordeAbajo+(sizePixel/2) ,sizePixel*2,sizePixel*2,3*PI/2,2*PI);
        
        if( dist(mouseX,mouseY,width/25+(sizePixel*17+12*17),bordeAbajo)<sizePixel/2){
            shapeSelected=5;
        }

        /* Era Cool shape
        push();
            let offset=2;
            translate(width/25+(sizePixel*17+12*17),width/25+(sizePixel*13+12*13));
            fill(222, 90, 4);
            stroke(222, 90, 4);
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

        
        // Shape 6:  //
        //stroke(222, 90, 4);
        fill(colores[colorSelected]);
        noStroke();
        strokeCap(SQUARE);
        arc( width/25+(sizePixel*18+12*18)+(sizePixel/2),bordeAbajo+(sizePixel/2) ,sizePixel*2,sizePixel*2,PI,3*PI/2);
        
        if( dist(mouseX,mouseY,width/25+(sizePixel*18+12*18),bordeAbajo)<sizePixel/2){
            shapeSelected=6;
        }

        // Shape 7:  //
        //stroke(222, 90, 4);
        fill(colores[colorSelected]);
        noStroke();
        //arc( width/25+(sizePixel*18+12*18)+(sizePixel/2),width/25+(sizePixel*13+12*13)+(sizePixel/2) ,sizePixel*2,sizePixel*2,PI,3*PI/2);
        triangle( width/25+(sizePixel*19+12*19)-(sizePixel/2),bordeAbajo-(sizePixel/2), width/25+(sizePixel*19+12*19)-(sizePixel/2),bordeAbajo+(sizePixel/2), width/25+(sizePixel*19+12*19)+(sizePixel/2),bordeAbajo-(sizePixel/2) );
        
        if( dist(mouseX,mouseY,width/25+(sizePixel*19+12*19),bordeAbajo)<sizePixel/2){
            shapeSelected=7;
        }

        // Shape 8:  //
        //stroke(222, 90, 4);
        fill(colores[colorSelected]);
        noStroke();
        //arc( width/25+(sizePixel*18+12*18)+(sizePixel/2),width/25+(sizePixel*13+12*13)+(sizePixel/2) ,sizePixel*2,sizePixel*2,PI,3*PI/2);
        triangle( width/25+(sizePixel*20+12*20)-(sizePixel/2),bordeAbajo-(sizePixel/2), width/25+(sizePixel*20+12*20)+(sizePixel/2),bordeAbajo+(sizePixel/2), width/25+(sizePixel*20+12*20)+(sizePixel/2),bordeAbajo-(sizePixel/2) );
        
        if( dist(mouseX,mouseY,width/25+(sizePixel*20+12*20),bordeAbajo)<sizePixel/2){
            shapeSelected=8;
        }

        // Shape 9:  //
        //stroke(222, 90, 4);
        fill(colores[colorSelected]);
        noStroke();
        //arc( width/25+(sizePixel*18+12*18)+(sizePixel/2),width/25+(sizePixel*13+12*13)+(sizePixel/2) ,sizePixel*2,sizePixel*2,PI,3*PI/2);
        triangle( width/25+(sizePixel*21+12*21)-(sizePixel/2),bordeAbajo-(sizePixel/2), width/25+(sizePixel*21+12*21)+(sizePixel/2),bordeAbajo+(sizePixel/2), width/25+(sizePixel*21+12*21)-(sizePixel/2),bordeAbajo+(sizePixel/2) );
        
        if( dist(mouseX,mouseY,width/25+(sizePixel*21+12*21),bordeAbajo)<sizePixel/2){
            shapeSelected=9;
        }

        // Shape 10: triangle //
        //stroke(222, 90, 4);
        fill(colores[colorSelected]);
        noStroke();
        //arc( width/25+(sizePixel*18+12*18)+(sizePixel/2),width/25+(sizePixel*13+12*13)+(sizePixel/2) ,sizePixel*2,sizePixel*2,PI,3*PI/2);
        triangle( width/25+(sizePixel*22+12*22)+(sizePixel/2),bordeAbajo-(sizePixel/2), width/25+(sizePixel*22+12*22)+(sizePixel/2),bordeAbajo+(sizePixel/2), width/25+(sizePixel*22+12*22)-(sizePixel/2),bordeAbajo+(sizePixel/2) );
        
        if( dist(mouseX,mouseY,width/25+(sizePixel*22+12*22),bordeAbajo)<sizePixel/2){
            shapeSelected=10;
        }

        // Shape 11: leaf //
        //stroke(222, 90, 4);
        fill(colores[colorSelected]);
        noStroke();
        
        // Era Cool shape
        push();
            let offset=2;
            translate(width/25+(sizePixel*23+12*23),bordeAbajo);
            fill(colores[colorSelected]);
            stroke(colores[colorSelected]);
            strokeWeight(0.5);

            push();
            translate(-sizePixel/2,-sizePixel/2);
            arc(0,0,sizePixel*2,sizePixel*2,0,PI/2,CHORD);
            pop();
            
            push();
            translate(sizePixel/2,sizePixel/2);
            arc(0,0,sizePixel*2,sizePixel*2,PI,3*PI/2,CHORD);
            pop();
            
        pop(); 
        if( dist(mouseX,mouseY,width/25+(sizePixel*23+12*23),bordeAbajo)<sizePixel/2){
            shapeSelected=11;
        }

        // Shape 12: leaf //
        //stroke(222, 90, 4);
        fill(colores[colorSelected]);
        noStroke();
        
        // Era Cool shape
        push();
            //let offset=2;
            translate(width/25+(sizePixel*24+12*24),bordeAbajo);
            fill(colores[colorSelected]);
            stroke(colores[colorSelected]);
            strokeWeight(0.5);

            push();
            translate(sizePixel/2,-sizePixel/2);
            arc(0,0,sizePixel*2,sizePixel*2,PI/2,PI,CHORD);
            pop();
            
            push();
            translate(-sizePixel/2,sizePixel/2);
            arc(0,0,sizePixel*2,sizePixel*2,3*PI/2,2*PI,CHORD);
            pop();

        pop(); 
        if( dist(mouseX,mouseY,width/25+(sizePixel*24+12*24),bordeAbajo)<sizePixel/2){
            shapeSelected=12;
        }
    }

    if(eraserDragging){
        //stroke("#4A2A18");
        noStroke();
        fill("#000000");  //060201
        //rect(0,0,mouseX,width);
        strokeWeight(30);
        stroke("#de5a04");
        strokeCap(ROUND);
        line(mouseX,0 /*10*height/200*/,mouseX-10,height/*190*height/200*/);
        strokeWeight(8);
        stroke("#000000");
        line(mouseX,0 /*12*height/200*/,mouseX-10,height/*188*height/200*/);
    }
    else{
        fill("#000000");
        rect(0,0,12,width);
        strokeWeight(3);
        stroke("#de5a04");
        line(5,height/2-30,5,height/2+30);
        line(5,height/4-30,5,height/4+30);
        line(5,3*height/4-30,5,3*height/4+30);
    }


}

function pixelWave(){ 
    
    //pixelGrid[0][0].show();
    /*for(let i=0;i<cols;i++){
        for(let j=0;j<rows;j++){
            pixelGrid[i][j].show();
        }
    }
    */

    /*
    while(i<rows){
        
        for(let j=0;j<rows2;j++){
            for(let k=0;k<rows2;k++){

            }
        }
        i++;
    }
    */
}

