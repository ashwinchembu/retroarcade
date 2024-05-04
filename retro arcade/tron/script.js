const CELL_SIZE = 7;
let BACKGROUND_COLOR = "#000";
let game;



class Game {
  /*
The constructor in my code initializes several additional properties and event listeners to manage responsive canvas sizing (resizeCanvas()) and more complex event handling (document.onkeydown).
*/ 
    constructor(canvasId, cellSize) {
        this.canvasElement = document.getElementById(canvasId);
        this.canvas = this.canvasElement.getContext("2d");
        this.cellSize = cellSize;
        this.resizeCanvas(); 
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        document.onkeydown = this.handleKeyboardEvent.bind(this);
        this.lightCycles = [];
        this.recordedPositions = [];
        this.gameActive = true; 
    }
    
      resizeCanvas() {
        this.canvasElement.width = window.innerWidth;
        this.canvasElement.height = window.innerHeight;
        this.width = this.canvasElement.width;
        this.height = this.canvasElement.height;
        this.canvas.strokeStyle = "white"; 
        
    
        
        if (this.recordedPositions && this.recordedPositions.length > 0) {
            this.draw(); 
        }
        
    }
    
    

  addLightCycle(lightCycle) {
    this.lightCycles.push(Object.assign({}, lightCycle));
  }
  /*
Enhanced to handle additional keys: 'Space' for game restarting and 'Escape' for exiting to a different URL.
*/

  handleKeyboardEvent(e) {
    if (e.key === ' ' ){
      if (restartBtn.style.display !== 'none') {
          restartBtn.click();
      }
    }
    else if (e.key === "Escape") {  
      window.location.href = '../index.html';  
      return;  
  }
    for (let i = 0; i < this.lightCycles.length; i++) {
      const lightCycle = this.lightCycles[i];

      if (!lightCycle.active) {
        continue;
      }

      
      let newDirection;
      if (e.keyCode === lightCycle.keyBindings.up) {
        newDirection = { x: 0, y: -1 };
      } else if (e.keyCode === lightCycle.keyBindings.down) {
        newDirection = { x: 0, y: 1 };
      } else if (e.keyCode === lightCycle.keyBindings.left) {
        newDirection = { x: -1, y: 0 };
      } else if (e.keyCode === lightCycle.keyBindings.right) {
        newDirection = { x: 1, y: 0 };
      } else {
        continue;
      }

      if (
        (newDirection.x === lightCycle.direction.x &&
          newDirection.y !== lightCycle.direction.y) ||
        (newDirection.y === lightCycle.direction.y &&
          newDirection.x !== lightCycle.direction.x)
      ) {
        continue;
      }

      lightCycle.direction = newDirection;
    }
  }
  /*
A new function that checks if a player should be considered dead based on boundary conditions or collisions with recorded positions. This encapsulation simplifies the main game loop and enhances readability and maintainability.
*/
  playerShouldDie(lightCycle) {
    if (
      lightCycle.position.x < 0 ||
      lightCycle.position.y < 0 ||
      lightCycle.position.x >= this.width ||
      lightCycle.position.y >= this.height
    ) {
      return true;
    }

    for (let i = 0; i < this.recordedPositions.length; i++) {
      const position = this.recordedPositions[i].point;

      if (
        lightCycle.position.x - (this.cellSize - 1) / 2 <= position.x &&
        position.x <= lightCycle.position.x + (this.cellSize - 1) / 2 + 1 &&
        lightCycle.position.y - (this.cellSize - 1) / 2 <= position.y &&
        position.y <= lightCycle.position.y + (this.cellSize - 1) / 2 + 1
      ) {
        return true;
      }
    }

    return false;
  }

  updateCell(newPosition, newColor) {
    for (let i = 0; i < this.recordedPositions.length; i++) {
      const position = this.recordedPositions[i];

      if (position.point === newPosition) {
        position.color = newColor;
        return;
      }
    }

    this.recordedPositions.push({
      point: newPosition,
      color: newColor
    });
  }

  finished() {
    const activePlayers = this.lightCycles.reduce(
      (a, v) => a + (v.active ? 1 : 0),
      0
    );
    return activePlayers <= 1;
  }

  getWinner() {
    if (!this.finished()) {
      return null;
    }

    return this.lightCycles.find(e => e.active);
  }
/*
The update function not only moves the players but also checks game state conditions like game activity and player survival, making it a central piece of game logic.
*/
  update() {
    if (!this.gameActive) return; 

    let marioDied = false;
    let allOthersDied = true; 

    for (let lightCycle of this.lightCycles) {
        if (lightCycle.name !== "Mario" && lightCycle.active) {
            allOthersDied = false; 
        }

        if (!lightCycle.active) {
            if (lightCycle.name === "Mario") {
                marioDied = true;
            }
            continue;
        }

        const previousPosition = lightCycle.position;
        lightCycle.position = {
            x: Math.min(lightCycle.position.x + lightCycle.direction.x * this.cellSize, this.width - this.cellSize / 2),
            y: Math.min(lightCycle.position.y + lightCycle.direction.y * this.cellSize, this.height - this.cellSize / 2)
        };

        if (!this.playerShouldDie(lightCycle)) {
            this.updateCell(lightCycle.position, lightCycle.color);
            this.updateCell(previousPosition, lightCycle.traceColor);
        } else {
            lightCycle.active = false;
            this.updateCell(previousPosition, "#fff");
            if (lightCycle.name === "Mario") {
                marioDied = true;
            } else {
                allOthersDied = allOthersDied && !lightCycle.active; 
            }
        }
    }

    this.draw();

    if (marioDied) {
        console.log("Mario Died - Game Over");
        this.gameActive = false;
        this.displayGameOver();
    } 
    
}


displayGameOver() {
    BACKGROUND_COLOR = "#000";
    this.canvas.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.draw();
    this.canvas.font = "30px Monaco";
    this.canvas.fillStyle = "red";
    this.canvas.textAlign = "center";
    this.canvas.fillText("You Lose!", this.canvasElement.width / 2, this.canvasElement.height / 2);
    this.showRestartButton();
}



showRestartButton() {
    const restartBtn = document.getElementById('restartBtn') || document.createElement("button");
    restartBtn.id = 'restartBtn';
    restartBtn.innerHTML = "Restart";
    restartBtn.style.position = "absolute";
    restartBtn.style.left = "50%";
    restartBtn.style.transform = "translateX(-50%)";
    restartBtn.style.top = "65%";
    restartBtn.onclick = () => window.location.reload();
    if (!document.body.contains(restartBtn)) {
        document.body.appendChild(restartBtn);
    }
    restartBtn.style.display = 'block';
}
/*
Besides drawing the game elements based on the recorded positions, my code also handles the background color dynamically and can adjust based on game states, such as showing a game over screen.
*/
  draw() {
    this.canvas.fillStyle = BACKGROUND_COLOR;
    this.canvas.fillRect(0, 0, this.width, this.height);

    if (this.recordedPositions && this.recordedPositions.length > 0) {
        for (let i = 0; i < this.recordedPositions.length; i++) {
            const { point: position, color } = this.recordedPositions[i];

            if (position && color) {
                this.canvas.fillStyle = color;
                this.canvas.fillRect(
                    position.x - (this.cellSize - 1) / 2,
                    position.y - (this.cellSize - 1) / 2,
                    this.cellSize,
                    this.cellSize
                );
            }
        }
    }
    this.canvas.lineWidth = 5;
        this.canvas.strokeRect(0, 0, this.width, this.height);
}

}

players = [
  {
    name: "Mario",
    position: {
      x: 0,
      y: 0
    },
    direction: { x: 0, y: -1 },
    color: "#8B0000",
    traceColor: "#f00",
    keyBindings: {
      up: 38,
      down: 40,
      left: 37,
      right: 39
    },
    active: true,
    score: 0
  },
  {
    name: "Luigi",
    position: {
      x: 0,
      y: 0
    },
    direction: { x: 1, y: 0 },
    color: "#006400",
    traceColor: "#0f0",
    keyBindings: {
      up: 87,
      down: 83,
      left: 65,
      right: 68
    },
    active: true,
    score: 0
  },
  {
    name: "Pitch",
    position: {
      x: 0,
      y: 0
    },
    direction: { x: 1, y: 0 },
    color: "#FF1493",
    traceColor: "#FF69B4",
    keyBindings: {
      up: 72,
      down: 78,
      left: 66,
      right: 77
    },
    active: true,
    score: 0
  }
];

function load() {
  game = new Game("myCanvas", CELL_SIZE);

  for (let i = 0; i < players.length; i++) {
    players[i].position = {
      x: Math.floor(
        Math.random() * (document.getElementById("myCanvas").width - CELL_SIZE)
      ),
      y: Math.floor(
        Math.random() * (document.getElementById("myCanvas").height - CELL_SIZE)
      )
    };

    directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 }
    ];

    players[i].direction =
      directions[Math.floor(Math.random() * directions.length)];

    game.addLightCycle(players[i]);
  }


  return game;
}

document.addEventListener('DOMContentLoaded', function() {
    let game = load(); 
    let beginningDate = performance.now();

    function main() {
        game.update();
        if (game.finished()) {
            const winner = game.getWinner();
            if (winner) {
                for (let i = 0; i < players.length; i++) {
                    if (players[i].name === winner.name) {
                        players[i].score += 1;
                    }
                }
            }
            game = load();
            beginningDate = performance.now(); 
        }

        const elapsedTime = performance.now() - beginningDate;
        const decreasedTimeout = Math.max(200 - CELL_SIZE * Math.floor(elapsedTime / 2000), 100); 
        setTimeout(main, decreasedTimeout); 
    }

    main(); 
});

function resetGame() {
    game = new Game("myCanvas", CELL_SIZE);  
    players.forEach(player => {
        player.position = {
            x: Math.floor(
                Math.random() * (game.canvasElement.width - CELL_SIZE)
            ),
            y: Math.floor(
                Math.random() * (game.canvasElement.height - CELL_SIZE)
            )
        };

        directions = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 }
        ];

        player.direction = directions[Math.floor(Math.random() * directions.length)];
        player.active = true;  
        game.addLightCycle(player);
    });

    game.gameActive = true;  
    beginningDate = performance.now();  
    main(); 
}

if (game) {
    game.showRestartButton = function() {
        const restartBtn = document.getElementById('restartBtn') || document.createElement("button");
        restartBtn.id = 'restartBtn';
        restartBtn.innerHTML = "Restart";
        restartBtn.style.position = "absolute";
        restartBtn.style.left = "50%";
        restartBtn.style.transform = "translateX(-50%)";
        restartBtn.style.top = "60%";
        restartBtn.onclick = resetGame; 
        if (!document.body.contains(restartBtn)) {
            document.body.appendChild(restartBtn);
        }
        restartBtn.style.display = 'block';
    };
}



game = load();
let beginningDate = performance.now();

function main() {
    if (!game.gameActive) {
        return; 
    }

    game.update();  
    if (game.gameActive) {  
        const elapsedTime = performance.now() - beginningDate;
        const decreasedTimeout = Math.max(200 - CELL_SIZE * Math.floor(elapsedTime / 2000), 100);
        setTimeout(main, decreasedTimeout); 
    }
}



  
  