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

var clear = function(){
    ctx.fillStyle = grey_maker(200);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();
}

var die_one = 0;
var die_two = 0;
var dice_history = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var roll = function(){
    die_one = Math.ceil(Math.random() * 6);
    die_two = Math.ceil(Math.random() * 6);
}

var print_dice = function(){
    ctx.fillStyle = grey_maker(40);
    ctx.font = "700px Arial";
    ctx.textAlign = 'center';
    ctx.fillText(die_one + " " + die_two, width/2, height/2);
    var step = width/12

    for(var i=2; i<13; i++){
      var h_offset = step * (i - 1);
      var rolls = dice_history[i];
      if (die_one + die_two == i)
        rolls = "[" + rolls + "]"
      var title = i;

      ctx.fillStyle = expected_color_scale(divergence(i))
      ctx.font = "100px Arial";
      ctx.fillText(rolls, h_offset, height - 150);

      ctx.fillStyle = grey_maker(255)
      ctx.font = "120px Arial";
      ctx.fillText(i, h_offset, height - 300);
    }

    ctx.textAlign = "right"
    ctx.fillStyle = grey_maker(255)
    ctx.font = "50px Arial"
    ctx.fillText("Player: " + players[(total_rolls - 1) % player_num], width - 30, 50)
}



//convienience functions
var color_maker = function(r,g,b){
  return "rgb(" + r + " , " + g + " , " + b + " )"
}
var grey_maker = function(x){
  return "rgb(" + x + " , " + x + " , " + x + " )"
}

var expected_color_scale = function(x){
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

// // x is the number to be rolled, 2, 7 , etc.
// // returns the percent that this number "should" be rolled
// // 3 for 2, 6 for 3,
// // use Math.round when printing this.
var expected = function(x){
  if (x > 7)
    x = 14 - x
  return (x - 1) / 36;
}

// // x is the number rolled
// // returns the percentage of times the number rolled compared
// // to the number of times its supposed to roll.
// // if it's rolling as much as it's expected to,
// // this function returns 100.  (100% )
var divergence = function(x){
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

var record = function(){
  dice_history[die_one + die_two] += 1
}



var game_loop = function(){
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

var setup = function(){
  //how many players?
  //names?
  //initial rolls -> ordering
  game_loop();
}

setup();

