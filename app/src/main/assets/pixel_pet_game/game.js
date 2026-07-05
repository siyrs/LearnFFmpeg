const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hungerSpan = document.getElementById('hungerValue');
const feedBtn = document.getElementById('feedBtn');

// Pet state
let pet = {
    x: canvas.width / 2 - 20,
    y: canvas.height / 2,
    size: 40,
    hunger: 0,
    isJumping: false,
    jumpVelocity: 0,
    baseY: canvas.height / 2
};

// Game loop settings
let lastTime = 0;
const hungerRate = 5; // Hunger points per second

feedBtn.addEventListener('click', () => {
    pet.hunger = Math.max(0, pet.hunger - 20);
    // Simple jump effect on feed
    if (!pet.isJumping) {
        pet.isJumping = true;
        pet.jumpVelocity = -10;
    }
});

function drawPet() {
    ctx.fillStyle = pet.hunger < 80 ? '#FFA500' : '#FF4500'; // Change color when very hungry

    // Draw simple square pet for now
    ctx.fillRect(pet.x, pet.y, pet.size, pet.size);

    // Eyes
    ctx.fillStyle = 'black';
    ctx.fillRect(pet.x + 8, pet.y + 10, 5, 5);
    ctx.fillRect(pet.x + 27, pet.y + 10, 5, 5);

    // Mouth (sad if hungry, happy if not)
    if (pet.hunger > 70) {
        ctx.fillRect(pet.x + 15, pet.y + 25, 10, 2);
    } else {
        ctx.fillRect(pet.x + 10, pet.y + 25, 20, 2);
        ctx.fillRect(pet.x + 10, pet.y + 23, 2, 2);
        ctx.fillRect(pet.x + 28, pet.y + 23, 2, 2);
    }
}

function update(deltaTime) {
    // Increase hunger
    pet.hunger += hungerRate * (deltaTime / 1000);
    if (pet.hunger > 100) pet.hunger = 100;

    hungerSpan.innerText = Math.floor(pet.hunger);

    // Handle jumping
    if (pet.isJumping) {
        pet.y += pet.jumpVelocity;
        pet.jumpVelocity += 0.5; // Gravity

        if (pet.y >= pet.baseY) {
            pet.y = pet.baseY;
            pet.isJumping = false;
        }
    }
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw simple ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height / 2 + 40, canvas.width, canvas.height / 2 - 40);
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height / 2 + 35, canvas.width, 5);


    update(deltaTime);
    drawPet();

    requestAnimationFrame(gameLoop);
}

// Start loop
requestAnimationFrame(gameLoop);
