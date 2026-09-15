/**
 * Cake Sort 3D - Color Puzzle Game
 * Full game logic, Web Audio SFX, 4x4 Grid, Cascade Merging, Boosters & Lucky Wheel
 */

(function () {
  'use strict';

  // --- FLAVOR DEFINITIONS & PALETTES ---
  const FLAVORS = {
    orange: {
      name: 'Orange Carrot',
      primary: '#ff793f',
      secondary: '#cd6133',
      crust: '#d35400',
      cream: '#ffeaa7',
      topping: 'orange_segment'
    },
    strawberry: {
      name: 'Strawberry Dream',
      primary: '#ff76ac',
      secondary: '#e84393',
      crust: '#d63031',
      cream: '#fff0f6',
      topping: 'cherry'
    },
    chocolate: {
      name: 'Chocolate Fudge',
      primary: '#6d4c41',
      secondary: '#4e342e',
      crust: '#3e2723',
      cream: '#d7ccc8',
      topping: 'choco_drip'
    },
    kiwi: {
      name: 'Kiwi Mint',
      primary: '#2ed573',
      secondary: '#20bf6b',
      crust: '#10ac84',
      cream: '#e3fcef',
      topping: 'kiwi_seeds'
    },
    blueberry: {
      name: 'Blueberry Bliss',
      primary: '#5352ed',
      secondary: '#3742fa',
      crust: '#2f3542',
      cream: '#f1f2f6',
      topping: 'blueberry'
    },
    lemon: {
      name: 'Lemon Curd',
      primary: '#f9ca24',
      secondary: '#f0932b',
      crust: '#e58e26',
      cream: '#fff9e6',
      topping: 'lemon_slice'
    },
    velvet: {
      name: 'Royal Velvet',
      primary: '#9b59b6',
      secondary: '#8e44ad',
      crust: '#6c3483',
      cream: '#f4ecf7',
      topping: 'sprinkles'
    }
  };

  const LEVEL_CONFIGS = [
    {
      level: 1,
      name: 'Practice Bakery',
      diffTag: 'safe',
      diffName: 'Practice (No Out)',
      hasOutSystem: false,
      lives: 999,
      flavors: ['orange', 'strawberry'],
      targetCount: 6,
      targetFlavor: 'orange',
      mixedRate: 0.15,
      sliceMin: 2,
      sliceMax: 4,
      starterPlates: 3,
      desc: '🛡️ Practice Mode: No Out System. Unlimited relaxing play!'
    },
    {
      level: 2,
      name: 'The Gauntlet (Hardest)',
      diffTag: 'hard',
      diffName: 'Hardest (3 Lives)',
      hasOutSystem: true,
      lives: 3,
      flavors: ['orange', 'strawberry', 'chocolate', 'kiwi'],
      targetCount: 12,
      targetFlavor: 'strawberry',
      mixedRate: 0.50,
      sliceMin: 1,
      sliceMax: 3,
      starterPlates: 2,
      desc: '💀 Out System Starts! 4 mixed flavors, 3 Lives. Watch your moves!'
    },
    {
      level: 3,
      name: 'Pastry Delight',
      diffTag: 'medium',
      diffName: 'Moderate (4 Lives)',
      hasOutSystem: true,
      lives: 4,
      flavors: ['orange', 'strawberry', 'blueberry'],
      targetCount: 10,
      targetFlavor: 'blueberry',
      mixedRate: 0.35,
      sliceMin: 2,
      sliceMax: 4,
      starterPlates: 3,
      desc: '🍰 Getting Easier: 4 Lives, 3 flavors, larger slice groups.'
    },
    {
      level: 4,
      name: 'Berry Orchard',
      diffTag: 'easy',
      diffName: 'Easy (5 Lives)',
      hasOutSystem: true,
      lives: 5,
      flavors: ['strawberry', 'lemon', 'orange'],
      targetCount: 8,
      targetFlavor: 'lemon',
      mixedRate: 0.20,
      sliceMin: 3,
      sliceMax: 5,
      starterPlates: 4,
      desc: '🍓 Easy Mode: 5 Lives, 80% pure single-flavor plates!'
    },
    {
      level: 5,
      name: 'Royal Velvet Supreme',
      diffTag: 'supereasy',
      diffName: 'Super Easy (6 Lives)',
      hasOutSystem: true,
      lives: 6,
      flavors: ['velvet', 'strawberry'],
      targetCount: 6,
      targetFlavor: 'velvet',
      mixedRate: 0.10,
      sliceMin: 3,
      sliceMax: 5,
      starterPlates: 4,
      desc: '🌟 Super Easy: 6 Lives, only 2 flavors, rapid cake clears!'
    },
    {
      level: 6,
      name: 'Golden Sweet Rush',
      diffTag: 'megaeasy',
      diffName: 'Mega Easy (7 Lives)',
      hasOutSystem: true,
      lives: 7,
      flavors: ['lemon', 'orange'],
      targetCount: 6,
      targetFlavor: 'lemon',
      mixedRate: 0.04,
      sliceMin: 4,
      sliceMax: 5,
      starterPlates: 5,
      desc: '👑 Mega Easy: 7 Lives, huge same-color plates, mega cascades!'
    },
    {
      level: 7,
      name: 'Sugar Paradise',
      diffTag: 'megaeasy',
      diffName: 'Sweet Rush (8 Lives)',
      hasOutSystem: true,
      lives: 8,
      flavors: ['blueberry', 'strawberry'],
      targetCount: 6,
      targetFlavor: 'blueberry',
      mixedRate: 0.02,
      sliceMin: 4,
      sliceMax: 5,
      starterPlates: 5,
      desc: '✨ Sweet Rush: 8 Lives, effortless full cake merges!'
    },
    {
      level: 8,
      name: 'Rainbow Dream Bakery',
      diffTag: 'megaeasy',
      diffName: 'Frenzy (8 Lives)',
      hasOutSystem: true,
      lives: 8,
      flavors: ['kiwi', 'orange'],
      targetCount: 6,
      targetFlavor: 'kiwi',
      mixedRate: 0.0,
      sliceMin: 4,
      sliceMax: 5,
      starterPlates: 6,
      desc: '🌈 Frenzy Mode: 100% pure plates, instant satisfaction!'
    },
    {
      level: 9,
      name: 'Chocolate Cloud',
      diffTag: 'megaeasy',
      diffName: 'Ultra Easy (9 Lives)',
      hasOutSystem: true,
      lives: 9,
      flavors: ['chocolate', 'velvet'],
      targetCount: 6,
      targetFlavor: 'chocolate',
      mixedRate: 0.0,
      sliceMin: 4,
      sliceMax: 5,
      starterPlates: 6,
      desc: '🍫 Ultra Easy: 9 Lives, explosive combo chains!'
    },
    {
      level: 10,
      name: 'Grand Chef Frenzy',
      diffTag: 'megaeasy',
      diffName: 'God Mode Easy (10 Lives)',
      hasOutSystem: true,
      lives: 10,
      flavors: ['strawberry', 'orange'],
      targetCount: 6,
      targetFlavor: 'strawberry',
      mixedRate: 0.0,
      sliceMin: 5,
      sliceMax: 5,
      starterPlates: 6,
      desc: '🏆 Master Easy: 10 Lives, 5-slice pure plates, endless combos!'
    },
    {
      level: 11,
      name: 'Candy Castle Frenzy',
      diffTag: 'megaeasy',
      diffName: 'Infinity Easy (10 Lives)',
      hasOutSystem: true,
      lives: 10,
      flavors: ['lemon', 'velvet'],
      targetCount: 6,
      targetFlavor: 'lemon',
      mixedRate: 0.0,
      sliceMin: 5,
      sliceMax: 5,
      starterPlates: 6,
      desc: '🏰 Infinity Easy: Massive points & zero stress!'
    },
    {
      level: 12,
      name: 'Ultimate Cake Fiesta',
      diffTag: 'megaeasy',
      diffName: 'Fiesta Easy (10 Lives)',
      hasOutSystem: true,
      lives: 10,
      flavors: ['kiwi', 'blueberry'],
      targetCount: 6,
      targetFlavor: 'kiwi',
      mixedRate: 0.0,
      sliceMin: 5,
      sliceMax: 5,
      starterPlates: 6,
      desc: '🎉 Fiesta Mode: Maximum joy and pure matching bliss!'
    }
  ];

  // --- AUDIO SYNTHESIZER (WEB AUDIO API) ---
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.musicEnabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playLifeLost() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } catch (e) {}
    }

    playGameOver() {
      if (!this.enabled || !this.ctx) return;
      try {
        const notes = [392.00, 349.23, 311.13, 246.94]; // G4, F4, Eb4, B3
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          const now = this.ctx.currentTime + (i * 0.14);
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.32, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.36);
        });
      } catch (e) {}
    }

    playPop() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } catch (e) {}
    }

    playPlace() {
      this.playPop();
    }

    playWhoosh() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } catch (e) {}
    }

    playMerge(combo = 1) {
      if (!this.enabled || !this.ctx) return;
      try {
        const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
        const freq = notes[Math.min(combo - 1, notes.length - 1)] || 523.25;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.12);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } catch (e) {}
    }

    playCakeComplete() {
      if (!this.enabled || !this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C major chord
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          const now = this.ctx.currentTime + (i * 0.06);
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.45);
        });
      } catch (e) {}
    }

    playLevelWin() {
      if (!this.enabled || !this.ctx) return;
      try {
        const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        melody.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          const now = this.ctx.currentTime + (i * 0.09);
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
        });
      } catch (e) {}
    }

    playHammer() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } catch (e) {}
    }

    playTick() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } catch (e) {}
    }

    playCustomerBell() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const chimeNotes = [880, 1174.66, 1396.91]; // Cute bakery shop bell
        chimeNotes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.32);
        });
      } catch (e) {}
    }

    playCustomerServed() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [659.25, 783.99, 1046.50, 1318.51]; // Happy cash/cheer
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.28, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.28);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.3);
        });
      } catch (e) {}
    }

    playCustomerAngry() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.35);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } catch (e) {}
    }

    playUrgentTick() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(950, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } catch (e) {}
    }
  }

  const sfx = new SoundFX();

  // --- PARTICLE & ANIMATION FX ENGINE ---
  class ParticleEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.flyingSlices = [];
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.loop();
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }

    createConfetti(x, y, color = '#ffd32a') {
      const count = 30;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 6;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: 4 + Math.random() * 5,
          color: [color, '#ff76ac', '#ffa502', '#2ed573', '#3742fa', '#ffffff'][Math.floor(Math.random() * 6)],
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.3
        });
      }
    }

    createSmashDebris(x, y) {
      for (let i = 0; i < 24; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3 + Math.random() * 4,
          color: '#e2e8f0',
          alpha: 1,
          decay: 0.02 + Math.random() * 0.03,
          rotation: 0,
          rotSpeed: 0.1
        });
      }
    }

    addFlyingSlice(startX, startY, endX, endY, flavor, onComplete) {
      this.flyingSlices.push({
        startX,
        startY,
        endX,
        endY,
        flavor,
        progress: 0,
        speed: 0.035, // ~30 frames
        onComplete
      });
    }

    loop() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Render Flying Slices
      for (let i = this.flyingSlices.length - 1; i >= 0; i--) {
        const fs = this.flyingSlices[i];
        fs.progress += fs.speed;

        if (fs.progress >= 1) {
          if (fs.onComplete) fs.onComplete();
          this.flyingSlices.splice(i, 1);
          continue;
        }

        const t = fs.progress;
        // Parabolic arc interpolation
        const curX = fs.startX + (fs.endX - fs.startX) * t;
        const linearY = fs.startY + (fs.endY - fs.startY) * t;
        const arcHeight = 45 * Math.sin(t * Math.PI);
        const curY = linearY - arcHeight;
        const scale = 1 + 0.25 * Math.sin(t * Math.PI);

        this.drawSingleSlice(this.ctx, curX, curY, fs.flavor, scale, t * Math.PI * 2);
      }

      // Render Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // Gravity
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.restore();
      }

      requestAnimationFrame(() => this.loop());
    }

    drawSingleSlice(ctx, x, y, flavorKey, scale = 1, rotation = 0) {
      const flv = FLAVORS[flavorKey] || FLAVORS.orange;
      const radius = 24 * scale;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Shadow
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;

      // Cake Slice wedge (60 degrees)
      const startAngle = -Math.PI / 6;
      const endAngle = Math.PI / 6;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Top Glaze
      ctx.fillStyle = flv.primary;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = flv.secondary;
      ctx.stroke();

      // Outer Crust Arc
      ctx.beginPath();
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.lineWidth = 4 * scale;
      ctx.strokeStyle = flv.crust;
      ctx.stroke();

      // Cream line
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.7, startAngle, endAngle);
      ctx.lineWidth = 2 * scale;
      ctx.strokeStyle = flv.cream;
      ctx.stroke();

      // Topping icon
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(radius * 0.5, 0, 2.5 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // --- DRAWING UTILITIES (FOR CANVAS CAKE SLICES) ---
  function drawPlateCakes(canvas, slices) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = w * 0.44;

    ctx.clearRect(0, 0, w, h);
    if (!slices || slices.length === 0) return;

    const sliceAngle = (Math.PI * 2) / 6; // 60 degrees each

    slices.forEach((flvKey, i) => {
      const flv = FLAVORS[flvKey] || FLAVORS.orange;
      const startAngle = i * sliceAngle - Math.PI / 2;
      const endAngle = startAngle + sliceAngle;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();

      // Gradient Fill
      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius);
      grad.addColorStop(0, flv.cream);
      grad.addColorStop(0.3, flv.primary);
      grad.addColorStop(1, flv.secondary);
      ctx.fillStyle = grad;
      ctx.fill();

      // Wedge divider lines
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.stroke();

      // Outer Crust
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = flv.crust;
      ctx.stroke();

      // Topping decoration
      const midAngle = startAngle + sliceAngle / 2;
      const tx = cx + Math.cos(midAngle) * (radius * 0.62);
      const ty = cy + Math.sin(midAngle) * (radius * 0.62);

      if (flv.topping === 'cherry') {
        // Red Cherry
        ctx.fillStyle = '#d63031';
        ctx.beginPath();
        ctx.arc(tx, ty, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(tx - 1, ty - 1, 1.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (flv.topping === 'orange_segment') {
        // Orange wedge
        ctx.fillStyle = '#ffa502';
        ctx.beginPath();
        ctx.arc(tx, ty, 3.5, 0, Math.PI);
        ctx.fill();
      } else {
        // White icing drop
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  // Customer Character Profiles (Cute High Quality Animated Characters)
  const CUSTOMER_PROFILES = [
    { id: 'chef_leo', name: 'Chef Leo', phrase: 'Masterpiece flavor!' },
    { id: 'princess_mia', name: 'Princess Mia', phrase: 'Berry sweet please!' },
    { id: 'ruby_baker', name: 'Ruby', phrase: 'Freshly baked please!' },
    { id: 'cool_oliver', name: 'Oliver', phrase: 'Craving sweet cakes!' },
    { id: 'gran_rosa', name: 'Gran Rosa', phrase: 'For my afternoon tea!' },
    { id: 'bao_panda', name: 'Bao Bao', phrase: 'Nom nom nom cake!' },
    { id: 'kitty_cat', name: 'Mochi Cat', phrase: 'Purr-fect slice please!' },
    { id: 'benny_bear', name: 'Benny Bear', phrase: 'Big honey cake slice!' },
    { id: 'foxy_fox', name: 'Foxy', phrase: 'Quick, I am in a rush!' },
    { id: 'pengu_penguin', name: 'Pengu', phrase: 'Cool sweet treat!' }
  ];

  function getCharacterAvatarSVG(charId) {
    switch (charId) {
      case 'chef_leo':
        return `<svg viewBox="0 0 44 44" class="customer-avatar-svg">
          <circle cx="22" cy="22" r="21" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>
          <path d="M10 18 Q22 10 34 18 Q28 14 22 15 Q16 14 10 18 Z" fill="#6d4c41"/>
          <circle cx="16" cy="23" r="2.5" fill="#2d3436"/>
          <circle cx="28" cy="23" r="2.5" fill="#2d3436"/>
          <circle cx="17" cy="22" r="0.8" fill="#ffffff"/>
          <circle cx="29" cy="22" r="0.8" fill="#ffffff"/>
          <circle cx="13" cy="27" r="2.5" fill="#ff76ac" opacity="0.6"/>
          <circle cx="31" cy="27" r="2.5" fill="#ff76ac" opacity="0.6"/>
          <path d="M19 28 Q22 32 25 28" stroke="#2d3436" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          <path d="M12 14 C8 8 14 3 22 4 C30 3 36 8 32 14 Z" fill="#ffffff" stroke="#e0e0e0" stroke-width="1.2"/>
          <rect x="13" y="12" width="18" height="4" rx="2" fill="#ffffff" stroke="#dcdde1" stroke-width="1"/>
          <circle cx="22" cy="10" r="1.5" fill="#ff4757"/>
        </svg>`;
      case 'princess_mia':
        return `<svg viewBox="0 0 44 44" class="customer-avatar-svg">
          <circle cx="22" cy="22" r="21" fill="#fff0f6" stroke="#ffccd5" stroke-width="2"/>
          <path d="M8 20 C6 30 10 36 12 38 C14 28 14 22 16 16 C22 12 30 12 34 18 C36 24 36 30 38 38 C40 30 38 20 34 14 C28 8 16 8 8 20 Z" fill="#f9ca24"/>
          <path d="M13 16 Q22 20 31 16 Q22 12 13 16 Z" fill="#e1b12c"/>
          <ellipse cx="16" cy="23" rx="2.5" ry="3.5" fill="#8e44ad"/>
          <ellipse cx="28" cy="23" rx="2.5" ry="3.5" fill="#8e44ad"/>
          <circle cx="17" cy="21.5" r="1" fill="#ffffff"/>
          <circle cx="29" cy="21.5" r="1" fill="#ffffff"/>
          <circle cx="13" cy="28" r="2.8" fill="#ff76ac" opacity="0.6"/>
          <circle cx="31" cy="28" r="2.8" fill="#ff76ac" opacity="0.6"/>
          <path d="M19 28 Q22 31 25 28" stroke="#d63031" stroke-width="1.6" fill="none" stroke-linecap="round"/>
          <path d="M15 11 L18 6 L22 10 L26 6 L29 11 Z" fill="#f1c40f" stroke="#d4ac0d" stroke-width="1"/>
          <circle cx="22" cy="8" r="1.5" fill="#e84393"/>
        </svg>`;
      case 'ruby_baker':
        return `<svg viewBox="0 0 44 44" class="customer-avatar-svg">
          <circle cx="22" cy="22" r="21" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>
          <circle cx="8" cy="16" r="6" fill="#e84393"/>
          <circle cx="36" cy="16" r="6" fill="#e84393"/>
          <path d="M11 16 Q22 10 33 16 Q22 13 11 16 Z" fill="#d63031"/>
          <ellipse cx="16" cy="23" rx="2.4" ry="3" fill="#20bf6b"/>
          <ellipse cx="28" cy="23" rx="2.4" ry="3" fill="#20bf6b"/>
          <circle cx="17" cy="22" r="0.9" fill="#ffffff"/>
          <circle cx="29" cy="22" r="0.9" fill="#ffffff"/>
          <circle cx="13" cy="27" r="2.5" fill="#ff76ac" opacity="0.65"/>
          <circle cx="31" cy="27" r="2.5" fill="#ff76ac" opacity="0.65"/>
          <path d="M19 28 Q22 32 25 28" stroke="#c0392b" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          <circle cx="33" cy="12" r="2.5" fill="#e74c3c"/>
          <path d="M33 10 Q35 7 38 8" stroke="#27ae60" stroke-width="1.2" fill="none"/>
        </svg>`;
      case 'cool_oliver':
        return `<svg viewBox="0 0 44 44" class="customer-avatar-svg">
          <circle cx="22" cy="22" r="21" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>
          <path d="M10 18 C12 8 32 8 34 18 C28 12 18 12 10 18 Z" fill="#2d3436"/>
          <circle cx="16" cy="23" r="5" stroke="#0984e3" stroke-width="1.8" fill="rgba(255,255,255,0.4)"/>
          <circle cx="28" cy="23" r="5" stroke="#0984e3" stroke-width="1.8" fill="rgba(255,255,255,0.4)"/>
          <line x1="21" y1="23" x2="23" y2="23" stroke="#0984e3" stroke-width="1.8"/>
          <circle cx="16" cy="23" r="1.8" fill="#2d3436"/>
          <path d="M26 23 Q28 21 30 23" stroke="#2d3436" stroke-width="1.8" fill="none"/>
          <path d="M19 31 Q22 34 25 31" stroke="#2d3436" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          <polygon points="17,38 22,36 27,38 22,40" fill="#f39c12"/>
        </svg>`;
      case 'gran_rosa':
        return `<svg viewBox="0 0 44 44" class="customer-avatar-svg">
          <circle cx="22" cy="22" r="21" fill="#fff5f5" stroke="#fbc531" stroke-width="2"/>
          <circle cx="22" cy="9" r="6" fill="#dcdde1"/>
          <path d="M10 18 C10 10 34 10 34 18 C28 14 16 14 10 18 Z" fill="#dcdde1"/>
          <circle cx="16" cy="23" r="4.5" stroke="#e84393" stroke-width="1.5" fill="rgba(255,255,255,0.5)"/>
          <circle cx="28" cy="23" r="4.5" stroke="#e84393" stroke-width="1.5" fill="rgba(255,255,255,0.5)"/>
          <line x1="20.5" y1="23" x2="23.5" y2="23" stroke="#e84393" stroke-width="1.5"/>
          <circle cx="16" cy="23" r="1.5" fill="#2f3640"/>
          <circle cx="28" cy="23" r="1.5" fill="#2f3640"/>
          <circle cx="12" cy="28" r="2.8" fill="#ff76ac" opacity="0.6"/>
          <circle cx="32" cy="28" r="2.8" fill="#ff76ac" opacity="0.6"/>
          <path d="M19 29 Q22 32 25 29" stroke="#2d3436" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        </svg>`;
      case 'bao_panda':
        return `<svg viewBox="0 0 44 44" class="customer-avatar-svg">
          <circle cx="22" cy="22" r="21" fill="#ffffff" stroke="#dfe4ea" stroke-width="2"/>
          <circle cx="10" cy="11" r="5" fill="#2f3542"/>
          <circle cx="34" cy="11" r="5" fill="#2f3542"/>
          <ellipse cx="15" cy="22" rx="4.5" ry="5.5" fill="#2f3542" transform="rotate(-15 15 22)"/>
          <ellipse cx="29" cy="22" rx="4.5" ry="5.5" fill="#2f3542" transform="rotate(15 29 22)"/>
          <circle cx="15" cy="21" r="1.8" fill="#ffffff"/>
          <circle cx="29" cy="21" r="1.8" fill="#ffffff"/>
          <ellipse cx="22" cy="27" rx="2.5" ry="1.8" fill="#2f3542"/>
          <path d="M19 30 Q22 33 25 30" stroke="#2f3542" stroke-width="1.6" fill="none" stroke-linecap="round"/>
          <circle cx="9" cy="26" r="2.5" fill="#ff76ac" opacity="0.6"/>
          <circle cx="35" cy="26" r="2.5" fill="#ff76ac" opacity="0.6"/>
          <path d="M17 12 C15 7 29 7 27 12 Z" fill="#ffffff" stroke="#74b9ff" stroke-width="1"/>
        </svg>`;
      case 'kitty_cat':
        return `<svg viewBox="0 0 44 44" class="customer-avatar-svg">
          <circle cx="22" cy="22" r="21" fill="#ffeaa7" stroke="#fbc531" stroke-width="2"/>
          <polygon points="8,16 14,5 18,14" fill="#ff9f43"/>
          <polygon points="10,14 14,7 16,13" fill="#ff76ac"/>
          <polygon points="36,16 30,5 26,14" fill="#ff9f43"/>
          <polygon points="34,14 30,7 28,13" fill="#ff76ac"/>
          <ellipse cx="16" cy="22" rx="3" ry="4" fill="#10ac84"/>
          <ellipse cx="28" cy="22" rx="3" ry="4" fill="#10ac84"/>
          <ellipse cx="16" cy="22" rx="1.2" ry="3.5" fill="#2d3436"/>
          <ellipse cx="28" cy="22" rx="1.2" ry="3.5" fill="#2d3436"/>
          <line x1="8" y1="26" x2="13" y2="27" stroke="#6d4c41" stroke-width="1.2"/>
          <line x1="8" y1="29" x2="13" y2="29" stroke="#6d4c41" stroke-width="1.2"/>
          <line x1="36" y1="26" x2="31" y2="27" stroke="#6d4c41" stroke-width="1.2"/>
          <line x1="36" y1="29" x2="31" y2="29" stroke="#6d4c41" stroke-width="1.2"/>
          <polygon points="21,27 23,27 22,28.5" fill="#ff76ac"/>
          <path d="M20 29 Q22 31 24 29" stroke="#6d4c41" stroke-width="1.4" fill="none"/>
        </svg>`;
      case 'benny_bear':
        return `<svg viewBox="0 0 44 44" class="customer-avatar-svg">
          <circle cx="22" cy="22" r="21" fill="#c78d65" stroke="#a0522d" stroke-width="2"/>
          <circle cx="10" cy="11" r="5.5" fill="#c78d65" stroke="#a0522d" stroke-width="1.5"/>
          <circle cx="10" cy="11" r="3" fill="#f8c291"/>
          <circle cx="34" cy="11" r="5.5" fill="#c78d65" stroke="#a0522d" stroke-width="1.5"/>
          <circle cx="34" cy="11" r="3" fill="#f8c291"/>
          <ellipse cx="22" cy="28" rx="8" ry="6" fill="#f8c291"/>
          <ellipse cx="22" cy="25" rx="3" ry="2" fill="#2d3436"/>
          <path d="M19 28 Q22 31 25 28" stroke="#2d3436" stroke-width="1.6" fill="none"/>
          <circle cx="15" cy="20" r="2.2" fill="#2d3436"/>
          <circle cx="29" cy="20" r="2.2" fill="#2d3436"/>
          <circle cx="16" cy="19" r="0.8" fill="#ffffff"/>
          <circle cx="30" cy="19" r="0.8" fill="#ffffff"/>
          <path d="M18 10 C16 6 28 6 26 10 Z" fill="#ffffff" stroke="#dcdde1" stroke-width="1"/>
        </svg>`;
      case 'foxy_fox':
        return `<svg viewBox="0 0 44 44" class="customer-avatar-svg">
          <circle cx="22" cy="22" r="21" fill="#ff793f" stroke="#d35400" stroke-width="2"/>
          <polygon points="7,16 12,4 18,12" fill="#ff793f" stroke="#d35400" stroke-width="1"/>
          <polygon points="9,14 12,6 16,12" fill="#2d3436"/>
          <polygon points="37,16 32,4 26,12" fill="#ff793f" stroke="#d35400" stroke-width="1"/>
          <polygon points="35,14 32,6 28,12" fill="#2d3436"/>
          <path d="M8 24 Q22 36 36 24 Q22 28 8 24 Z" fill="#ffffff"/>
          <ellipse cx="15" cy="20" rx="2.5" ry="3.2" fill="#f1c40f"/>
          <circle cx="15" cy="20" r="1.5" fill="#2d3436"/>
          <ellipse cx="29" cy="20" rx="2.5" ry="3.2" fill="#f1c40f"/>
          <circle cx="29" cy="20" r="1.5" fill="#2d3436"/>
          <polygon points="20,27 24,27 22,29.5" fill="#2d3436"/>
          <path d="M20 31 Q22 33 24 31" stroke="#2d3436" stroke-width="1.4" fill="none"/>
        </svg>`;
      case 'pengu_penguin':
      default:
        return `<svg viewBox="0 0 44 44" class="customer-avatar-svg">
          <circle cx="22" cy="22" r="21" fill="#2f3542" stroke="#1e272e" stroke-width="2"/>
          <ellipse cx="22" cy="24" rx="13" ry="12" fill="#ffffff"/>
          <ellipse cx="16" cy="20" rx="2.2" ry="3" fill="#2f3542"/>
          <ellipse cx="28" cy="20" rx="2.2" ry="3" fill="#2f3542"/>
          <circle cx="17" cy="19" r="0.9" fill="#ffffff"/>
          <circle cx="29" cy="19" r="0.9" fill="#ffffff"/>
          <polygon points="19,23 25,23 22,27" fill="#ffa502"/>
          <circle cx="12" cy="26" r="2.5" fill="#ff76ac" opacity="0.6"/>
          <circle cx="32" cy="26" r="2.5" fill="#ff76ac" opacity="0.6"/>
          <path d="M17 11 C15 6 29 6 27 11 Z" fill="#ffffff" stroke="#70a1ff" stroke-width="1"/>
        </svg>`;
    }
  }

  // Draw Goal Preview
  function drawGoalCakePreview(canvas, flavorKey) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const flv = FLAVORS[flavorKey] || FLAVORS.orange;

    ctx.save();
    ctx.translate(w / 2, h / 2);
    // Draw full mini cake
    for (let i = 0; i < 6; i++) {
      const startAngle = (i * Math.PI) / 3;
      const endAngle = startAngle + Math.PI / 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, w * 0.42, startAngle, endAngle);
      ctx.fillStyle = i % 2 === 0 ? flv.primary : flv.secondary;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Center dollop
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Draw Mini Customer Order Cake
  function drawMiniCustomerCake(canvas, flavorKey) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const flv = FLAVORS[flavorKey] || FLAVORS.orange;
    const cx = w / 2;
    const cy = h / 2;
    const radius = w * 0.44;

    ctx.save();
    ctx.translate(cx, cy);

    for (let i = 0; i < 6; i++) {
      const startAngle = (i * Math.PI) / 3 - Math.PI / 2;
      const endAngle = startAngle + Math.PI / 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.fillStyle = i % 2 === 0 ? flv.primary : flv.secondary;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Outer crust
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = flv.crust;
    ctx.stroke();

    // Center cream rosette
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- MAIN GAME CONTROLLER ---
  class CakeSortGame {
    constructor() {
      // DOM Elements
      this.gridContainer = document.getElementById('grid-container');
      this.dockSlots = [
        document.getElementById('dock-0'),
        document.getElementById('dock-1'),
        document.getElementById('dock-2')
      ];
      this.levelNumBadge = document.getElementById('level-num-badge');
      this.levelPercentText = document.getElementById('level-percent');
      this.goalText = document.getElementById('goal-text');
      this.goalProgressFill = document.getElementById('goal-progress-fill');
      this.goalCakeCanvas = document.getElementById('goal-cake-preview');
      this.scoreValText = document.getElementById('score-val');
      this.coinValText = document.getElementById('coin-val');
      this.boosterModeBanner = document.getElementById('booster-mode-banner');
      this.boosterModeText = document.getElementById('booster-mode-text');
      this.toastEl = document.getElementById('toast-message');

      // Out System & Lives HUD Elements
      this.livesStatusPill = document.getElementById('lives-status-pill');
      this.livesModeLabel = document.getElementById('lives-mode-label');
      this.livesHeartsWrap = document.getElementById('lives-hearts-wrap');

      // Customer Queue & Angry Strikes HUD Elements
      this.customerQueueContainer = document.getElementById('customers-queue-container');
      this.angryStrikesPill = document.getElementById('angry-strikes-pill');
      this.strikeDots = [
        document.getElementById('strike-1'),
        document.getElementById('strike-2'),
        document.getElementById('strike-3')
      ];

      // Modals
      this.modalSpin = document.getElementById('modal-spin');
      this.modalSettings = document.getElementById('modal-settings');
      this.modalHow = document.getElementById('modal-how');
      this.modalLevelWin = document.getElementById('modal-level-win');
      this.modalGameOver = document.getElementById('modal-game-over');
      this.modalLevelSelect = document.getElementById('modal-level-select');
      this.levelSelectGrid = document.getElementById('level-select-grid');

      // FX Engine
      this.fx = new ParticleEngine(document.getElementById('fx-canvas'));

      // Start Menu & Exit Elements
      this.startMenuScreen = document.getElementById('start-menu-screen');
      this.menuLevelVal = document.getElementById('menu-level-val');
      this.menuScoreVal = document.getElementById('menu-score-val');
      this.menuCoinVal = document.getElementById('menu-coin-val');
      this.menuHeroCake = document.getElementById('menu-hero-cake');
      this.modalConfirmExit = document.getElementById('modal-confirm-exit');
      this.isPlaying = false;

      // Game State
      this.level = parseInt(localStorage.getItem('cakesort_level') || '1', 10);
      this.score = parseInt(localStorage.getItem('cakesort_score') || '0', 10);
      this.coins = parseInt(localStorage.getItem('cakesort_coins') || '150', 10);
      this.boosters = {
        hammer: parseInt(localStorage.getItem('cakesort_hammer') || '2', 10),
        swap: parseInt(localStorage.getItem('cakesort_swap') || '3', 10),
        hand: parseInt(localStorage.getItem('cakesort_hand') || '1', 10),
        coffee: parseInt(localStorage.getItem('cakesort_coffee') || '3', 10)
      };

      // Out System State (Table Jam Lives)
      this.maxLives = 3;
      this.currentLives = 3;

      // Customer Orders & 3-Angry-Customer Strikes State
      this.activeCustomers = [];
      this.angryStrikes = 0;
      this.maxAngryStrikes = 3;
      this.customerLoopInterval = null;
      this.customerSpawnTimeouts = [];
      this.lastTickTime = 0;

      this.activeBooster = null; // 'hammer' | 'hand' | null
      this.magicHandSelectedSlot = null;

      // Board State: 4x4 array of 16 slots (null or { id, slices: [] })
      this.board = Array(16).fill(null);
      // Dock State: 3 slots (null or { id, slices: [] })
      this.dock = [null, null, null];
      this.selectedDockIndex = null;

      this.levelCompletedSlices = 0;
      this.isProcessingMerges = false;

      this.initUI();
      this.renderLevelSelectGrid();
      this.initEventListeners();
      this.startLevel(this.level);
      this.showStartMenu();
    }

    showStartMenu() {
      this.isPlaying = false;
      this.updateStartMenu();
      if (this.startMenuScreen) {
        this.startMenuScreen.classList.remove('menu-hidden');
      }
      this.drawMenuHeroCake();
    }

    hideStartMenu() {
      this.isPlaying = true;
      if (this.startMenuScreen) {
        this.startMenuScreen.classList.add('menu-hidden');
      }
    }

    updateStartMenu() {
      if (this.menuLevelVal) this.menuLevelVal.textContent = this.level;
      if (this.menuScoreVal) this.menuScoreVal.textContent = this.score;
      if (this.menuCoinVal) this.menuCoinVal.textContent = this.coins;
    }

    drawMenuHeroCake() {
      if (!this.menuHeroCake) return;
      const canvas = this.menuHeroCake;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = 52;

      ctx.clearRect(0, 0, w, h);

      // Plate dish under cake
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy + 6, radius + 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy + 2, radius + 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 8;
      ctx.fill();

      const sampleFlavors = ['orange', 'strawberry', 'kiwi', 'blueberry', 'lemon', 'velvet'];

      // Draw 6 cake slices
      for (let i = 0; i < 6; i++) {
        const startA = (i * 60 - 90) * Math.PI / 180;
        const endA = ((i + 1) * 60 - 90) * Math.PI / 180;
        const flv = FLAVORS[sampleFlavors[i]];

        // Slice wedge
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startA, endA);
        ctx.closePath();
        ctx.fillStyle = flv.primary;
        ctx.fill();

        // Slice outer crust rim
        ctx.lineWidth = 3;
        ctx.strokeStyle = flv.crust;
        ctx.stroke();

        // Inner lighter flavor layer
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius * 0.75, startA, endA);
        ctx.closePath();
        ctx.fillStyle = flv.secondary;
        ctx.fill();

        // White cream divider line
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.stroke();

        // Cute fruit topping in slice middle
        const midA = (startA + endA) / 2;
        const topX = cx + Math.cos(midA) * (radius * 0.6);
        const topY = cy + Math.sin(midA) * (radius * 0.6);

        ctx.beginPath();
        ctx.arc(topX, topY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = flv.cream;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(topX, topY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = flv.crust;
        ctx.fill();
      }

      // Center decorative cream rosette
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 4;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ff76ac';
      ctx.fill();

      // Top gloss highlight
      ctx.beginPath();
      ctx.ellipse(cx - 14, cy - 18, 14, 7, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fill();

      ctx.restore();
    }

    saveData() {
      localStorage.setItem('cakesort_level', this.level);
      localStorage.setItem('cakesort_score', this.score);
      localStorage.setItem('cakesort_coins', this.coins);
      localStorage.setItem('cakesort_hammer', this.boosters.hammer);
      localStorage.setItem('cakesort_swap', this.boosters.swap);
      localStorage.setItem('cakesort_hand', this.boosters.hand);
      localStorage.setItem('cakesort_coffee', this.boosters.coffee);
    }

    getLevelConfig(lvl = this.level) {
      if (lvl <= LEVEL_CONFIGS.length) {
        return LEVEL_CONFIGS[lvl - 1];
      }
      // Infinite scalable super-easy levels for lvl > 12
      return {
        level: lvl,
        name: `Supreme Fiesta Lvl ${lvl}`,
        diffTag: 'megaeasy',
        diffName: 'Fiesta Easy (10 Lives)',
        hasOutSystem: true,
        lives: 10,
        flavors: ['lemon', 'velvet', 'strawberry'],
        targetCount: 6,
        targetFlavor: 'lemon',
        mixedRate: 0.0,
        sliceMin: 5,
        sliceMax: 5,
        starterPlates: 6,
        desc: '👑 Infinite Easy: 10 Lives, mega matching cascades!'
      };
    }

    initUI() {
      // Create 16 circular grid slots on 4x4 lavender table
      this.gridContainer.innerHTML = '';
      for (let i = 0; i < 16; i++) {
        const slotEl = document.createElement('div');
        slotEl.className = 'grid-slot';
        slotEl.dataset.slotIndex = i;
        this.gridContainer.appendChild(slotEl);
      }

      this.updateHUD();
      this.updateLivesHUD();
    }

    updateHUD() {
      const cfg = this.getLevelConfig();
      this.levelNumBadge.textContent = this.level;
      const pct = Math.min(100, Math.round((this.levelCompletedSlices / cfg.targetCount) * 100));
      this.levelPercentText.textContent = `%${pct}`;
      this.goalText.textContent = `${this.levelCompletedSlices}/${cfg.targetCount}`;
      this.goalProgressFill.style.width = `${pct}%`;
      this.scoreValText.textContent = this.score;
      this.coinValText.textContent = this.coins;

      const hudLevelBadgeTag = document.getElementById('hud-level-badge-tag');
      const hudLevelNameTag = document.getElementById('hud-level-name-tag');
      if (hudLevelBadgeTag) hudLevelBadgeTag.textContent = `LEVEL ${this.level}`;
      if (hudLevelNameTag) hudLevelNameTag.textContent = `🍰 ${cfg.name} (${cfg.diffName})`;

      document.getElementById('count-hammer').textContent = this.boosters.hammer;
      document.getElementById('count-swap').textContent = this.boosters.swap;
      document.getElementById('count-hand').textContent = this.boosters.hand;
      const coffeeCountEl = document.getElementById('count-coffee');
      if (coffeeCountEl) coffeeCountEl.textContent = this.boosters.coffee || 0;

      drawGoalCakePreview(this.goalCakeCanvas, cfg.targetFlavor);
      this.updateLivesHUD();
    }

    updateLivesHUD() {
      const cfg = this.getLevelConfig();
      if (!this.livesStatusPill || !this.livesModeLabel || !this.livesHeartsWrap) return;

      if (!cfg.hasOutSystem || this.level === 1) {
        this.livesModeLabel.textContent = '🛡️ Level 1: Practice (No Out)';
        this.livesHeartsWrap.innerHTML = '<span class="rule-tag rule-safe">No Out 🛡️</span>';
      } else {
        this.livesModeLabel.textContent = `❤️ Lvl ${this.level} • Lives: ${this.currentLives}/${this.maxLives}`;
        let heartsHtml = '';
        for (let i = 0; i < this.maxLives; i++) {
          if (i < this.currentLives) {
            heartsHtml += '<span class="heart-icon">❤️</span>';
          } else {
            heartsHtml += '<span class="heart-icon lost">🖤</span>';
          }
        }
        this.livesHeartsWrap.innerHTML = heartsHtml;
      }
    }

    showLevelSelectModal() {
      sfx.init();
      sfx.playPop();
      this.renderLevelSelectGrid();
      if (this.modalLevelSelect) {
        this.modalLevelSelect.classList.remove('hidden');
      }
    }

    hideLevelSelectModal() {
      if (this.modalLevelSelect) {
        this.modalLevelSelect.classList.add('hidden');
      }
    }

    selectLevel(lvl) {
      sfx.init();
      sfx.playPop();
      this.hideLevelSelectModal();
      this.hideStartMenu();
      if (this.modalGameOver) this.modalGameOver.classList.add('hidden');
      if (this.modalLevelWin) this.modalLevelWin.classList.add('hidden');
      if (this.modalSettings) this.modalSettings.classList.add('hidden');
      if (this.modalConfirmExit) this.modalConfirmExit.classList.add('hidden');

      this.startLevel(lvl);
      this.showToast(`🎯 Level ${lvl} Selected!`);
    }

    renderLevelSelectGrid() {
      if (!this.levelSelectGrid) return;
      this.levelSelectGrid.innerHTML = '';

      LEVEL_CONFIGS.forEach((cfg) => {
        const card = document.createElement('div');
        card.className = `level-card-item ${cfg.level === this.level ? 'current-active' : ''}`;

        // Color preview dots
        const dotsHtml = cfg.flavors.map(fKey => {
          const flv = FLAVORS[fKey] || FLAVORS.orange;
          return `<span class="flavor-dot" style="background: ${flv.primary}" title="${flv.name}"></span>`;
        }).join('');

        const diffClass = `diff-${cfg.diffTag || 'easy'}`;
        const livesText = cfg.hasOutSystem ? `❤️ ${cfg.lives} Lives` : '🛡️ Safe (No Out)';

        card.innerHTML = `
          <div class="level-card-top">
            <span class="level-card-badge">Level ${cfg.level}</span>
            <span class="level-diff-tag ${diffClass}">${cfg.diffName}</span>
          </div>
          <div class="level-card-name">${cfg.name}</div>
          <div class="level-card-meta">
            <span>🎯 Goal: ${cfg.targetCount} slices</span>
            <span class="level-card-lives">${livesText}</span>
          </div>
          <div class="level-card-preview-bar">
            ${dotsHtml}
          </div>
          <button class="level-card-play-btn">${cfg.level === this.level ? '▶ PLAYING NOW' : 'SELECT LEVEL'}</button>
        `;

        card.addEventListener('click', () => {
          this.selectLevel(cfg.level);
        });

        this.levelSelectGrid.appendChild(card);
      });
    }

    showToast(msg) {
      this.toastEl.textContent = msg;
      this.toastEl.classList.remove('hidden');
      setTimeout(() => this.toastEl.classList.add('hidden'), 2200);
    }

    startLevel(lvl) {
      this.level = lvl;
      const cfg = this.getLevelConfig(lvl);

      // Setup Lives & Out System state
      if (cfg.hasOutSystem) {
        this.maxLives = cfg.lives;
        this.currentLives = cfg.lives;
      } else {
        this.maxLives = 999;
        this.currentLives = 999;
      }

      // Reset Customer Angry Strikes
      this.angryStrikes = 0;

      this.levelCompletedSlices = 0;
      this.board = Array(16).fill(null);
      this.selectedDockIndex = null;
      this.activeBooster = null;
      this.magicHandSelectedSlot = null;
      this.exitBoosterMode();

      // Populate dock
      for (let i = 0; i < 3; i++) {
        this.dock[i] = this.generateRandomPlate();
      }

      // Initial starter plates on table for quick engaging cascades
      const starterCount = cfg.starterPlates || 3;
      const possibleSlots = [0, 3, 5, 6, 9, 10, 12, 15];
      // Shuffle & pick slots
      const shuffledSlots = [...possibleSlots].sort(() => 0.5 - Math.random()).slice(0, starterCount);

      shuffledSlots.forEach((slotIdx) => {
        const sliceCount = cfg.sliceMin + Math.floor(Math.random() * (cfg.sliceMax - cfg.sliceMin + 1));
        const flavor = cfg.flavors[Math.floor(Math.random() * cfg.flavors.length)];
        const slices = Array(sliceCount).fill(flavor);
        this.board[slotIdx] = { id: Math.random().toString(), slices };
      });

      this.renderBoard();
      this.renderDock();
      this.updateHUD();
      this.updateLivesHUD();
      this.updateAngryStrikesHUD();
      this.startCustomerSystem();
      this.renderLevelSelectGrid();
      this.saveData();
    }

    // --- CUSTOMER ORDERING & 3-STRIKE OUT SYSTEM ---
    startCustomerSystem() {
      if (this.customerLoopInterval) {
        clearInterval(this.customerLoopInterval);
        this.customerLoopInterval = null;
      }
      this.customerSpawnTimeouts.forEach(t => clearTimeout(t));
      this.customerSpawnTimeouts = [];
      this.activeCustomers = [];

      const queueSlots = this.level === 1 ? 2 : 3;
      for (let i = 0; i < queueSlots; i++) {
        this.spawnCustomer(i);
      }

      this.renderCustomers();
      this.updateAngryStrikesHUD();

      // Start timer loop (every 100ms)
      this.customerLoopInterval = setInterval(() => {
        this.updateCustomerTimers();
      }, 100);
    }

    spawnCustomer(slotIndex) {
      const cfg = this.getLevelConfig();
      const availableFlavors = (cfg && cfg.flavors && cfg.flavors.length > 0) ? cfg.flavors : ['orange', 'strawberry'];
      const requestedFlavor = availableFlavors[Math.floor(Math.random() * availableFlavors.length)];
      const profile = CUSTOMER_PROFILES[Math.floor(Math.random() * CUSTOMER_PROFILES.length)];

      // Patience duration: 25s - 38s (balanced for enjoyable matching)
      const baseDuration = Math.max(24000, 36000 - this.level * 600);
      const duration = baseDuration + Math.floor(Math.random() * 5000);

      const customer = {
        id: 'cust_' + Math.random().toString(36).substr(2, 9),
        avatarId: profile.id,
        name: profile.name,
        phrase: profile.phrase,
        requestedFlavor: requestedFlavor,
        duration: duration,
        elapsed: 0,
        status: 'waiting',
        isLeaving: false
      };

      if (slotIndex !== undefined && slotIndex >= 0 && slotIndex < this.activeCustomers.length) {
        this.activeCustomers[slotIndex] = customer;
      } else {
        this.activeCustomers.push(customer);
      }

      this.renderCustomers();
      if (this.isPlaying) {
        sfx.playCustomerBell();
      }
    }

    updateCustomerTimers() {
      if (!this.isPlaying) return;
      if (this.modalGameOver && !this.modalGameOver.classList.contains('hidden')) return;
      if (this.modalLevelWin && !this.modalLevelWin.classList.contains('hidden')) return;
      if (this.modalConfirmExit && !this.modalConfirmExit.classList.contains('hidden')) return;

      const now = Date.now();

      this.activeCustomers.forEach((cust, slotIdx) => {
        if (!cust || cust.isLeaving || cust.status !== 'waiting') return;

        cust.elapsed += 100;
        const remainingMs = Math.max(0, cust.duration - cust.elapsed);
        const ratio = remainingMs / cust.duration;

        const cardEl = document.getElementById(`cust-card-${cust.id}`);
        if (!cardEl) return;

        const fillEl = cardEl.querySelector('.customer-timer-fill');
        const secEl = cardEl.querySelector('.customer-timer-sec');
        const moodBadge = cardEl.querySelector('.customer-mood-badge');
        const avatarBox = cardEl.querySelector('.customer-avatar-box');

        if (fillEl) {
          fillEl.style.width = `${Math.max(0, Math.min(100, ratio * 100))}%`;
          if (ratio <= 0.25) {
            fillEl.className = 'customer-timer-fill danger';
          } else if (ratio <= 0.55) {
            fillEl.className = 'customer-timer-fill warn';
          } else {
            fillEl.className = 'customer-timer-fill';
          }
        }

        if (secEl) {
          secEl.textContent = `${Math.ceil(remainingMs / 1000)}s`;
        }

        // Mood states & sweating animation
        if (ratio <= 0.25) {
          if (moodBadge) moodBadge.textContent = '😰';
          if (avatarBox && !avatarBox.querySelector('.customer-sweat')) {
            const sweat = document.createElement('span');
            sweat.className = 'customer-sweat';
            sweat.textContent = '💦';
            avatarBox.appendChild(sweat);
          }
          cardEl.classList.add('customer-sweating');

          // Urgent tick sound
          if (remainingMs <= 5000 && remainingMs > 0 && (now - this.lastTickTime > 950)) {
            this.lastTickTime = now;
            sfx.playUrgentTick();
          }
        } else if (ratio <= 0.55) {
          if (moodBadge) moodBadge.textContent = '😐';
          cardEl.classList.remove('customer-sweating');
        } else {
          if (moodBadge) moodBadge.textContent = '😍';
          cardEl.classList.remove('customer-sweating');
        }

        // Timeout: Customer gets angry and leaves!
        if (remainingMs <= 0) {
          cust.isLeaving = true;
          cust.status = 'angry';
          this.handleCustomerAngryDeparture(cust, slotIdx);
        }
      });
    }

    handleCustomerAngryDeparture(cust, slotIdx) {
      const cardEl = document.getElementById(`cust-card-${cust.id}`);
      if (cardEl) {
        cardEl.classList.remove('customer-sweating');
        cardEl.classList.add('customer-angry-leave');
        const moodBadge = cardEl.querySelector('.customer-mood-badge');
        if (moodBadge) moodBadge.textContent = '😡';
      }

      sfx.playCustomerAngry();

      const app = document.getElementById('game-app');
      if (app) {
        app.classList.add('screen-shake');
        setTimeout(() => app.classList.remove('screen-shake'), 450);
      }

      this.angryStrikes++;
      this.updateAngryStrikesHUD();

      this.showToast(`😡 ${cust.name} got angry & left! Strike ${this.angryStrikes}/${this.maxAngryStrikes}!`);

      if (this.angryStrikes >= this.maxAngryStrikes) {
        // 3 Angry Customers Left -> OUT / GAME OVER!
        setTimeout(() => {
          this.handleGameOver('angry_customers');
        }, 600);
      } else {
        // Spawn replacement customer after delay
        const tid = setTimeout(() => {
          if (this.isPlaying) {
            this.spawnCustomer(slotIdx);
          }
        }, 1400);
        this.customerSpawnTimeouts.push(tid);
      }
    }

    tryServeCustomerWithCake(flavor) {
      const matchingIdx = this.activeCustomers.findIndex(
        c => c && c.status === 'waiting' && !c.isLeaving && c.requestedFlavor === flavor
      );

      if (matchingIdx === -1) return false;

      const cust = this.activeCustomers[matchingIdx];
      cust.status = 'served';
      cust.isLeaving = true;

      const cardEl = document.getElementById(`cust-card-${cust.id}`);
      if (cardEl) {
        cardEl.classList.remove('customer-sweating');
        cardEl.classList.add('customer-served-happy');
        const moodBadge = cardEl.querySelector('.customer-mood-badge');
        if (moodBadge) moodBadge.textContent = '💖';
      }

      sfx.playCustomerServed();

      // Bonus rewards for serving customer
      this.coins += 25;
      this.score += 120;
      this.updateHUD();
      this.saveData();

      const flvName = (FLAVORS[flavor] || FLAVORS.orange).name;
      this.showToast(`✨ Served ${cust.name} ${flvName} Cake! +25 🪙 +120 ⭐`);

      // Spawn replacement customer after celebration
      const tid = setTimeout(() => {
        if (this.isPlaying) {
          this.spawnCustomer(matchingIdx);
        }
      }, 1100);
      this.customerSpawnTimeouts.push(tid);

      return true;
    }

    updateAngryStrikesHUD() {
      if (!this.strikeDots || !this.angryStrikesPill) return;

      for (let i = 0; i < 3; i++) {
        const dot = this.strikeDots[i];
        if (!dot) continue;

        if (i < this.angryStrikes) {
          dot.textContent = '😡';
          dot.classList.add('active');
          if (this.angryStrikes >= 2) {
            dot.classList.add('pulse');
          } else {
            dot.classList.remove('pulse');
          }
        } else {
          dot.textContent = '💢';
          dot.classList.remove('active', 'pulse');
        }
      }

      if (this.angryStrikes >= 2) {
        this.angryStrikesPill.classList.add('danger');
      } else {
        this.angryStrikesPill.classList.remove('danger');
      }
    }

    renderCustomers() {
      if (!this.customerQueueContainer) return;
      this.customerQueueContainer.innerHTML = '';

      this.activeCustomers.forEach((cust, slotIdx) => {
        if (!cust) return;

        const flv = FLAVORS[cust.requestedFlavor] || FLAVORS.orange;
        const card = document.createElement('div');
        card.className = `customer-card ${cust.isLeaving ? '' : 'customer-enter'}`;
        card.id = `cust-card-${cust.id}`;

        const remainingMs = Math.max(0, cust.duration - cust.elapsed);
        const ratio = remainingMs / cust.duration;
        const warnClass = ratio <= 0.25 ? 'danger' : ratio <= 0.55 ? 'warn' : '';
        const avatarSvg = getCharacterAvatarSVG(cust.avatarId || 'chef_leo');

        card.innerHTML = `
          <div class="customer-card-header">
            <div class="customer-avatar-box">
              ${avatarSvg}
              <span class="customer-mood-badge">${ratio <= 0.25 ? '😰' : ratio <= 0.55 ? '😐' : '😍'}</span>
            </div>
            <div class="customer-order-bubble">
              <div class="order-flv-pill">
                <canvas class="order-cake-canvas" id="canvas-order-${cust.id}" width="22" height="22"></canvas>
                <div>
                  <div class="order-text">1x ${flv.name.split(' ')[0]}</div>
                  <div class="customer-name">${cust.name}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="customer-timer-wrapper">
            <div class="customer-timer-bar">
              <div class="customer-timer-fill ${warnClass}" style="width: ${ratio * 100}%;"></div>
            </div>
            <span class="customer-timer-sec">${Math.ceil(remainingMs / 1000)}s</span>
            <button class="customer-treat-btn" data-cust-id="${cust.id}" title="Serve Sweet Tea / Treat to this customer (+10s wait time!)">☕ +10s</button>
          </div>
        `;

        this.customerQueueContainer.appendChild(card);

        // Draw mini cake on customer card canvas
        const canvas = card.querySelector(`#canvas-order-${cust.id}`);
        if (canvas) {
          drawMiniCustomerCake(canvas, cust.requestedFlavor);
        }
      });
    }

    handleGameOver(reason = 'board_jam') {
      sfx.playGameOver();
      const titleEl = document.getElementById('gameover-title');
      const descEl = document.getElementById('gameover-desc');
      const infoEl = document.getElementById('gameover-out-info');
      const iconEl = document.getElementById('gameover-icon');

      if (reason === 'angry_customers') {
        if (iconEl) iconEl.textContent = '😡💔';
        if (titleEl) titleEl.textContent = '💔 YOU ARE OUT! 💔';
        if (descEl) descEl.textContent = '3 Customers got angry and left the bakery due to late orders!';
        if (infoEl) infoEl.innerHTML = '<span class="out-badge angry-badge">😡 3 / 3 Customers Left Angry</span>';
      } else {
        if (iconEl) iconEl.textContent = '💔🧁';
        if (titleEl) titleEl.textContent = '💔 YOU ARE OUT! 💔';
        if (descEl) descEl.textContent = `Level ${this.level} Out System: All ${this.maxLives} lives lost on Table Jam!`;
        if (infoEl) infoEl.innerHTML = `<span class="out-badge">💀 Level ${this.level} • 0/${this.maxLives} Lives Left</span>`;
      }
      this.modalGameOver.classList.remove('hidden');
    }

    generateRandomPlate() {
      const cfg = this.getLevelConfig();
      const minSlices = cfg.sliceMin || 1;
      const maxSlices = cfg.sliceMax || 4;
      const totalSlices = minSlices + Math.floor(Math.random() * (maxSlices - minSlices + 1));
      const isMixed = Math.random() < (cfg.mixedRate !== undefined ? cfg.mixedRate : 0.25) && cfg.flavors.length > 1;

      const slices = [];
      if (!isMixed) {
        const flv = cfg.flavors[Math.floor(Math.random() * cfg.flavors.length)];
        for (let i = 0; i < totalSlices; i++) slices.push(flv);
      } else {
        const flv1 = cfg.flavors[Math.floor(Math.random() * cfg.flavors.length)];
        let flv2 = cfg.flavors[Math.floor(Math.random() * cfg.flavors.length)];
        while (flv2 === flv1 && cfg.flavors.length > 1) {
          flv2 = cfg.flavors[Math.floor(Math.random() * cfg.flavors.length)];
        }
        for (let i = 0; i < totalSlices; i++) {
          slices.push(i < Math.ceil(totalSlices / 2) ? flv1 : flv2);
        }
      }
      return { id: Math.random().toString(), slices };
    }

    renderBoard() {
      const slotEls = this.gridContainer.children;
      for (let i = 0; i < 16; i++) {
        const slotEl = slotEls[i];
        const plate = this.board[i];
        slotEl.innerHTML = '';

        if (plate) {
          const plateView = document.createElement('div');
          plateView.className = 'plate-view';

          const dish = document.createElement('div');
          dish.className = 'plate-dish';
          plateView.appendChild(dish);

          const canvas = document.createElement('canvas');
          canvas.className = 'cake-canvas';
          canvas.width = 68;
          canvas.height = 68;
          drawPlateCakes(canvas, plate.slices);
          plateView.appendChild(canvas);

          slotEl.appendChild(plateView);
        }
      }
    }

    renderDock() {
      for (let i = 0; i < 3; i++) {
        const dockSlotEl = this.dockSlots[i];
        const plate = this.dock[i];
        dockSlotEl.innerHTML = '';

        if (i === this.selectedDockIndex) {
          dockSlotEl.classList.add('selected');
        } else {
          dockSlotEl.classList.remove('selected');
        }

        if (plate) {
          const plateView = document.createElement('div');
          plateView.className = 'plate-view';

          const dish = document.createElement('div');
          dish.className = 'plate-dish';
          plateView.appendChild(dish);

          const canvas = document.createElement('canvas');
          canvas.className = 'cake-canvas';
          canvas.width = 72;
          canvas.height = 72;
          drawPlateCakes(canvas, plate.slices);
          plateView.appendChild(canvas);

          dockSlotEl.appendChild(plateView);
        }
      }
    }

    // --- INTERACTION & PLACEMENT LOGIC ---
    handleDockClick(dockIndex) {
      sfx.init();
      if (this.isProcessingMerges || this.activeBooster) return;
      if (!this.dock[dockIndex]) return;

      if (this.selectedDockIndex === dockIndex) {
        this.selectedDockIndex = null;
      } else {
        this.selectedDockIndex = dockIndex;
        sfx.playPop();
      }
      this.renderDock();
    }

    handleSlotClick(slotIndex) {
      sfx.init();
      if (this.isProcessingMerges) return;

      // Handle Booster Mode actions
      if (this.activeBooster === 'hammer') {
        if (this.board[slotIndex]) {
          this.executeHammer(slotIndex);
        } else {
          this.showToast('Please tap a plate with cake to smash!');
        }
        return;
      }

      if (this.activeBooster === 'hand') {
        if (this.magicHandSelectedSlot === null) {
          if (this.board[slotIndex]) {
            this.magicHandSelectedSlot = slotIndex;
            this.boosterModeText.textContent = 'Now tap an empty slot to move it!';
            this.showToast('Plate selected. Tap destination slot!');
          }
        } else {
          if (!this.board[slotIndex]) {
            // Relocate plate
            this.board[slotIndex] = this.board[this.magicHandSelectedSlot];
            this.board[this.magicHandSelectedSlot] = null;
            this.boosters.hand--;
            this.exitBoosterMode();
            sfx.playPop();
            this.renderBoard();
            this.processAllMerges(slotIndex);
          } else {
            this.showToast('Destination must be an empty slot!');
          }
        }
        return;
      }

      // Normal Placement
      if (this.selectedDockIndex === null) {
        const firstAvailable = this.dock.findIndex(p => p !== null);
        if (firstAvailable !== -1 && !this.board[slotIndex]) {
          this.selectedDockIndex = firstAvailable;
        } else {
          return;
        }
      }

      if (this.board[slotIndex] !== null) {
        this.showToast('Slot is already occupied!');
        return;
      }

      this.handlePlacePlate(this.selectedDockIndex, slotIndex);
    }

    handlePlacePlate(dockIndex, slotIndex) {
      if (dockIndex === null || !this.dock[dockIndex]) return;
      if (this.board[slotIndex] !== null) return;

      const placedPlate = this.dock[dockIndex];
      this.board[slotIndex] = placedPlate;
      this.dock[dockIndex] = null;
      this.selectedDockIndex = null;

      sfx.playPop();
      this.renderBoard();
      this.renderDock();

      // Check if all 3 dock slots are empty; if so, refill
      if (this.dock.every(p => p === null)) {
        setTimeout(() => {
          for (let d = 0; d < 3; d++) {
            this.dock[d] = this.generateRandomPlate();
          }
          this.renderDock();
        }, 300);
      }

      // Trigger Merge & Cascade Engine
      this.processAllMerges(slotIndex);
    }

    // --- SORTING & MERGING CASCADE ENGINE ---
    getNeighbors(slotIndex) {
      const row = Math.floor(slotIndex / 4);
      const col = slotIndex % 4;
      const neighbors = [];

      if (row > 0) neighbors.push(slotIndex - 4); // Up
      if (row < 3) neighbors.push(slotIndex + 4); // Down
      if (col > 0) neighbors.push(slotIndex - 1); // Left
      if (col < 3) neighbors.push(slotIndex + 1); // Right

      return neighbors;
    }

    async processAllMerges(triggerSlot) {
      this.isProcessingMerges = true;
      let comboCount = 0;
      let hasMoreMerges = true;

      while (hasMoreMerges) {
        hasMoreMerges = false;

        // 1. Scan the board for adjacent plate pairs sharing flavor slices
        for (let i = 0; i < 16; i++) {
          const plateA = this.board[i];
          if (!plateA || plateA.slices.length === 0 || plateA.slices.length >= 6) continue;

          const neighbors = this.getNeighbors(i);
          for (const nIndex of neighbors) {
            const plateB = this.board[nIndex];
            if (!plateB || plateB.slices.length === 0) continue;

            // Find shared flavors
            const sharedFlavors = [...new Set(plateA.slices.filter(f => plateB.slices.includes(f)))];

            for (const flavor of sharedFlavors) {
              const countA = plateA.slices.filter(f => f === flavor).length;
              const countB = plateB.slices.filter(f => f === flavor).length;

              // Determine destination plate (the one with more or equal of this flavor that has room)
              let destIndex = i;
              let srcIndex = nIndex;

              if (countB > countA) {
                destIndex = nIndex;
                srcIndex = i;
              }

              const destPlate = this.board[destIndex];
              const srcPlate = this.board[srcIndex];

              const spaceAvailable = 6 - destPlate.slices.length;
              const srcSlicesOfFlavor = srcPlate.slices.filter(f => f === flavor).length;

              if (spaceAvailable > 0 && srcSlicesOfFlavor > 0) {
                const slicesToMove = Math.min(spaceAvailable, srcSlicesOfFlavor);

                if (slicesToMove > 0) {
                  // Execute slice transfer animation
                  await this.animateSliceTransfer(srcIndex, destIndex, flavor, slicesToMove);
                  comboCount++;
                  sfx.playMerge(comboCount);
                  hasMoreMerges = true;
                  break;
                }
              }
            }
            if (hasMoreMerges) break;
          }
          if (hasMoreMerges) break;
        }

        // 2. Check for completed 6-slice cakes
        let fullCakeCleared = false;
        for (let i = 0; i < 16; i++) {
          const plate = this.board[i];
          if (plate && plate.slices.length === 6) {
            // Check if all 6 slices are of identical flavor
            const firstFlavor = plate.slices[0];
            const isFullSameFlavor = plate.slices.every(f => f === firstFlavor);

            if (isFullSameFlavor) {
              await this.clearCompletedCake(i, firstFlavor);
              fullCakeCleared = true;
              hasMoreMerges = true; // Clearing might open cascading opportunities
            }
          }
        }

        if (fullCakeCleared) {
          // Extra pause for satisfying rhythm
          await new Promise(r => setTimeout(r, 200));
        }
      }

      this.isProcessingMerges = false;

      // Check Level Target Win
      const cfg = this.getLevelConfig();
      if (this.levelCompletedSlices >= cfg.targetCount) {
        this.handleLevelWin();
        return;
      }

      // Check Board Full / Game Over
      this.checkBoardFull();
    }

    animateSliceTransfer(srcSlot, destSlot, flavor, count) {
      return new Promise((resolve) => {
        const slotEls = this.gridContainer.children;
        const srcEl = slotEls[srcSlot];
        const destEl = slotEls[destSlot];

        const srcRect = srcEl.getBoundingClientRect();
        const destRect = destEl.getBoundingClientRect();
        const stageRect = document.querySelector('.game-stage').getBoundingClientRect();

        const startX = srcRect.left + srcRect.width / 2 - stageRect.left;
        const startY = srcRect.top + srcRect.height / 2 - stageRect.top;
        const endX = destRect.left + destRect.width / 2 - stageRect.left;
        const endY = destRect.top + destRect.height / 2 - stageRect.top;

        // Remove from source plate data
        const srcPlate = this.board[srcSlot];
        for (let c = 0; c < count; c++) {
          const idx = srcPlate.slices.lastIndexOf(flavor);
          if (idx !== -1) srcPlate.slices.splice(idx, 1);
        }
        this.renderBoard();

        sfx.playWhoosh();

        // Launch flying slice particles
        this.fx.addFlyingSlice(startX, startY, endX, endY, flavor, () => {
          // Add to dest plate data
          const destPlate = this.board[destSlot];
          for (let c = 0; c < count; c++) {
            destPlate.slices.push(flavor);
          }
          this.renderBoard();
          resolve();
        });
      });
    }

    clearCompletedCake(slotIndex, flavor) {
      return new Promise((resolve) => {
        const slotEls = this.gridContainer.children;
        const slotEl = slotEls[slotIndex];
        const stageRect = document.querySelector('.game-stage').getBoundingClientRect();
        const rect = slotEl.getBoundingClientRect();

        const cx = rect.left + rect.width / 2 - stageRect.left;
        const cy = rect.top + rect.height / 2 - stageRect.top;

        sfx.playCakeComplete();
        this.fx.createConfetti(cx, cy, (FLAVORS[flavor] || FLAVORS.orange).primary);

        // Update score and level target
        this.score += 60;
        this.coins += 5;
        this.levelCompletedSlices += 6;
        this.updateHUD();
        this.saveData();

        // Serve customer if someone requested this flavor!
        this.tryServeCustomerWithCake(flavor);

        // Remove plate from board
        setTimeout(() => {
          this.board[slotIndex] = null;
          this.renderBoard();
          resolve();
        }, 250);
      });
    }

    checkBoardFull() {
      const isBoardFull = this.board.every(p => p !== null);
      if (!isBoardFull) return;

      // Check if any adjacent plates can merge
      let hasPotentialMerge = false;
      for (let i = 0; i < 16; i++) {
        const plateA = this.board[i];
        if (!plateA || plateA.slices.length === 0 || plateA.slices.length >= 6) continue;
        const neighbors = this.getNeighbors(i);
        for (const nIndex of neighbors) {
          const plateB = this.board[nIndex];
          if (!plateB || plateB.slices.length === 0) continue;
          const shared = plateA.slices.some(f => plateB.slices.includes(f));
          if (shared && (plateA.slices.length < 6 || plateB.slices.length < 6)) {
            hasPotentialMerge = true;
            break;
          }
        }
        if (hasPotentialMerge) break;
      }

      if (!hasPotentialMerge) {
        // Table is completely full and locked!
        const cfg = this.getLevelConfig();
        if (!cfg.hasOutSystem || this.level === 1) {
          // Level 1: Practice Mode - NO OUT!
          this.showToast('🛡️ Safe Mode: Clearing 2 plates for you! (No Out in Level 1)');
          sfx.playHammer();
          setTimeout(() => {
            const occupied = [];
            for (let i = 0; i < 16; i++) if (this.board[i]) occupied.push(i);
            const toClear = occupied.sort(() => 0.5 - Math.random()).slice(0, 2);
            toClear.forEach(idx => {
              this.board[idx] = null;
            });
            this.renderBoard();
          }, 600);
        } else {
          // Level 2+: Out System Active!
          const app = document.getElementById('game-app');
          if (app) {
            app.classList.add('screen-shake');
            setTimeout(() => app.classList.remove('screen-shake'), 450);
          }

          sfx.playLifeLost();
          this.currentLives--;
          this.updateLivesHUD();

          if (this.currentLives > 0) {
            this.showToast(`💔 Out Strike! 1 Life Lost (${this.currentLives}/${this.maxLives} remaining)`);
            // Auto-clear 1 jammed plate with debris to let player keep playing
            setTimeout(() => {
              const occupied = [];
              for (let i = 0; i < 16; i++) if (this.board[i]) occupied.push(i);
              if (occupied.length > 0) {
                const randomSlot = occupied[Math.floor(Math.random() * occupied.length)];
                this.board[randomSlot] = null;
                this.renderBoard();
                this.showToast('🔨 1 Plate cleared so you can recover!');
              }
            }, 600);
          } else {
            // OUT! Game Over
            setTimeout(() => {
              this.handleGameOver('board_jam');
            }, 500);
          }
        }
      }
    }

    handleLevelWin() {
      sfx.playLevelWin();
      this.score += 100;
      this.coins += 50;
      this.updateHUD();
      this.saveData();

      document.getElementById('win-level-label').textContent = `Level ${this.level} Mastered!`;
      this.modalLevelWin.classList.remove('hidden');
    }

    // --- BOOSTERS IMPLEMENTATION ---
    activateHammer() {
      sfx.init();
      if (this.boosters.hammer <= 0) {
        this.showToast('No Hammers left! Win more in Lucky Spin.');
        return;
      }
      this.activeBooster = 'hammer';
      this.boosterModeText.textContent = '🔨 Tap any plate on the table to smash!';
      this.boosterModeBanner.classList.remove('hidden');
      document.getElementById('booster-hammer').classList.add('active');
    }

    executeHammer(slotIndex) {
      const slotEls = this.gridContainer.children;
      const slotEl = slotEls[slotIndex];
      const stageRect = document.querySelector('.game-stage').getBoundingClientRect();
      const rect = slotEl.getBoundingClientRect();

      const cx = rect.left + rect.width / 2 - stageRect.left;
      const cy = rect.top + rect.height / 2 - stageRect.top;

      sfx.playHammer();
      this.fx.createSmashDebris(cx, cy);

      this.board[slotIndex] = null;
      this.boosters.hammer--;
      this.exitBoosterMode();
      this.renderBoard();
      this.updateHUD();
      this.saveData();
      this.showToast('Plate smashed!');
    }

    activateSwap() {
      sfx.init();
      if (this.boosters.swap <= 0) {
        this.showToast('No Swaps left! Win more in Lucky Spin.');
        return;
      }
      this.boosters.swap--;
      sfx.playWhoosh();
      for (let i = 0; i < 3; i++) {
        this.dock[i] = this.generateRandomPlate();
      }
      this.selectedDockIndex = null;
      this.renderDock();
      this.updateHUD();
      this.saveData();
      this.showToast('Tray plates refreshed!');
    }

    activateHand() {
      sfx.init();
      if (this.boosters.hand <= 0) {
        this.showToast('No Magic Hands left! Win more in Lucky Spin.');
        return;
      }
      this.activeBooster = 'hand';
      this.magicHandSelectedSlot = null;
      this.boosterModeText.textContent = '🖐️ Tap a plate on table to pick up!';
      this.boosterModeBanner.classList.remove('hidden');
      document.getElementById('booster-hand').classList.add('active');
    }

    exitBoosterMode() {
      this.activeBooster = null;
      this.magicHandSelectedSlot = null;
      this.boosterModeBanner.classList.add('hidden');
      document.getElementById('booster-hammer').classList.remove('active');
      document.getElementById('booster-hand').classList.remove('active');
    }

    giveCustomerExtraWait(custId) {
      sfx.init();
      const cust = this.activeCustomers.find(c => c && c.id === custId && !c.isLeaving && c.status === 'waiting');
      if (!cust) return;

      // Add +10 seconds of patience time
      const extraMs = 10000;
      cust.elapsed = Math.max(0, cust.elapsed - extraMs);

      sfx.playCustomerBell();

      const cardEl = document.getElementById(`cust-card-${cust.id}`);
      if (cardEl) {
        cardEl.classList.remove('customer-sweating');
        cardEl.classList.remove('customer-treat-glow');
        void cardEl.offsetWidth; // trigger reflow
        cardEl.classList.add('customer-treat-glow');

        const moodBadge = cardEl.querySelector('.customer-mood-badge');
        if (moodBadge) moodBadge.textContent = '😍';

        // Floating text
        const floatEl = document.createElement('div');
        floatEl.className = 'floating-patience-text';
        floatEl.textContent = '+10s ☕💖';
        cardEl.appendChild(floatEl);
        setTimeout(() => floatEl.remove(), 1200);
      }

      this.showToast(`☕ Served treat to ${cust.name}! +10s Extra Wait Time!`);
    }

    activateCoffeeTreat() {
      sfx.init();
      const waitingCustomers = this.activeCustomers.filter(c => c && !c.isLeaving && c.status === 'waiting');
      if (waitingCustomers.length === 0) {
        this.showToast('No waiting customers right now!');
        return;
      }

      if ((this.boosters.coffee || 0) <= 0) {
        if (this.coins >= 50) {
          this.coins -= 50;
          this.boosters.coffee = 2; // Bought 3, using 1 now
          this.showToast('Purchased 3x Coffee Treats for 50 🪙!');
        } else {
          this.showToast('No Coffee Treats left! (Need 50 🪙 to buy)');
          return;
        }
      } else {
        this.boosters.coffee--;
      }

      sfx.playCustomerServed();

      waitingCustomers.forEach(cust => {
        cust.elapsed = Math.max(0, cust.elapsed - 15000);
        const cardEl = document.getElementById(`cust-card-${cust.id}`);
        if (cardEl) {
          cardEl.classList.remove('customer-sweating');
          cardEl.classList.remove('customer-treat-glow');
          void cardEl.offsetWidth;
          cardEl.classList.add('customer-treat-glow');

          const moodBadge = cardEl.querySelector('.customer-mood-badge');
          if (moodBadge) moodBadge.textContent = '😍';

          const floatEl = document.createElement('div');
          floatEl.className = 'floating-patience-text';
          floatEl.textContent = '+15s ☕💖';
          cardEl.appendChild(floatEl);
          setTimeout(() => floatEl.remove(), 1200);
        }
      });

      this.updateHUD();
      this.saveData();
      this.showToast('☕ Served Coffee Treats! +15s Wait Time for all clients! 😍');
    }

    // --- LUCKY SPIN WHEEL ---
    initSpinWheel() {
      const canvas = document.getElementById('spin-canvas');
      const ctx = canvas.getContext('2d');
      const segments = [
        { label: '50 🪙', color: '#ff9f43' },
        { label: '🔨 Hammer', color: '#54a0ff' },
        { label: '100 🪙', color: '#1dd1a1' },
        { label: '🔄 Swap', color: '#f368e0' },
        { label: '25 🪙', color: '#ff6b6b' },
        { label: '🖐️ Hand', color: '#5f27cd' },
        { label: '200 🪙', color: '#ff9f43' },
        { label: '🎁 Jackpot!', color: '#ffd32a' }
      ];

      let currentAngle = 0;
      let isSpinning = false;

      function drawWheel(angle) {
        const numSegs = segments.length;
        const arc = (Math.PI * 2) / numSegs;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = canvas.width / 2 - 10;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        segments.forEach((seg, i) => {
          const startAngle = angle + i * arc;
          const endAngle = startAngle + arc;

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, radius, startAngle, endAngle);
          ctx.fillStyle = seg.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Segment Text
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(startAngle + arc / 2);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 13px Fredoka, sans-serif';
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 4;
          ctx.fillText(seg.label, radius - 15, 5);
          ctx.restore();
        });

        // Center hub
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#2f3542';
        ctx.stroke();
      }

      drawWheel(0);

      const doSpinBtn = document.getElementById('btn-do-spin');
      const rewardBanner = document.getElementById('spin-reward-banner');

      doSpinBtn.onclick = () => {
        if (isSpinning) return;
        sfx.init();
        isSpinning = true;
        rewardBanner.classList.add('hidden');
        doSpinBtn.disabled = true;

        const targetRotations = 5 + Math.random() * 4;
        const targetAngle = currentAngle + targetRotations * Math.PI * 2 + Math.random() * Math.PI * 2;
        const duration = 4000;
        const startTime = performance.now();

        const animateSpin = (now) => {
          const elapsed = now - startTime;
          const t = Math.min(1, elapsed / duration);
          // Ease out cubic
          const ease = 1 - Math.pow(1 - t, 3);
          const cur = currentAngle + (targetAngle - currentAngle) * ease;

          drawWheel(cur);
          if (Math.floor(cur * 10) % 2 === 0) sfx.playTick();

          if (t < 1) {
            requestAnimationFrame(animateSpin);
          } else {
            currentAngle = cur % (Math.PI * 2);
            isSpinning = false;
            doSpinBtn.disabled = false;

            // Calculate winner (Pointer is at top = -Math.PI / 2)
            const numSegs = segments.length;
            const arc = (Math.PI * 2) / numSegs;
            const norm = (Math.PI * 1.5 - currentAngle) % (Math.PI * 2);
            const positiveNorm = norm < 0 ? norm + Math.PI * 2 : norm;
            const winIndex = Math.floor(positiveNorm / arc) % numSegs;
            const winner = segments[winIndex];

            // Award prize
            if (winner.label.includes('50 🪙')) this.coins += 50;
            else if (winner.label.includes('100 🪙')) this.coins += 100;
            else if (winner.label.includes('200 🪙')) this.coins += 200;
            else if (winner.label.includes('25 🪙')) this.coins += 25;
            else if (winner.label.includes('Jackpot')) { this.coins += 300; this.boosters.hammer++; }
            else if (winner.label.includes('Hammer')) this.boosters.hammer++;
            else if (winner.label.includes('Swap')) this.boosters.swap++;
            else if (winner.label.includes('Hand')) this.boosters.hand++;

            sfx.playLevelWin();
            this.updateHUD();
            this.saveData();

            rewardBanner.textContent = `🎉 You won ${winner.label}!`;
            rewardBanner.classList.remove('hidden');
          }
        };

        requestAnimationFrame(animateSpin);
      };
    }

    // --- EVENT LISTENERS ---
    initEventListeners() {
      // --- TOUCH & POINTER DRAG & DROP FOR DOCK PLATES ---
      let isDragging = false;
      let dragDockIdx = null;
      let dragFloatingEl = null;
      let hoveredSlotEl = null;
      let dragMoved = false;

      const startDrag = (dockIdx, clientX, clientY) => {
        if (this.isProcessingMerges || this.activeBooster) return;
        if (!this.dock[dockIdx]) return;

        sfx.init();

        isDragging = true;
        dragDockIdx = dockIdx;
        dragMoved = false;
        this.selectedDockIndex = dockIdx;
        this.renderDock();

        const dockSlotEl = this.dockSlots[dockIdx];
        if (dockSlotEl) dockSlotEl.classList.add('dragging-source');

        // Create floating plate
        dragFloatingEl = document.createElement('div');
        dragFloatingEl.className = 'drag-floating-plate';
        dragFloatingEl.style.left = `${clientX}px`;
        dragFloatingEl.style.top = `${clientY}px`;

        const dish = document.createElement('div');
        dish.className = 'plate-dish';
        dragFloatingEl.appendChild(dish);

        const canvas = document.createElement('canvas');
        canvas.className = 'cake-canvas';
        canvas.width = 72;
        canvas.height = 72;
        drawPlateCakes(canvas, this.dock[dockIdx].slices);
        dragFloatingEl.appendChild(canvas);

        document.body.appendChild(dragFloatingEl);
      };

      const moveDrag = (clientX, clientY) => {
        if (!isDragging || !dragFloatingEl) return;
        dragMoved = true;
        dragFloatingEl.style.left = `${clientX}px`;
        dragFloatingEl.style.top = `${clientY}px`;

        // Check hovered slot
        const underEl = document.elementFromPoint(clientX, clientY);
        const slotEl = underEl ? underEl.closest('.grid-slot') : null;

        if (slotEl !== hoveredSlotEl) {
          if (hoveredSlotEl) hoveredSlotEl.classList.remove('highlight-valid');
          hoveredSlotEl = slotEl;
          if (hoveredSlotEl) {
            const slotIdx = parseInt(hoveredSlotEl.dataset.slotIndex, 10);
            if (this.board[slotIdx] === null) {
              hoveredSlotEl.classList.add('highlight-valid');
            }
          }
        }
      };

      const endDrag = (clientX, clientY) => {
        if (!isDragging) return;
        isDragging = false;

        if (hoveredSlotEl) {
          hoveredSlotEl.classList.remove('highlight-valid');
          hoveredSlotEl = null;
        }

        const underEl = document.elementFromPoint(clientX, clientY);
        const slotEl = underEl ? underEl.closest('.grid-slot') : null;

        if (slotEl && dragDockIdx !== null) {
          const targetSlotIdx = parseInt(slotEl.dataset.slotIndex, 10);
          if (this.board[targetSlotIdx] === null) {
            this.handlePlacePlate(dragDockIdx, targetSlotIdx);
          }
        }

        if (dragFloatingEl && dragFloatingEl.parentNode) {
          dragFloatingEl.parentNode.removeChild(dragFloatingEl);
        }
        dragFloatingEl = null;

        if (dragDockIdx !== null && this.dockSlots[dragDockIdx]) {
          this.dockSlots[dragDockIdx].classList.remove('dragging-source');
        }
        dragDockIdx = null;
      };

      this.dockSlots.forEach((slotEl, idx) => {
        slotEl.addEventListener('pointerdown', (e) => {
          if (e.button !== 0 && e.button !== undefined) return;
          startDrag(idx, e.clientX, e.clientY);
        });

        // Click fallback for tap-to-select
        slotEl.addEventListener('click', (e) => {
          if (!dragMoved) {
            this.handleDockClick(idx);
          }
        });
      });

      window.addEventListener('pointermove', (e) => {
        if (isDragging) {
          moveDrag(e.clientX, e.clientY);
        }
      });

      window.addEventListener('pointerup', (e) => {
        if (isDragging) {
          endDrag(e.clientX, e.clientY);
        }
      });

      window.addEventListener('pointercancel', (e) => {
        if (isDragging) {
          endDrag(e.clientX, e.clientY);
        }
      });

      // Table Slot Click (also works for tap-to-place)
      this.gridContainer.addEventListener('click', (e) => {
        const slotEl = e.target.closest('.grid-slot');
        if (slotEl) {
          const idx = parseInt(slotEl.dataset.slotIndex, 10);
          this.handleSlotClick(idx);
        }
      });

      // Cancel Booster Button
      document.getElementById('btn-cancel-booster').addEventListener('click', () => {
        this.exitBoosterMode();
      });

      // Booster Buttons
      document.getElementById('booster-hammer').addEventListener('click', () => this.activateHammer());
      document.getElementById('booster-swap').addEventListener('click', () => this.activateSwap());
      document.getElementById('booster-hand').addEventListener('click', () => this.activateHand());
      const boosterCoffee = document.getElementById('booster-coffee');
      if (boosterCoffee) {
        boosterCoffee.addEventListener('click', () => this.activateCoffeeTreat());
      }

      // Customer Card / Treat Button Click Delegation
      if (this.customerQueueContainer) {
        this.customerQueueContainer.addEventListener('click', (e) => {
          const treatBtn = e.target.closest('.customer-treat-btn');
          if (treatBtn) {
            e.stopPropagation();
            this.giveCustomerExtraWait(treatBtn.dataset.custId);
            return;
          }
          const custCard = e.target.closest('.customer-card');
          if (custCard && !custCard.classList.contains('customer-served-happy')) {
            const custId = custCard.id.replace('cust-card-', '');
            this.giveCustomerExtraWait(custId);
          }
        });
      }

      // Header Buttons
      document.getElementById('btn-settings').addEventListener('click', () => {
        this.modalSettings.classList.remove('hidden');
      });

      document.getElementById('btn-spin').addEventListener('click', () => {
        this.modalSpin.classList.remove('hidden');
      });

      document.getElementById('btn-no-ads').addEventListener('click', () => {
        this.showToast('✨ Premium Ad-Free Experience Active!');
      });

      // Level Select Triggers
      const hudLevelPill = document.getElementById('btn-select-level-hud');
      if (hudLevelPill) {
        hudLevelPill.addEventListener('click', () => this.showLevelSelectModal());
      }

      const quickLevelBtn = document.getElementById('btn-quick-choose-level');
      if (quickLevelBtn) {
        quickLevelBtn.addEventListener('click', () => this.showLevelSelectModal());
      }

      const menuChooseLevelBtn = document.getElementById('btn-menu-choose-level');
      if (menuChooseLevelBtn) {
        menuChooseLevelBtn.addEventListener('click', () => this.showLevelSelectModal());
      }

      const closeLevelModalBtn = document.getElementById('close-level-modal');
      if (closeLevelModalBtn) {
        closeLevelModalBtn.addEventListener('click', () => this.hideLevelSelectModal());
      }

      const winChooseLevelBtn = document.getElementById('btn-win-choose-level');
      if (winChooseLevelBtn) {
        winChooseLevelBtn.addEventListener('click', () => {
          this.modalLevelWin.classList.add('hidden');
          this.showLevelSelectModal();
        });
      }

      const gameoverChooseLevelBtn = document.getElementById('btn-gameover-choose-level');
      if (gameoverChooseLevelBtn) {
        gameoverChooseLevelBtn.addEventListener('click', () => {
          this.modalGameOver.classList.add('hidden');
          this.showLevelSelectModal();
        });
      }

      const settingsChooseLevelBtn = document.getElementById('btn-settings-choose-level');
      if (settingsChooseLevelBtn) {
        settingsChooseLevelBtn.addEventListener('click', () => {
          this.modalSettings.classList.add('hidden');
          this.showLevelSelectModal();
        });
      }

      // Modal Close Buttons
      document.getElementById('close-settings-modal').addEventListener('click', () => {
        this.modalSettings.classList.add('hidden');
      });

      document.getElementById('close-spin-modal').addEventListener('click', () => {
        this.modalSpin.classList.add('hidden');
      });

      document.getElementById('close-how-modal').addEventListener('click', () => {
        this.modalHow.classList.add('hidden');
      });

      document.getElementById('btn-got-it').addEventListener('click', () => {
        this.modalHow.classList.add('hidden');
      });

      document.getElementById('btn-how-to-play').addEventListener('click', () => {
        this.modalSettings.classList.add('hidden');
        this.modalHow.classList.remove('hidden');
      });

      document.getElementById('btn-restart-level').addEventListener('click', () => {
        this.modalSettings.classList.add('hidden');
        this.startLevel(this.level);
      });

      // Next Level Button
      document.getElementById('btn-next-level').addEventListener('click', () => {
        this.modalLevelWin.classList.add('hidden');
        this.startLevel(this.level + 1);
      });

      // Game Over Revive & Retry
      document.getElementById('btn-use-hammer-revive').addEventListener('click', () => {
        this.modalGameOver.classList.add('hidden');
        this.angryStrikes = 0;
        this.updateAngryStrikesHUD();
        this.currentLives = Math.max(1, this.currentLives);
        this.updateLivesHUD();
        this.boosters.hammer++;
        this.startCustomerSystem();
        this.showToast('💖 Bakery Revived! Customers are happy again!');
        this.activateHammer();
      });

      document.getElementById('btn-retry-level').addEventListener('click', () => {
        this.modalGameOver.classList.add('hidden');
        this.startLevel(this.level);
      });

      // Settings Toggles
      document.getElementById('toggle-sfx').addEventListener('change', (e) => {
        sfx.enabled = e.target.checked;
      });

      // --- START MENU & EXIT NAVIGATION LISTENERS ---
      const playBtn = document.getElementById('btn-play-game');
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          sfx.init();
          sfx.playPlace();
          this.hideStartMenu();
        });
      }

      // Exit button in HUD Header
      const exitBtn = document.getElementById('btn-exit-game');
      if (exitBtn) {
        exitBtn.addEventListener('click', () => {
          sfx.init();
          sfx.playPop();
          this.modalConfirmExit.classList.remove('hidden');
        });
      }

      // Confirm Exit Dialog Buttons
      const confirmExitBtn = document.getElementById('btn-confirm-exit');
      if (confirmExitBtn) {
        confirmExitBtn.addEventListener('click', () => {
          sfx.playPop();
          this.modalConfirmExit.classList.add('hidden');
          this.modalSettings.classList.add('hidden');
          this.modalLevelWin.classList.add('hidden');
          this.modalGameOver.classList.add('hidden');
          this.showStartMenu();
        });
      }

      const cancelExitBtn = document.getElementById('btn-cancel-exit');
      if (cancelExitBtn) {
        cancelExitBtn.addEventListener('click', () => {
          sfx.playPop();
          this.modalConfirmExit.classList.add('hidden');
        });
      }

      // Exit buttons inside other modals
      const settingsExitBtn = document.getElementById('btn-settings-exit');
      if (settingsExitBtn) {
        settingsExitBtn.addEventListener('click', () => {
          sfx.playPop();
          this.modalSettings.classList.add('hidden');
          this.showStartMenu();
        });
      }

      const winExitBtn = document.getElementById('btn-win-exit');
      if (winExitBtn) {
        winExitBtn.addEventListener('click', () => {
          sfx.playPop();
          this.modalLevelWin.classList.add('hidden');
          this.startLevel(this.level + 1);
          this.showStartMenu();
        });
      }

      const gameoverExitBtn = document.getElementById('btn-gameover-exit');
      if (gameoverExitBtn) {
        gameoverExitBtn.addEventListener('click', () => {
          sfx.playPop();
          this.modalGameOver.classList.add('hidden');
          this.startLevel(this.level);
          this.showStartMenu();
        });
      }

      // Start Menu Secondary Buttons
      const menuSpinBtn = document.getElementById('btn-menu-spin');
      if (menuSpinBtn) {
        menuSpinBtn.addEventListener('click', () => {
          sfx.init();
          sfx.playPop();
          this.modalSpin.classList.remove('hidden');
        });
      }

      const menuHowBtn = document.getElementById('btn-menu-how');
      if (menuHowBtn) {
        menuHowBtn.addEventListener('click', () => {
          sfx.init();
          sfx.playPop();
          this.modalHow.classList.remove('hidden');
        });
      }

      const menuSettingsBtn = document.getElementById('btn-menu-settings');
      if (menuSettingsBtn) {
        menuSettingsBtn.addEventListener('click', () => {
          sfx.init();
          sfx.playPop();
          this.modalSettings.classList.remove('hidden');
        });
      }

      this.initSpinWheel();
    }
  }

  // Launch Game
  window.addEventListener('DOMContentLoaded', () => {
    new CakeSortGame();
  });
})();
