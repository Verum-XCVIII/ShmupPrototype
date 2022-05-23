// This file isn't currently used, it's a WIP for converting this project to using vanilla JavaScript (removing P5.Js usage).
//--------------------------------------------------------------------------------------------------------------------------------|Initialization Functions
function init()
{
  if (document.readyState !== 'complete') {
    setTimeout(init, 10);
    return;
  }

  logicLoop();
  renderLoop(window.performance.now());

  pauseUpdate(false);
}
setTimeout(init, 5);


//--------------------------------------------------------------------------------------------------------------------------------|Logic Loop
function logicLoop()
{
  if (!pause && !player.dead)
  {
    var now = window.performance.now();
    var timeDelta = now - lastLogicLoopTime;

    player.update(timeDelta);
    updateEnemies(timeDelta);
    updateProjectiles(timeDelta);
    testBg.update(deltaTime);

    mapMovement(timeDelta);


    var cycleDelay = logicTick;
    if (timeDelta > cycleDelay) {
      cycleDelay = Math.max(1, cycleDelay - (timeDelta - cycleDelay));
    }

    setTimeout(logicLoop, cycleDelay);
    totalLogicTicks++;
    lastLogicLoopTime = now;
  }
}




//--------------------------------------------------------------------------------------------------------------------------------|Render Loop
function renderLoop(timeStamp)
{
  if (!pause && !player.dead)
  {
    clearScreen();

    renderBgObjs(testBg);
    renderEnemies();
    renderProjectiles();
    player.render();

    displayPlayerHealth();
    displayPlayerScore();
  }
  else if (player.dead)
  {
    displayGameOver();
  }

  // var now = window.performance.now();
  var now = timeStamp;
  var timeDelta = now - lastRenderLoopTime;
  var cycleDelay = renderTick;
  if (timeDelta > cycleDelay) {
    cycleDelay = Math.max(1, cycleDelay - (timeDelta - cycleDelay));
  }

  // setTimeout(renderLoop, cycleDelay);
  window.requestAnimationFrame(renderLoop);
  //totalRenderTicks++;
  lastRenderLoopTime = now;
}




function clearScreen() {
  context.fillStyle = "#222";
  context.fillRect(0, 0, canvas.width, canvas.height);
}




function pauseUpdate(override) {
  if (typeof override == 'boolean') {
    pause = override;
  } else {
    pause = !pause;
  }

  if (pause) {
    // menu_pause.toggle(true);
  } else {
    // menu_pause.toggle(false);

    playerMoveCheck();
    lastLogicLoopTime = window.performance.now();
    logicLoop();
  }
  console.log("pause = " + pause);
}
