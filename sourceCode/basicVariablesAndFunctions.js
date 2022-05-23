//--------------------------------------------------------------------------------------------------------------------------------|Variables
var paused = false;

var screenW = window.innerWidth-1;
var screenH = window.innerHeight-4;
var screenCenter = {x: screenW*.5, y: screenH*.5}
var relevancyBounds = {
  xPos: Math.ceil(screenW *  1.12),
  xNeg: Math.floor(screenW * -0.12),
  yPos: Math.ceil(screenH *  1.2),
  yNeg: Math.floor(screenH * -0.2)
};

var difficultyFactor = 1;
var score = 0;
var renderHitboxes = false;

const gFactor = 0.12;




//--------------------------------------------------------------------------------------------------------------------------------|Controls / Event Listeners
function keyPressed() {
  menu.controls(keyCode);
  if (keyCode == 66)
  {
    console.log(projectiles);
  }
  else if (keyCode == 86)
  {
    console.log(enemies);
  }
  else if (keyCode == 192)
  {
    enemies.push(new enemy(192,128,180));
    let enmyXPos = [];
    for (var i=0; i<enemies.length; i++) {
      enmyXPos.push(enemies[i].x);
    }
    for (var i=128; i<screenW-42; i+=128) {
      if (!enmyXPos.includes(i)) {
        enemies.push(new enemy(i,128,180));
        break;
      }
    }
  }
  else if (keyCode == 49)
  {
    player.gLvl = 0;
  }
  else if (keyCode == 50)
  {
    player.gLvl = 1;
  }
  else if (keyCode == 51)
  {
    player.gLvl = 2;
  }
  else if (keyCode == 72)
  {
    renderHitboxes = !renderHitboxes;
  }
}




//--------------------------------------------------------------------------------------------------------------------------------|Timer
class Timer {
  constructor(duration) {
    this.time = duration;
    this.duration = duration;
    this.iterations = 0;
  }

  isFinished(timeDelta) {
    if (this.time <= 0) {
      this.time = this.duration;
      this.iterations++;
      return true;
    } else {
      this.time -= timeDelta;
    }
  }
}




//--------------------------------------------------------------------------------------------------------------------------------|Setup & Window Resize
function setup() {
  frameRate(30);

  windowResized();
  menu.update();
}


function windowResized() {
  screenW = window.innerWidth-1;
  screenH = window.innerHeight-4;
  screenCenter = {x: screenW*.5, y: screenH*.5}

  canvas = createCanvas(screenW, screenH);
  canvas.position(0, 0, 'absolute');
  canvas.style("display", "block");
  canvas.style("z-index", "-1");

  player.x = screenCenter.x;
  player.y = screenCenter.y;
}




//--------------------------------------------------------------------------------------------------------------------------------|Draw Function
function draw() {
  if (!paused && !player.dead) {
    player.update(deltaTime);
    updateEnemies(deltaTime);
    updateProjectiles(deltaTime);
    testBg.update(deltaTime);

    // background(42,44,48);
    background(30,34,36);

    testBg.draw();
    drawEnemies();
    drawProjectiles();
    player.draw();

    displayPlayerHealth();
    displayPlayerScore();

  } else if (player.dead) {
    displayGameOver();
  }
}
