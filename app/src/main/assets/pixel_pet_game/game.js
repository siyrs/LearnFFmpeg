const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const hungerEl = document.getElementById('hunger');
const happinessEl = document.getElementById('happiness');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

let hunger = 50;
let happiness = 50;

let lastTime = 0;
const tickInterval = 2000; // Decrease stats every 2 seconds
let timeSinceLastTick = 0;

// Simple pet sprite (8x8)
const petSprite = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0]
];

const pixelSize = 10; // Draw size of each "pixel"

function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center the pet
    const startX = (canvas.width - (petSprite[0].length * pixelSize)) / 2;
    const startY = (canvas.height - (petSprite.length * pixelSize)) / 2;

    for (let y = 0; y < petSprite.length; y++) {
        for (let x = 0; x < petSprite[y].length; x++) {
            if (petSprite[y][x] === 1) {
                // Change color based on happiness
                if (happiness < 20) {
                     ctx.fillStyle = '#e74c3c'; // Red-ish if sad
                } else if (hunger > 80) {
                     ctx.fillStyle = '#f1c40f'; // Yellow-ish if hungry
                } else {
                     ctx.fillStyle = '#2c3e50'; // Default dark color
                }

                ctx.fillRect(startX + x * pixelSize, startY + y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

function updateStats() {
    hungerEl.innerText = Math.floor(hunger);
    happinessEl.innerText = Math.floor(happiness);
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    timeSinceLastTick += deltaTime;

    if (timeSinceLastTick >= tickInterval) {
        timeSinceLastTick = 0;

        // Increase hunger over time
        hunger = Math.min(100, hunger + 2);

        // Decrease happiness over time
        happiness = Math.max(0, happiness - 1);

        // If very hungry, happiness decreases faster
        if (hunger > 80) {
            happiness = Math.max(0, happiness - 2);
        }

        updateStats();
    }

    drawPet();
    requestAnimationFrame(gameLoop);
}

feedBtn.addEventListener('click', () => {
    hunger = Math.max(0, hunger - 15);
    updateStats();
});

playBtn.addEventListener('click', () => {
    happiness = Math.min(100, happiness + 15);
    // Playing makes pet slightly hungry
    hunger = Math.min(100, hunger + 5);
    updateStats();
});

// Initial draw and start loop
updateStats();
requestAnimationFrame(gameLoop);
