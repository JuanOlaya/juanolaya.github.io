let pausa=false;
let borderCircleMenu=4;
let speedStroke=0.1;
let shapeGenArt=2; // 1:line  2:crosses  3:rectangles
var velRot=0.09;
var backgroundStatus=true;
var amountShapes=1;
var speedMore=1;
var mailWindow=false;

function generativeArt(){

    if(backgroundStatus){
      background(backgroundColor);
    }
    //console.log("SCREENNNN: "+screen);
    //fill(255);
    //rect(width/2,height/2,20,20);
    if(shapeGenArt==1){
      if(group.length<amountShapes){
        let agent=createAgent();
        group.push(agent);
      }
      if(group2.length<amountShapes){
        let agent=createAgent();
        group2.push(agent);
      }
    }
    if(shapeGenArt==2 || shapeGenArt==3){
      if(group.length<amountShapes){
        let agent=createAgent();
        group.push(agent);
      }
      if(group2.length<amountShapes){
        let agent=createAgent();
        group2.push(agent);
      }
    }
      
    if(touches.length==0 || touches.length==1){
      var mouse = new p5.Vector(mouseX, mouseY);
      for(let agent of group){
        if(!pausa){
          if(mouseIsPressed /*&& mouseButton === LEFT*/){
            seek(agent,mouse, 5);  // mouse
          }
          separate(agent,group, 1);
          align(agent,group );
          cohesion(agent,group,1);
          move(agent);
          wrap(agent);
        }
        render(agent);
      }
      
      for(let agent of group2){
        if(!pausa){
          if(mouseIsPressed /*&& mouseButton === RIGHT*/){
            seek(agent,mouse,5);  // mouse
          }
          separate(agent,group2,1);
          align(agent,group2);
          cohesion(agent,group2,1);
          move(agent);
          wrap(agent);
        }
        render(agent);
      }
    }

    if(touches.length>1){
      let mouse1 = new p5.Vector(touches[0].x, touches[0].y);
      for(let agent of group){
        if(!pausa){
          if(mouseIsPressed /*&& mouseButton === LEFT*/){
            seek(agent,mouse1, 5);  // mouse
          }
          separate(agent,group, 1);
          align(agent,group );
          cohesion(agent,group,1);
          move(agent);
          wrap(agent);
        }
        render(agent);
      }
      
      let mouse2 = new p5.Vector(touches[1].x, touches[1].y);
      for(let agent of group2){
        if(!pausa){
          if(mouseIsPressed /*&& mouseButton === RIGHT*/){
            seek(agent,mouse2,5);  // mouse
          }
          separate(agent,group2,1);
          align(agent,group2);
          cohesion(agent,group2,1);
          move(agent);
          wrap(agent);
        }
        render(agent);
      }
    }
    

      //button on/off menu
      /*
      borderCircleMenu=borderCircleMenu+speedStroke;
      if(borderCircleMenu>7){
        speedStroke=speedStroke*-1;
      }
      if(borderCircleMenu<1){
        speedStroke=speedStroke*-1;
      }
      */
      
      /*
      if(!menuGenerativeArt){
        fill(backgroundColor);
        rectMode(CENTER);
        noStroke();
        rect(50,height-50,49,49);

        stroke(255);
        strokeWeight(borderCircleMenu);
        ellipse(50,height-50,40,40);
      }else{
        fill(backgroundColor);
        rectMode(CENTER);
        noStroke();
        rect(50,height-50,49,49);
        strokeWeight(3.5);
        stroke(255);
        rectMode(CENTER);
        rect(50,height-50,40,40);
        rectMode(CORNER);
      }
      */

      //trail / trazo
      //console.log("TRAXZO BOTON");
      fill(backgroundColor);
      noStroke();
      ellipse(50,height-50,57,57);
      rectMode(CENTER);
      noFill();
      stroke(colorButtons);
      strokeWeight(2);
      rect(40,height-50,16,16);
      rect(45,height-50,16,16);
      rect(50,height-50,16,16);
      fill(colorButtons);
      rect(55,height-50,16,16);


      //button restart
      /*
      fill(backgroundColor);
      noStroke();
      ellipse(50,height-50,57,57);
      strokeWeight(3.5);
      stroke(colorButtons);
      rectMode(CENTER);
      push();
      translate(50,height-50);
      rotate(PI/4);
      rect(0,0,20,38,5);
      //rect(50,height-50,20,40,5);
      fill(colorButtons);
      rect(0,-8,20,22);
      //arc(50,height-41,20,20,0,PI);
      //arc(0,9,20,20,0,PI);
      pop();
      rectMode(CORNER);
      */
      

      //button pause
      if(!pausa){
        fill(backgroundColor);
        noStroke();
        ellipse(120,height-50,57,57);
        fill(colorButtons);
        rectMode(CENTER);
        rect(114,height-50,8,25);
        rect(126,height-50,8,25);
      }else{
        fill(backgroundColor);
        noStroke();
        ellipse(120,height-50,57,57);
        fill(colorButtons);
        triangle(111,height-63,111,height-37,134,height-50);
      }

      //button cross
      fill(backgroundColor);
      noStroke();
      ellipse(190,height-50,57,57);
      stroke(colorButtons);
      strokeWeight(2);
      noFill();
      rectMode(CENTER);
      rect(190,height-50,8,25,50);
      rect(190,height-50,25,8,50);

      //button rect
      fill(backgroundColor);
      noStroke();
      ellipse(260,height-50,57,57);
      stroke(colorButtons);
      strokeWeight(2);
      noFill();
      rectMode(CENTER);
      rect(260,height-50,8,25);
      //rect(190,height-50,25,8);

      //button line
      fill(backgroundColor);
      noStroke();
      ellipse(330,height-50,57,57);
      stroke(colorButtons);
      strokeWeight(2);
      noFill();
      rectMode(CENTER);
      strokeWeight(2);
      line(320,height-45,340,height-55);

      //spped up
      fill(backgroundColor);
      noStroke();
      ellipse(400,height-50,57,57);
      rectMode(CENTER);
      fill(colorButtons);
      rect(400,height-50,5,20);
      rect(400,height-50,20,5);

      //spped down
      fill(backgroundColor);
      noStroke();
      ellipse(470,height-50,57,57);
      rectMode(CENTER);
      fill(colorButtons);
      rect(470,height-50,20,5);

      //amount up
      fill(backgroundColor);
      noStroke();
      ellipse(540,height-50,57,57);
      rectMode(CENTER);
      fill(colorButtons);
      triangle(540,height-60,530,height-40,550,height-40);

      //amount down
      fill(backgroundColor);
      noStroke();
      ellipse(610,height-50,57,57);
      rectMode(CENTER);
      fill(colorButtons);
      triangle(610,height-40,600,height-60,620,height-60);

      

      //mail
      /*
      fill(backgroundColor);
      noStroke();
      ellipse(680,height-50,57,57);
      rectMode(CENTER);
      noFill();
      
      fill(colorButtons);
      rect(680,height-50,30,16,3);
      stroke(backgroundColor);
      strokeWeight(2);
      line(680,height-48,660,height-60);
      line(680,height-48,700,height-60);


      if(mailWindow){
        fill("#6a040f");
        noStroke();
        rectMode(CENTER);
        rect(width/2,height/2,330,200,8);
        //textFont(inconsolata);
        textAlign(LEFT);
        textSize(20);
        textStyle(BOLD);
        fill(0);
        text("Email:",width/2-135,height/2-50);
        textStyle(NORMAL);
        fill("#EC091F");
        rect(width/2,height/2-15,280,40,8);
        fill(0);
        text("juan.olaya@w-hs.de",width/2-130,height/2-15);
        fill("#f48c06");
        rect(width/2,height/2+60,150,40,8);
        fill(0);
        textAlign(CENTER);
        textStyle(BOLD);
        text("Send Canvas",width/2,height/2+60);
      }
      */
      // Printer
      fill(backgroundColor);
      noStroke();
      ellipse(680,height-50,57,57);
      rectMode(CENTER);
      noFill();
      
      fill(colorButtons);
      rect(680,height-50,30,16,3);

      fill(backgroundColor);
      stroke(colorButtons);
      strokeWeight(3);
      rect(680,height-44,20,12);
      strokeWeight(2);
      line(676,height-44,684,height-44);

      fill(backgroundColor);
      stroke(colorButtons);
      strokeWeight(3);
      rect(680,height-59,20,8);

      stroke(backgroundColor);
      strokeWeight(3);
      point(692,height-53);

      /*
      fill(colorButtons);
      stroke(backgroundColor);
      strokeWeight(3);
      rect(680,height-61,20,8);
      */

      rectMode(CORNER);
    }
    
    //-------------------------------------------
    /*
    function mousePressed(){
      let v= new p5.Vector(random(-1,1),random(-1,1));
      applyForce(agent,v);
    }
    */
    
    //-------------------------------------------
    function createAgent(){
      let newAgent= {
        pos: new p5.Vector(random(width), random(height)),
        vel: new p5.Vector(random(-1,1),random(-1,1)),
        acc: new p5.Vector(), 
        //maxspeed: random(6,9),
        maxspeed: random(9,12),
        maxforce: random(0.05,0.2),
        color: random(palette),
        ancho: random(30, 100),
        crossColor: random(crossPalette),
        rectColor: random(rectPalette),
        rot: random(10),
      };
      return newAgent;
    }
    
    //-------------------------------------------
    function render(agent){
      if(shapeGenArt==1){
        rectMode(CENTER);
        //stroke(0);
        strokeWeight(1);
        stroke(agent.color);
        //fill(agent.color);
        //fill(agent.color);
        
        noFill();
        push();
        translate(agent.pos.x, agent.pos.y);
        rotate(agent.vel.heading());
        //rect(0,0,30,15);
        line(-20,0,20,0);
        pop();
      }

      if(shapeGenArt==2){
        if(!pausa){
          agent.rot=agent.rot+velRot;
        }
        push();
        translate(agent.pos.x, agent.pos.y);
        rotate(agent.rot);
        rectMode(CENTER);
        fill(agent.crossColor);
        stroke(0);
				strokeWeight(2);
        rect(0, 0, agent.ancho, agent.ancho/4,50);
    	  rect(0, 0, agent.ancho/4, agent.ancho,50);
        pop();
      }
      if(shapeGenArt==3){
        if(!pausa){
          agent.rot=agent.rot+velRot;
        }
        push();
        translate(agent.pos.x, agent.pos.y);
        rotate(agent.rot);
        rectMode(CENTER);
        fill(agent.rectColor);
        stroke(0);
				strokeWeight(2);
        rect(0, 0, agent.ancho, agent.ancho/4);
    	  //rect(0, 0, agent.ancho/4, agent.ancho,50);
        pop();
      }
    }
    
    //-------------------------------------------
    function move(agent){
      agent.vel.add(agent.acc);
      

      agent.vel.mult(speedMore);
      //agent.vel.mult(damping);  // friction
      agent.pos.add(agent.vel);
      agent.acc.mult(0);
    }
    
    //-------------------------------------------
    function wrap(agent){
      if(agent.pos.x < -100) agent.pos.x = width+100;
      if(agent.pos.y < -100) agent.pos.y = height+100;
      if(agent.pos.x > width+100) agent.pos.x = -100;
      if(agent.pos.y > height+100) agent.pos.y = -100;
    }
    
    
    //-------------------------------------------
    function applyForce(agent, force, strength=1){
      force.mult(strength);
      agent.acc.add(force);
    }
    
    //-------------------------------------------
    function seek(agent,target , strength=1){
      let targetDirection= p5.Vector.sub(target, agent.pos);
      //targetDirection = target - agent.pos
      targetDirection.normalize();
      targetDirection.mult(agent.maxspeed);
      
      /*
      let steer = p5.Vector.sub(targetDirection, agent.vel);
      steer.limit(agent.maxforce);
      applyForce(agent,steer);
      */
      steer(agent,targetDirection, strength);
    }
    //-------------------------------------------
    function steer(agent, targetDirection, strength=1){
      let steer = p5.Vector.sub(targetDirection, agent.vel);
      steer.limit(agent.maxforce);
      applyForce(agent,steer,strength);
    }
    
    //-------------------------------------------
    function separate(agent, group, strength=1){
      let separation = 40;   // radius
      
      let sum= new p5.Vector();
      let count = 0;
      for(let other of group){
        let d= agent.pos.dist(other.pos);
        if(d>0  && d<separation){
          let diff = p5.Vector.sub(agent.pos, other.pos);
          diff.normalize();
          diff.div(d);
          sum.add(diff);
          count++;
        }
      }
      if(count>0){
        sum.div(count);
        sum.setMag(agent.maxspeed);
        steer(agent,sum, strength);
      }
    }
    
    //-------------------------------------------
    function align(agent, group, strength=1){
      let neighborhood = 50;
      
      let sum = new p5.Vector();
      let count = 0;
      
      for(let other of group){
        let d= agent.pos.dist(other.pos);
        if(d>0  && d<neighborhood){
          sum.add(other.vel);  // velocity -> heading
          count++;
        }
      }
      if(count>0){
        sum.div(count);
        sum.normalize();
        sum.mult(agent.maxspeed);
        //sum.setMag(agent.maxspeed);
        steer(agent,sum, strength);
      }
    }
    //-------------------------------------------
    function cohesion(agent, group, strength=1){
      let neighborhood = 50;
      
      let sum = new p5.Vector();
      let count = 0;
      
      for(let other of group){
        let d= agent.pos.dist(other.pos);
        if(d>0  && d<neighborhood){
          sum.add(other.pos);  // velocity -> heading
          count++;
        }
      }
      if(count>0){
        sum.div(count);
        //sum.setMag(agent.maxspeed);
        if(mouseY<height/2){
          steer(agent,sum, strength);
        }else{
          seek(agent,sum, strength);
        }
      }
    }