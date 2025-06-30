const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Personagem
const player = {
    x: 50,
    y: canvas.height - 80,
    width: 40,
    height: 60,
    color: '#1976d2',
    speed: 5,
    dx: 0,
    lives: 3
};

// Mercado SuperKoch
const market = {
    x: canvas.width - 200,
    y: canvas.height - 120,
    width: 150,
    height: 100,
    color: '#c62828',
    health: 20,
    maxHealth: 20
};

// Barreira de defesa
const barrier = {
    width: 40,
    height: 80,
    color: '#607d8b',
    x: market.x - 50,
    y: market.y + market.height - 80,
    health: 10,
    maxHealth: 10
};

// Tiros
let bullets = [];

// Inimigos (bugs)
let bugs = [];
const bugCount = 3;
function spawnBugs() {
    bugs = [];
    for (let i = 0; i < bugCount; i++) {
        bugs.push({
            x: 300 + Math.random() * 400,
            y: 50 + Math.random() * (canvas.height - 150),
            width: 40,
            height: 40,
            color: '#8d6e63',
            speed: 2 + Math.random() * 2
        });
    }
}

// Níveis
const levels = ['Junior', 'Pleno', 'Senior', 'Especialista', 'Deus da Programação'];
let currentLevel = 0;
let bugsKilled = 0;

function getLevelByBugsKilled() {
    if (bugsKilled < 5) return levels[0]; // Junior
    if (bugsKilled < 15) return levels[1]; // Pleno
    if (bugsKilled < 30) return levels[2]; // Senior
    if (bugsKilled < 50) return levels[3]; // Especialista
    return levels[4]; // Deus da Programação
}

function drawPlayer() {
    // Boneco simples
    // Cabeça
    ctx.fillStyle = '#ffe082';
    ctx.beginPath();
    ctx.arc(player.x + player.width/2, player.y + 15, 15, 0, Math.PI * 2);
    ctx.fill();
    // Corpo
    ctx.strokeStyle = '#1976d2';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(player.x + player.width/2, player.y + 30);
    ctx.lineTo(player.x + player.width/2, player.y + 50);
    ctx.stroke();
    // Braço esquerdo
    ctx.beginPath();
    ctx.moveTo(player.x + player.width/2, player.y + 35);
    ctx.lineTo(player.x + 5, player.y + 45);
    ctx.stroke();
    // Braço direito com arma
    const handX = player.x + player.width - 5;
    const handY = player.y + 45;
    const gunLength = 28;
    const gunWidth = 8;
    const startX = handX;
    const startY = handY;
    // Braço direito
    ctx.beginPath();
    ctx.moveTo(player.x + player.width/2, player.y + 35);
    ctx.lineTo(handX, handY);
    ctx.stroke();
    // Arma realista
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(Math.atan2(mouseY - startY, canvas.width - startX));
    // Corpo da arma
    ctx.fillStyle = '#616161';
    ctx.fillRect(0, -gunWidth/2, gunLength * 0.7, gunWidth);
    // Cano
    ctx.fillStyle = '#bdbdbd';
    ctx.fillRect(gunLength * 0.7, -gunWidth/3, gunLength * 0.3, gunWidth * 0.66);
    // Detalhe do cabo
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(-6, 1, 8, 5);
    // Mira
    ctx.fillStyle = '#ff5252';
    ctx.beginPath();
    ctx.arc(gunLength, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Pernas
    ctx.beginPath();
    ctx.moveTo(player.x + player.width/2, player.y + 50);
    ctx.lineTo(player.x + 10, player.y + player.height);
    ctx.moveTo(player.x + player.width/2, player.y + 50);
    ctx.lineTo(player.x + player.width - 10, player.y + player.height);
    ctx.stroke();
}

function drawMarket() {
    // Prédio
    ctx.fillStyle = '#c62828';
    ctx.fillRect(market.x, market.y + 30, market.width, market.height - 30);
    // Telhado
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath();
    ctx.moveTo(market.x - 10, market.y + 30);
    ctx.lineTo(market.x + market.width/2, market.y);
    ctx.lineTo(market.x + market.width + 10, market.y + 30);
    ctx.closePath();
    ctx.fill();
    // Porta
    ctx.fillStyle = '#fff';
    ctx.fillRect(market.x + market.width/2 - 15, market.y + market.height - 30, 30, 30);
    // Janelas
    ctx.fillStyle = '#90caf9';
    ctx.fillRect(market.x + 15, market.y + 50, 25, 20);
    ctx.fillRect(market.x + market.width - 40, market.y + 50, 25, 20);
    // Letreiro
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('SuperKoch', market.x + 15, market.y + 25);
    // Barrinha de vida
    const barWidth = market.width;
    const barHeight = 12;
    const barX = market.x;
    const barY = market.y - 20;
    ctx.fillStyle = '#bdbdbd';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = '#43a047';
    ctx.fillRect(barX, barY, barWidth * (market.health / market.maxHealth), barHeight);
    ctx.strokeStyle = '#333';
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}

function drawBarrier() {
    // Atualiza posição da barreira para acompanhar o mercado
    barrier.x = market.x - 50;
    barrier.y = market.y + market.height - barrier.height;
    if (barrier.health <= 0) return; // Não desenha se destruída
    // Barreira
    ctx.fillStyle = barrier.color;
    ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
    // Barrinha de vida
    const barWidth = barrier.width;
    const barHeight = 8;
    const barX = barrier.x;
    const barY = barrier.y - 16;
    ctx.fillStyle = '#bdbdbd';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = '#1976d2';
    ctx.fillRect(barX, barY, barWidth * (barrier.health / barrier.maxHealth), barHeight);
    ctx.strokeStyle = '#333';
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}

function drawBullets() {
    bullets.forEach(bullet => {
        // Círculo brilhante
        let grad = ctx.createRadialGradient(bullet.x + bullet.width/2, bullet.y + bullet.height/2, 2, bullet.x + bullet.width/2, bullet.y + bullet.height/2, 8);
        grad.addColorStop(0, '#fffde7');
        grad.addColorStop(1, '#ffeb3b');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bullet.x + bullet.width/2, bullet.y + bullet.height/2, 8, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawBugs() {
    bugs.forEach(bug => {
        // Corpo oval
        ctx.fillStyle = bug.color;
        ctx.beginPath();
        ctx.ellipse(bug.x + bug.width/2, bug.y + bug.height/2, 18, 13, 0, 0, Math.PI * 2);
        ctx.fill();
        // Cabeça
        ctx.beginPath();
        ctx.ellipse(bug.x + bug.width/2 + 13, bug.y + bug.height/2, 7, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#5d4037';
        ctx.fill();
        // Antenas
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bug.x + bug.width/2 + 16, bug.y + bug.height/2 - 5);
        ctx.lineTo(bug.x + bug.width/2 + 22, bug.y + bug.height/2 - 15);
        ctx.moveTo(bug.x + bug.width/2 + 16, bug.y + bug.height/2 + 5);
        ctx.lineTo(bug.x + bug.width/2 + 22, bug.y + bug.height/2 + 15);
        ctx.stroke();
        // Perninhas
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(bug.x + bug.width/2 - 10, bug.y + bug.height/2 + i*7);
            ctx.lineTo(bug.x + bug.width/2 - 20, bug.y + bug.height/2 + i*12);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(bug.x + bug.width/2 + 10, bug.y + bug.height/2 + i*7);
            ctx.lineTo(bug.x + bug.width/2 + 20, bug.y + bug.height/2 + i*12);
            ctx.stroke();
        }
        // Nome acima do bug
        ctx.fillStyle = '#222';
        ctx.font = 'bold 15px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('bug', bug.x + bug.width/2, bug.y - 8);
        ctx.textAlign = 'start';
    });
}

function drawLives() {
    for (let i = 0; i < player.lives; i++) {
        // Desenha um coração simples
        const x = 30 + i * 35;
        const y = 35;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x, y - 10, x - 15, y - 10, x - 15, y);
        ctx.bezierCurveTo(x - 15, y + 12, x, y + 18, x, y + 28);
        ctx.bezierCurveTo(x, y + 18, x + 15, y + 12, x + 15, y);
        ctx.bezierCurveTo(x + 15, y - 10, x, y - 10, x, y);
        ctx.closePath();
        ctx.fillStyle = '#e53935';
        ctx.fill();
        ctx.restore();
    }
}

function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function moveBullets() {
    bullets.forEach(bullet => {
        bullet.x += bullet.speed * bullet.dx;
        bullet.y += bullet.speed * bullet.dy;
    });
    // Remove bullets fora da tela
    bullets = bullets.filter(bullet => bullet.x < canvas.width && bullet.y > 0 && bullet.y < canvas.height);
}

function moveBugs() {
    bugs.forEach(bug => {
        bug.x -= bug.speed;
        if (bug.x + bug.width < 0) {
            bug.x = canvas.width + Math.random() * 100;
            bug.y = 50 + Math.random() * (canvas.height - 150);
        }
    });
}

function checkCollision() {
    bullets.forEach((bullet, i) => {
        // Primeiro verifica colisão com a barreira
        if (
            bullet.x < barrier.x + barrier.width &&
            bullet.x + bullet.width > barrier.x &&
            bullet.y < barrier.y + barrier.height &&
            bullet.y + bullet.height > barrier.y &&
            barrier.health > 0
        ) {
            barrier.health -= 1;
            bullets.splice(i, 1);
            if (barrier.health < 0) barrier.health = 0;
            return;
        }
        // Só pode causar dano ao mercado se a barreira já foi destruída
        if (
            barrier.health <= 0 &&
            bullet.x < market.x + market.width &&
            bullet.x + bullet.width > market.x &&
            bullet.y < market.y + market.height &&
            bullet.y + bullet.height > market.y
        ) {
            market.health -= 1;
            bullets.splice(i, 1);
            if (market.health < 0) market.health = 0;
        }
    });
}

function checkBugCollisions() {
    let hit = false;
    // Tiro acerta bug
    bullets.forEach((bullet, bi) => {
        bugs.forEach((bug, i) => {
            if (
                bullet.x < bug.x + bug.width &&
                bullet.x + bullet.width > bug.x &&
                bullet.y < bug.y + bug.height &&
                bullet.y + bullet.height > bug.y
            ) {
                // Bug volta para a direita
                bug.x = canvas.width + Math.random() * 100;
                bug.y = 50 + Math.random() * (canvas.height - 150);
                bullets.splice(bi, 1);
                bugsKilled++;
                if (bugsKilled % 5 === 0 && currentLevel < levels.length - 1) {
                    currentLevel++;
                }
            }
        });
    });
    // Bug acerta jogador
    for (let bug of bugs) {
        if (
            player.x < bug.x + bug.width &&
            player.x + player.width > bug.x &&
            player.y < bug.y + bug.height &&
            player.y + player.height > bug.y
        ) {
            hit = true;
            // Reposiciona bug
            bug.x = canvas.width + Math.random() * 100;
            bug.y = 50 + Math.random() * (canvas.height - 150);
        }
    }
    if (hit) {
        player.lives--;
        if (player.lives <= 0) {
            return true;
        }
    }
    return false;
}

const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
let gameRunning = false;
let gameOver = false;

function resetGame() {
    // Resetar todos os estados do jogo
    player.x = 50;
    player.y = canvas.height - 80;
    player.lives = 3;
    market.health = market.maxHealth;
    currentLevel = 0;
    bugsKilled = 0;
    bullets = [];
    spawnBugs();
    gameOver = false;
    mouseY = player.y + player.height / 2;
    barrier.health = barrier.maxHealth;
}

function startGame() {
    resetGame();
    gameRunning = true;
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    update();
}

function showRestart() {
    restartBtn.style.display = 'inline-block';
}

startBtn.onclick = startGame;
restartBtn.onclick = function() {
    startGame();
};

function showWin() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.fillText('Você destruiu o SuperKoch!', 120, canvas.height / 2 - 30);
    ctx.font = '32px Arial';
    ctx.fillText('Seu nível: ' + getLevelByBugsKilled(), canvas.width / 2, canvas.height / 2 + 30);
    ctx.font = '24px Arial';
    ctx.fillText('Bugs derrotados: ' + bugsKilled, canvas.width / 2, canvas.height / 2 + 70);
    gameRunning = false;
    gameOver = true;
    showRestart();
}

function showLose() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.fillText('Você foi derrotado pelos bugs!', 60, canvas.height / 2);
    gameRunning = false;
    gameOver = true;
    showRestart();
}

function update() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawMarket();
    drawBarrier();
    drawBullets();
    drawBugs();
    drawLives();
    movePlayer();
    moveBullets();
    moveBugs();
    checkCollision();
    if (checkBugCollisions()) {
        showLose();
        return;
    }
    if (market.health > 0) {
        requestAnimationFrame(update);
    } else {
        showWin();
    }
}

// Bloquear controles se o jogo não estiver rodando
function isGameActive() {
    return gameRunning && !gameOver;
}

let mouseY = player.y + player.height / 2;

canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

document.addEventListener('keydown', (e) => {
    if (!isGameActive()) return;
    if (e.key === 'ArrowRight') player.dx = player.speed;
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === ' ' || e.key === 'Spacebar') {
        // Atira na direção do mouse, saindo da ponta da arma
        const handX = player.x + player.width - 5;
        const handY = player.y + 45;
        const gunLength = 28;
        const startX = handX;
        const startY = handY;
        const angle = Math.atan2(mouseY - startY, canvas.width - startX);
        const bulletStartX = startX + Math.cos(angle) * gunLength;
        const bulletStartY = startY + Math.sin(angle) * gunLength;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        bullets.push({
            x: bulletStartX - 7.5, // centraliza o círculo
            y: bulletStartY - 5,
            width: 15,
            height: 10,
            speed: 8,
            dx: dx,
            dy: dy
        });
    }
});
document.addEventListener('keyup', (e) => {
    if (!isGameActive()) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') player.dx = 0;
});

// Ao carregar, mostrar só o botão de start
window.onload = function() {
    startBtn.style.display = 'inline-block';
    restartBtn.style.display = 'none';
}; 