/**
 * Eye Pin Hit Game
 * Core Engine & Interactive Physics
 */

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initAudio();
  }

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playShoot() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1100, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playHit() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playFail() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    
    // Low harsh buzz
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(160, now);
    osc1.frequency.linearRampToValueAtTime(60, now + 0.35);

    gain1.gain.setValueAtTime(0.5, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Clash noise
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(190, now);
    osc2.frequency.linearRampToValueAtTime(80, now + 0.35);

    gain2.gain.setValueAtTime(0.4, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.35);
  }

  playWin() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  playAutoAdd() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const notes = [587.33, 880.00, 1174.66]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.07;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.18);
    });
  }
}

class Particle {
  constructor(x, y, color, speed, size, life, isShard = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const s = (Math.random() * 0.7 + 0.3) * speed;
    this.vx = Math.cos(angle) * s;
    this.vy = Math.sin(angle) * s;
    this.size = size;
    this.life = life;
    this.maxLife = life;
    this.isShard = isShard;
    this.rotation = Math.random() * Math.PI * 2;
    this.vRot = (Math.random() - 0.5) * 0.2;
    this.gravity = isShard ? 0.25 : 0.05;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life--;
    this.rotation += this.vRot;
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;

    if (this.isShard) {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

class EyeGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.container = document.getElementById('gameContainer');
    this.sound = new SoundSystem();

    // Responsive Canvas Resizing
    this.width = 400;
    this.height = 600;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Eyeball Properties
    this.eyeCenter = { x: this.width / 2, y: 195 };
    this.eyeRadius = 66;
    this.irisRadius = 38;
    this.pupilRadius = 24;
    this.rotationAngle = 0;
    this.rotationSpeed = 0.02;
    this.baseSpeed = 0.02;
    this.direction = 1;
    this.speedPattern = 'constant'; // constant, alternate, pulse
    this.patternTimer = 0;

    // Veins Data (Branching Pixel-Style Blood Vessels)
    this.generateVeins();

    // Pin Details
    this.pinLength = 52;
    this.pinWidth = 20;
    this.bottleHeight = 36;
    this.needleHeight = 16;
    this.collisionAngleThreshold = 0.26; // Radians (~15 deg)

    // Game State
    this.state = 'START'; // START, PLAYING, GAMEOVER, LEVEL_CLEARED
    this.level = 1; // Fresh launch always starts from Level 1
    this.score = 0;
    this.levelStartScore = 0;
    this.highScore = parseInt(localStorage.getItem('eyePinHighScore') || '0', 10);
    this.totalPinsForLevel = 6;
    this.remainingPins = 6;
    this.stuckPins = []; // Array of { angle, color, id }
    this.activeFlyingPin = null; // { x, y, vy }
    this.readyPinY = this.height - 75;

    // Chances / Lives System
    this.maxChances = 3;
    this.chances = 3;
    this.heartsBox = document.getElementById('heartsBox');

    // Pupil Gaze / Reactive eye
    this.pupilOffset = { x: 0, y: 0 };
    this.targetPupilOffset = { x: 0, y: 0 };

    // Particles
    this.particles = [];

    // UI Elements
    this.scoreEl = document.getElementById('scoreVal');
    this.stripeBarEl = document.getElementById('stripeBar');
    this.stageDotsEl = document.getElementById('stageDots');
    this.pinStackEl = document.getElementById('pinStack');
    this.startScreen = document.getElementById('startScreen');
    this.gameOverScreen = document.getElementById('gameOverScreen');
    this.levelClearedScreen = document.getElementById('levelClearedScreen');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');

    // Controls setup
    this.bindEvents();
    this.setupLevel(1);
    this.updateHUD();

    // Start Main Loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
    this.eyeCenter = { x: this.width / 2, y: this.height * 0.33 };
    this.readyPinY = this.height - 65;
  }

  generateVeins() {
    this.veins = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const baseAngle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const branches = [];
      const branchCount = Math.floor(Math.random() * 3) + 2;
      for (let b = 0; b < branchCount; b++) {
        branches.push({
          angleOffset: (Math.random() - 0.5) * 0.45,
          startRad: this.irisRadius + (b * 6) + Math.random() * 4,
          len: 12 + Math.random() * 14,
          width: 1.5 + Math.random() * 1.2
        });
      }
      this.veins.push({ baseAngle, branches });
    }
  }

  setupLevel(lvl) {
    this.level = lvl;
    const levelTitleEl = document.getElementById('levelTitle');
    if (levelTitleEl) {
      levelTitleEl.textContent = `STAGE ${this.level}`;
    }
    this.stuckPins = [];
    this.activeFlyingPin = null;

    // Config per Level
    const configs = [
      { pins: 6, prePins: 1, speed: 0.022, pattern: 'constant' },
      { pins: 7, prePins: 2, speed: 0.028, pattern: 'constant' },
      { pins: 8, prePins: 2, speed: 0.032, pattern: 'alternate' },
      { pins: 9, prePins: 3, speed: 0.036, pattern: 'pulse' },
      { pins: 10, prePins: 3, speed: 0.040, pattern: 'alternate' },
      { pins: 12, prePins: 4, speed: 0.045, pattern: 'pulse' },
    ];

    const currentConfig = configs[Math.min(lvl - 1, configs.length - 1)] || {
      pins: 8 + lvl,
      prePins: 3 + Math.floor(lvl / 2),
      speed: 0.03 + (lvl * 0.004),
      pattern: lvl % 2 === 0 ? 'alternate' : 'pulse'
    };

    this.totalPinsForLevel = currentConfig.pins;
    this.remainingPins = currentConfig.pins;
    this.baseSpeed = currentConfig.speed;
    this.rotationSpeed = this.baseSpeed;
    this.direction = 1;
    this.speedPattern = currentConfig.pattern;
    this.patternTimer = 0;

    // Pre-stuck pins distributed around the eye
    const preCount = currentConfig.prePins;
    const step = (Math.PI * 2) / preCount;
    for (let i = 0; i < preCount; i++) {
      const angle = (i * step) + (Math.random() - 0.5) * 0.3;
      this.stuckPins.push({ angle, id: `pre_${i}` });
    }

    this.buildPinStack();
    this.buildStripeBar();
    this.updateStageDots();
    this.updateHUD();
  }

  buildPinStack() {
    this.pinStackEl.innerHTML = '';
    for (let i = 0; i < this.remainingPins; i++) {
      const pinDiv = document.createElement('div');
      pinDiv.className = 'stack-pin-icon';
      this.pinStackEl.appendChild(pinDiv);
    }
  }

  popPinStack() {
    const pins = this.pinStackEl.querySelectorAll('.stack-pin-icon:not(.fired)');
    if (pins.length > 0) {
      const last = pins[pins.length - 1];
      last.classList.add('fired');
    }
  }

  buildStripeBar() {
    this.stripeBarEl.innerHTML = '';
    const totalSegments = 16;
    const progressSegments = Math.round(((this.totalPinsForLevel - this.remainingPins) / this.totalPinsForLevel) * totalSegments);
    for (let i = 0; i < totalSegments; i++) {
      const seg = document.createElement('div');
      seg.className = 'stripe-segment' + (i < progressSegments ? ' filled' : '');
      this.stripeBarEl.appendChild(seg);
    }
  }

  updateStageDots() {
    const dots = this.stageDotsEl.querySelectorAll('.dot');
    const currentMod = ((this.level - 1) % 5);
    dots.forEach((dot, idx) => {
      dot.className = 'dot';
      if (idx < currentMod) {
        dot.classList.add('completed');
      } else if (idx === currentMod) {
        dot.classList.add('active');
      }
    });
  }

  updateHUD() {
    this.scoreEl.textContent = this.score;

    // Update Chances / Hearts Display
    if (this.heartsBox) {
      this.heartsBox.innerHTML = '';
      for (let i = 0; i < this.maxChances; i++) {
        const span = document.createElement('span');
        const isAlive = i < this.chances;
        span.className = 'heart ' + (isAlive ? 'active' : 'lost');
        span.textContent = isAlive ? '❤️' : '🖤';
        this.heartsBox.appendChild(span);
      }
    }
  }

  showChanceLostToast(remaining) {
    const toast = document.createElement('div');
    toast.className = 'chance-toast';
    toast.innerHTML = `⚠️ CHANCE LOST!<br><span style="color:#fef08a;">${remaining} CHANCE${remaining > 1 ? 'S' : ''} LEFT ❤️</span>`;
    this.container.appendChild(toast);
    setTimeout(() => toast.remove(), 1200);
  }

  bindEvents() {
    const handleShootAction = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (this.state === 'PLAYING') {
        this.shootPin();
      }
    };

    // Canvas / Container click & touch
    this.canvas.addEventListener('pointerdown', handleShootAction);
    this.container.addEventListener('pointerdown', (e) => {
      if (e.target === this.canvas || e.target.id === 'gameContainer') {
        handleShootAction(e);
      }
    });

    // Keyboard Space / ArrowUp / Enter
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        if (this.state === 'PLAYING') {
          this.shootPin();
        } else if (this.state === 'GAMEOVER') {
          this.restartGame();
        } else if (this.state === 'LEVEL_CLEARED') {
          this.nextLevel();
        } else if (this.state === 'START') {
          this.startGame();
        }
      }
    });

    // UI Buttons
    document.getElementById('startBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.startGame();
    });

    document.getElementById('restartBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.restartGame();
    });

    const startOverBtn = document.getElementById('startOverBtn');
    if (startOverBtn) {
      startOverBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.startOver();
      });
    }

    const nextLevelBtn = document.getElementById('nextLevelBtn');
    if (nextLevelBtn) {
      nextLevelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextLevel();
      });
    }

    // Auto Bottle Buttons
    const autoBottleBtn = document.getElementById('autoBottleBtn');
    if (autoBottleBtn) {
      autoBottleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.autoAddBottle();
      });
    }

    const floatingAutoBtn = document.getElementById('floatingAutoBtn');
    if (floatingAutoBtn) {
      floatingAutoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.autoAddBottle();
      });
    }

    // Keyboard Shortcuts (A or B for Auto Bottle)
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyA' || e.code === 'KeyB') {
        this.autoAddBottle();
      }
    });

    this.soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const on = this.sound.toggle();
      this.soundToggleBtn.textContent = on ? '🔊' : '🔇';
    });
  }

  startGame() {
    this.sound.resume();
    this.state = 'PLAYING';
    this.level = 1; // Fresh start from main menu ALWAYS starts at Level 1!
    this.score = 0;
    this.levelStartScore = 0;
    this.chances = this.maxChances;
    this.startScreen.classList.remove('active');
    this.gameOverScreen.classList.remove('active');
    this.levelClearedScreen.classList.remove('active');
    this.setupLevel(1);
    this.updateHUD();
  }

  restartGame() {
    this.sound.resume();
    this.state = 'PLAYING';
    // Replay the SAME CURRENT LEVEL that player failed on!
    this.score = this.levelStartScore || 0;
    this.chances = this.maxChances;
    this.gameOverScreen.classList.remove('active');
    this.setupLevel(this.level);
    this.updateHUD();
  }

  startOver() {
    this.sound.resume();
    this.state = 'START';
    this.level = 1;
    this.score = 0;
    this.levelStartScore = 0;
    this.chances = this.maxChances;
    this.gameOverScreen.classList.remove('active');
    this.levelClearedScreen.classList.remove('active');
    this.startScreen.classList.add('active');
    this.setupLevel(1);
    this.updateHUD();
  }

  nextLevel() {
    this.state = 'PLAYING';
    this.levelClearedScreen.classList.remove('active');
    this.levelStartScore = this.score;
    this.chances = this.maxChances;
    this.setupLevel(this.level + 1);
    this.updateHUD();
  }

  autoAddBottle() {
    if (this.state !== 'PLAYING' || this.remainingPins <= 0 || this.activeFlyingPin) return;

    this.sound.playAutoAdd();

    // 1. Calculate the largest safe empty angle gap on the eyeball
    let bestAngle = 0;
    if (this.stuckPins.length === 0) {
      bestAngle = Math.PI / 2; // bottom
    } else {
      const angles = this.stuckPins.map(p => this.normalizeAngle(p.angle)).sort((a, b) => a - b);
      let maxGap = 0;
      let bestGapStart = 0;

      for (let i = 0; i < angles.length; i++) {
        const nextAngle = (i < angles.length - 1) ? angles[i + 1] : (angles[0] + Math.PI * 2);
        const gap = nextAngle - angles[i];
        if (gap > maxGap) {
          maxGap = gap;
          bestGapStart = angles[i];
        }
      }

      bestAngle = this.normalizeAngle(bestGapStart + maxGap / 2);
    }

    // 2. Add to stuck pins safely
    this.stuckPins.push({ angle: bestAngle, id: `auto_${Date.now()}` });
    this.remainingPins--;
    this.score += 100;
    this.popPinStack();
    this.buildStripeBar();
    this.updateHUD();

    // 3. Eyeball reactions & water sparkle burst
    this.targetPupilOffset = { x: 0, y: -4 };
    const currentAngle = bestAngle + this.rotationAngle;
    const px = this.eyeCenter.x + Math.cos(currentAngle) * (this.eyeRadius + 22);
    const py = this.eyeCenter.y + Math.sin(currentAngle) * (this.eyeRadius + 22);

    for (let i = 0; i < 22; i++) {
      const colors = ['#ffd700', '#38bdf8', '#22c55e', '#ffffff'];
      const color = colors[i % colors.length];
      this.particles.push(new Particle(px, py, color, 8, 3.5, 45, true));
    }

    // Floating notification toast
    const toast = document.createElement('div');
    toast.className = 'chance-toast';
    toast.style.borderColor = '#06b6d4';
    toast.style.background = 'rgba(6, 182, 212, 0.92)';
    toast.innerHTML = `🪄 AUTO BOTTLE ATTACHED!<br><span style="color:#ffffff;">+100 SCORE ✨</span>`;
    this.container.appendChild(toast);
    setTimeout(() => toast.remove(), 1100);

    // 4. Check if level complete
    if (this.remainingPins <= 0) {
      setTimeout(() => {
        this.triggerLevelWin();
      }, 400);
    }
  }

  shootPin() {
    if (this.activeFlyingPin || this.remainingPins <= 0) return;

    this.sound.playShoot();
    this.activeFlyingPin = {
      x: this.eyeCenter.x,
      y: this.readyPinY,
      vy: -26
    };

    // Eyeball looks down nervously at incoming pin!
    this.targetPupilOffset = { x: 0, y: 7 };

    this.popPinStack();
  }

  normalizeAngle(angle) {
    angle = angle % (Math.PI * 2);
    if (angle < 0) angle += Math.PI * 2;
    return angle;
  }

  getAngleDifference(a1, a2) {
    let diff = Math.abs(this.normalizeAngle(a1) - this.normalizeAngle(a2));
    if (diff > Math.PI) {
      diff = Math.PI * 2 - diff;
    }
    return diff;
  }

  triggerGameOver(reason) {
    this.state = 'GAMEOVER';
    this.sound.playFail();

    // Screen Shake & Red Flash
    this.container.classList.add('screen-shake');
    setTimeout(() => this.container.classList.remove('screen-shake'), 450);

    const flash = document.createElement('div');
    flash.className = 'red-flash-overlay';
    this.container.appendChild(flash);
    setTimeout(() => flash.remove(), 500);

    // Explode Pins into shards
    this.stuckPins.forEach(p => {
      const pinAngle = p.angle + this.rotationAngle;
      const x = this.eyeCenter.x + Math.cos(pinAngle) * (this.eyeRadius + 25);
      const y = this.eyeCenter.y + Math.sin(pinAngle) * (this.eyeRadius + 25);
      for (let i = 0; i < 4; i++) {
        this.particles.push(new Particle(x, y, '#f97316', 7, 3, 40, true));
        this.particles.push(new Particle(x, y, '#38bdf8', 6, 2.5, 35, true));
      }
    });

    // Eye blood burst
    for (let i = 0; i < 25; i++) {
      this.particles.push(new Particle(this.eyeCenter.x, this.eyeCenter.y, '#ef4444', 8, 3, 45));
    }

    // High Score Update
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('eyePinHighScore', this.highScore.toString());
    }

    document.getElementById('finalScore').textContent = this.score;
    document.getElementById('highScore').textContent = this.highScore;
    document.getElementById('finalStage').textContent = this.level;
    document.getElementById('gameOverReason').textContent = reason || 'Pins collided with each other!';
    const retryBtn = document.getElementById('restartBtn');
    if (retryBtn) {
      retryBtn.innerHTML = `<span class="btn-text">RETRY STAGE ${this.level} ↺</span>`;
    }

    setTimeout(() => {
      this.gameOverScreen.classList.add('active');
    }, 500);
  }

  triggerLevelWin() {
    this.state = 'LEVEL_CLEARED';
    this.sound.playWin();

    // Bonus score
    this.score += 500;
    this.updateHUD();

    // Confetti & Sparkles
    for (let i = 0; i < 60; i++) {
      const colors = ['#f59e0b', '#38bdf8', '#22c55e', '#ec4899', '#ffffff'];
      const c = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push(new Particle(
        this.eyeCenter.x + (Math.random() - 0.5) * 80,
        this.eyeCenter.y + (Math.random() - 0.5) * 80,
        c,
        9,
        3.5,
        50,
        true
      ));
    }

    document.getElementById('clearedStageNum').textContent = this.level;

    setTimeout(() => {
      this.levelClearedScreen.classList.add('active');
    }, 600);
  }

  updatePhysics() {
    // Eyeball Rotation Dynamics
    this.patternTimer++;
    if (this.speedPattern === 'alternate') {
      // Reverse direction every 180 frames (~3 sec)
      if (this.patternTimer % 170 === 0) {
        this.direction *= -1;
      }
      this.rotationSpeed = this.baseSpeed * this.direction;
    } else if (this.speedPattern === 'pulse') {
      // Pulsing speed acceleration & slowing
      this.rotationSpeed = (this.baseSpeed * (0.4 + 0.8 * Math.sin(this.patternTimer * 0.05))) * this.direction;
      if (this.patternTimer % 240 === 0) {
        this.direction *= -1;
      }
    } else {
      this.rotationSpeed = this.baseSpeed * this.direction;
    }

    this.rotationAngle += this.rotationSpeed;

    // Pupil reaction interpolation
    this.pupilOffset.x += (this.targetPupilOffset.x - this.pupilOffset.x) * 0.1;
    this.pupilOffset.y += (this.targetPupilOffset.y - this.pupilOffset.y) * 0.1;
    if (!this.activeFlyingPin) {
      this.targetPupilOffset = {
        x: Math.sin(this.patternTimer * 0.03) * 2,
        y: Math.cos(this.patternTimer * 0.02) * 1.5
      };
    }

    // Active Flying Pin Movement
    if (this.activeFlyingPin) {
      this.activeFlyingPin.y += this.activeFlyingPin.vy;

      // Check collision with Eyeball boundary
      const hitY = this.eyeCenter.y + this.eyeRadius;
      if (this.activeFlyingPin.y <= hitY) {
        // Pin has landed on the bottom point of the eyeball
        const hitAngleWorld = Math.PI / 2; // Bottom of circle is 90 deg (PI/2)
        const hitAngleEye = this.normalizeAngle(hitAngleWorld - this.rotationAngle);

        // Check Collision with any already stuck pins
        let collided = false;
        for (const stuck of this.stuckPins) {
          const diff = this.getAngleDifference(hitAngleEye, stuck.angle);
          if (diff < this.collisionAngleThreshold) {
            collided = true;
            break;
          }
        }

        if (collided) {
          if (this.chances > 1) {
            // Player has chances left: Deduct 1 chance and allow continuing
            this.chances--;
            this.sound.playFail();

            // Screen shake & red flash
            this.container.classList.add('screen-shake');
            setTimeout(() => this.container.classList.remove('screen-shake'), 400);

            const flash = document.createElement('div');
            flash.className = 'red-flash-overlay';
            this.container.appendChild(flash);
            setTimeout(() => flash.remove(), 400);

            // Explode colliding flying pin
            for (let i = 0; i < 15; i++) {
              this.particles.push(new Particle(this.eyeCenter.x, hitY, '#f97316', 7, 3, 30, true));
              this.particles.push(new Particle(this.eyeCenter.x, hitY, '#ef4444', 6, 2.5, 30, true));
            }

            this.showChanceLostToast(this.chances);
            this.activeFlyingPin = null;
            this.updateHUD();
            this.buildPinStack();
          } else {
            // All chances depleted -> GAME OUT
            this.chances = 0;
            this.updateHUD();
            this.triggerGameOver('Tamam chances khatam ho gaye!');
            this.activeFlyingPin = null;
          }
        } else {
          // Successful hit!
          this.sound.playHit();
          this.stuckPins.push({ angle: hitAngleEye, id: `pin_${Date.now()}` });
          this.activeFlyingPin = null;
          this.remainingPins--;
          this.score += 100;
          this.updateHUD();
          this.buildStripeBar();

          // Hit water drop sparkle effect
          for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle(
              this.eyeCenter.x,
              hitY,
              '#38bdf8',
              5,
              2,
              20
            ));
          }

          // Check Level Completion
          if (this.remainingPins <= 0) {
            this.triggerLevelWin();
          }
        }
      }
    }

    // Particles update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  drawEyeball() {
    const { x, y } = this.eyeCenter;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Outer Eyeball Sclera (White base with gradient shadow)
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.eyeRadius, 0, Math.PI * 2);
    const scleraGrad = this.ctx.createRadialGradient(0, -10, 10, 0, 0, this.eyeRadius);
    scleraGrad.addColorStop(0, '#ffffff');
    scleraGrad.addColorStop(0.8, '#e2e8f0');
    scleraGrad.addColorStop(1, '#94a3b8');
    this.ctx.fillStyle = scleraGrad;
    this.ctx.fill();

    this.ctx.lineWidth = 3.5;
    this.ctx.strokeStyle = '#1e1138';
    this.ctx.stroke();

    // Rotating Veins (Blood vessels branching out)
    this.ctx.save();
    this.ctx.rotate(this.rotationAngle);

    this.veins.forEach(v => {
      v.branches.forEach(b => {
        const startA = v.baseAngle + b.angleOffset;
        const x1 = Math.cos(startA) * b.startRad;
        const y1 = Math.sin(startA) * b.startRad;
        const x2 = Math.cos(startA + 0.1) * (b.startRad + b.len);
        const y2 = Math.sin(startA + 0.1) * (b.startRad + b.len);

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.quadraticCurveTo(
          (x1 + x2) / 2 + Math.sin(b.startRad) * 4,
          (y1 + y2) / 2 + Math.cos(b.startRad) * 4,
          x2,
          y2
        );
        this.ctx.strokeStyle = '#dc2626';
        this.ctx.lineWidth = b.width;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
      });
    });

    this.ctx.restore(); // End Veins rotation

    // Iris (Teal / Cyan Ring with depth)
    this.ctx.beginPath();
    this.ctx.arc(this.pupilOffset.x * 0.4, this.pupilOffset.y * 0.4, this.irisRadius, 0, Math.PI * 2);
    const irisGrad = this.ctx.createRadialGradient(
      this.pupilOffset.x * 0.4, this.pupilOffset.y * 0.4, 5,
      this.pupilOffset.x * 0.4, this.pupilOffset.y * 0.4, this.irisRadius
    );
    irisGrad.addColorStop(0, '#06b6d4');
    irisGrad.addColorStop(0.7, '#0891b2');
    irisGrad.addColorStop(1, '#164e63');
    this.ctx.fillStyle = irisGrad;
    this.ctx.fill();
    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = '#0e7490';
    this.ctx.stroke();

    // Pupil (Deep dark blue/black)
    this.ctx.beginPath();
    this.ctx.arc(this.pupilOffset.x, this.pupilOffset.y, this.pupilRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fill();

    // Eye Glint / Reflections (Big glint + small glint)
    this.ctx.beginPath();
    this.ctx.arc(this.pupilOffset.x + 9, this.pupilOffset.y - 1, 6.5, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(this.pupilOffset.x - 10, this.pupilOffset.y + 1, 3.5, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fill();

    this.ctx.restore();
  }

  drawBottle(x, y, angle) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);

    // Tip / Needle pointing outward towards the target
    this.ctx.fillStyle = '#cbd5e1';
    this.ctx.fillRect(-2, -this.pinLength, 4, this.needleHeight);

    // Dropper Nozzle / Stopper
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.beginPath();
    this.ctx.moveTo(-5, -this.bottleHeight);
    this.ctx.lineTo(5, -this.bottleHeight);
    this.ctx.lineTo(3, -this.bottleHeight - 6);
    this.ctx.lineTo(-3, -this.bottleHeight - 6);
    this.ctx.closePath();
    this.ctx.fill();

    // Bottle Body (Cyan Glass Bottle)
    const bodyW = this.pinWidth;
    const bodyH = this.bottleHeight - 4;
    const bTop = -this.bottleHeight;

    // Outer Glass
    this.ctx.fillStyle = '#e2e8f0';
    this.ctx.beginPath();
    this.ctx.roundRect(-bodyW / 2, bTop, bodyW, bodyH, [3, 3, 5, 5]);
    this.ctx.fill();
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeStyle = '#475569';
    this.ctx.stroke();

    // Medicine Liquid (Teal / Cyan inside)
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.beginPath();
    this.ctx.roundRect(-bodyW / 2 + 2, bTop + 8, bodyW - 4, bodyH - 10, [1, 1, 3, 3]);
    this.ctx.fill();

    // Medicine Drop Icon
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(0, bTop + 18, 2.5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  drawPins() {
    const { x, y } = this.eyeCenter;

    // Draw Stuck Pins rotating with the Eyeball
    this.stuckPins.forEach(pin => {
      const currentAngle = pin.angle + this.rotationAngle;
      // Position at eye edge
      const px = x + Math.cos(currentAngle) * this.eyeRadius;
      const py = y + Math.sin(currentAngle) * this.eyeRadius;
      // Draw bottle radiating outward (pointing into the eye)
      this.drawBottle(px, py, currentAngle + Math.PI / 2);
    });

    // Draw Active Flying Pin
    if (this.activeFlyingPin) {
      this.drawBottle(this.activeFlyingPin.x, this.activeFlyingPin.y, 0);
    }

    // Draw Ready Pin at Launcher Base (if pins remain and not currently shooting)
    if (this.remainingPins > 0 && !this.activeFlyingPin && this.state === 'PLAYING') {
      this.drawBottle(this.eyeCenter.x, this.readyPinY, 0);
    }
  }

  drawParticles() {
    this.particles.forEach(p => p.draw(this.ctx));
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Eyeball with all its layers
    this.drawEyeball();

    // Draw Pins (stuck, flying, ready)
    this.drawPins();

    // Draw Particle FX
    this.drawParticles();
  }

  gameLoop(currentTime) {
    const dt = currentTime - this.lastTime;
    this.lastTime = currentTime;

    if (this.state === 'PLAYING' || this.state === 'GAMEOVER' || this.state === 'LEVEL_CLEARED') {
      this.updatePhysics();
    }

    this.render();
    requestAnimationFrame((t) => this.gameLoop(t));
  }
}

// Initialize on DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  window.game = new EyeGame();
});
