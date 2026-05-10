const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let hunger = 100;
let happiness = 100;

// Draw a simple pixel pet (just some squares)
function drawPet(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grass
    ctx.fillStyle = '#2E8B57';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // Draw pet body
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x, y, 60, 60);

    // Draw eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 10, y + 10, 10, 10);
    ctx.fillRect(x + 40, y + 10, 10, 10);

    // Draw mouth
    if (happiness > 50) {
        ctx.fillRect(x + 20, y + 40, 20, 5); // Happy
    } else {
        ctx.fillRect(x + 20, y + 40, 20, 10); // Sad/Neutral open mouth
    }
}

function updateStatus() {
    document.getElementById('hunger').textContent = hunger;
    document.getElementById('happiness').textContent = happiness;
    drawPet(120, 190);
}

function feedPet() {
    if (hunger < 100) {
        hunger += 10;
        if (hunger > 100) hunger = 100;
        updateStatus();
    }
}

function playPet() {
    if (happiness < 100) {
        happiness += 10;
        if (happiness > 100) happiness = 100;
        hunger -= 5;
        if (hunger < 0) hunger = 0;
        updateStatus();
    }
}

setInterval(() => {
    hunger -= 2;
    happiness -= 1;
    if (hunger < 0) hunger = 0;
    if (happiness < 0) happiness = 0;
    updateStatus();
}, 2000);

updateStatus();
