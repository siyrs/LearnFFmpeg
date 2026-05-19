const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

// Game state
let hunger = 50;
let happiness = 50;
let petX = 100;
let petY = 150;
let frameCount = 0;
let isAnimating = false;
let animationType = '';
let animationTimer = 0;

// Pet drawing function (simple pixel art style)
function drawPet(x, y, state) {
    ctx.fillStyle = '#FFD700'; // Gold color

    // Body
    ctx.fillRect(x - 15, y - 15, 30, 20);

    // Head
    ctx.fillRect(x - 10, y - 25, 20, 15);

    // Eyes
    ctx.fillStyle = '#000';
    if (state === 'happy') {
        ctx.fillRect(x - 5, y - 20, 2, 2);
        ctx.fillRect(x + 3, y - 20, 2, 2);
    } else if (state === 'sad') {
        ctx.fillRect(x - 5, y - 18, 2, 2);
        ctx.fillRect(x + 3, y - 18, 2, 2);
    } else {
        ctx.fillRect(x - 5, y - 19, 2, 2);
        ctx.fillRect(x + 3, y - 19, 2, 2);
    }

    // Mouth
    if (state === 'happy') {
        ctx.fillRect(x - 2, y - 14, 4, 2);
    } else if (state === 'sad') {
        ctx.fillRect(x - 2, y - 16, 4, 2);
    } else {
        ctx.fillRect(x - 2, y - 15, 4, 1);
    }

    // Legs
    ctx.fillStyle = '#DAA520'; // Darker gold
    if (frameCount % 60 < 30 || state === 'idle') {
        ctx.fillRect(x - 10, y + 5, 5, 10);
        ctx.fillRect(x + 5, y + 5, 5, 10);
    } else {
        ctx.fillRect(x - 12, y + 5, 5, 8);
        ctx.fillRect(x + 7, y + 5, 5, 8);
    }
}

function updateStatus() {
    statusDiv.textContent = \`Hunger: \${hunger} | Happiness: \${happiness}\`;
}

function update() {
    frameCount++;

    // Natural decay
    if (frameCount % 120 === 0) { // Every ~2 seconds
        hunger = Math.max(0, hunger - 1);
        happiness = Math.max(0, happiness - 1);
        updateStatus();
    }

    // Handle animations
    if (isAnimating) {
        animationTimer--;
        if (animationTimer <= 0) {
            isAnimating = false;
            animationType = '';
        }

        if (animationType === 'feed') {
            petY = 150 - Math.sin(animationTimer * 0.2) * 10;
        } else if (animationType === 'play') {
            petX = 100 + Math.sin(animationTimer * 0.2) * 20;
        }
    } else {
        // Return to center
        petX += (100 - petX) * 0.1;
        petY += (150 - petY) * 0.1;
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background (clouds, sun, etc could go here)

    // Determine state
    let state = 'idle';
    if (happiness > 70 && hunger > 30) state = 'happy';
    if (happiness < 30 || hunger < 30) state = 'sad';
    if (isAnimating) state = 'happy';

    drawPet(petX, petY, state);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Controls
feedBtn.addEventListener('click', () => {
    hunger = Math.min(100, hunger + 15);
    isAnimating = true;
    animationType = 'feed';
    animationTimer = 30;
    updateStatus();
});

playBtn.addEventListener('click', () => {
    happiness = Math.min(100, happiness + 15);
    hunger = Math.max(0, Math.floor(hunger - 5)); // Playing makes pet hungry
    isAnimating = true;
    animationType = 'play';
    animationTimer = 45;
    updateStatus();
});

// Start game
updateStatus();
gameLoop();
