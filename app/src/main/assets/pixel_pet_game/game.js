const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let hunger = 50;
let happiness = 50;

const hungerStat = document.getElementById('hungerStat');
const happinessStat = document.getElementById('happinessStat');
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

// Pixel pet graphics (simple 8x8 representation scaled up)
const petPixels = [
    [0,0,1,1,1,1,0,0],
    [0,1,0,0,0,0,1,0],
    [1,0,1,0,0,1,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1],
    [0,1,0,0,0,0,1,0],
    [0,0,1,1,1,1,0,0],
    [0,1,0,0,0,0,1,0]
];

const pixelSize = 20;
const startX = (canvas.width - (petPixels[0].length * pixelSize)) / 2;
const startY = (canvas.height - (petPixels.length * pixelSize)) / 2;

function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid (optional, for retro feel)
    ctx.strokeStyle = '#c8e6c9';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=pixelSize) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Determine color based on status
    let petColor = '#000000'; // Default black
    if (hunger < 20 || happiness < 20) {
        petColor = '#d32f2f'; // Red if unhappy/hungry
    } else if (happiness > 80 && hunger > 50) {
        petColor = '#388e3c'; // Green if very happy
    }

    for (let y = 0; y < petPixels.length; y++) {
        for (let x = 0; x < petPixels[y].length; x++) {
            if (petPixels[y][x] === 1) {
                ctx.fillStyle = petColor;
                ctx.fillRect(startX + (x * pixelSize), startY + (y * pixelSize), pixelSize, pixelSize);
            }
        }
    }
}

function updateStats() {
    hungerStat.innerText = hunger;
    happinessStat.innerText = happiness;
    drawPet();
}

feedBtn.addEventListener('click', () => {
    hunger = Math.min(100, hunger + 10);
    happiness = Math.max(0, happiness - 2); // Feeding might make them slightly less playful
    updateStats();
});

playBtn.addEventListener('click', () => {
    happiness = Math.min(100, happiness + 10);
    hunger = Math.max(0, hunger - 5); // Playing makes them hungry
    updateStats();
});

// Game loop to slowly decrease stats
setInterval(() => {
    hunger = Math.max(0, hunger - 1);
    happiness = Math.max(0, happiness - 1);
    updateStats();
}, 2000); // Decrease every 2 seconds

// Initial draw
updateStats();
