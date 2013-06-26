// Bryan Maass

var howManyCircles = 0,
    circles = [],
    left_arrow = 39,
    right_arrrow = 37,
    shuffled = false,
    keyHit = false,
    wind = 0,
    FPS = 60,
    c = document.createElement("canvas"),
    ctx = c.getContext('2d');

ctx.globalCompositeOperation = 'destination-atop';
document.body.appendChild(c);

function resizeCanvas(){
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    shuffle();
}

var keysDown = {};
addEventListener("keydown", function (e) {
    keyHit = true;
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

function clearAll(){
    ctx.fillStyle = '#d0E7F9';
    ctx.beginPath();
    ctx.rect(0, 0, c.width, c.height);
    ctx.closePath();
    ctx.fill();
}

function makeCircle(){
    return {x: Math.random() * c.width,
            y: Math.random() * c.height,
            r: 5 + Math.random() * 10,
            dy: 5,
            alpha: Math.random()};
}

function shuffle(){
    howManyCircles = c.width * c.height / 2000;
    if (circles.length === 0){
        for (var i = 0; i < howManyCircles; i++)
            circles.push(makeCircle());
    }
    else
        for (var k = 0; k < howManyCircles; k++)
            circles[k] = makeCircle();
}

function drawCircles(){
    for (var i = 0; i < howManyCircles; i++){
        cur_circle = circles[i];
        ctx.fillStyle = 'rgba(255, 255, 255, ' + cur_circle.alpha + ')';
        ctx.beginPath();
        ctx.arc(cur_circle.x, cur_circle.y, cur_circle.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
}

function moveCircles(){
    for (var i = 0; i < howManyCircles; i++){
        var circ = circles[i];
        var side = circ.x - circ.r;
        if (circ.y - circ.r > c.height){ //fell off
            circles[i] = makeCircle();
            circles[i].y = -circles[i].r;
        }
        else if(side > c.width){
            circ.x = -2 * circ.r;
        }
        else if(side < -3 * circ.r){
            circ.x = c.width;
        }
        else{
            circ.y += circ.dy;
            circ.x += Math.random() * wind;
        }
    }
}

function modifyWind(){
    if (left_arrow in keysDown) // Player holding left
        wind += 1;
    else if (right_arrrow in keysDown) // Player holding right
        wind -= 1;
    else
        wind -= wind/30;
}

function tutorial(){
    // clearAll();
    if(!shuffled){
        shuffled = true;
        shuffle();
    }

    clearAll();
    drawCircles();

    ctx.beginPath();
    ctx.rect(0, 0, c.width, c.height);
    ctx.fillStyle = 'rgba(124, 138, 149, .5)';
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("Press Left or Right to change the wind!", (c.width-500)/2, c.height/2);
}

function gameLoop(){
    if (!keyHit){
    tutorial();
    }
    else{
        clearAll();
        modifyWind();
        drawCircles();
        moveCircles();
    }
    gLoop = setTimeout(gameLoop, 1000 / FPS);
}

resizeCanvas();
tutorial();
gameLoop();
