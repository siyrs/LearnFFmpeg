const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let width, height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Pet object
const pet = {
    x: width / 2,
    y: height / 2,
    size: 50,
    color: '#FF6347', // Tomato color
    dx: 3,
    dy: 3,
    targetX: null,
    targetY: null,

    draw() {
        ctx.fillStyle = this.color;
        // Simple "pixel" look - drawing a square
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

        // Draw eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x - 15, this.y - 15, 10, 10);
        ctx.fillRect(this.x + 5, this.y - 15, 10, 10);

        ctx.fillStyle = 'black';
        ctx.fillRect(this.x - 10, this.y - 10, 5, 5);
        ctx.fillRect(this.x + 10, this.y - 10, 5, 5);

        // Draw mouth
        ctx.fillRect(this.x - 10, this.y + 10, 20, 5);
    },

    update() {
        // Move towards target if exists
        if (this.targetX !== null && this.targetY !== null) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                this.x += (dx / distance) * 5;
                this.y += (dy / distance) * 5;
            } else {
                this.targetX = null;
                this.targetY = null;
            }
        } else {
            // Idle bouncing
            this.x += this.dx;
            this.y += this.dy;

            // Bounce off walls
            if (this.x + this.size / 2 > width || this.x - this.size / 2 < 0) {
                this.dx *= -1;
            }
            if (this.y + this.size / 2 > height || this.y - this.size / 2 < 0) {
                this.dy *= -1;
            }
        }
    }
};

// Handle clicks/touches to move the pet
function handleInteraction(e) {
    e.preventDefault();
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    pet.targetX = clientX;
    pet.targetY = clientY;
}

canvas.addEventListener('mousedown', handleInteraction);
canvas.addEventListener('touchstart', handleInteraction, {passive: false});

// Draw some environment
function drawEnvironment() {
    // Ground
    ctx.fillStyle = '#8FBC8F'; // DarkSeaGreen
    ctx.fillRect(0, height * 0.7, width, height * 0.3);
}

// Game loop
function loop() {
    ctx.clearRect(0, 0, width, height);

    drawEnvironment();
    pet.update();
    pet.draw();

    requestAnimationFrame(loop);
}

loop();
