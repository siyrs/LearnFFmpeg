const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const hungerStat = document.getElementById('hungerStat');
const happinessStat = document.getElementById('happinessStat');
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

// Pet State
let pet = {
    x: 150,
    y: 150,
    size: 40,
    color: '#ffcc00', // yellow pet
    hunger: 0,
    happiness: 100,
    dx: 1, // moving speed
    dy: 0,
    state: 'idle', // idle, eating, playing
    stateTimer: 0
};

// Update stats on UI
function updateStatsUI() {
    hungerStat.innerText = pet.hunger;
    happinessStat.innerText = pet.happiness;
}

// Decrease stats over time
setInterval(() => {
    if (pet.hunger < 100) {
        pet.hunger += 1;
    }
    if (pet.happiness > 0) {
        pet.happiness -= 1;
    }
    updateStatsUI();
}, 2000);

// Draw the pet (a simple pixel-like rectangle for now, can be improved)
function drawPet() {
    ctx.fillStyle = pet.color;

    if (pet.hunger > 80 || pet.happiness < 20) {
        // Sad/Hungry color
        ctx.fillStyle = '#ff6666';
    }

    // Draw main body
    ctx.fillRect(pet.x - pet.size/2, pet.y - pet.size/2, pet.size, pet.size);

    // Draw eyes
    ctx.fillStyle = 'black';
    if (pet.state === 'eating') {
        // closed eyes
        ctx.fillRect(pet.x - 10, pet.y - 10, 8, 2);
        ctx.fillRect(pet.x + 2, pet.y - 10, 8, 2);
    } else if (pet.state === 'playing') {
        // happy eyes ^ ^
        ctx.fillRect(pet.x - 10, pet.y - 12, 2, 4);
        ctx.fillRect(pet.x - 8, pet.y - 14, 4, 2);
        ctx.fillRect(pet.x - 4, pet.y - 12, 2, 4);

        ctx.fillRect(pet.x + 2, pet.y - 12, 2, 4);
        ctx.fillRect(pet.x + 4, pet.y - 14, 4, 2);
        ctx.fillRect(pet.x + 8, pet.y - 12, 2, 4);
    } else {
        // normal eyes
        ctx.fillRect(pet.x - 10, pet.y - 10, 6, 6);
        ctx.fillRect(pet.x + 4, pet.y - 10, 6, 6);
    }
}

function updatePet() {
    // Basic movement around the canvas
    if (pet.state === 'idle') {
        pet.x += pet.dx;

        // bounce off walls
        if (pet.x + pet.size/2 > canvas.width || pet.x - pet.size/2 < 0) {
            pet.dx = -pet.dx;
        }

        // slight random vertical movement
        if (Math.random() < 0.05) {
            pet.y += (Math.random() > 0.5 ? 2 : -2);
        }
        // keep within bounds vertically
        if (pet.y - pet.size/2 < 100) pet.y = 100 + pet.size/2;
        if (pet.y + pet.size/2 > canvas.height) pet.y = canvas.height - pet.size/2;
    }

    // Handle state timers
    if (pet.stateTimer > 0) {
        pet.stateTimer--;
        if (pet.stateTimer <= 0) {
            pet.state = 'idle';
        }
    }
}

function drawGround() {
    ctx.fillStyle = '#654321'; // Brown dirt
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    ctx.fillStyle = '#32cd32'; // Green grass
    ctx.fillRect(0, canvas.height - 50, canvas.width, 10);
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGround();
    updatePet();
    drawPet();

    requestAnimationFrame(gameLoop);
}

// Interaction listeners
feedBtn.addEventListener('click', () => {
    if (pet.hunger > 0) {
        pet.hunger = Math.max(0, pet.hunger - 20);
        pet.state = 'eating';
        pet.stateTimer = 60; // frames
        updateStatsUI();
    }
});

playBtn.addEventListener('click', () => {
    if (pet.happiness < 100) {
        pet.happiness = Math.min(100, pet.happiness + 20);
        pet.state = 'playing';
        pet.stateTimer = 60; // frames

        // little jump
        pet.y -= 20;
        setTimeout(() => { pet.y += 20; }, 200);

        updateStatsUI();
    }
});

// Start game
updateStatsUI();
gameLoop();
