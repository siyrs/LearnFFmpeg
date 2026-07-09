const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet State
let pet = {
    x: canvas.width / 2,
    y: canvas.height / 2 + 50,
    size: 40,
    hunger: 50,
    happiness: 50,
    isEating: false,
    isPlaying: false
};

// Game Timing
let lastTime = 0;
const statDecreaseInterval = 2000; // Decrease stats every 2 seconds
let timeSinceLastDecrease = 0;

function drawPet() {
    ctx.fillStyle = pet.isEating ? '#FFD700' : (pet.isPlaying ? '#FF69B4' : '#FFFFFF');

    // Draw a simple blocky pet (e.g., a slime or blob)
    const s = pet.size;
    const px = pet.x - s / 2;
    const py = pet.y - s / 2;

    // Body
    ctx.fillRect(px, py, s, s);

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(px + s * 0.2, py + s * 0.2, s * 0.2, s * 0.2);
    ctx.fillRect(px + s * 0.6, py + s * 0.2, s * 0.2, s * 0.2);

    // Mouth
    if (pet.happiness > 50) {
        // Happy mouth
        ctx.fillRect(px + s * 0.3, py + s * 0.6, s * 0.4, s * 0.1);
        ctx.fillRect(px + s * 0.2, py + s * 0.5, s * 0.1, s * 0.1);
        ctx.fillRect(px + s * 0.7, py + s * 0.5, s * 0.1, s * 0.1);
    } else {
        // Sad mouth
        ctx.fillRect(px + s * 0.3, py + s * 0.5, s * 0.4, s * 0.1);
        ctx.fillRect(px + s * 0.2, py + s * 0.6, s * 0.1, s * 0.1);
        ctx.fillRect(px + s * 0.7, py + s * 0.6, s * 0.1, s * 0.1);
    }
}

function drawStats() {
    ctx.fillStyle = '#000000';
    ctx.font = '16px Courier New';
    ctx.fillText(`Hunger: ${Math.floor(pet.hunger)}`, 10, 20);
    ctx.fillText(`Happiness: ${Math.floor(pet.happiness)}`, 10, 40);
}

function update(deltaTime) {
    timeSinceLastDecrease += deltaTime;

    if (timeSinceLastDecrease > statDecreaseInterval) {
        pet.hunger = Math.max(0, pet.hunger - 2);
        pet.happiness = Math.max(0, pet.happiness - 1);
        timeSinceLastDecrease = 0;
    }
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    drawStats();
    drawPet();
}

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);
}

// Start game loop
requestAnimationFrame(gameLoop);

// Interaction Logic
document.getElementById('feedBtn').addEventListener('click', () => {
    pet.hunger = Math.min(100, pet.hunger + 15);
    pet.isEating = true;

    // Simple animation effect
    pet.y -= 10;
    setTimeout(() => {
        pet.y += 10;
        pet.isEating = false;
    }, 200);
});

document.getElementById('playBtn').addEventListener('click', () => {
    pet.happiness = Math.min(100, pet.happiness + 15);
    pet.isPlaying = true;

    // Simple jump animation
    let jumpHeight = 30;
    pet.y -= jumpHeight;
    setTimeout(() => {
        pet.y += jumpHeight;
        pet.isPlaying = false;
    }, 300);
});
