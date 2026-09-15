// Web Audio System (Synth Sound Effects for Bubble Shooter)
class SoundSynth {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playShoot() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.16);
        } catch (e) { }
    }

    playBounce() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.setValueAtTime(270, now + 0.03);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) { }
    }

    playPop(frequency = 400) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, now);
            osc.frequency.exponentialRampToValueAtTime(frequency * 2, now + 0.07);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.11);
        } catch (e) { }
    }

    playChainBreak() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(900, now);
            osc.frequency.exponentialRampToValueAtTime(1600, now + 0.04);
            osc.frequency.exponentialRampToValueAtTime(350, now + 0.14);

            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.2);
        } catch (e) { }
    }

    playBombExplosion() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;

            // 1. Heavy Punchy Sub-bass Impact / Boom
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(32, now + 0.38);

            gain.gain.setValueAtTime(0.42, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.48);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.50);

            // 2. Ultra-Satisfying Rapid 6-Bubble Pop Cascade (Crisp & Juicy Pop Chimes)
            const popNotes = [330.00, 440.00, 554.37, 659.25, 880.00, 1108.73, 1318.51];
            popNotes.forEach((freq, idx) => {
                const pOsc = this.ctx.createOscillator();
                const pGain = this.ctx.createGain();
                pOsc.type = 'sine';
                pOsc.frequency.setValueAtTime(freq, now + idx * 0.032);
                pOsc.frequency.exponentialRampToValueAtTime(freq * 1.6, now + idx * 0.032 + 0.06);

                pGain.gain.setValueAtTime(0.24, now + idx * 0.032);
                pGain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.032 + 0.22);

                pOsc.connect(pGain);
                pGain.connect(this.ctx.destination);
                pOsc.start(now + idx * 0.032);
                pOsc.stop(now + idx * 0.032 + 0.25);
            });

            // 3. Sparkling Metallic Shimmer Finish
            const sOsc = this.ctx.createOscillator();
            const sGain = this.ctx.createGain();
            sOsc.type = 'triangle';
            sOsc.frequency.setValueAtTime(1760, now + 0.1);
            sGain.gain.setValueAtTime(0.12, now + 0.1);
            sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            sOsc.connect(sGain);
            sGain.connect(this.ctx.destination);
            sOsc.start(now + 0.1);
            sOsc.stop(now + 0.42);
        } catch (e) { }
    }

    playFireBlast() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;

            // 1. Sizzling Roaring Flame Wave
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(550, now);
            osc.frequency.linearRampToValueAtTime(880, now + 0.12);
            osc.frequency.exponentialRampToValueAtTime(90, now + 0.4);
            gain.gain.setValueAtTime(0.32, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.48);

            // 2. Ultra-Satisfying Cascading Arpeggio Chimes for 12 burned bubbles
            const chord = [392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
            chord.forEach((freq, idx) => {
                const cOsc = this.ctx.createOscillator();
                const cGain = this.ctx.createGain();
                cOsc.type = 'sine';
                cOsc.frequency.setValueAtTime(freq, now + idx * 0.035);
                cGain.gain.setValueAtTime(0.16, now + idx * 0.035);
                cGain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.035 + 0.28);
                cOsc.connect(cGain);
                cGain.connect(this.ctx.destination);
                cOsc.start(now + idx * 0.035);
                cOsc.stop(now + idx * 0.035 + 0.32);
            });
        } catch (e) { }
    }

    playFireIgnite() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.26);

            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        } catch (e) { }
    }

    playDrop() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.linearRampToValueAtTime(120, now + 0.2);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.25);
        } catch (e) { }
    }

    playShift() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(90, now);
            osc.frequency.linearRampToValueAtTime(130, now + 0.25);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.32);
        } catch (e) { }
    }

    playVictory() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.1);
                gain.gain.setValueAtTime(0.16, now + idx * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.35);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + idx * 0.1);
                osc.stop(now + idx * 0.1 + 0.4);
            });
        } catch (e) { }
    }

    playGameOver() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [220, 180, 140, 100].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, now + idx * 0.15);
                gain.gain.setValueAtTime(0.2, now + idx * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.4);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + idx * 0.15);
                osc.stop(now + idx * 0.15 + 0.45);
            });
        } catch (e) { }
    }
}

// Particle System for popping effect
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 4 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 5 + 3;
        this.friction = 0.96;
        this.gravity = 0.12;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.025;

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.shadowBlur = 4;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Fiery Explosion / Blast Particle
class ExplosionParticle {
    constructor(x, y, isFire = false) {
        this.x = x;
        this.y = y;
        const colors = isFire
            ? ['#ff0033', '#ff6600', '#ffcc00', '#ffffff', '#ff3300']
            : ['#ff4500', '#ffa500', '#ffff00', '#333333', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.radius = Math.random() * 5 + 2.5;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 7 + 4;
        this.friction = 0.92;
        this.gravity = 0.15;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.02;

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Metal Spark Particle for chain breaking effect
class SparkParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        const sparkColors = ['#ffffff', '#e2e8f0', '#ffd700', '#cbd5e1', '#94a3b8'];
        this.color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
        this.radius = Math.random() * 3 + 1.5;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 6 + 3;
        this.friction = 0.93;
        this.gravity = 0.22;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.035;

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Falling Bubble Visual (for dropped orphans)
class FallingBubble {
    constructor(x, y, color, radius) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
        this.vy = Math.random() * 2 - 1;
        this.vx = Math.random() * 4 - 2;
        this.gravity = 0.35;
        this.alpha = 1.0;
    }

    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.03;
    }

    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;

        const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3,
            this.y - this.radius * 0.3,
            this.radius * 0.1,
            this.x,
            this.y,
            this.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.3, this.color + 'bb');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Confetti particle for Level Win celebration
class ConfettiParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        const colors = ['#ff007f', '#00e5ff', '#ffe600', '#00ff66', '#9d00ff', '#ff5500', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 8 + 4;
        this.vx = (Math.random() - 0.5) * 14;
        this.vy = -(Math.random() * 9 + 6);
        this.gravity = 0.28;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.25;
        this.alpha = 1;
        this.decay = Math.random() * 0.008 + 0.006;
    }

    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
        ctx.restore();
    }
}

// Helper to darken hex colors for realistic 3D shadow effect
function darkenColor(hex, percent) {
    if (hex && hex.startsWith('#')) {
        let num = parseInt(hex.slice(1), 16),
            amt = Math.round(2.55 * percent * 100),
            R = (num >> 16) - amt,
            G = (num >> 8 & 0x00FF) - amt,
            B = (num & 0x0000FF) - amt;
        R = R < 0 ? 0 : R > 255 ? 255 : R;
        G = G < 0 ? 0 : G > 255 ? 255 : G;
        B = B < 0 ? 0 : B > 255 ? 255 : B;
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }
    return hex;
}

// Bubble color palette
const BUBBLE_COLORS = [
    '#cc00cc', // Magenta/Pink
    '#00c800', // Green
    '#00ccff', // Cyan
    '#e60000', // Red
    '#ffe000', // Yellow
    '#0044ff', // Deep Blue
    '#ff6600'  // Vibrant Orange
];

// Helper to draw realistic metallic chain link
function drawChainLink(ctx, x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 3;

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = size * 0.36;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.72, size * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    const linkGrad = ctx.createLinearGradient(-size * 0.7, -size * 0.4, size * 0.7, size * 0.4);
    linkGrad.addColorStop(0, '#475569');
    linkGrad.addColorStop(0.3, '#f8fafc');
    linkGrad.addColorStop(0.7, '#94a3b8');
    linkGrad.addColorStop(1, '#1e293b');

    ctx.strokeStyle = linkGrad;
    ctx.lineWidth = size * 0.24;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = size * 0.08;
    ctx.beginPath();
    ctx.ellipse(-size * 0.1, -size * 0.1, size * 0.52, size * 0.24, 0, 0, Math.PI);
    ctx.stroke();

    ctx.restore();
}

// Helper to draw realistic brass/steel padlock
function drawPadlock(ctx, x, y, radius) {
    ctx.save();
    const lockW = radius * 0.75;
    const lockH = radius * 0.65;
    const shackleR = lockW * 0.35;

    // 1. Shackle
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = radius * 0.18;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y - lockH * 0.35, shackleR, Math.PI, 0, false);
    ctx.stroke();

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = radius * 0.10;
    ctx.beginPath();
    ctx.arc(x, y - lockH * 0.35, shackleR, Math.PI, 0, false);
    ctx.stroke();

    // 2. Lock body
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    const bodyGrad = ctx.createLinearGradient(x - lockW / 2, y, x + lockW / 2, y + lockH);
    bodyGrad.addColorStop(0, '#fef08a');
    bodyGrad.addColorStop(0.25, '#eab308');
    bodyGrad.addColorStop(0.8, '#a16207');
    bodyGrad.addColorStop(1, '#713f12');

    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.2;

    const rx = x - lockW / 2;
    const ry = y - lockH * 0.15;
    const br = 3;
    ctx.beginPath();
    ctx.moveTo(rx + br, ry);
    ctx.lineTo(rx + lockW - br, ry);
    ctx.quadraticCurveTo(rx + lockW, ry, rx + lockW, ry + br);
    ctx.lineTo(rx + lockW, ry + lockH - br);
    ctx.quadraticCurveTo(rx + lockW, ry + lockH, rx + lockW - br, ry + lockH);
    ctx.lineTo(rx + br, ry + lockH);
    ctx.quadraticCurveTo(rx, ry + lockH, rx, ry + lockH - br);
    ctx.lineTo(rx, ry + br);
    ctx.quadraticCurveTo(rx, ry, rx + br, ry);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Keyhole
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(x, ry + lockH * 0.42, radius * 0.09, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - radius * 0.05, ry + lockH * 0.42);
    ctx.lineTo(x + radius * 0.05, ry + lockH * 0.42);
    ctx.lineTo(x + radius * 0.07, ry + lockH * 0.72);
    ctx.lineTo(x - radius * 0.07, ry + lockH * 0.72);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

// Helper to draw realistic 3D glossy bubble, Bomb, or Fireball
function drawNeonBubble(ctx, x, y, radius, color, isChained = false, specialType = null) {
    ctx.save();

    // 1. Draw Bomb Special Bubble
    if (specialType === 'bomb') {
        ctx.shadowColor = 'rgba(255, 60, 0, 0.6)';
        ctx.shadowBlur = 10;

        const bombGrad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.05, x, y, radius);
        bombGrad.addColorStop(0, '#555555');
        bombGrad.addColorStop(0.3, '#222222');
        bombGrad.addColorStop(0.85, '#111111');
        bombGrad.addColorStop(1, '#050505');

        ctx.fillStyle = bombGrad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ff3300';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Bomb icon
        ctx.shadowBlur = 0;
        ctx.font = `${Math.round(radius * 1.15)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💣', x, y + 1);

        ctx.restore();
        return;
    }

    // 2. Draw Fire Special Bubble (Blazing realistic flames!)
    if (specialType === 'fire') {
        const time = performance.now() * 0.009;

        // Outer flickering flame tongues aura (aag lagi hui)
        for (let f = 0; f < 8; f++) {
            const flameAngle = (f / 8) * Math.PI * 2 + Math.sin(time + f) * 0.2;
            const flameDist = radius * (1.18 + Math.sin(time * 3.5 + f * 1.6) * 0.22);
            const fx = x + Math.cos(flameAngle) * flameDist;
            const fy = y + Math.sin(flameAngle) * flameDist;

            const flameGrad = ctx.createRadialGradient(x, y, radius * 0.3, fx, fy, radius * 0.7);
            flameGrad.addColorStop(0, 'rgba(255, 235, 50, 0.9)');
            flameGrad.addColorStop(0.45, 'rgba(255, 75, 0, 0.65)');
            flameGrad.addColorStop(1, 'rgba(200, 0, 0, 0)');

            ctx.fillStyle = flameGrad;
            ctx.beginPath();
            ctx.arc(fx, fy, radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Radiant Glowing Plasma Fireball Core
        ctx.shadowColor = 'rgba(255, 85, 0, 0.95)';
        ctx.shadowBlur = 18;

        const fireGrad = ctx.createRadialGradient(x, y - radius * 0.2, radius * 0.05, x, y, radius * 1.05);
        fireGrad.addColorStop(0, '#ffffff');
        fireGrad.addColorStop(0.2, '#fff275');
        fireGrad.addColorStop(0.55, '#ff4500');
        fireGrad.addColorStop(0.88, '#d50000');
        fireGrad.addColorStop(1, '#500000');

        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.05, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fffb00';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Fire icon center
        ctx.shadowBlur = 0;
        ctx.font = `${Math.round(radius * 1.25)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔥', x, y);

        ctx.restore();
        return;
    }

    if (!color) {
        ctx.restore();
        return;
    }

    // Draw normal bubble base sphere with 3D gradient
    const gradient = ctx.createRadialGradient(
        x - radius * 0.25,
        y - radius * 0.25,
        radius * 0.05,
        x,
        y,
        radius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(0.2, color);
    gradient.addColorStop(0.85, darkenColor(color, 0.25));
    gradient.addColorStop(1, darkenColor(color, 0.45));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius - 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Subtle dark boundary stroke
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // High gloss white reflection highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.ellipse(
        x - radius * 0.35,
        y - radius * 0.35,
        radius * 0.22,
        radius * 0.11,
        Math.PI / 4,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // If bubble is chained, draw realistic metallic chains & brass padlock ⛓️
    if (isChained) {
        const linkSize = radius * 0.40;
        // Diagonal 1 chain links
        drawChainLink(ctx, x - radius * 0.52, y - radius * 0.52, linkSize, Math.PI / 4);
        drawChainLink(ctx, x - radius * 0.26, y - radius * 0.26, linkSize, Math.PI / 4);
        drawChainLink(ctx, x + radius * 0.26, y + radius * 0.26, linkSize, Math.PI / 4);
        drawChainLink(ctx, x + radius * 0.52, y + radius * 0.52, linkSize, Math.PI / 4);

        // Diagonal 2 chain links
        drawChainLink(ctx, x + radius * 0.52, y - radius * 0.52, linkSize, -Math.PI / 4);
        drawChainLink(ctx, x + radius * 0.26, y - radius * 0.26, linkSize, -Math.PI / 4);
        drawChainLink(ctx, x - radius * 0.26, y + radius * 0.26, linkSize, -Math.PI / 4);
        drawChainLink(ctx, x - radius * 0.52, y + radius * 0.52, linkSize, -Math.PI / 4);

        // Center authentic 3D brass padlock
        drawPadlock(ctx, x, y, radius);
    }

    ctx.restore();
}

// Game Core Controller
class BubbleGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.synth = new SoundSynth();

        // Game Configuration Constants
        this.NUM_COLS = 15; // 15 columns for compact arcade bubble size
        this.MAX_ROWS = 14;
        this.DEADLINE_ROW = 11; // Tighter danger line for real tension
        this.maxCampaignLevels = 10;

        // Game states
        this.isPlaying = false;
        this.isPaused = false;
        this.score = 0;
        this.combo = 1;
        this.comboTimeout = null;
        this.level = 1;

        // Power-ups state (2 Bombs & 1 Fire per level)
        this.bombsCount = 2;
        this.fireCount = 1;
        this.activeSpecial = null; // 'bomb', 'fire', or null

        // Misses remaining indicator
        this.missesRemaining = 3;
        this.currentMaxMisses = 3;

        // Launcher states
        this.launcherX = 0;
        this.launcherY = 0;
        this.aimAngle = -Math.PI / 2;
        this.activeColor = '';
        this.nextColor = '';

        // Bullet state
        this.bullet = null; // { x, y, vx, vy, color, radius, specialType }

        // Grid Array (2D array of { color, chained } or null)
        this.grid = [];

        // Visual items
        this.particles = [];
        this.fallingBubbles = [];
        this.confetti = [];

        // Dynamic scaling
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // High Scores setup
        this.highScoreArcade = parseInt(localStorage.getItem('bubble_high_arcade')) || 0;
        const hsEl = document.getElementById('high-score-arcade');
        if (hsEl) hsEl.innerText = this.highScoreArcade;

        this.initDOM();
    }

    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Match buffer size to device resolution
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        // Reset scale and apply dpr scale
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);

        // Define outer margins for the play area box
        this.playAreaX = 14;
        this.playAreaY = 62; // Offset below top HUD bar
        this.playAreaWidth = rect.width - 28;
        this.playAreaHeight = rect.height - 140;

        // Smaller, compact bubble dimensions (15 columns)
        this.bubbleRadius = this.playAreaWidth / (this.NUM_COLS * 2);
        this.rowHeight = this.bubbleRadius * 2 * Math.sin(Math.PI / 3);

        // Align launcher center perfectly at bottom center
        this.launcherX = rect.width / 2;
        this.launcherY = rect.height - 45;
    }

    initDOM() {
        // Main Menu Play button
        const playBtn = document.getElementById('btn-play');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.synth.init();
                this.startNewGame(1);
            });
        }

        // In-game Exit button
        const exitBtn = document.getElementById('btn-exit');
        if (exitBtn) {
            exitBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.exitToMenu();
            });
        }

        // Power-up: Bomb button
        const bombBtn = document.getElementById('btn-power-bomb');
        if (bombBtn) {
            bombBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.isPlaying || this.isPaused || this.bullet) return;
                if (this.bombsCount > 0) {
                    this.activeSpecial = (this.activeSpecial === 'bomb') ? null : 'bomb';
                    this.updatePowerupUI();
                    if (this.activeSpecial === 'bomb') {
                        this.synth.playPop(180);
                        for (let i = 0; i < 15; i++) {
                            this.particles.push(new SparkParticle(this.launcherX, this.launcherY));
                        }
                        this.triggerAlert('💣 BOMB LOADED! (DESTROYS 6 BUBBLES)');
                    }
                }
            });
        }

        // Power-up: Fire button (Immediately ignites the launcher bubble with flames!)
        const fireBtn = document.getElementById('btn-power-fire');
        if (fireBtn) {
            fireBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.isPlaying || this.isPaused || this.bullet) return;
                if (this.fireCount > 0) {
                    this.activeSpecial = (this.activeSpecial === 'fire') ? null : 'fire';
                    this.updatePowerupUI();
                    if (this.activeSpecial === 'fire') {
                        this.synth.playFireIgnite();
                        // Immediate dramatic ignition flame burst right on the bubble!
                        for (let i = 0; i < 25; i++) {
                            this.particles.push(new ExplosionParticle(this.launcherX, this.launcherY, true));
                        }
                        this.triggerAlert('🔥 BUBBLE ON FIRE! (BURNS 12 BUBBLES)');
                    }
                }
            });
        }

        // Pause / Resume actions
        const pauseBtn = document.getElementById('btn-pause');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseGame());
        }
        const resumeBtn = document.getElementById('btn-resume');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => this.resumeGame());
        }

        // Mute / Unmute
        const soundBtn = document.getElementById('btn-sound');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                this.synth.muted = !this.synth.muted;
                const soundIcon = document.getElementById('sound-icon');
                if (soundIcon) soundIcon.innerText = this.synth.muted ? '🔇' : '🔊';
                soundBtn.style.borderColor = this.synth.muted ? 'rgba(255,0,0,0.3)' : 'rgba(0,0,0,0.08)';
            });
        }

        // Pause Overlay Navigation
        document.getElementById('btn-restart-pause').addEventListener('click', () => {
            this.resumeGame();
            this.startNewGame(this.level);
        });
        document.getElementById('btn-menu-pause').addEventListener('click', () => {
            this.resumeGame();
            this.exitToMenu();
        });

        // Win Overlay Navigation
        document.getElementById('btn-next-level').addEventListener('click', () => {
            this.hideOverlay('win-screen');
            if (this.level >= this.maxCampaignLevels) {
                this.startNewGame(1);
            } else {
                this.startNewGame(this.level + 1);
            }
        });
        document.getElementById('btn-restart-win').addEventListener('click', () => {
            this.hideOverlay('win-screen');
            this.startNewGame(this.level);
        });
        document.getElementById('btn-menu-win').addEventListener('click', () => {
            this.hideOverlay('win-screen');
            this.exitToMenu();
        });

        // Game Over Overlay Navigation
        document.getElementById('btn-restart-over').addEventListener('click', () => {
            this.hideOverlay('game-over-screen');
            this.startNewGame(1);
        });
        document.getElementById('btn-menu-over').addEventListener('click', () => {
            this.hideOverlay('game-over-screen');
            this.exitToMenu();
        });

        // Pointer / Touch Aiming & Shooting
        const updateAim = (clientX, clientY) => {
            if (!this.isPlaying || this.isPaused || this.bullet) return;
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = clientX - rect.left;
            const mouseY = clientY - rect.top;

            const rawAngle = Math.atan2(mouseY - this.launcherY, mouseX - this.launcherX);
            this.aimAngle = Math.max(-Math.PI + 0.15, Math.min(-0.15, rawAngle));
        };

        const handlePointerMove = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            updateAim(clientX, clientY);
        };

        const handlePointerClick = (e) => {
            if (!this.isPlaying || this.isPaused || this.bullet) return;
            e.preventDefault();
            const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
            updateAim(clientX, clientY);
            this.shoot();
        };

        this.canvas.addEventListener('mousemove', handlePointerMove);
        this.canvas.addEventListener('touchmove', handlePointerMove, { passive: true });
        this.canvas.addEventListener('mousedown', handlePointerClick);
        this.canvas.addEventListener('touchstart', (e) => {
            const clientX = e.touches[0].clientX;
            const clientY = e.touches[0].clientY;
            updateAim(clientX, clientY);
        }, { passive: true });
        this.canvas.addEventListener('touchend', handlePointerClick, { passive: false });
    }

    updatePowerupUI() {
        const bombCountEl = document.getElementById('bomb-count');
        const fireCountEl = document.getElementById('fire-count');
        const bombBtn = document.getElementById('btn-power-bomb');
        const fireBtn = document.getElementById('btn-power-fire');

        if (bombCountEl) {
            if (this.bombsCount > 0) {
                bombCountEl.style.display = 'flex';
                bombCountEl.innerText = this.bombsCount;
            } else {
                bombCountEl.style.display = 'none'; // Zero nahi aayega
            }
        }

        if (fireCountEl) {
            if (this.fireCount > 0) {
                fireCountEl.style.display = 'flex';
                fireCountEl.innerText = this.fireCount;
            } else {
                fireCountEl.style.display = 'none'; // Zero nahi aayega
            }
        }

        if (bombBtn) {
            bombBtn.classList.toggle('armed', this.activeSpecial === 'bomb');
            bombBtn.classList.toggle('disabled', this.bombsCount <= 0);
        }
        if (fireBtn) {
            fireBtn.classList.toggle('armed', this.activeSpecial === 'fire');
            fireBtn.classList.toggle('disabled', this.fireCount <= 0);
        }
    }

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    showOverlay(overlayId) {
        document.getElementById(overlayId).classList.add('active');
    }

    hideOverlay(overlayId) {
        document.getElementById(overlayId).classList.remove('active');
    }

    startNewGame(level = 1) {
        this.level = level;
        if (level === 1) {
            this.score = 0;
        }
        this.isPlaying = true;
        this.isPaused = false;
        this.combo = 1;
        this.bullet = null;
        this.particles = [];
        this.fallingBubbles = [];
        this.confetti = [];

        // Reset Power-ups per level
        this.bombsCount = 2;
        this.fireCount = 1;
        this.activeSpecial = null;
        this.updatePowerupUI();

        // Hide all overlays
        this.hideOverlay('pause-screen');
        this.hideOverlay('win-screen');
        this.hideOverlay('game-over-screen');

        // Load Grid for the current level
        this.loadLevelGrid();

        // Initialize colors
        this.activeColor = this.getRandomExistingColor();
        this.nextColor = this.getRandomExistingColor();

        this.updateHUD();
        this.switchScreen('game-screen');

        if (this.level === 2) {
            this.triggerAlert('LEVEL 2: ⛓️ CHAINED BUBBLES UNLOCKED!');
        } else {
            this.triggerAlert(`LEVEL ${this.level} START! 🎯`);
        }

        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    loadLevelGrid() {
        this.grid = [];
        const TARGET_BUBBLES = 88; // Exactly 88 fixed bubbles per level
        let placedCount = 0;

        let colorsCount = (this.level === 1) ? 5 : (this.level === 2) ? 6 : 7;
        const activeColors = BUBBLE_COLORS.slice(0, colorsCount);

        this.currentMaxMisses = 3;
        this.missesRemaining = 3;

        let clusterColor = activeColors[Math.floor(Math.random() * activeColors.length)];
        let clusterLen = Math.floor(Math.random() * 2) + 1; // Singles and pairs

        for (let row = 0; row < this.MAX_ROWS; row++) {
            const cols = this.getGridColCount(row);
            const rowData = [];

            for (let col = 0; col < cols; col++) {
                if (placedCount < TARGET_BUBBLES) {
                    if (clusterLen <= 0) {
                        const otherColors = activeColors.filter(c => c !== clusterColor);
                        clusterColor = (otherColors.length > 0) ? otherColors[Math.floor(Math.random() * otherColors.length)] : activeColors[0];
                        clusterLen = Math.floor(Math.random() * 2) + 1;
                    }

                    // Level 1 has NO chains! Chains begin from Level 2 onwards
                    let isChained = false;
                    if (this.level >= 2 && row >= 1) {
                        const chainChance = (this.level === 2) ? 0.22 : (this.level === 3) ? 0.30 : Math.min(0.45, 0.35 + (this.level - 3) * 0.04);
                        isChained = Math.random() < chainChance;
                    }

                    rowData.push({
                        color: clusterColor,
                        chained: isChained
                    });
                    placedCount++;
                    clusterLen--;
                } else {
                    rowData.push(null);
                }
            }
            this.grid.push(rowData);
        }
    }

    getGridColCount(row) {
        return (row % 2 === 0) ? this.NUM_COLS : this.NUM_COLS - 1;
    }

    getBubbleCoords(row, col) {
        const offset = (row % 2 === 0) ? 0 : this.bubbleRadius;
        const x = this.playAreaX + col * this.bubbleRadius * 2 + this.bubbleRadius + offset;
        const y = this.playAreaY + row * this.rowHeight + this.bubbleRadius;
        return { x, y };
    }

    countRemainingBubbles() {
        let count = 0;
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                if (this.grid[r][c] && this.grid[r][c].color) count++;
            }
        }
        return count;
    }

    getRandomExistingColor() {
        const allExistingColors = [];

        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                const cell = this.grid[r][c];
                if (cell && cell.color) {
                    allExistingColors.push(cell.color);
                }
            }
        }

        if (allExistingColors.length > 0) {
            return allExistingColors[Math.floor(Math.random() * allExistingColors.length)];
        }
        return BUBBLE_COLORS[0];
    }

    exitToMenu() {
        this.isPlaying = false;
        this.hideOverlay('pause-screen');
        this.hideOverlay('win-screen');
        this.hideOverlay('game-over-screen');
        this.switchScreen('main-menu');
        const hsEl = document.getElementById('high-score-arcade');
        if (hsEl) hsEl.innerText = this.highScoreArcade;
    }

    pauseGame() {
        if (!this.isPlaying || this.isPaused) return;
        this.isPaused = true;
        this.showOverlay('pause-screen');
    }

    resumeGame() {
        if (!this.isPaused) return;
        this.isPaused = false;
        this.hideOverlay('pause-screen');
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    shoot() {
        if (this.bullet) return;
        const speed = 32;

        const firingSpecial = this.activeSpecial; // 'bomb', 'fire', or null
        if (firingSpecial === 'bomb') {
            this.bombsCount--;
        } else if (firingSpecial === 'fire') {
            this.fireCount--;
        }

        this.activeSpecial = null;
        this.updatePowerupUI();

        this.bullet = {
            x: this.launcherX,
            y: this.launcherY,
            vx: Math.cos(this.aimAngle) * speed,
            vy: Math.sin(this.aimAngle) * speed,
            color: this.activeColor,
            radius: this.bubbleRadius,
            specialType: firingSpecial
        };
        this.synth.playShoot();
    }

    // Main Loop
    gameLoop(timestamp) {
        if (!this.isPlaying || this.isPaused) return;

        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Update falling bubbles
        for (let i = this.fallingBubbles.length - 1; i >= 0; i--) {
            this.fallingBubbles[i].update();
            if (this.fallingBubbles[i].alpha <= 0) {
                this.fallingBubbles.splice(i, 1);
            }
        }

        // Update confetti
        for (let i = this.confetti.length - 1; i >= 0; i--) {
            this.confetti[i].update();
            if (this.confetti[i].alpha <= 0) {
                this.confetti.splice(i, 1);
            }
        }

        // Ambient fire particles on launcher bubble when Fire is selected
        if (this.activeSpecial === 'fire' && !this.bullet && Math.random() < 0.65) {
            this.particles.push(new ExplosionParticle(
                this.launcherX + (Math.random() - 0.5) * (this.bubbleRadius * 1.5),
                this.launcherY + (Math.random() - 0.5) * (this.bubbleRadius * 1.2),
                true
            ));
        }

        // Update active bullet
        if (this.bullet) {
            this.bullet.x += this.bullet.vx;
            this.bullet.y += this.bullet.vy;

            // Spawn blazing flame trail if Fire bullet or spark smoke for Bomb
            if (this.bullet.specialType === 'fire') {
                for (let i = 0; i < 3; i++) {
                    this.particles.push(new ExplosionParticle(this.bullet.x + (Math.random() - 0.5) * 12, this.bullet.y + (Math.random() - 0.5) * 12, true));
                }
            } else if (this.bullet.specialType === 'bomb') {
                for (let i = 0; i < 2; i++) {
                    this.particles.push(new ExplosionParticle(this.bullet.x, this.bullet.y, false));
                }
            }

            // Bounce off left & right play area walls
            const minX = this.playAreaX + this.bullet.radius;
            const maxX = this.playAreaX + this.playAreaWidth - this.bullet.radius;
            if (this.bullet.x <= minX) {
                this.bullet.x = minX;
                this.bullet.vx = -this.bullet.vx;
                this.synth.playBounce();
            } else if (this.bullet.x >= maxX) {
                this.bullet.x = maxX;
                this.bullet.vx = -this.bullet.vx;
                this.synth.playBounce();
            }

            // Check collision with ceiling of play area or other bubbles
            if (this.bullet.y - this.bullet.radius <= this.playAreaY || this.checkGridCollision(this.bullet)) {
                this.snapBullet(this.bullet);
                this.bullet = null;
            }
        }
    }

    checkGridCollision(bullet) {
        const thresholdDist = (this.bubbleRadius * 2) * 0.88;
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                if (this.grid[r][c]) {
                    const coords = this.getBubbleCoords(r, c);
                    const dist = Math.hypot(bullet.x - coords.x, bullet.y - coords.y);
                    if (dist < thresholdDist) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    snapBullet(bullet) {
        let bestRow = 0;
        let bestCol = 0;
        let minDist = Infinity;

        // Find nearest slot
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                if (!this.grid[r][c]) {
                    const coords = this.getBubbleCoords(r, c);
                    const dist = Math.hypot(bullet.x - coords.x, bullet.y - coords.y);
                    if (dist < minDist) {
                        minDist = dist;
                        bestRow = r;
                        bestCol = c;
                    }
                }
            }
        }

        const impactCoords = this.getBubbleCoords(bestRow, bestCol);

        // ==========================================
        // 1. SPECIAL POWER-UP: BOMB (DESTROYS 6 BUBBLES)
        // ==========================================
        if (bullet.specialType === 'bomb') {
            const allBubbles = [];
            for (let r = 0; r < this.grid.length; r++) {
                for (let c = 0; c < this.grid[r].length; c++) {
                    if (this.grid[r][c]) {
                        const coords = this.getBubbleCoords(r, c);
                        const dist = Math.hypot(impactCoords.x - coords.x, impactCoords.y - coords.y);
                        allBubbles.push({ r, c, dist, coords, color: this.grid[r][c].color });
                    }
                }
            }
            // Sort by nearest to bomb impact
            allBubbles.sort((a, b) => a.dist - b.dist);
            const targetsToDestroy = allBubbles.slice(0, 6);

            targetsToDestroy.forEach(({ r, c, coords }) => {
                for (let i = 0; i < 15; i++) {
                    this.particles.push(new ExplosionParticle(coords.x, coords.y, false));
                }
                this.grid[r][c] = null;
            });

            this.dropOrphans();
            this.synth.playBombExplosion();
            this.triggerAlert(`💣 BOMB! ${targetsToDestroy.length} BUBBLES DESTROYED! 💥`);
            this.score += targetsToDestroy.length * 40 * this.level;
            this.updateHUD();

            if (this.checkWin()) {
                this.onLevelWin();
                return;
            }

            this.activeColor = this.nextColor;
            this.nextColor = this.getRandomExistingColor();
            return;
        }

        // ==========================================
        // 2. SPECIAL POWER-UP: FIRE (BURNS 12 BUBBLES)
        // ==========================================
        if (bullet.specialType === 'fire') {
            const allBubbles = [];
            for (let r = 0; r < this.grid.length; r++) {
                for (let c = 0; c < this.grid[r].length; c++) {
                    if (this.grid[r][c]) {
                        const coords = this.getBubbleCoords(r, c);
                        const dist = Math.hypot(impactCoords.x - coords.x, impactCoords.y - coords.y);
                        allBubbles.push({ r, c, dist, coords, color: this.grid[r][c].color });
                    }
                }
            }
            allBubbles.sort((a, b) => a.dist - b.dist);
            const targetsToDestroy = allBubbles.slice(0, 12);

            targetsToDestroy.forEach(({ r, c, coords }) => {
                for (let i = 0; i < 18; i++) {
                    this.particles.push(new ExplosionParticle(coords.x, coords.y, true));
                }
                this.grid[r][c] = null;
            });

            this.dropOrphans();
            this.synth.playFireBlast();
            this.triggerAlert(`🔥 FIREBLAST! ${targetsToDestroy.length} BUBBLES BURNED! 🔥`);
            this.score += targetsToDestroy.length * 45 * this.level;
            this.updateHUD();

            if (this.checkWin()) {
                this.onLevelWin();
                return;
            }

            this.activeColor = this.nextColor;
            this.nextColor = this.getRandomExistingColor();
            return;
        }

        // ==========================================
        // 3. NORMAL SHOT (COLOR MATCH-3)
        // ==========================================
        this.grid[bestRow][bestCol] = {
            color: bullet.color,
            chained: false
        };

        const matches = this.findMatches(bestRow, bestCol, bullet.color);
        let poppedOrBroken = false;
        if (matches.length >= 3) {
            const result = this.popMatches(matches);
            this.dropOrphans();
            if (result.chainsBroken > 0) {
                this.synth.playChainBreak();
                this.triggerAlert(`CHAIN BROKEN! ⛓️💥`);
            } else {
                this.synth.playPop(450 + (matches.length * 30));
            }
            this.increaseCombo();
            poppedOrBroken = true;
        } else {
            this.resetCombo();
            this.synth.playPop(200);
        }

        this.updateHUD();

        // 1. Check Level WIN condition (All bubbles cleared!)
        if (this.checkWin()) {
            this.onLevelWin();
            return;
        }

        // 2. Check GAME OVER condition (Bubbles touched deadline!)
        if (this.checkGameOver()) {
            this.gameOver('Bubbles crossed the danger line!');
            return;
        }

        // Miss tracking: on 3 misses, the grid steps down 1 row closer to danger line!
        if (!poppedOrBroken) {
            this.missesRemaining--;
            if (this.missesRemaining <= 0) {
                this.missesRemaining = this.currentMaxMisses;

                // Shift existing grid down 1 row
                const emptyRow = new Array(this.getGridColCount(0)).fill(null);
                this.grid.unshift(emptyRow);
                this.grid.pop();

                this.synth.playShift();
                this.triggerAlert('WARNING: BUBBLES MOVING DOWN! ⚠️');

                if (this.checkGameOver()) {
                    this.gameOver('Bubbles crossed the danger line!');
                    return;
                }
            }
        }

        // Queue next colors
        this.activeColor = this.nextColor;
        this.nextColor = this.getRandomExistingColor();
    }

    findMatches(startRow, startCol, targetColor) {
        const queue = [[startRow, startCol]];
        const visited = new Set();
        const matches = [];

        visited.add(`${startRow},${startCol}`);

        while (queue.length > 0) {
            const [r, c] = queue.shift();
            matches.push({ r, c });

            const neighbors = this.getNeighbors(r, c);
            for (const [nr, nc] of neighbors) {
                if (
                    nr >= 0 && nr < this.grid.length &&
                    nc >= 0 && nc < this.grid[nr].length &&
                    this.grid[nr][nc] &&
                    this.grid[nr][nc].color === targetColor &&
                    !visited.has(`${nr},${nc}`)
                ) {
                    visited.add(`${nr},${nc}`);
                    queue.push([nr, nc]);
                }
            }
        }
        return matches;
    }

    getNeighbors(r, c) {
        const neighbors = [];
        neighbors.push([r, c - 1]);
        neighbors.push([r, c + 1]);

        const isEven = (r % 2 === 0);
        if (isEven) {
            neighbors.push([r - 1, c - 1]);
            neighbors.push([r - 1, c]);
            neighbors.push([r + 1, c - 1]);
            neighbors.push([r + 1, c]);
        } else {
            neighbors.push([r - 1, c]);
            neighbors.push([r - 1, c + 1]);
            neighbors.push([r + 1, c]);
            neighbors.push([r + 1, c + 1]);
        }
        return neighbors;
    }

    popMatches(matches) {
        let chainsBroken = 0;
        let normalPopped = 0;

        matches.forEach(({ r, c }) => {
            const cell = this.grid[r][c];
            if (!cell) return;
            const coords = this.getBubbleCoords(r, c);

            if (cell.chained) {
                // Break Chain on this bubble
                cell.chained = false;
                chainsBroken++;
                for (let i = 0; i < 15; i++) {
                    this.particles.push(new SparkParticle(coords.x, coords.y));
                }
                this.score += 50 * this.combo * this.level;
            } else {
                // Normal Bubble Pop
                normalPopped++;
                for (let i = 0; i < 12; i++) {
                    this.particles.push(new Particle(coords.x, coords.y, cell.color));
                }
                this.grid[r][c] = null;
                this.score += 20 * this.combo * this.level;
            }
        });

        return { chainsBroken, normalPopped };
    }

    dropOrphans() {
        const visited = new Set();
        const queue = [];

        const cols = this.getGridColCount(0);
        for (let col = 0; col < cols; col++) {
            if (this.grid[0][col]) {
                visited.add(`0,${col}`);
                queue.push([0, col]);
            }
        }

        while (queue.length > 0) {
            const [r, c] = queue.shift();
            const neighbors = this.getNeighbors(r, c);
            for (const [nr, nc] of neighbors) {
                if (
                    nr >= 0 && nr < this.grid.length &&
                    nc >= 0 && nc < this.grid[nr].length &&
                    this.grid[nr][nc] &&
                    !visited.has(`${nr},${nc}`)
                ) {
                    visited.add(`${nr},${nc}`);
                    queue.push([nr, nc]);
                }
            }
        }

        let droppedCount = 0;
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                if (this.grid[r][c] && !visited.has(`${r},${c}`)) {
                    const cell = this.grid[r][c];
                    const coords = this.getBubbleCoords(r, c);

                    this.fallingBubbles.push(new FallingBubble(coords.x, coords.y, cell.color, this.bubbleRadius));
                    this.grid[r][c] = null;
                    this.score += 35 * this.combo * this.level;
                    droppedCount++;
                }
            }
        }

        if (droppedCount > 0) {
            this.synth.playDrop();
            this.triggerAlert(`DROPPED ${droppedCount} BUBBLES! 💥`);
        }
    }

    checkWin() {
        return this.countRemainingBubbles() === 0;
    }

    onLevelWin() {
        this.isPlaying = false;
        this.synth.playVictory();

        // Level bonus calculation
        const levelBonus = this.level * 500;
        this.score += levelBonus;

        // Spawn victory confetti particles
        const rect = this.canvas.getBoundingClientRect();
        for (let i = 0; i < 70; i++) {
            this.confetti.push(new ConfettiParticle(rect.width / 2, rect.height / 2));
        }

        // High Score Check
        let isNewHigh = false;
        if (this.score > this.highScoreArcade) {
            this.highScoreArcade = this.score;
            localStorage.setItem('bubble_high_arcade', this.score);
            isNewHigh = true;
        }

        // Update Win Modal content
        const winTitle = document.getElementById('win-title');
        const winSubtitle = document.getElementById('win-subtitle');
        const winLevelNum = document.getElementById('win-level-num');
        const winTotalScore = document.getElementById('win-total-score');
        const winBadge = document.getElementById('win-high-score-badge');
        const nextBtn = document.getElementById('btn-next-level');

        if (winLevelNum) winLevelNum.innerText = this.level;
        if (winTotalScore) winTotalScore.innerText = this.score;

        if (this.level >= this.maxCampaignLevels) {
            if (winTitle) winTitle.innerText = '🏆 YOU WON THE GAME!';
            if (winSubtitle) winSubtitle.innerText = `Outstanding! You conquered all ${this.maxCampaignLevels} levels!`;
            if (nextBtn) nextBtn.innerHTML = '<span>🔄</span> Play Again';
        } else {
            if (winTitle) winTitle.innerText = `Level ${this.level} Cleared!`;
            if (winSubtitle) winSubtitle.innerText = `Awesome! Level Clear Bonus: +${levelBonus} PTS`;
            if (nextBtn) nextBtn.innerHTML = `<span>▶</span> Next Level (${this.level + 1})`;
        }

        if (winBadge) {
            if (isNewHigh) winBadge.classList.remove('hidden');
            else winBadge.classList.add('hidden');
        }

        this.showOverlay('win-screen');
    }

    checkGameOver() {
        for (let r = this.DEADLINE_ROW; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                if (this.grid[r][c]) {
                    return true;
                }
            }
        }
        return false;
    }

    gameOver(reason) {
        this.isPlaying = false;
        this.synth.playGameOver();

        let isNewHigh = false;
        if (this.score > this.highScoreArcade) {
            this.highScoreArcade = this.score;
            localStorage.setItem('bubble_high_arcade', this.score);
            isNewHigh = true;
        }

        const reasonEl = document.getElementById('game-over-reason');
        if (reasonEl) reasonEl.innerText = reason;
        const overLevelEl = document.getElementById('over-level-reached');
        if (overLevelEl) overLevelEl.innerText = this.level;
        const finalScoreEl = document.getElementById('final-score-val');
        if (finalScoreEl) finalScoreEl.innerText = this.score;

        const badge = document.getElementById('new-high-score-badge');
        if (badge) {
            if (isNewHigh) badge.classList.remove('hidden');
            else badge.classList.add('hidden');
        }

        this.showOverlay('game-over-screen');
    }

    updateHUD() {
        const scoreEl = document.getElementById('current-score');
        const levelEl = document.getElementById('current-level');
        const bubblesEl = document.getElementById('remaining-bubbles');
        if (scoreEl) scoreEl.innerText = this.score;
        if (levelEl) levelEl.innerText = this.level;
        if (bubblesEl) bubblesEl.innerText = this.countRemainingBubbles();
    }

    increaseCombo() {
        clearTimeout(this.comboTimeout);
        this.combo++;

        if (this.combo > 2) {
            this.triggerAlert(`COMBO x${this.combo}! 🔥`);
        }

        this.comboTimeout = setTimeout(() => {
            this.resetCombo();
        }, 2200);
    }

    resetCombo() {
        this.combo = 1;
    }

    triggerAlert(text) {
        const container = document.getElementById('game-alert-container');
        if (!container) return;
        const alert = document.createElement('div');
        alert.className = 'game-alert';
        alert.innerText = text;
        container.appendChild(alert);

        setTimeout(() => alert.remove(), 850);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 1. Draw Play Area rounded panel
        this.drawPlayArea();

        // 2. Draw Deadline Danger Line inside the play area
        const dlCoords = this.getBubbleCoords(this.DEADLINE_ROW, 0);
        const warningY = dlCoords.y - this.bubbleRadius;

        // Show warning line if bubbles are approaching the danger zone
        let showWarning = false;
        for (let r = this.DEADLINE_ROW - 3; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                if (this.grid[r][c]) {
                    showWarning = true;
                    break;
                }
            }
        }

        if (showWarning) {
            this.ctx.save();
            this.ctx.strokeStyle = 'rgba(255, 0, 50, 0.55)';
            this.ctx.lineWidth = 2.5;
            this.ctx.setLineDash([6, 6]);
            this.ctx.beginPath();
            this.ctx.moveTo(this.playAreaX + 5, warningY);
            this.ctx.lineTo(this.playAreaX + this.playAreaWidth - 5, warningY);
            this.ctx.stroke();
            this.ctx.restore();
        }

        // 3. Draw Grid Bubbles (clipped to play area)
        this.ctx.save();
        const r = 20;
        const x = this.playAreaX;
        const y = this.playAreaY;
        const w = this.playAreaWidth;
        const h = this.playAreaHeight;
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.lineTo(x + w - r, y);
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        this.ctx.lineTo(x + w, y + h - r);
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.ctx.lineTo(x + r, y + h);
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        this.ctx.lineTo(x, y + r);
        this.ctx.quadraticCurveTo(x, y, x + r, y);
        this.ctx.closePath();
        this.ctx.clip();

        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                const cell = this.grid[r][c];
                if (cell) {
                    const coords = this.getBubbleCoords(r, c);
                    drawNeonBubble(this.ctx, coords.x, coords.y, this.bubbleRadius, cell.color, cell.chained, null);
                }
            }
        }
        this.ctx.restore();

        // 4. Draw Aiming Arrow Pointer Guide
        if (!this.bullet && this.isPlaying) {
            this.drawAimingArrow();
        }

        // 5. Draw Launcher (Active shooter bubble, next bubble, and fouls indicator)
        this.drawLauncher();

        // 6. Draw Active Bullet
        if (this.bullet) {
            drawNeonBubble(this.ctx, this.bullet.x, this.bullet.y, this.bullet.radius, this.bullet.color, false, this.bullet.specialType);
        }

        // 7. Draw Particles, Falling Bubbles & Confetti
        this.particles.forEach(p => p.draw(this.ctx));
        this.fallingBubbles.forEach(fb => fb.draw(this.ctx));
        this.confetti.forEach(c => c.draw(this.ctx));
    }

    drawPlayArea() {
        this.ctx.save();

        this.ctx.fillStyle = '#b5beff';
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 3;

        const r = 20;
        const x = this.playAreaX;
        const y = this.playAreaY;
        const w = this.playAreaWidth;
        const h = this.playAreaHeight;

        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.lineTo(x + w - r, y);
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        this.ctx.lineTo(x + w, y + h - r);
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.ctx.lineTo(x + r, y + h);
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        this.ctx.lineTo(x, y + r);
        this.ctx.quadraticCurveTo(x, y, x + r, y);
        this.ctx.closePath();

        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawAimingArrow() {
        this.ctx.save();

        const arrowLength = 55;
        const px = this.launcherX + Math.cos(this.aimAngle) * arrowLength;
        const py = this.launcherY + Math.sin(this.aimAngle) * arrowLength;

        this.ctx.strokeStyle = '#8fa3ff';
        this.ctx.fillStyle = '#8fa3ff';
        this.ctx.lineWidth = 4.5;
        this.ctx.lineCap = 'round';

        // Draw shaft
        this.ctx.beginPath();
        this.ctx.moveTo(this.launcherX, this.launcherY);
        this.ctx.lineTo(px, py);
        this.ctx.stroke();

        // Draw arrowhead
        const arrowSize = 11;
        const angle = this.aimAngle;
        this.ctx.beginPath();
        this.ctx.moveTo(px, py);
        this.ctx.lineTo(px - arrowSize * Math.cos(angle - Math.PI / 6), py - arrowSize * Math.sin(angle - Math.PI / 6));
        this.ctx.lineTo(px - arrowSize * Math.cos(angle + Math.PI / 6), py - arrowSize * Math.sin(angle + Math.PI / 6));
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.restore();
    }

    drawLauncher() {
        this.ctx.save();

        const rect = this.canvas.getBoundingClientRect();
        const startX = 25;
        const startY = rect.height - 45;

        // Draw Next ammo bubble on the left
        drawNeonBubble(this.ctx, startX, startY, this.bubbleRadius * 0.95, this.nextColor, false, null);

        // Draw Misses / Fouls remaining indicators
        const maxSlots = Math.min(5, Math.max(2, this.currentMaxMisses || 3));
        for (let i = 0; i < maxSlots; i++) {
            const gx = startX + (i + 1) * this.bubbleRadius * 2.2;
            if (i < this.missesRemaining) {
                drawNeonBubble(this.ctx, gx, startY, this.bubbleRadius * 0.90, '#b0b0b0', false, null);
            } else {
                this.ctx.save();
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(gx, startY, this.bubbleRadius * 0.90, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.restore();
            }
        }

        // Draw Active Shooter Bubble (Shows armed Bomb or Fire icon if selected!)
        drawNeonBubble(
            this.ctx,
            this.launcherX,
            this.launcherY,
            this.bubbleRadius * 1.1,
            this.activeColor,
            false,
            this.activeSpecial
        );

        this.ctx.restore();
    }
}

// Start Game system on window load
window.addEventListener('DOMContentLoaded', () => {
    window.game = new BubbleGame();
});
