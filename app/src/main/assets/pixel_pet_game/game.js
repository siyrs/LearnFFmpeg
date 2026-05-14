const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const hungerValEl = document.getElementById('hunger-val');
const happinessValEl = document.getElementById('happiness-val');

// Game state
let hunger = 100;
let happiness = 100;
let petX = canvas.width / 2;
let petY = canvas.height / 2 + 50;
let petDirection = 1; // 1 for right, -1 for left
let bounce = 0;
let frameCount = 0;

// Update UI
function updateUI() {
    hungerValEl.textContent = Math.max(0, Math.round(hunger));
    happinessValEl.textContent = Math.max(0, Math.round(happiness));
}

// Draw the pet (a simple pixelated slime/blob)
function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#654321'; // Brown dirt
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    ctx.fillStyle = '#228B22'; // Green grass
    ctx.fillRect(0, canvas.height - 40, canvas.width, 10);

    // Pet size and bounce animation
    const petWidth = 40;
    const petHeight = 30 + Math.sin(bounce) * 5;
    const currentPetY = petY - Math.sin(bounce) * 5;

    ctx.save();
    ctx.translate(petX, currentPetY);

    // Body
    ctx.fillStyle = (hunger < 30 || happiness < 30) ? '#ff6b6b' : '#4ecdc4'; // Red if sad/hungry, cyan if happy
    ctx.fillRect(-petWidth / 2, -petHeight, petWidth, petHeight);

    // Eyes
    ctx.fillStyle = 'white';
    // Eye positions based on direction
    const eyeOffsetX = 5 * petDirection;
    ctx.fillRect(-10 + eyeOffsetX, -petHeight + 10, 8, 8);
    ctx.fillRect(2 + eyeOffsetX, -petHeight + 10, 8, 8);

    // Pupils
    ctx.fillStyle = 'black';
    ctx.fillRect(-8 + eyeOffsetX, -petHeight + 12, 4, 4);
    ctx.fillRect(4 + eyeOffsetX, -petHeight + 12, 4, 4);

    ctx.restore();
}

// Game loop
function update() {
    frameCount++;

    // Stats decay
    hunger -= 0.05;
    happiness -= 0.03;

    // Movement and animation
    if (hunger > 0 && happiness > 0) {
        bounce += 0.1;

        // Randomly change direction
        if (Math.random() < 0.02) {
            petDirection *= -1;
        }

        // Move
        petX += 0.5 * petDirection;

        // Keep in bounds
        if (petX < 20) {
            petX = 20;
            petDirection = 1;
        } else if (petX > canvas.width - 20) {
            petX = canvas.width - 20;
            petDirection = -1;
        }
    }

    // Clamp stats
    if (hunger < 0) hunger = 0;
    if (happiness < 0) happiness = 0;
    if (hunger > 100) hunger = 100;
    if (happiness > 100) happiness = 100;

    updateUI();
    drawPet();

    requestAnimationFrame(update);
}

// Controls
document.getElementById('feed-btn').addEventListener('click', () => {
    hunger += 20;
    if (hunger > 100) hunger = 100;
    updateUI();
});

document.getElementById('play-btn').addEventListener('click', () => {
    happiness += 20;
    if (happiness > 100) happiness = 100;
    updateUI();
});

// Start game
update();
