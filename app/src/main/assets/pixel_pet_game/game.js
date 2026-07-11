// Game Constants
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;
const PET_SIZE = 10; // "Pixel" size multiplier
const UPDATE_INTERVAL = 1000; // Update stats every second

// Pet State
let pet = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    hunger: 50,      // 0-100, 100 is starving
    happiness: 50,   // 0-100, 100 is ecstatic
    hygiene: 50,     // 0-100, 0 is filthy
    energy: 50,      // 0-100, 0 is exhausted
    state: 'idle',   // idle, eating, playing, sleeping, cleaning
    frame: 0
};

// Load saved state
function loadState() {
    const saved = localStorage.getItem('pixel_pet_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        pet.hunger = parsed.hunger !== undefined ? parsed.hunger : 50;
        pet.happiness = parsed.happiness !== undefined ? parsed.happiness : 50;
        pet.hygiene = parsed.hygiene !== undefined ? parsed.hygiene : 50;
        pet.energy = parsed.energy !== undefined ? parsed.energy : 50;
        // Don't load position or state for a fresh view
    }
}

// Save state
function saveState() {
    localStorage.setItem('pixel_pet_state', JSON.stringify({
        hunger: pet.hunger,
        happiness: pet.happiness,
        hygiene: pet.hygiene,
        energy: pet.energy
    }));
}

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hungerDisplay = document.getElementById('hungerValue');
const happinessDisplay = document.getElementById('happinessValue');
const hygieneDisplay = document.getElementById('hygieneValue');
const energyDisplay = document.getElementById('energyValue');

const hungerBar = document.getElementById('hungerBar');
const happinessBar = document.getElementById('happinessBar');
const hygieneBar = document.getElementById('hygieneBar');
const energyBar = document.getElementById('energyBar');

// Timing
let lastTime = 0;
let lastUpdate = 0;
let animationTimer = 0;

// Simple pixel art definitions (1s are color, 0s are empty)
const spriteIdle1 = [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0]
];

const spriteIdle2 = [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1]
];

const spriteSleep1 = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [0, 1, 1, 1, 0]
];

const spriteSleep2 = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0]
];

// Drawing function
function drawSprite(sprite, x, y, color) {
    ctx.fillStyle = color;
    const width = sprite[0].length * PET_SIZE;
    const height = sprite.length * PET_SIZE;
    const startX = x - width / 2;
    const startY = y - height / 2;

    for (let r = 0; r < sprite.length; r++) {
        for (let c = 0; c < sprite[r].length; c++) {
            if (sprite[r][c] === 1) {
                ctx.fillRect(startX + c * PET_SIZE, startY + r * PET_SIZE, PET_SIZE, PET_SIZE);
            }
        }
    }
}

function updateBar(barElement, value, reverse = false) {
    if (!barElement) return;
    barElement.style.width = value + '%';
    // Color logic
    if (reverse) {
        // High is bad (like hunger)
        if (value > 80) barElement.style.backgroundColor = '#e74c3c'; // red
        else if (value > 50) barElement.style.backgroundColor = '#f1c40f'; // yellow
        else barElement.style.backgroundColor = '#2ecc71'; // green
    } else {
        // Low is bad (like happiness, hygiene, energy)
        if (value < 20) barElement.style.backgroundColor = '#e74c3c'; // red
        else if (value < 50) barElement.style.backgroundColor = '#f1c40f'; // yellow
        else barElement.style.backgroundColor = '#2ecc71'; // green
    }
}

// Main Draw Loop
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Determine color and sprite based on state
    let petColor = '#3498db'; // Default blue
    let currentSprite = (pet.frame % 2 === 0) ? spriteIdle1 : spriteIdle2;
    let bounceY = (pet.frame % 2 === 0) ? 0 : 5;

    if (pet.state === 'sleeping') {
        petColor = '#34495e'; // dark blue
        currentSprite = (pet.frame % 2 === 0) ? spriteSleep1 : spriteSleep2;
        bounceY = 0; // No bounce while sleeping

        // draw Zzz
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '20px Courier New';
        if (pet.frame % 2 === 0) {
            ctx.fillText('Z', pet.x + 30, pet.y - 30);
        } else {
            ctx.fillText('Z z', pet.x + 30, pet.y - 40);
        }
    } else if (pet.state === 'cleaning') {
        petColor = '#ecf0f1'; // white/bubbles

        // draw bubbles
        ctx.fillStyle = '#add8e6';
        if (pet.frame % 2 === 0) {
            ctx.beginPath(); ctx.arc(pet.x - 20, pet.y - 20, 5, 0, 2*Math.PI); ctx.fill();
            ctx.beginPath(); ctx.arc(pet.x + 25, pet.y + 10, 8, 0, 2*Math.PI); ctx.fill();
        } else {
            ctx.beginPath(); ctx.arc(pet.x - 25, pet.y - 10, 8, 0, 2*Math.PI); ctx.fill();
            ctx.beginPath(); ctx.arc(pet.x + 20, pet.y - 20, 5, 0, 2*Math.PI); ctx.fill();
        }
    } else if (pet.state === 'eating') {
         petColor = '#f1c40f'; // eating color
    } else if (pet.state === 'playing') {
         petColor = '#9b59b6'; // playing color
    } else {
        if (pet.hunger > 80 || pet.happiness < 20 || pet.hygiene < 20 || pet.energy < 20) {
            petColor = '#e74c3c'; // Sad/Hungry/Dirty/Tired red
        } else if (pet.happiness > 80 && pet.hunger < 20 && pet.hygiene > 80 && pet.energy > 80) {
            petColor = '#2ecc71'; // Happy green
        }
    }

    drawSprite(currentSprite, pet.x, pet.y - bounceY, petColor);
}

// Logic Update
function update(deltaTime) {
    animationTimer += deltaTime;
    if (animationTimer > 500) { // Toggle frame every 500ms
        pet.frame++;
        animationTimer = 0;

        // Reset state after animation (for short actions)
        if (pet.state === 'eating' || pet.state === 'playing' || pet.state === 'cleaning') {
            if (Math.random() > 0.5) {
                pet.state = 'idle';
            }
        }

        // Sleep state lasts longer or until energy is full
        if (pet.state === 'sleeping' && pet.energy >= 100) {
            pet.state = 'idle';
        }
    }

    lastUpdate += deltaTime;
    if (lastUpdate > UPDATE_INTERVAL) {
        lastUpdate = 0;

        // Update stats
        if (pet.state === 'sleeping') {
            if (pet.energy < 100) pet.energy += 5;
            if (pet.hunger < 100) pet.hunger += 0.5; // slow hunger while sleeping
        } else {
            // Increase hunger over time
            if (pet.hunger < 100) pet.hunger += 1;
            // Decrease happiness over time
            if (pet.happiness > 0) pet.happiness -= 1;
            // Decrease hygiene over time
            if (pet.hygiene > 0) pet.hygiene -= 0.5;
            // Decrease energy over time
            if (pet.energy > 0) pet.energy -= 1;
        }

        // clamp values
        pet.hunger = Math.min(100, Math.max(0, pet.hunger));
        pet.happiness = Math.min(100, Math.max(0, pet.happiness));
        pet.hygiene = Math.min(100, Math.max(0, pet.hygiene));
        pet.energy = Math.min(100, Math.max(0, pet.energy));

        saveState();
        updateUI();
    }
}

// Game Loop
function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

// Update DOM elements
function updateUI() {
    if(hungerDisplay) hungerDisplay.innerText = Math.floor(pet.hunger);
    if(happinessDisplay) happinessDisplay.innerText = Math.floor(pet.happiness);
    if(hygieneDisplay) hygieneDisplay.innerText = Math.floor(pet.hygiene);
    if(energyDisplay) energyDisplay.innerText = Math.floor(pet.energy);

    updateBar(hungerBar, pet.hunger, true);
    updateBar(happinessBar, pet.happiness);
    updateBar(hygieneBar, pet.hygiene);
    updateBar(energyBar, pet.energy);
}

// Interactions
if(document.getElementById('btnFeed')) {
    document.getElementById('btnFeed').addEventListener('click', () => {
        if (pet.state === 'sleeping') return; // Cannot feed while sleeping
        pet.hunger = Math.max(0, pet.hunger - 15);
        pet.state = 'eating';
        updateUI();
        saveState();
    });
}

if(document.getElementById('btnPlay')) {
    document.getElementById('btnPlay').addEventListener('click', () => {
        if (pet.state === 'sleeping') return;
        if (pet.energy < 10) return; // Not enough energy to play
        pet.happiness = Math.min(100, pet.happiness + 15);
        pet.energy = Math.max(0, pet.energy - 10);
        pet.state = 'playing';
        updateUI();
        saveState();
    });
}

if(document.getElementById('btnClean')) {
    document.getElementById('btnClean').addEventListener('click', () => {
        if (pet.state === 'sleeping') return;
        pet.hygiene = 100;
        pet.state = 'cleaning';
        updateUI();
        saveState();
    });
}

if(document.getElementById('btnSleep')) {
    document.getElementById('btnSleep').addEventListener('click', () => {
        if (pet.state === 'sleeping') {
            pet.state = 'idle'; // wake up
        } else {
            pet.state = 'sleeping'; // go to sleep
        }
        updateUI();
        saveState();
    });
}

// Start game
loadState();
updateUI();
requestAnimationFrame(gameLoop);
