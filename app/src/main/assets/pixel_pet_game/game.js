const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet State
let hunger = 100;
let happiness = 100;
let energy = 100;
let isSleeping = false;
let petX = 150;
let petY = 200;
let bounce = 0;
let bounceDir = 1;
let frameCount = 0;

// Update UI
function updateUI() {
    document.getElementById('hunger').innerText = Math.floor(hunger);
    document.getElementById('happiness').innerText = Math.floor(happiness);
    document.getElementById('energy').innerText = Math.floor(energy);
}

// Decrease stats over time
setInterval(() => {
    if (!isSleeping) {
        hunger = Math.max(0, hunger - 2);
        happiness = Math.max(0, happiness - 1);
        energy = Math.max(0, energy - 1);
    } else {
        energy = Math.min(100, energy + 5);
        hunger = Math.max(0, hunger - 1);
        if (energy >= 100) isSleeping = false; // Wake up when fully rested
    }
    updateUI();
}, 2000);

// Draw Pixel Art Pet
function drawPet(x, y, offset) {
    const size = 10;

    // Simple 8-bit style pet (slime/blob)
    ctx.fillStyle = isSleeping ? '#7f8c8d' : (happiness > 50 ? '#2ecc71' : '#e67e22');

    // Body
    ctx.fillRect(x - 3*size, y - 4*size + offset, 6*size, 4*size);
    ctx.fillRect(x - 4*size, y - 3*size + offset, 8*size, 3*size);
    ctx.fillRect(x - 5*size, y - 2*size + offset, 10*size, 2*size);

    // Eyes
    ctx.fillStyle = '#2c3e50';
    if (isSleeping) {
        // Closed eyes
        ctx.fillRect(x - 3*size, y - 2*size + offset, 2*size, size/2);
        ctx.fillRect(x + 1*size, y - 2*size + offset, 2*size, size/2);
    } else {
        // Open eyes
        ctx.fillRect(x - 3*size, y - 3*size + offset, 2*size, 2*size);
        ctx.fillRect(x + 1*size, y - 3*size + offset, 2*size, 2*size);

        // Pupil (look direction)
        ctx.fillStyle = 'white';
        ctx.fillRect(x - 2*size, y - 3*size + offset, size, size);
        ctx.fillRect(x + 2*size, y - 3*size + offset, size, size);
    }

    // Mouth
    ctx.fillStyle = '#c0392b';
    if (happiness > 70 && !isSleeping) {
        // Happy mouth
        ctx.fillRect(x - size, y - size + offset, 2*size, size);
        ctx.fillRect(x - 2*size, y - 2*size + offset, size, size);
        ctx.fillRect(x + size, y - 2*size + offset, size, size);
    } else if (happiness <= 30 && !isSleeping) {
        // Sad mouth
        ctx.fillRect(x - size, y - 2*size + offset, 2*size, size);
        ctx.fillRect(x - 2*size, y - size + offset, size, size);
        ctx.fillRect(x + size, y - size + offset, size, size);
    } else if (!isSleeping) {
        // Neutral mouth
        ctx.fillRect(x - size, y - size + offset, 2*size, size);
    }
}

// Draw Environment
function drawEnvironment() {
    // Sky
    ctx.fillStyle = isSleeping ? '#2c3e50' : '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = isSleeping ? '#27ae60' : '#2ecc71';
    ctx.fillRect(0, 220, canvas.width, 80);

    // Cloud
    if (!isSleeping) {
        ctx.fillStyle = 'white';
        ctx.fillRect(50 + (frameCount % 300), 50, 40, 20);
        ctx.fillRect(60 + (frameCount % 300), 40, 20, 20);
    }
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frameCount++;

    // Animate idle bounce
    if (!isSleeping && frameCount % 10 === 0) {
        bounce += bounceDir * 2;
        if (bounce > 4 || bounce < 0) bounceDir *= -1;
    } else if (isSleeping) {
        bounce = Math.sin(frameCount * 0.05) * 2; // Breathing effect
    }

    drawEnvironment();
    drawPet(petX, petY, bounce);

    requestAnimationFrame(gameLoop);
}

// Controls
document.getElementById('feed-btn').addEventListener('click', () => {
    if (isSleeping) return;
    hunger = Math.min(100, hunger + 20);
    energy = Math.max(0, energy - 5);
    updateUI();
});

document.getElementById('play-btn').addEventListener('click', () => {
    if (isSleeping) return;
    if (energy > 10) {
        happiness = Math.min(100, happiness + 15);
        energy = Math.max(0, energy - 15);
        hunger = Math.max(0, hunger - 10);
    } else {
        alert("Too tired to play!");
    }
    updateUI();
});

document.getElementById('sleep-btn').addEventListener('click', () => {
    isSleeping = !isSleeping;
});

// Init
updateUI();
gameLoop();
