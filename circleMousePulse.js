var canvas = document.querySelector('canvas')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
document.body.style.overflow = 'hidden';


// DOT CONSTRUCTOR
function Dot(x, y, dx, dy, ddx, ddy, dddx, dddy, radius, angle, color, onScreen) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.dx = dx;
    this.dy = dy;
    this.ddx = ddx;
    this.ddy = ddy;
    this.dddx = dddx;
    this.dddy = dddy;
    this.radius = radius;
    this.angle = angle;
    this.color = color;
    this.onScreen = onScreen;//boolean, deletes objects once they go off screen

    this.updatePosition = function () {
        this.x += this.dx;
        this.y += this.dy;

        // prep object for deletion if it is outside useable range
        if (this.x > innerWidth || this.x < 0) {
            this.onScreen = false;
        }
        else if (this.y > innerHeight || this.y < 0) {
            this.onScreen = false;
        }
        this.dx += this.ddx;
        this.dy += this.ddy;
        this.ddx += this.dddx;
        this.ddy += this.dddy;
        this.draw();
    };


    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = color;
        c.strokeStyle = color;
        c.fill();
        c.stroke();
    };

};


// Text constructor
function TextMssg(x, y, yF, dy, dOpacity, color, text){
    this.x = x;
    this.y = y; //starting positions
    this.yOrig = y;
    this.yF = yF; //final position
    this.dy = dy; // fade up velocity
    this.opacity = 0;
    this.dOpacity = dOpacity;
    this.color = color;
    this.text = text;
    
    this.updatePosition = function(){
        this.y -= this.dy;
        this.dy -= 0.2
    };

    this.updateOpacity = function(){
        this.opacity += dOpacity;
        c.globalAlpha = this.opacity;
    };

    this.generateText = function(){
        if (this.y < yF){
            this.updatePosition();
        };

        if(this.y == this.yF){
            this.dy = 0;
        }
        if (this.opacity < 1){
            this.updateOpacity();
        };
        if (this.opacity = 1){
            c.globalAlpha = 1;
        }
        c.font = "4rem reisenberg";
        c.fillStyle = this.color;
        c.textAlign = "center";
        c.strokeStyle = "white";
        c.strokeText(this.text, this.x, this.y);
        c.fillText(this.text, this.x, this.y);
    };
};




// generate dot array
var dotArray = [];
var colorPallet = [];
function init(){
    var dotRadius = 1.5;
    var onScreen = true; 
    var velocity = 1;
    var accel = 0.5;
    var jerk = 0.4;
    var spawnRadius = 30;
    var numObjs = 600;
    var colorPalett = ['#6feb59', '#5983eb', '#5eaaa8', '#eb9859', '#c527ff'];

    for (let i = 0; i < numObjs; i++) {
        color = colorPalett[Math.floor(Math.random() * colorPalett.length)];
        var angle = (i / numObjs) * 180;
        var unitVectorX = Math.sin(angle);
        var unitVectorY = Math.cos(angle);
        var x = mouse.x + (spawnRadius * Math.cos(angle * (Math.PI / 90)));//get x location of circle spawn point;
        var y = mouse.y + (spawnRadius * Math.sin(angle * (Math.PI / 90)));// get y location of circle spawn point;
        var dx = velocity * unitVectorX;
        var dy = velocity * unitVectorY;
        var ddx = accel * unitVectorX;
        var ddy = accel * unitVectorY;
        var dddx = jerk * unitVectorX;
        var dddy = jerk * unitVectorY;

        dotArray.push(new Dot(x, y, dx, dy, ddx, ddy, dddx, dddy, dotRadius, angle, color, onScreen));
        if(dotArray.length > numObjs){
            dotArray.splice(0, dotArray.length - numObjs);
            //only allows one dot cluster on the screen at a time
            //doing it this way instead of just emptying the entire
            //dotArray everytime a button is clicked so that
            //it is easier to reinclude the ability to have multiple
            //clusters on screen at one time
        }
    }
}

var textArray =[];
var myName = new TextMssg(innerWidth / 2, innerHeight / 8, innerHeight / 4, 3, 0.015, "#121013", "Hi, I'm Duncan")
textArray.push(myName);


// animation function
function animate() {
    requestAnimationFrame(animate);

    c.clearRect(0, 0, innerWidth, innerHeight); // clears a section of the canvas, so past frames do not show up
    
    c.lineWidth = 0; //prevent line width from effecting the dots
    c.globalAlpha = 1;
    for (var i = 0; i < dotArray.length; i++) {
        dotArray[i].updatePosition();
        if (dotArray[i].onScreen == false) {
            dotArray.splice(i, 1);
            i -= 1;
        };
    };

    for(var i = 0; i < textArray.length; i++){
        textArray[i].generateText();
    }
    
}

// on-click interaction

var mouse = {
    x: undefined,
    y: undefined
};



window.addEventListener("mousedown", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    origin.x = event.x;
    origin.y = event.y;
 
    init();
    for (var i = 0; i < dotArray.length; i++) {
        dotArray[i].updatePosition();
    }
});




window.addEventListener("mouseup", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (var i = 0; i < dotArray.length; i++) {
        dotArray[i].ddx = -dotArray[i].ddx;
        dotArray[i].ddy = -dotArray[i].ddy;

    }
});

window.addEventListener("resize", function (event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animate();