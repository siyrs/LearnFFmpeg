const canvas = document.getElementById('pet-canvas');
const ctx = canvas.getContext('2d');

// Game State
let stats = {
    hunger: 50,
    happiness: 50,
    energy: 100
};

let currentState = 'idle'; // idle, eating, playing, resting
let frameCounter = 0;
let lastTime = 0;

// Colors
const colors = {
    0: null, // Transparent
    1: '#000000', // Outline
    2: '#ffcc99', // Body main
    3: '#ff9966', // Body dark
    4: '#ffffff', // Eye white
    5: '#ff0000', // Heart/accessories
};

// 10x10 Pixel Art Matrices
const sprites = {
    idle_1: [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,2,2,2,2,2,2,1,0],
        [1,2,4,4,2,2,4,4,2,1],
        [1,2,4,1,2,2,4,1,2,1],
        [1,2,2,2,2,2,2,2,2,1],
        [1,3,3,1,1,1,1,3,3,1],
        [0,1,2,2,2,2,2,2,1,0],
        [0,0,1,2,1,1,2,1,0,0],
        [0,0,1,1,0,0,1,1,0,0]
    ],
    idle_2: [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,2,2,2,2,2,2,1,0],
        [1,2,4,4,2,2,4,4,2,1],
        [1,2,4,1,2,2,4,1,2,1],
        [1,2,2,2,2,2,2,2,2,1],
        [1,3,3,1,1,1,1,3,3,1],
        [0,1,2,2,1,1,2,2,1,0],
        [0,1,1,1,0,0,1,1,1,0]
    ],
    eating: [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,2,2,2,2,2,2,1,0],
        [1,2,1,1,2,2,1,1,2,1],
        [1,2,2,2,2,2,2,2,2,1],
        [1,3,3,1,0,0,1,3,3,1],
        [1,2,2,2,1,1,2,2,2,1],
        [0,1,2,2,2,2,2,2,1,0],
        [0,0,1,2,1,1,2,1,0,0],
        [0,0,1,1,0,0,1,1,0,0]
    ],
    playing: [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,2,2,2,2,2,2,1,0],
        [1,2,1,4,2,2,4,1,2,1],
        [1,2,4,1,2,2,1,4,2,1],
        [1,2,2,2,2,2,2,2,2,1],
        [1,3,3,1,1,1,1,3,3,1],
        [0,1,2,2,2,2,2,2,1,0],
        [0,0,1,2,1,1,2,1,0,0],
        [0,0,1,1,0,0,1,1,0,0]
    ],
    sleeping_1: [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,2,2,2,2,2,2,1,0],
        [1,2,1,1,2,2,1,1,2,1],
        [1,2,2,2,2,2,2,2,2,1],
        [1,3,3,2,1,1,2,3,3,1],
        [0,1,2,2,2,2,2,2,1,0],
        [0,0,1,2,1,1,2,1,0,0],
        [0,0,1,1,0,0,1,1,0,0]
    ],
    sleeping_2: [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,1,2,2,2,2,2,2,1,0],
        [1,2,1,1,2,2,1,1,2,1],
        [1,2,2,2,2,2,2,2,2,1],
        [1,3,3,2,1,1,2,3,3,1],
        [0,1,2,2,1,1,2,2,1,0],
        [0,1,1,1,0,0,1,1,1,0]
    ]
};

const pixelSize = canvas.width / 10;

function drawSprite(matrix) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const colorCode = matrix[y][x];
            if (colorCode !== 0) {
                ctx.fillStyle = colors[colorCode];
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

function updateUI() {
    document.getElementById('hunger-bar').style.width = stats.hunger + '%';
    document.getElementById('happiness-bar').style.width = stats.happiness + '%';
    document.getElementById('energy-bar').style.width = stats.energy + '%';
}

function showMessage(msg) {
    document.getElementById('message').innerText = msg;
}

// Game Loop
function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;

    // Animation
    if (deltaTime > 500) { // Update frame every 500ms
        frameCounter++;
        let currentSprite;

        switch (currentState) {
            case 'eating':
                currentSprite = frameCounter % 2 === 0 ? sprites.eating : sprites.idle_1;
                break;
            case 'playing':
                currentSprite = frameCounter % 2 === 0 ? sprites.playing : sprites.idle_2;
                break;
            case 'resting':
                currentSprite = frameCounter % 2 === 0 ? sprites.sleeping_1 : sprites.sleeping_2;
                break;
            default: // idle
                currentSprite = frameCounter % 2 === 0 ? sprites.idle_1 : sprites.idle_2;
        }

        drawSprite(currentSprite);
        lastTime = timestamp;
    }

    requestAnimationFrame(gameLoop);
}

// Simulation Tick
setInterval(() => {
    if (currentState === 'resting') {
        stats.energy = Math.min(100, stats.energy + 5);
        stats.hunger = Math.max(0, stats.hunger - 1);
    } else {
        stats.hunger = Math.max(0, stats.hunger - 2);
        stats.happiness = Math.max(0, stats.happiness - 1);
        stats.energy = Math.max(0, stats.energy - 1);
    }

    if (stats.hunger < 20) showMessage("I'm hungry...");
    else if (stats.energy < 20) showMessage("I'm tired...");
    else if (stats.happiness < 20) showMessage("I'm bored...");
    else if (currentState === 'idle') showMessage("");

    updateUI();
}, 2000); // Every 2 seconds

// Actions
document.getElementById('btn-feed').addEventListener('click', () => {
    if (currentState !== 'idle') return;
    stats.hunger = Math.min(100, stats.hunger + 30);
    stats.energy = Math.min(100, stats.energy + 5);
    currentState = 'eating';
    showMessage("Yummy!");
    updateUI();
    setTimeout(() => { currentState = 'idle'; showMessage(""); }, 2000);
});

document.getElementById('btn-play').addEventListener('click', () => {
    if (currentState !== 'idle') return;
    if (stats.energy < 15) {
        showMessage("Too tired to play...");
        return;
    }
    stats.happiness = Math.min(100, stats.happiness + 20);
    stats.energy = Math.max(0, stats.energy - 15);
    stats.hunger = Math.max(0, stats.hunger - 5);
    currentState = 'playing';
    showMessage("Wheee!");
    updateUI();
    setTimeout(() => { currentState = 'idle'; showMessage(""); }, 2000);
});

document.getElementById('btn-rest').addEventListener('click', () => {
    if (currentState === 'resting') {
        currentState = 'idle';
        showMessage("Woke up!");
        document.getElementById('btn-rest').innerText = 'Rest';
    } else {
        currentState = 'resting';
        showMessage("Zzz...");
        document.getElementById('btn-rest').innerText = 'Wake Up';
    }
    updateUI();
});

// Init
updateUI();
requestAnimationFrame(gameLoop);
