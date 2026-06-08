const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet object
const pet = {
    x: 200,
    y: 300,
    size: 40,
    color: '#ffcc00',
    hunger: 100,
    happiness: 100,
    state: 'idle', // idle, eating, playing
    frame: 0
};

// Game loop variables
let lastTime = 0;
let statTimer = 0;

// Handle clicks/touches
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Buttons
    // Feed button
    if (clickX >= 50 && clickX <= 150 && clickY >= 500 && clickY <= 550) {
        feedPet();
    }
    // Play button
    if (clickX >= 250 && clickX <= 350 && clickY >= 500 && clickY <= 550) {
        playWithPet();
    }
});

function feedPet() {
    pet.hunger = Math.min(100, pet.hunger + 20);
    pet.state = 'eating';
    setTimeout(() => pet.state = 'idle', 1000);
}

function playWithPet() {
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.state = 'playing';
    setTimeout(() => pet.state = 'idle', 1000);
}

function update(deltaTime) {
    statTimer += deltaTime;
    // Decrease stats over time
    if (statTimer > 2000) { // Every 2 seconds
        pet.hunger = Math.max(0, pet.hunger - 1);
        pet.happiness = Math.max(0, pet.happiness - 1);
        statTimer = 0;
    }

    pet.frame += deltaTime;
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Stats
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Hunger: ${pet.hunger}`, 20, 30);
    ctx.fillText(`Happiness: ${pet.happiness}`, 20, 60);

    // Draw Pet
    ctx.save();
    ctx.translate(pet.x, pet.y);

    // Simple bobbing animation
    const bob = Math.sin(pet.frame * 0.005) * 5;
    ctx.translate(0, bob);

    ctx.fillStyle = pet.color;
    // Body
    ctx.fillRect(-pet.size/2, -pet.size/2, pet.size, pet.size);

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(-pet.size/4 - 2, -pet.size/4, 4, 4);
    ctx.fillRect(pet.size/4 - 2, -pet.size/4, 4, 4);

    // Mouth
    if (pet.state === 'idle') {
        ctx.fillRect(-pet.size/4, pet.size/4, pet.size/2, 2);
    } else if (pet.state === 'eating') {
        ctx.fillRect(-pet.size/4, pet.size/8, pet.size/2, pet.size/4);
    } else if (pet.state === 'playing') {
        ctx.beginPath();
        ctx.arc(0, pet.size/8, pet.size/4, 0, Math.PI, false);
        ctx.fill();
    }

    ctx.restore();

    // Draw Buttons
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(50, 500, 100, 50);
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(250, 500, 100, 50);

    ctx.fillStyle = '#FFF';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Feed', 100, 532);
    ctx.fillText('Play', 300, 532);
    ctx.textAlign = 'left'; // reset
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

// Start loop
requestAnimationFrame(gameLoop);
