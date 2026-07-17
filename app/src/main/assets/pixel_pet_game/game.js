// Game Constants
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;
const PET_SIZE = 10; // "Pixel" size multiplier
const UPDATE_INTERVAL = 60000; // Update stats every minute

// Pet State
let pet = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    hunger: 50,      // 0-100, 100 is starving
    happiness: 50,   // 0-100, 100 is ecstatic
    state: 'idle',   // idle, eating, playing
    frame: 0
};

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hungerDisplay = document.getElementById('hungerValue');
const happinessDisplay = document.getElementById('happinessValue');

// Timing
let lastTime = 0;
let lastUpdate = 0;
let animationTimer = 0;

// Simple pixel art definitions (1s are color, 0s are empty)
const spriteIdle1 = [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1]
];

const spriteIdle2 = [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0]
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

// Main Draw Loop
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Determine color based on state
    let petColor = '#3498db'; // Default blue
    if (pet.hunger > 80 || pet.happiness < 20) {
        petColor = '#e74c3c'; // Sad/Hungry red
    } else if (pet.happiness > 80 && pet.hunger < 20) {
        petColor = '#2ecc71'; // Happy green
    }

    // Bounce animation
    let currentSprite = (pet.frame % 2 === 0) ? spriteIdle1 : spriteIdle2;
    let bounceY = (pet.frame % 2 === 0) ? 0 : 5;

    if(pet.state === 'eating') {
         petColor = '#f1c40f'; // eating color
    }
    if(pet.state === 'playing') {
         petColor = '#9b59b6'; // playing color
    }

    drawSprite(currentSprite, pet.x, pet.y - bounceY, petColor);
}

// Logic Update
function update(deltaTime) {
    animationTimer += deltaTime;
    if (animationTimer > 500) { // Toggle frame every 500ms
        pet.frame++;
        animationTimer = 0;

        // Reset state after animation
        if(pet.state !== 'idle' && Math.random() > 0.5) {
            pet.state = 'idle';
        }
    }

    lastUpdate += deltaTime;
    if (lastUpdate > UPDATE_INTERVAL) {
        lastUpdate = 0;

        // Increase hunger over time
        if (pet.hunger < 100) pet.hunger += 1;
        // Decrease happiness over time
        if (pet.happiness > 0) pet.happiness -= 1;

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

// Helper to save state to localStorage
function saveState() {
    const state = {
        hunger: pet.hunger,
        happiness: pet.happiness,
        timestamp: Date.now()
    };
    localStorage.setItem('pixelPetState', JSON.stringify(state));
}

// Update DOM elements
function updateUI() {
    hungerDisplay.innerText = pet.hunger;
    happinessDisplay.innerText = pet.happiness;
    saveState();
}

// Interactions
document.getElementById('btnFeed').addEventListener('click', () => {
    pet.hunger = Math.max(0, pet.hunger - 15);
    pet.state = 'eating';
    updateUI();
});

document.getElementById('btnPlay').addEventListener('click', () => {
    pet.happiness = Math.min(100, pet.happiness + 15);
    pet.state = 'playing';
    updateUI();
});

// Initialize Game
function init() {
    const savedStateStr = localStorage.getItem('pixelPetState');
    if (savedStateStr) {
        try {
            const savedState = JSON.parse(savedStateStr);
            const now = Date.now();
            const timeDiff = now - savedState.timestamp;

            // Calculate missed intervals
            const intervalsMissed = Math.floor(timeDiff / UPDATE_INTERVAL);

            pet.hunger = Math.min(100, savedState.hunger + intervalsMissed);
            pet.happiness = Math.max(0, savedState.happiness - intervalsMissed);

        } catch (e) {
            console.error('Error parsing saved state', e);
        }
    }

    updateUI();
    requestAnimationFrame(gameLoop);
}

// Start game
init();
