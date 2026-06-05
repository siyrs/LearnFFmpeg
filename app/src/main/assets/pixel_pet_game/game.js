const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Stats
let hunger = 50;
let happiness = 50;
let energy = 50;

// UI Elements
const hungerSpan = document.getElementById('hungerValue');
const happinessSpan = document.getElementById('happinessValue');
const energySpan = document.getElementById('energyValue');

const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');
const sleepBtn = document.getElementById('sleepBtn');

// Pet State
let isSleeping = false;
let petX = 150;
let petY = 200;
let petFrame = 0;
let animationTimer = 0;

// Colors
const PET_COLOR = '#ffcc00';
const EYE_COLOR = '#000000';
const BG_COLOR = '#87CEEB';
const GROUND_COLOR = '#8B4513';
const GRASS_COLOR = '#32CD32';

// 8x8 pixel art, scaled up
const petPixelsNormal = [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,2,1,1,2,1,1], // 2 is eye
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,0,1],
    [1,0,1,0,0,1,0,1],
    [1,1,1,0,0,1,1,1]
];

const petPixelsSleep = [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1], // eyes closed
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,0,1],
    [1,0,1,0,0,1,0,1],
    [1,1,1,0,0,1,1,1]
];

const PIXEL_SIZE = 10;

function updateStatsUI() {
    hungerSpan.innerText = Math.floor(hunger);
    happinessSpan.innerText = Math.floor(happiness);
    energySpan.innerText = Math.floor(energy);

    // Color coding based on stat levels
    hungerSpan.style.color = hunger < 30 ? 'red' : 'black';
    happinessSpan.style.color = happiness < 30 ? 'red' : 'black';
    energySpan.style.color = energy < 30 ? 'red' : 'black';
}

function decreaseStats() {
    if (!isSleeping) {
        hunger = Math.max(0, hunger - 0.5);
        happiness = Math.max(0, happiness - 0.3);
        energy = Math.max(0, energy - 0.2);
    } else {
        energy = Math.min(100, energy + 2);
        hunger = Math.max(0, hunger - 0.2); // Still gets hungry while sleeping
        if (energy >= 100) {
            isSleeping = false;
        }
    }
    updateStatsUI();
}

function drawPixelArt(pixels, startX, startY) {
    const totalWidth = pixels[0].length * PIXEL_SIZE;
    const totalHeight = pixels.length * PIXEL_SIZE;
    const offsetX = startX - totalWidth / 2;
    const offsetY = startY - totalHeight; // Draw from bottom up

    for (let y = 0; y < pixels.length; y++) {
        for (let x = 0; x < pixels[y].length; x++) {
            if (pixels[y][x] !== 0) {
                if (pixels[y][x] === 1) {
                    ctx.fillStyle = PET_COLOR;
                } else if (pixels[y][x] === 2) {
                    ctx.fillStyle = EYE_COLOR;
                }
                ctx.fillRect(offsetX + x * PIXEL_SIZE, offsetY + y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
    }
}

function drawBackground() {
    // Sky is handled by canvas background, draw ground
    ctx.fillStyle = GRASS_COLOR;
    ctx.fillRect(0, 220, canvas.width, 20);
    ctx.fillStyle = GROUND_COLOR;
    ctx.fillRect(0, 240, canvas.width, canvas.height - 240);
}

function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    // Pet bounce animation
    let yOffset = 0;
    if (!isSleeping) {
        yOffset = Math.sin(animationTimer * 0.1) * 5;
    }

    // Zzz animation
    if (isSleeping) {
        ctx.fillStyle = 'black';
        ctx.font = '20px Courier New';
        ctx.fillText('Zzz', petX + 20, petY - 80 - Math.sin(animationTimer * 0.05) * 10);
    } else if (hunger < 30 || happiness < 30) {
         ctx.fillStyle = 'black';
         ctx.font = '20px Courier New';
         ctx.fillText('...', petX + 20, petY - 80);
    }

    const currentPixels = isSleeping ? petPixelsSleep : petPixelsNormal;
    drawPixelArt(currentPixels, petX, petY + yOffset);

    animationTimer++;
}

function gameLoop() {
    drawScene();
    requestAnimationFrame(gameLoop);
}

// Decrease stats every second
setInterval(decreaseStats, 1000);

// Event Listeners
feedBtn.addEventListener('click', () => {
    if (!isSleeping) {
        hunger = Math.min(100, hunger + 20);
        updateStatsUI();
        // Little jump
        animationTimer += 10;
    }
});

playBtn.addEventListener('click', () => {
    if (!isSleeping && energy >= 10) {
        happiness = Math.min(100, happiness + 20);
        energy = Math.max(0, energy - 10);
        updateStatsUI();
        // Big jump
        animationTimer += 20;
    }
});

sleepBtn.addEventListener('click', () => {
    isSleeping = !isSleeping;
});

// Init
updateStatsUI();
gameLoop();