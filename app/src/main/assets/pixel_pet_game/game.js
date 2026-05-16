const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet State
let pet = {
    x: 150,
    y: 150,
    size: 40,
    hunger: 100,
    happiness: 100,
    poop: [],
    state: 'idle', // idle, eating, playing
    frame: 0
};

// Colors (Gameboy inspired palette)
const COLOR_DARK = '#0f380f';
const COLOR_MED = '#306230';
const COLOR_LIGHT = '#8bac0f';
const COLOR_BG = '#9bbc0f';

// Draw helpers
function drawPixel(x, y, color = COLOR_DARK) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 4, 4); // scale up virtual pixels
}

// Draw the pet (simple blob for now)
function drawPet() {
    ctx.fillStyle = COLOR_DARK;

    let bounce = 0;
    if (pet.state === 'idle') {
        bounce = Math.sin(Date.now() / 200) * 5;
    } else if (pet.state === 'eating') {
        bounce = Math.sin(Date.now() / 100) * 10;
    } else if (pet.state === 'playing') {
        bounce = Math.abs(Math.sin(Date.now() / 150)) * -20;
    }

    const py = pet.y + bounce;

    // Body
    ctx.fillRect(pet.x - 20, py - 20, 40, 40);

    // Eyes
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(pet.x - 10, py - 10, 8, 8);
    ctx.fillRect(pet.x + 2, py - 10, 8, 8);

    // Pupils
    ctx.fillStyle = COLOR_DARK;
    ctx.fillRect(pet.x - 8, py - 8, 4, 4);
    ctx.fillRect(pet.x + 4, py - 8, 4, 4);

    // Mouth
    if (pet.happiness > 50) {
        // smile
        ctx.fillRect(pet.x - 6, py + 5, 12, 4);
        ctx.fillRect(pet.x - 10, py + 1, 4, 4);
        ctx.fillRect(pet.x + 6, py + 1, 4, 4);
    } else {
        // sad
        ctx.fillRect(pet.x - 6, py + 5, 12, 4);
        ctx.fillRect(pet.x - 10, py + 9, 4, 4);
        ctx.fillRect(pet.x + 6, py + 9, 4, 4);
    }
}

function drawPoop(p) {
    ctx.fillStyle = COLOR_MED;
    ctx.fillRect(p.x - 10, p.y, 20, 10);
    ctx.fillRect(p.x - 6, p.y - 8, 12, 8);
    ctx.fillRect(p.x - 2, p.y - 12, 4, 4);
}

function update() {
    // Decrease stats over time
    if (Math.random() < 0.02) pet.hunger = Math.max(0, pet.hunger - 1);
    if (Math.random() < 0.01) pet.happiness = Math.max(0, pet.happiness - 1);

    // Poop logic
    if (pet.hunger < 50 && Math.random() < 0.005 && pet.poop.length < 5) {
        pet.poop.push({ x: 50 + Math.random() * 200, y: 220 + Math.random() * 30 });
    }

    // Unhappy if poop is around
    if (pet.poop.length > 0) {
        pet.happiness = Math.max(0, pet.happiness - 0.5);
    }

    // Reset states after a while
    if (pet.state !== 'idle' && Math.random() < 0.05) {
        pet.state = 'idle';
    }

    // Update UI
    document.getElementById('hungerDisplay').innerText = Math.floor(pet.hunger);
    document.getElementById('happinessDisplay').innerText = Math.floor(pet.happiness);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw poops
    pet.poop.forEach(drawPoop);

    // Draw pet
    drawPet();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Controls
document.getElementById('feedBtn').addEventListener('click', () => {
    pet.hunger = Math.min(100, pet.hunger + 20);
    pet.state = 'eating';
});

document.getElementById('playBtn').addEventListener('click', () => {
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.hunger = Math.max(0, pet.hunger - 5); // playing makes hungry
    pet.state = 'playing';
});

document.getElementById('cleanBtn').addEventListener('click', () => {
    if (pet.poop.length > 0) {
        pet.poop.pop(); // remove one poop
        pet.happiness = Math.min(100, pet.happiness + 5);
    }
});

// Start game
loop();
