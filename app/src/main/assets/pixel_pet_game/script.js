const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet State
const pet = {
    x: 200,
    y: 200,
    size: 40,
    color: '#e74c3c', // Redish
    hunger: 100,
    happiness: 100,
    lastUpdate: Date.now()
};

// UI Elements
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

// Pixel drawing helper
function drawPixel(x, y, color, size = 10) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

// Very basic pixel pet drawing
function drawPet(x, y) {
    const s = 5; // pixel size scale
    const c = pet.color;
    const k = '#000'; // outline

    // Simple 8x8 looking sprite
    // Body
    ctx.fillStyle = c;
    ctx.fillRect(x - 4*s, y - 4*s, 8*s, 8*s);

    // Eyes
    ctx.fillStyle = k;
    ctx.fillRect(x - 2*s, y - 2*s, s, s);
    ctx.fillRect(x + s, y - 2*s, s, s);

    // Mouth (changes based on happiness)
    if (pet.happiness > 50) {
        // Smile
        ctx.fillRect(x - 2*s, y + 2*s, s, s);
        ctx.fillRect(x - s, y + 3*s, 2*s, s);
        ctx.fillRect(x + s, y + 2*s, s, s);
    } else {
        // Sad
        ctx.fillRect(x - 2*s, y + 3*s, s, s);
        ctx.fillRect(x - s, y + 2*s, 2*s, s);
        ctx.fillRect(x + s, y + 3*s, s, s);
    }
}

function update() {
    const now = Date.now();
    const dt = (now - pet.lastUpdate) / 1000; // delta time in seconds

    // Decrease stats over time (1 unit every 2 seconds roughly)
    if (dt > 2.0) {
        pet.hunger = Math.max(0, pet.hunger - 1);
        pet.happiness = Math.max(0, pet.happiness - 1);
        pet.lastUpdate = now;

        // Change color based on health
        if (pet.hunger < 30 || pet.happiness < 30) {
            pet.color = '#7f8c8d'; // Grey/sad
        } else {
            pet.color = '#e74c3c'; // Normal
        }
    }

    // Simple bobbing animation
    pet.y = 200 + Math.sin(now / 500) * 10;
}

function drawStats() {
    ctx.fillStyle = '#2c3e50';
    ctx.font = '20px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(`Hunger:    ${pet.hunger}%`, 20, 30);
    ctx.fillText(`Happiness: ${pet.happiness}%`, 20, 60);

    // Draw status bars
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(20, 35, 150 * (pet.hunger / 100), 10);

    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(20, 65, 150 * (pet.happiness / 100), 10);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStats();
    drawPet(pet.x, pet.y);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event Listeners
feedBtn.addEventListener('click', () => {
    pet.hunger = Math.min(100, pet.hunger + 20);
    pet.color = '#e74c3c'; // Reset color if it was sad
});

playBtn.addEventListener('click', () => {
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.hunger = Math.max(0, pet.hunger - 5); // Playing makes it slightly hungry
    pet.color = '#e74c3c';
});

// Start the game loop
gameLoop();
