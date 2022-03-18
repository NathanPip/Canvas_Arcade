window.onload = () => {
  const canvas = id => {
    return document.getElementById(id).getContext("2d");
  };
  const game = canvas("window-background");
  const wrapper = document.querySelector(".wrapper");
  const squareSize = 20;
  let mapHeight = Math.floor((wrapper.scrollHeight + 300) / squareSize);
  let mapWidth = Math.floor(window.innerWidth / squareSize);
  let map = [];
  let map2 = [];

  window.addEventListener("resize", () => {
    mapHeight = Math.floor((wrapper.scrollHeight + 300) / squareSize);
    mapWidth = Math.floor(window.innerWidth / squareSize);
    setMap();
  });

  const square = function(x, y) {
    this.x = x * squareSize;
    this.y = y * squareSize;
    this.size = squareSize;
    this.alive = Math.random() * 18 < 2 ? true : false;
    this.render = function() {
      if (this.alive) {
        game.fillStyle = "#1a1818";
        game.fillRect(this.x, this.y, this.size, this.size);
      }
    };
  };

  const setMap = () => {
    const canvas = document.querySelector("#window-background");
    canvas.height = wrapper.scrollHeight + 300;
    canvas.width = window.innerWidth - 20;
    for (let i = 0; i <= mapHeight; i++) {
      map.push([]);
      map2.push([]);
      for (let j = 0; j <= mapWidth; j++) {
        map[i].push(new square(j, i));
        map2[i].push(new square(j, i));
      }
    }
  };

  const nextGeneration = () => {
    for (let i = 0; i < mapHeight; i++) {
      for (let j = 0; j < mapWidth; j++) {
        const cell = map[i][j];
        const rowAbove = i - 1 >= 0 ? i - 1 : mapHeight - 1;
        const rowBelow = i + 1 <= mapHeight ? i + 1 : 0;
        const columnLeft = j - 1 >= 0 ? j - 1 : mapWidth - 1;
        const columnRight = j + 1 <= mapWidth ? j + 1 : 0;
        let aliveCount = 0;
        const neighbors = {
          top_left: map2[rowAbove][columnLeft],
          top_center: map2[rowAbove][j],
          top_right: map2[rowAbove][columnRight],
          left: map2[i][columnLeft],
          right: map2[i][columnRight],
          bottom_left: map2[rowBelow][columnLeft],
          bottom_center: map2[rowBelow][j],
          bottom_right: map2[rowBelow][columnRight]
        };
        for (let neighbor in neighbors) {
          if (neighbors[neighbor].alive === true) aliveCount++;
        }
        if (aliveCount < 2) {
          map[i][j].alive = false;
        } else if (aliveCount === 3 && !cell.alive) {
          map[i][j].alive = true;
        } else if (aliveCount > 3) {
          map[i][j].alive = false;
        }
        map[i][j].render();
      }
    }
  };

  const main = () => {
    game.clearRect(0, 0, squareSize * mapWidth, squareSize * mapHeight);
    nextGeneration();
    map2 = map;
  };

  setMap();
  main();
  setInterval(() => {
    main();
  }, 1000 / 40);
};
