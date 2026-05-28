const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let hunger = 50;
let happiness = 50;

const hungerEl = document.getElementById('hunger');
const happinessEl = document.getElementById('happiness');
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

// Pixel pet graphics (simple 10x10 matrix)
// 0 = transparent, 1 = dark green (#0f380f)
const petSprite = [
    [0,0,1,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,0,0],
    [1,1,0,1,1,1,0,1,1,0],
    [1,1,0,1,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,0,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,0,0],
    [0,0,1,0,0,0,1,0,0,0],
    [0,1,1,0,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];

const pixelSize = 10;
let petX = 50;
let petY = 50;
let frameCount = 0;
let isJumping = false;
let jumpOffset = 0;

function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw floor
    ctx.fillStyle = '#306230';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    // Bouncing animation
    let yOffset = 0;
    if (isJumping) {
        yOffset = -Math.abs(Math.sin(jumpOffset) * 20);
        jumpOffset += 0.2;
        if (jumpOffset >= Math.PI) {
            isJumping = false;
            jumpOffset = 0;
        }
    } else {
        yOffset = Math.sin(frameCount * 0.1) * 2;
    }

    ctx.fillStyle = '#0f380f';
    for (let y = 0; y < petSprite.length; y++) {
        for (let x = 0; x < petSprite[y].length; x++) {
            if (petSprite[y][x] === 1) {
                ctx.fillRect(petX + x * pixelSize, petY + y * pixelSize + yOffset, pixelSize, pixelSize);
            }
        }
    }
    frameCount++;
}

function updateStats() {
    hungerEl.innerText = hunger;
    happinessEl.innerText = happiness;

    if (hunger > 100) hunger = 100;
    if (hunger < 0) hunger = 0;
    if (happiness > 100) happiness = 100;
    if (happiness < 0) happiness = 0;
}

function gameLoop() {
    drawPet();
    requestAnimationFrame(gameLoop);
}

// Decrease stats over time
setInterval(() => {
    hunger = Math.max(0, hunger - 1);
    happiness = Math.max(0, happiness - 1);
    updateStats();
}, 2000);

feedBtn.addEventListener('click', () => {
    hunger = Math.min(100, hunger + 10);
    isJumping = true;
    updateStats();
});

playBtn.addEventListener('click', () => {
    happiness = Math.min(100, happiness + 10);
    isJumping = true;
    updateStats();
});

// Initial start
updateStats();
gameLoop();