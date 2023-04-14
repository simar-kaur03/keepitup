var canvas;
var ctx;
var w = 1000;
var h = 700;

var score = 0;
var gameOver = false;
var start = false;
var showRules = true;


var ball = {
    x: w/2,
    changeX: 0,
    y: 100,
    changeY: 8,
    w: 100,
    h: 100,
    r: 30,
    c: 205,
    a: 1,
}

var platforms = []; 
var dangerPlatforms = [];

// the platfroms moving, gap and size
var gap = 100;
for (var p = 0; p < 10; p++) { 
  var platform = {
    w: randi(70) + 90, 
    h: 20,
    x: p * (gap + randi(230)), 
    changeX: 3,
    y: h -100,
    c: 210,
    a: 2,
  };
  platforms.push(platform); 
  gap = platform.w + randi(40);
}


setUpCanvas();

draw();


document.onkeydown = onkeydown;

function draw(){
  clear();

  if (!start) {
    // Display rules and press space to start
    ctx.font = "bold 35px Arial";
    ctx.fillStyle = "orange";
    ctx.fillText("Instructions:", w / 2 - 100, h / 2 - 100)
    // ctx.fillText("Press Spacebar to Start!", w / 2 - 170, h / 2 - 130);
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    // ctx.fillText("Instructions:", w / 2 - 50, h / 2 - 90)
    ctx.fillText("- In this game you have to keep the ball bouncing!", w / 2 - 230, h / 2 - 60);
    ctx.fillText("- Use the left and right arrow keys to move the ball", w / 2 - 230, h / 2 - 30);
    ctx.fillText("- Avoid falling off the screen or hitting red/dangerous platforms", w / 2 - 230, h / 2);
    ctx.fillText("- Land on blue platforms to score points", w / 2 - 230, h / 2 + 30);
    ctx.fillText("- PRESS SPACEBAR TO START PLAYING", w / 2 - 230, h / 2 + 60);
    return;  
  }


  drawScore();

  drawBall(ball);
  updateBall(ball);
  collisionBall(ball);

  for (var p = 0; p < platforms.length; p++) { 
    drawPlatform(platforms[p]);
    updatePlatform(platforms[p]);

  }

  for (var p = 0; p < dangerPlatforms.length; p++) { 
    drawDangerPlatform(dangerPlatforms[p]);
    updateDangerPlatform(dangerPlatforms[p]);
    collisionDangerPlatform(dangerPlatforms[p]); 
  }

  setInterval(createDangerPlatform, 5000);

  if (gameOver) {
    // Display game over
    ctx.font = "bold 60px Arial";
    ctx.fillStyle = "orange";
    ctx.fillText("Game Over", w / 2 - 150, h / 2 - 10);

        // Draw restart button
        ctx.font = "bold 25px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Click to Restart", w / 2 - 83 , h / 2 + 35 );
        // Add event listener to restart button
        canvas.addEventListener("click", restartGame);

  } else {
    requestAnimationFrame(draw);
  }
}



function onkeydown(event){

    if (event.code === "Space") {
    console.log("spacebar")
    start = true;
    draw();   
    }

    if (event.code === "ArrowLeft") {
        console.log("left")
        ball.changeX = -5;
    }

    if (event.code === "ArrowRight") {
        console.log("right")
        ball.changeX = 5;
    }
}

function restartGame() {
    score = 0;
    gameOver = false;
    ball.x = w / 2;
    ball.changeX = 0;
    ball.y = 100;
    ball.changeY = 8;
    platforms = []; 
  
    gap = 100;
    for (var p = 0; p < 10; p++) { 
      var platform = {
        w: randi(70) + 90, 
        h: 20,
        x: p * (gap + randi(200)), 
        changeX: 3,
        y: h -100,
        c: 210,
        a: 2,
      };
      platforms.push(platform); 
      gap = platform.w + randi(40);
    }
  
    dangerPlatforms = []; 
  clearInterval(createDangerPlatform.interval); 

  canvas.removeEventListener("click", restartGame);
  
  draw();
}


function drawScore(){
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 20, 50);
}


function drawBall(ball){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, 2*Math.PI)
    ctx.fillStyle = "hsla("+ball.c+", 100%, 50%, "+ball.a+")"
    ctx.fill();
}

function updateBall(){

      if (ball.y - ball.r < 0 ) { 
        ball.y = ball.r;
        ball.changeY = -ball.changeY;
      }
      if (ball.x - ball.r < 0 || ball.x + ball.r > w) { 
        ball.changeX = -ball.changeX;
      }
      if ( ball.y > h) {
        gameOver = true;
        return;
      }
      if (ball.x - ball.r < 0 ) { 
        ball.x = ball.r;
        ball.changeX = -ball.changeX;
      }
      
      if (ball.x + ball.r > w ) { 
        ball.x = w - ball.r;
        ball.changeX = -ball.changeX;
      }
      
      ball.y += ball.changeY;
      ball.x += ball.changeX;
}

function collisionBall() {
  for (var p = 0; p < platforms.length; p++) { 
    var platform = platforms[p];
    if (ball.x + ball.r > platform.x && 
        ball.x - ball.r < platform.x + platform.w && 
        ball.y + ball.r > platform.y && ball.y - ball.r < platform.y + platform.h) {
      // collision detected
      if (ball.changeY > 0) { // ball is moving downwards
        ball.changeY = -ball.changeY;
        score++;
        if (score % 5 == 0) {
          ball.changeY = ball.changeY - 0.75;
        }
      }
    }
  }
}



function drawPlatform(platform){ 
  ctx.beginPath();
  ctx.rect(platform.x, platform.y, platform.w, platform.h);
  ctx.fillStyle ="hsla("+platform.c+", 100%, 50%, "+platform.a+")";
  ctx.fill();
  ctx.closePath();
}

function updatePlatform(platform){ 
  platform.x += platform.changeX;
  if (platform.x - platform.w > w ) { 
    platform.x = -platform.w;
  }
  // tried speeding up the platfroms as score goes up but i think it made the game easier 
  // if (score > 0 && score % 5 == 0) {
  //   platform.changeX += 0.008;
  // }
}

function createDangerPlatform() {

    if (dangerPlatforms.length > 0) {
      return;
    }

var maxDangerPlatforms = Math.min(Math.floor(score /10) + 1, 5);
for (var i = 0; i < maxDangerPlatforms; i++) {
  var dangerPlatform = {
      w: randi(70) + 50,
      h: 30,
      x: randi(w - 200) ,
      y: -50 ,
      c: 0,
      a: 1,
      changeY: 3,
    };

  // calculate distance between center of ball and center of danger platform
  var dx = dangerPlatform.x + dangerPlatform.w/2 - ball.x;
  var dy = dangerPlatform.y + dangerPlatform.h/2 - ball.y;
  var distance = Math.sqrt(dx * dx + dy * dy);

  // add danger platform to array and draw it if distance is greater than 60 pixels
  if (distance > 40) {
    dangerPlatforms.push(dangerPlatform);
    drawDangerPlatform(dangerPlatform);
    }
  }
} 

function drawDangerPlatform(dangerPlatform) {
    ctx.beginPath();
    ctx.rect(dangerPlatform.x, dangerPlatform.y, dangerPlatform.w, dangerPlatform.h);
    ctx.fillStyle = "hsla(" + dangerPlatform.c + ", 100%, 50%, " + dangerPlatform.a + ")";
    ctx.fill();
    ctx.closePath();
}
    
function updateDangerPlatform(dangerPlatform) {

    dangerPlatform.y += 2;
    if (dangerPlatform.y > h) {
      var index = dangerPlatforms.indexOf(dangerPlatform);
      if (index > -1) {
        dangerPlatforms.splice(index, 1);
      }
    }

}
    
function collisionDangerPlatform() {
    for (var p = 0; p < dangerPlatforms.length; p++) {
    var dangerPlatform = dangerPlatforms[p];
    if (ball.x + ball.r > dangerPlatform.x &&
    ball.x - ball.r < dangerPlatform.x + dangerPlatform.w &&
    ball.y + ball.r > dangerPlatform.y && ball.y - ball.r < dangerPlatform.y + dangerPlatform.h) {
    // collision detected
    gameOver = true;
    return;
    }
  }
}

function clear(){
  ctx.clearRect(0,0,w,h)
}

function rand(range){
    var r = Math.random()*range;
    return r
}

function randi(range){
  var r = Math.floor(Math.random()*range);
  return r
}

function randn(range){
    var r = Math.random()*range-range/2;
    return r 
}

function setUpCanvas(){
  canvas = document.querySelector("#myCanvas");
  canvas.width = w;
  canvas.height = h;
  canvas.style.border = "1px solid grey";
  ctx = canvas.getContext("2d")
}

console.log("game");
