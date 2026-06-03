const canvas = document.getElementById('pet-canvas');
const ctx = canvas.getContext('2d');
const hungerDisplay = document.getElementById('hunger');
const happinessDisplay = document.getElementById('happiness');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

let hunger = 100;
let happiness = 100;
let petColor = '#ff9800';

function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pet body
    ctx.fillStyle = petColor;
    ctx.fillRect(50, 50, 100, 100);

    // Draw eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(70, 70, 10, 10);
    ctx.fillRect(120, 70, 10, 10);

    // Draw mouth based on happiness
    if (happiness > 50) {
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
}

function updateStatus() {
    hungerDisplay.textContent = Math.max(0, Math.floor(hunger));
    happinessDisplay.textContent = Math.max(0, Math.floor(happiness));

    if (hunger <= 0 || happiness <= 0) {
        petColor = '#9e9e9e'; // Sad/gray color
    } else {
        petColor = '#ff9800'; // Happy/orange color
    }

    drawPet();
}

function decreaseStats() {
    hunger -= 1;
    happiness -= 0.5;

    if (hunger < 0) hunger = 0;
    if (happiness < 0) happiness = 0;

    updateStatus();
}

feedBtn.addEventListener('click', () => {
    hunger += 10;
    if (hunger > 100) hunger = 100;
    updateStatus();
});

playBtn.addEventListener('click', () => {
    happiness += 10;
    if (happiness > 100) happiness = 100;
    updateStatus();
});

// Game loop
drawPet();
updateStatus();
setInterval(decreaseStats, 1000); // Decrease stats every second
