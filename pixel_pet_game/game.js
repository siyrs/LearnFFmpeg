class Pet {
    constructor(name) {
        this.name = name || "Pixel Pet";
        this.hunger = 100;
        this.happiness = 100;
        this.energy = 100;
        this.isSleeping = false;
        this.alive = true;
    }

    feed() {
        if (!this.alive) return;
        this.hunger = Math.min(100, this.hunger + 20);
        this.energy = Math.min(100, this.energy + 5);
        this.updateStats();
        this.draw();
    }

    play() {
        if (!this.alive) return;
        if (this.energy > 10) {
            this.happiness = Math.min(100, this.happiness + 20);
            this.energy = Math.max(0, this.energy - 10);
            this.hunger = Math.max(0, this.hunger - 10);
        }
        this.updateStats();
        this.draw();
    }

    sleep() {
        if (!this.alive) return;
        this.isSleeping = !this.isSleeping;
        this.updateStats();
        this.draw();
    }

    tick() {
        if (!this.alive) return;

        if (this.isSleeping) {
            this.energy = Math.min(100, this.energy + 10);
            this.hunger = Math.max(0, this.hunger - 2);
        } else {
            this.hunger = Math.max(0, this.hunger - 5);
            this.happiness = Math.max(0, this.happiness - 5);
            this.energy = Math.max(0, this.energy - 2);
        }

        if (this.hunger === 0 || this.happiness === 0 || this.energy === 0) {
             // To simplify, if any stat reaches 0, the pet might "die" or just be very sad. Let's say if all are low.
             if(this.hunger === 0 && this.energy === 0) {
                 this.alive = false;
             }
        }

        this.updateStats();
        this.draw();
    }

    updateStats() {
        const statsEl = document.getElementById('stats');
        if (statsEl) {
            statsEl.innerHTML = `
                <p>Name: ${this.name}</p>
                <p>Status: ${this.alive ? (this.isSleeping ? 'Sleeping 💤' : 'Awake 👀') : 'Dead 💀'}</p>
                <p>Hunger: ${this.hunger}/100</p>
                <p>Happiness: ${this.happiness}/100</p>
                <p>Energy: ${this.energy}/100</p>
            `;
        }
    }

    draw() {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Simple pixel pet drawing
        ctx.fillStyle = this.alive ? (this.isSleeping ? '#888' : '#4CAF50') : '#F44336';

        // Body
        ctx.fillRect(50, 50, 100, 100);

        if (this.alive && !this.isSleeping) {
            // Eyes
            ctx.fillStyle = '#FFF';
            ctx.fillRect(70, 70, 20, 20);
            ctx.fillRect(110, 70, 20, 20);

            // Pupils
            ctx.fillStyle = '#000';
            ctx.fillRect(75, 75, 10, 10);
            ctx.fillRect(115, 75, 10, 10);

            // Mouth
            if (this.happiness > 50) {
                // Smile
                ctx.fillRect(80, 110, 40, 10);
                ctx.fillRect(70, 100, 10, 10);
                ctx.fillRect(120, 100, 10, 10);
            } else {
                // Sad
                ctx.fillRect(80, 110, 40, 10);
                ctx.fillRect(70, 120, 10, 10);
                ctx.fillRect(120, 120, 10, 10);
            }
        } else if (this.isSleeping) {
             // Eyes closed
             ctx.fillStyle = '#000';
             ctx.fillRect(70, 80, 20, 5);
             ctx.fillRect(110, 80, 20, 5);
        } else {
             // Dead Eyes (X)
             ctx.fillStyle = '#000';
             ctx.fillRect(70, 70, 5, 5); ctx.fillRect(85, 85, 5, 5); ctx.fillRect(70, 85, 5, 5); ctx.fillRect(85, 70, 5, 5);
             ctx.fillRect(110, 70, 5, 5); ctx.fillRect(125, 85, 5, 5); ctx.fillRect(110, 85, 5, 5); ctx.fillRect(125, 70, 5, 5);
             // Dead mouth
             ctx.fillRect(80, 120, 40, 10);
        }
    }
}

let pet;
let gameLoop;

window.onload = () => {
    pet = new Pet("My Pixel Pet");
    pet.updateStats();
    pet.draw();

    document.getElementById('btn-feed').addEventListener('click', () => pet.feed());
    document.getElementById('btn-play').addEventListener('click', () => pet.play());
    document.getElementById('btn-sleep').addEventListener('click', () => pet.sleep());

    // Game loop ticks every 5 seconds
    gameLoop = setInterval(() => {
        pet.tick();
        if (!pet.alive) {
            clearInterval(gameLoop);
        }
    }, 5000);
};