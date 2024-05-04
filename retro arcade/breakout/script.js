const canvas = document.getElementById('breakout');
const ctx = canvas.getContext('2d');
let game = true;

ctx.font = "7px 'Monaco'";


let enemy2s = [];
let enemyBullets2 = [];


let playercoord = [0,0]
let playerspeed = 50

let ballcoord = [];
let ballspeed = [];

let blockVisibility = [];

const scaledWidth = canvas.width * 0.4;
const scaledHeight = canvas.height * 0.1;

const blockWidth = scaledWidth;
const blockHeight = scaledHeight;








window.onload = initializeGame;  

function displayStartScreen() {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 11px Monaco";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.shadowColor = "black";
    ctx.shadowBlur = 7;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    const instructionBtn = document.getElementById('instructionBtn') || document.createElement("button");
    instructionBtn.id = 'instructionBtn';
    instructionBtn.innerHTML = "Use arrow keys to move, destroy all the blocks. Stop the ball from from reaching the bottom! Press Space to Start.";
    instructionBtn.style.position = "absolute";
    instructionBtn.style.left = "50%";
    instructionBtn.style.top = "40%";
    instructionBtn.style.transform = "translateX(-50%)";
    instructionBtn.style.padding = "10px";
    instructionBtn.style.border = "1px solid white";
    instructionBtn.style.background = "transparent";
    instructionBtn.style.color = "white";
    instructionBtn.style.textAlign = "center";
    instructionBtn.style.fontSize = "11px";
    instructionBtn.style.fontFamily = "Monaco";
    instructionBtn.style.cursor = "default";

    if (!document.body.contains(instructionBtn)) {
        document.body.appendChild(instructionBtn);
    }
    instructionBtn.style.display = 'block'; 

    ctx.shadowColor = "transparent";

    const startBtn = document.getElementById('startBtn') || document.createElement("button");
    startBtn.id = 'startBtn';
    startBtn.innerHTML = "Start Game";
    startBtn.style.position = "absolute";
    startBtn.style.left = "50%";
    startBtn.style.transform = "translateX(-50%)";
    startBtn.style.top = "60%";
    startBtn.onclick = function() {
        startGame();
        instructionBtn.style.display = 'none'; 
    };

    if (!document.body.contains(startBtn)) {
        document.body.appendChild(startBtn);
    }
    startBtn.style.display = 'block'; 
}



function startGame() {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.style.display = 'none';
    }

    initializeGame(); 
}



window.onload = displayStartScreen; 


function initializeBall() {
   
    ballcoord[0] = playercoord[0] + scaledWidth / 2;
    ballcoord[1] = playercoord[1] - 10;
    ballspeed[0] = 0; 
    ballspeed[1] = -5; 
}

function moveBall(){
    ballspeed[0] *= 1.001;
    ballspeed[1] *= 1.001;
    ballcoord[0] += (ballspeed[0]*1.01);
    ballcoord[1] += (ballspeed[1]*1.01);
}

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    playercoord[0] = canvas.width / 2 - scaledWidth / 2;
    playercoord[1] = canvas.height - scaledHeight - 10;
    
    
}


function drawCeiling(){

    ctx.fillStyle = 'white';
    ctx.fillRect(0,0, canvas.width, scaledHeight/2 );
}

function drawBlocks() {
    const blockRows = canvas.height / 2 / (blockHeight + 5);
    const blockCols = canvas.width / (blockWidth+5);
    ctx.fillStyle = 'white'; 

    if (blockVisibility.length === 0) { 
        for (let row = 0; row < blockRows; row++) {
            blockVisibility[row] = [];
            for (let col = 0; col < blockCols; col++) {
                blockVisibility[row][col] = Math.round(Math.random()); 
        }
    }
}
    for (let row = 0; row < blockRows; row++) {
        for (let col = 0; col < blockCols; col++) {
            if (blockVisibility[row][col]) { 
            const x = col * blockWidth;
            const y = row * blockHeight + ((scaledHeight / 2)+ 10);
            ctx.fillRect(x, y, blockWidth - 5, blockHeight - 5);
            }
        }
    }
}


function drawPlayer(){
    ctx.fillStyle = 'white';
    ctx.fillRect(playercoord[0], playercoord[1], scaledWidth, scaledHeight );
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballcoord[0], ballcoord[1], 5, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}





function checkCollisions() {
    if (ballcoord[1] + 5 >= playercoord[1] && ballcoord[0] >= playercoord[0] && ballcoord[0] <= playercoord[0] + scaledWidth) {
        ballspeed[1] = -ballspeed[1];
        const edge = (ballcoord[0] - playercoord[0]) / scaledWidth - 0.5;
        ballspeed[0] = edge * 10 * (Math.random()*2);
    }
    blockVisibility.forEach((row, r) => {
        row.forEach((visible, c) => {
            if (visible) {
                let X = c * blockWidth;
                let Y = r * blockHeight + (scaledHeight / 2) + 10;
                if (ballcoord[0] + 5 > X && ballcoord[0] - 5 < X + blockWidth &&
                    ballcoord[1] + 5> Y && ballcoord[1] - 5 < Y + blockHeight) {
                    blockVisibility[r][c] = false;  
                    ballspeed[1] = -ballspeed[1];  
                }
            }
        });
    });
    if (ballcoord[1] <= scaledHeight / 2) {  
        ballspeed[1] = -ballspeed[1];
    }
    if (ballcoord[1] >= canvas.height) {  
        displayGameOver();
    }
    if (ballcoord[0] <= 5) {
        ballspeed[0] = -ballspeed[0];
    }
    if (ballcoord[0] >= canvas.width - 5) {
        ballspeed[0] = -ballspeed[0];
    }


}





function displayGameOver() {
    game = false;  

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "30px Monaco";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("You Lose!", canvas.width / 2, canvas.height / 2);

    showRestartButton();

}
function animate() {
    if (game){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBlocks();
    moveBall();  
    drawBall();
    checkCollisions();
    drawCeiling();
    if (cleared()) {
        displayWin();
    } else {
        requestAnimationFrame(animate);
    }
    }
}

function cleared(){
    const blockRows = canvas.height / 2 / (blockHeight + 5);
    const blockCols = canvas.width / (blockWidth+5);
    for (let row = 0; row < blockRows; row++) {
        for (let col = 0; col < blockCols; col++) {
            if (blockVisibility[row][col]) {
                return false; 
            }
        }
    }
    return true;
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' && playercoord[0] > 0) {
        playercoord[0] -= playerspeed;  
    }
    if (event.key === 'ArrowRight' && playercoord[0] + scaledWidth < canvas.width) {
        playercoord[0] += playerspeed;  
    }
    if (event.key === "Escape") {  
        window.location.href = '../index.html';  
        return;  
    }
    else if (event.key === ' ' ){
    if(startBtn.style.display !== 'none'){
        startBtn.click();
    }
    if (restartBtn.style.display !== 'none') {
        restartBtn.click();
    }
}

});

function displayWin() {
    game = false; 

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "30px Arial";
    ctx.fillStyle = "green";
    ctx.textAlign = "center";
    ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);


    showRestartButton();
}

function restartGame() {
    game = true;
    blockVisibility = []; 
    initializeBall(); 
    animate(); 


    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.style.display = 'none';
    }
}


function showRestartButton() {
    const restartBtn = document.getElementById('restartBtn') || document.createElement("button");
    restartBtn.id = 'restartBtn';
    restartBtn.innerHTML = "Restart";
    restartBtn.style.position = "absolute";
    restartBtn.style.left = "50%";
    restartBtn.style.transform = "translateX(-50%)";
    restartBtn.style.top = "60%";
    restartBtn.onclick = restartGame;

    if (!document.body.contains(restartBtn)) {
        document.body.appendChild(restartBtn);
    }
    restartBtn.style.display = 'block'; 
}


function initializeGame() {
    resizeCanvas(); 
    initializeBall();
    animate(); 
}

