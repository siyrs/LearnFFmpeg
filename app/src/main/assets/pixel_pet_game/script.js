const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet stats
let hunger = 100;
let happiness = 100;
let energy = 100;

// State flags
let isSleeping = false;
let messageTimeout = null;

// Pet visual properties
const pixelSize = 10;
const petColor = '#3498db'; // Default color
const deadColor = '#7f8c8d';

// A simple 8x8 pixel art cat design (1=color, 0=transparent, 2=black, 3=white)
const catSpriteDefault = [
    [0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1],
    [1,2,1,1,1,1,2,1],
    [1,1,1,3,3,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,0,0,1,1,0],
    [0,1,1,0,0,1,1,0]
];

const catSpriteSleep = [
    [0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,2,2,3,3,2,2,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,0,0,1,1,0],
    [0,1,1,0,0,1,1,0]
];

const catSpriteDead = [
    [0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1],
    [1,2,1,1,1,1,2,1],
    [1,1,1,3,3,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,0,0,1,1,0],
    [0,0,0,0,0,0,0,0]
]; // Eyes X'd out ideally, but simple for now

// UI Elements
const hungerBar = document.getElementById('hunger-bar');
const happinessBar = document.getElementById('happiness-bar');
const energyBar = document.getElementById('energy-bar');
const msgEl = document.getElementById('message');
const btnFeed = document.getElementById('btn-feed');
const btnPlay = document.getElementById('btn-play');
const btnSleep = document.getElementById('btn-sleep');

function init() {
    // Game loop
    setInterval(gameLoop, 1000); // Update every second
    requestAnimationFrame(render);

    // Event listeners
    btnFeed.addEventListener('click', feed);
    btnPlay.addEventListener('click', play);
    btnSleep.addEventListener('click', toggleSleep);
}

function gameLoop() {
    if (hunger <= 0 || happiness <= 0 || energy <= 0) {
        showMessage("Pet has passed away...");
        disableControls();
        render(); // Force render to show dead state
        return; // Stop updating stats
    }

    if (isSleeping) {
        energy = Math.min(100, energy + 10);
        hunger = Math.max(0, hunger - 1); // Decrease slower while sleeping
        happiness = Math.max(0, happiness - 1);

        if (energy >= 100) {
            isSleeping = false;
            showMessage("Pet woke up!");
            btnSleep.textContent = "Sleep";
        }
    } else {
        hunger = Math.max(0, hunger - 3);
        happiness = Math.max(0, happiness - 2);
        energy = Math.max(0, energy - 1);
    }

    updateUI();
}

function updateUI() {
    hungerBar.style.width = hunger + '%';
    happinessBar.style.width = happiness + '%';
    energyBar.style.width = energy + '%';

    // Change bar color if low
    hungerBar.style.backgroundColor = hunger < 30 ? '#c0392b' : '#e74c3c';
    happinessBar.style.backgroundColor = happiness < 30 ? '#f39c12' : '#f1c40f';
    energyBar.style.backgroundColor = energy < 30 ? '#2980b9' : '#3498db';
}

function feed() {
    if (isSleeping || isDead()) return;
    hunger = Math.min(100, hunger + 20);
    showMessage("Yum!");
    updateUI();
}

function play() {
    if (isSleeping || isDead()) return;
    if (energy < 20) {
        showMessage("Too tired to play...");
        return;
    }
    happiness = Math.min(100, happiness + 20);
    energy = Math.max(0, energy - 15);
    showMessage("Yay!");
    updateUI();
}

function toggleSleep() {
    if (isDead()) return;
    isSleeping = !isSleeping;
    if (isSleeping) {
        showMessage("Zzz...");
        btnSleep.textContent = "Wake";
    } else {
        showMessage("Woke up!");
        btnSleep.textContent = "Sleep";
    }
}

function isDead() {
    return hunger <= 0 || happiness <= 0 || energy <= 0;
}

function disableControls() {
    btnFeed.disabled = true;
    btnPlay.disabled = true;
    btnSleep.disabled = true;
}

function showMessage(msg) {
    msgEl.textContent = msg;
    if (messageTimeout) clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
        if (msgEl.textContent === msg && !isDead() && !isSleeping) {
            msgEl.textContent = "";
        }
    }, 2000);
}

function drawSprite(sprite, xOff, yOff, mainColor) {
    for (let y = 0; y < sprite.length; y++) {
        for (let x = 0; x < sprite[y].length; x++) {
            let val = sprite[y][x];
            if (val === 0) continue; // transparent

            if (val === 1) ctx.fillStyle = mainColor;
            else if (val === 2) ctx.fillStyle = '#000000'; // black
            else if (val === 3) ctx.fillStyle = '#ffffff'; // white

            ctx.fillRect(xOff + x * pixelSize, yOff + y * pixelSize, pixelSize, pixelSize);
        }
    }
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let spriteToDraw = catSpriteDefault;
    let currentColor = petColor;

    // Simple bobbing animation
    let yOffset = 0;

    if (isDead()) {
        spriteToDraw = catSpriteDead;
        currentColor = deadColor;
        yOffset = 20; // Lying down
    } else if (isSleeping) {
        spriteToDraw = catSpriteSleep;
        yOffset = 10; // Lying down
    } else {
        // Bob up and down based on time
        yOffset = Math.sin(Date.now() / 300) * 5;
    }

    // Center the sprite (8 pixels wide/high * 10 pixelSize = 80px)
    let startX = (canvas.width - (8 * pixelSize)) / 2;
    let startY = (canvas.height - (8 * pixelSize)) / 2 + yOffset;

    drawSprite(spriteToDraw, startX, startY, currentColor);

    requestAnimationFrame(render);
}

// Start game
init();