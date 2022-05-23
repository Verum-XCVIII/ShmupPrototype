//--------------------------------------------------------------------------------------------------------------------------------|Class - Player
class playerCharacter {
  constructor() {
    this.x = Math.floor(screenW*50)/100;
    this.y = Math.floor(screenH*50)/100;
    this.sb = 0.68;      // Base Speed
    this.asb = Math.round(Math.sqrt((this.sb * this.sb) / 2) * 1000) / 1000; // angle speed base
    this.s = this.sb;   // Speed
    this.sBlt = 0.72;   // Bullet Speed
    this.h = 4;         // Health
    this.it = 256;      // Invincibility Time (in milliseconds)
    this.i = false;     // Invincible?
    this.iTime = this.it;

    this.sc = 48;       // Scale
    this.hsc = 24;      // Half Scale
    this.lsc = this.sc; // Left Scale
    this.rsc = this.sc; // Right Scale
    this.usc = this.sc; // Upward Scale
    this.dsc = this.sc; // Downward Scale
    this.ftt = 0;       // Forward Thruster Transparency
    this.btt = 0;       // Backward Thruster Transparency

    this.hbxNeg = 40;   // Hit Box X Negative
    this.hbxPos = 40;   // Hit Box X Positive
    this.hbyNeg = 44;   // Hit Box Y Negative
    this.hbyPos = 56;   // Hit Box Y Positive

    this.le1 = 65;      // -x Input 1 - A
    this.le2 = 37;      // -x Input 2 - Left
    this.ri1 = 68;      // +x Input 1 - D
    this.ri2 = 39;      // +x Input 2 - Right
    this.up1 = 87;      // -y Input 1 - W
    this.up2 = 38;      // -y Input 2 - Up
    this.do1 = 83;      // +y Input 1 - S
    this.do2 = 40;      // +y Input 2 - Down
    this.shot1 = 32;    // Shoot Input 1 - Space
    this.shot2 = 13;    // Shoot Input 1 - Enter

    this.shooting = false;
    this.shotInterval;
    this.shotDelay = 192;
    this.gLvl = 0;      // Gun Level
    this.rot = 0;       // Rotation
    this.dmg = 1;       // Damage

    this.dead = false;
  }

  update(timeDelta) {
    this.movement(timeDelta);
    this.controls();
    this.animate();

    if (this.i) {
      if (this.iTime <= 0) {
        this.i = false;
      } else {
        this.iTime -= timeDelta;
      }
    }
  }

  movement(timeDelta = 1) {
    if ( (keyIsDown(this.le1) || keyIsDown(this.le2)) && (keyIsDown(this.up1) || keyIsDown(this.up2))
      || (keyIsDown(this.le1) || keyIsDown(this.le2)) && (keyIsDown(this.do1) || keyIsDown(this.do2))
      || (keyIsDown(this.ri1) || keyIsDown(this.ri2)) && (keyIsDown(this.up1) || keyIsDown(this.up2))
      || (keyIsDown(this.ri1) || keyIsDown(this.ri2)) && (keyIsDown(this.do1) || keyIsDown(this.do2))
    ) {
      this.s = this.asb;
    } else {
      this.s = this.sb;
    }

    var newX = this.x;
    var newY = this.y;

    if (keyIsDown(this.le1) || keyIsDown(this.le2)) { newX -= this.s * timeDelta; }
    if (keyIsDown(this.ri1) || keyIsDown(this.ri2)) { newX += this.s * timeDelta; }
    if (keyIsDown(this.up1) || keyIsDown(this.up2)) { newY -= this.s * timeDelta; }
    if (keyIsDown(this.do1) || keyIsDown(this.do2)) { newY += this.s * timeDelta; }

    // Map scroll effect
    // newY += gFactor * timeDelta;

    // Keep player on screen
    if (newX < this.hsc)          { newX = this.hsc; }
    if (newX > screenW-this.hsc)  { newX = screenW-this.hsc; }
    if (newY < this.sc)           { newY = this.sc; }
    if (newY > screenH-this.hsc)  { newY = screenH-this.hsc; }

    this.x = newX;
    this.y = newY;
  }

  controls() {
    if ((!keyIsDown(this.shot1) && !keyIsDown(this.shot2)) && this.shooting) {
      this.shooting = false;
      clearInterval(this.shotInterval);
    } else if ((keyIsDown(this.shot1) || keyIsDown(this.shot2)) && !this.shooting) {
      this.shooting = true;
      this.shoot();
      this.shotInterval = setInterval(this.shoot.bind(this), this.shotDelay);
    }
  }

  shoot() {
    //projectiles[projectiles.length] = new projectile(player,player.sBlt,0,-32);
    if (player.gLvl == 2) {
      projectiles.push(new projectile(this, this.dmg, this.sBlt, 38,18));
      projectiles.push(new projectile(this, this.dmg, this.sBlt, 0,-20));
      projectiles.push(new projectile(this, this.dmg, this.sBlt, -38,18));
    } else if (player.gLvl == 1) {
      projectiles.push(new projectile(this, this.dmg, this.sBlt, 22,-12));
      projectiles.push(new projectile(this, this.dmg, this.sBlt, -22,-12));
    } else {
      projectiles.push(new projectile(this, this.dmg, this.sBlt, 0,-32));
    }
  }

  damage(dmg) {
    this.i = true;
    this.iTime = this. it;
    this.h -= dmg;

    if (this.h <= 0) {
      this.dead = true;
    }
  }

  animate() {
    if ((keyIsDown(this.le1) || keyIsDown(this.le2)) && (keyIsDown(this.ri1) || keyIsDown(this.ri2))) {
      this.lsc = this.sc;
      this.rsc = this.sc;
      this.hbxNeg = 40;
      this.hbxPos = 40;
    } else if (keyIsDown(this.le1) || keyIsDown(this.le2)) {
      this.lsc = this.sc/1.52;
      this.rsc = this.sc*1.28;
      this.hbxNeg = 28;
      this.hbxPos = 52;
    } else if (keyIsDown(this.ri1) || keyIsDown(this.ri2)) {
      this.rsc = this.sc/1.52;
      this.lsc = this.sc*1.28;
      this.hbxNeg = 52;
      this.hbxPos = 28;
    } else {
      this.lsc = this.sc;
      this.rsc = this.sc;
      this.hbxNeg = 40;
      this.hbxPos = 40;
    }
    if ((keyIsDown(this.up1) || keyIsDown(this.up2)) && (keyIsDown(this.do1) || keyIsDown(this.do2))) {
      this.usc = this.sc;
      this.dsc = this.sc;
      this.ftt = 0;
      this.btt = 0;
    } else if (keyIsDown(this.up1) || keyIsDown(this.up2)) {
      this.usc = this.sc/1.1;
      this.dsc = this.sc*1.1;
      this.ftt = 192;
      this.btt = 0;
    } else if (keyIsDown(this.do1) || keyIsDown(this.do2)) {
      this.dsc = this.sc/1.1;
      this.usc = this.sc*1.1;
      this.btt = 192;
      this.ftt = 0;
    } else {
      this.usc = this.sc;
      this.dsc = this.sc;
      this.btt = 0;
      this.ftt = 0;
    }
  }

  drawHitBox() {
    strokeWeight(2);
    stroke(214);
    noFill();
    rect(this.x-this.hbxNeg-1, this.y-this.hbyNeg-1, this.hbxNeg+this.hbxPos+1, this.hbyNeg+this.hbyPos+1);
  }

  draw() {
    strokeWeight(this.sc/24);

    stroke(180,154,58,this.ftt/1.5);
    fill(202,98,54,this.ftt);// Forwards Thrusters (located on back/bottom)
    triangle(this.x-this.lsc/3.6,this.y+this.dsc/2, this.x-this.lsc/1.84,this.y+this.dsc*1.3, this.x-this.lsc/14,this.y+this.dsc*1.3);
    triangle(this.x+this.rsc/3.6,this.y+this.dsc/2, this.x+this.rsc/1.84,this.y+this.dsc*1.3, this.x+this.rsc/14,this.y+this.dsc*1.3);

    stroke(180,154,58,this.btt/1.5);
    fill(202,98,54,this.btt);// Backwards Thrusters (located on front/top)
    triangle(this.x-this.lsc/1.86,this.y+this.usc/3, this.x-this.lsc/1.4,this.y-this.usc/3.4, this.x-this.lsc/2.6,this.y-this.usc/3.4);
    triangle(this.x+this.rsc/1.86,this.y+this.usc/3, this.x+this.rsc/1.4,this.y-this.usc/3.4, this.x+this.rsc/2.6,this.y-this.usc/3.4);

    stroke(120,42,50);
    fill(74,82,90);// Bottom Wings
    triangle(this.x-this.lsc/1.4,this.y+this.dsc*1.06, this.x-this.lsc/2.4,this.y-this.usc/1.5, this.x-this.lsc/8,this.y+this.dsc/2);
    triangle(this.x+this.rsc/1.4,this.y+this.dsc*1.06, this.x+this.rsc/2.4,this.y-this.usc/1.5, this.x+this.rsc/8,this.y+this.dsc/2);

    stroke(134,58,56);
    fill(84,94,98);// Top Wings
    triangle(this.x-this.lsc*1.28,this.y+this.dsc/1.2, this.x-this.lsc/9,this.y-this.usc/6, this.x-this.lsc/6.8,this.y+this.dsc/1.8);
    triangle(this.x+this.rsc*1.28,this.y+this.dsc/1.2, this.x+this.rsc/9,this.y-this.usc/6, this.x+this.rsc/6.8,this.y+this.dsc/1.8);

    stroke(154,72,58);
    fill(94,110,116);// Body
    triangle(this.x-this.lsc/3.6,this.y+this.dsc, this.x,this.y-this.usc, this.x+this.rsc/3.6,this.y+this.dsc);

    stroke(168);
    fill(184);// Cockpit
    //circle(this.x-this.lsc/16+this.rsc/16,this.y+this.dsc/3-this.usc/3,this.sc/5.4);
    rect(this.x-this.sc/11.2, this.y+this.dsc/3-this.usc/3-this.sc/7, this.sc/5.6,this.sc/4.4, this.rsc/12,this.lsc/12,this.lsc/22,this.rsc/22);

    if (renderHitboxes) { this.drawHitBox(); }
  }
}

var player = new playerCharacter();
