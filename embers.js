/* embers.js - v3.0 Soft Glow & Flicker Engine */

const canvas = document.createElement('canvas');
canvas.id = 'ember-canvas';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// CONFIGURATION
const CONFIG = {
    particleCount: window.innerWidth < 600 ? 30 : 60, // Lower count, higher quality
    gravity: -0.6,       // Faster rise
    wind: 0.05,
    turbulence: 0.5,     // More erratic movement
    maxSize: 6,          // Slightly larger to account for the glow edge
    minSize: 2,
    lifeDrain: 0.006     
};

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Ember {
    constructor() {
        this.reset();
        // Give them a random starting age so they don't all look same
        this.life = Math.random(); 
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + (Math.random() * 50);
        this.vx = (Math.random() - 0.5) * CONFIG.turbulence;
        this.vy = (Math.random() * -1.5) - 0.5; // Stronger updraft
        this.size = (Math.random() * (CONFIG.maxSize - CONFIG.minSize)) + CONFIG.minSize;
        this.life = 1.0;
        this.decay = (Math.random() * 0.005) + CONFIG.lifeDrain;
        this.flickerSpeed = 0.1 + Math.random() * 0.2;
    }

    update() {
        this.x += this.vx + CONFIG.wind;
        this.y += this.vy + CONFIG.gravity;
        
        // Add "sine wave" drift for organic motion
        this.x += Math.sin(this.y * 0.02) * 0.5;

        this.life -= this.decay;

        if (this.life <= 0 || this.y < -50) {
            this.reset();
        }
    }

    draw(time) {
        // FLICKER EFFECT: Sine wave based on time
        // This makes the ember pulse slightly
        const flicker = 0.8 + (Math.sin(time * this.flickerSpeed) * 0.2); 
        const currentAlpha = this.life * flicker;

        if (currentAlpha <= 0) return;

        // THE "GLOW" GRADIENT
        // Instead of a hard circle, we draw a ball of light
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        
        // 1. Center: White Hot (Heat)
        gradient.addColorStop(0, `rgba(255, 255, 200, ${currentAlpha})`);
        
        // 2. Middle: Fire Orange (Body)
        gradient.addColorStop(0.4, `rgba(255, 120, 0, ${currentAlpha * 0.8})`);
        
        // 3. Edge: Transparent Red (Glow)
        gradient.addColorStop(1, `rgba(255, 0, 0, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
        particles.push(new Ember());
    }
}

function animate(time) {
    ctx.clearRect(0, 0, width, height);

    // Additive Blending = Real Light Physics
    // Overlapping embers will get brighter (white), not muddier
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(time * 0.005); // Pass time for flicker
    }

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(animate);
}

// Start
initParticles();
animate(0);
