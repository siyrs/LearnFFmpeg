// Game State
let petState = {
    hunger: 50,
    happiness: 50,
    energy: 100,
    isSleeping: false,
    x: 150, // Center of 300px canvas
    y: 200,
    direction: 1 // 1 for right, -1 for left
};

// UI Elements
const hungerValEl = document.getElementById('hungerVal');
const happinessValEl = document.getElementById('happinessVal');
const energyValEl = document.getElementById('energyVal');

function updateUI() {
    hungerValEl.textContent = Math.round(petState.hunger);
    happinessValEl.textContent = Math.round(petState.happiness);
    energyValEl.textContent = Math.round(petState.energy);
}

// Decrease stats over time
function updateState() {
    if (!petState.isSleeping) {
        petState.hunger = Math.max(0, petState.hunger - 0.5);
        petState.happiness = Math.max(0, petState.happiness - 0.2);
        petState.energy = Math.max(0, petState.energy - 0.1);
    } else {
        petState.energy = Math.min(100, petState.energy + 1);
        if (petState.energy >= 100) {
            petState.isSleeping = false; // Wake up when fully rested
        }
    }
    updateUI();
}

// Canvas and Rendering Context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Simple pixel pet drawing function
function drawPet(x, y, isSleeping) {
    const pixelSize = 5;

    // Body
    ctx.fillStyle = isSleeping ? '#888' : '#FFD700'; // Gray if sleeping, gold if awake
    ctx.fillRect(x - 4 * pixelSize, y - 4 * pixelSize, 8 * pixelSize, 8 * pixelSize);

    // Eyes
    ctx.fillStyle = '#000';
    if (isSleeping) {
        // Closed eyes
        ctx.fillRect(x - 2 * pixelSize, y - 2 * pixelSize, 1 * pixelSize, 1 * pixelSize);
        ctx.fillRect(x + 1 * pixelSize, y - 2 * pixelSize, 1 * pixelSize, 1 * pixelSize);
    } else {
        // Open eyes
        ctx.fillRect(x - 2 * pixelSize, y - 2 * pixelSize, 1 * pixelSize, 2 * pixelSize);
        ctx.fillRect(x + 1 * pixelSize, y - 2 * pixelSize, 1 * pixelSize, 2 * pixelSize);
    }

    // Mouth
    ctx.fillStyle = '#000';
    if (petState.happiness < 30) {
        // Sad
        ctx.fillRect(x - 1 * pixelSize, y + 2 * pixelSize, 2 * pixelSize, 1 * pixelSize);
    } else {
        // Happy
        ctx.fillRect(x - 1 * pixelSize, y + 2 * pixelSize, 2 * pixelSize, 1 * pixelSize);
        ctx.fillRect(x - 2 * pixelSize, y + 1 * pixelSize, 1 * pixelSize, 1 * pixelSize);
        ctx.fillRect(x + 1 * pixelSize, y + 1 * pixelSize, 1 * pixelSize, 1 * pixelSize);
    }
}

// Main Game Loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update position if awake
    if (!petState.isSleeping) {
        petState.x += petState.direction * 0.5;
        if (petState.x > canvas.width - 20 || petState.x < 20) {
            petState.direction *= -1; // Bounce off walls
        }
    }

    // Draw Pet
    drawPet(petState.x, petState.y, petState.isSleeping);

    requestAnimationFrame(gameLoop);
}

// Update game state every second
setInterval(updateState, 1000);

// Button Interactions
document.getElementById('feedBtn').addEventListener('click', () => {
    if (!petState.isSleeping) {
        petState.hunger = Math.min(100, petState.hunger + 20);
        petState.energy = Math.max(0, petState.energy - 5);
        updateUI();
    }
});

document.getElementById('playBtn').addEventListener('click', () => {
    if (!petState.isSleeping && petState.energy > 10) {
        petState.happiness = Math.min(100, petState.happiness + 20);
        petState.energy -= 10;
        petState.hunger = Math.max(0, petState.hunger - 5);
        updateUI();
    }
});

document.getElementById('sleepBtn').addEventListener('click', () => {
    petState.isSleeping = !petState.isSleeping;
    updateUI();
});

// Start the game loop
requestAnimationFrame(gameLoop);
