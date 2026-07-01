const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet State
let pet = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 40,
    hunger: 100,
    happiness: 100,
    color: '#FFB6C1', // Light pink
    isEating: false,
    eatTimer: 0,
    jumpVelocity: 0,
    isJumping: false
};

const GRAVITY = 0.5;
const GROUND_Y = canvas.height - 80;

let lastTime = 0;

function drawPet() {
    ctx.fillStyle = pet.color;

    // Body (simple pixelated look)
    ctx.fillRect(pet.x - pet.size / 2, pet.y - pet.size / 2, pet.size, pet.size);

    // Eyes
    ctx.fillStyle = 'black';
    ctx.fillRect(pet.x - 10, pet.y - 10, 5, 5);
    ctx.fillRect(pet.x + 5, pet.y - 10, 5, 5);

    // Mouth
    if (pet.isEating) {
        ctx.fillStyle = '#FF69B4'; // Hot pink open mouth
        ctx.fillRect(pet.x - 5, pet.y + 5, 10, 10);
    } else if (pet.happiness < 50) {
        ctx.fillRect(pet.x - 5, pet.y + 10, 10, 2); // Sad
    } else {
        ctx.fillRect(pet.x - 5, pet.y + 5, 10, 5); // Happy
        // Smile edges
        ctx.fillRect(pet.x - 8, pet.y + 2, 3, 3);
        ctx.fillRect(pet.x + 5, pet.y + 2, 3, 3);
    }
}

function drawStats() {
    ctx.fillStyle = 'black';
    ctx.font = '16px "Courier New", Courier, monospace';
    ctx.fillText(`Hunger: ${Math.floor(pet.hunger)}`, 10, 20);
    ctx.fillText(`Happiness: ${Math.floor(pet.happiness)}`, 10, 40);

    ctx.font = '12px "Courier New", Courier, monospace';
    ctx.fillText("Tap pet to play", 10, canvas.height - 30);
    ctx.fillText("Tap ground to feed", 10, canvas.height - 10);
}

function update(deltaTime) {
    // Decrease stats over time
    pet.hunger -= 0.5 * (deltaTime / 1000);
    pet.happiness -= 0.3 * (deltaTime / 1000);

    // Clamp stats
    pet.hunger = Math.max(0, Math.min(100, pet.hunger));
    pet.happiness = Math.max(0, Math.min(100, pet.happiness));

    // Jump physics
    if (pet.isJumping) {
        pet.y -= pet.jumpVelocity;
        pet.jumpVelocity -= GRAVITY;

        if (pet.y >= GROUND_Y) {
            pet.y = GROUND_Y;
            pet.isJumping = false;
            pet.jumpVelocity = 0;
        }
    } else {
        // Ensure pet is on the ground
        pet.y = GROUND_Y;
    }

    // Eating animation
    if (pet.isEating) {
        pet.eatTimer -= deltaTime;
        if (pet.eatTimer <= 0) {
            pet.isEating = false;
        }
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#3CB371'; // Medium Sea Green
    ctx.fillRect(0, GROUND_Y + pet.size / 2, canvas.width, canvas.height - (GROUND_Y + pet.size / 2));

    drawPet();
    drawStats();
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

// Interactions
canvas.addEventListener('mousedown', handleInteraction);
canvas.addEventListener('touchstart', handleInteraction, {passive: false});

function handleInteraction(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();

    // Calculate scale in case CSS resizes the canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;

    if (e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    // Check if clicked on pet
    if (x >= pet.x - pet.size / 2 && x <= pet.x + pet.size / 2 &&
        y >= pet.y - pet.size / 2 && y <= pet.y + pet.size / 2) {
        // Play with pet
        pet.happiness += 10;
        if (!pet.isJumping) {
            pet.isJumping = true;
            pet.jumpVelocity = 10;
        }
    } else if (y > GROUND_Y) {
        // Feed pet
        pet.hunger += 15;
        pet.isEating = true;
        pet.eatTimer = 500; // Eat for 500ms

        // Move towards food slightly (just visual pop for now)
        pet.x = x > pet.x ? pet.x + 5 : pet.x - 5;
        // Keep within bounds
        pet.x = Math.max(pet.size/2, Math.min(canvas.width - pet.size/2, pet.x));
    }
}

// Start game
requestAnimationFrame(gameLoop);