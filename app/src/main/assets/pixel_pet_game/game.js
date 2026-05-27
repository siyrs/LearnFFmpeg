const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Pet object structure
const pet = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    size: 20, // Grid size for pixel art
    hunger: 50,
    happiness: 50,
    state: 'idle', // 'idle', 'eating', 'playing'
    frame: 0
};

// Simple pixel art for pet (0 is transparent, 1 is body color, 2 is eye/detail color)
const petSprites = {
    idle1: [
        [0,1,1,1,0],
        [1,1,1,1,1],
        [1,2,1,2,1],
        [1,1,1,1,1],
        [1,0,1,0,1]
    ],
    idle2: [
        [0,1,1,1,0],
        [1,1,1,1,1],
        [1,2,1,2,1],
        [1,1,1,1,1],
        [0,1,0,1,0]
    ]
};

let lastTime = 0;
const frameDuration = 500; // ms per animation frame

function drawSprite(sprite, x, y, size) {
    const width = sprite[0].length;
    const height = sprite.length;
    const startX = x - (width * size) / 2;
    const startY = y - (height * size) / 2;

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (sprite[row][col] === 1) {
                ctx.fillStyle = '#f39c12'; // Pet body
                ctx.fillRect(startX + col * size, startY + row * size, size, size);
            } else if (sprite[row][col] === 2) {
                ctx.fillStyle = '#2c3e50'; // Pet eyes
                ctx.fillRect(startX + col * size, startY + row * size, size, size);
            }
        }
    }
}

function drawPet() {
    // Determine which sprite to use based on frame
    const sprite = pet.frame === 0 ? petSprites.idle1 : petSprites.idle2;
    drawSprite(sprite, pet.x, pet.y, pet.size);
}

function update(time) {
    if (time - lastTime > frameDuration) {
        pet.frame = (pet.frame + 1) % 2;
        lastTime = time;
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background (optional, handled by CSS mostly)

    // Draw Pet
    drawPet();
}

function gameLoop(time) {
    update(time);
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game loop
requestAnimationFrame(gameLoop);

// UI Elements
const hungerEl = document.getElementById('hunger');
const happinessEl = document.getElementById('happiness');
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

function updateUI() {
    hungerEl.innerText = Math.floor(pet.hunger);
    happinessEl.innerText = Math.floor(pet.happiness);
}

function feed() {
    pet.hunger = Math.min(100, pet.hunger + 20);
    updateUI();
}

function play() {
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.hunger = Math.max(0, pet.hunger - 10); // Playing makes pet hungry
    updateUI();
}

// Decrease stats over time
setInterval(() => {
    pet.hunger = Math.max(0, pet.hunger - 2);
    pet.happiness = Math.max(0, pet.happiness - 1);
    updateUI();
}, 2000); // Every 2 seconds

// Event Listeners
feedBtn.addEventListener('click', feed);
playBtn.addEventListener('click', play);

// Initial UI Update
updateUI();
