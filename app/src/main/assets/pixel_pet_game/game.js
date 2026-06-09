const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet State
let hunger = 100;
let happiness = 100;
let energy = 100;
let isSleeping = false;
let message = "Your pet is happy!";

// DOM Elements
const elHunger = document.getElementById('hunger');
const elHappiness = document.getElementById('happiness');
const elEnergy = document.getElementById('energy');
const elMessage = document.getElementById('message');

// Timing for game loop
let lastTime = 0;
const tickInterval = 2000; // State decreases every 2 seconds
let timeSinceLastTick = 0;

// Pixel Art Data (10x10 grid, 0=transparent, 1=color)
const petNormal = [
    [0,0,1,1,0,0,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,1,1,0,1,1,1],
    [1,1,1,1,0,0,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,0,0,0,0,0,0,1,1]
];

const petSad = [
    [0,0,1,1,0,0,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,0,0,0,0,0,0,1,1]
];

const petSleep = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,0,0,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,1,1,0,1,1,1],
    [1,1,1,1,0,0,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0]
];

const pixelSize = 10;
const offsetX = (canvas.width - (10 * pixelSize)) / 2;
const offsetY = (canvas.height - (10 * pixelSize)) / 2 + 20;

function drawSprite(sprite, color) {
    ctx.fillStyle = color;
    for (let y = 0; y < sprite.length; y++) {
        for (let x = 0; x < sprite[y].length; x++) {
            if (sprite[y][x] === 1) {
                ctx.fillRect(offsetX + x * pixelSize, offsetY + y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

function updateUI() {
    elHunger.innerText = hunger;
    elHappiness.innerText = happiness;
    elEnergy.innerText = energy;
    elMessage.innerText = message;

    // Change color based on stats
    elHunger.style.color = hunger < 30 ? 'red' : 'inherit';
    elHappiness.style.color = happiness < 30 ? 'red' : 'inherit';
    elEnergy.style.color = energy < 30 ? 'red' : 'inherit';
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentSprite = petNormal;
    let color = '#f1c40f'; // Yellow

    if (isSleeping) {
        currentSprite = petSleep;
        color = '#3498db'; // Blue
        // Draw Zzz
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '20px Courier New';
        ctx.fillText('Zzz...', 120, 60);
    } else if (happiness < 30 || hunger < 30 || energy < 30) {
        currentSprite = petSad;
        color = '#e74c3c'; // Red
    }

    // Simple bounce animation when not sleeping
    let currentOffsetY = offsetY;
    if (!isSleeping) {
        currentOffsetY += Math.sin(Date.now() / 200) * 5;
    }

    // Draw Pet
    ctx.fillStyle = color;
    for (let y = 0; y < currentSprite.length; y++) {
        for (let x = 0; x < currentSprite[y].length; x++) {
            if (currentSprite[y][x] === 1) {
                ctx.fillRect(offsetX + x * pixelSize, currentOffsetY + y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    timeSinceLastTick += deltaTime;

    if (timeSinceLastTick > tickInterval) {
        timeSinceLastTick = 0;

        if (isSleeping) {
            energy = Math.min(100, energy + 5);
            hunger = Math.max(0, hunger - 1);
            if (energy >= 100) {
                isSleeping = false;
                message = "Woke up feeling rested!";
            } else {
                message = "Sleeping...";
            }
        } else {
            hunger = Math.max(0, hunger - 2);
            happiness = Math.max(0, happiness - 1);
            energy = Math.max(0, energy - 1);

            if (hunger < 30) message = "I'm hungry!";
            else if (energy < 30) message = "I'm tired!";
            else if (happiness < 30) message = "I'm bored!";
            else message = "Happy and healthy!";
        }

        updateUI();
    }

    render();
    requestAnimationFrame(gameLoop);
}

// Controls
document.getElementById('btn-feed').addEventListener('click', () => {
    if (isSleeping) {
        message = "Can't eat while sleeping!";
    } else {
        hunger = Math.min(100, hunger + 20);
        message = "Yummy!";
    }
    updateUI();
});

document.getElementById('btn-play').addEventListener('click', () => {
    if (isSleeping) {
        message = "Let me sleep!";
    } else if (energy < 20) {
        message = "Too tired to play...";
    } else {
        happiness = Math.min(100, happiness + 20);
        energy = Math.max(0, energy - 10);
        hunger = Math.max(0, hunger - 5);
        message = "So fun!";
    }
    updateUI();
});

document.getElementById('btn-sleep').addEventListener('click', () => {
    if (isSleeping) {
        isSleeping = false;
        message = "Woke up!";
    } else {
        isSleeping = true;
        message = "Going to sleep...";
    }
    updateUI();
});

// Init
requestAnimationFrame((timestamp) => {
    lastTime = timestamp;
    updateUI();
    gameLoop(timestamp);
});
