const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet state
let pet = {
    x: canvas.width / 2,
    y: canvas.height / 2 + 50,
    size: 40,
    hunger: 100,
    happiness: 100,
    energy: 100,
    state: 'idle', // idle, eating, playing, sleeping
    frame: 0
};

// Colors
const COLOR_BG = '#8fbc8f';
const COLOR_PET = '#000000';
const COLOR_UI = '#333333';

// Buttons
document.getElementById('btnFeed').addEventListener('click', () => {
    if (pet.state !== 'sleeping') {
        pet.hunger = Math.min(100, pet.hunger + 20);
        pet.state = 'eating';
        setTimeout(() => pet.state = 'idle', 1000);
    }
});

document.getElementById('btnPlay').addEventListener('click', () => {
    if (pet.state !== 'sleeping' && pet.energy > 20) {
        pet.happiness = Math.min(100, pet.happiness + 20);
        pet.energy = Math.max(0, pet.energy - 10);
        pet.state = 'playing';
        setTimeout(() => pet.state = 'idle', 1000);
    }
});

document.getElementById('btnSleep').addEventListener('click', () => {
    if (pet.state === 'sleeping') {
        pet.state = 'idle';
    } else {
        pet.state = 'sleeping';
    }
});

// Game loop
let lastTime = 0;
let timeAccumulator = 0;

function drawPet(ctx, x, y, size, state, frame) {
    ctx.fillStyle = COLOR_PET;

    let bounce = 0;
    if (state === 'idle') {
        bounce = (frame % 60 < 30) ? 0 : -2;
    } else if (state === 'eating') {
        bounce = (frame % 20 < 10) ? 0 : 2;
    } else if (state === 'playing') {
        bounce = (frame % 30 < 15) ? -5 : -10;
        x += (frame % 60 < 30) ? -5 : 5;
    } else if (state === 'sleeping') {
        bounce = (frame % 120 < 60) ? 0 : 1;
    }

    const drawRect = (px, py, w, h) => ctx.fillRect(x + px, y + py + bounce, w, h);

    // Body
    drawRect(-10, -10, 20, 20);
    // Ears
    drawRect(-15, -15, 6, 6);
    drawRect(9, -15, 6, 6);
    // Legs
    if (state !== 'sleeping') {
        drawRect(-8, 10, 6, 8);
        drawRect(2, 10, 6, 8);
    } else {
        // Sleep indicator (Zzz)
        if (frame % 60 < 30) {
            ctx.font = "12px 'Courier New'";
            ctx.fillText("Zzz", x + 15, y - 20);
        }
    }

    // Face
    ctx.fillStyle = COLOR_BG;
    if (state === 'sleeping') {
        drawRect(-5, -2, 4, 2);
        drawRect(3, -2, 4, 2);
    } else {
        drawRect(-5, -5, 4, 4);
        drawRect(3, -5, 4, 4);
    }
    drawRect(-2, 2, 6, 2); // Mouth
}

function updateState(deltaTime) {
    timeAccumulator += deltaTime;
    if (timeAccumulator > 1000) {
        timeAccumulator -= 1000;

        // Decay stats
        if (pet.state !== 'sleeping') {
            pet.hunger = Math.max(0, pet.hunger - 1);
            pet.happiness = Math.max(0, pet.happiness - 1);
            pet.energy = Math.max(0, pet.energy - 1);
        } else {
            pet.energy = Math.min(100, pet.energy + 5);
            if (pet.energy === 100) {
                pet.state = 'idle'; // Wake up automatically when fully rested
            }
        }
    }
    pet.frame++;
}

function drawUI() {
    ctx.fillStyle = COLOR_UI;
    ctx.font = "16px 'Courier New'";
    ctx.textAlign = "left";

    ctx.fillText(`Hunger:    ${pet.hunger}%`, 10, 20);
    ctx.fillText(`Happiness: ${pet.happiness}%`, 10, 40);
    ctx.fillText(`Energy:    ${pet.energy}%`, 10, 60);

    // Status warning
    if (pet.hunger < 20) {
        ctx.fillStyle = "red";
        ctx.fillText("HUNGRY!", 150, 20);
    }
    if (pet.happiness < 20) {
        ctx.fillStyle = "red";
        ctx.fillText("SAD!", 150, 40);
    }
}

function loop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    updateState(deltaTime);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawUI();
    drawPet(ctx, pet.x, pet.y, pet.size, pet.state, pet.frame);

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
