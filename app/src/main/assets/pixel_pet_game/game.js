const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const hungerSpan = document.getElementById('hunger-stat');
const happinessSpan = document.getElementById('happiness-stat');

const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

// Game State
let pet = {
    x: 100,
    y: 120,
    width: 40,
    height: 40,
    hunger: 100,
    happiness: 100,
    color: '#ffcc00',
    isJumping: false,
    jumpOffset: 0
};

let lastTime = 0;
const STAT_DECAY_RATE = 2000; // ms per stat point drop
let statTimer = 0;

// Simple pet drawing
function drawPet() {
    ctx.fillStyle = pet.color;

    let drawY = pet.y - pet.jumpOffset;

    // Body
    ctx.fillRect(pet.x - pet.width/2, drawY - pet.height/2, pet.width, pet.height);

    // Eyes
    ctx.fillStyle = 'black';
    ctx.fillRect(pet.x - 10, drawY - 10, 5, 5);
    ctx.fillRect(pet.x + 5, drawY - 10, 5, 5);

    // Mouth
    if (pet.happiness > 50) {
        ctx.fillRect(pet.x - 5, drawY + 5, 10, 2);
    } else {
        ctx.fillRect(pet.x - 5, drawY + 8, 10, 2);
    }
}

// Background drawing
function drawBackground() {
    ctx.fillStyle = '#87CEEB'; // Sky
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#90EE90'; // Ground
    ctx.fillRect(0, 140, canvas.width, 60);
}

// Update game logic
function update(deltaTime) {
    statTimer += deltaTime;

    if (statTimer > STAT_DECAY_RATE) {
        statTimer = 0;
        pet.hunger = Math.max(0, pet.hunger - 2);
        pet.happiness = Math.max(0, pet.happiness - 1);
        updateUI();
    }

    // Simple jump animation
    if (pet.isJumping) {
        pet.jumpOffset += 5;
        if (pet.jumpOffset > 30) {
            pet.isJumping = false;
        }
    } else if (pet.jumpOffset > 0) {
        pet.jumpOffset -= 5;
    }

    // Change color based on health
    if (pet.hunger < 30 || pet.happiness < 30) {
        pet.color = '#ff6666'; // sad
    } else {
        pet.color = '#ffcc00'; // happy
    }
}

// UI updates
function updateUI() {
    hungerSpan.innerText = pet.hunger;
    happinessSpan.innerText = pet.happiness;
}

// Actions
feedBtn.addEventListener('click', () => {
    pet.hunger = Math.min(100, pet.hunger + 15);
    pet.isJumping = true;
    updateUI();
});

playBtn.addEventListener('click', () => {
    pet.happiness = Math.min(100, pet.happiness + 15);
    pet.hunger = Math.max(0, pet.hunger - 5); // Playing makes them hungry
    pet.isJumping = true;
    updateUI();
});

// Game Loop
function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPet();

    requestAnimationFrame(gameLoop);
}

// Start game
updateUI();
requestAnimationFrame(gameLoop);
