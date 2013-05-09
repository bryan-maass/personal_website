//Bryan Maass
//TODO: complete setup function

var width = 1900
var height = 1080

var c = document.createElement("canvas");
var ctx = c.getContext('2d');
c.width = width;
c.height = height;
document.body.appendChild(c);

var FPS = 60
var spacebar = 32 // spacebar keycode
var total_rolls = 0 //times dice were rolled
var rolling = false //flag used to see if we are currently in rolling mode
var player_num = 4
var players = ["Red", "Orange", "Blue", "White"]

function resize_canvas(){
  c.width = window.innerWidth
  c.height = window.innerHeight
  width = c.width
  height = c.height
}

function clear(){
    ctx.fillStyle = grey_maker(200);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();
}

var die_one = 0;
var die_two = 0;
var dice_history = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function roll(){
    die_one = Math.ceil(Math.random() * 6);
    die_two = Math.ceil(Math.random() * 6);
}

function print_dice(){
    scale = (c.width + c.height)
    big_size = scale / 4
    small_size = scale / 35
    ctx.fillStyle = grey_maker(40);
    ctx.font = big_size + "px Arial";
    ctx.textAlign = 'center';
    ctx.fillText(die_one + " " + die_two, width/2, height*.6);
    var step = width / 12

    for(var i=2; i<13; i++){
      var h_offset = step * (i - 1);
      var rolls = dice_history[i];
      var title = i;
      if (die_one + die_two == i)
        title = "[" + title + "]"

      ctx.fillStyle = expected_color_scale(divergence(i))
      ctx.font = small_size + "px Arial";
      ctx.fillText(rolls, h_offset, height * .9);

      ctx.fillStyle = grey_maker(255)
      ctx.font = small_size + "px Arial";
      ctx.fillText(title, h_offset, height * .8);
    }

    ctx.textAlign = "right"
    ctx.fillStyle = grey_maker(255)
    ctx.font = small_size / 2 + "px Arial"
    ctx.fillText("Player: " + players[(total_rolls - 1) % player_num], width *.95, height*.05)
}



//convienience functions
function color_maker(r,g,b){
  return "rgb(" + r + " , " + g + " , " + b + " )"
}
function grey_maker(x){
  return "rgb(" + x + " , " + x + " , " + x + " )"
}

function expected_color_scale(x){
  var g = 80
  var r = 80
  var scale = 70
  color = grey_maker(c)
  if (x > 1)
    g += (x-1) * scale
    if (g > 255)
      g = 254
  if (x < 1)
    r += (1-x) * scale
      if (r > 255)
        r = 254
  return color_maker(Math.round(r), Math.round(g), 80)
}

// x is the number to be rolled, 2, 7 , etc.
// returns the percent that this number "should" be rolled
// 3 for 2, 6 for 3,
// use Math.round when printing this.
function expected(x){
  if (x > 7)
    x = 14 - x
  return (x - 1) / 36;
}

// x is the number rolled
// returns the percentage of times the number rolled compared
// to the number of times its supposed to roll.
// if it's rolling as much as it's expected to,
// this function returns 100.  (100% )
function divergence(x){
  expected_rolls = expected(x) * total_rolls;
  return dice_history[x] / expected_rolls
}

//if a key is down, the event will be in keys_down
var keys_down = {};
addEventListener("keydown", function (e) {
    keys_down[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
    delete keys_down[e.keyCode];
}, false);

function record(){
  dice_history[die_one + die_two] += 1
}

function game_loop(){
  clear();
  print_dice();
  if (spacebar in keys_down){ //rolling mode
    roll();
    rolling = true;
  }
  else if(rolling == true){
    rolling = false;
    total_rolls += 1;
    record();
  }

  gLoop = setTimeout(game_loop, 1000 / FPS);
}

function setup(){
  //how many players?
  //names?
  //initial rolls -> ordering
  game_loop();
}
setup();
