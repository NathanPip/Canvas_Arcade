function canvas(id) {
    return document.getElementById(id).getContext("2d")
  }
  
  function collision(obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.scl &&
      obj1.x + obj1.scl > obj2.x &&
      obj1.y < obj2.y + obj2.scl &&
      obj1.y + obj1.scl > obj2.y
    )
  }
  
  let gc = canvas("game")
  let gui = canvas("gui")
  let bg = canvas("background")
  let fps = 60
  let width = 500
  let height = 500
  let blockLine = []
  let score = 0
  let spawnTimer = 1
  
  blockLine.push(spawnBlocks())
  
  let player = {
    x: width / 2 - 5,
    y: height - 50,
    scl: 40,
    spd: 5,
    restart: function() {
      this.x = width / 2 - 5
      this.y = height - 50
    },
    draw: function() {
      gc.fillRect(this.x, this.y, this.scl, this.scl)
    },
    init: function() {
      if (Key.up && this.y >= 0) {
        this.y -= this.spd
      }
      if (Key.down && this.y <= height - this.scl) {
        this.y += this.spd
      }
      if (Key.left && this.x >= 0) {
        this.x -= this.spd
      }
      if (Key.right && this.x <= width - this.scl) {
        this.x += this.spd
      }
      /*for(let i=0; i < blockLine.length; i++){
            if(collision(this, blockLine[i])){
                console.log('hit')
                this.reset()
            }
        } */
    }
  }
  
  function block(x, y) {
    this.x = x
    this.y = y
    this.scl = 50
    this.spd = 4
    this.draw = function() {
      //gc.fillStyle = getRandomColor()
      gc.fillRect(this.x, this.y, this.scl, this.scl)
    }
    this.init = function() {
      this.y += this.spd
      if (collision(this, player)) {
        gc.fillStyle = getRandomColor()
        console.log("hit")
        player.restart()
        blockLine.splice(0, blockLine.length)
        score = 0
        clearInterval(timer)
        blockLine.push(spawnBlocks())
        timer = setInterval(function() {
          blockLine.unshift(spawnBlocks())
        }, 1000 / spawnTimer)
      }
      if (blockLine.length === 10 || this.y >= 550) {
        blockLine.splice(blockLine.length - 1, 1)
        score += 1
        gc.fillStyle = getRandomColor()
      }
    }
  }
  
  var Key = {
    up: false,
    down: false,
    right: false,
    left: false
  }
  
  addEventListener(
    "keydown",
    function(e) {
      var keyCode = e.keyCode ? e.keyCode : e.which
  
      switch (keyCode) {
        case 38:
          Key.up = true
          break
        case 40:
          Key.down = true
          break
        case 39:
          Key.right = true
          break
        case 37:
          Key.left = true
          break
      }
    },
    false
  )
  
  addEventListener(
    "keyup",
    function(e) {
      var keyCode = e.keyCode ? e.keyCode : e.which
  
      switch (keyCode) {
        case 38:
          Key.up = false
          break
        case 40:
          Key.down = false
          break
        case 39:
          Key.right = false
          break
        case 37:
          Key.left = false
          break
      }
    },
    false
  )
  
  function spawnBlocks() {
    let rando = 0
    let blockArray = []
    for (let i = 0; i < 10; i++) {
      rando = Math.round(Math.random())
      if (rando === 1) {
        blockArray.push(new block(50 * i, -70))
      }
    }
    return blockArray
  }
  
  function getRandomColor() {
    let letters = "1234567890ABCDF"
    let color = "#"
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
  
  function draw() {
    gc.clearRect(0, 0, width, height)
    gui.clearRect(0, 0, width, height)
    bg.clearRect(0, 0, width, height)
    //bg.fillStyle = getRandomColor()
    //bg.fillRect(0,0,width,height)
    player.draw()
    gui.font = "bold 30px arial"
    gui.fillText(score, width / 2, 50)
    if (blockLine.length >= 1) {
      for (let i = 0; i < blockLine.length; i++) {
        for (let j = 0; j < blockLine[i].length; j++) {
          blockLine[i][j].draw()
        }
      }
      for (let i = 0; i < blockLine.length; i++) {
        for (let j = 0; j < blockLine[i].length - 1; j++) {
          blockLine[i][j].y = blockLine[i][j + 1].y
        }
      }
    }
  }
  
  function init() {
    player.init()
    if (blockLine.length >= 1) {
      for (let i = 0; i < blockLine.length; i++) {
        for (let j = 0; j < blockLine[i].length; j++) {
          blockLine[i][j].init()
        }
      }
    }
  }
  
  setInterval(function() {
    draw()
    init()
  }, 1000 / fps)
  
  let timer = setInterval(function() {
    blockLine.unshift(spawnBlocks())
  }, 1000 / spawnTimer)