/**
 * DIAMOND & GEMSTONE MERGE GAME (Suika Style)
 * Complete Game Engine, Physics, Sound Synthesizer & Particle Systems
 */

(function () {
  'use strict';

  // ==========================================
  // 1. GEM TIERS CONFIGURATION & DEFINITIONS
  // ==========================================
  const GEM_TIERS = [
    {
      tier: 0,
      name: "Emerald Pebble",
      radius: 17,
      score: 2,
      color: "#10b981",
      accent: "#34d399",
      shape: "circle",
      sparkleColor: "rgba(52, 211, 153, 0.8)",
      soundFreq: 523.25 // C5
    },
    {
      tier: 1,
      name: "Amber Shard",
      radius: 23,
      score: 4,
      color: "#f59e0b",
      accent: "#fbbf24",
      shape: "circle",
      sparkleColor: "rgba(251, 191, 36, 0.8)",
      soundFreq: 587.33 // D5
    },
    {
      tier: 2,
      name: "Amethyst Orb",
      radius: 31,
      score: 8,
      color: "#8b5cf6",
      accent: "#a78bfa",
      shape: "sphere",
      sparkleColor: "rgba(167, 139, 250, 0.8)",
      soundFreq: 659.25 // E5
    },
    {
      tier: 3,
      name: "Ruby Cushion",
      radius: 39,
      score: 16,
      color: "#ef4444",
      accent: "#f87171",
      shape: "cushion",
      sparkleColor: "rgba(248, 113, 113, 0.8)",
      soundFreq: 783.99 // G5
    },
    {
      tier: 4,
      name: "Aquamarine Prism",
      radius: 48,
      score: 32,
      color: "#06b6d4",
      accent: "#22d3ee",
      shape: "prism",
      sparkleColor: "rgba(34, 211, 238, 0.8)",
      soundFreq: 880.00 // A5
    },
    {
      tier: 5,
      name: "Sapphire Teardrop",
      radius: 58,
      score: 64,
      color: "#0284c7",
      accent: "#38bdf8",
      shape: "teardrop",
      sparkleColor: "rgba(56, 189, 248, 0.8)",
      soundFreq: 1046.50 // C6
    },
    {
      tier: 6,
      name: "Golden Sun Topaz",
      radius: 69,
      score: 128,
      color: "#eab308",
      accent: "#fef08a",
      shape: "star",
      sparkleColor: "rgba(254, 240, 138, 0.8)",
      soundFreq: 1174.66 // D6
    },
    {
      tier: 7,
      name: "Rose Quartz Heart",
      radius: 80,
      score: 256,
      color: "#ec4899",
      accent: "#f472b6",
      shape: "heart",
      sparkleColor: "rgba(244, 114, 182, 0.8)",
      soundFreq: 1318.51 // E6
    },
    {
      tier: 8,
      name: "Grand Cyan Diamond",
      radius: 93,
      score: 512,
      color: "#00f2fe",
      accent: "#a7f3d0",
      shape: "diamond",
      sparkleColor: "rgba(0, 242, 254, 0.9)",
      soundFreq: 1567.98 // G6
    },
    {
      tier: 9,
      name: "Cosmic Void Gem",
      radius: 107,
      score: 1024,
      color: "#6366f1",
      accent: "#c084fc",
      shape: "cosmic",
      sparkleColor: "rgba(192, 132, 252, 0.9)",
      soundFreq: 1760.00 // A6
    },
    {
      tier: 10,
      name: "Divine Crown Prism",
      radius: 122,
      score: 2048,
      color: "#ff007f",
      accent: "#fef08a",
      shape: "crown",
      sparkleColor: "rgba(255, 255, 255, 1.0)",
      soundFreq: 2093.00 // C7
    }
  ];

  const MAX_SPAWN_TIER = 3; // Dropper drops tier 0..3
  const PILLAR_WIDTH = 62;
  const DANGER_Y = 115;
  const DANGER_LIMIT_SECONDS = 2.8;

  // ==========================================
  // 2. AUDIO SYNTHESIZER (Web Audio API)
  // ==========================================
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playDrop() {
      if (this.muted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } catch (e) {}
    }

    playClink(force = 1) {
      if (this.muted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const now = this.ctx.currentTime;
        const baseFreq = 1200 + Math.random() * 600;
        osc.frequency.setValueAtTime(baseFreq, now);
        const volume = Math.min(0.18, 0.04 * force);
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      } catch (e) {}
    }

    playMerge(tier, comboCount = 1) {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const baseFreq = GEM_TIERS[tier]?.soundFreq || 520;
        
        // Play crystalline multi-harmonic chord
        const harmonics = [1, 1.25, 1.5, 2.0]; // Major triad with octave
        harmonics.forEach((h, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = idx === 0 ? 'sine' : 'triangle';
          
          const freq = baseFreq * h * (1 + (comboCount - 1) * 0.04);
          osc.frequency.setValueAtTime(freq, now + idx * 0.03);
          
          const dur = 0.35 + tier * 0.05;
          const vol = 0.15 / (idx + 1);
          gain.gain.setValueAtTime(vol, now + idx * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.03 + dur);
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.03);
          osc.stop(now + idx * 0.03 + dur);
        });
      } catch (e) {}
    }

    playGameOver() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [440, 392, 349, 311].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.16);
          gain.gain.setValueAtTime(0.12, now + idx * 0.16);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.16);
          osc.stop(now + idx * 0.16 + 0.25);
        });
      } catch (e) {}
    }

    playCountBeep(isUrgent = false) {
      if (this.muted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const now = this.ctx.currentTime;
        const freq = isUrgent ? 880 : 587.33;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } catch (e) {}
    }

    playRevive() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [350, 520, 700, 1050, 1400].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + idx * 0.06 + 0.2);
          gain.gain.setValueAtTime(0.15, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.25);
        });
      } catch (e) {}
    }
  }

  const sfx = new SoundFX();

  // ==========================================
  // 3. PROCEDURAL GEM RENDERER
  // ==========================================
  class GemSpriteRenderer {
    static drawGem(ctx, x, y, tier, angle = 0, scale = 1.0) {
      const data = GEM_TIERS[tier];
      if (!data) return;

      const r = data.radius * scale;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Outer glow aura
      const aura = ctx.createRadialGradient(0, 0, r * 0.6, 0, 0, r * 1.3);
      aura.addColorStop(0, data.sparkleColor);
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.3, 0, Math.PI * 2);
      ctx.fill();

      switch (data.shape) {
        case 'circle':
        case 'sphere':
          this.drawSphereGem(ctx, r, data);
          break;
        case 'cushion':
          this.drawCushionGem(ctx, r, data);
          break;
        case 'prism':
          this.drawPrismGem(ctx, r, data);
          break;
        case 'teardrop':
          this.drawTeardropGem(ctx, r, data);
          break;
        case 'star':
          this.drawStarGem(ctx, r, data);
          break;
        case 'heart':
          this.drawHeartGem(ctx, r, data);
          break;
        case 'diamond':
        case 'cosmic':
        case 'crown':
          this.drawDiamondBrilliant(ctx, r, data);
          break;
        default:
          this.drawSphereGem(ctx, r, data);
      }

      ctx.restore();
    }

    static drawSphereGem(ctx, r, data) {
      // Base sphere body
      const grad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.2, data.accent);
      grad.addColorStop(0.7, data.color);
      grad.addColorStop(1, '#050711');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Outer rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = Math.max(1.5, r * 0.08);
      ctx.stroke();

      // Specular highlight gloss
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.ellipse(-r * 0.36, -r * 0.36, r * 0.28, r * 0.18, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Secondary soft reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(r * 0.3, r * 0.35, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
    }

    static drawCushionGem(ctx, r, data) {
      const size = r * 1.6;
      const h = size / 2;
      const corner = r * 0.35;

      // Rounded rectangular cushion base
      ctx.fillStyle = data.color;
      ctx.beginPath();
      ctx.roundRect(-h, -h, size, size, corner);
      ctx.fill();

      // Facets
      ctx.fillStyle = data.accent;
      ctx.beginPath();
      ctx.moveTo(-h + corner, -h);
      ctx.lineTo(h - corner, -h);
      ctx.lineTo(h * 0.5, -h * 0.5);
      ctx.lineTo(-h * 0.5, -h * 0.5);
      ctx.closePath();
      ctx.fill();

      // Side facets
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.moveTo(-h, -h + corner);
      ctx.lineTo(-h, h - corner);
      ctx.lineTo(-h * 0.5, h * 0.5);
      ctx.lineTo(-h * 0.5, -h * 0.5);
      ctx.closePath();
      ctx.fill();

      // Center table facet
      const innerGrad = ctx.createLinearGradient(-h * 0.5, -h * 0.5, h * 0.5, h * 0.5);
      innerGrad.addColorStop(0, '#ffffff');
      innerGrad.addColorStop(0.3, data.accent);
      innerGrad.addColorStop(1, data.color);
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.roundRect(-h * 0.5, -h * 0.5, size * 0.5, size * 0.5, corner * 0.5);
      ctx.fill();

      // Border stroke
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = Math.max(1.5, r * 0.06);
      ctx.stroke();

      // Highlight star
      this.drawGlint(ctx, -h * 0.35, -h * 0.35, r * 0.35);
    }

    static drawPrismGem(ctx, r, data) {
      // 8-point faceted diamond crystal (octagonal prism)
      const points = 6;
      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const ang = (i * Math.PI * 2) / points;
        const px = Math.cos(ang) * r;
        const py = Math.sin(ang) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      const bg = ctx.createLinearGradient(-r, -r, r, r);
      bg.addColorStop(0, data.accent);
      bg.addColorStop(0.5, data.color);
      bg.addColorStop(1, '#082f49');
      ctx.fillStyle = bg;
      ctx.fill();

      // Draw facet lines connecting to center & inner table
      for (let i = 0; i < points; i++) {
        const ang1 = (i * Math.PI * 2) / points;
        const ang2 = (((i + 1) % points) * Math.PI * 2) / points;
        ctx.fillStyle = (i % 2 === 0) ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang1) * r, Math.sin(ang1) * r);
        ctx.lineTo(Math.cos(ang2) * r, Math.sin(ang2) * r);
        ctx.closePath();
        ctx.fill();
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = Math.max(1.5, r * 0.06);
      ctx.stroke();

      this.drawGlint(ctx, -r * 0.3, -r * 0.3, r * 0.4);
    }

    static drawTeardropGem(ctx, r, data) {
      // Teardrop / Pear cut
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.1);
      ctx.bezierCurveTo(r * 1.1, -r * 0.3, r * 1.1, r * 0.9, 0, r);
      ctx.bezierCurveTo(-r * 1.1, r * 0.9, -r * 1.1, -r * 0.3, 0, -r * 1.1);
      ctx.closePath();

      const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r * 1.1);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, data.accent);
      grad.addColorStop(0.75, data.color);
      grad.addColorStop(1, '#021c38');
      ctx.fillStyle = grad;
      ctx.fill();

      // Inner facet ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = Math.max(1.5, r * 0.07);
      ctx.stroke();

      // Gloss streak
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.ellipse(-r * 0.3, -r * 0.2, r * 0.18, r * 0.45, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      this.drawGlint(ctx, -r * 0.3, -r * 0.4, r * 0.3);
    }

    static drawStarGem(ctx, r, data) {
      // Brilliant faceted star / hex-cut
      const spikes = 6;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? r : r * 0.65;
        const ang = (i * Math.PI) / spikes;
        const px = Math.cos(ang) * radius;
        const py = Math.sin(ang) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      const grad = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, data.accent);
      grad.addColorStop(1, data.color);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = Math.max(1.5, r * 0.06);
      ctx.stroke();

      this.drawGlint(ctx, 0, 0, r * 0.5);
    }

    static drawHeartGem(ctx, r, data) {
      const h = r * 0.9;
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.3);
      ctx.bezierCurveTo(-h * 0.8, -h * 1.1, -h * 1.3, h * 0.2, 0, h * 1.1);
      ctx.bezierCurveTo(h * 1.3, h * 0.2, h * 0.8, -h * 1.1, 0, -h * 0.3);
      ctx.closePath();

      const grad = ctx.createRadialGradient(-h * 0.3, -h * 0.3, r * 0.1, 0, 0, r * 1.1);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, data.accent);
      grad.addColorStop(0.8, data.color);
      grad.addColorStop(1, '#3b0720');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = Math.max(1.5, r * 0.06);
      ctx.stroke();

      this.drawGlint(ctx, -h * 0.35, -h * 0.35, r * 0.4);
    }

    static drawDiamondBrilliant(ctx, r, data) {
      // High-tier Grand Diamonds / Cosmic Void Jewels
      const points = 12;
      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const ang = (i * Math.PI * 2) / points;
        const px = Math.cos(ang) * r;
        const py = Math.sin(ang) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      let grad;
      if (data.tier === 10) {
        // Rainbow animated gradient
        grad = ctx.createConicGradient(Date.now() * 0.001, 0, 0);
        grad.addColorStop(0, '#ff0000');
        grad.addColorStop(0.2, '#ffff00');
        grad.addColorStop(0.4, '#00ff66');
        grad.addColorStop(0.6, '#00ffff');
        grad.addColorStop(0.8, '#7b00ff');
        grad.addColorStop(1, '#ff0000');
      } else {
        grad = ctx.createRadialGradient(0, 0, r * 0.15, 0, 0, r);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.35, data.accent);
        grad.addColorStop(0.85, data.color);
        grad.addColorStop(1, '#050b1a');
      }

      ctx.fillStyle = grad;
      ctx.fill();

      // Facet triangulation pattern
      for (let i = 0; i < points; i++) {
        const a1 = (i * Math.PI * 2) / points;
        const a2 = (((i + 1) % points) * Math.PI * 2) / points;
        ctx.fillStyle = (i % 2 === 0) ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
        ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
        ctx.closePath();
        ctx.fill();
      }

      // Inner Table Octagon
      const innerR = r * 0.45;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI * 2) / 8;
        const px = Math.cos(ang) * innerR;
        const py = Math.sin(ang) * innerR;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = Math.max(2, r * 0.06);
      ctx.stroke();

      this.drawGlint(ctx, -r * 0.35, -r * 0.35, r * 0.6);
      this.drawGlint(ctx, r * 0.3, r * 0.3, r * 0.4);
    }

    static drawGlint(ctx, x, y, size) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#ffffff';
      
      // 4-point sparkle star
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(0, 0, size, 0);
      ctx.quadraticCurveTo(0, 0, 0, size);
      ctx.quadraticCurveTo(0, 0, -size, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // ==========================================
  // 4. PARTICLE & SPECIAL FX SYSTEM
  // ==========================================
  class FXManager {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.floatingTexts = [];
      this.shockwaves = [];
      this.ambientMotes = [];

      this.initAmbientMotes();
    }

    initAmbientMotes() {
      for (let i = 0; i < 28; i++) {
        this.ambientMotes.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: 1 + Math.random() * 2.5,
          speedY: -0.2 - Math.random() * 0.4,
          speedX: (Math.random() - 0.5) * 0.3,
          alpha: 0.2 + Math.random() * 0.6,
          pulse: Math.random() * Math.PI * 2,
          color: Math.random() > 0.5 ? 'rgba(182, 75, 247,' : 'rgba(56, 239, 125,'
        });
      }
    }

    resize(w, h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }

    spawnMergeBurst(x, y, tier) {
      const data = GEM_TIERS[tier];
      const count = 18 + tier * 4;

      // Gem Shards & Sparkles
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * (4 + tier * 0.8);
        this.particles.push({
          x, y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 1.5,
          size: 2.5 + Math.random() * (4 + tier * 0.5),
          color: Math.random() > 0.3 ? data.color : '#ffffff',
          alpha: 1.0,
          decay: 0.016 + Math.random() * 0.02,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2
        });
      }

      // Expanding Shockwave Ring
      this.shockwaves.push({
        x, y,
        r: 10,
        maxR: data.radius * 2.2,
        color: data.sparkleColor,
        alpha: 1.0,
        lineWidth: 4
      });
    }

    spawnScoreText(x, y, text, isCombo = false) {
      this.floatingTexts.push({
        x, y,
        text,
        alpha: 1.0,
        vy: -2.0,
        scale: isCombo ? 1.4 : 1.0,
        color: isCombo ? '#ffd154' : '#ffffff'
      });
    }

    updateAndRender() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // 1. Ambient Dungeon Dust & Mystical Portal Fireflies
      this.ambientMotes.forEach(m => {
        m.y += m.speedY;
        m.x += m.speedX;
        m.pulse += 0.04;
        const curAlpha = m.alpha * (0.6 + 0.4 * Math.sin(m.pulse));

        if (m.y < 0) {
          m.y = this.canvas.height;
          m.x = PILLAR_WIDTH + Math.random() * (this.canvas.width - PILLAR_WIDTH * 2);
        }

        this.ctx.fillStyle = `${m.color} ${curAlpha})`;
        this.ctx.beginPath();
        this.ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        this.ctx.fill();
      });

      // 2. Shockwaves
      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const sw = this.shockwaves[i];
        sw.r += (sw.maxR - sw.r) * 0.2 + 1;
        sw.alpha -= 0.04;

        if (sw.alpha <= 0 || sw.r >= sw.maxR) {
          this.shockwaves.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.strokeStyle = sw.color;
        this.ctx.globalAlpha = Math.max(0, sw.alpha);
        this.ctx.lineWidth = sw.lineWidth;
        this.ctx.beginPath();
        this.ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      }

      // 3. Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.14; // Gravity
        p.alpha -= p.decay;
        p.rot += p.vRot;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rot);
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.restore();
      }

      // 4. Floating Score Numbers
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.022;

        if (ft.alpha <= 0) {
          this.floatingTexts.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, ft.alpha);
        this.ctx.font = `900 ${Math.round(18 * ft.scale)}px "Outfit", sans-serif`;
        this.ctx.fillStyle = ft.color;
        this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
        this.ctx.shadowBlur = 8;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(ft.text, ft.x, ft.y);
        this.ctx.restore();
      }
    }
  }

  // ==========================================
  // 5. MAIN GAME LOGIC & MATTER.JS INTEGRATION
  // ==========================================
  class DiamondGame {
    constructor() {
      // DOM Elements
      this.arenaFrame = document.getElementById('arenaFrame');
      this.gameCanvas = document.getElementById('gameCanvas');
      this.fxCanvas = document.getElementById('fxCanvas');
      this.ctx = this.gameCanvas.getContext('2d');
      this.dropperPointer = document.getElementById('dropperPointer');
      this.dropperGemPreview = document.getElementById('dropperGemPreview');
      this.nextGemCanvas = document.getElementById('nextGemCanvas');
      this.nextGemName = document.getElementById('nextGemName');
      this.currentScoreEl = document.getElementById('currentScore');
      this.bestScoreEl = document.getElementById('bestScore');
      this.comboBadge = document.getElementById('comboBadge');
      this.comboMultiplierEl = document.getElementById('comboMultiplier');
      this.dangerLine = document.getElementById('dangerLine');
      this.gameOverModal = document.getElementById('gameOverModal');
      this.modalFinalScore = document.getElementById('modalFinalScore');
      this.modalBestScore = document.getElementById('modalBestScore');
      this.modalHighestGem = document.getElementById('modalHighestGem');
      this.evolutionChainEl = document.getElementById('evolutionChain');
      this.modalEvolutionChain = document.getElementById('modalEvolutionChain');
      this.guideModal = document.getElementById('guideModal');
      this.oneChanceModal = document.getElementById('oneChanceModal');
      this.btnClaimChance = document.getElementById('btnClaimChance');
      this.chanceCountdown = document.getElementById('chanceCountdown');
      this.chanceSecondsNumber = document.getElementById('chanceSecondsNumber');
      this.chanceProgressFill = document.getElementById('chanceProgressFill');
      this.hudChanceValue = document.getElementById('hudChanceValue');
      this.btnSound = document.getElementById('btnSound');
      this.soundIcon = document.getElementById('soundIcon');

      // State
      this.width = 440;
      this.height = 640;
      this.score = 0;
      this.bestScore = parseInt(localStorage.getItem('gem_best_score') || '0', 10);
      this.comboCount = 0;
      this.comboTimer = null;
      this.isGameOver = false;
      this.canDrop = true;
      this.hasUsedOneChance = false;
      this.isOneChancePromptActive = false;
      this.oneChanceInterval = null;
      this.gracePeriodTimer = 0;
      this.currentGemTier = 0;
      this.nextGemTier = 0;
      this.dropperX = this.width / 2;
      this.highestTierUnlocked = 0;
      this.dangerTimer = 0;

      // Physics Bodies
      this.gems = [];
      this.pendingMerges = [];

      this.init();
    }

    init() {
      this.updateDimensions();
      this.fx = new FXManager(this.fxCanvas);
      this.initPhysics();
      this.renderEvolutionUI();
      this.setupEventListeners();
      this.resetGame();

      // Start Game Loop
      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.gameLoop(t));
    }

    updateDimensions() {
      const rect = this.arenaFrame.getBoundingClientRect();
      this.width = rect.width || 440;
      this.height = rect.height || 640;
      this.gameCanvas.width = this.width;
      this.gameCanvas.height = this.height;
      if (this.fx) this.fx.resize(this.width, this.height);
    }

    initPhysics() {
      const { Engine, World, Bodies, Events } = Matter;

      this.engine = Engine.create({
        gravity: { x: 0, y: 1.8 }
      });
      this.world = this.engine.world;

      // Create Arena Boundaries (matching stone pillar coordinates)
      const leftWallWidth = PILLAR_WIDTH;
      const rightWallWidth = PILLAR_WIDTH;
      const wallThickness = 100;

      this.leftWall = Bodies.rectangle(
        leftWallWidth - wallThickness / 2,
        this.height / 2,
        wallThickness,
        this.height * 2,
        { isStatic: true, friction: 0.1, restitution: 0.2 }
      );

      this.rightWall = Bodies.rectangle(
        this.width - rightWallWidth + wallThickness / 2,
        this.height / 2,
        wallThickness,
        this.height * 2,
        { isStatic: true, friction: 0.1, restitution: 0.2 }
      );

      this.ground = Bodies.rectangle(
        this.width / 2,
        this.height + 25,
        this.width * 2,
        60,
        { isStatic: true, friction: 0.4, restitution: 0.2 }
      );

      World.add(this.world, [this.leftWall, this.rightWall, this.ground]);

      // Collision Event Listener for Merging
      Events.on(this.engine, 'collisionStart', (event) => {
        if (this.isGameOver) return;
        const pairs = event.pairs;

        for (let i = 0; i < pairs.length; i++) {
          const { bodyA, bodyB } = pairs[i];

          // Play subtle clink sound
          if (bodyA.gemData || bodyB.gemData) {
            const relVel = Math.hypot(
              (bodyA.velocity?.x || 0) - (bodyB.velocity?.x || 0),
              (bodyA.velocity?.y || 0) - (bodyB.velocity?.y || 0)
            );
            if (relVel > 1.2) {
              sfx.playClink(relVel);
            }
          }

          // Check if both are matching gems
          if (bodyA.gemData && bodyB.gemData) {
            if (bodyA.gemData.tier === bodyB.gemData.tier &&
                !bodyA.gemData.isMerging &&
                !bodyB.gemData.isMerging &&
                bodyA.gemData.tier < GEM_TIERS.length - 1) {
              
              bodyA.gemData.isMerging = true;
              bodyB.gemData.isMerging = true;

              this.pendingMerges.push({
                tier: bodyA.gemData.tier,
                bodyA,
                bodyB,
                midX: (bodyA.position.x + bodyB.position.x) / 2,
                midY: (bodyA.position.y + bodyB.position.y) / 2
              });
            }
          }
        }
      });
    }

    createGemBody(x, y, tier) {
      const { Bodies, World } = Matter;
      const data = GEM_TIERS[tier];
      
      const body = Bodies.circle(x, y, data.radius, {
        restitution: 0.22,
        friction: 0.35,
        frictionAir: 0.008,
        density: 0.002 * (1 + tier * 0.1),
        collisionFilter: { group: 0, category: 0x0001, mask: 0xFFFFFFFF }
      });

      body.gemData = {
        tier,
        isMerging: false,
        spawnTime: performance.now(),
        isSettled: false
      };

      World.add(this.world, body);
      this.gems.push(body);
      return body;
    }

    processMerges() {
      if (this.pendingMerges.length === 0) return;

      const { World } = Matter;

      while (this.pendingMerges.length > 0) {
        const merge = this.pendingMerges.shift();
        const nextTier = merge.tier + 1;

        // Remove old gems
        World.remove(this.world, merge.bodyA);
        World.remove(this.world, merge.bodyB);
        this.gems = this.gems.filter(g => g !== merge.bodyA && g !== merge.bodyB);

        // Spawn evolved gem
        const newBody = this.createGemBody(merge.midX, merge.midY, nextTier);
        newBody.gemData.isSettled = true;

        // Combo & Scoring
        this.comboCount++;
        if (this.comboTimer) clearTimeout(this.comboTimer);
        this.comboTimer = setTimeout(() => {
          this.comboCount = 0;
          this.updateComboUI();
        }, 2000);

        const baseScore = GEM_TIERS[nextTier].score;
        const earnedScore = baseScore * Math.max(1, this.comboCount);
        this.addScore(earnedScore);

        // Sound & Particle FX
        sfx.playMerge(nextTier, this.comboCount);
        this.fx.spawnMergeBurst(merge.midX, merge.midY, nextTier);
        this.fx.spawnScoreText(
          merge.midX,
          merge.midY - 20,
          `+${earnedScore}${this.comboCount > 1 ? ` (x${this.comboCount})` : ''}`,
          this.comboCount > 1
        );

        // Track highest unlocked gem
        if (nextTier > this.highestTierUnlocked) {
          this.highestTierUnlocked = nextTier;
          this.renderEvolutionUI();
        }

        this.updateComboUI();
      }
    }

    addScore(amount) {
      this.score += amount;
      this.currentScoreEl.textContent = this.score;

      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        this.bestScoreEl.textContent = this.bestScore;
        localStorage.setItem('gem_best_score', this.bestScore.toString());
      }
    }

    updateComboUI() {
      if (this.comboCount > 1) {
        this.comboBadge.classList.add('active');
        this.comboMultiplierEl.textContent = `x${this.comboCount}`;
      } else {
        this.comboBadge.classList.remove('active');
      }
    }

    getRandomTier() {
      return Math.floor(Math.random() * (MAX_SPAWN_TIER + 1));
    }

    dropGem() {
      if (!this.canDrop || this.isGameOver) return;
      sfx.init();

      this.canDrop = false;
      const currentTier = this.currentGemTier;
      const radius = GEM_TIERS[currentTier].radius;
      
      const dropX = Math.max(
        PILLAR_WIDTH + radius + 2,
        Math.min(this.width - PILLAR_WIDTH - radius - 2, this.dropperX)
      );

      const dropY = 48;
      const droppedGem = this.createGemBody(dropX, dropY, currentTier);
      sfx.playDrop();

      // Dropper cooldown animation
      this.dropperPointer.style.opacity = '0.35';

      setTimeout(() => {
        if (this.isGameOver) return;
        this.currentGemTier = this.nextGemTier;
        this.nextGemTier = this.getRandomTier();
        this.updateDropperPreview();
        this.renderNextGemSidebar();
        this.canDrop = true;
        this.dropperPointer.style.opacity = '1';
      }, 550);
    }

    updateDropperPosition(clientX) {
      const rect = this.arenaFrame.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const radius = GEM_TIERS[this.currentGemTier].radius;

      this.dropperX = Math.max(
        PILLAR_WIDTH + radius,
        Math.min(this.width - PILLAR_WIDTH - radius, relativeX)
      );

      this.dropperPointer.style.left = `${this.dropperX}px`;
    }

    updateDropperPreview() {
      this.dropperGemPreview.innerHTML = '';
      const c = document.createElement('canvas');
      c.width = 30;
      c.height = 30;
      const ctx = c.getContext('2d');
      GemSpriteRenderer.drawGem(ctx, 15, 15, this.currentGemTier, 0, 0.45);
      this.dropperGemPreview.appendChild(c);
    }

    renderNextGemSidebar() {
      const ctx = this.nextGemCanvas.getContext('2d');
      ctx.clearRect(0, 0, this.nextGemCanvas.width, this.nextGemCanvas.height);
      const data = GEM_TIERS[this.nextGemTier];
      const scale = Math.min(1.0, 36 / data.radius);
      GemSpriteRenderer.drawGem(
        ctx,
        this.nextGemCanvas.width / 2,
        this.nextGemCanvas.height / 2,
        this.nextGemTier,
        0,
        scale
      );
      this.nextGemName.textContent = data.name;
    }

    renderEvolutionUI() {
      const renderList = (container) => {
        container.innerHTML = '';
        GEM_TIERS.forEach((gem, idx) => {
          const item = document.createElement('div');
          item.className = `evo-item ${idx <= this.highestTierUnlocked ? 'active-unlocked' : ''}`;
          
          const preview = document.createElement('div');
          preview.className = 'evo-preview';
          const c = document.createElement('canvas');
          c.width = 32;
          c.height = 32;
          const ctx = c.getContext('2d');
          const scale = Math.min(0.9, 13 / gem.radius);
          GemSpriteRenderer.drawGem(ctx, 16, 16, idx, 0, scale);
          preview.appendChild(c);

          const info = document.createElement('div');
          info.className = 'evo-info';
          info.innerHTML = `
            <span class="evo-name">${gem.name}</span>
            <span class="evo-pts">${gem.score} pts</span>
          `;

          item.appendChild(preview);
          item.appendChild(info);
          container.appendChild(item);
        });
      };

      renderList(this.evolutionChainEl);
      renderList(this.modalEvolutionChain);
    }

    showOneChancePrompt() {
      if (this.isOneChancePromptActive || this.isGameOver) return;
      this.isOneChancePromptActive = true;
      this.oneChanceModal.classList.add('active');

      const totalMs = 3000;
      let remainingMs = totalMs;
      let lastSecond = 3;

      if (this.chanceProgressFill) {
        this.chanceProgressFill.style.width = '100%';
      }
      if (this.chanceCountdown) this.chanceCountdown.textContent = '3';
      if (this.chanceSecondsNumber) this.chanceSecondsNumber.textContent = '3';

      sfx.playCountBeep(false);

      if (this.oneChanceInterval) clearInterval(this.oneChanceInterval);

      const startTime = performance.now();

      this.oneChanceInterval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        remainingMs = Math.max(0, totalMs - elapsed);
        const currentSec = Math.ceil(remainingMs / 1000);

        if (currentSec !== lastSecond && currentSec > 0) {
          lastSecond = currentSec;
          if (this.chanceCountdown) this.chanceCountdown.textContent = currentSec;
          if (this.chanceSecondsNumber) this.chanceSecondsNumber.textContent = currentSec;
          sfx.playCountBeep(currentSec === 1);
        }

        const pct = (remainingMs / totalMs) * 100;
        if (this.chanceProgressFill) {
          this.chanceProgressFill.style.width = `${pct}%`;
        }

        if (remainingMs <= 0) {
          clearInterval(this.oneChanceInterval);
          this.closeOneChancePrompt();
          this.triggerGameOver();
        }
      }, 50);
    }

    closeOneChancePrompt() {
      this.isOneChancePromptActive = false;
      if (this.oneChanceInterval) {
        clearInterval(this.oneChanceInterval);
        this.oneChanceInterval = null;
      }
      if (this.oneChanceModal) {
        this.oneChanceModal.classList.remove('active');
      }
    }

    updateChanceHUD() {
      if (!this.hudChanceValue) return;
      if (!this.hasUsedOneChance) {
        this.hudChanceValue.className = 'score-value chance-val active';
        this.hudChanceValue.textContent = '⚡ 1';
      } else {
        this.hudChanceValue.className = 'score-value chance-val used';
        this.hudChanceValue.textContent = '0 ✕';
      }
    }

    claimOneChance() {
      if (!this.isOneChancePromptActive) return;
      this.hasUsedOneChance = true;
      this.updateChanceHUD();
      this.closeOneChancePrompt();
      sfx.playRevive();

      // Screen Shake
      this.arenaFrame.classList.add('shake');
      setTimeout(() => this.arenaFrame.classList.remove('shake'), 450);

      // Vaporize / Blast top overflowing gems
      const { World } = Matter;
      const gemsToRemove = [];

      // Sort gems by Y position (ascending = closest to top)
      const sortedGems = [...this.gems].sort((a, b) => a.position.y - b.position.y);
      sortedGems.forEach((body, idx) => {
        if (body.position.y < DANGER_Y + 90 || idx < 3) {
          gemsToRemove.push(body);
        }
      });

      gemsToRemove.forEach(body => {
        World.remove(this.world, body);
        if (body.gemData) {
          this.fx.spawnMergeBurst(body.position.x, body.position.y, body.gemData.tier);
          this.fx.spawnScoreText(body.position.x, body.position.y - 15, '⚡ SAVED!', true);
        }
      });

      this.gems = this.gems.filter(g => !gemsToRemove.includes(g));

      // Reset danger and give a 3.5s immunity shield
      this.dangerTimer = 0;
      this.dangerLine.classList.remove('warning');
      this.gracePeriodTimer = 3.5;
    }

    checkDangerAndGameOver(deltaTime) {
      if (this.isOneChancePromptActive) return;

      if (this.gracePeriodTimer > 0) {
        this.gracePeriodTimer -= deltaTime;
        this.dangerLine.classList.remove('warning');
        return;
      }

      let isOverflowing = false;
      const now = performance.now();

      for (let i = 0; i < this.gems.length; i++) {
        const body = this.gems[i];
        // Allow grace period for newly dropped gem
        if (now - body.gemData.spawnTime < 1800) continue;

        const gemTop = body.position.y - body.circleRadius;
        if (gemTop < DANGER_Y && Math.abs(body.velocity.y) < 0.8) {
          isOverflowing = true;
          break;
        }
      }

      if (isOverflowing) {
        this.dangerTimer += deltaTime;
        this.dangerLine.classList.add('warning');

        if (this.dangerTimer >= DANGER_LIMIT_SECONDS) {
          if (!this.hasUsedOneChance) {
            this.showOneChancePrompt();
          } else {
            this.triggerGameOver();
          }
        }
      } else {
        this.dangerTimer = Math.max(0, this.dangerTimer - deltaTime * 1.5);
        if (this.dangerTimer === 0) {
          this.dangerLine.classList.remove('warning');
        }
      }
    }

    triggerGameOver() {
      if (this.isGameOver) return;
      this.isGameOver = true;
      this.closeOneChancePrompt();
      sfx.playGameOver();

      this.modalFinalScore.textContent = this.score;
      this.modalBestScore.textContent = this.bestScore;

      // Draw highest gem in modal
      this.modalHighestGem.innerHTML = '';
      const c = document.createElement('canvas');
      c.width = 44;
      c.height = 44;
      const ctx = c.getContext('2d');
      const scale = Math.min(1.0, 20 / GEM_TIERS[this.highestTierUnlocked].radius);
      GemSpriteRenderer.drawGem(ctx, 22, 22, this.highestTierUnlocked, 0, scale);
      this.modalHighestGem.appendChild(c);

      this.gameOverModal.classList.add('active');
    }

    resetGame() {
      const { World } = Matter;
      this.gems.forEach(body => World.remove(this.world, body));
      this.gems = [];
      this.pendingMerges = [];

      this.score = 0;
      this.currentScoreEl.textContent = '0';
      this.bestScoreEl.textContent = this.bestScore.toString();
      this.comboCount = 0;
      this.updateComboUI();
      this.isGameOver = false;
      this.dangerTimer = 0;
      this.hasUsedOneChance = false;
      this.gracePeriodTimer = 0;
      this.updateChanceHUD();
      this.closeOneChancePrompt();
      this.dangerLine.classList.remove('warning');
      this.gameOverModal.classList.remove('active');
      this.canDrop = true;

      this.currentGemTier = this.getRandomTier();
      this.nextGemTier = this.getRandomTier();
      this.updateDropperPreview();
      this.renderNextGemSidebar();
    }

    gameLoop(currentTime) {
      const deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;

      // 1. Update Physics
      Matter.Engine.update(this.engine, 1000 / 60);

      // 2. Process Gem Merges
      this.processMerges();

      // 3. Clear & Render Canvas
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Render All Active Gems
      this.gems.forEach(body => {
        if (!body.gemData) return;
        GemSpriteRenderer.drawGem(
          this.ctx,
          body.position.x,
          body.position.y,
          body.gemData.tier,
          body.angle
        );
      });

      // 4. Particle FX Loop
      this.fx.updateAndRender();

      // 5. Danger & Overflow Check
      if (!this.isGameOver) {
        this.checkDangerAndGameOver(deltaTime);
      }

      requestAnimationFrame((t) => this.gameLoop(t));
    }

    setupEventListeners() {
      // Mouse Controls
      this.arenaFrame.addEventListener('mousemove', (e) => {
        this.updateDropperPosition(e.clientX);
      });

      this.arenaFrame.addEventListener('click', (e) => {
        sfx.init();
        this.updateDropperPosition(e.clientX);
        this.dropGem();
      });

      // Touch Controls (Mobile)
      this.arenaFrame.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          this.updateDropperPosition(e.touches[0].clientX);
        }
        e.preventDefault();
      }, { passive: false });

      this.arenaFrame.addEventListener('touchend', (e) => {
        sfx.init();
        this.dropGem();
        e.preventDefault();
      }, { passive: false });

      // Keyboard Controls
      window.addEventListener('keydown', (e) => {
        sfx.init();
        const step = 20;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          this.dropperX = Math.max(PILLAR_WIDTH + 20, this.dropperX - step);
          this.dropperPointer.style.left = `${this.dropperX}px`;
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          this.dropperX = Math.min(this.width - PILLAR_WIDTH - 20, this.dropperX + step);
          this.dropperPointer.style.left = `${this.dropperX}px`;
        } else if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          this.dropGem();
        }
      });

      // One Chance Claim Button
      if (this.btnClaimChance) {
        this.btnClaimChance.addEventListener('click', () => {
          sfx.init();
          this.claimOneChance();
        });
      }

      // Button Controls
      document.getElementById('btnRestart').addEventListener('click', () => {
        sfx.init();
        this.resetGame();
      });

      document.getElementById('modalBtnRestart').addEventListener('click', () => {
        sfx.init();
        this.resetGame();
      });

      this.btnSound.addEventListener('click', () => {
        sfx.init();
        sfx.muted = !sfx.muted;
        this.soundIcon.textContent = sfx.muted ? '🔇' : '🔊';
      });

      document.getElementById('btnInfo').addEventListener('click', () => {
        this.guideModal.classList.add('active');
      });

      document.getElementById('btnCloseGuide').addEventListener('click', () => {
        this.guideModal.classList.remove('active');
      });

      this.guideModal.addEventListener('click', (e) => {
        if (e.target === this.guideModal) {
          this.guideModal.classList.remove('active');
        }
      });

      window.addEventListener('resize', () => {
        this.updateDimensions();
      });
    }
  }

  // Launch on DOM ready
  window.addEventListener('DOMContentLoaded', () => {
    new DiamondGame();
  });
})();
