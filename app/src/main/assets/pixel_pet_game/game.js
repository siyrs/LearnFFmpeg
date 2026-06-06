const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Stats elements
const healthEl = document.getElementById('health');
const hungerEl = document.getElementById('hunger');
const happinessEl = document.getElementById('happiness');

// Buttons
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');
const sleepBtn = document.getElementById('sleepBtn');

// Pet State
let pet = {
    x: 150,
    y: 200,
    width: 60,
    height: 60,
    state: 'idle', // idle, eating, playing, sleeping
    frame: 0,
    health: 100,
    hunger: 0,
    happiness: 100,
    color: '#f1c40f',
    isAlive: true
};

// Game loop variables
let lastTime = 0;
let frameTimer = 0;
const frameInterval = 500; // Animation speed
let statTimer = 0;
const statInterval = 2000; // Stat update speed

// Initialize
function init() {
    bindEvents();
    requestAnimationFrame(gameLoop);
}

// Event Listeners
function bindEvents() {
    feedBtn.addEventListener('click', () => {
        if (!pet.isAlive || pet.state === 'sleeping') return;
        pet.state = 'eating';
        pet.hunger = Math.max(0, pet.hunger - 20);
        pet.health = Math.min(100, pet.health + 5);
        updateStatsUI();

        // Reset state after action
        setTimeout(() => { if(pet.isAlive && pet.state !== 'sleeping') pet.state = 'idle'; }, 1000);
    });

    playBtn.addEventListener('click', () => {
        if (!pet.isAlive || pet.state === 'sleeping') return;
        pet.state = 'playing';
        pet.happiness = Math.min(100, pet.happiness + 20);
        pet.hunger = Math.min(100, pet.hunger + 10);
        updateStatsUI();

        setTimeout(() => { if(pet.isAlive && pet.state !== 'sleeping') pet.state = 'idle'; }, 1000);
    });

    sleepBtn.addEventListener('click', () => {
        if (!pet.isAlive) return;
        if (pet.state === 'sleeping') {
            pet.state = 'idle';
            sleepBtn.innerText = 'Sleep';
        } else {
            pet.state = 'sleeping';
            sleepBtn.innerText = 'Wake Up';
        }
    });
}

// Update game state
function updateStats(deltaTime) {
    if (!pet.isAlive) return;

    statTimer += deltaTime;
    if (statTimer >= statInterval) {
        statTimer = 0;

        if (pet.state !== 'sleeping') {
            pet.hunger += 2;
            pet.happiness -= 1;
        } else {
            pet.health = Math.min(100, pet.health + 1);
            pet.happiness -= 0.5;
        }

        // Starvation logic
        if (pet.hunger >= 100) {
            pet.health -= 5;
        }

        // Unhappiness logic
        if (pet.happiness <= 0) {
            pet.health -= 2;
        }

        // Cap stats
        pet.hunger = Math.max(0, Math.min(100, pet.hunger));
        pet.happiness = Math.max(0, Math.min(100, pet.happiness));
        pet.health = Math.max(0, Math.min(100, pet.health));

        if (pet.health <= 0) {
            pet.isAlive = false;
            pet.state = 'dead';
        }

        updateStatsUI();
    }
}

// Update UI
function updateStatsUI() {
    healthEl.innerText = Math.round(pet.health);
    hungerEl.innerText = Math.round(pet.hunger);
    happinessEl.innerText = Math.round(pet.happiness);

    // Color coding
    healthEl.style.color = pet.health < 30 ? 'red' : 'white';
    hungerEl.style.color = pet.hunger > 70 ? 'red' : 'white';
    happinessEl.style.color = pet.happiness < 30 ? 'red' : 'white';
}

// Draw Pet
function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(0, 230, canvas.width, 70);

    ctx.fillStyle = pet.isAlive ? pet.color : '#7f8c8d';

    const bounceOffset = (pet.state === 'idle' || pet.state === 'playing') && pet.frame % 2 === 0 ? -5 : 0;

    const drawX = pet.x - pet.width / 2;
    const drawY = pet.y - pet.height + bounceOffset;

    // Body
    ctx.fillRect(drawX, drawY, pet.width, pet.height);

    // Eyes
    ctx.fillStyle = 'black';
    if (pet.state === 'sleeping' || !pet.isAlive) {
        // Closed eyes
        ctx.fillRect(drawX + 10, drawY + 20, 15, 5);
        ctx.fillRect(drawX + 35, drawY + 20, 15, 5);
    } else {
        // Open eyes
        ctx.fillRect(drawX + 10, drawY + 15, 10, 10);
        ctx.fillRect(drawX + 40, drawY + 15, 10, 10);
    }

    // Mouth
    if (!pet.isAlive) {
        ctx.fillRect(drawX + 25, drawY + 40, 10, 5); // straight line
    } else if (pet.state === 'eating') {
        ctx.fillStyle = 'red';
        ctx.fillRect(drawX + 20, drawY + 35, 20, 15); // open mouth
    } else if (pet.happiness > 50) {
        // Smile
        ctx.fillStyle = 'black';
        ctx.fillRect(drawX + 20, drawY + 40, 20, 5);
        ctx.fillRect(drawX + 15, drawY + 35, 5, 5);
        ctx.fillRect(drawX + 40, drawY + 35, 5, 5);
    } else {
        // Sad
        ctx.fillStyle = 'black';
        ctx.fillRect(drawX + 20, drawY + 40, 20, 5);
        ctx.fillRect(drawX + 15, drawY + 45, 5, 5);
        ctx.fillRect(drawX + 40, drawY + 45, 5, 5);
    }

    // Status text above head
    ctx.fillStyle = 'black';
    ctx.font = '16px "Courier New"';
    ctx.textAlign = 'center';

    let statusText = '';
    if (!pet.isAlive) statusText = 'X_X';
    else if (pet.state === 'sleeping') statusText = 'Zzz...';
    else if (pet.state === 'eating') statusText = 'Yum!';
    else if (pet.state === 'playing') statusText = 'Yay!';
    else if (pet.hunger > 70) statusText = 'Hungry...';
    else if (pet.happiness < 30) statusText = 'Sad...';

    if (statusText) {
        ctx.fillText(statusText, pet.x, drawY - 10);
    }
}

// Main Game Loop
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Animation framing
    frameTimer += deltaTime;
    if (frameTimer >= frameInterval) {
        pet.frame++;
        frameTimer = 0;
    }

    updateStats(deltaTime);
    drawPet();

    requestAnimationFrame(gameLoop);
}

// Start game
init();
