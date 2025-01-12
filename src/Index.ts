// TypeScript: Flappy Bird Clone

// Setup Canvas
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

// Game constants
const GRAVITY = 0.6;
const FLAP_STRENGTH = -12;
const SPAWN_RATE = 90; // The pipe spawn rate in frames
const PIPE_WIDTH = 60;
const PIPE_GAP = 100;

// Game variables
let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdFlap = false;
let score = 0;

let pipes: { x: number, y: number }[] = [];

// Handle the bird
const bird = {
    width: 20,
    height: 20,
    color: 'yellow',
    x: 50,
    y: birdY,
    flap() {
        birdVelocity = FLAP_STRENGTH; // Flap the bird upwards
    },
    update() {
        if (birdFlap) {
            birdFlap = false;
            this.flap();
        }
        birdVelocity += GRAVITY; // Apply gravity
        birdY += birdVelocity; // Update bird's position
        if (birdY < 0) birdY = 0;
        if (birdY + this.height > canvas.height) birdY = canvas.height - this.height; // Ground collision
    },
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, birdY, this.width, this.height);
    }
};

// Handle pipes
function spawnPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - PIPE_GAP));
    pipes.push({ x: canvas.width, y: pipeHeight });
}

function updatePipes() {
    pipes.forEach((pipe, index) => {
        pipe.x -= 3; // Move pipes to the left
        if (pipe.x + PIPE_WIDTH <= 0) {
            pipes.splice(index, 1);
            score++;
        }
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.y);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.y + PIPE_GAP, PIPE_WIDTH, canvas.height - pipe.y - PIPE_GAP);
    });
}

// Collision detection
function checkCollisions() {
    // Check if the bird collides with any pipe
    for (let pipe of pipes) {
        if (
            birdY < pipe.y || // Bird above the pipe
            birdY + bird.height > pipe.y + PIPE_GAP // Bird below the pipe
        ) {
            if (bird.x + bird.width > pipe.x && bird.x < pipe.x + PIPE_WIDTH) {
                return true; // Collision detected
            }
        }
    }
    return false;
}

// Game loop
let lastTime = 0;

function gameLoop(timestamp: number) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    bird.update(); // Update the bird's position
    bird.draw(); // Draw the bird

    updatePipes(); // Update pipe positions
    drawPipes(); // Draw pipes

    // Check collisions
    if (checkCollisions()) {
        alert('Game Over! Your score: ' + score);
        resetGame();
    }

    // Draw score
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    // Spawn pipes
    if (Math.random() < 1 / SPAWN_RATE) spawnPipe();

    requestAnimationFrame(gameLoop);
}

// Reset game
function resetGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
}

// Key Events for Flap
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') { // Space key to flap
        birdFlap = true;
    }
});

// Start game loop
requestAnimationFrame(gameLoop);
