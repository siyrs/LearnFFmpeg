const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
const pet = {
    x: 0,
    y: 0,
    width: 64,
    height: 64,
    color: '#FF6347',
    hunger: 100,
    happiness: 100,
    age: 0,
    state: 'idle', // idle, eating, playing
    frame: 0
};

let lastTime = 0;
let ageTimer = 0;
let statTimer = 0;

// UI elements
const hungerSpan = document.getElementById('hunger');
const happinessSpan = document.getElementById('happiness');
const ageSpan = document.getElementById('age');

// Resize canvas
function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    pet.x = canvas.width / 2 - pet.width / 2;
    pet.y = canvas.height / 2 - pet.height / 2 + 50; // slightly lower
}
window.addEventListener('resize', resize);
resize();

// Input
document.getElementById('feedBtn').addEventListener('click', () => {
    pet.hunger = Math.min(100, pet.hunger + 20);
    pet.state = 'eating';
    pet.frame = 0;
    updateUI();
});

document.getElementById('playBtn').addEventListener('click', () => {
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.hunger = Math.max(0, pet.hunger - 5);
    pet.state = 'playing';
    pet.frame = 0;
    updateUI();
});

function updateUI() {
    hungerSpan.innerText = Math.floor(pet.hunger);
    happinessSpan.innerText = Math.floor(pet.happiness);
    ageSpan.innerText = pet.age;
}

// Drawing simple pixel art shape
function drawPet() {
    ctx.fillStyle = pet.color;

    // Bounce effect
    let yOffset = 0;
    if (pet.state === 'idle') {
        yOffset = Math.sin(Date.now() / 200) * 5;
    } else if (pet.state === 'eating') {
        yOffset = (Math.floor(Date.now() / 100) % 2 === 0) ? -10 : 0;
        ctx.fillStyle = '#FF4500';
    } else if (pet.state === 'playing') {
        yOffset = -Math.abs(Math.sin(Date.now() / 150)) * 20;
        ctx.fillStyle = '#FFD700';
    }

    // Body
    ctx.fillRect(pet.x, pet.y + yOffset, pet.width, pet.height);

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(pet.x + 10, pet.y + 10 + yOffset, 10, 10);
    ctx.fillRect(pet.x + pet.width - 20, pet.y + 10 + yOffset, 10, 10);

    // Mouth
    if (pet.state === 'eating') {
        ctx.fillRect(pet.x + 20, pet.y + 35 + yOffset, 24, 10);
    } else if (pet.state === 'playing') {
        ctx.fillRect(pet.x + 20, pet.y + 35 + yOffset, 24, 5);
        ctx.fillRect(pet.x + 15, pet.y + 30 + yOffset, 5, 5);
        ctx.fillRect(pet.x + 44, pet.y + 30 + yOffset, 5, 5);
    } else {
        ctx.fillRect(pet.x + 20, pet.y + 40 + yOffset, 24, 5);
    }

    // State timeout logic
    if (pet.state !== 'idle') {
        pet.frame++;
        if (pet.frame > 60) { // roughly 1 second at 60fps
            pet.state = 'idle';
            pet.frame = 0;
        }
    }
}

function update(deltaTime) {
    // Decrease stats over time
    statTimer += deltaTime;
    if (statTimer > 1000) { // Every second
        pet.hunger = Math.max(0, pet.hunger - 0.5);
        pet.happiness = Math.max(0, pet.happiness - 0.5);
        statTimer = 0;
        updateUI();
    }

    // Increase age
    ageTimer += deltaTime;
    if (ageTimer > 60000) { // Every minute
        pet.age++;
        ageTimer = 0;
        updateUI();
    }
}

function loop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update(deltaTime);
    drawPet();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
