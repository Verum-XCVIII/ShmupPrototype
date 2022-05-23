//--------------------------------------------------------------------------------------------------------------------------------|Class - Background Object
class bgObject {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.s = Math.random() * 0.07 + 0.002; // Speed
    this.rot = Math.floor(Math.random()*360); // Rotation
    this.rotDir = Math.random() < 0.5 ? 1 : -1; // Rotation direction
    this.m = Math.floor(Math.random()*348)/100+.24; // Multiplier - size
    this.tint = [
      Math.floor(Math.random() * 128) - 64,
      Math.floor(Math.random() * 128) - 64,
      Math.floor(Math.random() * 128) - 64,
      Math.min(Math.floor((Math.random() * 86) / this.m), 192)
    ];
    this.typeOps = 4;
    this.type = Math.floor(Math.random()*this.typeOps);

    if (this.type == 0) { this.m /= 2; }
  }


  relevancyCheck(bgClass) {
    if (this.x<relevancyBounds.xNeg || this.x>relevancyBounds.xPos || this.y>relevancyBounds.yPos) {
      bgClass.objList.splice(bgClass.objList.indexOf(this),1);
      // bgClass.objsToRemove.push(bgClass.objList.indexOf(this));
    }
  }


  star(t,m,r) {
    rotate(r);
    strokeWeight(0);
    fill(120+t[0], 180+t[1], 200+t[2], t[3]+12);
    beginShape();
    vertex(-44*m, 0);
    vertex(-22*m, -9*m);
    vertex(-31*m, -31*m);
    vertex(-9*m, -22*m);
    vertex(0, -44*m);
    vertex(9*m, -22*m);
    vertex(31*m, -31*m);
    vertex(22*m, -9*m);
    vertex(44*m, 0);
    vertex(22*m, 9*m);
    vertex(31*m, 31*m);
    vertex(9*m, 22*m);
    vertex(0, 44*m);
    vertex(-9*m, 22*m);
    vertex(-31*m, 31*m);
    vertex(-22*m, 9*m);
    vertex(-44*m, 0);
    endShape();
    rotate(-r);
  }


  star2(t,m) {
    strokeWeight(0);
    fill(t[0]*4, t[1]*4, t[2]*4, t[3]+12);
    for (var i=0; i<8; i++) {
      rect(-16*m, -1*m, 32*m, 2*m);
      rotate(22.5);
    }
    rotate(-180);
  }


  star3(t,m) {
    strokeWeight(0);
    fill(t[0]*4, t[1]*4, t[2]*4, t[3]+12);
    for (var i=0; i<4; i++) {
      rect(-8*m, -0.5*m, 16*m, 1*m);
      rotate(45);
    }
    rotate(-180);
  }


  star4(t,m) {
    strokeWeight(0);
    fill(t[0]*4, t[1]*4, t[2]*4, t[3]+12);
    for (var i=0; i<8; i++) {
      rect(
        -3.2 * m * i,
        -0.2 * m * i,
         6.4 * m * i,
         0.4 * m * i
      );
      rotate(22.5);
    }
    rotate(-180);
  }


  draw() {
    angleMode(DEGREES);
    translate(this.x,this.y);
    rotate(this.rot);

    if (this.type == 0) {
      this.star([this.tint[0]-30, this.tint[1]-60, this.tint[2]-40, this.tint[3]-4], this.m*.9, 22.5);
      this.star(this.tint, this.m, 0);
    } else if (this.type == 1) {
      this.star2(this.tint, this.m);
    } else if (this.type == 2) {
      this.star3(this.tint, this.m);
    } else if (this.type == 3) {
      this.star4(this.tint, this.m);
    }

    rotate(-this.rot);
    translate(-this.x,-this.y);
  }
}




//--------------------------------------------------------------------------------------------------------------------------------|Class - Background Decor
// This is essentially used just to contain, update, and create background objects.
class bgDecor {
  constructor() {
    this.objList = [];
    this.objsToRemove = [];

    // Create Initial batch of bgObjects.
    for (var i=0; i<=screenW; i+=128) { // loop from left to right edge of screen.
      for (var z=screenH; z>=-screenH; z-=128) { // loop from bottom to top-screenH edge of screen.
        // incrementing by 128 effectively creates a a 128x128 grid,
        // for which each point has a 16% chance of spawning a bgObject.
        if (Math.random() < 0.16) {
          this.objList.push(new bgObject(i, z));
        }
      }
    }

    // Timer for spawning new bgObjects.
    this.spawnTimer = new Timer(1024);
  }


  update(timeDelta) {
    // BgObject spawner
    if (this.spawnTimer.isFinished(timeDelta)) {
      var spawnAmount = Math.floor(Math.random() * 2);

      for (var i=0; i<spawnAmount; i++) {
        var spawnX = Math.random() * (screenW + 32) - 16;
        var spawnY = Math.random() * screenH - screenH - 64;

        this.objList.push(new bgObject(spawnX, spawnY));
      }

      // Randomize timer duration
      this.spawnTimer.duration = Math.floor(Math.random() * 1280) + 256;
    }

    /*
    // Sort this.objsToRemove
    this.objsToRemove.sort(function(a,b) {
      return b - a;
    });
    // Remove relevant objects
    console.log(this.objsToRemove);
    for (var i=0; i<this.objsToRemove; i++) {
      // console.log("remove bgObj: " + this.objsToRemove[i]);
      this.objList.splice(this.objsToRemove[i], 1);
    }
    // Reset this.objsToRemove
    this.objsToRemove = [];
    */

    for (var i=0; i<this.objList.length; i++) {
      var obj = this.objList[i];
      // Update position
      obj.y += obj.s * timeDelta;
      // Update rotation
      obj.rot += obj.s * obj.rotDir * 0.4 * timeDelta;
      // Check relevancy (if it's offscreen and should be removed)
      obj.relevancyCheck(this);
    }
  }


  draw() {
    for (var i=0; i<this.objList.length; i++) {
      this.objList[i].draw();
    }
  }


  render() {
    for (var i=0; i<this.objList.length; i++) {
      this.objList[i].render();
    }
  }
}


var testBg = new bgDecor();
