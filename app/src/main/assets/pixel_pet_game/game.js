const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const hungerSpan = document.getElementById('hunger');
const happinessSpan = document.getElementById('happiness');
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

// Pet State
let pet = {
    x: 150,
    y: 200,
    width: 40,
    height: 40,
    hunger: 100,
    happiness: 100,
    state: 'idle', // idle, eating, playing, dead
    color: '#e74c3c'
};

let lastTime = 0;
const statDecayRate = 0.05; // Stats decrease per frame (approx 60fps)

// Sprite definitions (simple squares for now, could be replaced with actual pixel art images)
function drawPet(state) {
    ctx.fillStyle = pet.color;

    if (state === 'dead') {
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(pet.x - pet.width/2, pet.y - pet.height/2 + 20, pet.width, pet.height/2);
        return;
    }

    if (state === 'eating') {
        ctx.fillRect(pet.x - pet.width/2, pet.y - pet.height/2 + Math.sin(Date.now() / 100) * 5, pet.width, pet.height);
    } else if (state === 'playing') {
        ctx.fillRect(pet.x - pet.width/2, pet.y - pet.height/2 - Math.abs(Math.sin(Date.now() / 150) * 20), pet.width, pet.height);
    } else { // idle
        ctx.fillRect(pet.x - pet.width/2, pet.y - pet.height/2 + Math.sin(Date.now() / 300) * 2, pet.width, pet.height);
    }

    // Eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(pet.x - 10, pet.y - 10, 8, 8);
    ctx.fillRect(pet.x + 2, pet.y - 10, 8, 8);

    ctx.fillStyle = 'black';
    if(state === 'dead') {
         ctx.fillRect(pet.x - 8, pet.y - 8, 4, 4);
         ctx.fillRect(pet.x + 4, pet.y - 8, 4, 4);
    } else {
         ctx.fillRect(pet.x - 6, pet.y - 6, 4, 4);
         ctx.fillRect(pet.x + 6, pet.y - 6, 4, 4);
    }
}

function updateStats() {
    if (pet.state === 'dead') return;

    pet.hunger = Math.max(0, pet.hunger - statDecayRate);
    pet.happiness = Math.max(0, pet.happiness - statDecayRate);

    if (pet.hunger <= 0 || pet.happiness <= 0) {
        pet.state = 'dead';
    }

    hungerSpan.innerText = Math.floor(pet.hunger);
    happinessSpan.innerText = Math.floor(pet.happiness);
}

function gameLoop(timestamp) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update
    updateStats();

    // Reset state after a delay if acting
    if (pet.state !== 'idle' && pet.state !== 'dead') {
        if(!pet.actionStartTime) pet.actionStartTime = timestamp;
        if(timestamp - pet.actionStartTime > 1000) {
            pet.state = 'idle';
            pet.actionStartTime = null;
        }
    }

    // Draw floor
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(0, 220, canvas.width, 80);

    // Draw
    drawPet(pet.state);

    requestAnimationFrame(gameLoop);
}

// Interactions
feedBtn.addEventListener('click', () => {
    if (pet.state !== 'dead') {
        pet.hunger = Math.min(100, pet.hunger + 20);
        pet.state = 'eating';
        pet.actionStartTime = null;
    }
});

playBtn.addEventListener('click', () => {
     if (pet.state !== 'dead') {
        pet.happiness = Math.min(100, pet.happiness + 20);
        pet.state = 'playing';
        pet.actionStartTime = null;
    }
});

// Start game
requestAnimationFrame(gameLoop);