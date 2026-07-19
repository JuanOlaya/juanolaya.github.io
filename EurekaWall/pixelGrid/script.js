// Standalone ShapyGrid/PixelGrid Application Script

// Global Variables
let pixelList = [];
let sizePixel = 50;
let shapeSelected = 1;
let colorSelected = 0;
let eraserDragging = false;
let backgroundColor = "#1E1E1E";
let backgroundColorShapy = backgroundColor;
let colores = [];
let cols2 = 0;
let rows2 = 0;
let onOffBar = true;
let transitionTriggerPortal = false; // Used in Pixel.js but false here
let backgroundShapy = 1;
let slideIndex = 1;

// p5.js setup
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style("z-index", -1);
    
    colores = ["#484B78", "#E4AA2D", "#C62F40", "#58875D", "#D0692E", backgroundColor];
    bordeAbajo = height - 3 * sizePixel / 2;
    
    textFont('Work Sans');
    
    cols2 = Math.round(38 * (width / 40));
    rows2 = Math.round(36 * (height / 40));
    
    let gap = 7;
    for (let x = width / 18; x < cols2; x = x + (sizePixel + gap)) {
        for (let y = width / 25; y < rows2; y = y + (sizePixel + gap)) {
            pixelList.push(new Pixel(x, y, sizePixel));
        }
    }
    
    // Initialize slideshow
    showSlides(slideIndex);
}

// p5.js draw
function draw() {
    background(backgroundColorShapy);
    
    rectMode(CORNER);
    for (let i = 0; i < pixelList.length; i++) {
        pixelList[i].show();
        pixelList[i].pixelPinched();
    }
    
    if (eraserDragging) {
        noStroke();
        fill("#000");
        strokeWeight(30);
        stroke("#de5a04");
        strokeCap(ROUND);
        line(mouseX, 0, mouseX - 10, height);
        strokeWeight(8);
        stroke("#000");
        line(mouseX, 0, mouseX - 10, height);
    } else {
        fill("#000");
        rect(0, 0, 12, width);
        strokeWeight(3);
        stroke("#de5a04");
        line(5, height / 2 - 30, 5, height / 2 + 30);
        line(5, height / 4 - 30, 5, height / 4 + 30);
        line(5, 3 * height / 4 - 30, 5, 3 * height / 4 + 30);
    }
}

// p5.js window resize
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// p5.js mouse events
function mousePressed() {
    // Check if click is not on the bottom buttons
    if (mouseY < height - 100) {
        for (let i = 0; i < pixelList.length; i++) {
            pixelList[i].pixelIsPressed();
        }
    }
}

function mouseDragged() {
    if (mouseX < 1 * width / 25) {
        eraserDragging = true;
    }
    if (mouseY < height - 100) {
        for (let i = 0; i < pixelList.length; i++) {
            pixelList[i].resetPixel();
            pixelList[i].pixelPinched();
            pixelList[i].pixelIsPressed();
        }
    }
}

function mouseReleased() {
    eraserDragging = false;
    for (let i = 0; i < pixelList.length; i++) {
        pixelList[i].hasChangedColor = false;
        pixelList[i].hasChangedStatus = false;
    }
}

// Pixel Class Definition
class Pixel {
    constructor(xpos, ypos, diameter) {
        this.posX = xpos;
        this.posY = ypos;
        this.diameter = diameter;
        let colorRand = Math.round(random(0, 4));
        if (colorRand == 0 || colorRand == 1) {
            this.indexColor = 5;
        } else {
            this.indexColor = Math.round(random(0, 4));
        }
        
        this.opacity = Math.round(random(51, 254));
        this.brightness = Math.round(random(50, 87));
        this.velOpacity = 3;
        this.velBrightness = 1;
        this.upDown = floor(random(2));
        this.colores = ["#484B78", "#E4AA2D", "#C62F40", "#58875D", "#D0692E", backgroundColorShapy];
        this.hasChangedColor = false;
        this.hasChangedStatus = false;
        this.status = 1;
        this.colorTemp = 0;
    }

    show() {
        if (this.upDown == 0) {
            this.opacity = this.opacity - this.velOpacity;
        }
        if (this.upDown == 1) {
            this.opacity = this.opacity + this.velOpacity;
        }
        if (this.opacity > 255) {
            this.velOpacity = this.velOpacity * -1;
        }
        if (this.opacity < 50) {
            this.velOpacity = this.velOpacity * -1;
        }

        if (this.upDown == 0) {
            this.brightness = this.brightness - this.velBrightness;
        }
        if (this.upDown == 1) {
            this.brightness = this.brightness + this.velBrightness;
        }
        if (this.brightness > 80) {
            this.velBrightness = this.velBrightness * -1;
        }
        if (this.brightness < 35) {
            this.velBrightness = this.velBrightness * -1;
        }

        fill(this.colores[this.indexColor]);

        if (this.status == 1) {
            if (transitionTriggerPortal) {
                this.diameter = this.diameter - 1.5;
                if (this.diameter < 10) {
                    this.diameter = 10;
                }
            }

            ellipse(this.posX, this.posY, this.diameter);
            noFill();
            strokeWeight(5);
            stroke(this.colores[this.indexColor]);
            ellipse(this.posX, this.posY, sizePixel);
            noStroke();
        }

        // 4 rings / Square Outline
        if (this.status == 2) {
            rectMode(CENTER);
            stroke(this.colores[this.indexColor]);
            strokeWeight(5);
            noFill();
            rect(this.posX, this.posY, 50, 50);
            rectMode(CORNER);
            noStroke();
        }

        if (this.status == 3) {
            strokeWeight(5);
            stroke(this.colores[this.indexColor]);
            noFill();
            arc(this.posX - this.diameter / 2, this.posY - this.diameter / 2, this.diameter * 2, this.diameter * 2, 0, PI / 2);
            noStroke();
        }

        if (this.status == 4) {
            strokeWeight(5);
            stroke(this.colores[this.indexColor]);
            noFill();
            arc(this.posX + this.diameter / 2 + 2, this.posY - this.diameter / 2 - 2, this.diameter * 2 + 3, this.diameter * 2 + 3, PI / 2, PI);
            noStroke();
        }

        if (this.status == 5) {
            strokeWeight(5);
            stroke(this.colores[this.indexColor]);
            noFill();
            arc(this.posX - this.diameter / 2 - 2, this.posY + this.diameter / 2 + 2, this.diameter * 2 + 3, this.diameter * 2 + 3, 3 * PI / 2, 2 * PI);
            noStroke();
        }

        if (this.status == 6) {
            strokeWeight(5);
            stroke(this.colores[this.indexColor]);
            noFill();
            arc(this.posX + this.diameter / 2 + 2, this.posY + this.diameter / 2 + 2, this.diameter * 2 + 2, this.diameter * 2, PI, 3 * PI / 2);
            noStroke();
        }

        if (this.status == 7) {
            strokeWeight(2);
            stroke(this.colores[this.indexColor]);
            noFill();
            triangle(this.posX - (this.diameter / 2), this.posY - (this.diameter / 2), this.posX - (this.diameter / 2), this.posY + (this.diameter / 2), this.posX + (this.diameter / 2), this.posY - (this.diameter / 2));
            noStroke();
        }

        if (this.status == 8) {
            strokeWeight(2);
            stroke(this.colores[this.indexColor]);
            noFill();
            triangle(this.posX - (this.diameter / 2), this.posY - (this.diameter / 2), this.posX + (this.diameter / 2), this.posY + (this.diameter / 2), this.posX + (this.diameter / 2), this.posY - (this.diameter / 2));
            noStroke();
        }

        if (this.status == 9) {
            strokeWeight(2);
            stroke(this.colores[this.indexColor]);
            noFill();
            triangle(this.posX - (this.diameter / 2), this.posY - (this.diameter / 2), this.posX + (this.diameter / 2), this.posY + (this.diameter / 2), this.posX - (this.diameter / 2), this.posY + (this.diameter / 2));
            noStroke();
        }

        if (this.status == 10) {
            strokeWeight(2);
            stroke(this.colores[this.indexColor]);
            noFill();
            triangle(this.posX + (this.diameter / 2), this.posY - (this.diameter / 2), this.posX + (this.diameter / 2), this.posY + (this.diameter / 2), this.posX - (this.diameter / 2), this.posY + (this.diameter / 2));
            noStroke();
        }

        if (this.status == 11) {
            push();
            translate(this.posX, this.posY);
            stroke(this.colores[this.indexColor]);
            strokeWeight(1.7);
            noFill();
            push();
            translate(-this.diameter / 2, -this.diameter / 2);
            arc(0, 0, this.diameter * 2 + 2, this.diameter * 2 + 2, 0, PI / 2, CHORD);
            pop();
            push();
            translate(this.diameter / 2, this.diameter / 2);
            arc(0, 0, this.diameter * 2 + 2, this.diameter * 2 + 2, PI, 3 * PI / 2, CHORD);
            pop();
            pop();
        }

        if (this.status == 12) {
            push();
            translate(this.posX, this.posY);
            stroke(this.colores[this.indexColor]);
            strokeWeight(1.7);
            noFill();
            push();
            translate(this.diameter / 2, -this.diameter / 2);
            arc(0, 0, this.diameter * 2 + 2, this.diameter * 2 + 2, PI / 2, PI, CHORD);
            pop();
            push();
            translate(-this.diameter / 2, this.diameter / 2);
            arc(0, 0, this.diameter * 2 + 2, this.diameter * 2 + 2, 3 * PI / 2, 2 * PI, CHORD);
            pop();
            pop();
        }
    }

    pixelIsPressed() {
        if (touches.length == 1 || touches.length == 0) {
            if (eraserDragging == false) {
                if (dist(mouseX, mouseY, this.posX, this.posY) < (this.diameter / 2 + 7)) {
                    if (this.hasChangedColor == false && this.hasChangedStatus == false) {
                        this.status = shapeSelected;
                        this.hasChangedColor = true;
                        this.indexColor = colorSelected;
                    }
                } else {
                    this.hasChangedColor = false;
                }
            }
        }
    }

    pixelPinched() {
        if (touches.length == 2) {
            if (eraserDragging == false) {
                if (dist(touches[0].x, touches[0].y, this.posX, this.posY) < (this.diameter / 2) && dist(touches[1].x, touches[1].y, this.posX, this.posY) < (this.diameter / 2)) {
                    if (this.hasChangedStatus == false && this.hasChangedColor == false) {
                        if (this.status < 12) {
                            this.status = this.status + 1;
                        } else {
                            this.status = 1;
                        }
                        this.hasChangedStatus = true;
                    }
                } else {
                    this.hasChangedStatus = false;
                }
            }
        }
    }

    resetPixel() {
        if (eraserDragging == true && mouseX > this.posX) {
            this.status = 1;
            this.indexColor = 5;
            this.diameter = sizePixel;
        }
    }
}

// UI HTML Event Listeners
document.getElementById("goBackShapyGrid").addEventListener("click", function() {
    window.location.href = "../index.html";
});

document.getElementById("purple").addEventListener("click", function() {
    colorSelected = 0;
});

document.getElementById("yellow").addEventListener("click", function() {
    colorSelected = 1;
});

document.getElementById("pink").addEventListener("click", function() {
    colorSelected = 2;
});

document.getElementById("green").addEventListener("click", function() {
    colorSelected = 3;
});

document.getElementById("orange").addEventListener("click", function() {
    colorSelected = 4;
});

document.getElementById("clean").addEventListener("click", function() {
    colorSelected = 5;
});

document.getElementById("circleShapy").addEventListener("click", function() {
    shapeSelected = 1;
});

document.getElementById("squareShapy").addEventListener("click", function() {
    shapeSelected = 2;
});

document.getElementById("pie1Shapy").addEventListener("click", function() {
    shapeSelected = 3;
});

document.getElementById("pie2Shapy").addEventListener("click", function() {
    shapeSelected = 4;
});

document.getElementById("pie3Shapy").addEventListener("click", function() {
    shapeSelected = 5;
});

document.getElementById("pie4Shapy").addEventListener("click", function() {
    shapeSelected = 6;
});

document.getElementById("triangle1Shapy").addEventListener("click", function() {
    shapeSelected = 7;
});

document.getElementById("triangle2Shapy").addEventListener("click", function() {
    shapeSelected = 8;
});

document.getElementById("triangle3Shapy").addEventListener("click", function() {
    shapeSelected = 9;
});

document.getElementById("triangle4Shapy").addEventListener("click", function() {
    shapeSelected = 10;
});

document.getElementById("leaf1Shapy").addEventListener("click", function() {
    shapeSelected = 11;
});

document.getElementById("leaf2Shapy").addEventListener("click", function() {
    shapeSelected = 12;
});

document.getElementById("backgroundShapy").addEventListener("click", function() {
    if (backgroundShapy < 4) {
        backgroundShapy++;
    } else {
        backgroundShapy = 1;
    }
    
    if (backgroundShapy == 1) {
        backgroundColorShapy = backgroundColor;
    }
    if (backgroundShapy == 2) {
        backgroundColorShapy = "#18111D";
    }
    if (backgroundShapy == 3) {
        backgroundColorShapy = "#FF6600";
    }
    if (backgroundShapy == 4) {
        backgroundColorShapy = "#E1CFA3";
    }

    for (let i = 0; i < pixelList.length; i++) {
        pixelList[i].colores = ["#484B78", "#E4AA2D", "#C62F40", "#58875D", "#D0692E", backgroundColorShapy];
    }
});

// Modal Dialog & Slideshow controls
document.getElementById("cancelInfoScreenShapy").addEventListener("click", function() {
    document.getElementById("infoScreenShapy").style.display = "none";
    slideIndex = 1;
    showSlides(slideIndex);
});

document.getElementById("infoIconShapy").addEventListener("click", function() {
    let modal = document.getElementById("infoScreenShapy");
    if (modal.style.display == "block") {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
    }
    slideIndex = 1;
    showSlides(slideIndex);
});

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = "block";
    }
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].className += " active";
    }
}
