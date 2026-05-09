const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
let hunger = 100;
let happiness = 100;
let energy = 100;

const hungerEl = document.getElementById('hunger');
const happinessEl = document.getElementById('happiness');
const energyEl = document.getElementById('energy');

// Simple pixel art for pet
const petPixels = [
    [0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0],
    [1,1,0,1,0,1,1],
    [1,1,1,1,1,1,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [0,1,0,0,0,1,0]
];

const pixelSize = 20;

function drawPet(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

    let color = '#3498db'; // Default blue
    if (energy < 30) color = '#95a5a6'; // Gray if low energy
    else if (hunger < 30) color = '#e67e22'; // Orange if hungry
    else if (happiness < 30) color = '#e74c3c'; // Red if unhappy

    for (let r = 0; r < petPixels.length; r++) {
        for (let c = 0; c < petPixels[r].length; c++) {
            if (petPixels[r][c] === 1) {
                ctx.fillStyle = color;
                ctx.fillRect(x + c * pixelSize, y + r * pixelSize, pixelSize, pixelSize);

                // Outline
                ctx.strokeStyle = '#2980b9';
                ctx.strokeRect(x + c * pixelSize, y + r * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

function updateStatsUI() {
    hungerEl.innerText = Math.max(0, Math.round(hunger));
    happinessEl.innerText = Math.max(0, Math.round(happiness));
    energyEl.innerText = Math.max(0, Math.round(energy));
}

let lastTime = performance.now();

function gameLoop() {
    let now = performance.now();
    let deltaTime = (now - lastTime) / 1000; // in seconds
    lastTime = now;

    // Decrease stats over time (e.g. 2 units per second)
    hunger -= 2 * deltaTime;
    happiness -= 1.5 * deltaTime;
    energy -= 1 * deltaTime;

    // Bounds checking
    if(hunger < 0) hunger = 0;
    if(happiness < 0) happiness = 0;
    if(energy < 0) energy = 0;

    updateStatsUI();

    // Center pet
    let petWidth = petPixels[0].length * pixelSize;
    let petHeight = petPixels.length * pixelSize;
    let x = (canvas.width - petWidth) / 2;
    let y = (canvas.height - petHeight) / 2;

    // Simple bobbing animation
    let time = Date.now() * 0.005;
    y += Math.sin(time) * 10;

    drawPet(x, y);

    requestAnimationFrame(gameLoop);
}

// Button listeners
document.getElementById('feedBtn').addEventListener('click', () => {
    hunger += 20;
    if(hunger > 100) hunger = 100;
    updateStatsUI();
});

document.getElementById('playBtn').addEventListener('click', () => {
    happiness += 20;
    energy -= 10;
    if(happiness > 100) happiness = 100;
    if(energy < 0) energy = 0;
    updateStatsUI();
});

document.getElementById('sleepBtn').addEventListener('click', () => {
    energy += 30;
    if(energy > 100) energy = 100;
    updateStatsUI();
});

// Start loop
updateStatsUI();
gameLoop();
