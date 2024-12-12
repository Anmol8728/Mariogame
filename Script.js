// script.js

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

// Variables
let raju = { x: 50, y: 300, width: 50, height: 50, dx: 0, dy: 0, grounded: true };
let gravity = 1;
let score = 0;
let gameOver = false;
let hurdles = [];
let enemies = [];
let lava = [];
let voidLine = canvas.height;
let frameCount = 0;

// Mobile Controls
const leftBtn = document.getElementById('left-btn');
const upBtn = document.getElementById('up-btn');
const rightBtn = document.getElementById('right-btn');

// Game Over Elements
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const finalScore = document.getElementById('final-score');

// Input
const keys = { left: false, right: false, up: false };
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') keys.left = true;
  if (e.key === 'ArrowRight') keys.right = true;
  if (e.key === 'ArrowUp') keys.up = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;
  if (e.key === 'ArrowUp') keys.up = false;
});

// Mobile Button Events
leftBtn.addEventListener('mousedown', () => (keys.left = true));
leftBtn.addEventListener('mouseup', () => (keys.left = false));
rightBtn.addEventListener('mousedown', () => (keys.right = true));
rightBtn.addEventListener('mouseup', () => (keys.right = false));
upBtn.addEventListener('mousedown', () => (keys.up = true));
upBtn.addEventListener('mouseup', () => (keys.up = false));

// Restart Game
restartBtn.addEventListener('click', restartGame);

// Raju Movement
function moveRaju() {
  if (keys.left) raju.dx = -5;
  if (keys.right) raju.dx = 5;
  if (keys.up && raju.grounded) {
    raju.dy = -15;
    raju.grounded = false;
  }
}

// Draw Raju
function drawRaju() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(raju.x, raju.y, raju.width, raju.height);
}

// Update Raju
function updateRaju() {
  raju.x += raju.dx;
  raju.y += raju.dy;
  if (raju.y + raju.height < canvas.height) raju.dy += gravity; // Gravity
  else {
    raju.y = canvas.height - raju.height;
    raju.dy = 0;
    raju.grounded = true;
  }

  raju.dx = 0; // Reset horizontal velocity
}

// Hurdles
function drawHurdles() {
  ctx.fillStyle = 'red';
  hurdles.forEach((hurdle) => {
    hurdle.x -= 5;
    ctx.fillRect(hurdle.x, hurdle.y, hurdle.width, hurdle.height);
  });
}

function addHurdle() {
  hurdles.push({ x: canvas.width, y: canvas.height - 50, width: 50, height: 50 });
}

// Score
function updateScore() {
  score++;
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);
}

// Check Game Over
function checkGameOver() {
  if (raju.y >= voidLine || hurdles.some((h) => checkCollision(raju, h))) {
    endGame();
  }
}

// Collision Detection
function checkCollision(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

// End Game
function endGame() {
  gameOver = true;
  finalScore.textContent = score;
  gameOverScreen.classList.remove('hidden');
}

// Restart Game
function restartGame() {
  gameOver = false;
  raju = { x: 50, y: 300, width: 50, height: 50, dx: 0, dy: 0, grounded: true };
  score = 0;
  hurdles = [];
  gameOverScreen.classList.add('hidden');
  loop();
}

// Game Loop
function loop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  frameCount++;
  if (frameCount % 100 === 0) addHurdle(); // Add hurdles periodically

  moveRaju();
  updateRaju();
  drawRaju();
  drawHurdles();
  updateScore();
  checkGameOver();

  requestAnimationFrame(loop);
}

loop();
