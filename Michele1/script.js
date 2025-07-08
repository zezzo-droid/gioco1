const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerX = 275, playerY = 700;
let fairyX = 275, fairyY = 50;
let score = 0;
let gameOver = false;
let victory = false;
const ballerine = [];
const keys = {};

const ballerinaImg = new Image();
ballerinaImg.src = "BallerinaCappuccina.jfif";

const fairyImg = new Image();
fairyImg.src = "Fata.jpeg";

const playerImg = new Image();
playerImg.src = "BallerinaCappuccina.jfif";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createBallerine() {
  for (let i = 0; i < 5; i++) {
    ballerine.push({
      x: Math.floor(Math.random() * 550),
      y: Math.floor(Math.random() * -800),
      speed: rand(2, 5),
    });
  }
}

function drawImage(img, x, y) {
  ctx.drawImage(img, x, y, 50, 50);
}

function drawText(text, x, y, size = 24, color = "black") {
  ctx.fillStyle = color;
  ctx.font = `${size}px Arial`;
  ctx.fillText(text, x, y);
}

function update() {
  if (gameOver || victory) return;

  // Movimento giocatore
  if (keys["ArrowLeft"] && playerX > 0) playerX -= 5;
  if (keys["ArrowRight"] && playerX < 550) playerX += 5;

  // Movimento ballerine
  for (let b of ballerine) {
    b.y += b.speed;
    if (b.y > 800) {
      b.y = Math.floor(Math.random() * -800);
      b.x = Math.floor(Math.random() * 550);
      score++;
    }

    if (checkCollision(playerX, playerY, b.x, b.y)) {
      gameOver = true;
    }
  }

  // Collisione con fata
  if (checkCollision(playerX, playerY, fairyX, fairyY)) {
    score += 10;
    victory = true;
  }

  // Vittoria per punteggio
  if (score >= 10) {
    victory = true;
  }
}

function draw() {
  // Sfondo
  ctx.fillStyle = "#87CEEB"; // celeste
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawText("Game Over! Punteggio: " + score, 80, 400, 36, "white");
    return;
  }

  if (victory) {
    ctx.fillStyle = "#006400"; // verde scuro
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawText("Vittoria! Punteggio: " + score, 120, 400, 36, "white");
    return;
  }

  drawImage(fairyImg, fairyX, fairyY);
  for (let b of ballerine) drawImage(ballerinaImg, b.x, b.y);
  drawImage(playerImg, playerX, playerY);

  drawText("Punteggio: " + score, 10, 30);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function checkCollision(x1, y1, x2, y2) {
  return (
    x1 < x2 + 50 &&
    x1 + 50 > x2 &&
    y1 < y2 + 50 &&
    y1 + 50 > y2
  );
}

// Input tastiera
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Avvia il gioco
createBallerine();
gameLoop();
