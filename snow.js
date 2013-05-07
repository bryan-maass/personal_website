// Bryan Maass

var width = 1000
var height = 500
var c = document.createElement("canvas");
var ctx = c.getContext('2d');
c.width = width;
c.height = height;
document.body.appendChild(c);

var wind = 0
var FPS = 60

var keysDown = {};
addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

var Clear = function(){
    ctx.fillStyle = '#d0E7F9';
    ctx.beginPath();
    ctx.rect(0, 0, c.width, c.height);
    ctx.closePath();
    ctx.fill();
}

var howManyCircles = 300, circles = [];
var left_arrow = 37
var right_arrrow = 39

for (var i = 0; i < howManyCircles; i++)
    circles.push([Math.random() * c.width, Math.random() * c.height,
                  Math.random() * 10, Math.random() ]);
//circle[x, y, r, alpha]
//TODO: make objects

var DrawCircles = function(){
    for (var i = 0; i < howManyCircles; i++){
        cur_circle = circles[i];
        ctx.fillStyle = 'rgba(255, 255, 255, ' + cur_circle[3] + ')';
        ctx.beginPath();
        ctx.arc(cur_circle[0], cur_circle[1], cur_circle[2], 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
}

var MoveCircles = function(x){
    for (var i = 0; i < howManyCircles; i++){
        if (circles[i][1] - circles[i][2] > c.height){
            circles[i][0] = Math.random() * c.width;
            circles[i][2] = Math.random() * 10;
            circles[i][1] = -circles[i][2];
            circles[i][3] = Math.random();
        }
        else if(circles[i][0] - circles[i][2] > c.width){
            circles[i][0] = -circles[i][3]
        }
        else if(circles[i][0] - circles[i][2] < -circles[i][3] - 20){
            circles[i][0] = c.width + circles[i][3]
        }
        else{
            circles[i][1] += 2;
            circles[i][0] += Math.random() * wind;
        }

    }
}

var ModifyWind = function(){
    if (left_arrow in keysDown) { // Player holding left
        wind += 1;
    }
    else if (right_arrrow in keysDown) { // Player holding right
        wind -= 1;
    }
    else
        wind -= wind/30
}

var GameLoop = function(){
  Clear();
  DrawCircles();
  ModifyWind();
  MoveCircles(10);
  gLoop = setTimeout(GameLoop, 1000 / FPS);
}

GameLoop();
