const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

// Pixel dimensions
const pixelSize = 10;
const cols = canvas.width / pixelSize;
const rows = canvas.height / pixelSize;

// Pet state
let pet = {
    x: cols / 2 - 2,
    y: rows / 2 - 2,
    hunger: 50,
    happiness: 50,
    frame: 0
};

// Simple pet sprite (5x5 pixels)
const spriteFrames = [
    [
        [0,1,0,1,0],
        [1,1,1,1,1],
        [1,0,1,0,1],
        [1,1,1,1,1],
        [0,1,0,1,0]
    ],
    [
        [0,1,0,1,0],
        [1,1,1,1,1],
        [1,0,1,0,1],
        [1,1,1,1,1],
        [1,0,0,0,1]
    ]
];

function drawPet() {
    ctx.fillStyle = '#FF69B4'; // Hot pink
    const currentFrame = spriteFrames[pet.frame];

    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            if (currentFrame[r][c] === 1) {
                ctx.fillRect((pet.x + c) * pixelSize, (pet.y + r) * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

function drawStats() {
    ctx.fillStyle = '#000';
    ctx.font = '16px "Courier New"';
    ctx.fillText(`Hunger: ${Math.floor(pet.hunger)}`, 10, 20);
    ctx.fillText(`Happiness: ${Math.floor(pet.happiness)}`, 10, 40);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    // Decrease stats over time
    pet.hunger -= 0.05;
    pet.happiness -= 0.05;

    // Animate
    if (Math.random() < 0.05) {
        pet.frame = (pet.frame + 1) % 2;
    }

    // Bounds check stats
    pet.hunger = Math.max(0, Math.min(100, pet.hunger));
    pet.happiness = Math.max(0, Math.min(100, pet.happiness));
}

function render() {
    clearCanvas();
    drawPet();
    drawStats();
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Interaction
feedBtn.addEventListener('click', () => {
    pet.hunger += 10;
});

playBtn.addEventListener('click', () => {
    pet.happiness += 10;
});

// Start
gameLoop();
