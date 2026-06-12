const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet stats
let hunger = 0;
let happiness = 100;
let health = 100;

// Pet state
let petState = 'idle'; // idle, eating, playing, sick
let frameCount = 0;
let tickCount = 0;

// UI Elements
const hungerValue = document.getElementById('hungerValue');
const happinessValue = document.getElementById('happinessValue');
const healthValue = document.getElementById('healthValue');

const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');
const cleanBtn = document.getElementById('cleanBtn');

// Pixel drawing helper (to draw blocky pixels)
const PIXEL_SIZE = 20;

function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
}

// Simple pet sprites (10x10 grids)
const sprites = {
    idle1: [
        "  bbbb  ",
        " b    b ",
        "b b  b b",
        "b      b",
        "b bbbb b",
        "b      b",
        " bbbbbb ",
        "  b  b  ",
        " bb  bb "
    ],
    idle2: [
        "  bbbb  ",
        " b    b ",
        "b      b",
        "b b  b b",
        "b bbbb b",
        "b      b",
        " bbbbbb ",
        "  bb bb "
    ],
    eating: [
        "  bbbb  ",
        " b    b ",
        "b b  b b",
        "b  yy  b",
        "b bbbb b",
        "b      b",
        " bbbbbb ",
        "  b  b  ",
        " bb  bb "
    ],
    sad: [
        "  bbbb  ",
        " b    b ",
        "b      b",
        "b      b",
        "b  bb  b",
        "b b  b b",
        " bbbbbb ",
        "  b  b  ",
        " bb  bb "
    ]
};

function drawSprite(spriteData, offsetX, offsetY) {
    for (let y = 0; y < spriteData.length; y++) {
        const row = spriteData[y];
        for (let x = 0; x < row.length; x++) {
            const char = row[x];
            let color = null;
            if (char === 'b') color = '#2c3e50'; // black/dark blue
            if (char === 'y') color = '#f1c40f'; // yellow food

            if (color) {
                drawPixel(x + offsetX, y + offsetY, color);
            }
        }
    }
}

// Update stats
function updateStats() {
    tickCount++;
    if (tickCount % 60 === 0) { // Every ~1 second if 60fps
        hunger += 1;
        if (hunger > 100) hunger = 100;

        if (hunger > 70) {
            happiness -= 2;
        }

        if (happiness < 0) happiness = 0;

        if (hunger === 100 || happiness === 0) {
            health -= 1;
        }
        if (health < 0) health = 0;

        updateUI();
    }
}

function updateUI() {
    hungerValue.innerText = hunger;
    happinessValue.innerText = happiness;
    healthValue.innerText = health;
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateStats();

    frameCount++;

    // Determine which sprite to draw
    let currentSprite;
    if (health <= 0) {
        currentSprite = sprites.sad;
    } else if (petState === 'eating') {
        currentSprite = sprites.eating;
        if (frameCount % 30 === 0) petState = 'idle'; // Stop eating after a bit
    } else if (happiness < 30) {
        currentSprite = sprites.sad;
    } else {
        // Animate idle
        currentSprite = (Math.floor(frameCount / 30) % 2 === 0) ? sprites.idle1 : sprites.idle2;
    }

    // Center the sprite (roughly, assuming 10x10 max sprite size and 400x400 canvas, pixel size 20)
    // Canvas is 20x20 pixels (400/20)
    // Sprite is roughly 8x9 pixels
    const offsetX = Math.floor((20 - 8) / 2);
    const offsetY = Math.floor((20 - 9) / 2);

    drawSprite(currentSprite, offsetX, offsetY);

    requestAnimationFrame(gameLoop);
}

// Interactions
feedBtn.addEventListener('click', () => {
    if (health > 0) {
        hunger -= 20;
        if (hunger < 0) hunger = 0;
        petState = 'eating';
        updateUI();
    }
});

playBtn.addEventListener('click', () => {
    if (health > 0 && hunger < 80) {
        happiness += 20;
        if (happiness > 100) happiness = 100;
        hunger += 5; // Playing makes them hungry
        updateUI();
    }
});

cleanBtn.addEventListener('click', () => {
    if (health > 0) {
        health += 10;
        if (health > 100) health = 100;
        updateUI();
    }
});

// Initialize
updateUI();
gameLoop();
