const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const hungerSpan = document.getElementById('hunger-stat');
const happinessSpan = document.getElementById('happiness-stat');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

class Pet {
    constructor() {
        this.x = 150;
        this.y = 150;
        this.size = 10; // Pixel size multiplier
        this.hunger = 100;
        this.happiness = 100;
        this.isEating = false;
        this.isPlaying = false;

        // Simple 8x8 pixel art representation (0: empty, 1: dark green)
        this.pixels = [
            [0,0,1,1,1,1,0,0],
            [0,1,0,0,0,0,1,0],
            [1,0,1,0,0,1,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,1,0,0,1,0,1],
            [1,0,0,1,1,0,0,1],
            [0,1,0,0,0,0,1,0],
            [0,0,1,1,1,1,0,0]
        ];

        this.pixelsHappy = [
            [0,0,1,1,1,1,0,0],
            [0,1,0,0,0,0,1,0],
            [1,0,1,0,0,1,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,0,1],
            [1,0,0,1,1,0,0,1],
            [0,1,0,0,0,0,1,0],
            [0,0,1,1,1,1,0,0]
        ];

        this.pixelsSad = [
            [0,0,1,1,1,1,0,0],
            [0,1,0,0,0,0,1,0],
            [1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,0,1,1,0,0,1],
            [1,0,1,0,0,1,0,1],
            [0,1,0,0,0,0,1,0],
            [0,0,1,1,1,1,0,0]
        ];

        // start decay loops
        setInterval(() => this.decayStats(), 2000); // Stats decay every 2 seconds
        setInterval(() => this.bounce(), 500);      // Animation bounce
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let currentPixels = this.pixels;
        if (this.happiness > 70 && this.hunger > 50) currentPixels = this.pixelsHappy;
        else if (this.happiness < 30 || this.hunger < 30) currentPixels = this.pixelsSad;

        const offsetX = this.x - (currentPixels[0].length * this.size) / 2;
        const offsetY = this.y - (currentPixels.length * this.size) / 2;

        ctx.fillStyle = '#0f380f'; // Darkest green
        for (let row = 0; row < currentPixels.length; row++) {
            for (let col = 0; col < currentPixels[row].length; col++) {
                if (currentPixels[row][col] === 1) {
                    ctx.fillRect(offsetX + col * this.size, offsetY + row * this.size, this.size, this.size);
                }
            }
        }

        // Draw food if eating
        if(this.isEating) {
           ctx.fillRect(this.x + 30, this.y, this.size, this.size);
        }

        // Draw ball if playing
        if(this.isPlaying) {
           ctx.fillRect(this.x - 40, this.y - 20, this.size, this.size);
        }
    }

    bounce() {
        this.y = this.y === 150 ? 145 : 150;
    }

    decayStats() {
        if (this.hunger > 0) this.hunger -= 2;
        if (this.happiness > 0) this.happiness -= 1;
        this.updateUI();
    }

    feed() {
        if (this.hunger < 100) {
            this.hunger = Math.min(100, this.hunger + 15);
            this.isEating = true;
            setTimeout(() => this.isEating = false, 500);
            this.updateUI();
        }
    }

    play() {
        if (this.happiness < 100) {
            this.happiness = Math.min(100, this.happiness + 15);
            // Playing makes pet hungry faster
            if (this.hunger > 0) this.hunger = Math.max(0, this.hunger - 5);
            this.isPlaying = true;
            setTimeout(() => this.isPlaying = false, 500);
            this.updateUI();
        }
    }

    updateUI() {
        hungerSpan.innerText = this.hunger;
        happinessSpan.innerText = this.happiness;
    }
}

const myPet = new Pet();

feedBtn.addEventListener('click', () => myPet.feed());
playBtn.addEventListener('click', () => myPet.play());

function gameLoop() {
    myPet.draw();
    requestAnimationFrame(gameLoop);
}

// Initial draw and start loop
myPet.updateUI();
gameLoop();
