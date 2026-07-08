const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const hungerVal = document.getElementById('hunger-val');
const happinessVal = document.getElementById('happiness-val');
const energyVal = document.getElementById('energy-val');

class Pet {
    constructor() {
        this.hunger = 100;
        this.happiness = 100;
        this.energy = 100;
        this.state = 'idle'; // idle, eating, playing, sleeping

        this.x = 130;
        this.y = 130;
        this.size = 40;
        this.color = '#0f380f'; // Gameboy dark green

        this.tickRate = 1000;
        this.lastTick = 0;

        this.animFrame = 0;
        this.lastAnimTime = 0;
    }

    update(time) {
        if (time - this.lastTick > this.tickRate) {
            if (this.state !== 'eating') this.hunger = Math.max(0, this.hunger - 1);
            if (this.state !== 'playing') this.happiness = Math.max(0, this.happiness - 1);
            if (this.state !== 'sleeping') {
                this.energy = Math.max(0, this.energy - 0.5);
            } else {
                this.energy = Math.min(100, this.energy + 5);
            }

            // State transitions
            if (this.state === 'sleeping' && this.energy >= 100) {
                this.state = 'idle';
            }

            this.updateStatsUI();
            this.lastTick = time;
        }

        // Animation updates
        if (time - this.lastAnimTime > 500) {
            this.animFrame = (this.animFrame + 1) % 2;
            this.lastAnimTime = time;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;

        let drawX = this.x;
        let drawY = this.y;

        // Simple bop animation
        if (this.state === 'idle' || this.state === 'eating' || this.state === 'playing') {
            drawY += this.animFrame * 5;
        }

        // Body
        ctx.fillRect(drawX, drawY, this.size, this.size);

        // Eyes
        ctx.fillStyle = '#9bbc0f'; // Background color for eyes
        if (this.state === 'sleeping') {
            // Sleeping eyes
            ctx.fillRect(drawX + 8, drawY + 12, 8, 4);
            ctx.fillRect(drawX + 24, drawY + 12, 8, 4);
        } else {
            // Open eyes
            ctx.fillRect(drawX + 8, drawY + 10, 8, 8);
            ctx.fillRect(drawX + 24, drawY + 10, 8, 8);
        }

        // Accessories/Effects based on state
        ctx.fillStyle = this.color;
        if (this.state === 'eating') {
            ctx.fillRect(drawX + 16, drawY + 25, 8, 8); // Mouth/food
        } else if (this.state === 'playing') {
             // Ball
             ctx.fillRect(drawX + this.size + 10, drawY + 20 - (this.animFrame * 10), 10, 10);
        } else if (this.state === 'sleeping') {
            // Zzz
            ctx.font = '20px "Courier New"';
            ctx.fillText('Z', drawX + this.size + 5, drawY - 10 + (this.animFrame * 5));
            ctx.fillText('z', drawX + this.size + 15, drawY - 20 + (this.animFrame * 5));
        } else if (this.hunger < 30 || this.happiness < 30 || this.energy < 30) {
             // Sad mouth
             ctx.fillRect(drawX + 16, drawY + 28, 8, 4);
             ctx.fillRect(drawX + 12, drawY + 32, 4, 4);
             ctx.fillRect(drawX + 24, drawY + 32, 4, 4);
        }
    }

    updateStatsUI() {
        hungerVal.innerText = Math.floor(this.hunger);
        happinessVal.innerText = Math.floor(this.happiness);
        energyVal.innerText = Math.floor(this.energy);
    }

    feed() {
        if (this.state !== 'sleeping') {
            this.state = 'eating';
            this.hunger = Math.min(100, this.hunger + 20);
            this.updateStatsUI();
            setTimeout(() => { if(this.state === 'eating') this.state = 'idle'; }, 2000);
        }
    }

    play() {
        if (this.state !== 'sleeping') {
            this.state = 'playing';
            this.happiness = Math.min(100, this.happiness + 20);
            this.energy = Math.max(0, this.energy - 10);
            this.updateStatsUI();
            setTimeout(() => { if(this.state === 'playing') this.state = 'idle'; }, 2000);
        }
    }

    sleep() {
        this.state = 'sleeping';
        this.updateStatsUI();
    }
}

const pet = new Pet();

document.getElementById('feed-btn').addEventListener('click', () => pet.feed());
document.getElementById('play-btn').addEventListener('click', () => pet.play());
document.getElementById('sleep-btn').addEventListener('click', () => pet.sleep());

function gameLoop(time) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw pet
    pet.update(time);
    pet.draw(ctx);

    requestAnimationFrame(gameLoop);
}

// Start loop
requestAnimationFrame(gameLoop);
