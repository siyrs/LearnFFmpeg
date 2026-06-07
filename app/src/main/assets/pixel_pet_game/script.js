const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const hungerVal = document.getElementById('hunger-val');
const happinessVal = document.getElementById('happiness-val');
const btnFeed = document.getElementById('btn-feed');
const btnPlay = document.getElementById('btn-play');

// Pet State
let pet = {
    x: 150,
    y: 150,
    size: 40,
    hunger: 100,
    happiness: 100,
    state: 'idle', // idle, eating, playing
    color: '#FFD700', // Gold color for the pet
    eyeColor: '#000',
    dir: 1, // 1 for right, -1 for left
    moveTimer: 0
};

// Simple pixel art drawing (a square blob with eyes)
function drawPet() {
    ctx.fillStyle = pet.color;

    // Body (simple rectangle for now, simulating pixels)
    ctx.fillRect(pet.x - pet.size/2, pet.y - pet.size/2, pet.size, pet.size);

    // Eyes
    ctx.fillStyle = pet.eyeColor;
    let eyeOffsetX = 10 * pet.dir;
    let eyeOffsetY = -5;
    let eyeSize = 6;

    // Left eye (relative to face direction)
    ctx.fillRect(pet.x - pet.size/4 + eyeOffsetX, pet.y + eyeOffsetY, eyeSize, eyeSize);
    // Right eye
    ctx.fillRect(pet.x + pet.size/4 + eyeOffsetX, pet.y + eyeOffsetY, eyeSize, eyeSize);

    // Mouth (changes based on state)
    ctx.fillStyle = '#FF6347'; // Tomato red
    if (pet.state === 'eating') {
        ctx.fillRect(pet.x + eyeOffsetX, pet.y + 10, 10, 10); // Open mouth
    } else if (pet.happiness > 50) {
        ctx.fillRect(pet.x - 5 + eyeOffsetX, pet.y + 10, 10, 4); // Smile
    } else {
        ctx.fillRect(pet.x - 5 + eyeOffsetX, pet.y + 15, 10, 4); // Sad line
    }
}

function updateState() {
    // Decrease stats over time
    pet.hunger = Math.max(0, pet.hunger - 0.1);
    pet.happiness = Math.max(0, pet.happiness - 0.05);

    // Update UI
    hungerVal.innerText = Math.floor(pet.hunger);
    happinessVal.innerText = Math.floor(pet.happiness);

    // Color changes based on health
    if (pet.hunger < 30 || pet.happiness < 30) {
        pet.color = '#BDB76B'; // Dark Khaki - looks sickly
    } else {
        pet.color = '#FFD700'; // Gold - healthy
    }

    // Simple wandering AI
    if (pet.state === 'idle') {
        pet.moveTimer++;
        if (pet.moveTimer > 60) { // Change direction/movement every second (approx 60fps)
            pet.moveTimer = 0;
            if (Math.random() > 0.5) {
                pet.dir = Math.random() > 0.5 ? 1 : -1;
                let moveAmount = (Math.random() * 20 + 10) * pet.dir;
                pet.x += moveAmount;

                // Keep in bounds
                if (pet.x < pet.size/2) pet.x = pet.size/2;
                if (pet.x > canvas.width - pet.size/2) pet.x = canvas.width - pet.size/2;
            }
        }
    }
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#8FBC8F'; // Dark Sea Green
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // Keep pet on ground
    pet.y = canvas.height - 50 - pet.size/2;

    updateState();
    drawPet();

    // Reset temporary states
    if (pet.state !== 'idle' && Math.random() < 0.05) {
        pet.state = 'idle';
    }

    requestAnimationFrame(gameLoop);
}

// Interactions
btnFeed.addEventListener('click', () => {
    if (pet.hunger < 100) {
        pet.hunger = Math.min(100, pet.hunger + 20);
        pet.state = 'eating';
        // Jump slightly
        pet.y -= 20;
    }
});

btnPlay.addEventListener('click', () => {
    if (pet.happiness < 100) {
        pet.happiness = Math.min(100, pet.happiness + 20);
        pet.hunger = Math.max(0, pet.hunger - 5); // Playing makes them hungry
        pet.state = 'playing';
        pet.dir *= -1; // Spin around
    }
});

// Start game
gameLoop();