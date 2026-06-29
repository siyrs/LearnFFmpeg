const canvas = document.getElementById('petCanvas');
const ctx = canvas.getContext('2d');

// Pet stats
let hunger = 100;
let happiness = 100;
let energy = 100;
let isSleeping = false;

// DOM elements
const hungerEl = document.getElementById('hunger');
const happinessEl = document.getElementById('happiness');
const energyEl = document.getElementById('energy');

// Update UI
function updateStatsUI() {
    hungerEl.innerText = Math.max(0, hunger);
    happinessEl.innerText = Math.max(0, happiness);
    energyEl.innerText = Math.max(0, energy);
}

// Game loop timer
setInterval(() => {
    if (!isSleeping) {
        hunger -= 2;
        happiness -= 1;
        energy -= 1;
    } else {
        energy += 5;
        if (energy >= 100) {
            energy = 100;
            isSleeping = false;
        }
    }

    // Limits
    if (hunger < 0) hunger = 0;
    if (happiness < 0) happiness = 0;
    if (energy < 0) energy = 0;
    if (energy > 100) energy = 100;
    if (hunger > 100) hunger = 100;
    if (happiness > 100) happiness = 100;

    updateStatsUI();
    drawPet();
}, 1000);

// Draw pixel pet
function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center pet
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const size = 10; // Pixel size

    // Basic body
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(x - 3*size, y - 3*size, 6*size, 6*size);

    // Eyes
    ctx.fillStyle = '#000';
    if (isSleeping) {
        // Sleepy eyes
        ctx.fillRect(x - 2*size, y - size, 1.5*size, size/2);
        ctx.fillRect(x + 0.5*size, y - size, 1.5*size, size/2);
    } else {
        // Open eyes
        ctx.fillRect(x - 2*size, y - 2*size, size, size);
        ctx.fillRect(x + size, y - 2*size, size, size);
    }

    // Mouth
    if (happiness > 50 && !isSleeping) {
        // Smile
        ctx.fillRect(x - 1.5*size, y + size, size, size);
        ctx.fillRect(x - 0.5*size, y + 1.5*size, size, size);
        ctx.fillRect(x + 0.5*size, y + size, size, size);
    } else if (!isSleeping) {
        // Sad / Neutral
        ctx.fillRect(x - 1.5*size, y + 1.5*size, 3*size, size);
    } else {
        // Sleep mouth
        ctx.fillRect(x - 0.5*size, y + size, size, size);
    }
}

// Controls
document.getElementById('feedBtn').addEventListener('click', () => {
    if (!isSleeping) {
        hunger += 20;
        if (hunger > 100) hunger = 100;
        updateStatsUI();
        drawPet();
    }
});

document.getElementById('playBtn').addEventListener('click', () => {
    if (!isSleeping && energy > 10) {
        happiness += 20;
        energy -= 10;
        if (happiness > 100) happiness = 100;
        updateStatsUI();
        drawPet();
    }
});

document.getElementById('sleepBtn').addEventListener('click', () => {
    isSleeping = !isSleeping;
    drawPet();
});

// Initial draw
updateStatsUI();
drawPet();