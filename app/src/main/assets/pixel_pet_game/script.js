const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Game state
let pet = {
    x: 150,
    y: 200,
    size: 40,
    color: '#FFD700', // Gold
    hunger: 100,
    happiness: 100,
    energy: 100,
    state: 'idle', // idle, eating, playing, sleeping
    frame: 0
};

// UI Elements
const hungerVal = document.getElementById('hunger-val');
const happinessVal = document.getElementById('happiness-val');
const energyVal = document.getElementById('energy-val');

const btnFeed = document.getElementById('btn-feed');
const btnPlay = document.getElementById('btn-play');
const btnSleep = document.getElementById('btn-sleep');

// Event Listeners
btnFeed.addEventListener('click', () => {
    if (pet.state !== 'sleeping') {
        pet.hunger = Math.min(100, pet.hunger + 20);
        pet.state = 'eating';
        setTimeout(() => pet.state = 'idle', 1000);
        updateUI();
    }
});

btnPlay.addEventListener('click', () => {
    if (pet.state !== 'sleeping' && pet.energy > 10) {
        pet.happiness = Math.min(100, pet.happiness + 20);
        pet.energy = Math.max(0, pet.energy - 10);
        pet.hunger = Math.max(0, pet.hunger - 5);
        pet.state = 'playing';
        setTimeout(() => pet.state = 'idle', 1000);
        updateUI();
    }
});

btnSleep.addEventListener('click', () => {
    if (pet.state === 'sleeping') {
        pet.state = 'idle'; // Wake up
        btnSleep.innerText = 'Sleep';
    } else {
        pet.state = 'sleeping';
        btnSleep.innerText = 'Wake';
    }
});

// Game Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game logic
function update() {
    pet.frame++;

    // Decay stats over time
    if (pet.frame % 60 === 0) { // Every second (assuming 60fps)
        if (pet.state !== 'sleeping') {
            pet.hunger = Math.max(0, pet.hunger - 1);
            pet.happiness = Math.max(0, pet.happiness - 1);
            pet.energy = Math.max(0, pet.energy - 1);
        } else {
            pet.energy = Math.min(100, pet.energy + 5);
            pet.hunger = Math.max(0, pet.hunger - 0.5);
            if(pet.energy === 100) {
                 pet.state = 'idle';
                 btnSleep.innerText = 'Sleep';
            }
        }
        updateUI();
    }

    // Simple animation logic
    if (pet.state === 'playing') {
        pet.y = 200 - Math.abs(Math.sin(pet.frame / 10)) * 20; // Jump
    } else {
        pet.y = 200;
    }
}

// Draw to canvas
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 240, canvas.width, 60);
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 230, canvas.width, 10);

    // Draw pet (simple pixel art style rectangle for now)
    ctx.fillStyle = pet.color;

    if (pet.state === 'sleeping') {
        ctx.fillRect(pet.x - pet.size/2, pet.y + pet.size/2, pet.size, pet.size/2); // Flattened
        // Zzz
        ctx.fillStyle = 'black';
        ctx.font = '20px Courier';
        ctx.fillText('Z', pet.x + 20, pet.y);
        ctx.fillText('z', pet.x + 35, pet.y - 15);
    } else {
        ctx.fillRect(pet.x - pet.size/2, pet.y - pet.size/2, pet.size, pet.size);

        // Eyes
        ctx.fillStyle = 'black';
        ctx.fillRect(pet.x - 10, pet.y - 10, 5, 5);
        ctx.fillRect(pet.x + 5, pet.y - 10, 5, 5);

        if (pet.state === 'eating') {
            // Open mouth
            ctx.fillRect(pet.x - 5, pet.y + 5, 10, 10);

            // Food
            ctx.fillStyle = 'brown';
            ctx.fillRect(pet.x - 20, pet.y + 10, 10, 10);
        } else if (pet.happiness > 50) {
             // Smile
            ctx.fillRect(pet.x - 10, pet.y + 5, 20, 5);
            ctx.fillRect(pet.x - 10, pet.y, 5, 5);
            ctx.fillRect(pet.x + 5, pet.y, 5, 5);
        } else {
            // Sad
            ctx.fillRect(pet.x - 10, pet.y + 5, 20, 5);
            ctx.fillRect(pet.x - 10, pet.y + 10, 5, 5);
            ctx.fillRect(pet.x + 5, pet.y + 10, 5, 5);
        }
    }
}

// Update UI text
function updateUI() {
    hungerVal.innerText = Math.floor(pet.hunger);
    happinessVal.innerText = Math.floor(pet.happiness);
    energyVal.innerText = Math.floor(pet.energy);

    hungerVal.style.color = pet.hunger < 30 ? 'red' : 'white';
    happinessVal.style.color = pet.happiness < 30 ? 'red' : 'white';
    energyVal.style.color = pet.energy < 30 ? 'red' : 'white';
}

// Start game
updateUI();
gameLoop();
