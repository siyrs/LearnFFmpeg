const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet State
let pet = {
    x: 150,
    y: 200,
    size: 40,
    health: 100,
    hunger: 0,
    happiness: 100,
    poop: 0,
    isSleeping: false,
    frame: 0,
    animationTimer: 0
};

// UI Elements
const healthEl = document.getElementById('health-val');
const hungerEl = document.getElementById('hunger-val');
const happinessEl = document.getElementById('happiness-val');
const statusEl = document.getElementById('status-message');

// Buttons
const btnFeed = document.getElementById('btn-feed');
const btnPlay = document.getElementById('btn-play');
const btnClean = document.getElementById('btn-clean');

// Game Loop Timing
let lastTime = 0;
let statTimer = 0;

// Colors
const PET_COLOR = '#ffcc00';
const EYE_COLOR = '#000000';
const POOP_COLOR = '#8b4513';

// Sprite drawing (Simple pixel art representation)
function drawPet(ctx, x, y, size, frame) {
    ctx.fillStyle = PET_COLOR;

    // Body (bouncing slightly based on frame)
    let bounce = (frame % 2 === 0) ? 0 : -5;
    ctx.fillRect(x - size/2, y - size/2 + bounce, size, size);

    // Eyes
    ctx.fillStyle = EYE_COLOR;
    if (pet.isSleeping) {
        // Closed eyes
        ctx.fillRect(x - size/4, y - size/8 + bounce, 5, 2);
        ctx.fillRect(x + size/4 - 5, y - size/8 + bounce, 5, 2);
    } else {
        // Open eyes
        ctx.fillRect(x - size/4, y - size/4 + bounce, 5, 5);
        ctx.fillRect(x + size/4 - 5, y - size/4 + bounce, 5, 5);
    }

    // Mouth
    if (pet.happiness < 30) {
        // Sad
        ctx.fillRect(x - 5, y + size/8 + bounce + 2, 10, 2);
    } else {
        // Happy
        ctx.fillRect(x - 5, y + size/8 + bounce, 10, 2);
        ctx.fillRect(x - 7, y + size/8 - 2 + bounce, 2, 2);
        ctx.fillRect(x + 5, y + size/8 - 2 + bounce, 2, 2);
    }
}

function drawPoop(ctx, x, y) {
    ctx.fillStyle = POOP_COLOR;
    ctx.fillRect(x - 10, y + 10, 20, 10);
    ctx.fillRect(x - 5, y + 5, 10, 5);
    ctx.fillRect(x - 2, y, 4, 5);
}

function updateStats() {
    healthEl.innerText = Math.max(0, Math.floor(pet.health));
    hungerEl.innerText = Math.min(100, Math.floor(pet.hunger));
    happinessEl.innerText = Math.max(0, Math.floor(pet.happiness));

    if (pet.health <= 0) {
        statusEl.innerText = "Oh no! Your pet passed away...";
    } else if (pet.hunger > 80) {
        statusEl.innerText = "I'm so hungry!";
    } else if (pet.poop > 2) {
        statusEl.innerText = "It's smelly here...";
    } else if (pet.happiness < 30) {
        statusEl.innerText = "I'm feeling sad.";
    } else {
        statusEl.innerText = "Pet is happy!";
    }
}

function gameLoop(timestamp) {
    if (pet.health <= 0) return; // Stop if dead

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#65a83a'; // Grass color
    ctx.fillRect(0, 220, canvas.width, 80);

    // Animation
    pet.animationTimer += deltaTime;
    if (pet.animationTimer > 500) { // toggle frame every 500ms
        pet.frame++;
        pet.animationTimer = 0;
    }

    // Draw poops
    for (let i = 0; i < pet.poop; i++) {
        drawPoop(ctx, 50 + (i * 40), 210);
    }

    // Draw pet
    drawPet(ctx, pet.x, pet.y, pet.size, pet.frame);

    // Stat changes over time
    statTimer += deltaTime;
    if (statTimer > 2000) { // Update stats every 2 seconds
        statTimer = 0;

        pet.hunger += 1;
        pet.happiness -= 0.5;

        if (pet.hunger > 100) pet.hunger = 100;
        if (pet.happiness < 0) pet.happiness = 0;

        if (pet.hunger > 80 || pet.happiness < 20 || pet.poop > 2) {
            pet.health -= 1;
        } else if (pet.health < 100 && pet.hunger < 50 && pet.happiness > 50 && pet.poop === 0) {
            pet.health += 1;
        }

        // Random chance to poop
        if (Math.random() < 0.05 && pet.poop < 5) {
            pet.poop++;
        }

        updateStats();
    }

    requestAnimationFrame(gameLoop);
}

// Interactions
btnFeed.addEventListener('click', () => {
    if (pet.health <= 0) return;
    pet.hunger -= 20;
    if (pet.hunger < 0) pet.hunger = 0;
    statusEl.innerText = "Yummy!";
    updateStats();
});

btnPlay.addEventListener('click', () => {
    if (pet.health <= 0) return;
    pet.happiness += 15;
    pet.hunger += 5; // Playing makes them hungry
    if (pet.happiness > 100) pet.happiness = 100;
    statusEl.innerText = "Wheee!";

    // Small jump animation
    let originalY = pet.y;
    pet.y -= 20;
    setTimeout(() => { pet.y = originalY; }, 200);

    updateStats();
});

btnClean.addEventListener('click', () => {
    if (pet.health <= 0) return;
    if (pet.poop > 0) {
        pet.poop = 0;
        statusEl.innerText = "All clean!";
    } else {
        statusEl.innerText = "It's already clean.";
    }
    updateStats();
});

// Start game
requestAnimationFrame(gameLoop);
