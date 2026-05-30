const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const hungerBar = document.getElementById('hunger-bar');
const happinessBar = document.getElementById('happiness-bar');
const energyBar = document.getElementById('energy-bar');

const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');
const sleepBtn = document.getElementById('sleep-btn');

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const pet = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 40,
    hunger: 100,
    happiness: 100,
    energy: 100,
    state: 'idle', // idle, eating, playing, sleeping
    frame: 0,
    timer: 0,
    targetX: canvas.width / 2,
    targetY: canvas.height / 2,

    update: function(deltaTime) {
        // Decrease stats over time
        this.timer += deltaTime;
        if (this.timer > 1000) {
            this.timer = 0;
            if (this.state !== 'sleeping') {
                this.hunger = Math.max(0, this.hunger - 1);
                this.energy = Math.max(0, this.energy - 0.5);
                if (this.hunger < 30) this.happiness = Math.max(0, this.happiness - 2);
                if (this.energy < 20) this.happiness = Math.max(0, this.happiness - 1);
            } else {
                this.energy = Math.min(100, this.energy + 5);
                if (this.energy === 100) this.state = 'idle';
            }
            updateUI();
        }

        // Movement
        if (this.state === 'idle' || this.state === 'playing') {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist > 5) {
                this.x += (dx / dist) * (this.state === 'playing' ? 3 : 1);
                this.y += (dy / dist) * (this.state === 'playing' ? 3 : 1);
            } else if (Math.random() < 0.02 && this.state === 'idle') {
                // Random wander
                this.targetX = Math.random() * (canvas.width - this.size * 2) + this.size;
                this.targetY = Math.random() * (canvas.height - this.size * 2) + this.size;
            }
        }

        // Animation
        this.frame = (this.frame + 0.1) % 2;
    },

    draw: function(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const f = Math.floor(this.frame);

        // Draw pixel art pet (simple blob for now)
        ctx.fillStyle = this.state === 'sleeping' ? '#3498db' : (this.happiness > 50 ? '#f1c40f' : '#e67e22');
        if (this.hunger < 20) ctx.fillStyle = '#e74c3c';

        // Body
        ctx.fillRect(-this.size/2, -this.size/2 + (f === 1 ? 5 : 0), this.size, this.size - (f === 1 ? 5 : 0));

        // Eyes
        ctx.fillStyle = '#2c3e50';
        if (this.state === 'sleeping') {
            ctx.fillRect(-10, -5 + (f === 1 ? 5 : 0), 8, 2);
            ctx.fillRect(2, -5 + (f === 1 ? 5 : 0), 8, 2);
        } else {
            ctx.fillRect(-10, -5 + (f === 1 ? 5 : 0), 6, 6);
            ctx.fillRect(4, -5 + (f === 1 ? 5 : 0), 6, 6);
        }

        // Mouth
        if (this.happiness > 50 && this.state !== 'sleeping') {
            ctx.fillRect(-4, 10 + (f === 1 ? 5 : 0), 8, 2); // Smile
        } else if (this.state !== 'sleeping') {
            ctx.fillRect(-4, 10 + (f === 1 ? 5 : 0), 8, 4); // Open mouth / sad
        }

        ctx.restore();
    }
};

function updateUI() {
    hungerBar.style.width = pet.hunger + '%';
    hungerBar.style.backgroundColor = pet.hunger > 50 ? '#2ecc71' : (pet.hunger > 20 ? '#f1c40f' : '#e74c3c');

    happinessBar.style.width = pet.happiness + '%';
    happinessBar.style.backgroundColor = pet.happiness > 50 ? '#2ecc71' : (pet.happiness > 20 ? '#f1c40f' : '#e74c3c');

    energyBar.style.width = pet.energy + '%';
    energyBar.style.backgroundColor = pet.energy > 50 ? '#2ecc71' : (pet.energy > 20 ? '#f1c40f' : '#e74c3c');
}

feedBtn.addEventListener('click', () => {
    if (pet.state !== 'sleeping') {
        pet.hunger = Math.min(100, pet.hunger + 30);
        pet.state = 'eating';
        setTimeout(() => pet.state = 'idle', 2000);
        updateUI();
    }
});

playBtn.addEventListener('click', () => {
    if (pet.state !== 'sleeping' && pet.energy > 20) {
        pet.happiness = Math.min(100, pet.happiness + 20);
        pet.energy = Math.max(0, pet.energy - 15);
        pet.state = 'playing';
        pet.targetX = Math.random() * (canvas.width - pet.size * 2) + pet.size;
        pet.targetY = Math.random() * (canvas.height - pet.size * 2) + pet.size;
        setTimeout(() => pet.state = 'idle', 3000);
        updateUI();
    }
});

sleepBtn.addEventListener('click', () => {
    if (pet.state !== 'sleeping') {
        pet.state = 'sleeping';
        updateUI();
    } else {
        pet.state = 'idle';
        updateUI();
    }
});

// Touch interaction
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (pet.state !== 'sleeping') {
        const rect = canvas.getBoundingClientRect();
        pet.targetX = e.touches[0].clientX - rect.left;
        pet.targetY = e.touches[0].clientY - rect.top;
        pet.happiness = Math.min(100, pet.happiness + 5);
        updateUI();
    }
});

canvas.addEventListener('mousedown', (e) => {
    if (pet.state !== 'sleeping') {
        const rect = canvas.getBoundingClientRect();
        pet.targetX = e.clientX - rect.left;
        pet.targetY = e.clientY - rect.top;
        pet.happiness = Math.min(100, pet.happiness + 5);
        updateUI();
    }
});

let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.strokeStyle = '#bdc3c7';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for(let i=0; i<canvas.height; i+=20) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    pet.update(deltaTime);
    pet.draw(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
