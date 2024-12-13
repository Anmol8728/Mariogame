// Game variables
let board, context;
let boardWidth = 750, boardHeight = 250;

// Dino
let dinoWidth = 88, dinoHeight = 94;
let dinoX = 50, dinoY = boardHeight - dinoHeight;
let dinoImg, dinoDeadImg, dinoRunFrames;
let currentFrame = 0;
let isJumping = false;

// Physics
let velocityX = -8, velocityY = 0, gravity = 0.4;
let gameOver = false, score = 0;

// Cacti
let cactusArray = [];
let cactusX = 700, cactusY = boardHeight - 70;
let cactus1Img, cactus2Img, cactus3Img;

// Initialization
window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // Dino running animation frames
    dinoRunFrames = ['./img/dino1.png', './img/dino2.png'];
    dinoImg = new Image();
    dinoDeadImg = new Image();
    dinoDeadImg.src = "./img/dino-dead.png";
    dinoImg.src = dinoRunFrames[currentFrame];

    // Cactus images
    cactus1Img = new Image();
    cactus2Img = new Image();
    cactus3Img = new Image();
    cactus1Img.src = "./img/cactus1.png";
    cactus2Img.src = "./img/cactus2.png";
    cactus3Img.src = "./img/cactus3.png";

    // Start game
    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    setInterval(changeFrame, 200); // Dino running animation

    // Event listeners
    document.addEventListener("keydown", moveDino);
    document.addEventListener("click", jumpOnClick);

    // Restart button
    document.getElementById("restart").addEventListener("click", restartGame);
};

// Update game state
function update() {
    if (gameOver) return;

    // Clear the board
    context.clearRect(0, 0, board.width, board.height);

    // Dino gravity
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);

    // Draw Dino (running or jumping)
    dinoImg.src = isJumping ? './img/dino-jump.png' : dinoRunFrames[currentFrame];
    context.drawImage(dinoImg, dino.x, dino.y, dinoWidth, dinoHeight);

    // Draw Cacti and move them
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        // Collision detection
        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = dinoDeadImg.src; // Show dead dino
            return;
        }
    }

    // Draw score
    context.fillStyle = "black";
    context.font = "20px Courier";
    context.fillText("Score: " + score++, 10, 20);

    requestAnimationFrame(update);
}

// Dino movement
function moveDino(e) {
    if (gameOver) return;

    if ((e.code === "Space" || e.code === "ArrowUp") && dino.y === dinoY) {
        velocityY = -10; // Jump
        isJumping = true;
    }
}

// Jump on screen click
function jumpOnClick() {
    if (!gameOver && dino.y === dinoY) {
        velocityY = -10; // Jump
        isJumping = true;
    }
}

// Change Dino running frame
function changeFrame() {
    if (dino.y === dinoY) { // Only switch frames when Dino is on the ground
        currentFrame = (currentFrame + 1) % dinoRunFrames.length;
        isJumping = false;
    }
}

// Place cactus
function placeCactus() {
    if (gameOver) return;

    let cactus = { img: null, x: cactusX, y: cactusY, width: 0, height: 70 };
    let randomChance = Math.random();

    if (randomChance > 0.9) {
        cactus.img = cactus3Img;
        cactus.width = 102;
    } else if (randomChance > 0.7) {
        cactus.img = cactus2Img;
        cactus.width = 69;
    } else {
        cactus.img = cactus1Img;
        cactus.width = 34;
    }
    cactusArray.push(cactus);

    // Remove old cacti
    if (cactusArray.length > 5) cactusArray.shift();
}

// Collision detection
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// Restart game
function restartGame() {
    gameOver = false;
    score = 0;
    dino.y = dinoY;
    cactusArray = [];
    velocityY = 0;
    dinoImg.src = dinoRunFrames[0]; // Reset to running animation
    requestAnimationFrame(update);
}
