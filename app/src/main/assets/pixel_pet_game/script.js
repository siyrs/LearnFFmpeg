const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

// Pet state
let pet = {
    x: 120,
    y: 150,
    width: 60,
    height: 60,
    hunger: 50,
    happiness: 50,
    color: '#FF6347', // Tomato red
    eyeColor: '#FFF',
    pupilColor: '#000',
    jumping: false,
    jumpVelocity: 0,
    gravity: 0.5,
    baseY: 150
};

// Colors
const groundColor = '#8FBC8F'; // Dark Sea Green

function drawPet() {
    // Body
    ctx.fillStyle = pet.color;
    ctx.fillRect(pet.x, pet.y, pet.width, pet.height);

    // Eyes
    ctx.fillStyle = pet.eyeColor;
    ctx.fillRect(pet.x + 10, pet.y + 10, 15, 15);
    ctx.fillRect(pet.x + 35, pet.y + 10, 15, 15);

    // Pupils
    ctx.fillStyle = pet.pupilColor;
    ctx.fillRect(pet.x + 15, pet.y + 15, 5, 5);
    ctx.fillRect(pet.x + 40, pet.y + 15, 5, 5);

    // Mouth (varies by happiness)
    ctx.fillStyle = '#000';
    if (pet.happiness > 50) {
        // Smile
        ctx.fillRect(pet.x + 15, pet.y + 40, 30, 5);
        ctx.fillRect(pet.x + 10, pet.y + 35, 5, 5);
        ctx.fillRect(pet.x + 45, pet.y + 35, 5, 5);
    } else if (pet.happiness < 30) {
        // Sad
        ctx.fillRect(pet.x + 15, pet.y + 35, 30, 5);
        ctx.fillRect(pet.x + 10, pet.y + 40, 5, 5);
        ctx.fillRect(pet.x + 45, pet.y + 40, 5, 5);
    } else {
        // Neutral
        ctx.fillRect(pet.x + 15, pet.y + 40, 30, 5);
    }
}

function drawBackground() {
    ctx.fillStyle = '#87CEEB'; // Sky
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = groundColor; // Ground
    ctx.fillRect(0, pet.baseY + pet.height, canvas.width, canvas.height - (pet.baseY + pet.height));
}

function drawStats() {
    ctx.fillStyle = '#000';
    ctx.font = '16px Courier New';
    ctx.fillText(`Hunger: ${Math.floor(pet.hunger)}`, 10, 20);
    ctx.fillText(`Happiness: ${Math.floor(pet.happiness)}`, 10, 40);

    if (pet.hunger >= 100) {
        ctx.fillStyle = 'red';
        ctx.fillText('STARVING!', 10, 60);
    }
    if (pet.happiness <= 0) {
        ctx.fillStyle = 'blue';
        ctx.fillText('SAD!', 10, 80);
    }
}

function updatePhysics() {
    if (pet.jumping) {
        pet.y -= pet.jumpVelocity;
        pet.jumpVelocity -= pet.gravity;

        if (pet.y >= pet.baseY) {
            pet.y = pet.baseY;
            pet.jumping = false;
        }
    }
}

function updateStats() {
    // Increase hunger over time
    if (pet.hunger < 100) {
        pet.hunger += 0.05;
    }
    // Decrease happiness over time
    if (pet.happiness > 0) {
        pet.happiness -= 0.03;
    }

    // Cap stats
    if (pet.hunger > 100) pet.hunger = 100;
    if (pet.happiness < 0) pet.happiness = 0;
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateStats();
    updatePhysics();

    drawBackground();
    drawPet();
    drawStats();

    requestAnimationFrame(loop);
}

// Interactions
feedBtn.addEventListener('click', () => {
    if (pet.hunger > 0) {
        pet.hunger -= 20;
        if (pet.hunger < 0) pet.hunger = 0;

        // Feeding makes it jump slightly
        if (!pet.jumping) {
            pet.jumping = true;
            pet.jumpVelocity = 5;
        }
    }
});

playBtn.addEventListener('click', () => {
    if (pet.happiness < 100) {
        pet.happiness += 20;
        if (pet.happiness > 100) pet.happiness = 100;

        // Playing uses up energy (increases hunger slightly)
        pet.hunger += 5;
        if (pet.hunger > 100) pet.hunger = 100;

        // Jump high when played with
        if (!pet.jumping) {
            pet.jumping = true;
            pet.jumpVelocity = 10;
        }
    }
});

// Start loop
requestAnimationFrame(loop);
