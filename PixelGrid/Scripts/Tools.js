function tools(){
    background(backgroundColor);

    // AugmentedPixel

    /*
    for(let i=0;i<augmentedPixels.length;i++){
        augmentedPixels[i].show();
        if(mouseIsPressed){
            augmentedPixels[i].detectCollision();
        }
    }
    */

    // ****   Gelsenkirchen Clock   *** 
    /*
    stroke(255);  
    noStroke();
    //fill(244, 122, 158);
    //ellipse(cx, cy, clockDiameter + 25, clockDiameter + 25);
    //fill(237, 34, 93);
    fill(10);
    ellipse(cx, cy, clockDiameter, clockDiameter);

    // Angles for sin() and cos() start at 3 o'clock;
    // subtract HALF_PI to make them start at the top
    let s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
    let m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
    let h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

    // Draw the hands of the clock
    stroke(255);
    strokeWeight(1);
    line(cx, cy, cx + cos(s) * secondsRadius, cy + sin(s) * secondsRadius);
    strokeWeight(2);
    line(cx, cy, cx + cos(m) * minutesRadius, cy + sin(m) * minutesRadius);
    strokeWeight(5);
    line(cx, cy, cx + cos(h) * hoursRadius, cy + sin(h) * hoursRadius);

    // Draw the minute ticks
    strokeWeight(2);
    beginShape(POINTS);
    for (let a = 0; a < 360; a += 6) {
        let angle = radians(a);
        let x = cx + cos(angle) * secondsRadius;
        let y = cy + sin(angle) * secondsRadius;
        vertex(x, y);
    }
    endShape();
    fill(255);
    ellipse(cx, cy, 8, 8);

    let gelsenkirchen = "NEHCRIKNESLEG"
    let gapLettersGE = 80;
    let initialGapGE = 12*(PI/34);

    fill(colorButtons);
    noStroke();
    //strokeWeight(2);
    //textStyle(BOLD);
    //textFont('Helvetica');
    textSize(20);
    for (let i = 0; i < gelsenkirchen.length; i+=1){  // ROUNDED TRIVIA/WINDOW TEXT 
	    let x1,y1;
    	x1 = cx+(clockDiameter/2+15)*cos((i*2*PI/gapLettersGE)+initialGapGE);
        y1 = cy+(clockDiameter/2+15)*sin((i*2*PI/gapLettersGE)+initialGapGE);
        
        push();
        //rotate(i*2*PI/20+PI/4);
        translate(x1,y1);
        rotate((i*2*PI/gapLettersGE)+initialGapGE-PI/2);
        fill(colorButtons);
        text(gelsenkirchen[i],0,0);
        pop();
    }

    // ***  New York Clock   ***
    stroke(255);  
    noStroke();
    //fill(244, 122, 158);
    //ellipse(cx, cy, clockDiameter + 25, clockDiameter + 25);
    fill(40,0,100);
    ellipse(cxNY, cyNY, clockDiameter, clockDiameter);

    // Angles for sin() and cos() start at 3 o'clock;
    // subtract HALF_PI to make them start at the top
    let sNY = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
    let mNY = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
    let hNY = map( (hour()-6) + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

    // Draw the hands of the clock
    stroke(255);
    strokeWeight(1);
    line(cxNY, cyNY, cxNY + cos(sNY) * secondsRadius, cyNY + sin(sNY) * secondsRadius);
    strokeWeight(2);
    line(cxNY, cyNY, cxNY + cos(mNY) * minutesRadius, cyNY + sin(mNY) * minutesRadius);
    strokeWeight(5);
    line(cxNY, cyNY, cxNY + cos(hNY) * hoursRadius, cyNY + sin(hNY) * hoursRadius);

    // Draw the minute ticks
    strokeWeight(2);
    beginShape(POINTS);
    for (let a = 0; a < 360; a += 6) {
        let angle = radians(a);
        let x = cxNY + cos(angle) * secondsRadius;
        let y = cyNY + sin(angle) * secondsRadius;
        vertex(x, y);
    }
    endShape();
    fill(255);
    ellipse(cxNY, cyNY, 8, 8);

    let newyork = "KROY WEN"
    let gapLettersNY = 80;
    let initialGapNY = 12*(PI/30);

    fill(colorButtons);
    noStroke();
    //strokeWeight(2);
    //textStyle(BOLD);
    //textFont('Helvetica');
    textSize(20);
    for (let i = 0; i < newyork.length; i+=1){  // ROUNDED TRIVIA/WINDOW TEXT 
	    let x1,y1;
    	x1 = cxNY+(clockDiameter/2+15)*cos((i*2*PI/gapLettersNY)+initialGapNY);
        y1 = cyNY+(clockDiameter/2+15)*sin((i*2*PI/gapLettersNY)+initialGapNY);
        
        push();
        //rotate(i*2*PI/20+PI/4);
        translate(x1,y1);
        rotate((i*2*PI/gapLettersNY)+initialGapNY-PI/2);
        fill(colorButtons);
        text(newyork[i],0,0);
        pop();
    }

    noFill();
    stroke(colorButtons);
    strokeWeight(30);
    strokeCap(ROUND);
    let diameterW=clockDiameter-130;
    arc(cxWeather, cyWeather, diameterW, diameterW, PI+PI/8, PI-PI/8);

    let contHour=6;
    let posX,posY;
    for(let i=PI+PI/8;i<2*PI+(2*PI/8);i=i+PI/6){
        posX=cxWeather+(diameterW/2)*cos(i);
        posY=cyWeather+(diameterW/2)*sin(i);
        fill(backgroundColor);
        noStroke();
        textStyle(BOLD);
        text(contHour,posX,posY);
        contHour++;
    }
    */

    /*
    if(mouseIsPressed){
        stroke(255);
        strokeWeight(3);
        line(mouseX, mouseY, pmouseX,pmouseY);
    }
    */

    homeButton();
}