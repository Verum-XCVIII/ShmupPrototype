//--------------------------------------------------------------------------------------------------------------------------------|Class - Enemy
class enemyClass {
  constructor(x,y, rot) {
    this.x = x;
    this.y = y;
    this.sb = 0.04;      // Base Speed
    this.s = this.sb;   // Speed
    this.sBlt = 0.4;    // Bullet Speed
    this.dmg = 1;       // Damage
    this.h = 2;         // Health
    this.it = 128;      // Invincibility Time (in milliseconds)
    this.i = false;     // Invincible?
    this.iTime = this.it;

    this.sc = 64;       // Scale
    this.hbxNeg = 42;   // Hit Box X Negative
    this.hbxPos = 42;   // Hit Box X Positive
    this.hbyNeg = 26;   // Hit Box Y Negative
    this.hbyPos = 34;   // Hit Box Y Positive

    this.dat = 512;     // Death Animation Time
    this.dTime = this.dat;

    this.c = [140,72,54,255]; // Color (rgba)
    this.cd = [140,72,54,255]; // Default Color
    this.ci = [224,118,112,220]; // Invincible Color
    this.playAni = [false, false, false];

    this.rot = rot; // Rotation
    this.moveDirection = this.x < screenCenter.x ? 1 : -1;
    this.dead = false;

    this.scoreGiven = false;
  }


  update(timeDelta) {
    if (this.i) {
      if (this.iTime <= 0) {
        this.i = false;
      } else {
        this.iTime -= timeDelta;
      }
    } else if (!player.i && !this.dead) {
      this.playerCollisionCheck();
    }

    this.movement(timeDelta);
    this.relevancyCheck(timeDelta);
  }


  playerCollisionCheck() {
    if ( this.x-this.hbxNeg < player.x+player.hbxPos
      && this.x+this.hbxPos > player.x-player.hbxNeg
      && this.y-this.hbyNeg < player.y+player.hbyPos
      && this.y+this.hbyPos > player.y-player.hbyNeg
    ) {
      player.damage(this.dmg);
      this.damage(4);
    }
  }


  movement(timeDelta) {
    this.x += this.s * this.moveDirection * timeDelta;

    this.y += this.s * timeDelta;
  }


  relevancyCheck(timeDelta) {
    if (this.y > relevancyBounds.yPos)
    {
      if (!this.scoreGiven) {
        score--;
        this.scoreGiven = true;
      }

      // enemies.splice(enemies.indexOf(this), 1);
      enemiesToRemove.push(enemies.indexOf(this));
    }
    else if (this.dead)
    {
      if (this.dTime <= 0) {
        if (!this.scoreGiven) {
          score++;
          this.scoreGiven = true;
        }

        this.dead = false;
        // enemies.splice(enemies.indexOf(this), 1);
        enemiesToRemove.push(enemies.indexOf(this));
      } else {
        this.dTime -= 1 + timeDelta;
      }
    }
  }


  damage(dmg) {
    // if (typeof dmg == "undefined") { dmg = 1; }

    this.i = true;
    this.iTime = this.it;
    this.h -= dmg;

    if (this.h <= 0) {
      this.dead = true;
      var enemy = this;

      enemy.playAni[2] = true;

      setTimeout(function() {
        enemy.playAni[1]=true;
      }, enemy.dat/3);

      setTimeout(function() {
        enemy.playAni[0]=true;
      }, enemy.dat/1.5);
    }
  }


  deathAni(sc,fc,m,d,sw) {
    if (typeof m == 'undefined') { m = 1; }
    if (typeof sw == 'undefined') { sw = 4; }
    if (typeof d == 'undefined') { d = 0; }
    angleMode(DEGREES);
    translate(this.x, this.y);
    rotate(d);
    strokeWeight(sw);
    stroke(sc[0],sc[1],sc[2],sc[3]);
    fill(fc[0],fc[1],fc[2],fc[3]);
    beginShape();
    vertex(-44*m,0);
    vertex(-22*m,-9*m);
    vertex(-31*m,-31*m);
    vertex(-9*m,-22*m);
    vertex(0,-44*m);
    vertex(9*m,-22*m);
    vertex(31*m,-31*m);
    vertex(22*m,-9*m);
    vertex(44*m,0);
    vertex(22*m,9*m);
    vertex(31*m,31*m);
    vertex(9*m,22*m);
    vertex(0,44*m);
    vertex(-9*m,22*m);
    vertex(-31*m,31*m);
    vertex(-22*m,9*m);
    vertex(-44*m,0);
    endShape();
    rotate(-d);
    translate(-this.x,-this.y);
  }


  drawHitBox() {
    strokeWeight(2);
    stroke(214);
    noFill();
    rect(this.x-this.hbxNeg-1,this.y-this.hbyNeg-1, this.hbxNeg+this.hbxPos+1,this.hbyNeg+this.hbyPos+1);
  }


  display() {
    angleMode(DEGREES);
    strokeWeight(0);

    if (this.i) {
      fill(this.ci[0],this.ci[1],this.ci[2],this.ci[3]);
    } else {
      fill(this.c[0],this.c[1],this.c[2],this.c[3]);
    }

    translate(this.x,this.y);
    rotate(this.rot);

    beginShape();
    vertex(0,-20);
    vertex(-12,-6);
    vertex(-26,-12);
    vertex(-22,-28);
    vertex(-38,-10);
    vertex(-34,10);
    vertex(-18,20);
    vertex(0,12);
    vertex(18,20);
    vertex(34,10);
    vertex(38,-10);
    vertex(22,-28);
    vertex(26,-12);
    vertex(12,-6);
    vertex(0,-20);
    endShape();

    fill(82,76,72,172);
    triangle(-8,-6, 8,-6, 0,-15);//Cockpit

    rotate(-this.rot);
    translate(-this.x,-this.y);
  }


  draw() {
    if (this.playAni[0]) { this.deathAni([154,72,54,80],[182,72,46,128],1.4); }
    if (this.playAni[1]) { this.deathAni([208,148,72,64],[184,138,78,96],1,22.5); }

    this.display();

    if (this.playAni[2]) { this.deathAni([204,198,84,32],[226,220,62,48],.6); }

    if (renderHitboxes) { this.drawHitBox(); }
  }
}




var enemies = [];
enemies.push(new enemyClass(128,128, 135));

var enemiesToRemove = [];

var enemySpawnTimer = new Timer(2560);
var enemySpawnTimeMin = 1536;
var enemySpawnCountMod = 4;



function updateEnemies(timeDelta) {
  if (enemySpawnTimer.isFinished(timeDelta)) {
    var spawnAmount = enemySpawnTimer.iterations % 6 == 0
      ? 2
      : Math.floor(Math.random() * enemySpawnCountMod);

    for (var i=0; i<spawnAmount; i++) {
      var spawnX = Math.random() * (screenW + 128) - 64;
      var spawnY = Math.random() * -128
      // var spawnRot = spawnX < screenCenter.x
      //   ? 180 - (Math.random() * 45)
      //   : 180 + (Math.random() * 45);
      var spawnRot = spawnX < screenCenter.x
        ? 180 - 45
        : 180 + 45;

      enemies.push(new enemyClass(
        spawnX,
        spawnY,
        spawnRot
      ));
    }

    if (enemySpawnTimeMin > 128) {
      enemySpawnTimeMin -= 8;
    }
    enemySpawnCountMod += 0.1;
    enemySpawnTimer.duration = Math.floor(Math.random() * 2048) + enemySpawnTimeMin;
  }

  if (enemies.length <= 0) { return; }

  // Sort enemiesToRemove
  enemiesToRemove.sort(function(a,b) {
    return b - a;
  });
  // remove relevant enemies
  for (var i=0; i<enemiesToRemove.length; i++) {
    enemies.splice(enemiesToRemove[i], 1);
  }
  enemiesToRemove = [];

  for (var i=0; i<enemies.length; i++) {
    var enemy = enemies[i];
    enemy.update(timeDelta);
    // Map scroll effect
    enemy.y += gFactor * timeDelta;
  }
}




function drawEnemies() {
  if (enemies.length <= 0) { return; }

  for (var i=0; i<enemies.length; i++) {
    var cEnemy = enemies[i];
    enemies[i].draw();
  }
}
