const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const hungerDisplay = document.getElementById('hungerDisplay');
const happinessDisplay = document.getElementById('happinessDisplay');

const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

let lastTime = 0;
const TICK_RATE = 1000; // 1 second per tick
let timeAccumulator = 0;

const pet = {
    x: 150,
    y: 150,
    size: 20,
    hunger: 0,
    happiness: 100,
    state: 'idle', // idle, eating, playing, sad
    color: '#f1c40f',

    update: function() {
        // Increase hunger over time
        this.hunger += 1;
        if (this.hunger > 100) this.hunger = 100;

        // Decrease happiness over time
        this.happiness -= 1;
        if (this.happiness < 0) this.happiness = 0;

        if (this.hunger > 70 || this.happiness < 30) {
            this.state = 'sad';
            this.color = '#3498db'; // blue
        } else if (this.state === 'sad') {
            this.state = 'idle';
            this.color = '#f1c40f'; // yellow
        }
    },

    draw: function(ctx) {
        // Draw body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);

        // Draw eyes
        ctx.fillStyle = 'black';
        let eyeOffsetY = -5;
        if (this.state === 'sad') {
             eyeOffsetY = 0;
        }
        ctx.fillRect(this.x - 10, this.y + eyeOffsetY, 5, 5);
        ctx.fillRect(this.x + 5, this.y + eyeOffsetY, 5, 5);

        // Draw mouth
        if (this.state === 'sad') {
            ctx.fillRect(this.x - 5, this.y + 10, 10, 2);
        } else if (this.state === 'eating') {
            ctx.fillRect(this.x - 5, this.y + 5, 10, 10);
        } else {
            ctx.fillRect(this.x - 5, this.y + 8, 10, 2);
            ctx.fillRect(this.x - 5, this.y + 5, 2, 5);
            ctx.fillRect(this.x + 3, this.y + 5, 2, 5);
        }
    }
};

function updateDisplays() {
    hungerDisplay.textContent = pet.hunger;
    happinessDisplay.textContent = pet.happiness;
}

feedBtn.addEventListener('click', () => {
    pet.hunger -= 20;
    if (pet.hunger < 0) pet.hunger = 0;
    pet.state = 'eating';
    setTimeout(() => { if (pet.state === 'eating') pet.state = 'idle'; }, 500);
    updateDisplays();
});

playBtn.addEventListener('click', () => {
    pet.happiness += 20;
    if (pet.happiness > 100) pet.happiness = 100;

    // Simple jump animation
    pet.y -= 20;
    setTimeout(() => { pet.y += 20; }, 200);

    updateDisplays();
});

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    timeAccumulator += deltaTime;

    if (timeAccumulator > TICK_RATE) {
        pet.update();
        updateDisplays();
        timeAccumulator -= TICK_RATE;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pet
    pet.draw(ctx);

    requestAnimationFrame(gameLoop);
}

// Start game
requestAnimationFrame(gameLoop);