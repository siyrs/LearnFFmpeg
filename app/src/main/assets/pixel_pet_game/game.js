const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let hunger = 0;
let happiness = 100;


const hungerDisplay = document.getElementById('hungerDisplay');
const happinessDisplay = document.getElementById('happinessDisplay');

// Pet state
const pet = {
    x: 180,
    y: 200,
    width: 40,
    height: 40,
    color: '#FFD700', // Gold
    vx: 2,
    vy: 0,
    gravity: 0.5,
    jumpPower: -8,
    isJumping: false,
    state: 'idle' // idle, walking, jumping, eating
};

const poops = [];

// Controls
document.getElementById('feedBtn').addEventListener('click', () => {
    hunger = Math.max(0, hunger - 20);
    pet.state = 'eating';
    pet.vy = pet.jumpPower / 2; // little jump of joy
    setTimeout(() => pet.state = 'idle', 500);
});

document.getElementById('playBtn').addEventListener('click', () => {
    happiness = Math.min(100, happiness + 20);
    hunger = Math.min(100, hunger + 5);
    pet.vy = pet.jumpPower;
    pet.isJumping = true;
});

document.getElementById('cleanBtn').addEventListener('click', () => {
    if (poops.length > 0) {
        poops.shift(); // clean oldest poop
        happiness = Math.min(100, happiness + 5);
    }
});

// Game Loop variables
let lastTime = 0;
const tickRate = 1000; // Stat updates every second
let timeSinceLastTick = 0;

function updateStats(deltaTime) {
    timeSinceLastTick += deltaTime;
    if (timeSinceLastTick >= tickRate) {
        timeSinceLastTick = 0;

        // Increase hunger over time
        if (Math.random() < 0.3) {
            hunger = Math.min(100, hunger + 1);
        }

        // Decrease happiness if hungry or dirty
        if (hunger > 70 || poops.length > 2) {
            happiness = Math.max(0, happiness - 1);
        } else if (hunger < 30 && poops.length === 0) {
            // passive happiness gain if well cared for
            if (Math.random() < 0.1) happiness = Math.min(100, happiness + 1);
        }

        // Poop generation
        if (Math.random() < 0.05 && poops.length < 5) {
             poops.push({
                 x: Math.random() * (canvas.width - 20) + 10,
                 y: 350
             });
        }

        hungerDisplay.textContent = Math.floor(hunger);
        happinessDisplay.textContent = Math.floor(happiness);
    }
}

function updatePhysics() {
    // Basic AI / Movement
    if (pet.state !== 'eating') {
         pet.x += pet.vx;
         if (pet.x <= 0 || pet.x + pet.width >= canvas.width) {
             pet.vx *= -1; // bounce off walls
         }

         // Random jump
         if (!pet.isJumping && Math.random() < 0.01) {
             pet.vy = pet.jumpPower;
             pet.isJumping = true;
         }
    }

    // Gravity
    pet.y += pet.vy;
    pet.vy += pet.gravity;

    // Floor collision
    const floorY = 350;
    if (pet.y + pet.height >= floorY) {
        pet.y = floorY - pet.height;
        pet.vy = 0;
        pet.isJumping = false;
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#8B4513'; // SaddleBrown
    ctx.fillRect(0, 350, canvas.width, 50);

    // Draw grass
    ctx.fillStyle = '#228B22'; // ForestGreen
    ctx.fillRect(0, 340, canvas.width, 10);

    // Draw Poops
    ctx.fillStyle = '#654321'; // Dark brown
    poops.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y - 10, 10, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Pet
    // Change color based on state/health
    if (happiness < 30) {
        ctx.fillStyle = '#B0C4DE'; // LightSteelBlue (sad)
    } else if (hunger > 80) {
        ctx.fillStyle = '#F08080'; // LightCoral (hungry/angry)
    } else {
        ctx.fillStyle = pet.color;
    }

    // Body
    ctx.fillRect(pet.x, pet.y, pet.width, pet.height);

    // Eyes
    ctx.fillStyle = 'black';
    let eyeOffsetX = pet.vx > 0 ? 5 : -5;
    if (pet.state === 'eating') eyeOffsetX = 0;

    // Left eye
    ctx.fillRect(pet.x + 10 + eyeOffsetX, pet.y + 10, 5, 5);
    // Right eye
    ctx.fillRect(pet.x + 25 + eyeOffsetX, pet.y + 10, 5, 5);

    // Mouth
    if (happiness > 60) {
         // Smile
         ctx.fillRect(pet.x + 10, pet.y + 25, 20, 5);
         ctx.fillRect(pet.x + 8, pet.y + 22, 5, 5);
         ctx.fillRect(pet.x + 27, pet.y + 22, 5, 5);
    } else {
         // Sad line
         ctx.fillRect(pet.x + 10, pet.y + 25, 20, 5);
    }

    // Eating animation (open mouth)
    if (pet.state === 'eating') {
        ctx.fillStyle = 'black';
        ctx.fillRect(pet.x + 15, pet.y + 20, 10, 10);
    }
}

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    updateStats(deltaTime);
    updatePhysics();
    draw();

    requestAnimationFrame(gameLoop);
}

// Start game
requestAnimationFrame(gameLoop);
