const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet object
const pet = {
    x: canvas.width / 2 - 20,
    y: canvas.height / 2 + 50,
    width: 40,
    height: 40,
    color: '#f1c40f',
    isJumping: false,
    jumpHeight: 50,
    startY: canvas.height / 2 + 50,
    velocityY: 0,
    gravity: 2
};

// Draw the pet
function drawPet() {
    ctx.fillStyle = pet.color;
    ctx.fillRect(pet.x, pet.y, pet.width, pet.height);

    // Draw eyes
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(pet.x + 8, pet.y + 8, 8, 8);
    ctx.fillRect(pet.x + 24, pet.y + 8, 8, 8);

    // Draw mouth
    ctx.fillRect(pet.x + 12, pet.y + 24, 16, 4);
}

// Draw environment (floor)
function drawEnvironment() {
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(0, pet.startY + pet.height, canvas.width, canvas.height - (pet.startY + pet.height));
}

// Update game state
function update() {
    if (pet.isJumping) {
        pet.y -= pet.velocityY;
        pet.velocityY -= pet.gravity;

        if (pet.y >= pet.startY) {
            pet.y = pet.startY;
            pet.isJumping = false;
            pet.velocityY = 0;
        }
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawEnvironment();
    drawPet();
    update();

    requestAnimationFrame(gameLoop);
}

// Jump interaction
canvas.addEventListener('mousedown', () => {
    if (!pet.isJumping) {
        pet.isJumping = true;
        pet.velocityY = 15;
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent scrolling on mobile
    if (!pet.isJumping) {
        pet.isJumping = true;
        pet.velocityY = 15;
    }
}, {passive: false});

// Start the game
gameLoop();