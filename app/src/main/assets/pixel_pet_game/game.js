const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const hungerStatEl = document.getElementById('hunger-stat');
const happinessStatEl = document.getElementById('happiness-stat');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

// Game State
let hunger = 50;
let happiness = 50;
let lastTime = 0;
let timeSinceLastTick = 0;

// Pet visual state
let isBlinking = false;
let blinkTimer = 0;
let isJumping = false;
let jumpY = 0;
let jumpVelocity = 0;
let isEating = false;
let eatTimer = 0;

// Simple 16x16 pixel pet pattern (0=empty, 1=main color, 2=eye/outline)
const petPattern = [
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,2,2,1,1,2,2,1,1,1,0,0],
    [0,0,1,1,2,2,2,2,1,2,2,2,2,1,0,0],
    [0,1,1,1,2,0,2,2,1,2,0,2,2,1,1,0],
    [0,1,1,1,2,2,2,2,1,2,2,2,2,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,2,2,2,2,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,2,2,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
];

// Blink pattern (eyes closed)
const blinkPattern = [
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,2,2,2,2,1,2,2,2,2,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,2,2,2,2,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,2,2,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
];


const pixelSize = 10;
const petWidth = petPattern[0].length * pixelSize;
const petHeight = petPattern.length * pixelSize;

function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw floor
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

    const startX = (canvas.width - petWidth) / 2;
    const baseY = canvas.height - 40 - petHeight;
    const startY = baseY - jumpY;

    const patternToUse = isBlinking ? blinkPattern : petPattern;

    for (let y = 0; y < patternToUse.length; y++) {
        for (let x = 0; x < patternToUse[y].length; x++) {
            if (patternToUse[y][x] === 1) {
                // Change color based on happiness
                if (happiness > 70) ctx.fillStyle = '#2ecc71'; // Green (happy)
                else if (happiness < 30) ctx.fillStyle = '#e74c3c'; // Red (sad/angry)
                else ctx.fillStyle = '#3498db'; // Blue (normal)

                ctx.fillRect(startX + x * pixelSize, startY + y * pixelSize, pixelSize, pixelSize);
            } else if (patternToUse[y][x] === 2) {
                ctx.fillStyle = '#2c3e50'; // Dark outline/eyes
                ctx.fillRect(startX + x * pixelSize, startY + y * pixelSize, pixelSize, pixelSize);
            }
        }
    }

    if (isEating) {
        // Draw food
        ctx.fillStyle = '#e67e22'; // Orange food
        ctx.fillRect(startX + petWidth - 20, startY + petHeight - 30, 20, 20);
    }

    // Draw status effects (like Zzz if sad and hungry)
    if (happiness < 20 && hunger < 20 && !isJumping && !isEating) {
        ctx.fillStyle = '#7f8c8d';
        ctx.font = '20px Courier New';
        ctx.fillText('Zzz...', startX + petWidth, startY + 20);
    }
}

function update(deltaTime) {
    // Decrease stats over time
    timeSinceLastTick += deltaTime;
    if (timeSinceLastTick > 3000) { // Every 3 seconds
        hunger = Math.max(0, hunger - 1);
        happiness = Math.max(0, happiness - 1);
        timeSinceLastTick = 0;
        updateUI();
    }

    // Random blinking
    if (!isBlinking && Math.random() < 0.01) {
        isBlinking = true;
        blinkTimer = 150; // blink duration in ms
    }

    if (isBlinking) {
        blinkTimer -= deltaTime;
        if (blinkTimer <= 0) isBlinking = false;
    }

    // Jumping logic
    if (isJumping) {
        jumpY += jumpVelocity * (deltaTime / 16);
        jumpVelocity -= 0.5 * (deltaTime / 16); // gravity

        if (jumpY <= 0) {
            jumpY = 0;
            isJumping = false;
        }
    }

    // Eating logic
    if (isEating) {
        eatTimer -= deltaTime;
        if (eatTimer <= 0) isEating = false;
    }
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    drawPet();

    requestAnimationFrame(gameLoop);
}

function updateUI() {
    hungerStatEl.innerText = hunger;
    happinessStatEl.innerText = happiness;
}

// Interaction
feedBtn.addEventListener('click', () => {
    hunger = Math.min(100, hunger + 15);
    isEating = true;
    eatTimer = 1000;
    updateUI();
});

playBtn.addEventListener('click', () => {
    happiness = Math.min(100, happiness + 15);
    if (!isJumping) {
        isJumping = true;
        jumpVelocity = 8;
    }
    updateUI();
});

// Start game
updateUI();
requestAnimationFrame((timestamp) => {
    lastTime = timestamp;
    gameLoop(timestamp);
});
