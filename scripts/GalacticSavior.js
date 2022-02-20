//Originally written as a wee young lad in 8th grade class

//all constant vartiables
const fps = 60;
const width = 500;
const height = 400;
//amount of time in frames in between shots by player
const maxShootTime = 23;

let stars = [];
let bullets = [];
let enemies = [];
let shootTime = 0;
let level = 0;
let num = 1;
let bossHealth = 60;
let playerHealth = 1;
let gameState = "menu";

//function for easily selecting canvas elements on the DOM
const canvas = id => {
  return document.getElementById(id).getContext("2d");
};

const pG = canvas("player");
const bG = canvas("background");
const eG = canvas("enemies");
const gui = canvas("gui");

//collision function that returns true if two specified objects collide with eachother
const collide = (obj1, obj2) => {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};

//creates a row of stars and adds them to the star array
const createStars = amount => {
  for (i = 0; i < amount; i++) {
    stars.push(new Star(Math.random() * width, -5));
  }
};
//spawns enemies based on num which is controlled by the level, #enemies = num^2
const initEnemies = () => {
  for (x = 0; x < num; x++) {
    for (y = 0; y < num; y++) {
      enemies.push(new Enemy(x * 24 + width / 2 - 75, y * 24));
    }
  }
};
//Initializes stars
const initStars = amount => {
  for (i = 0; i < amount; i++) {
    stars.push(new Star(Math.random() * width, Math.random() * height));
  }
};
//////////////////////////////////////////////////////////////
const init = () => {
  if (level < 10 && gameState === "play") {
    initEnemies();
  }
  initStars(600);
};

//boss object
const boss = {
  x: width / 2 - 100,
  y: 60,
  width: 80,
  height: 70,
  //direction boss is moving
  right: false,
  left: true,
  canshoot: true,
  speed: 5,
  //boss render function
  render: function() {
    pG.fillStyle = "red";
    pG.fillRect(this.x, this.y, this.width, this.height);
  },
  //boss update function
  update: function() {
    if (this.left) {
      this.x -= this.speed;
    } else if (this.right) {
      this.x += this.speed;
    }
    if (this.x <= 0 || this.x > width - this.width) {
      this.left = !this.left;
      this.right = !this.right;
    }
    if (this.canshoot) {
      bullets.push(new Bullet(this.x, this.y + this.height + 10, "down"));
      bullets.push(
        new Bullet(this.x + this.width, this.y + this.height + 10, "down")
      );
      bullets.push(new Bullet(this.x + 20, this.y + this.height + 10, "down"));
      bullets.push(new Bullet(this.x + 60, this.y + this.width + 10, "down"));
      this.canshoot = false;
      shootTime = maxShootTime;
    }
  }
};

//Boss Healthbar object
const healthBar = {
  x: width / 2 - 100,
  y: 20,
  width: 240,
  height: 13,
  render: function() {
    pG.fillStyle = "pink";
    pG.fillRect(this.x, this.y, this.width, this.height);
  }
};

//Player object
const player = {
  x: width / 2,
  y: height - 20,
  width: 20,
  height: 20,
  speed: 5,
  canShoot: true,
  render: function() {
    pG.fillStyle = "#007BFF";
    pG.fillRect(this.x, this.y, this.width, this.height);
  },
  //handles player movement and shooting logic
  update: function() {
    if (Key.right && this.x < width - 20) this.x += this.speed;
    if (Key.left && this.x > 0) this.x -= this.speed;
    if (Key.space && this.canShoot) {
      this.canShoot = false;
      bullets.push(new Bullet(this.x, this.y - 10, "up"));
      bullets.push(new Bullet(this.x + 16, this.y - 10, "up"));
      shootTime = maxShootTime;
    }
  }
};

//Bullet object
const Bullet = function(x, y, direction) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.width = 2;
  this.speed = 5;
  this.height = 10;
  this.render = function() {
    pG.fillStyle = "#00FF15";
    pG.fillRect(this.x, this.y, this.width, this.height);
  };
  //checks for collision with player and sets gamestate to gameover if true
  this.update = function() {
    if (collide(this, player)) {
      playerHealth--;
      level = 1;
      console.log(playerHealth);
      gameState = "gameover";
    }
    //checks for collision with boss and if true reduce the bosses health
    if (gameState === "boss") {
      if (collide(this, boss)) {
        bossHealth -= 1;
        healthBar.width -= 4;
        let index = bullets.indexOf(this);
        bullets.splice(index, 1);
        return;
      }
    }
    //controls direction in which the bullet is travelling
    if (this.direction === "up") {
      this.y -= this.speed;
    }
    if (this.direction === "down") {
      this.y += this.speed;
    }
    //removes bullet if it off screen
    if (this.y < -20 || this.y > height) {
      let index = bullets.indexOf(this);
      bullets.splice(index, 1);
      return;
    }
    //checks for collision with enemies
    for (let i in enemies) {
      if (collide(this, enemies[i])) {
        let enemyIndex = enemies.indexOf(enemies[i]);
        enemies.splice(enemyIndex, 1);
        let bulletIndex = bullets.indexOf(this);
        bullets.splice(bulletIndex, 1);
      }
    }
  };
};

//Star object for background
const Star = function(x, y) {
  this.x = x;
  this.y = y;
  //random size assigned to each star
  this.size = Math.ceil(Math.random() * 2);
  this.render = function() {
    bG.fillStyle = "white";
    bG.fillRect(this.x, this.y, this.size, this.size);
  };
  this.update = function() {
    this.y++;
    //remove star if it is off screen
    if (this.y > height + 5) {
      var index = stars.indexOf(this);
      stars.splice(index, 1);
      return;
    }
  };
};

//Enemy Object
const Enemy = function(x, y) {
  this.x = x;
  this.y = y;
  this.width = 15;
  this.height = 15;
  this.render = function() {
    eG.fillStyle = "red";
    eG.fillRect(this.x, this.y, this.width, this.height);
  };
  this.update = function() {
    if (collide(this, player)) {
      gameState = "gameover";
    }
    //spawns enemies back at top of screen if they fall off screen
    if (this.y > this.height + height) this.y = -this.height;
    this.y++;
  };
};

//Keystates
let Key = {
  right: false,
  left: false,
  space: false,
  enter: false
};
//Key event listeners
addEventListener(
  "keydown",
  function(e) {
    var keyCode = e.keyCode ? e.keyCode : e.which;
    switch (keyCode) {
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

//Restarts the entire game to original state
const Restart = () => {
  gameState = "menu";
  player.x = width / 2 - 20;
  player.y = height - 20;
  num = 2;
  level = 0;
  bossHealth = 60;
  healthBar.width = 240;
  boss.x = width / 2 - 100;
  enemies = [];
  bullets = [];
};
//Main render function
const render = () => {
  //Clears all the draws from the previous frame
  pG.clearRect(0, 0, width, height);
  eG.clearRect(0, 0, width, height);
  gui.clearRect(0, 0, width, height);
  bG.clearRect(0, 0, width, height);
  //Render all of the stars in the stars array
  for (let i in stars) stars[i].render();

  if (level === 8) {
    gameState = "boss";
  }
  //bullets and player are only rendered during the play and boss gamestates
  if (gameState === "play" || gameState === "boss") {
    player.render();
    for (let i in bullets) bullets[i].render();
  }
  //only render boss and the boss health bar when gameState is equal to boss
  if (gameState === "boss") {
    boss.render();
    healthBar.render();
    gui.font = "bold 20px consolas";
    gui.fillStyle = "yellow";
    gui.fillText("Boss Health", width / 2 - 80, 15);
  }

  //render handling for game states
  if (gameState === "play") {
    for (let i in enemies) enemies[i].render();

    gui.font = "bold 20px consolas";
    gui.fillStyle = "yellow";
    gui.fillText("Level: " + level, 2, 20);
  }
  if (gameState === "gameover") {
    gui.font = "bold 50px consolas";
    gui.fillStyle = "yellow";
    gui.fillText("GAME OVER", width / 2 - 130, height / 2);
    gui.font = "bold 25px consolas";
    gui.fillText("press space to restart", width / 2 - 160, height / 2 + 50);
  }
  if (gameState === "menu") {
    gui.font = "bold 50px consolas";
    gui.fillStyle = "yellow";
    gui.fillText("Galactic Savior", width / 2 - 200, height / 2);
    gui.font = "bold 20px consolas";
    gui.fillText("Press Enter To Play", width / 2 - 100, height / 2 + 40);
  }
  if (gameState === "win") {
    gui.font = "bold 50px consolas";
    gui.fillStyle = "yellow";
    gui.fillText("You Win", width / 2 - 110, height / 2);
    level = 0;
  }
};
//Main Update function
const update = () => {
  //call Create stars
  createStars(1);
  for (let i in stars) stars[i].update();
  //Main Game Logic
  if (bossHealth <= 0) {
    gameState = "win";
  }
  //set game state to play when enter is pressed
  if (gameState === "menu" && Key.enter) {
    gameState = "play";
  }
  //call update function for all enemies as well as handle level change logic only when game state is equal to "play"
  if (gameState === "play") {
    for (let i in enemies) enemies[i].update();
    if (enemies.length <= 0 && level < 10) {
      num++;
      initEnemies();
      level++;
    }
  }
  //call player update function, bullets' update function, subract from shootTime every frame and shoot = true for boss and player when shootTime <= 0
  if (gameState === "play" || gameState === "boss") {
    player.update();
    for (let i in bullets) {
      bullets[i].update();
    }
    if (shootTime <= 0) {
      player.canShoot = true;
      boss.canshoot = true;
    }
    shootTime--;
  }
  //call boss update function only during boss game state
  if (gameState === "boss") {
    boss.update();
  }
  //press enter to restart game on game over screen
  if (gameState === "gameover") {
    if (Key.space) {
      Restart();
    }
  }
};
//call init and set main game interval
init();
setInterval(() => {
  render();
  update();
}, 1000 / fps);
