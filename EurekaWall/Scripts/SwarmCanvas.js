let pausa=false;
let borderCircleMenu=4;
let speedStroke=0.1;
let shapeGenArt=2; // 1:line  2:crosses  3:rectangles
var velRot=0.09;
var backgroundStatus=true;
var amountShapes=1;
var speedMore=1;
var mailWindow=false;
var swarmSize1=0.25;
var swarmSize2=1;
var swarmStroke=2;

let particleCanvasSec;
var modeSwarmCanvas=1;   // 1=dancingMode  2=bigBangMode   3=pencilMode
let seekSwarmCanvas=4;

/*
particleCanvasSec=document.getElementById("particleCanvasSection");
particleCanvasSec.style.display = "none";
*/


function generativeArt(){

    if(backgroundStatus){
      if(darkModeSwarmCanvas){
        background(backgroundColor);
      }else{
        background("#F4EDDD");
      }
    }
    //console.log("SCREENNNN: "+screen);
    //fill(255);
    //rect(width/2,height/2,20,20);

    /*
    if(showShapes && mouseIsPressed){
      
      for(let agent of group){
          agent.pos.x=mouseX;
          agent.pos.y=mouseY;
      }
      for(let agent of group2){
          agent.pos.x=mouseX;
          agent.pos.y=mouseY;
      }
    }
    */

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
            seek(agent,mouse, seekSwarmCanvas);  // mouse
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
            seek(agent,mouse, seekSwarmCanvas);  // mouse
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
      /*
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
*/

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
      /*
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
*/
      //button cross
      /*
      fill(backgroundColor);
      noStroke();
      ellipse(190,height-50,57,57);
      stroke(colorButtons);
      strokeWeight(2);
      noFill();
      rectMode(CENTER);
      rect(190,height-50,8,25,50);
      rect(190,height-50,25,8,50);
*/
      //button rect
      /*
      fill(backgroundColor);
      noStroke();
      ellipse(260,height-50,57,57);
      stroke(colorButtons);
      strokeWeight(2);
      noFill();
      rectMode(CENTER);
      rect(260,height-50,8,25);
      //rect(190,height-50,25,8);
*/
      //button line
      /*
      fill(backgroundColor);
      noStroke();
      ellipse(330,height-50,57,57);
      stroke(colorButtons);
      strokeWeight(2);
      noFill();
      rectMode(CENTER);
      strokeWeight(2);
      line(320,height-45,340,height-55);
*/
      //spped up
      /*
      fill(backgroundColor);
      noStroke();
      ellipse(400,height-50,57,57);
      rectMode(CENTER);
      fill(colorButtons);
      rect(400,height-50,5,20);
      rect(400,height-50,20,5);
*/
      //spped down
      /*
      fill(backgroundColor);
      noStroke();
      ellipse(470,height-50,57,57);
      rectMode(CENTER);
      fill(colorButtons);
      rect(470,height-50,20,5);
*/
      //amount up
      /*
      fill(backgroundColor);
      noStroke();
      ellipse(540,height-50,57,57);
      rectMode(CENTER);
      fill(colorButtons);
      triangle(540,height-60,530,height-40,550,height-40);
*/
      //amount down
      /*
      fill(backgroundColor);
      noStroke();
      ellipse(610,height-50,57,57);
      rectMode(CENTER);
      fill(colorButtons);
      triangle(610,height-40,600,height-60,620,height-60);
*/
      

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
      /*
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
      */

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
        maxspeed: random(9,12),  //random(9,12)
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
      
      if(modeSwarmCanvas==3 /*|| modeSwarmCanvas==2*/){
        if(showShapes){
          if(millis()-startingTimePencilMode>50){

          //if (millis() - tiempoInicio > tiempoEspera) {  
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
              strokeWeight(swarmStroke);
              rect(0, 0, agent.ancho*swarmSize2, agent.ancho*swarmSize1,50);
              rect(0, 0, agent.ancho*swarmSize1, agent.ancho*swarmSize2,50);
              pop();
            }
            if(shapeGenArt==3){
              if(!pausa){
                agent.rot=agent.rot+velRot;
              }
              push();
              translate(agent.pos.x, agent.pos.y);
              rotate(agent.rot);
              //rotate(agent.vel.heading());
              rectMode(CENTER);
              fill(agent.rectColor);
              /*
              stroke(0);
              strokeWeight(2);
              */
              stroke(0);
              strokeWeight(swarmStroke);
              rect(0, 0, agent.ancho*swarmSize2, agent.ancho*swarmSize1);
              //rect(0, 0, agent.ancho/4, agent.ancho,50);
              pop();
            }
          }
        }
      }else{
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
          strokeWeight(swarmStroke);
          rect(0, 0, agent.ancho*swarmSize2, agent.ancho*swarmSize1,50);
          rect(0, 0, agent.ancho*swarmSize1, agent.ancho*swarmSize2,50);
          pop();
        }
        if(shapeGenArt==3){
          if(!pausa){
            agent.rot=agent.rot+velRot;
          }
          push();
          translate(agent.pos.x, agent.pos.y);
          rotate(agent.rot);
          //rotate(agent.vel.heading());
          rectMode(CENTER);
          fill(agent.rectColor);
          stroke(0);
          strokeWeight(swarmStroke);
          
          rect(0, 0, agent.ancho*swarmSize2, agent.ancho*swarmSize1);
          //rect(0, 0, agent.ancho/4, agent.ancho,50);
          pop();
        }
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
    function seek(agent,target , strength=10){
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
    function steer(agent, targetDirection, strength=2){
      let steer = p5.Vector.sub(targetDirection, agent.vel);
      steer.limit(agent.maxforce);
      applyForce(agent,steer,strength);
    }
    
    //-------------------------------------------
    function separate(agent, group, strength=0.1){  //strength=1
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
    function cohesion(agent, group, strength=1){  //strength=1
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


document.getElementById("goBackSwarmCanvas").addEventListener("click", function() {
  //defaultCanvas.style.display = "none";
  homeEureka.style.display = "block";
  screen=0;
});


//var elem = document.documentElement;

var darkModeSwarmCanvas = true;

document.getElementById("darkMode").addEventListener("click", function() {
    
    darkModeSwarmCanvas=!darkModeSwarmCanvas;
    if (darkModeSwarmCanvas){
      document.getElementById("darkMode").innerHTML = `light_mode`;
      background(backgroundColor);
    } else{
      document.getElementById("darkMode").innerHTML = `nightlight`;
      background("#F4EDDD");
    }
});



document.getElementById("dancingMode").addEventListener("click", function() {
  modeSwarmCanvas=1;
  backgroundStatus=true;
  seekSwarmCanvas=4;
  if(darkModeSwarmCanvas){
    background(backgroundColor);
  }else{
    background("#F4EDDD");
  }

  swarmSize1=0.25;
  swarmSize2=1;
  swarmStroke=2;

});

document.getElementById("bigBangMode").addEventListener("click", function() {
  modeSwarmCanvas=2;
  backgroundStatus=false;
  seekSwarmCanvas=12;
  if(darkModeSwarmCanvas){
    background(backgroundColor);
  }else{
    background("#F4EDDD");
  }

  swarmSize1=0.25;
  swarmSize2=1;
  swarmStroke=2;

});

document.getElementById("pencilMode").addEventListener("click", function() {
  //modePencil=!modePencil;	
  modeSwarmCanvas=3;
  backgroundStatus=false;
  seekSwarmCanvas=12;
  if(darkModeSwarmCanvas){
    background(backgroundColor);
  }else{
    background("#F4EDDD");
  }

  swarmSize1=0.12;
  swarmSize2=0.50;
  swarmStroke=0.6;

});


document.getElementById("crossShape").addEventListener("click", function() {
  shapeGenArt=2;
}); 

document.getElementById("rectangleShape").addEventListener("click", function() {
  shapeGenArt=3;
}); 

document.getElementById("lineShape").addEventListener("click", function() {
  shapeGenArt=1;
}); 

document.getElementById("amountMore").addEventListener("click", function() {
  if(amountShapes<150){
    amountShapes=amountShapes+3;
  }
});

document.getElementById("amountLess").addEventListener("click", function() {
  if(amountShapes>6){     
    amountShapes=amountShapes-3;
  }
});

document.getElementById("deleteCanvas").addEventListener("click", function() {
  
  if(darkModeSwarmCanvas){
    background(backgroundColor);
  }else{
    background("#F4EDDD");
  }

});

document.getElementById("cancelInfoScreenSwarmCanvas").addEventListener("click", function() {
  document.getElementById("infoScreenSwarmCanvas").style.display="none";
  
  slideIndex=1;
  showSlides(slideIndex);
});

document.getElementById("infoIconSwarmCanvas").addEventListener("click", function() {
  //console.log(document.getElementById("infoScreen").style.display);
  if(document.getElementById("infoScreenSwarmCanvas").style.display=="block"){
      document.getElementById("infoScreenSwarmCanvas").style.display="none";
  }else{
      document.getElementById("infoScreenSwarmCanvas").style.display="block";
  }
  slideIndex=1;
  showSlides(slideIndex);
});

  
  

///////////********** Selection Process ********/////////////

/*
document.getElementById("selectImage").onclick = function (e){
  
  console.log("Button select");
  var input = document.createElement('input');
  input.type= 'file';

  input.onchange = e => {
    files = e.target.files;
    reader = new FileReader();
    reader.onload = function (){
      document.getElementById("myimg").src = reader.result;
    }
    reader.readAsDataURL(files[0]);
  }
  input.click();
}
*/

///////////********** Upload Process ********/////////////


//document.getElementById("saveSwarmCanvas").addEventListener("click", function() {

/*
document.getElementById("upload").onclick = function(){
  var ImgName = document.getElementById("namebox").value;
  var uploadTask = storage.storage().ref('Images'/+ImgName+".png").put(files[0]);

  uploadTask.on('state_changed',function(snapshot){
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
    document.getElementById('UpProgress').innerHTML = 'Upload'+progress+'%';
  },

  function(error){
    alert('error in saving the image');
  },

  function(){
    uploadTask.snapshot.ref.getDownloadURL().then(function(url){
      ImgUrl = url;

      firebase.database().ref('Picture/'+ImgName).set({
        Name: ImagName,
        Link: ImagUrl
      });
      alert('image added successfully');
      }
    );
  });
}
*/

/*
document.getElementById("saveSwarmCanvas").addEventListener("click", function() {
  const ImgName = document.getElementById("namebox").value;
  const archivoRef = ref(storage, 'Images/'+ImgName+".png" );
  await uploadBytes(archivoRef,archivoLocal);
});
*/

/*
document.getElementById("saveSwarmCanvas").addEventListener("click", function() {
  console.log("saveCanvas");
  html2canvas(document.querySelector("#defaultCanvas0")).then(canvas => {
    document.body.appendChild(canvas);
    return Canvas2Image.saveAsPNG(canvas);
    //Canvas2Image.saveAsPNG(canvas);
  });
});
*/




