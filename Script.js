// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

// Global variables
let gravity = 1;
let gameOver = false;
let score = 0;

// Controls
const keys = { left: false, right: false, up: false };

// Mobile control buttons
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const upBtn = document.getElementById("up-btn");

// Raju character
const raju = {
  x: 50,
  y: canvas.height - 60,
  width: 40,
  height: 50,
  dx: 0,
  dy: 0,
  grounded: true,
};

// Game entities
const hurdles = [];
const lava = [];
const coins = [];

// Load images
const images = {};
function loadImages() {
  const sources = {
    raju: "assets/raju.png",
    hurdle: "assets/hurdle.png",
    lava: "assets/lava.png",
    coin: "assets/coin.png",
    background: "assets/background.png",
  };

  for (const key in sources) {
    images[key] = new Image();
    images[key].src = sources[key];
  }
}
loadImages();

// Controls (desktop)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
  if (e.key === "ArrowUp" || e.key === "w") keys.up = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
  if (e.key === "ArrowUp" || e.key === "w") keys.up = false;
});

// Controls (mobile)
leftBtn.addEventListener("mousedown", () => (keys.left = true));
leftBtn.addEventListener("mouseup", () => (keys.left = false));
rightBtn.addEventListener("mousedown", () => (keys.right = true));
rightBtn.addEventListener("mouseup", () => (keys.right = false));
upBtn.addEventListener("mousedown", () => (keys.up = true));
upBtn.addEventListener("mouseup", () => (keys.up = false));

// Movement logic
function moveRaju() {
  if (keys.left) raju.dx = -5;
  if (keys.right) raju.dx = 5;
  if (keys.up && raju.grounded) {
    raju.dy = -15; // Jump
    raju.grounded = false;
  }
}

function updateRaju() {
  raju.dy += gravity; // Apply gravity
  raju.x += raju.dx;
  raju.y += raju.dy;

  // Check ground collision
  if (raju.y + raju.height >= canvas.height) {
    raju.y = canvas.height - raju.height;
    raju.dy = 0;
    raju.grounded = true;
  }

  // Prevent going off the screen
  if (raju.x < 0) raju.x = 0;
  if (raju.x + raju.width > canvas.width) raju.x = canvas.width - raju.width;

  // Reset horizontal velocity
  raju.dx = 0;
}

// Add hurdles
function addHurdle() {
  hurdles.push({
    x: canvas.width,
    y: canvas.height - 60,
    width: 30,
    height: 30,
  });
}

// Add lava
function addLava() {
  lava.push({
    x: canvas.width,
    y: canvas.height - 20,
    width: 40,
    height: 20,
  });
}

// Add coins
function addCoin() {
  coins.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 100),
    width: 20,
    height: 20,
  });
}

// Draw elements
function drawRaju() {
  ctx.drawImage(images.raju, raju.x, raju.y, raju.width, raju.height);
}
function drawHurdles() {
  hurdles.forEach((hurdle) => {
    hurdle.x -= 5;
    ctx.drawImage(images.hurdle, hurdle.x, hurdle.y, hurdle.width, hurdle.height);
  });
}
function drawLava() {
  lava.forEach((lavaBlock) => {
    lavaBlock.x -= 5;
    ctx.drawImage(images.lava, lavaBlock.x, lavaBlock.y, lavaBlock.width, lavaBlock.height);
  });
}
function drawCoins() {
  coins.forEach((coin) => {
    coin.x -= 5;
    ctx.drawImage(images.coin, coin.x, coin.y, coin.width, coin.height);
  });
}

// Game loop
function loop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  moveRaju();
  updateRaju();
  drawRaju();
  drawHurdles();
  drawLava();
  drawCoins();

  requestAnimationFrame(loop);
}

// Start game
loop();
setInterval(addHurdle, 2000);
setInterval(addLava, 4000);
setInterval(addCoin, 3000);

function checkGameOver() {
  if (raju.y > canvas.height || collisionDetected) {
    gameOver = true;
    document.getElementById("game-over").style.display = "block";
    document.getElementById("final-score").textContent = score;
  }
}

// Mobile button controls
leftBtn.addEventListener("mousedown", () => (keys.left = true));
leftBtn.addEventListener("mouseup", () => (keys.left = false));
rightBtn.addEventListener("mousedown", () => (keys.right = true));
rightBtn.addEventListener("mouseup", () => (keys.right = false));
upBtn.addEventListener("mousedown", () => (keys.up = true));
upBtn.addEventListener("mouseup", () => (keys.up = false));

// Restart button functionality
const restartBtn = document.getElementById("restart-btn");
restartBtn.addEventListener("click", () => {
  // Reset game state and restart
  gameOver = false;
  score = 0;
  raju.x = 50;
  raju.y = canvas.height - 60;
  hurdles.length = 0;
  lava.length = 0;
  coins.length = 0;

  document.getElementById("game-over").style.display = "none";
  loop(); // Restart the game loop
});
