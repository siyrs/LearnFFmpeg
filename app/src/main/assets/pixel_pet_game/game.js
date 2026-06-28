const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet State
let pet = {
    x: 150,
    y: 200,
    width: 40,
    height: 40,
    color: '#f1c40f', // Yellow
    eyeColor: '#000',
    hunger: 100,
    happiness: 100,
    energy: 100,
    state: 'idle', // idle, eating, playing, sleeping
    frame: 0
};

// UI Elements
const hungerEl = document.getElementById('hunger');
const happinessEl = document.getElementById('happiness');
const energyEl = document.getElementById('energy');
const messageEl = document.getElementById('message');

// Update UI
function updateStats() {
    hungerEl.textContent = Math.max(0, Math.round(pet.hunger));
    happinessEl.textContent = Math.max(0, Math.round(pet.happiness));
    energyEl.textContent = Math.max(0, Math.round(pet.energy));

    // Warning colors
    hungerEl.style.color = pet.hunger < 30 ? '#e74c3c' : '#ecf0f1';
    happinessEl.style.color = pet.happiness < 30 ? '#e74c3c' : '#ecf0f1';
    energyEl.style.color = pet.energy < 30 ? '#e74c3c' : '#ecf0f1';
}

function showMessage(msg) {
    messageEl.textContent = msg;
    setTimeout(() => {
        if (messageEl.textContent === msg) {
            messageEl.textContent = '';
        }
    }, 2000);
}

// Drawing Functions
function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#2ecc71'; // Green grass
    ctx.fillRect(0, 240, canvas.width, 60);

    // Bounce animation
    let yOffset = 0;
    if (pet.state === 'idle' || pet.state === 'eating' || pet.state === 'playing') {
        yOffset = (pet.frame % 20 < 10) ? -2 : 0;
    }

    let drawY = pet.y + yOffset;

    if (pet.state === 'sleeping') {
        // Draw sleeping pet (flat)
        ctx.fillStyle = pet.color;
        ctx.fillRect(pet.x - 10, 240 - 20, pet.width + 20, 20);
        // Eyes closed
        ctx.fillStyle = pet.eyeColor;
        ctx.fillRect(pet.x, 240 - 15, 8, 2);
        ctx.fillRect(pet.x + 20, 240 - 15, 8, 2);

        // Zzz
        if (pet.frame % 60 < 30) {
            ctx.fillStyle = '#fff';
            ctx.font = '20px Courier';
            ctx.fillText('Z', pet.x + 30, drawY - 20);
        } else {
            ctx.fillStyle = '#fff';
            ctx.font = '15px Courier';
            ctx.fillText('z', pet.x + 25, drawY - 10);
        }
        return;
    }

    // Body
    ctx.fillStyle = pet.color;
    ctx.fillRect(pet.x, drawY, pet.width, pet.height);

    // Eyes
    ctx.fillStyle = pet.eyeColor;
    if (pet.happiness < 30) {
        // Sad eyes
        ctx.fillRect(pet.x + 5, drawY + 10, 8, 4);
        ctx.fillRect(pet.x + 25, drawY + 10, 8, 4);
    } else {
        // Normal eyes
        ctx.fillRect(pet.x + 5, drawY + 10, 8, 8);
        ctx.fillRect(pet.x + 25, drawY + 10, 8, 8);
    }

    // Mouth
    ctx.fillStyle = '#000';
    if (pet.state === 'eating') {
        ctx.fillRect(pet.x + 15, drawY + 25, 10, 10); // Open mouth

        // Food particle
        if (pet.frame % 10 < 5) {
            ctx.fillStyle = '#e67e22'; // Orange food
            ctx.fillRect(pet.x + 18, drawY + 28, 4, 4);
        }
    } else if (pet.happiness > 70) {
        // Smile
        ctx.fillRect(pet.x + 10, drawY + 25, 4, 4);
        ctx.fillRect(pet.x + 14, drawY + 29, 12, 4);
        ctx.fillRect(pet.x + 26, drawY + 25, 4, 4);
    } else {
        // Straight face
        ctx.fillRect(pet.x + 12, drawY + 27, 16, 4);
    }
}

// Game Loop
function gameLoop() {
    pet.frame++;

    // Decay stats slowly over time
    if (pet.frame % 60 === 0) { // roughly every second at 60fps
        if (pet.state !== 'sleeping') {
            pet.hunger -= 0.5;
            pet.energy -= 0.2;
            pet.happiness -= 0.3;
        } else {
            pet.energy += 2;
            pet.hunger -= 0.2;
            if (pet.energy >= 100) {
                pet.energy = 100;
                pet.state = 'idle';
                showMessage("Pet woke up!");
            }
        }

        // Boundaries
        pet.hunger = Math.max(0, Math.min(100, pet.hunger));
        pet.happiness = Math.max(0, Math.min(100, pet.happiness));
        pet.energy = Math.max(0, Math.min(100, pet.energy));

        updateStats();

        // Check for death/sadness
        if (pet.hunger <= 0) {
             showMessage("Pet is starving!");
        }
    }

    drawPet();
    requestAnimationFrame(gameLoop);
}

// Controls
document.getElementById('btn-feed').addEventListener('click', () => {
    if (pet.state === 'sleeping') return showMessage("Pet is sleeping.");
    if (pet.hunger >= 100) return showMessage("Pet is full!");

    pet.state = 'eating';
    pet.hunger += 20;
    pet.happiness += 5;
    showMessage("Yum!");

    setTimeout(() => {
        if(pet.state === 'eating') pet.state = 'idle';
        updateStats();
    }, 1500);
});

document.getElementById('btn-play').addEventListener('click', () => {
    if (pet.state === 'sleeping') return showMessage("Pet is sleeping.");
    if (pet.energy < 20) return showMessage("Too tired to play.");
    if (pet.hunger < 20) return showMessage("Too hungry to play.");

    pet.state = 'playing';
    pet.happiness += 20;
    pet.energy -= 15;
    pet.hunger -= 10;
    showMessage("Wheee!");

    // Simple jump animation simulation
    let jumpCount = 0;
    let jumpInterval = setInterval(() => {
        if (jumpCount % 2 === 0) pet.y -= 20;
        else pet.y += 20;
        jumpCount++;
        if (jumpCount >= 6) {
            clearInterval(jumpInterval);
            pet.y = 200; // reset y
            pet.state = 'idle';
            updateStats();
        }
    }, 200);
});

document.getElementById('btn-sleep').addEventListener('click', () => {
    if (pet.state === 'sleeping') {
        pet.state = 'idle';
        showMessage("Pet woke up early.");
    } else {
        pet.state = 'sleeping';
        showMessage("Goodnight...");
    }
});

// Init
updateStats();
requestAnimationFrame(gameLoop);