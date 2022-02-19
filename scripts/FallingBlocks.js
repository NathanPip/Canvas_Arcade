//a function for easily selecting canvas elements on the DOM
const canvas = id => {
  return document.getElementById(id).getContext("2d");
};

//constants
const gc = canvas("game");
const gui = canvas("gui");
const bg = canvas("background");
const fps = 60;
const width = 500;
const height = 500;

//an array of lines of blocks
let blockLine = [];
//score and timer for everytime a new block line spawns
let score = 0;
let spawnTimer = 1;

//a collision function which checks to see if two objects are colliding, returns true if colliding, false if otherwise
const collision = (obj1, obj2) => {
  return (
    obj1.x < obj2.x + obj2.scl &&
    obj1.x + obj1.scl > obj2.x &&
    obj1.y < obj2.y + obj2.scl &&
    obj1.y + obj1.scl > obj2.y
  );
};

//instantiates a new block line
const spawnBlocks = () => {
  let rando = 0;
  let blockArray = [];
  for (let i = 0; i < 10; i++) {
    rando = Math.round(Math.random());
    if (rando === 1) {
      blockArray.push(new block(50 * i, -70));
    }
  }
  return blockArray;
};

//returns a random rgb color value
const getRandomColor = () => {
  let letters = "1234567890ABCDF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

//player object which holds all the player data and functionality
const player = {
  //starting x and y position of player in pixels
  x: width / 2 - 20,
  y: height - 50,
  //player block size in pixels
  scl: 40,
  //speed of movement for player when any movement key is pressed, spd*fps = distance per second in pixels
  spd: 5,
  //resets player position
  restart: function() {
    this.x = width / 2 - 20;
    this.y = height - 50;
  },
  //player render function
  draw: function() {
    gc.fillRect(this.x, this.y, this.scl, this.scl);
  },
  //player update function which handles all movement logic
  init: function() {
    if (Key.up && this.y >= 0) {
      this.y -= this.spd;
    }
    if (Key.down && this.y <= height - this.scl) {
      this.y += this.spd;
    }
    if (Key.left && this.x >= 0) {
      this.x -= this.spd;
    }
    if (Key.right && this.x <= width - this.scl) {
      this.x += this.spd;
    }
  }
};

//block object
const block = function(x, y) {
  this.x = x;
  this.y = y;
  this.scl = 50;
  this.spd = 4;
  this.draw = function() {
    gc.fillRect(this.x, this.y, this.scl, this.scl);
  };
  //handles all block logic
  this.init = function() {
    //block moves down screen at spd*fps pixels per second
    this.y += this.spd;
    //collision check that resets player position as well as removes all block lines from array and resets score back to 0
    if (collision(this, player)) {
      gc.fillStyle = getRandomColor();
      console.log("hit");
      player.restart();
      blockLine.splice(0, blockLine.length);
      score = 0;
      clearInterval(timer);
      blockLine.push(spawnBlocks());
      timer = setInterval(function() {
        blockLine.unshift(spawnBlocks());
      }, 1000 / spawnTimer);
    }
    //remove blockline from array if it goes below screen or exceeds the maximum number of lines
    if (blockLine.length === 10 || this.y >= 550) {
      blockLine.splice(blockLine.length - 1, 1);
      score += 1;
      gc.fillStyle = getRandomColor();
    }
  };
};

//states for keypresses
var Key = {
  up: false,
  down: false,
  right: false,
  left: false
};
//key press event listeners
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
    }
  },
  false
);

//pushes a new line of blocks into the array
blockLine.push(spawnBlocks());

//main draw function from which all other draw functions are called, also renders text within game window
const draw = () => {
  gc.clearRect(0, 0, width, height);
  gui.clearRect(0, 0, width, height);
  bg.clearRect(0, 0, width, height);
  //bg.fillStyle = getRandomColor()
  //bg.fillRect(0,0,width,height)
  player.draw();
  gui.font = "bold 30px arial";
  gui.fillText(score, width / 2, 50);
  if (blockLine.length >= 1) {
    for (let i = 0; i < blockLine.length; i++) {
      for (let j = 0; j < blockLine[i].length; j++) {
        blockLine[i][j].draw();
      }
    }
    for (let i = 0; i < blockLine.length; i++) {
      for (let j = 0; j < blockLine[i].length - 1; j++) {
        blockLine[i][j].y = blockLine[i][j + 1].y;
      }
    }
  }
};
//main update function from which all other update functions are called
const init = () => {
  player.init();
  if (blockLine.length > 0) {
    for (let i = 0; i < blockLine.length; i++) {
      for (let j = 0; j < blockLine[i].length; j++) {
        blockLine[i][j].init();
      }
    }
  }
};

//main game interval which controls fps
setInterval(function() {
  draw();
  init();
}, 1000 / fps);

//timer interval function which controls spawn timer for blocks
let timer = setInterval(function() {
  blockLine.unshift(spawnBlocks());
}, 1000 / spawnTimer);
