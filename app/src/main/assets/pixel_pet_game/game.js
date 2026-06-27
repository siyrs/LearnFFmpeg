const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const happinessSpan = document.getElementById('happiness');
const hungerSpan = document.getElementById('hunger');
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

// Pet State
let pet = {
    x: 120,
    y: 120,
    size: 20,
    color: '#FF69B4', // Hot pink
    happiness: 100,
    hunger: 0,
    state: 'idle', // idle, eating, playing
    frame: 0
};

// Game Loop Variables
let lastTime = 0;
const TICK_RATE = 1000; // 1 second
let timeSinceLastTick = 0;

// Simple Pixel Art Pet Drawing
function drawPet() {
    ctx.fillStyle = pet.color;

    // Bounce effect
    let yOffset = 0;
    if (pet.state === 'idle' && pet.frame % 2 === 0) {
        yOffset = -2;
    } else if (pet.state === 'playing' || pet.state === 'eating') {
        yOffset = (Math.sin(Date.now() / 100) * 5);
    }

    const drawY = pet.y + yOffset;

    // Body
    ctx.fillRect(pet.x - pet.size/2, drawY - pet.size, pet.size, pet.size);

    // Eyes
    ctx.fillStyle = '#000';
    if (pet.happiness > 50) {
        // Happy eyes
        ctx.fillRect(pet.x - 6, drawY - pet.size + 4, 4, 4);
        ctx.fillRect(pet.x + 2, drawY - pet.size + 4, 4, 4);
    } else {
        // Sad eyes
        ctx.fillRect(pet.x - 6, drawY - pet.size + 4, 4, 2);
        ctx.fillRect(pet.x + 2, drawY - pet.size + 4, 4, 2);
    }

    // Mouth
    if (pet.state === 'eating') {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(pet.x - 2, drawY - pet.size + 12, 4, 4);
    } else if (pet.happiness > 50) {
        // Smile
        ctx.fillRect(pet.x - 4, drawY - pet.size + 12, 8, 2);
    } else {
        // Frown
        ctx.fillRect(pet.x - 4, drawY - pet.size + 14, 8, 2);
    }
}

// Background Drawing
function drawBackground() {
    // Ground
    ctx.fillStyle = '#8FBC8F'; // Dark sea green
    ctx.fillRect(0, 130, canvas.width, 30);

    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(20, 20, 20, 20);
}

// Update Logic
function update(dt) {
    timeSinceLastTick += dt;

    if (timeSinceLastTick >= TICK_RATE) {
        timeSinceLastTick = 0;
        pet.frame++;

        // Increase hunger over time
        pet.hunger = Math.min(100, pet.hunger + 1);

        // Decrease happiness if hungry
        if (pet.hunger > 50) {
            pet.happiness = Math.max(0, pet.happiness - 2);
        } else {
             pet.happiness = Math.max(0, pet.happiness - 1);
        }

        // Return to idle state after actions
        if (pet.state !== 'idle' && Math.random() > 0.5) {
            pet.state = 'idle';
        }

        updateUI();
    }
}

// Draw Frame
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPet();
}

// Main Game Loop
function gameLoop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    update(dt);
    draw();

    requestAnimationFrame(gameLoop);
}

// UI Update
function updateUI() {
    happinessSpan.innerText = pet.happiness;
    hungerSpan.innerText = pet.hunger;
}

// Interactions
feedBtn.addEventListener('click', () => {
    pet.hunger = Math.max(0, pet.hunger - 20);
    pet.state = 'eating';
    updateUI();
});

playBtn.addEventListener('click', () => {
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.hunger = Math.min(100, pet.hunger + 5); // Playing makes them hungry
    pet.state = 'playing';
    updateUI();
});

// Start Game
requestAnimationFrame(gameLoop);
