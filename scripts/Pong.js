//All of the seperate canvas selectors
const bg = document.getElementById('background').getContext('2d');
const pg = document.getElementById('player').getContext('2d');
const eg = document.getElementById('enemy').getContext('2d');
const cg = document.getElementById('ball').getContext('2d');
const gui = document.getElementById('gui').getContext('2d');
//width and height of play screen and fps
const width = 500;
const height = 500;
const fps = 60;

//collistion function which handles collision of objects
const collision = (obj1, obj2) => {
	return (
  	obj1.x < obj2.x + obj2.width && 
  	obj1.x + obj1.width > obj2.x && 
  	obj1.y < obj2.y + obj2.height && 
  	obj1.y + obj1.height > obj2.y
  )
}

//Player Pad object
const playerPad = {
  //starting x and y position, x is constant
  x: 7,
  y: 225,
  //width and height of player pad
  width: 8,
  height: 80,
  //speed the pad travels spd*fps = px per sec
  speed: 5,
  //player's current score
  score: 0,
  //player render function
  render: function(){
  	pg.fillStyle = 'white';
  	pg.fillRect(this.x, this.y, this.width, this.height);
  },
  //player controls
  tick: function(){
  	if (Key.up && this.y > 0) this.y -= this.speed;
    if (Key.down && this.y < height - 80) this.y += this.speed;
  }
}

//Enemy Pad object
const enemyPad = {
  //starting x and y position, x is constant
	x: width-16,
  y: height/2-40,
  //same width and height as player pad
  width: 8,
  height: 80,
  //speed is slightly slower to give player a fighting chance
  speed: 4,
  //enemy's current score
  score: 0,
  //enemy render function
  render: function(){
  	eg.fillStyle = "white";
  	eg.fillRect(this.x, this.y, this.width, this.height);
  },
  //very basic enemy ai
  tick: function(){
  	if(ball.y > this.y+this.height){
    	this.y += this.speed;
    }
    if(ball.y < this.y){
    	this.y -= this.speed;
    }
  }
}

//Ball Object
const ball = {
  //ball size
	height: 8,
  width: 8,
  //ball speed speed*fps = px per second
  speed: 5,
  //ball starting position
  x: width/2-4,
  y: height/2-4,
  //ball starting angle of trajectory
  angle: 45,
  //velocity variables
  vx: 3,
  vy: 0,
  //chooses starting direction of ball
  xDirection: Math.round(Math.random()),
  yDirection: 0,
  //ball render function
  render: function(){
    cg.fillStyle = 'white';  
  	cg.fillRect(this.x, this.y, this.width, this.height);
  },
  //ball reset function
  reset: function(){
  	this.y = height/2;
    this.x = width/2;
    this.angle = 45;
    this.vx = 3;
    this.vy = 0;
    this.xDirection = Math.round(Math.random());
    this.yDirection = 0;
  },
  //ball update function
  tick: function(){
    //handles collision logic
    if(collision(this,playerPad)){
      //changes direction of ball
      this.xDirection = 0;
      //sets angle based on where ball collided with pad
      this.angle = (this.y - playerPad.y - playerPad.height/2)/40;
      //set velocity based on angle
      this.vx = Math.abs(Math.cos(this.angle))*this.speed;
      this.vy = Math.abs(Math.sin(this.angle))*this.speed;

      if(this.angle <= 0){
				this.yDirection = 0;
      } else if(this.angle > 0){
				this.yDirection = 1;
      }
    }
    //nearly identical to player collision logic
    if(collision(this, enemyPad)){
    	this.xDirection = 1;
    	this.angle = (this.y - enemyPad.y - enemyPad.height/2)/40;
      this.vx = Math.abs(Math.cos(this.angle))*this.speed;
      this.vy = Math.abs(Math.sin(this.angle))*this.speed;
      if(this.angle <= 0){
				this.yDirection = 0;
      } else if(this.angle > 0){
				this.yDirection = 1;
      }
    }
    //if ball hits top or bottom of game window
    if(this.y <= 0){
    	this.yDirection = 1;
    }
    if(this.y >= height-this.height){
    	this.yDirection = 0;
    }
    //sets direction ball is traveling
    if(this.xDirection === 1)
    	this.x -= this.vx;
    else if(this.xDirection === 0)
      this.x += this.vx;
        
    if(this.yDirection === 0)
      this.y -= this.vy;
    else if(this.yDirection === 1)
      this.y += this.vy;
    //if ball hits either side of game window
    if(this.x <= 0){
    	enemyPad.score += 1;
      this.reset();
    }
    if(this.x >= width+this.width){
    	playerPad.score += 1;
      this.reset();
    }
  }
}

//Key states
let Key = {
    up: false,
    down: false,
    right: false,
    left: false,
}

//Key press event listeners
addEventListener("keydown", function (e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.which;

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
}, false);

addEventListener("keyup", function (e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.which;

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
}, false);

//Main function which only renders the background and is only called once
const main = () => {
	for(let i=0; i<height/10/2; i++){
		bg.fillStyle = "white";
		bg.fillRect(245, i*10+i*10+4, 5, 10);
	}
}
//Main render function
const render = () => {
  //clear all draws from previous frame
	eg.clearRect(0,0,width,height);
	pg.clearRect(0,0,width,height);
  cg.clearRect(0,0,width,height);
  gui.clearRect(0,0,width,height);
  //call all render functions
  enemyPad.render();
	playerPad.render();
  ball.render();
  //print scores to screen
  gui.fillStyle = 'white';
  gui.font = "bold 50px Comic Sans";
  gui.fillText("" + playerPad.score, 40, 50);
  gui.fillText("" + enemyPad.score, width-60, 50);
}

//Main update/tick function
const tick = () => {
  //call all update functions
	playerPad.tick();
  enemyPad.tick();
  ball.tick();
}

//call main function once
main();
//Main game interval 
setInterval(function(){
render();
  tick();
}, 1000/fps);