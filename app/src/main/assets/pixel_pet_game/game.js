const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet State
let pet = {
    x: 150,
    y: 150,
    size: 40,
    color: '#FFD700', // Gold color
    hunger: 50,
    happiness: 50,
    state: 'idle', // idle, eating, playing
    stateTimer: 0
};

// UI Elements
const hungerVal = document.getElementById('hungerVal');
const happinessVal = document.getElementById('happinessVal');
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

// Game Loop Timing
let lastTime = 0;
const TICK_RATE = 1000; // 1 second
let timeSinceLastTick = 0;

// Pixel Art Drawing Helper
function drawPixelRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Draw the pet
function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear background (sky blue set in CSS)

    // Base body
    const px = pet.x - pet.size / 2;
    const py = pet.y - pet.size / 2;
    const s = pet.size;

    // Body
    drawPixelRect(px, py, s, s, pet.color);

    // Eyes
    drawPixelRect(px + s * 0.2, py + s * 0.2, s * 0.2, s * 0.2, '#000');
    drawPixelRect(px + s * 0.6, py + s * 0.2, s * 0.2, s * 0.2, '#000');

    // Mouth/Expression based on state and stats
    if (pet.state === 'eating') {
        drawPixelRect(px + s * 0.4, py + s * 0.6, s * 0.2, s * 0.2, '#FF0000'); // Open mouth
    } else if (pet.state === 'playing') {
        // Happy face
        drawPixelRect(px + s * 0.2, py + s * 0.6, s * 0.6, s * 0.1, '#000');
        drawPixelRect(px + s * 0.2, py + s * 0.5, s * 0.1, s * 0.1, '#000');
        drawPixelRect(px + s * 0.7, py + s * 0.5, s * 0.1, s * 0.1, '#000');
    } else if (pet.happiness < 30) {
        // Sad face
        drawPixelRect(px + s * 0.3, py + s * 0.7, s * 0.4, s * 0.1, '#000');
        drawPixelRect(px + s * 0.2, py + s * 0.8, s * 0.1, s * 0.1, '#000');
        drawPixelRect(px + s * 0.7, py + s * 0.8, s * 0.1, s * 0.1, '#000');
    } else {
        // Normal smile
        drawPixelRect(px + s * 0.3, py + s * 0.6, s * 0.4, s * 0.1, '#000');
        drawPixelRect(px + s * 0.2, py + s * 0.5, s * 0.1, s * 0.1, '#000');
        drawPixelRect(px + s * 0.7, py + s * 0.5, s * 0.1, s * 0.1, '#000');
    }

    // Animation logic
    if (pet.state !== 'idle') {
        pet.stateTimer--;
        if (pet.stateTimer <= 0) {
            pet.state = 'idle';
            pet.y = 150; // Reset position
        } else {
            // Simple bounce animation
            if (pet.stateTimer % 10 > 5) {
                pet.y = 145;
            } else {
                pet.y = 155;
            }
        }
    }
}

// Update stats
function updateStats(deltaTime) {
    timeSinceLastTick += deltaTime;

    if (timeSinceLastTick >= TICK_RATE) {
        timeSinceLastTick = 0;

        // Decrease stats over time
        pet.hunger = Math.max(0, pet.hunger - 1);
        pet.happiness = Math.max(0, pet.happiness - 0.5);

        // Update UI
        updateUI();
    }
}

function updateUI() {
    hungerVal.textContent = Math.floor(pet.hunger);
    happinessVal.textContent = Math.floor(pet.happiness);

    // Visual feedback for low stats
    hungerVal.style.color = pet.hunger < 30 ? 'red' : 'inherit';
    happinessVal.style.color = pet.happiness < 30 ? 'red' : 'inherit';
}

// Actions
feedBtn.addEventListener('click', () => {
    if (pet.state === 'idle') {
        pet.hunger = Math.min(100, pet.hunger + 20);
        pet.state = 'eating';
        pet.stateTimer = 30; // Frames for animation
        updateUI();
    }
});

playBtn.addEventListener('click', () => {
    if (pet.state === 'idle') {
        // Playing makes them a bit hungry but happy
        pet.happiness = Math.min(100, pet.happiness + 20);
        pet.hunger = Math.max(0, pet.hunger - 5);
        pet.state = 'playing';
        pet.stateTimer = 30;
        updateUI();
    }
});

// Main Game Loop
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    updateStats(deltaTime);
    drawPet();

    requestAnimationFrame(gameLoop);
}

// Start game
requestAnimationFrame(gameLoop);
updateUI();
