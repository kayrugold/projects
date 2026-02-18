/* embers.js - v2.2 Performance Optimized */

(function () {
    // 1. Setup Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'studio-embers';
    Object.assign(canvas.style, {
        position: 'fixed', top: '0', left: '0',
        width: '100%', height: '100%',
        zIndex: '60', pointerEvents: 'none'
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: true }); // Optimize for alpha
    let width, height;

    // 2. Pre-render the Ember Sprite (Huge Performance Boost)
    const spriteSize = 20; // Max size needed
    const sprite = document.createElement('canvas');
    sprite.width = spriteSize;
    sprite.height = spriteSize;
    const sCtx = sprite.getContext('2d');

    // Create a generic glow used for all particles
    const gradient = sCtx.createRadialGradient(spriteSize / 2, spriteSize / 2, 0, spriteSize / 2, spriteSize / 2, spriteSize / 2);
    gradient.addColorStop(0, 'rgba(255, 150, 50, 1)');   // Core orange
    gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');    // Fade out
    sCtx.fillStyle = gradient;
    sCtx.beginPath();
    sCtx.arc(spriteSize / 2, spriteSize / 2, spriteSize / 2, 0, Math.PI * 2);
    sCtx.fill();

    // 3. Resize Handler
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // 4. Particle System
    const particles = [];
    const particleCount = 30; // Reduced from 45 for better perf on weak GPUs

    class Ember {
        constructor() { this.reset(true); }

        reset(randomY = false) {
            this.x = Math.random() * width;
            this.y = randomY ? Math.random() * height : height + 10;
            this.size = (Math.random() * 0.5 + 0.5) * spriteSize; // Scale the sprite
            this.speedY = (Math.random() * 1.0 + 0.3) * -1; // Slower, calmer rise
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = 0;
            this.maxOpacity = Math.random() * 0.6 + 0.2;
            this.life = 100;
            this.fadeIn = true;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Simple fade in/out logic
            if (this.fadeIn) {
                this.opacity += 0.02;
                if (this.opacity >= this.maxOpacity) this.fadeIn = false;
            } else {
                if (this.y < height * 0.2) this.opacity -= 0.01; // Fade only near top
            }

            if (this.y < -50 || this.opacity <= 0) this.reset();
        }

        draw() {
            ctx.globalAlpha = Math.max(0, this.opacity);
            // Draw the pre-rendered sprite centered at x,y
            ctx.drawImage(sprite, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        }
    }

    // Initialize
    for (let i = 0; i < particleCount; i++) particles.push(new Ember());

    // 5. Optimized Render Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        // Batch draw settings
        ctx.shadowBlur = 0; // Disable expensive shadows if any

        for (let i = 0; i < particleCount; i++) {
            const p = particles[i];
            p.update();
            p.draw();
        }
        requestAnimationFrame(animate);
    }
    animate();
})();
