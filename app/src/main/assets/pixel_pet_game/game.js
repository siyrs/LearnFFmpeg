const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fixed logical size for the pixel art game
const GAME_WIDTH = 160;
const GAME_HEIGHT = 144; // Gameboy resolution roughly

// Pet stats
let pet = {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    size: 16,
    color: '#00aa00',
    happiness: 100,
    hunger: 0,
    isSleeping: false
};

let lastTime = 0;
let statTimer = 0;

function resizeCanvas() {
    // Keep aspect ratio
    const aspect = GAME_WIDTH / GAME_HEIGHT;
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;

    if (newWidth / newHeight > aspect) {
        newWidth = newHeight * aspect;
    } else {
        newHeight = newWidth / aspect;
    }

    // Set actual canvas size to logical size to keep it pixelated
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    // Use CSS to scale it up visually
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function draw() {
    // Clear screen
    ctx.fillStyle = '#ccffcc'; // Light green background
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw Ground
    ctx.fillStyle = '#66cc66';
    ctx.fillRect(0, GAME_HEIGHT - 20, GAME_WIDTH, 20);

    // Draw Pet
    ctx.fillStyle = pet.color;
    ctx.fillRect(pet.x - pet.size / 2, pet.y - pet.size / 2, pet.size, pet.size);

    // Eyes
    ctx.fillStyle = '#000';
    if (pet.isSleeping) {
        ctx.fillRect(pet.x - 4, pet.y - 2, 3, 1);
        ctx.fillRect(pet.x + 2, pet.y - 2, 3, 1);
    } else {
        ctx.fillRect(pet.x - 4, pet.y - 4, 3, 3);
        ctx.fillRect(pet.x + 2, pet.y - 4, 3, 3);
    }

    // UI Text
    ctx.fillStyle = '#000';
    ctx.font = '8px monospace';
    ctx.fillText(`Happy: ${Math.floor(pet.happiness)}`, 5, 12);
    ctx.fillText(`Hunger: ${Math.floor(pet.hunger)}`, 5, 22);

    // Instructions
    ctx.fillText("Tap Left: Feed", 5, GAME_HEIGHT - 5);
    ctx.fillText("Tap Right: Play", GAME_WIDTH - 70, GAME_HEIGHT - 5);
}

function update(deltaTime) {
    statTimer += deltaTime;

    // Every 1 second
    if (statTimer > 1000) {
        pet.hunger += 1;
        pet.happiness -= 0.5;
        statTimer = 0;

        if (pet.hunger > 100) pet.hunger = 100;
        if (pet.happiness < 0) pet.happiness = 0;

        // Pet color changes based on happiness/hunger
        if (pet.hunger > 80 || pet.happiness < 20) {
            pet.color = '#aa0000'; // Sad/Hungry
        } else if (pet.hunger > 50 || pet.happiness < 50) {
            pet.color = '#aaaa00'; // OK
        } else {
            pet.color = '#00aa00'; // Happy
        }
    }
}

function loop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(loop);
}

// Interaction
canvas.addEventListener('click', (e) => {
    // Get click position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratioX = x / rect.width;

    if (ratioX < 0.5) {
        // Left side clicked: Feed
        pet.hunger -= 15;
        if (pet.hunger < 0) pet.hunger = 0;
    } else {
        // Right side clicked: Play
        pet.happiness += 10;
        if (pet.happiness > 100) pet.happiness = 100;

        // Brief jump animation
        pet.y -= 10;
        setTimeout(() => { pet.y += 10; }, 100);
    }
});

requestAnimationFrame(loop);