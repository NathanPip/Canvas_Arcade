//canvas selectors
const pG = document.getElementById("player").getContext("2d");
const GUI = document.getElementById("gui").getContext("2d");
//constants
const fps = 60;
const width = 900;
const height = 550;

let mines = [];
let coins = [];
let gameState = "menu";
let time = 0;
let countDown = 3;
let fuel = 100;

//player object
const player = {
  //player starting x and y positions
  x: width / 2 - 5,
  y: height - 20,
  speed: 5,
  width: 10,
  height: 10,
  //player render function, draws player to screen
  render: function() {
    pG.fillStyle = "aqua";
    pG.fillRect(this.x, this.y, this.width, this.height);
  },
  //handles player control logic
  tick: function() {
    if (Key.up && this.y > 0) this.y -= this.speed;
    if (Key.down && this.y < height - 20) this.y += this.speed;
    if (Key.left && this.x > 0) this.x -= this.speed;
    if (Key.right && this.x < width - 20) this.x += this.speed;
  }
};

//coin object, acts as fuel pickup for player
const Coin = function(x, y, color) {
  this.x = x;
  this.y = y;
  this.width = 8;
  this.height = 8;
  this.speed = 4;
  this.color = color;
  //render function
  this.render = function() {
    pG.fillStyle = this.color;
    pG.fillRect(this.x, this.y, this.width, this.height);
  };
  //coin tick function
  this.tick = function() {
    this.y += this.speed;
    //kills coin when it drops below screen
    if (this.y > height + 10) {
      let Index = coins.indexOf(this);
      coins.splice(Index, 1);
    }
    //collision logic with player, add fuel and increase fuel bar width as well as kill coin
    if (collision(this, player)) {
      fuel += 20;
      fuelBar.width += 20;
      let Index = coins.indexOf(this);
      coins.splice(Index, 1);
    }
  };
};

//mine object, similar to coin object but kills player on collision and sets gamestate to gameover
const Mine = function(x, y, color) {
  this.x = x;
  this.y = y;
  this.width = 8;
  this.height = 8;
  this.color = color;
  this.speed = 4;
  this.render = function() {
    pG.fillStyle = this.color;
    pG.fillRect(this.x, this.y, this.width, this.height);
  };
  this.tick = function() {
    this.y += this.speed;
    if (this.y > height + 10) {
      var Index = mines.indexOf(this);
      mines.splice(Index, 1);
    }

    if (collision(this, player)) {
      gameState = "gameover";
    }
  };
};

//fuel bar object
const fuelBar = {
  x: 2,
  y: 60,
  //width is based on amount of fuel the player has
  width: fuel,
  height: 15,
  //render function
  render: function() {
    pG.fillStyle = "#00FF04";
    pG.fillRect(this.x, this.y, this.width, this.height);
  }
};

//Key states
const Key = {
  up: false,
  down: false,
  right: false,
  left: false,
  space: false,
  enter: false
};

//key event listeners
addEventListener(
  "keydown",
  function(e) {
    var keyCode = e.keyCode ? e.keyCode : e.which;

    switch (keyCode) {
      case 38:
        Key.up = true;
        break;
      case 40:
        Key.down = true;
        break;
      case 39:
        Key.right = true;
        break;
      case 37:
        Key.left = true;
        break;
      case 32:
        Key.space = true;
        break;
      case 13:
        Key.enter = true;
        break;
    }
  },
  false
);

addEventListener(
  "keyup",
  function(e) {
    var keyCode = e.keyCode ? e.keyCode : e.which;

    switch (keyCode) {
      case 38:
        Key.up = false;
        break;
      case 40:
        Key.down = false;
        break;
      case 39:
        Key.right = false;
        break;
      case 37:
        Key.left = false;
        break;
      case 32:
        Key.space = false;
        break;
      case 13:
        Key.enter = false;
        break;
    }
  },
  false
);

//collision function
const collision = (obj1, obj2) => {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};

//creates line of coins whenever called and pushes them to the coins array
const createCoins = amount => {
  for (let i = 0; i < amount; i++) {
    coins.push(new Coin(Math.random() * width, -5, "#18FF03"));
  }
};

//creates a line of mines whenever called and pushes them to mines array
function createMines(amount) {
  for (let i = 0; i < amount; i++) {
    mines.push(new Mine(Math.random() * width, -5, "red"));
  }
}

//called when new mines need to be spawned, more mines spawned as time goes on
const mineUpdate = () => {
  if (gameState === "play") {
    createMines(time * 0.08);
    if (time === 60) {
      createMines(9);
    }
  }
};

// restart function
const Restart = () => {
  gameState = "menu";
  time = 0;
  fuel = 100;
  countDown = 3;
  player.x = width / 2 - 20;
  player.y = height - 20;
  mines = [];
  coins = [];
};

//update function for time variable
const timeUpdate = () => {
  if (gameState === "play") {
    time++;
  }

  if (gameState === "countDown") {
    countDown--;
  }
};

//spawns fuel when called
const fuelSpawn = () => {
  if (gameState === "play") {
    createCoins(1);
  }
};

//called to slowly decrease fuel amount
const fuelLife = () => {
  if (gameState === "play") {
    fuel--;
    fuelBar.width--;
  }
};

//main render function
function render() {
  //clear draw from previous frame
  pG.clearRect(0, 0, width, height);
  GUI.clearRect(0, 0, width, height);
  //game state render logic
  if (gameState === "play") {
    for (let i in mines) {
      mines[i].render();
    }

    for (let i in coins) {
      coins[i].render();
    }
    fuelBar.render();
    player.render();

    pG.font = "bold 20px consolas";
    pG.fillStyle = "white";
    pG.fillText("Time: " + time, 2, 30);
  }

  if (gameState === "gameover") {
    pG.font = "bold 75px impact";
    pG.strokeStyle = "blue";
    pG.strokeText("GAMEOVER", width / 2 - 200, height / 2);
    pG.font = "bold 30px impact";
    pG.strokeText(
      "Your Time: " + time + "sec",
      width / 2 - 120,
      height / 2 + 50
    );
    pG.fillStyle = "red";
    pG.fillText("Enter to Restart", width / 2 - 130, height / 2 + 100);
  }

  if (gameState === "menu") {
    pG.font = "bold 50px impact";
    pG.fillStyle = "white";
    pG.fillText("Super Dodger Infinity", width / 2 - 240, height / 2 - 60);
    pG.font = "bold 30px impact";
    pG.strokeStyle = "white";
    pG.strokeText("Press Space To Play", width / 2 - 135, height / 2);

    if (Key.space) gameState = "countDown";
  }

  if (gameState === "countDown") {
    pG.font = "bold 140px impact";
    pG.strokeStyle = "white";
    pG.strokeText(countDown, width / 2 - 50, height / 2);
    if (countDown <= 0) {
      gameState = "play";
    }
  }
}
//main tick function
function tick() {
  if (gameState === "play") {
    for (let i in mines) {
      mines[i].tick();
    }
    for (let i in coins) {
      coins[i].tick();
    }
    //if fuel runs out player can no longer move
    if (fuel <= 0) {
      player.speed = 0;
    }
    player.tick();
  }
  if (gameState == "gameover" && Key.enter) {
    Restart();
  }
}

//seperate interval functions to handle each change, could derive all from fps interval but used seperate intervals
setInterval(function() {
  fuelLife();
}, 1000 / 2);

setInterval(function() {
  render();
  tick();
}, 1000 / fps);

setInterval(function() {
  mineUpdate();
}, 1000 / 30);

setInterval(function() {
  timeUpdate();
}, 1000 / 1);

setInterval(function() {
  fuelSpawn();
}, 1000 / 0.3);
