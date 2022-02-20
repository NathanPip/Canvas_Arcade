//a function for easily selecting canvas elements on the DOM
const canvas = id => {
  return document.getElementById(id).getContext("2d");
};

//canvas selectors
const pG = canvas("player");
const p2G = canvas("player2");
const bG = canvas("background");
const gui = canvas("gui");

//constants
const fps = 60;
const width = 500;
const height = 400;
const maxShootTime = 15;

let bullets = [];
let shootTime = 0;
let gameState = "menu";

//a collision function which checks to see if two objects are colliding, returns true if colliding, false if otherwise
const collision = (obj1, obj2) => {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};

//Player object
const player = {
  //starting x and y position of player in pixels
  x: 0,
  y: 0,
  //speed of movement for player when any movement key is pressed, spd*fps = distance per second in pixels
  speed: 5,
  //player block size in pixels
  width: 20,
  height: 20,
  //whether or not player can shoot
  canShoot: true,
  //player render function
  render: function() {
    pG.fillStyle = "blue";
    pG.fillRect(this.x, this.y, this.width, this.height);
  },
  //player controls logic
  update: function() {
    if (Key.w && this.y > 0) this.y -= this.speed;
    if (Key.s && this.y < height - this.height) this.y += this.speed;
    if (Key.d && this.canShoot) {
      this.canShoot = false;
      bullets.push(new Bullet(this.x + 15, this.y + 10, "right"));
      shootTime = maxShootTime;
    }
  }
};
//enemy object, simmilar to player object
const enemy = {
  x: width - 20,
  y: width / 2,
  //slightly slower than player
  speed: 4,
  canShoot: true,
  width: 20,
  height: 20,
  render: function() {
    p2G.fillStyle = "red";
    p2G.fillRect(this.x, this.y, this.width, this.height);
  },
  //very basic enemy ai
  update: function() {
    if (this.canShoot) {
      this.canShoot = false;
      bullets.push(new Bullet(this.x - 10, this.y + 10, "left"));
      shootTime = maxShootTime;
    }
    //always tracks player with no delay
    if (player.y < this.y) {
      this.y -= this.speed;
    }
    if (player.y > this.y) {
      this.y += this.speed;
    }
  }
};
//player2 object same as player object but seperate controls, player1 and player2 object can probabaly be combined
const player2 = {
  x: width - 20,
  y: width / 2,
  speed: 5,
  canShoot: true,
  width: 20,
  height: 20,
  render: function() {
    p2G.fillStyle = "red";
    p2G.fillRect(this.x, this.y, this.width, this.height);
  },
  update: function() {
    if (Key.up && this.y > 0) this.y -= this.speed;
    if (Key.down && this.y < height - this.height) this.y += this.speed;
    if (Key.left && this.canShoot) {
      this.canShoot = false;
      bullets.push(new Bullet(this.x - 10, this.y + 10, "left"));
      shootTime = maxShootTime;
    }
  }
};

//bullet object
const Bullet = function(x, y, direction) {
  this.x = x;
  this.y = y;
  this.width = 14;
  this.height = 3;
  this.speed = 10;
  //bullet direction dependent on which object shot bullet
  this.direction = direction;
  this.render = function() {
    pG.fillStyle = "white";
    pG.fillRect(this.x, this.y, this.width, this.height);
  };
  //handles win / lose logic and collision, kills bullet when it is off screen
  this.update = function() {
    if (this.direction == "left") {
      this.x -= this.speed;
    }
    if (this.direction == "right") {
      this.x += this.speed;
    }
    if (this.x > width + 5 || this.x < -5) {
      let index = bullets.indexOf(this);
      bullets.splice(index, 1);
      return;
    }
    if (collision(this, player)) {
      gameState = "p2 win";
    }

    if (collision(this, player2)) {
      gameState = "p1 win";
    }
  };
};

//Key states
let Key = {
  w: false,
  s: false,
  up: false,
  down: false,
  d: false,
  left: false,
  one: false,
  two: false,
  space: false
};

//key event listeners
addEventListener(
  "keydown",
  function(e) {
    var keyCode = e.keyCode ? e.keyCode : e.which;
    switch (keyCode) {
      case 87:
        Key.w = true;
        break;
      case 83:
        Key.s = true;
        break;
      case 38:
        Key.up = true;
        break;
      case 40:
        Key.down = true;
        break;
      case 68:
        Key.d = true;
        break;
      case 37:
        Key.left = true;
        break;
      case 49:
        Key.one = true;
        break;
      case 50:
        Key.two = true;
        break;
      case 32:
        Key.space = true;
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
      case 87:
        Key.w = false;
        break;
      case 83:
        Key.s = false;
        break;
      case 38:
        Key.up = false;
        break;
      case 40:
        Key.down = false;
        break;
      case 68:
        Key.d = false;
        break;
      case 37:
        Key.left = false;
        break;
      case 49:
        Key.one = false;
        break;
      case 50:
        Key.two = false;
        break;
      case 32:
        Key.space = false;
        break;
    }
  },
  false
);

//main update function
const update = () => {
  if (gameState === "play2") {
    for (var i in bullets) {
      bullets[i].update();
    }
    player.update();
    player2.update();
    if (shootTime <= 0) {
      player.canShoot = true;
      player2.canShoot = true;
    }
    shootTime--;
  }
  if (gameState === "play1") {
    for (let i in bullets) {
      bullets[i].update();
    }
    player.update();
    enemy.update();
    if (shootTime <= 0) {
      player.canShoot = true;
      enemy.canShoot = true;
    }
    shootTime--;
  }
  if (gameState === "menu") {
    if (Key.one) {
      gameState = "play1";
    }
    if (Key.two) {
      gameState = "play2";
    }
  }
  if (gameState === "p1 win" || gameState === "p2 win") {
    if (Key.space) {
      Restart();
    }
  }
}

//main render function
const render = () => {
  pG.clearRect(0, 0, width, height);
  p2G.clearRect(0, 0, width, height);
  bG.clearRect(0, 0, width, height);
  gui.clearRect(0, 0, width, height);

  if (gameState === "play2") {
    player.render();
    player2.render();
    for (let i in bullets) {
      bullets[i].render();
    }
  }
  if (gameState === "play1") {
    player.render();
    enemy.render();
    for (let i in bullets) {
      bullets[i].render();
    }
  }
  if (gameState === "p1 win") {
    gui.font = "bold 50px impact";
    gui.fillStyle = "blue";
    gui.fillText("Player 1 Wins", width / 2 - 150, height / 2);
    gui.font = "bold 30px consolas";
    gui.fillText("Space to Restart", width / 2 - 150, height / 2 + 30);
  }
  if (gameState === "p2 win") {
    gui.font = "bold 50px impact";
    gui.fillStyle = "red";
    gui.fillText("Player 2 Wins", width / 2 - 150, height / 2);
    gui.font = "bold 30px consolas";
    gui.fillText("Space to Restart", width / 2 - 150, height / 2 + 30);
  }
  if (gameState === "menu") {
    gui.font = "bold 50px consolas";
    gui.fillStyle = "Purple";
    gui.fillText("Red V. Blue", width / 2 - 145, height / 2);
    gui.font = "bold 20px consolas";
    gui.fillStyle = "red";
    gui.fillText("Press 1 for 1 player", width / 2 - 110, height / 2 + 50);
    gui.fillStyle = "blue";
    gui.fillText("Press 2 for 2 Players", width / 2 - 110, height / 2 + 75);
  }
}

//restart function
function Restart() {
  gameState = "menu";
  player.x = 0;
  player.y = 0;
  player2.x = width - 20;
  player2.y = height - 20;
  enemy.x = width - 20;
  enemy.y = height - 20;
  bullets = [];
}
//main game interval
setInterval(function() {
  render();
  update();
}, 1000 / fps);
