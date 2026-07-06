const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state variables
let lastTime = 0;

class Pet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 40;
        this.hunger = 0;      // 0 = full, 100 = starving
        this.happiness = 100; // 100 = very happy, 0 = depressed

        // Simple animation state
        this.bounceOffset = 0;
        this.bounceDir = 1;
        this.bounceSpeed = 0.05;
    }

    update(deltaTime) {
        // Slowly increase hunger
        this.hunger += 0.5 * (deltaTime / 1000);
        if (this.hunger > 100) this.hunger = 100;

        // Slowly decrease happiness, faster if hungry
        let happyDecay = 0.5;
        if (this.hunger > 50) happyDecay = 1.5;
        this.happiness -= happyDecay * (deltaTime / 1000);
        if (this.happiness < 0) this.happiness = 0;

        // Animate bouncing based on happiness
        let currentBounceSpeed = this.bounceSpeed * (this.happiness / 50 + 0.1);
        this.bounceOffset += currentBounceSpeed * this.bounceDir * deltaTime;
        if (this.bounceOffset > 10) {
            this.bounceOffset = 10;
            this.bounceDir = -1;
        } else if (this.bounceOffset < 0) {
            this.bounceOffset = 0;
            this.bounceDir = 1;
        }
    }

    draw(ctx) {
        // Draw body
        ctx.fillStyle = '#ffcc00'; // Yellow pet

        // Change color slightly if sad/hungry
        if (this.happiness < 30 || this.hunger > 70) {
             ctx.fillStyle = '#ccaa00';
        }

        ctx.fillRect(this.x - this.size/2, this.y - this.size/2 - this.bounceOffset, this.size, this.size);

        // Draw eyes
        ctx.fillStyle = 'black';
        let eyeOffsetY = this.happiness < 30 ? 5 : 0;
        ctx.fillRect(this.x - 10, this.y - 10 - this.bounceOffset + eyeOffsetY, 5, 5);
        ctx.fillRect(this.x + 5, this.y - 10 - this.bounceOffset + eyeOffsetY, 5, 5);

        // Draw mouth
        if (this.happiness > 50) {
             // Smile
             ctx.fillRect(this.x - 10, this.y + 5 - this.bounceOffset, 5, 5);
             ctx.fillRect(this.x - 5, this.y + 10 - this.bounceOffset, 10, 5);
             ctx.fillRect(this.x + 5, this.y + 5 - this.bounceOffset, 5, 5);
        } else {
             // Sad
             ctx.fillRect(this.x - 10, this.y + 10 - this.bounceOffset, 5, 5);
             ctx.fillRect(this.x - 5, this.y + 5 - this.bounceOffset, 10, 5);
             ctx.fillRect(this.x + 5, this.y + 10 - this.bounceOffset, 5, 5);
        }
    }
}

const myPet = new Pet(canvas.width / 2, canvas.height / 2 + 50);

// Interaction
canvas.addEventListener('click', (e) => {
    // Very simple interaction: clicking anywhere feeds/plays with it
    myPet.hunger -= 20;
    if (myPet.hunger < 0) myPet.hunger = 0;

    myPet.happiness += 20;
    if (myPet.happiness > 100) myPet.happiness = 100;

    // Animate jump on click
    myPet.bounceOffset = 30;
    myPet.bounceDir = -1;
});

// Touch support for Android WebView
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default zoom/scroll
    myPet.hunger -= 20;
    if (myPet.hunger < 0) myPet.hunger = 0;

    myPet.happiness += 20;
    if (myPet.happiness > 100) myPet.happiness = 100;

    myPet.bounceOffset = 30;
    myPet.bounceDir = -1;
}, {passive: false});

function drawUI() {
    ctx.fillStyle = 'black';
    ctx.font = '20px "Courier New", Courier, monospace';
    ctx.fillText(`Happiness: ${Math.round(myPet.happiness)}`, 10, 30);
    ctx.fillText(`Hunger: ${Math.round(myPet.hunger)}`, 10, 60);

    // Draw ground
    ctx.fillStyle = '#654321'; // Brown dirt
    ctx.fillRect(0, canvas.height / 2 + 70, canvas.width, canvas.height / 2 - 70);
    ctx.fillStyle = '#228B22'; // Green grass
    ctx.fillRect(0, canvas.height / 2 + 70, canvas.width, 20);
}

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update
    myPet.update(deltaTime);

    // Draw
    drawUI();
    myPet.draw(ctx);

    // Loop
    requestAnimationFrame(gameLoop);
}

// Start game
requestAnimationFrame(gameLoop);
