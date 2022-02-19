var fps = 60;
var width = 500;
var height = 400;
var stars = [];
var bullets = [];
var enemies = [];
var maxShootTime = 23;
var shootTime = 0;
var level = 0;
var num = 2;
var bossHealth = 60;
var playerHealth = 1;
var gamestate = "menu";

function canvas(id) {
    return document.getElementById(id).getContext('2d');
}
///////////////////////////////////////////////////////////////////
var pG = canvas("player");
var bG = canvas("background");
var eG = canvas("enemies");
var gui = canvas("gui");
////////////////////////////////////////////////////////////////////
function collide(obj1, obj2) {
    return (
    obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y)
}

///////////////////////////////////////////////////////////////////
var boss = {
    x: width / 2 - 100,
    y: 60,
    width: 80,
    height: 70,
    right: false,
    left: true,
    canshoot: true,
    speed: 5,
    render: function () {
        pG.fillStyle = 'red';
        pG.fillRect(this.x, this.y, this.width, this.height);
    },
    update: function () {
        
        if(this.left === true){
            this.x-=this.speed;
        }
        if(this.x <= 0){
            this.left = false;
            this.right = true;
        }
        if(this.right === true){
            this.x+=this.speed;
        }
        if(this.x > width-this.width){
            this.left = true;
            this.right = false;
        }
        if(this.canshoot){
          bullets.push(new Bullet(this.x, this.y + this.height + 10, "down"))
           bullets.push(new Bullet(this.x+this.width, this.y + this.height + 10, "down"));
            bullets.push(new Bullet(this.x+20, this.y+this.height + 10, "down"))
            bullets.push(new Bullet(this.x+60, this.y+this.width + 10, "down"))
           this.canshoot = false;
            shootTime = maxShootTime;
        }
        
    }
}
///////////////////////////////////////////////////////////////////
var healthBar = {
    x: width/2-240/2-20,
    y: 20,
    width: 240,
    height: 13,
    render: function () {
        pG.fillStyle = "pink";
        pG.fillRect(this.x, this.y, this.width, this.height);
    },
    update: function () {}
}
/////////////////////////////////////////////////////////////////
var player = {
    x: width / 2,
    y: height - 20,
    width: 20,
    height: 20,
    speed: 5,
    canShoot: true,
    render: function () {
        pG.fillStyle = '#007BFF';
        pG.fillRect(this.x, this.y, this.width, this.height);
    },
    update: function () {
        if (Key.right && this.x < width - 20) this.x += this.speed;
        if (Key.left && this.x > 0) this.x -= this.speed;
        if (Key.space && this.canShoot) {
            this.canShoot = false;
            bullets.push(new Bullet(this.x, this.y - 10, "up"));
            bullets.push(new Bullet(this.x + 16, this.y - 10, "up"));
            shootTime = maxShootTime;
        }
         
    }
}



////////////////////////////////////////////////////////////
    function Bullet(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.width = 2;
        this.speed = 5;
        this.height = 10;
        this.render = function () {
            pG.fillStyle = "#00FF15";
            pG.fillRect(this.x, this.y, this.width, this.height);
        };
        this.update = function () {
            if(collide(this, player)){
                playerHealth--;
                level = 1;
                console.log(playerHealth);
                gamestate = "gameover";
            }
            if(gamestate === "boss"){
            if(collide(this, boss)){
            bossHealth -= 1;
            healthBar.width -= 4;
            var index = bullets.indexOf(this);
            bullets.splice(index, 1);
            return;
        }
    }
            
            if(this.direction === "up"){
                this.y -= this.speed;
            }
            if(this.direction === "down"){
                this.y += this.speed;
            }
            if (this.y < -20) {
                var index = bullets.indexOf(this);
                bullets.splice(index, 1);
                return;
            }
            if (this.y > height) {
                var index = bullets.indexOf(this);
                bullets.splice(index, 1);
                return;
            }
            for (var i in enemies) {
                if (collide(this, enemies[i])) {
                    var enemyIndex = enemies.indexOf(enemies[i]);
                    enemies.splice(enemyIndex, 1);
                    var bulletIndex = bullets.indexOf(this);
                    bullets.splice(bulletIndex, 1);
                }
            }
            
        };
    }


/////////////////////////////////////////////////////////////
    function Star(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.ceil(Math.random() * 2);
        this.render = function () {
            bG.fillStyle = "white";
            bG.fillRect(this.x, this.y, this.size, this.size);
        };
        this.update = function () {
            this.y++;
            if (this.y > height + 5) {
                var index = stars.indexOf(this);
                stars.splice(index, 1);
                return;
            }
        };
    }

////////////////////////////////////////////////////////////////
    function Enemy(x, y) {
        this.x = x;
        this.y = y;
        this.width = 15;
        this.height = 15;
        this.render = function () {
            eG.fillStyle = "red";
            eG.fillRect(this.x, this.y, this.width, this.height);
        }
        this.update = function () {
            if (collide(this, player)) {
                gamestate = "gameover";
            }
            if (this.y > this.height + height) this.y = -this.height;
            this.y++;

        }
    }


var Key = {
    right: false,
    left: false,
    space: false,
    enter: false
}
///////////////////////////////////////////////////////////
addEventListener("keydown", function (e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.which;
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
}, false);
//////////////////////////////////////////////////////////////
addEventListener("keyup", function (e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.which;
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
}, false);




///////////////////////////////////////////////////////////////
function createStars(amount) {
    for (i = 0; i < amount; i++) {
        stars.push(new Star(Math.random() * width, -5));
    }
}
//////////////////////////////////////////////////////////////////
function initEnemies() {
    for (x = 0; x < num; x++) {
        for (y = 0; y < num; y++) {
            enemies.push(new Enemy((x * 24) + (width / 2) - 75, y * 24));
        }
    }
}
/////////////////////////////////////////////////////////////////
function initStars(amount) {
    for(i = 0; i < amount; i++){
        stars.push(new Star(Math.random() * width, Math.random() * height));
    }    
}
//////////////////////////////////////////////////////////////
function init() {
    if (level < 10 && gamestate === "play") {
        initEnemies();
    }
    initStars(600);
}
////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////
function render() {
    
    
    pG.clearRect(0, 0, width, height);
    eG.clearRect(0, 0, width, height);
    gui.clearRect(0, 0, width, height);
    bG.clearRect(0, 0, width, height);

    for (var i in stars) stars[i].render();
    
    if(gamestate === "win"){
        level = 0;
    }
    
    if (level === 8) {
        gamestate = "boss";
    }

    if (gamestate === 'boss') {
        boss.render();
        healthBar.render();
        gui.font = "bold 20px consolas";
        gui.fillStyle = "yellow";
        gui.fillText("Boss Health", width/2-80, 15);
    }

    if (gamestate === "play" || gamestate === 'boss') {
        player.render();
        for (var i in bullets) bullets[i].render();
    }

    if (gamestate === "play") {
        for (var i in enemies) enemies[i].render();

        gui.font = 'bold 20px consolas'
        gui.fillStyle = 'yellow';
        gui.fillText("Level: " + level, 2, 20);
    }
    if (gamestate === "gameover") {
        gui.font = "bold 50px consolas";
        gui.fillStyle = "yellow";
        gui.fillText("GAME OVER", width / 2 - 130, height / 2);
    }
    if(gamestate === "menu") {
        gui.font = "bold 50px consolas";
        gui.fillStyle = "yellow";
        gui.fillText("Galactic Savior", width/2-200, height/2);
        gui.font = "bold 20px consolas";
        gui.fillText("Press Enter To Play", width/2-100, height/2+40);
    }
    if(gamestate === "win"){
         gui.font = "bold 50px consolas";
        gui.fillStyle = "yellow";
        gui.fillText("You Win", width / 2 - 110, height / 2);
    }
}
//////////////////////////////////////////////////////////////
function update() 
{
    console.log(bossHealth);
    createStars(1);
    for (var i in stars) stars[i].update();
    console.log(gamestate);
    
    if(bossHealth <= 0)
    {
        gamestate = "win";
    }
    
    if(gamestate === "play" || gamestate === "boss" || gamestate === "win")
    {
        for (var i in bullets) 
        {
             bullets[i].update();
        }
    }
    
    if(gamestate === "menu" && Key.enter)
    {
        gamestate = "play";
    }
    if(gamestate === "boss") 
    {
        boss.update();
        healthBar.update();
    }
    if (gamestate === "play" || gamestate === "boss") 
    {
        player.update();

        if (shootTime <= 0) 
        {
            player.canShoot = true;
            boss.canshoot = true;
        }
        shootTime--;
    }
    if (gamestate === "play") 
    {
        for (var i in enemies) enemies[i].update();
        if (enemies.length <= 0 && level < 10) 
        {
            num++;
            initEnemies();
            level++;
        }
    }
    if(gamestate == "gameover")
    {
        if(Key.space)
        {
            Restart();
        }
    }
}
////////////////////////////////////////////////
function Restart() {
    gamestate = "menu";
    player.x = width/2-20;
    player.y = height-20;
    num = 2;
    level = 0;
    bossHealth = 60;
    healthBar.width = 240;
    boss.x = width / 2 - 100;
    for(var i in enemies)
    {
        var index = enemies.indexOf(enemies[i]);
        enemies.splice(index, 100);
    }
    for(var i in bullets)
    {
        var index = bullets.indexOf(bullets[i]);
        bullets.splice(index, 50);
    }   
}
//////////////////////////////////////////////////////
init();
setInterval(function () {
    render();
    update();
}, 1000 / fps);