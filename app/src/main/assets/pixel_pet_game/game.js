const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');

// Simple pixel art for the pet (a blob)
const petIdle = [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,0,1,1,0,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,0,0,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,0,1,0,0,1,0,0],
    [0,1,1,0,0,1,1,0]
];

const petHappy = [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,0,1,1,0,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,0,1,1,0,1,1],
    [0,1,1,0,0,1,1,0],
    [0,0,1,0,0,1,0,0],
    [0,1,1,0,0,1,1,0]
];

const pixelSize = 20;

class Pet {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.hunger = 50;
        this.happiness = 50;
        this.state = 'idle'; // idle, happy, eating
        this.frame = 0;
        this.lastUpdate = Date.now();
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let sprite = petIdle;
        if (this.state === 'happy' || this.state === 'eating') {
            sprite = this.frame % 2 === 0 ? petIdle : petHappy;
        }

        const offsetX = this.x - (sprite[0].length * pixelSize) / 2;
        const offsetY = this.y - (sprite.length * pixelSize) / 2;

        for (let row = 0; row < sprite.length; row++) {
            for (let col = 0; col < sprite[row].length; col++) {
                if (sprite[row][col] === 1) {
                    ctx.fillStyle = '#333'; // Dark gray pet
                    ctx.fillRect(offsetX + col * pixelSize, offsetY + row * pixelSize, pixelSize, pixelSize);
                }
            }
        }

        // Draw HUD
        ctx.fillStyle = '#000';
        ctx.font = '20px Courier New';
        ctx.fillText(`Hunger: ${Math.floor(this.hunger)}`, 10, 30);
        ctx.fillText(`Happiness: ${Math.floor(this.happiness)}`, 10, 60);

        // State message
        ctx.textAlign = 'center';
        if (this.hunger > 80) {
            ctx.fillText("I'm hungry!", canvas.width / 2, canvas.height - 30);
        } else if (this.happiness < 20) {
            ctx.fillText("I'm bored!", canvas.width / 2, canvas.height - 30);
        }
        ctx.textAlign = 'left';
    }

    update() {
        const now = Date.now();
        const dt = (now - this.lastUpdate) / 1000; // seconds
        this.lastUpdate = now;

        // Stats change over time
        this.hunger += 2 * dt;
        this.happiness -= 1.5 * dt;

        // Clamp values
        this.hunger = Math.min(100, Math.max(0, this.hunger));
        this.happiness = Math.min(100, Math.max(0, this.happiness));

        // Animation frame update (simple pulse)
        if (now % 1000 < 50) {
           this.frame++;
        }

        // Revert state to idle after some time
        if (this.state !== 'idle' && Math.random() < 0.01) {
            this.state = 'idle';
        }
    }

    feed() {
        if (this.hunger > 10) {
            this.hunger -= 20;
            this.state = 'eating';
            this.frame = 1;
        }
    }

    play() {
        if (this.happiness < 90) {
            this.happiness += 20;
            this.hunger += 5; // Playing makes them hungry
            this.state = 'happy';
            this.frame = 1;
        }
    }
}

const myPet = new Pet();

feedBtn.addEventListener('click', () => myPet.feed());
playBtn.addEventListener('click', () => myPet.play());

function gameLoop() {
    myPet.update();
    myPet.draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();