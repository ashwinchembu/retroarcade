const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
let game = true;

ctx.font = "7px 'Monaco'";

let starsx = [];
let starsy = [];

let enemy1s = [];
const enemySpeed = 0.5;
let enemyBullets1 = [];

let bullets = [];
const bulletSpeed = 4;

let lastBulletTime = 0;
const bulletCooldown = 100;

let bulletImg = new Image();
bulletImg.src = './images/bulletp.png'; 

let enemyBullet1 = new Image();
enemyBullet1.src = './images/bullet1.png';

let enemyBullet2 = new Image();
enemyBullet2.src = './images/bullet2.png';

let enemy1 = new Image();
enemy1.src = './images/enemy1.png';

let enemy2 = new Image();
enemy2.src = './images/enemy2.png'; 

let enemy2s = [];
let enemyBullets2 = [];


let playercoord = [0,0]
let playerspeed = 50

const scaledWidth = canvas.width * 0.2;
const scaledHeight = canvas.height * 0.4;

let player = {

    img: new Image()
}
player.img.src = './images/player.png';

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
    instructionBtn.innerHTML = "Use arrow keys to move, space to shoot. Stop the enemies from reaching the bottom! \n Press Space to Start.";
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
    instructionBtn.onclick = function() { };

    if (!document.body.contains(instructionBtn)) {
        document.body.appendChild(instructionBtn);
    }

    ctx.shadowColor = "transparent";

    const startBtn = document.getElementById('startBtn') || document.createElement("button");
    startBtn.id = 'startBtn';
    startBtn.innerHTML = "Start Game";
    startBtn.style.position = "absolute";
    startBtn.style.left = "50%";
    startBtn.style.transform = "translateX(-50%)";
    startBtn.style.top = "60%";
    startBtn.onclick = startGame;
    if (!document.body.contains(startBtn)) {
        document.body.appendChild(startBtn);
    }
    startBtn.style.display = 'block';
}


function startGame() {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.style.display = 'none';
        instructionBtn.style.display = 'none';
    }

    initializeGame(); 
}

window.onload = displayStartScreen; 



function fillStars(){
    for (let i = 0; i < 3000; i++) {
        starsx.push(Math.random() * canvas.width);
        starsy.push(Math.random() * canvas.height);
    }
}
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    starsx = [];
    starsy = [];
    fillStars();
    playercoord[0] = canvas.width / 2 - scaledWidth / 2;
    playercoord[1] = canvas.height - scaledHeight - 10;
    
}

function drawStars() {
    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    for (let i = 0; i < 3000; i++) {
        ctx.beginPath();
        ctx.ellipse(starsx[i], starsy[i], 1, 1, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function spawnEnemy1() {
    enemy1s.push([Math.random() * (canvas.width -scaledWidth), -scaledHeight]);
}

function spawnEnemy2() {
    enemy2s.push([Math.random() * (canvas.width -scaledWidth), -scaledHeight]);
}

setInterval(spawnEnemy1, 10000 * Math.random()); 
setInterval(spawnEnemy2, 20000 * Math.random());  





function updateStars() {
    for (let i = 0; i < 3000; i++) {
        starsy[i] += 0.6;
        if (starsy[i] > canvas.height) {
            starsy[i] = 0;
            starsx[i] = Math.random() * canvas.width; 
        }
    }
}

function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i][1] -= bulletSpeed;
        if (bullets[i][1] < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function updateEnemies1() {
    for (let i = 0; i<enemy1s.length; i++ ){
        enemy1s[i][1] += enemySpeed;
        if (enemy1s[i][1] > canvas.height) {
            displayGameOver(); 
        }
        if (Math.random() < 0.001) { 
            enemyBullets1.push([enemy1s[i][0] + scaledWidth / 2 - 5, enemy1s[i][1]]);
        }
    };
}
function updateEnemies2() {
    for (let i = 0; i < enemy2s.length; i++) {
        enemy2direction = (Math.random() < 0.5 ? -1 : 1) * 2;
        let enemy = enemy2s[i];
        enemy2s[i][0] += 2*enemy2direction ;
        enemy2s[i][1] += enemySpeed;

        
        if (enemy2s[i][0] <= 0 || enemy2s[i][0] + scaledWidth >= canvas.width) {
            enemy2direction  = -enemy2direction ;
        }

        
        if (Math.random() < 0.001) {
            enemyBullets2.push([enemy2s[i][0] + scaledWidth / 2 - 5, enemy2s[i][1] + scaledHeight]);
        }

        if (enemy2s[i][1] > canvas.height) {
            displayGameOver();
        }
    }
}



function updateEnemyBullets1() {
    for (let i = 0; i < enemyBullets1.length; i++) {
        enemyBullets1[i][1] += bulletSpeed;
        if (enemyBullets1[i][1] > canvas.height) {
            enemyBullets1.splice(i, 1); 
            i--;
        }
    }
}

function updateEnemyBullets2() {
    for (let i = 0; i < enemyBullets2.length; i++) {
        enemyBullets2[i][1] += bulletSpeed;
        if (enemyBullets2[i][1] > canvas.height) {
            enemyBullets2.splice(i, 1); 
            i--;
        }
    }
}

function drawBullets() {
    for (let bullet of bullets) {
        ctx.drawImage(bulletImg, bullet[0], bullet[1], 20, 20); 
    }
}

function drawEnemies1() {
    for (let enemy of enemy1s) {
        ctx.drawImage(enemy1, enemy[0], enemy[1], scaledWidth, scaledHeight);
    }
}

function drawPlayer(){
    ctx.drawImage(player.img, playercoord[0], playercoord[1], scaledWidth, scaledHeight );
    
}
function drawEnemies2() {
    for (let enemy of enemy2s) {
        ctx.drawImage(enemy2, enemy[0], enemy[1], scaledWidth, scaledHeight);
    }
}

function checkBulletHits() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        for (let j = enemy1s.length - 1; j >= 0; j--) {
            let enemy = enemy1s[j];
            if (bullet && enemy && bullet[0] + 10 >= enemy[0] && bullet[0] <= enemy[0] + scaledWidth &&
                bullet[1] + 10 >= enemy[1] && bullet[1] <= enemy[1] + scaledHeight) {
                bullets.splice(i, 1);
                enemy1s.splice(j, 1);
                break; 
            }
        }
        for (let j = enemy2s.length - 1; j >= 0; j--) {
            let enemy = enemy2s[j];
            if (bullet && enemy && bullet[0] + 10 >= enemy[0] && bullet[0] <= enemy[0] + scaledWidth &&
                bullet[1] + 10 >= enemy[1] && bullet[1] <= enemy[1] + scaledHeight) {
                bullets.splice(i, 1);
                enemy2s.splice(j, 1);
                break; 
            }
        }
    }
}



function checkCollisions() {
    allbullets = enemyBullets1.concat(enemyBullets2);
    allbullets.forEach(bullet => {
        if (bullet[0] >= playercoord[0] && bullet[0] <= playercoord[0] + scaledWidth &&
            bullet[1] >= playercoord[1] && bullet[1] <= playercoord[1] + scaledHeight) {
            game = false;
            displayGameOver();
        }
    });

    allenemies = enemy1s.concat(enemy2s);
    allenemies.forEach(enemy => {
        if (enemy[0] <= playercoord[0] + scaledWidth && enemy[0] + scaledWidth >= playercoord[0] &&
            enemy[1] <= playercoord[1] + scaledHeight && enemy[1] + scaledHeight >= playercoord[1]) {
            game = false;
            displayGameOver();
        }
    });
}




function drawEnemyBullets1() {
    for (let bullet of enemyBullets1) {
        ctx.drawImage(enemyBullet1, bullet[0], bullet[1] +scaledHeight, 10, 10); 
    }
}
function drawEnemyBullets2() {
    for (let bullet of enemyBullets2) {
        ctx.drawImage(enemyBullet2, bullet[0], bullet[1], 20, 20);  
    }
}

function displayGameOver() {
    game = false;  

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "30px Monaco";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("You Lose!", canvas.width / 2, canvas.height / 2);

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
function animate() {
    if (game){
    updateStars();
    drawStars();
    updateBullets();
    updateEnemies2(); 
    drawEnemies2();
    updateEnemies1();
    drawEnemies1();
    updateEnemyBullets1();
    drawEnemyBullets1();
    updateEnemyBullets2(); 
    drawEnemyBullets2();
    drawBullets();
    drawPlayer();
    checkCollisions();
    checkBulletHits();
    requestAnimationFrame(animate);
    }
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
    else if (event.key === ' '  && Date.now() - lastBulletTime > bulletCooldown) { 
        console.log("shooting");
        if (startBtn.style.display !== 'none') {
            startBtn.click();
        }
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn && restartBtn.style.display !== 'none') {
            restartBtn.click();
        }
        lastBulletTime = Date.now();
        let bulletX = playercoord[0] + scaledWidth / 2 - 5;
        let bulletY = playercoord[1];
        bullets.push([bulletX, bulletY]);
    }
});

function restartGame() {
    game = true;
    starsx = [];
    starsy = [];
    enemy1s = [];
    enemy2s = [];
    bullets = [];
    enemyBullets1 = [];
    enemyBullets2 = [];
    playercoord[0] = canvas.width / 2 - scaledWidth / 2;
    playercoord[1] = canvas.height - scaledHeight - 10;

    fillStars();
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.style.display = 'none';
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animate();
}

function initializeGame() {
    resizeCanvas(); 
    animate(); 
}

