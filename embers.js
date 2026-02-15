/* embers.js - v2.1 Global Studio Fire Particles */

(function() {
    // 1. Automatically create and inject the canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'studio-embers';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    // CHANGED: Bumped z-index to 60 so it floats over the sub-pages (layer 50)
    canvas.style.zIndex = '60'; 
    canvas.style.pointerEvents = 'none'; // Lets you click through the fire to the buttons
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // 2. Responsive sizing locks to screen dimensions
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // 3. The Ember Class Engine
    class Ember {
        constructor() {
            this.reset(true);
        }
        
        reset(randomY = false) {
            this.x = Math.random() * width;
            this.y = randomY ? Math.random() * height : height + 10;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = (Math.random() * 1.5 + 0.5) * -1; // Float upwards
            this.speedX = (Math.random() - 0.5) * 0.8;      // Gentle side drift
            this.opacity = Math.random() * 0.8 + 0.2;
            this.life = Math.random() * 100 + 50;
            
            // Generate colors ranging from vibrant yellow to deep orange
            this.hue = Math.floor(Math.random() * 30 + 15); 
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;
            
            // Fade out smoothly at the end of its life
            if (this.life < 30) this.opacity -= 0.03;
            
            // Reset the ember to the bottom if it floats off screen or fades out
            if (this.y < 0 || this.opacity <= 0) this.reset();
        }
        
        draw() {
            // Mobile-optimized glow effect using Radial Gradients
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
            gradient.addColorStop(0, `hsla(${this.hue}, 100%, 65%, ${this.opacity})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 100%, 40%, 0)`);
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // 4. Ignite the fire (45 particles is the sweet spot for a busy desk)
    for (let i = 0; i < 45; i++) {
        particles.push(new Ember());
    }

    // 5. Render Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
})();
