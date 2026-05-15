const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let pet = {
    x: 200,
    y: 200,
    size: 40,
    hunger: 50,
    happiness: 50,
    energy: 50,
    state: 'idle', // idle, eating, playing, sleeping
    frame: 0
};

// Simple pixel art arrays (8x8 scaled up)
const spriteIdle1 = [
    0,0,1,1,1,1,0,0,
    0,1,2,1,1,2,1,0,
    1,1,1,1,1,1,1,1,
    1,3,1,1,1,1,3,1,
    1,1,1,1,1,1,1,1,
    0,1,3,3,3,3,1,0,
    0,0,1,1,1,1,0,0,
    0,0,1,0,0,1,0,0
];

const spriteIdle2 = [
    0,0,1,1,1,1,0,0,
    0,1,2,1,1,2,1,0,
    1,1,1,1,1,1,1,1,
    1,3,1,1,1,1,3,1,
    1,1,1,1,1,1,1,1,
    0,1,3,3,3,3,1,0,
    0,0,1,1,1,1,0,0,
    0,1,0,0,0,0,1,0
];

const colors = {
    0: 'transparent',
    1: '#FFD700', // Gold body
    2: '#000000', // Eyes
    3: '#FF69B4'  // Cheeks/Mouth
};

function drawSprite(sprite, x, y, size) {
    const pixelSize = size / 8;
    for (let i = 0; i < 64; i++) {
        const col = i % 8;
        const row = Math.floor(i / 8);
        const colorCode = sprite[i];
        if (colorCode !== 0) {
            ctx.fillStyle = colors[colorCode];
            ctx.fillRect(x - size/2 + col * pixelSize, y - size/2 + row * pixelSize, pixelSize, pixelSize);
        }
    }
}

function updateStats() {
    document.getElementById('hunger').textContent = Math.floor(pet.hunger);
    document.getElementById('happiness').textContent = Math.floor(pet.happiness);
    document.getElementById('energy').textContent = Math.floor(pet.energy);
}

function feedPet() {
    if (pet.state === 'sleeping') return;
    pet.hunger = Math.min(100, pet.hunger + 20);
    pet.energy = Math.min(100, pet.energy + 5);
    pet.state = 'eating';
    setTimeout(() => pet.state = 'idle', 1000);
    updateStats();
}

function playWithPet() {
    if (pet.state === 'sleeping') return;
    if (pet.energy < 10) return;
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.energy = Math.max(0, pet.energy - 10);
    pet.hunger = Math.max(0, pet.hunger - 10);
    pet.state = 'playing';
    setTimeout(() => pet.state = 'idle', 1000);
    updateStats();
}

function sleepPet() {
    if (pet.state === 'sleeping') {
        pet.state = 'idle';
    } else {
        pet.state = 'sleeping';
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#228B22'; // Forest green
    ctx.fillRect(0, 300, 400, 100);

    // Passive stat decay
    if (pet.state !== 'sleeping') {
        pet.hunger = Math.max(0, pet.hunger - 0.01);
        pet.happiness = Math.max(0, pet.happiness - 0.01);
        pet.energy = Math.max(0, pet.energy - 0.005);
    } else {
        pet.energy = Math.min(100, pet.energy + 0.1);
        pet.hunger = Math.max(0, pet.hunger - 0.005);
    }

    pet.frame++;

    let currentSprite = (Math.floor(pet.frame / 30) % 2 === 0) ? spriteIdle1 : spriteIdle2;

    // Simple bobbing animation
    let yOffset = (Math.floor(pet.frame / 15) % 2 === 0) ? -2 : 0;

    if (pet.state === 'sleeping') {
        yOffset = 10;
    }

    drawSprite(currentSprite, pet.x, pet.y + yOffset, pet.size * 2);

    updateStats();
    requestAnimationFrame(gameLoop);
}

gameLoop();
