const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const hungerDisplay = document.getElementById('hungerDisplay');
const happinessDisplay = document.getElementById('happinessDisplay');

const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

// Pet State
let pet = {
    x: 150,
    y: 150,
    size: 40, // Represents the core body size
    color: '#f1c40f',
    hunger: 0,      // 0 = full, 100 = starving
    happiness: 100, // 100 = very happy, 0 = depressed
    state: 'idle',  // idle, eating, playing
    frame: 0
};

// Simple pixel-art representation using a 5x5 grid relative to size
// 0: empty, 1: body, 2: eye, 3: mouth
const sprites = {
    idle_1: [
        [0, 1, 1, 1, 0],
        [1, 2, 1, 2, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 3, 0, 1],
        [0, 1, 0, 1, 0]
    ],
    idle_2: [
        [0, 1, 1, 1, 0],
        [1, 2, 1, 2, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 3, 0, 1],
        [1, 0, 0, 0, 1]
    ],
    eating: [
        [0, 1, 1, 1, 0],
        [1, 2, 1, 2, 1],
        [1, 1, 1, 1, 1],
        [1, 3, 3, 3, 1],
        [0, 1, 0, 1, 0]
    ],
    playing: [
        [1, 1, 1, 1, 1],
        [1, 2, 1, 2, 1],
        [1, 1, 1, 1, 1],
        [1, 3, 0, 3, 1],
        [1, 1, 0, 1, 1]
    ]
};

function drawSprite(spriteMatrix, x, y, size, color) {
    const pixelSize = size / 5;
    const startX = x - size / 2;
    const startY = y - size / 2;

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const val = spriteMatrix[row][col];
            if (val !== 0) {
                if (val === 1) {
                    ctx.fillStyle = color;
                } else if (val === 2) {
                    ctx.fillStyle = '#2c3e50'; // Eye color
                } else if (val === 3) {
                    ctx.fillStyle = '#c0392b'; // Mouth color
                }
                ctx.fillRect(startX + col * pixelSize, startY + row * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

let lastTime = 0;
const animationSpeed = 500; // ms per frame

function update(time) {
    if (time - lastTime > animationSpeed) {
        pet.frame = (pet.frame + 1) % 2;

        // Random wandering if idle
        if (pet.state === 'idle') {
            pet.x += (Math.random() - 0.5) * 10;
            pet.y += (Math.random() - 0.5) * 10;

            // Keep within bounds
            pet.x = Math.max(pet.size/2, Math.min(canvas.width - pet.size/2, pet.x));
            pet.y = Math.max(pet.size/2, Math.min(canvas.height - pet.size/2, pet.y));
        }

        // Needs decay over time
        if (Math.random() < 0.1) {
            pet.hunger = Math.min(100, pet.hunger + 1);
        }
        if (Math.random() < 0.1) {
            pet.happiness = Math.max(0, pet.happiness - 1);
        }

        // Update displays
        hungerDisplay.textContent = Math.floor(pet.hunger);
        happinessDisplay.textContent = Math.floor(pet.happiness);

        lastTime = time;
    }

    // Change color based on happiness/hunger
    if (pet.hunger > 80 || pet.happiness < 20) {
        pet.color = '#e74c3c'; // Red-ish if unhappy/hungry
    } else {
        pet.color = '#f1c40f'; // Normal yellow
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw simple background
    ctx.fillStyle = '#a2d9ce';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // Determine which sprite to draw
    let currentSprite;
    if (pet.state === 'eating') {
        currentSprite = sprites.eating;
    } else if (pet.state === 'playing') {
        currentSprite = sprites.playing;
    } else {
        currentSprite = pet.frame === 0 ? sprites.idle_1 : sprites.idle_2;
    }

    drawSprite(currentSprite, pet.x, pet.y, pet.size, pet.color);
}

function gameLoop(time) {
    update(time);
    draw();
    requestAnimationFrame(gameLoop);
}

// Controls
feedBtn.addEventListener('click', () => {
    pet.state = 'eating';
    pet.hunger = Math.max(0, pet.hunger - 20);
    setTimeout(() => { pet.state = 'idle'; }, 1000);
});

playBtn.addEventListener('click', () => {
    pet.state = 'playing';
    pet.happiness = Math.min(100, pet.happiness + 20);
    setTimeout(() => { pet.state = 'idle'; }, 1000);
});

// Start game
requestAnimationFrame(gameLoop);
