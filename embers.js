/* embers.js - Optimized "Sprite Stamp" Edition */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.id = 'ember-canvas';
let particles = [];
const particleCount = 50; // Balanced for desktop/mobile

// PERFORMANCE: Pre-render the glow to an off-screen image
// This avoids calculating 'shadowBlur' 60 times a second
const sprite = document.createElement('canvas');
sprite.width = 20;
sprite.height = 20;
const sCtx = sprite.getContext('2d');

// Draw the "Ember" once into the sprite
const grad = sCtx.createRadialGradient(10, 10, 0, 10, 10, 10);
grad.addColorStop(0, 'rgba(255, 200, 50, 1)');   // Hot Center
grad.addColorStop(0.4, 'rgba(255, 100, 0, 0.5)'); // Orange Body
grad.addColorStop(1, 'rgba(255, 69, 0, 0)');     // Transparent Edge
sCtx.fillStyle = grad;
sCtx.fillRect(0, 0, 20, 20);

// RESIZE HANDLER
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// PARTICLE CLASS
class Ember {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; 
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + (Math.random() * 50);
        this.speedY = Math.random() * 0.8 + 0.2; // Slower, more majestic
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = 0; // Start invisible
        this.maxOpacity = Math.random() * 0.5 + 0.3; // Random max brightness
        this.life = 0;
        this.duration = Math.random() * 200 + 100;
        this.scale = Math.random() * 0.5 + 0.5; // Scale the sprite
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.life++;

        // Fade In / Fade Out math
        if (this.life < 20) {
            this.opacity = (this.life / 20) * this.maxOpacity;
        } else if (this.life > this.duration - 20) {
            this.opacity = ((this.duration - this.life) / 20) * this.maxOpacity;
        }

        if (this.life >= this.duration || this.y < -20) {
            this.reset();
        }
    }

    draw() {
        // FAST: Just copy the pre-made image. No vector math.
        ctx.globalAlpha = this.opacity;
        const size = 20 * this.scale;
        ctx.drawImage(sprite, this.x, this.y, size, size);
    }
}

// INIT
for (let i = 0; i < particleCount; i++) {
    particles.push(new Ember());
}

// ANIMATION LOOP
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // No globalCompositeOperation = Much faster
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();
