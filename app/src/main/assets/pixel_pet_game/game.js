const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// UI Elements
const hungerEl = document.getElementById('hunger');
const happinessEl = document.getElementById('happiness');
const energyEl = document.getElementById('energy');

const btnFeed = document.getElementById('btn-feed');
const btnPlay = document.getElementById('btn-play');
const btnSleep = document.getElementById('btn-sleep');

// Pet State
let pet = {
    hunger: 100,
    happiness: 100,
    energy: 100,
    state: 'idle', // idle, eating, playing, sleeping
    x: 128,
    y: 128,
    frame: 0
};

// Game Loop Timing
let lastTime = 0;
const tickRate = 1000; // 1 second for stat decay
let timeSinceLastTick = 0;

// Pixel Art Data (Simple 8x8 grid scaled up)
const pixelSize = 8;
const colors = {
    black: '#000000',
    white: '#FFFFFF',
    primary: '#F1C40F', // Yellow
    secondary: '#E67E22', // Orange
    eye: '#2C3E50' // Dark Blue
};

// Simple 8x8 sprite definition
const sprites = {
    idle1: [
        [0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,0],
        [0,1,2,1,1,2,1,0],
        [0,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,0],
        [0,0,1,0,0,1,0,0],
        [0,0,1,0,0,1,0,0],
        [0,0,0,0,0,0,0,0]
    ],
    idle2: [
        [0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,1,2,1,1,2,1,0],
        [0,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,0],
        [0,0,1,0,0,1,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ],
    sleeping: [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,0],
        [0,1,3,1,1,3,1,0],
        [0,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0]
    ]
};

function drawSprite(spriteArray, x, y) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const val = spriteArray[r][c];
            if (val !== 0) {
                switch(val) {
                    case 1: ctx.fillStyle = colors.primary; break;
                    case 2: ctx.fillStyle = colors.eye; break;
                    case 3: ctx.fillStyle = colors.black; break; // closed eye
                }
                ctx.fillRect(x - (4 * pixelSize) + (c * pixelSize), y - (4 * pixelSize) + (r * pixelSize), pixelSize, pixelSize);
            }
        }
    }
}

function updateStats() {
    hungerEl.innerText = Math.floor(pet.hunger);
    happinessEl.innerText = Math.floor(pet.happiness);
    energyEl.innerText = Math.floor(pet.energy);

    // Death condition or extremely sad
    if (pet.hunger <= 0 || pet.happiness <= 0 || pet.energy <= 0) {
        // Handle game over logic if needed, for now just clamp
        pet.hunger = Math.max(0, pet.hunger);
        pet.happiness = Math.max(0, pet.happiness);
        pet.energy = Math.max(0, pet.energy);
    }
}

function update(deltaTime) {
    timeSinceLastTick += deltaTime;

    if (timeSinceLastTick > tickRate) {
        timeSinceLastTick = 0;

        // Decay stats
        if (pet.state !== 'sleeping') {
            pet.hunger -= 1;
            pet.energy -= 0.5;
            pet.happiness -= 0.5;
        } else {
            pet.energy += 5;
            pet.hunger -= 0.5;
            if (pet.energy > 100) {
                pet.energy = 100;
                pet.state = 'idle'; // wake up
            }
        }

        // Clamp
        pet.hunger = Math.max(0, Math.min(100, pet.hunger));
        pet.happiness = Math.max(0, Math.min(100, pet.happiness));
        pet.energy = Math.max(0, Math.min(100, pet.energy));

        updateStats();

        // Animation frame update (every second)
        pet.frame = (pet.frame + 1) % 2;
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Determine sprite
    let currentSprite = sprites.idle1;
    if (pet.state === 'sleeping') {
        currentSprite = sprites.sleeping;
    } else {
        currentSprite = pet.frame === 0 ? sprites.idle1 : sprites.idle2;
    }

    // Simple bounce animation when not sleeping
    let drawY = pet.y;
    if (pet.state !== 'sleeping' && pet.frame === 1) {
        drawY -= 4; // bounce up slightly
    }

    drawSprite(currentSprite, pet.x, drawY);

    // Draw status indicators (Zzz, etc)
    if (pet.state === 'sleeping') {
        ctx.fillStyle = colors.black;
        ctx.font = "16px Courier New";
        // Animate Zzz
        let text = "Z";
        if(pet.frame === 1) text = "Zz";
        ctx.fillText(text, pet.x + 20, pet.y - 20);
    }
}

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

// Event Listeners
btnFeed.addEventListener('click', () => {
    if (pet.state !== 'sleeping') {
        pet.hunger = Math.min(100, pet.hunger + 20);
        pet.happiness = Math.min(100, pet.happiness + 5);
        updateStats();
    }
});

btnPlay.addEventListener('click', () => {
    if (pet.state !== 'sleeping') {
        pet.happiness = Math.min(100, pet.happiness + 20);
        pet.energy = Math.max(0, pet.energy - 10);
        pet.hunger = Math.max(0, pet.hunger - 5);
        updateStats();
    }
});

btnSleep.addEventListener('click', () => {
    if (pet.state !== 'sleeping') {
        pet.state = 'sleeping';
    } else {
        pet.state = 'idle'; // Wake up manually
    }
});

// Start game
requestAnimationFrame((timestamp) => {
    lastTime = timestamp;
    updateStats();
    gameLoop(timestamp);
});