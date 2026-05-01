const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const hungerValEl = document.getElementById('hunger-val');
const happinessValEl = document.getElementById('happiness-val');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

// Game State
let pet = {
    hunger: 100,
    happiness: 100,
    isAlive: true,
    pixelSize: 10,
    x: 10,
    y: 10,
    frame: 0
};

// A simple pixel art pet represented by an array of strings
// 0 = transparent, 1 = black border, 2 = main color, 3 = highlight, 4 = eye/mouth
const petSprites = [
    [ // Frame 0: Normal
        "0000000000000000",
        "0000000000000000",
        "0001110000011100",
        "0012221000122210",
        "0122222101222221",
        "0122222212222221",
        "0122422222242221",
        "0122222222222221",
        "0012222442222210",
        "0001222222222100",
        "0000122222221000",
        "0001222222222100",
        "0001221111122100",
        "0000110000011000",
        "0000000000000000",
        "0000000000000000"
    ],
    [ // Frame 1: Happy/Jumping
        "0000000000000000",
        "0001110000011100",
        "0012221000122210",
        "0122222101222221",
        "0122222212222221",
        "0122422222242221",
        "0122222222222221",
        "0012222222222210",
        "0001224444422100",
        "0000122222221000",
        "0000122222221000",
        "0001222222222100",
        "0012221111122210",
        "0001110000011100",
        "0000000000000000",
        "0000000000000000"
    ],
    [ // Frame 2: Dead
        "0000000000000000",
        "0000000000000000",
        "0000000000000000",
        "0000000000000000",
        "0001110000011100",
        "0012221000122210",
        "0122222101222221",
        "0124122212241221",
        "0121422222214221",
        "0012222222222210",
        "0001222111222100",
        "0000122222221000",
        "0001221111122100",
        "0000110000011000",
        "0000000000000000",
        "0000000000000000"
    ]
];

const colors = {
    '0': 'rgba(0,0,0,0)', // Transparent
    '1': '#000000',       // Outline
    '2': '#ffcc00',       // Body (yellow)
    '3': '#ffffff',       // Highlight
    '4': '#333333'        // Features (eyes/mouth)
};

function drawSprite(sprite, x, y, size) {
    for (let r = 0; r < sprite.length; r++) {
        for (let c = 0; c < sprite[r].length; c++) {
            const char = sprite[r][c];
            if (char !== '0') {
                ctx.fillStyle = colors[char];
                ctx.fillRect(x + c * size, y + r * size, size, size);
            }
        }
    }
}

function updateUI() {
    hungerValEl.textContent = pet.hunger;
    happinessValEl.textContent = pet.happiness;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!pet.isAlive) {
        drawSprite(petSprites[2], 70, 70, pet.pixelSize);
        ctx.fillStyle = "red";
        ctx.font = "20px Courier New";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height - 30);
        return;
    }

    // Animation logic
    let currentSprite = petSprites[pet.frame % 2];
    let offsetY = Math.sin(Date.now() / 200) * 5; // Simple bounce effect
    drawSprite(currentSprite, 70, 70 + offsetY, pet.pixelSize);

    // Frame counter update
    if (Math.random() < 0.05) {
        pet.frame++;
    }

    requestAnimationFrame(gameLoop);
}

// Decrease stats over time
setInterval(() => {
    if (!pet.isAlive) return;

    pet.hunger -= 2;
    pet.happiness -= 1;

    if (pet.hunger <= 0 || pet.happiness <= 0) {
        pet.hunger = Math.max(0, pet.hunger);
        pet.happiness = Math.max(0, pet.happiness);
        pet.isAlive = false;
    }

    updateUI();
}, 2000); // Every 2 seconds

// Interactions
feedBtn.addEventListener('click', () => {
    if (!pet.isAlive) return;
    pet.hunger = Math.min(100, pet.hunger + 15);
    pet.happiness = Math.min(100, pet.happiness + 5);
    updateUI();
});

playBtn.addEventListener('click', () => {
    if (!pet.isAlive) return;
    pet.happiness = Math.min(100, pet.happiness + 15);
    pet.hunger = Math.max(0, pet.hunger - 5);
    if(pet.hunger <= 0) pet.isAlive = false;
    updateUI();
});

// Start
updateUI();
requestAnimationFrame(gameLoop);
