const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let hunger = 100;
let happiness = 100;
let isPooping = false;
let poopX = 0;
let poopY = 0;
let lastTime = 0;
let frameCount = 0;
let currentFrame = 0;

// Pet state
const pet = {
    x: 150,
    y: 150,
    size: 40,
    state: 'idle', // idle, eating, playing
    actionTimer: 0
};

// Simple pixel art for the pet (8x8 grid scaled up)
const petSprite1 = [
    0,0,1,1,1,1,0,0,
    0,1,0,0,0,0,1,0,
    1,0,1,0,0,1,0,1,
    1,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,
    0,1,0,0,0,0,1,0,
    0,1,1,0,0,1,1,0,
    0,0,1,0,0,1,0,0
];

const petSprite2 = [
    0,0,1,1,1,1,0,0,
    0,1,0,0,0,0,1,0,
    1,0,1,0,0,1,0,1,
    1,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,
    0,1,0,0,0,0,1,0,
    0,0,1,1,1,1,0,0,
    0,0,1,0,0,1,0,0
];

const poopSprite = [
    0,0,0,1,1,0,0,0,
    0,0,1,1,1,1,0,0,
    0,1,1,1,1,1,1,0,
    1,1,1,1,1,1,1,1
];

function drawSprite(sprite, x, y, width, height, color = '#0f380f') {
    const pixelSizeX = width / 8;
    const pixelSizeY = height / (sprite.length / 8);

    ctx.fillStyle = color;
    for (let i = 0; i < sprite.length; i++) {
        if (sprite[i] === 1) {
            const px = x - width/2 + (i % 8) * pixelSizeX;
            const py = y - height/2 + Math.floor(i / 8) * pixelSizeY;
            ctx.fillRect(px, py, pixelSizeX, pixelSizeY);
        }
    }
}

function updateStats() {
    document.getElementById('hungerText').innerText = `Hunger: ${Math.floor(hunger)}%`;
    document.getElementById('happinessText').innerText = `Happy: ${Math.floor(happiness)}%`;
}

function decreaseStats(deltaTime) {
    // Decrease stats over time
    const decayRate = 0.5; // per second
    hunger = Math.max(0, hunger - (decayRate * deltaTime / 1000));
    happiness = Math.max(0, happiness - (decayRate * deltaTime / 1000));

    // Chance to poop if hunger goes down
    if (!isPooping && Math.random() < 0.001) {
        isPooping = true;
        poopX = pet.x - 30 + Math.random() * 60;
        poopY = pet.y + 20;
    }

    if (isPooping) {
        happiness = Math.max(0, happiness - (decayRate * 2 * deltaTime / 1000)); // Lose happiness faster if poop isn't cleaned
    }

    updateStats();
}

function update(deltaTime) {
    decreaseStats(deltaTime);

    // Pet animation
    frameCount += deltaTime;
    if (frameCount > 500) { // Switch frame every 500ms
        currentFrame = currentFrame === 0 ? 1 : 0;
        frameCount = 0;

        // Simple idle movement
        if (pet.state === 'idle') {
            pet.y = 150 + (currentFrame === 0 ? -2 : 2);
        }
    }

    // Handle action timers
    if (pet.state !== 'idle') {
        pet.actionTimer -= deltaTime;
        if (pet.actionTimer <= 0) {
            pet.state = 'idle';
        }
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw poop
    if (isPooping) {
        drawSprite(poopSprite, poopX, poopY, 20, 10, '#0f380f');
    }

    // Draw pet
    const spriteToDraw = currentFrame === 0 ? petSprite1 : petSprite2;

    if (pet.state === 'eating') {
        // Draw food
        ctx.fillStyle = '#0f380f';
        ctx.fillRect(pet.x + 20, pet.y, 10, 10);
    } else if (pet.state === 'playing') {
        // Draw ball
        ctx.fillStyle = '#0f380f';
        ctx.beginPath();
        ctx.arc(pet.x - 25, pet.y - 10 + (currentFrame * 5), 5, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSprite(spriteToDraw, pet.x, pet.y, pet.size, pet.size);
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

// Controls
document.getElementById('feedBtn').addEventListener('click', () => {
    hunger = Math.min(100, hunger + 20);
    pet.state = 'eating';
    pet.actionTimer = 2000;
    updateStats();
});

document.getElementById('playBtn').addEventListener('click', () => {
    happiness = Math.min(100, happiness + 20);
    hunger = Math.max(0, hunger - 5);
    pet.state = 'playing';
    pet.actionTimer = 2000;
    updateStats();
});

document.getElementById('cleanBtn').addEventListener('click', () => {
    if (isPooping) {
        isPooping = false;
        happiness = Math.min(100, happiness + 10);
        updateStats();
    }
});

// Start game
requestAnimationFrame(gameLoop);
