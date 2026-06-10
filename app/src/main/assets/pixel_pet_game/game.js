const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let hunger = 0;
let happiness = 100;

// Pixel pet basic frame
const petPixels = [
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
    [1,1,0,0,1,1],
    [1,1,1,1,1,1],
    [0,1,0,0,1,0]
];

const pixelSize = 20;

function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate center
    const startX = (canvas.width - petPixels[0].length * pixelSize) / 2;
    const startY = (canvas.height - petPixels.length * pixelSize) / 2;

    ctx.fillStyle = '#e74c3c'; // red-ish color for pet

    for (let y = 0; y < petPixels.length; y++) {
        for (let x = 0; x < petPixels[y].length; x++) {
            if (petPixels[y][x] === 1) {
                ctx.fillRect(startX + x * pixelSize, startY + y * pixelSize, pixelSize, pixelSize);
            }
        }
    }

    // Draw face
    ctx.fillStyle = '#000';
    if (happiness > 50) {
        // Happy face
        ctx.fillRect(startX + 1 * pixelSize, startY + 2 * pixelSize, pixelSize, pixelSize); // Left eye
        ctx.fillRect(startX + 4 * pixelSize, startY + 2 * pixelSize, pixelSize, pixelSize); // Right eye
    } else {
        // Sad face
        ctx.fillRect(startX + 1 * pixelSize, startY + 2 * pixelSize, pixelSize, pixelSize); // Left eye
        ctx.fillRect(startX + 4 * pixelSize, startY + 2 * pixelSize, pixelSize, pixelSize); // Right eye
        ctx.fillRect(startX + 2 * pixelSize, startY + 3 * pixelSize, pixelSize * 2, pixelSize); // Mouth
    }
}

function updateStats() {
    document.getElementById('hungerDisplay').innerText = Math.floor(hunger);
    document.getElementById('happinessDisplay').innerText = Math.floor(happiness);
}

function gameLoop() {
    hunger += 0.05; // Gets hungry slowly
    if (hunger > 100) hunger = 100;

    if (hunger > 50) {
        happiness -= 0.05; // Less happy if hungry
    } else {
        happiness += 0.02; // Slightly happier if not hungry
    }

    if (happiness < 0) happiness = 0;
    if (happiness > 100) happiness = 100;

    updateStats();
    drawPet();

    requestAnimationFrame(gameLoop);
}

document.getElementById('feedBtn').addEventListener('click', () => {
    hunger -= 20;
    if (hunger < 0) hunger = 0;
    updateStats();
});

document.getElementById('playBtn').addEventListener('click', () => {
    happiness += 20;
    hunger += 5; // Playing makes it hungry
    if (happiness > 100) happiness = 100;
    if (hunger > 100) hunger = 100;
    updateStats();
});

// Start loop
gameLoop();
