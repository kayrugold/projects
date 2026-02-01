/* embers.js - The Fire of the Forge */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// CONFIGURATION
canvas.id = 'ember-canvas';
let particles = [];
const particleCount = window.innerWidth < 600 ? 35 : 70; // Fewer on mobile for battery save

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
        // Start randomly on screen so they don't all pop in at the bottom at once
        this.y = Math.random() * canvas.height; 
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + (Math.random() * 50); // Start below screen
        this.size = Math.random() * 2 + 0.5; // Tiny sparks
        this.speedY = Math.random() * 1 + 0.5; // Slow rise
        this.speedX = (Math.random() - 0.5) * 0.5; // Slight drift
        this.opacity = 1;
        this.fadeRate = Math.random() * 0.01 + 0.002;
        
        // Color Palette: Gold, Orange, Red
        const colors = ['255, 215, 0', '255, 69, 0', '255, 140, 0']; 
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.2; // Heat wave wobble
        this.opacity -= this.fadeRate;

        if (this.opacity <= 0 || this.y < -10) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${this.color}, 0.8)`; // Glow effect
        ctx.fill();
    }
}

// INIT
for (let i = 0; i < particleCount; i++) {
    particles.push(new Ember());
}

// ANIMATION LOOP
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // "Lighter" makes the particles glow when they overlap
    ctx.globalCompositeOperation = 'screen'; 
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();
