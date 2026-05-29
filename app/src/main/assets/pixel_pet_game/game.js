const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const hungerValEl = document.getElementById('hunger-val');
const happinessValEl = document.getElementById('happiness-val');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

// Pet State
let pet = {
    x: 150,
    y: 200,
    size: 40,
    color: '#ffcc00',
    hunger: 100,
    happiness: 100,
    isJumping: false,
    jumpHeight: 0,
    maxJump: 40,
    jumpDir: 1, // 1 for up, -1 for down
};

// Game Constants
const DECAY_RATE = 0.5; // How much stats decay per update
const UPDATE_INTERVAL = 1000; // 1 second

// Last update time
let lastUpdateTime = Date.now();

function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 240, canvas.width, 60);
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 230, canvas.width, 10);

    // Calculate Y pos based on jump
    const currentY = pet.y - pet.jumpHeight;

    // Draw Pet Body
    ctx.fillStyle = pet.color;
    ctx.fillRect(pet.x - pet.size/2, currentY - pet.size, pet.size, pet.size);

    // Draw Pet Eyes
    ctx.fillStyle = '#000';
    // Left eye
    ctx.fillRect(pet.x - pet.size/4 - 2, currentY - pet.size + 10, 4, 4);
    // Right eye
    ctx.fillRect(pet.x + pet.size/4 - 2, currentY - pet.size + 10, 4, 4);

    // Draw mouth based on happiness
    if (pet.happiness > 50) {
        // Happy mouth
        ctx.fillRect(pet.x - 5, currentY - pet.size + 25, 10, 2);
        ctx.fillRect(pet.x - 7, currentY - pet.size + 23, 2, 2);
        ctx.fillRect(pet.x + 5, currentY - pet.size + 23, 2, 2);
    } else {
        // Sad mouth
        ctx.fillRect(pet.x - 5, currentY - pet.size + 25, 10, 2);
        ctx.fillRect(pet.x - 7, currentY - pet.size + 27, 2, 2);
        ctx.fillRect(pet.x + 5, currentY - pet.size + 27, 2, 2);
    }
}

function updateState() {
    const now = Date.now();
    if (now - lastUpdateTime > UPDATE_INTERVAL) {
        pet.hunger = Math.max(0, pet.hunger - DECAY_RATE);
        pet.happiness = Math.max(0, pet.happiness - DECAY_RATE);
        lastUpdateTime = now;
        updateUI();
    }

    // Jump animation logic
    if (pet.isJumping) {
        pet.jumpHeight += 4 * pet.jumpDir;
        if (pet.jumpHeight >= pet.maxJump) {
            pet.jumpDir = -1; // start falling
        } else if (pet.jumpHeight <= 0) {
            pet.jumpHeight = 0;
            pet.isJumping = false;
            pet.jumpDir = 1; // reset for next jump
        }
    }

    // Change color based on health
    if (pet.hunger < 30 || pet.happiness < 30) {
        pet.color = '#ff6666'; // Reddish - unhappy/hungry
    } else {
        pet.color = '#ffcc00'; // Normal yellow
    }
}

function updateUI() {
    hungerValEl.textContent = Math.floor(pet.hunger);
    happinessValEl.textContent = Math.floor(pet.happiness);
}

function gameLoop() {
    updateState();
    drawPet();
    requestAnimationFrame(gameLoop);
}

// Button Listeners
feedBtn.addEventListener('click', () => {
    pet.hunger = Math.min(100, pet.hunger + 15);
    pet.isJumping = true; // happy jump
    updateUI();
});

playBtn.addEventListener('click', () => {
    pet.happiness = Math.min(100, pet.happiness + 15);
    pet.hunger = Math.max(0, pet.hunger - 5); // playing makes hungry
    pet.isJumping = true; // happy jump
    updateUI();
});

// Start game
updateUI();
requestAnimationFrame(gameLoop);
