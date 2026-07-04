const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet state
let pet = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    color: '#FFD700', // Gold color for the pet
    hunger: 50,
    happiness: 50,
    state: 'idle', // idle, eating, playing
    stateTimer: 0
};

// UI elements
const hungerDisplay = document.getElementById('hunger');
const happinessDisplay = document.getElementById('happiness');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

// Game loop variables
let lastTime = 0;
const statDecayRate = 1; // Stats decrease by this much per second

function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = pet.color;

    // Simple pixel-art style pet (a square for now)
    // You can replace this with more complex pixel drawing logic

    if (pet.state === 'eating') {
        // Draw mouth open
        ctx.fillRect(pet.x - pet.size/2, pet.y - pet.size/2, pet.size, pet.size);
        ctx.fillStyle = '#000';
        ctx.fillRect(pet.x, pet.y, pet.size/2, pet.size/4); // Mouth
    } else if (pet.state === 'playing') {
        // Draw jumping
        ctx.fillRect(pet.x - pet.size/2, pet.y - pet.size/2 - (Math.sin(Date.now() / 100) * 5), pet.size, pet.size);
    } else {
        // Draw idle
        ctx.fillRect(pet.x - pet.size/2, pet.y - pet.size/2, pet.size, pet.size);
    }

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(pet.x - pet.size/4, pet.y - pet.size/4, 4, 4);
    ctx.fillRect(pet.x + pet.size/8, pet.y - pet.size/4, 4, 4);
}

function updateStats(deltaTime) {
    // Decrease stats over time
    const decay = statDecayRate * (deltaTime / 1000);
    pet.hunger = Math.max(0, pet.hunger - decay);
    pet.happiness = Math.max(0, pet.happiness - decay);

    // Update UI
    hungerDisplay.innerText = Math.round(pet.hunger);
    happinessDisplay.innerText = Math.round(pet.happiness);
}

function updateState(deltaTime) {
    if (pet.state !== 'idle') {
        pet.stateTimer -= deltaTime;
        if (pet.stateTimer <= 0) {
            pet.state = 'idle';
        }
    }
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    updateStats(deltaTime);
    updateState(deltaTime);
    drawPet();

    requestAnimationFrame(gameLoop);
}

// Event Listeners
feedBtn.addEventListener('click', () => {
    pet.hunger = Math.min(100, pet.hunger + 20);
    pet.state = 'eating';
    pet.stateTimer = 1000; // 1 second eating state
    hungerDisplay.innerText = Math.round(pet.hunger);
});

playBtn.addEventListener('click', () => {
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.state = 'playing';
    pet.stateTimer = 1000; // 1 second playing state
    happinessDisplay.innerText = Math.round(pet.happiness);
});

// Start game
requestAnimationFrame(gameLoop);