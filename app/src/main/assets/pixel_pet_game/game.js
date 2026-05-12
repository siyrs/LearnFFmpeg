const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const hungerVal = document.getElementById('hunger-val');
const happinessVal = document.getElementById('happiness-val');
const cleanlinessVal = document.getElementById('cleanliness-val');

// Pet state
const pet = {
    x: 80,
    y: 80,
    size: 40,
    color: '#0f380f', // Dark green for gameboy feel
    hunger: 100,
    happiness: 100,
    cleanliness: 100,
    isJumping: false,
    jumpHeight: 0
};

// Game loop variables
let lastTime = 0;
const statDecayRate = 0.5; // stats per second

function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawY = pet.y - pet.jumpHeight;

    ctx.fillStyle = pet.color;
    // Draw body
    ctx.fillRect(pet.x, drawY, pet.size, pet.size);

    // Draw eyes
    ctx.fillStyle = '#8bac0f'; // Background color to "erase"
    ctx.fillRect(pet.x + 8, drawY + 8, 8, 8); // Left eye
    ctx.fillRect(pet.x + 24, drawY + 8, 8, 8); // Right eye

    // Draw mouth based on happiness
    if (pet.happiness > 50) {
        // Smile
        ctx.fillRect(pet.x + 12, drawY + 24, 16, 4);
        ctx.fillRect(pet.x + 8, drawY + 20, 4, 4);
        ctx.fillRect(pet.x + 28, drawY + 20, 4, 4);
    } else {
        // Sad
        ctx.fillRect(pet.x + 12, drawY + 24, 16, 4);
        ctx.fillRect(pet.x + 8, drawY + 28, 4, 4);
        ctx.fillRect(pet.x + 28, drawY + 28, 4, 4);
    }

    // Draw poops if not clean
    if (pet.cleanliness < 50) {
        ctx.fillStyle = '#0f380f';
        ctx.fillRect(pet.x - 30, pet.y + 20, 10, 10);
        ctx.fillRect(pet.x - 25, pet.y + 15, 5, 5);
        if (pet.cleanliness < 20) {
            ctx.fillRect(pet.x + 50, pet.y + 20, 10, 10);
            ctx.fillRect(pet.x + 55, pet.y + 15, 5, 5);
        }
    }
}

function updateStats(dt) {
    // dt is delta time in seconds
    pet.hunger -= statDecayRate * dt;
    pet.happiness -= statDecayRate * dt;
    pet.cleanliness -= statDecayRate * dt;

    // Clamp values between 0 and 100
    pet.hunger = Math.max(0, Math.min(100, pet.hunger));
    pet.happiness = Math.max(0, Math.min(100, pet.happiness));
    pet.cleanliness = Math.max(0, Math.min(100, pet.cleanliness));

    // Update UI
    hungerVal.textContent = Math.floor(pet.hunger);
    happinessVal.textContent = Math.floor(pet.happiness);
    cleanlinessVal.textContent = Math.floor(pet.cleanliness);
}

function animateJump() {
    if (pet.isJumping) return;
    pet.isJumping = true;

    let jumpTick = 0;
    const jumpInterval = setInterval(() => {
        jumpTick++;
        if (jumpTick <= 10) {
            pet.jumpHeight += 2; // Go up
        } else if (jumpTick <= 20) {
            pet.jumpHeight -= 2; // Come down
        } else {
            pet.jumpHeight = 0;
            pet.isJumping = false;
            clearInterval(jumpInterval);
        }
    }, 20);
}

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000; // convert to seconds
    lastTime = timestamp;

    updateStats(dt);
    drawPet();

    requestAnimationFrame(gameLoop);
}

// Event Listeners
document.getElementById('feed-btn').addEventListener('click', () => {
    pet.hunger = Math.min(100, pet.hunger + 20);
    animateJump();
});

document.getElementById('play-btn').addEventListener('click', () => {
    pet.happiness = Math.min(100, pet.happiness + 20);
    animateJump();
});

document.getElementById('clean-btn').addEventListener('click', () => {
    pet.cleanliness = 100;
    animateJump();
});

// Start game
requestAnimationFrame(gameLoop);
