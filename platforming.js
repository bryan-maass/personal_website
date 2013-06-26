// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 600;
document.body.appendChild(canvas);

var UP = 38
var DOWN = 40
var LEFT = 37
var RIGHT = 39
var P_KEY = 80



// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/bit_map_floor.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/doom.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";


var hero = {
    air_accel: 5,
    jump: -2.5,
    height: 64,
    width: 64,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    drag_coefficient: .99,
    on_ground: false,
    ground_speed: 2.5,
    gravity: .05
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = 0;

    // Throw the monster somewhere on the screen randomly
    monster.x = (Math.random() * (canvas.width - 64));
    monster.y = canvas.height - 64
    hero.on_ground = false
};

var add_drag = function(){
    hero.dx *= hero.drag_coefficient
}

// Update game objects
var update = function (modifier) {
    if(hero.on_ground)
        ground_move(modifier);
    else
        air_move(modifier);

    check_goal_reached();

    enforce_bounds();

    // add_drag();

    hero.y += hero.dy
    hero.x += hero.dx;
};

//modify the hero's dy and dx
var air_move = function(modifier){
    if (DOWN in keysDown) { // Player holding down
        hero.dy += hero.air_accel * modifier;
    }
    if (LEFT in keysDown) { // Player holding left
        hero.dx -= hero.air_accel * modifier;
    }
    if (RIGHT in keysDown) { // Player holding right
        hero.dx += hero.air_accel * modifier;
    }
    hero.dy += hero.gravity;
}

var ground_move = function(modifier){
    modifier = 0
    if (UP in keysDown) { // Player holding up
        hero.on_ground = false;
        hero.dy = hero.jump;
    }
    else if (LEFT in keysDown) { // Player holding left
        hero.dx = -hero.ground_speed;
    }
    else if (RIGHT in keysDown) { // Player holding right
        hero.dx = hero.ground_speed;
    }
    else
        hero.dx = 0
}

var check_goal_reached = function(){
    // Are they touching?
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
        reset();
    }
}

var enforce_bounds = function(){
    //in bounds x
    if (hero.x < 30){
        hero.dx = 0;
        hero.x = 30;
    }
    else if (hero.x > canvas.width - 60){
        hero.dx = 0
        hero.x = canvas.width - 60;
    }
    //in bounds y
    if (hero.y < 30){// top
        hero.dy = 0;
        hero.y = 30;
    }
    //bottom
    else if (hero.y > canvas.height - 40){
        hero.on_ground = true;
        hero.dy = 0;
        hero.y = canvas.height - 40;
    }
}

// var ground_check = function(){
//     feet_at = hero.y + 64
//     for(var i = hero.y+hero.; i<5; i++){
//         if
//     }
// }

var grey_maker = function(x){
  return "rgb(" + x + " , " + x + " , " + x + " )"
}

var clear = function(){
    ctx.fillStyle = grey_maker(255);
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
}

var max_speed = 0
// Draw everything
var render = function () {
    // clear();
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Score
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("dx: " + Math.round(Math.abs(hero.dx)*100)/100, 32, 32);
    ctx.fillText("on ground:" + hero.on_ground, 32, 64)

};



// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
