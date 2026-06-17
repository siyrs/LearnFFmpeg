const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const hungerSpan = document.getElementById('hunger');
const happinessSpan = document.getElementById('happiness');
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

let pet = {
    x: 100,
    y: 100,
    size: 40,
    hunger: 100,
    happiness: 100,
    color: '#f1c40f',
    state: 'idle', // idle, eating, playing
    frame: 0
};

// Very simple pixel art drawing
function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = pet.color;

    // Body
    let yOffset = Math.sin(pet.frame * 0.1) * 5; // Simple idle animation (bobbing)

    if(pet.state === 'eating') {
        ctx.fillStyle = '#e67e22';
        ctx.fillRect(pet.x - pet.size/2, pet.y - pet.size/2 + yOffset, pet.size, pet.size);
    } else if (pet.state === 'playing') {
        ctx.fillStyle = '#3498db';
        ctx.fillRect(pet.x - pet.size/2, pet.y - pet.size/2 - 10 + yOffset, pet.size, pet.size);
    } else {
         if(pet.hunger < 30 || pet.happiness < 30) {
             ctx.fillStyle = '#7f8c8d'; // Sad color
         } else {
             ctx.fillStyle = '#f1c40f'; // Normal color
         }
        ctx.fillRect(pet.x - pet.size/2, pet.y - pet.size/2 + yOffset, pet.size, pet.size);
    }

    // Eyes
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(pet.x - 10, pet.y - 10 + yOffset, 5, 5);
    ctx.fillRect(pet.x + 5, pet.y - 10 + yOffset, 5, 5);

    pet.frame++;
}

function updateStats() {
    // Decrease stats over time
    if(Math.random() < 0.05) {
        pet.hunger = Math.max(0, pet.hunger - 1);
    }
    if(Math.random() < 0.05) {
        pet.happiness = Math.max(0, pet.happiness - 1);
    }

    hungerSpan.innerText = pet.hunger;
    happinessSpan.innerText = pet.happiness;
}

function gameLoop() {
    updateStats();
    drawPet();
    requestAnimationFrame(gameLoop);
}

feedBtn.addEventListener('click', () => {
    pet.hunger = Math.min(100, pet.hunger + 20);
    pet.state = 'eating';
    setTimeout(() => { pet.state = 'idle'; }, 500);
});

playBtn.addEventListener('click', () => {
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.state = 'playing';
    setTimeout(() => { pet.state = 'idle'; }, 500);
});

// Start loop
gameLoop();