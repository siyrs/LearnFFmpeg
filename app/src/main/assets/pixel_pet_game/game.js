const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pet State
let pet = {
    x: 150,
    y: 130,
    size: 40,
    color: '#e74c3c',
    dx: 1,
    dy: 0,
    hunger: 100,
    happiness: 100,
    isAlive: true
};

let lastTime = Date.now();

function drawPet() {
    ctx.fillStyle = pet.color;
    // Draw body
    ctx.fillRect(pet.x - pet.size / 2, pet.y - pet.size / 2, pet.size, pet.size);

    if (pet.isAlive) {
        // Draw eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(pet.x - 10, pet.y - 10, 8, 8);
        ctx.fillRect(pet.x + 2, pet.y - 10, 8, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(pet.x - 8, pet.y - 8, 4, 4);
        ctx.fillRect(pet.x + 4, pet.y - 8, 4, 4);

        // Draw mouth
        if (pet.happiness > 50) {
            ctx.fillRect(pet.x - 6, pet.y + 5, 12, 4); // Smile
        } else {
            ctx.fillRect(pet.x - 6, pet.y + 5, 12, 4);
            ctx.fillStyle = pet.color;
            ctx.fillRect(pet.x - 4, pet.y + 6, 8, 2); // Frown/Straight
        }
    } else {
         // Dead eyes
         ctx.fillStyle = '#000';
         ctx.fillRect(pet.x - 10, pet.y - 10, 8, 8);
         ctx.fillRect(pet.x + 2, pet.y - 10, 8, 8);
    }
}

function drawStats() {
    ctx.fillStyle = '#000';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Hunger:    ${Math.floor(pet.hunger)}%`, 10, 20);
    ctx.fillText(`Happiness: ${Math.floor(pet.happiness)}%`, 10, 40);

    if (!pet.isAlive) {
        ctx.fillStyle = 'red';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let now = Date.now();
    let dt = (now - lastTime) / 1000; // Delta time in seconds
    lastTime = now;

    if (pet.isAlive) {
        // Decrease stats over time (e.g. lose 5% per second)
        pet.hunger -= 2 * dt;
        pet.happiness -= 1.5 * dt;

        if (pet.hunger <= 0 || pet.happiness <= 0) {
            pet.hunger = Math.max(0, pet.hunger);
            pet.happiness = Math.max(0, pet.happiness);
            pet.isAlive = false;
        }

        // Simple pacing animation
        if (pet.x + pet.size / 2 > canvas.width - 20 || pet.x - pet.size / 2 < 20) {
            pet.dx *= -1;
        }
        pet.x += pet.dx;
    }

    drawPet();
    drawStats();

    requestAnimationFrame(update);
}

// Actions
window.feedPet = function() {
    if (pet.isAlive) {
        pet.hunger = Math.min(100, pet.hunger + 15);
    }
};

window.playWithPet = function() {
    if (pet.isAlive) {
        pet.happiness = Math.min(100, pet.happiness + 15);
        // Playing makes them a little hungry
        pet.hunger = Math.max(0, pet.hunger - 5);
    }
};

// Start game loop
update();
