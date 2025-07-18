const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerX = 275, playerY = canvas.height - 80;
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
playerImg.src = "Michele.webp";

const retryMenu = document.getElementById("retry-menu");
const retryButton = document.getElementById("retry-button");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// Funzione per creare le ballerine con velocità controllata
function createBallerine() {
  ballerine.length = 0;  // Pulisce l'array delle ballerine
  for (let i = 0; i < 5; i++) {
    ballerine.push({
      x: Math.floor(Math.random() * 550),
      y: Math.floor(Math.random() * -800),
      speed: rand(2, 5),  // La velocità è tra 2 e 5, la manteniamo costante per ogni partita
    });
  }
}

// Funzione per disegnare le immagini
function drawImage(img, x, y) {
  const imgWidth = 50;
  const imgHeight = 50;
  ctx.drawImage(img, x, y, imgWidth, imgHeight);
}

// Funzione per disegnare il testo
function drawText(text, x, y, size = 24, color = "black") {
  ctx.fillStyle = color;
  ctx.font = `${size}px Arial`;
  ctx.fillText(text, x, y);
}

// Funzione di aggiornamento del gioco
function update() {
  if (gameOver || victory) return;

  // Movimento del giocatore
  if (keys["ArrowLeft"] && playerX > 0) playerX -= 5;
  if (keys["ArrowRight"] && playerX < 550) playerX += 5;

  // Movimento delle ballerine
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

  // Collisione con la fata
  if (checkCollision(playerX, playerY, fairyX, fairyY)) {
    score += 10;
    victory = true;
  }

  // Vittoria per punteggio
  if (score >= 80) {
    victory = true;
  }
}

// Funzione di disegno del gioco
function draw() {
  ctx.fillStyle = "#87CEEB"; // Celeste
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawText("Game Over! Punteggio: " + score, 80, 300, 36, "white");
    drawText("Le ballerine ti hanno posseduto hai perso K-lemon!", 30, 350, 24, "white");

    showRetryButton(); // Mostra il tasto di rigioco
    return;
  }

  if (victory) {
    ctx.fillStyle = "#006400"; // Verde scuro
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Messaggio di vittoria con punteggio
    drawText("Vittoria! Punteggio: " + score, 120, 300, 36, "white");

    // Aggiungi il messaggio extra
    drawText("Hai scansato le 800 ballerine e conquistato K-lemon!", 30, 350, 24, "white");

    showRetryButton(); // Mostra il tasto di rigioco
    return;
  }

  drawImage(fairyImg, fairyX, fairyY);
  for (let b of ballerine) drawImage(ballerinaImg, b.x, b.y);
  drawImage(playerImg, playerX, playerY);

  drawText("Punteggio: " + score, 10, 40);
}

// Ciclo del gioco
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Funzione per il controllo delle collisioni
function checkCollision(x1, y1, x2, y2) {
  return (
    x1 < x2 + 50 &&
    x1 + 50 > x2 &&
    y1 < y2 + 50 &&
    y1 + 50 > y2
  );
}

// Gestione dell'input da tastiera
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Funzione per iniziare il gioco
function startGame() {
  document.getElementById("start-menu").style.display = "none"; // Nascondi il menu iniziale
  document.getElementById("rules-menu").style.display = "block"; // Mostra il menu delle regole
}

// Funzione per avviare il gioco dopo le regole
function startAfterRules() {
  document.getElementById("rules-menu").style.display = "none";  // Nascondi il menu delle regole
  createBallerine();  // Crea le ballerine per il gioco
  gameLoop();  // Avvia il ciclo del gioco
}

// Funzione per rigiocare
function resetGame() {
  // Reset delle variabili
  playerX = 275;
  playerY = canvas.height - 80;
  fairyX = 275;
  fairyY = 50;
  score = 0;
  gameOver = false;
  victory = false;
  ballerine.length = 0; // Resetta le ballerine

  // Crea nuove ballerine con velocità controllata
  createBallerine(); 

  retryMenu.style.display = "none"; // Nascondi il tasto "Rigioca"
  gameLoop(); // Ritorna al ciclo di gioco
}

// Funzione per visualizzare il tasto di rigioco
function showRetryButton() {
  retryMenu.style.display = "block"; // Mostra il tasto "Rigioca"
}

// Aggiungi l'event listener per il tasto di rigioco
retryButton.addEventListener("click", resetGame);

// Eventi per il menu iniziale
document.getElementById("start-yes").addEventListener("click", startGame);
// Event listener per il pulsante "800 ballerine"
document.getElementById("start-no").addEventListener("click", () => {
  // Mostra la finestra modale con l'immagine
  document.getElementById("ballerina-modal").style.display = "flex";
  document.getElementById("ballerina-img").src = "fotomontaggio.png";  // Imposta l'immagine
});

// Chiudi la finestra modale quando si clicca su "Chiudi"
document.getElementById("close-ballerina-modal").addEventListener("click", () => {
  document.getElementById("ballerina-modal").style.display = "none";  // Nascondi la finestra modale
});

// Controlli per il movimento mobile
const leftButton = document.getElementById("left-button");
const rightButton = document.getElementById("right-button");

leftButton.addEventListener("touchstart", () => keys["ArrowLeft"] = true);
leftButton.addEventListener("touchend", () => keys["ArrowLeft"] = false);

rightButton.addEventListener("touchstart", () => keys["ArrowRight"] = true);
rightButton.addEventListener("touchend", () => keys["ArrowRight"] = false);

// Event listener per il menu delle regole
document.getElementById("start-ok").addEventListener("click", startAfterRules);
