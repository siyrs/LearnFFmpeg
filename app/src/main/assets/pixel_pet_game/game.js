const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet State
let pet = {
    x: 150,
    y: 150,
    size: 40,
    color: '#FFD700', // Gold color for the pet
    state: 'idle', // idle, eating, playing, sleeping
    hunger: 50,
    happiness: 50,
    energy: 100,
    frame: 0,
    tick: 0
};

// UI Elements
const hungerValueSpan = document.getElementById('hungerValue');
const happinessValueSpan = document.getElementById('happinessValue');
const energyValueSpan = document.getElementById('energyValue');

// Constants
const MAX_STAT = 100;
const MIN_STAT = 0;

// Game Loop
function update() {
    pet.tick++;

    // Animate sprite
    if (pet.tick % 30 === 0) {
        pet.frame = (pet.frame + 1) % 2;
    }

    // Natural stat decay over time
    if (pet.tick % 300 === 0) { // Every ~5 seconds at 60fps
        if (pet.state !== 'sleeping') {
            pet.hunger = Math.max(MIN_STAT, pet.hunger - 2);
            pet.happiness = Math.max(MIN_STAT, pet.happiness - 1);
            pet.energy = Math.max(MIN_STAT, pet.energy - 1);
        } else {
            // Recover energy while sleeping
            pet.energy = Math.min(MAX_STAT, pet.energy + 5);
            pet.hunger = Math.max(MIN_STAT, pet.hunger - 1);

            // Wake up if fully rested
            if (pet.energy >= MAX_STAT) {
                pet.state = 'idle';
            }
        }
        updateUI();
    }

    // Return to idle state after an action
    if (pet.state !== 'idle' && pet.state !== 'sleeping' && pet.tick % 120 === 0) {
        pet.state = 'idle';
    }
}

function drawPet() {
    ctx.save();
    ctx.translate(pet.x, pet.y);

    // Bobbing animation if idle or playing
    let bob = 0;
    if (pet.state === 'idle' || pet.state === 'playing') {
        bob = (pet.frame === 0) ? 0 : 5;
    }

    // Sleep effect (shrink/grow slightly)
    if (pet.state === 'sleeping') {
        let scale = 1 + (Math.sin(pet.tick * 0.05) * 0.05);
        ctx.scale(scale, scale);
    }

    // Draw body
    ctx.fillStyle = (pet.state === 'sleeping') ? '#A9A9A9' : pet.color; // Gray if sleeping
    ctx.fillRect(-pet.size/2, -pet.size/2 + bob, pet.size, pet.size);

    // Eyes
    ctx.fillStyle = '#000';
    let eyeY = -pet.size/4 + bob;

    if (pet.state === 'sleeping') {
        // Sleepy eyes (lines)
        ctx.fillRect(-pet.size/4 - 2, eyeY, 8, 2);
        ctx.fillRect(pet.size/4 - 6, eyeY, 8, 2);
    } else if (pet.state === 'eating') {
        // Happy eyes
        ctx.beginPath();
        ctx.arc(-pet.size/4 + 2, eyeY, 3, Math.PI, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(pet.size/4 - 2, eyeY, 3, Math.PI, 0);
        ctx.stroke();
    } else {
        // Normal eyes
        ctx.fillRect(-pet.size/4, eyeY, 4, 4);
        ctx.fillRect(pet.size/4 - 4, eyeY, 4, 4);
    }

    // Mouth
    if (pet.state === 'eating') {
        // Open mouth
        ctx.fillRect(-4, bob + 4, 8, 6);
    } else if (pet.state === 'sleeping') {
        // Zzz
        ctx.font = '16px monospace';
        ctx.fillStyle = '#333';
        let zZzText = (pet.tick % 60 < 20) ? 'z' : (pet.tick % 60 < 40) ? 'zZ' : 'zZz';
        ctx.fillText(zZzText, pet.size/2, -pet.size/2);
    } else if (pet.happiness > 50) {
        // Smile
        ctx.fillRect(-6, bob + 8, 12, 2);
        ctx.fillRect(-8, bob + 6, 2, 2);
        ctx.fillRect(6, bob + 6, 2, 2);
    } else {
        // Sad face
        ctx.fillRect(-6, bob + 8, 12, 2);
        ctx.fillRect(-8, bob + 10, 2, 2);
        ctx.fillRect(6, bob + 10, 2, 2);
    }

    ctx.restore();

    // Draw food if eating
    if (pet.state === 'eating') {
        ctx.fillStyle = '#8B4513'; // Brown food pellet
        ctx.fillRect(pet.x - 4, pet.y + 15, 8, 8);
    }

    // Draw toy if playing
    if (pet.state === 'playing') {
        ctx.fillStyle = '#FF4500'; // Red ball
        let ballX = pet.x + 30 + Math.sin(pet.tick * 0.1) * 20;
        let ballY = pet.y + Math.abs(Math.cos(pet.tick * 0.1)) * 20;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawBackground() {
    // Grass
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, 200, 300, 100);

    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(40, 40, 20, 0, Math.PI * 2);
    ctx.fill();

    // Clouds
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(200, 50, 40, 15);
    ctx.fillRect(210, 40, 20, 15);
    ctx.fillRect(100, 80, 50, 20);
    ctx.fillRect(115, 70, 20, 20);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pet.state === 'sleeping') {
        // Night sky
        ctx.fillStyle = '#191970'; // Midnight blue
        ctx.fillRect(0, 0, 300, 300);

        // Moon
        ctx.fillStyle = '#F0F8FF';
        ctx.beginPath();
        ctx.arc(40, 40, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#191970';
        ctx.beginPath();
        ctx.arc(45, 35, 18, 0, Math.PI * 2);
        ctx.fill();

        // Ground at night
        ctx.fillStyle = '#2E8B57';
        ctx.fillRect(0, 200, 300, 100);
    } else {
        drawBackground();
    }

    drawPet();
}

function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}

function updateUI() {
    hungerValueSpan.innerText = pet.hunger;
    happinessValueSpan.innerText = pet.happiness;
    energyValueSpan.innerText = pet.energy;

    // Change color based on stats
    hungerValueSpan.style.color = pet.hunger < 30 ? 'red' : 'white';
    happinessValueSpan.style.color = pet.happiness < 30 ? 'red' : 'white';
    energyValueSpan.style.color = pet.energy < 30 ? 'red' : 'white';
}

// Interaction
document.getElementById('feedBtn').addEventListener('click', () => {
    if (pet.state !== 'sleeping') {
        pet.state = 'eating';
        pet.hunger = Math.min(MAX_STAT, pet.hunger + 15);
        pet.energy = Math.min(MAX_STAT, pet.energy + 5);
        pet.tick = 0; // reset animation tick for immediate feedback
        updateUI();
    }
});

document.getElementById('playBtn').addEventListener('click', () => {
    if (pet.state !== 'sleeping' && pet.energy > 10) {
        pet.state = 'playing';
        pet.happiness = Math.min(MAX_STAT, pet.happiness + 15);
        pet.energy = Math.max(MIN_STAT, pet.energy - 10);
        pet.hunger = Math.max(MIN_STAT, pet.hunger - 5);
        pet.tick = 0;
        updateUI();
    }
});

document.getElementById('sleepBtn').addEventListener('click', () => {
    if (pet.state === 'sleeping') {
        // Wake up manually
        pet.state = 'idle';
    } else {
        pet.state = 'sleeping';
    }
});

// Start game
updateUI();
requestAnimationFrame(loop);
