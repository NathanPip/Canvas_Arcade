var bg = document.getElementById('background').getContext('2d');
var pg = document.getElementById('player').getContext('2d');
var eg = document.getElementById('enemy').getContext('2d');
var cg = document.getElementById('ball').getContext('2d');
var gui = document.getElementById('gui').getContext('2d');

var width = 500;
var height = 500;
var fps = 60;

var playerPad = {
	x: 7,
  y: 250-25,
  width: 8,
  height: 80,
  speed: 5,
  score: 0,
  render: function(){
  	pg.fillStyle = 'white';
  	pg.fillRect(this.x, this.y, this.width, this.height);
  },
  tick: function(){
  	if (Key.up && this.y > 0) this.y -= this.speed;
    if (Key.down && this.y < height - 80) this.y += this.speed;
  }
}


var ball = {
	height: 8,
  width: 8,
  speed: 5,
  x: width/2,
  y: height/2,
  yIntersect: 0,
  maxAngle: 1,
  angle: 45,
  vx: 3,
  vy: 0,
  xDirection: Math.round(Math.random()),
  yDirection: 0,
  render: function(){
    cg.fillStyle = 'white';  
  	cg.fillRect(this.x, this.y, this.width, this.height);
  },
  reset: function(){
  	this.y = height/2;
    this.x = width/2;
    this.yIntersect = 0;
    this.angle = 45;
    this.vx = 3;
    this.vy = 0;
    this.xDirection = Math.round(Math.random());
    this.yDirection = 0;
  },
  tick: function(){
  	console.log(this.angle);
    if(collision(this,playerPad)){
      this.xDirection = 0;
    	this.yIntersect = (this.y - playerPad.y - playerPad.height/2)/40;
      this.angle = this.maxAngle*this.yIntersect;
      this.vx = Math.abs(Math.cos(this.angle))*this.speed;
      this.vy = Math.abs(Math.sin(this.angle))*this.speed;
      enemyPad.poi = this.vy * enemyPad.x-this.x
      if(this.angle <= 0){
				this.yDirection = 0;
      } else if(this.angle > 0){
				this.yDirection = 1;
      }
    }
    if(collision(this, enemyPad)){
    	this.xDirection = 1;
    	this.yIntersect = (this.y - enemyPad.y - enemyPad.height/2)/40;
      this.angle = this.maxAngle*this.yIntersect;
      this.vx = Math.abs(Math.cos(this.angle))*this.speed;
      this.vy = Math.abs(Math.sin(this.angle))*this.speed;
      if(this.angle <= 0){
				this.yDirection = 0;
      } else if(this.angle > 0){
				this.yDirection = 1;
      }
    }
    if(this.y <= 0){
    	this.yDirection = 1;
    }
    if(this.y >= height-this.height){
    	this.yDirection = 0;
    }
    if(this.xDirection == 1)
    	this.x -= this.vx;
    else if(this.xDirection == 0)
      this.x += this.vx;
        
    if(this.yDirection == 0)
      this.y -= this.vy;
    else if(this.yDirection == 1)
      this.y += this.vy;

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


var enemyPad = {
	x: width-15,
  y: height/2-20,
  width: 8,
  height: 80,
  speed: 4,
  score: 0,
  render: function(){
  	eg.fillStyle = "white";
  	eg.fillRect(this.x, this.y, this.width, this.height);
  },
  tick: function(){
  	if(ball.y > this.y+this.height){
    	this.y += this.speed;
    }
    if(ball.y < this.y){
    	this.y -= this.speed;
    }
  }
}

var Key = {
    up: false,
    down: false,
    right: false,
    left: false,
}


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


function main(){
	for(var i=0; i<height/10/2; i++){
		bg.fillStyle = "white";
		bg.fillRect(245, i*10+i*10+4, 5, 10);
	}
}

function collision(obj1, obj2) {
	return (
  	obj1.x < obj2.x + obj2.width && 
  	obj1.x + obj1.width > obj2.x && 
  	obj1.y < obj2.y + obj2.height && 
  	obj1.y + obj1.height > obj2.y
  )
}

function render(){
	eg.clearRect(0,0,width,height);
	pg.clearRect(0,0,width,height);
  cg.clearRect(0,0,width,height);
  gui.clearRect(0,0,width,height);
  enemyPad.render();
	playerPad.render();
  ball.render();
  gui.fillStyle = 'white';
  gui.font = "bold 50px Comic Sans";
  gui.fillText("" + playerPad.score, 40, 50);
  gui.fillText("" + enemyPad.score, width-40, 50);
}

function tick(){
	playerPad.tick();
  enemyPad.tick();
  ball.tick();
}


main();
setInterval(function(){
render();
  tick();
}, 1000/fps);