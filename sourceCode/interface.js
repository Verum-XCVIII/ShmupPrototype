//--------------------------------------------------------------------------------------------------------------------------------|Menu Section
class menuClass {
  constructor() {
    this.mmActive = true;
    this.pmActive = false;
    this.omActive = false;
    this.amActive = false;
  }

  menuToggle(menu) {
    if (menu == "main") {
      if (this.mmActive) {
        this.mmActive=false;
      } else {
        this.mmActive=true;
        this.pmActive=false;
      }
    } else if (menu == "pause") {
      if (!this.mmActive&&this.pmActive) {
        this.pmActive=false;
      } else if (!this.mmActive&&!this.pmActive) {
        this.pmActive=true;
      }
    }
    this.update();
  }

  update() {
    if (this.mmActive) {
      document.getElementById("menu-Main").style.visibility="visible";
    } else {
      document.getElementById("menu-Main").style.visibility="hidden";
    }

    if (this.pmActive) {
      document.getElementById("menu-Pause").style.visibility="visible";
    } else {
      document.getElementById("menu-Pause").style.visibility="hidden";
    }


    if (this.mmActive || this.pmActive) {
      paused = true;
      //document.getElementById("uiContainer").style.visibility="hidden";
    } else {
      paused = false;
      //document.getElementById("uiContainer").style.visibility="visible";
    }
  }

  controls(key) {
    if (key == 13 && this.mmActive) {
      this.menuToggle("main");
    } else if (key == 27) {
      if (this.omActive) {
        this.menuToggle("options");
      } else if (this.amActive) {
        this.menuToggle("about");
      } else if (!this.mmActive) {
        this.menuToggle("pause");
      }
    }
  }
}

var menu = new menuClass();


//--------------------------------------------------------------------------------------------------------------------------------|Text Display Section
function displayPlayerHealth() {
  textSize(54);
  textAlign(LEFT, BOTTOM);
  fill(152, 66, 58);
  stroke(214, 220, 228);
  strokeWeight(2);

  text(player.h, 22,screenH-4);
}


function displayPlayerScore() {
  textSize(32);
  textAlign(LEFT, TOP);
  fill(130, 206, 210);
  stroke(214, 220, 228);
  strokeWeight(2);

  text(score, 22,22);
}


function displayGameOver() {
  textSize(144);
  textAlign(CENTER, CENTER);
  fill(196, 38, 36);
  stroke(18, 16, 12);
  strokeWeight(22);

  text("Game Over", screenCenter.x,screenCenter.y-32);

  textSize(44);
  fill(130, 206, 210);
  stroke(214, 220, 228);
  strokeWeight(1);

  text("Final Score: " + score, screenCenter.x,screenCenter.y+64);
}
