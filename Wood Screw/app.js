/**
 * Wood Screw Puzzle - Advanced Physics & Puzzle Engine
 * Pure Vanilla JavaScript & HTML5 Canvas with Web Audio API
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Pure Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playScrewSelect() {
      if (this.muted) return;
      this.init();
      const ctx = this.ctx;
      const t = ctx.currentTime;

      // Metallic unscrew click & rising pitch
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, t);
      osc.frequency.exponentialRampToValueAtTime(900, t + 0.12);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);

      // Noise click
      this._playNoiseClick(t, 0.04, 0.2);
    }

    playScrewIn() {
      if (this.muted) return;
      this.init();
      const ctx = this.ctx;
      const t = ctx.currentTime;

      // Metallic screw lock sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.14);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.14);

      this._playWoodThud(t + 0.04, 180, 0.15);
    }

    playWoodDrop() {
      if (this.muted) return;
      this.init();
      const ctx = this.ctx;
      const t = ctx.currentTime;
      this._playWoodThud(t, 120, 0.25);
      this._playWoodThud(t + 0.08, 90, 0.2);
    }

    playWin() {
      if (this.muted) return;
      this.init();
      const ctx = this.ctx;
      const t = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.1);

        gain.gain.setValueAtTime(0.3, t + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.1);
        osc.stop(t + idx * 0.1 + 0.35);
      });
    }

    playError() {
      if (this.muted) return;
      this.init();
      const ctx = this.ctx;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.linearRampToValueAtTime(90, t + 0.15);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    }

    _playWoodThud(time, freq, duration) {
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + duration);

      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + duration);
    }

    _playNoiseClick(time, duration, volume) {
      const ctx = this.ctx;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

      noise.connect(gain);
      gain.connect(ctx.destination);
      noise.start(time);
    }
  }

  const sound = new SoundEngine();

  // --- COLOR PALETTES FOR WOOD PLANKS ---
  const PLANK_THEMES = {
    green: {
      base: '#2e8b57',
      dark: '#1c5e38',
      light: '#48b877',
      grain: '#174a2c',
      highlight: '#62d895'
    },
    brown: {
      base: '#935429',
      dark: '#673816',
      light: '#b66d3a',
      grain: '#4e280d',
      highlight: '#cf854f'
    },
    darkwood: {
      base: '#5a341e',
      dark: '#3d200f',
      light: '#7e4b2d',
      grain: '#2c1508',
      highlight: '#995f3c'
    },
    redwood: {
      base: '#a43820',
      dark: '#73220f',
      light: '#cb4e33',
      grain: '#531709',
      highlight: '#e3684d'
    },
    blue: {
      base: '#2980b9',
      dark: '#1a5276',
      light: '#409ad5',
      grain: '#133d59',
      highlight: '#5dade2'
    },
    purple: {
      base: '#8e44ad',
      dark: '#5e2677',
      light: '#a95ec7',
      grain: '#421657',
      highlight: '#be79da'
    },
    golden: {
      base: '#d48d1c',
      dark: '#9a610c',
      light: '#f2a93b',
      grain: '#734706',
      highlight: '#f8be62'
    }
  };

  // --- LEVEL DEFINITIONS ---
  const LEVELS = [
    // LEVEL 1: Exact layout matching user's reference image
    {
      id: 1,
      title: 'Level 1: Tutorial Plank',
      timeLimit: 90,
      boardHoles: [
        { id: 'h1', x: 130, y: 150 }, // Top-left
        { id: 'h2', x: 310, y: 150 }, // Top-right
        { id: 'h3', x: 220, y: 240 }, // Center-top
        { id: 'h4', x: 130, y: 330 }, // Middle-left
        { id: 'h5', x: 220, y: 330 }, // Middle-center
        { id: 'h6', x: 310, y: 330 }, // Middle-right
        { id: 'h7', x: 130, y: 460 }, // Bottom-left empty hole
        { id: 'h8', x: 310, y: 460 }, // Bottom-right empty hole
        { id: 'h9', x: 220, y: 490 }  // Bottom-center hole
      ],
      planks: [
        // Top Horizontal Green Plank (2 holes: h1, h2)
        {
          id: 'p_top_green',
          colorTheme: 'green',
          layer: 2,
          x: 220,
          y: 150,
          width: 220,
          height: 38,
          angle: 0,
          holes: [{ x: 130, y: 150 }, { x: 310, y: 150 }]
        },
        // Left Vertical Brown Plank (behind top green, pinned at h1)
        {
          id: 'p_left_brown',
          colorTheme: 'brown',
          layer: 1,
          x: 130,
          y: 190,
          width: 38,
          height: 120,
          angle: 0,
          holes: [{ x: 130, y: 150 }]
        },
        // Right Vertical Brown Plank (behind top green, pinned at h2)
        {
          id: 'p_right_brown',
          colorTheme: 'brown',
          layer: 1,
          x: 310,
          y: 190,
          width: 38,
          height: 120,
          angle: 0,
          holes: [{ x: 310, y: 150 }]
        },
        // Center Vertical Green Plank (holes at h3, h5)
        {
          id: 'p_center_green',
          colorTheme: 'green',
          layer: 1,
          x: 220,
          y: 285,
          width: 38,
          height: 150,
          angle: 0,
          holes: [{ x: 220, y: 240 }, { x: 220, y: 330 }]
        },
        // Middle Horizontal Brown Plank (holes at h4, h5, h6)
        {
          id: 'p_mid_brown',
          colorTheme: 'brown',
          layer: 3,
          x: 220,
          y: 330,
          width: 220,
          height: 38,
          angle: 0,
          holes: [{ x: 130, y: 330 }, { x: 220, y: 330 }, { x: 310, y: 330 }]
        },
        // Bottom Short Brown Plank (hole at h9)
        {
          id: 'p_bot_brown',
          colorTheme: 'brown',
          layer: 1,
          x: 220,
          y: 490,
          width: 110,
          height: 34,
          angle: 0,
          holes: [{ x: 220, y: 490 }]
        }
      ],
      screws: [
        { id: 's1', holeId: 'h1' },
        { id: 's2', holeId: 'h2' },
        { id: 's4', holeId: 'h4' },
        { id: 's5', holeId: 'h5' },
        { id: 's6', holeId: 'h6' },
        { id: 's9', holeId: 'h9' }
      ]
    },

    // LEVEL 2: The Cross & Pendulum (Introduces swinging planks)
    {
      id: 2,
      title: 'Level 2: Cross Swing',
      timeLimit: 85,
      boardHoles: [
        { id: 'h1', x: 140, y: 160 },
        { id: 'h2', x: 300, y: 160 },
        { id: 'h3', x: 220, y: 260 },
        { id: 'h4', x: 140, y: 360 },
        { id: 'h5', x: 300, y: 360 },
        { id: 'h6', x: 220, y: 460 },
        { id: 'h7', x: 140, y: 500 },
        { id: 'h8', x: 300, y: 500 }
      ],
      planks: [
        {
          id: 'p1',
          colorTheme: 'blue',
          layer: 2,
          x: 220,
          y: 160,
          width: 200,
          height: 38,
          angle: 0,
          holes: [{ x: 140, y: 160 }, { x: 300, y: 160 }]
        },
        {
          id: 'p2',
          colorTheme: 'redwood',
          layer: 1,
          x: 220,
          y: 310,
          width: 38,
          height: 240,
          angle: 0,
          holes: [{ x: 220, y: 260 }, { x: 220, y: 460 }]
        },
        {
          id: 'p3',
          colorTheme: 'golden',
          layer: 3,
          x: 220,
          y: 360,
          width: 200,
          height: 38,
          angle: 0,
          holes: [{ x: 140, y: 360 }, { x: 300, y: 360 }]
        },
        {
          id: 'p4',
          colorTheme: 'green',
          layer: 2,
          x: 140,
          y: 260,
          width: 38,
          height: 240,
          angle: 0,
          holes: [{ x: 140, y: 160 }, { x: 140, y: 360 }]
        },
        {
          id: 'p5',
          colorTheme: 'green',
          layer: 2,
          x: 300,
          y: 260,
          width: 38,
          height: 240,
          angle: 0,
          holes: [{ x: 300, y: 160 }, { x: 300, y: 360 }]
        }
      ],
      screws: [
        { id: 's1', holeId: 'h1' },
        { id: 's2', holeId: 'h2' },
        { id: 's3', holeId: 'h3' },
        { id: 's4', holeId: 'h4' },
        { id: 's5', holeId: 'h5' },
        { id: 's6', holeId: 'h6' }
      ]
    },

    // LEVEL 3: Tri-Layer Geometric Cage
    {
      id: 3,
      title: 'Level 3: Timber Cage',
      timeLimit: 80,
      boardHoles: [
        { id: 'h1', x: 120, y: 150 },
        { id: 'h2', x: 220, y: 150 },
        { id: 'h3', x: 320, y: 150 },
        { id: 'h4', x: 120, y: 300 },
        { id: 'h5', x: 220, y: 300 },
        { id: 'h6', x: 320, y: 300 },
        { id: 'h7', x: 120, y: 450 },
        { id: 'h8', x: 220, y: 450 },
        { id: 'h9', x: 320, y: 450 },
        { id: 'h10', x: 220, y: 530 }
      ],
      planks: [
        {
          id: 'p1',
          colorTheme: 'purple',
          layer: 1,
          x: 170,
          y: 150,
          width: 140,
          height: 38,
          angle: 0,
          holes: [{ x: 120, y: 150 }, { x: 220, y: 150 }]
        },
        {
          id: 'p2',
          colorTheme: 'purple',
          layer: 1,
          x: 270,
          y: 150,
          width: 140,
          height: 38,
          angle: 0,
          holes: [{ x: 220, y: 150 }, { x: 320, y: 150 }]
        },
        {
          id: 'p3',
          colorTheme: 'green',
          layer: 2,
          x: 120,
          y: 300,
          width: 38,
          height: 340,
          angle: 0,
          holes: [{ x: 120, y: 150 }, { x: 120, y: 450 }]
        },
        {
          id: 'p4',
          colorTheme: 'green',
          layer: 2,
          x: 320,
          y: 300,
          width: 38,
          height: 340,
          angle: 0,
          holes: [{ x: 320, y: 150 }, { x: 320, y: 450 }]
        },
        {
          id: 'p5',
          colorTheme: 'brown',
          layer: 3,
          x: 220,
          y: 300,
          width: 240,
          height: 38,
          angle: 0,
          holes: [{ x: 120, y: 300 }, { x: 220, y: 300 }, { x: 320, y: 300 }]
        },
        {
          id: 'p6',
          colorTheme: 'redwood',
          layer: 2,
          x: 220,
          y: 375,
          width: 38,
          height: 190,
          angle: 0,
          holes: [{ x: 220, y: 300 }, { x: 220, y: 450 }]
        },
        {
          id: 'p7',
          colorTheme: 'golden',
          layer: 4,
          x: 220,
          y: 450,
          width: 240,
          height: 38,
          angle: 0,
          holes: [{ x: 120, y: 450 }, { x: 320, y: 450 }]
        }
      ],
      screws: [
        { id: 's1', holeId: 'h1' },
        { id: 's2', holeId: 'h2' },
        { id: 's3', holeId: 'h3' },
        { id: 's4', holeId: 'h4' },
        { id: 's5', holeId: 'h5' },
        { id: 's6', holeId: 'h6' },
        { id: 's7', holeId: 'h7' },
        { id: 's9', holeId: 'h9' }
      ]
    },

    // LEVEL 4: Diagonal Lattice (Harder spatial dependency)
    {
      id: 4,
      title: 'Level 4: The Lattice',
      timeLimit: 75,
      boardHoles: [
        { id: 'h1', x: 130, y: 140 },
        { id: 'h2', x: 310, y: 140 },
        { id: 'h3', x: 220, y: 230 },
        { id: 'h4', x: 130, y: 320 },
        { id: 'h5', x: 310, y: 320 },
        { id: 'h6', x: 220, y: 410 },
        { id: 'h7', x: 130, y: 500 },
        { id: 'h8', x: 310, y: 500 },
        { id: 'h9', x: 220, y: 500 }
      ],
      planks: [
        {
          id: 'p1',
          colorTheme: 'darkwood',
          layer: 1,
          x: 220,
          y: 230,
          width: 220,
          height: 38,
          angle: 0.785, // 45 deg
          holes: [{ x: 130, y: 140 }, { x: 310, y: 320 }]
        },
        {
          id: 'p2',
          colorTheme: 'blue',
          layer: 1,
          x: 220,
          y: 230,
          width: 220,
          height: 38,
          angle: -0.785, // -45 deg
          holes: [{ x: 310, y: 140 }, { x: 130, y: 320 }]
        },
        {
          id: 'p3',
          colorTheme: 'green',
          layer: 2,
          x: 220,
          y: 320,
          width: 220,
          height: 38,
          angle: 0,
          holes: [{ x: 130, y: 320 }, { x: 310, y: 320 }]
        },
        {
          id: 'p4',
          colorTheme: 'golden',
          layer: 3,
          x: 220,
          y: 410,
          width: 220,
          height: 38,
          angle: 0.785,
          holes: [{ x: 130, y: 320 }, { x: 310, y: 500 }]
        },
        {
          id: 'p5',
          colorTheme: 'redwood',
          layer: 3,
          x: 220,
          y: 410,
          width: 220,
          height: 38,
          angle: -0.785,
          holes: [{ x: 310, y: 320 }, { x: 130, y: 500 }]
        },
        {
          id: 'p6',
          colorTheme: 'purple',
          layer: 4,
          x: 220,
          y: 320,
          width: 38,
          height: 220,
          angle: 0,
          holes: [{ x: 220, y: 230 }, { x: 220, y: 410 }]
        }
      ],
      screws: [
        { id: 's1', holeId: 'h1' },
        { id: 's2', holeId: 'h2' },
        { id: 's3', holeId: 'h3' },
        { id: 's4', holeId: 'h4' },
        { id: 's5', holeId: 'h5' },
        { id: 's6', holeId: 'h6' },
        { id: 's7', holeId: 'h7' }
      ]
    },

    // LEVEL 5: The Fortress Gate
    {
      id: 5,
      title: 'Level 5: Fortress Gate',
      timeLimit: 75,
      boardHoles: [
        { id: 'h1', x: 110, y: 130 },
        { id: 'h2', x: 220, y: 130 },
        { id: 'h3', x: 330, y: 130 },
        { id: 'h4', x: 110, y: 270 },
        { id: 'h5', x: 220, y: 270 },
        { id: 'h6', x: 330, y: 270 },
        { id: 'h7', x: 110, y: 410 },
        { id: 'h8', x: 220, y: 410 },
        { id: 'h9', x: 330, y: 410 },
        { id: 'h10', x: 165, y: 520 },
        { id: 'h11', x: 275, y: 520 }
      ],
      planks: [
        {
          id: 'p1',
          colorTheme: 'brown',
          layer: 1,
          x: 110,
          y: 270,
          width: 38,
          height: 320,
          angle: 0,
          holes: [{ x: 110, y: 130 }, { x: 110, y: 410 }]
        },
        {
          id: 'p2',
          colorTheme: 'brown',
          layer: 1,
          x: 330,
          y: 270,
          width: 38,
          height: 320,
          angle: 0,
          holes: [{ x: 330, y: 130 }, { x: 330, y: 410 }]
        },
        {
          id: 'p3',
          colorTheme: 'green',
          layer: 2,
          x: 220,
          y: 130,
          width: 260,
          height: 38,
          angle: 0,
          holes: [{ x: 110, y: 130 }, { x: 220, y: 130 }, { x: 330, y: 130 }]
        },
        {
          id: 'p4',
          colorTheme: 'green',
          layer: 2,
          x: 220,
          y: 410,
          width: 260,
          height: 38,
          angle: 0,
          holes: [{ x: 110, y: 410 }, { x: 220, y: 410 }, { x: 330, y: 410 }]
        },
        {
          id: 'p5',
          colorTheme: 'blue',
          layer: 3,
          x: 220,
          y: 270,
          width: 38,
          height: 320,
          angle: 0,
          holes: [{ x: 220, y: 130 }, { x: 220, y: 270 }, { x: 220, y: 410 }]
        },
        {
          id: 'p6',
          colorTheme: 'golden',
          layer: 4,
          x: 220,
          y: 270,
          width: 260,
          height: 38,
          angle: 0,
          holes: [{ x: 110, y: 270 }, { x: 220, y: 270 }, { x: 330, y: 270 }]
        },
        {
          id: 'p7',
          colorTheme: 'redwood',
          layer: 2,
          x: 220,
          y: 270,
          width: 280,
          height: 38,
          angle: 0.785,
          holes: [{ x: 110, y: 130 }, { x: 330, y: 410 }]
        }
      ],
      screws: [
        { id: 's1', holeId: 'h1' },
        { id: 's2', holeId: 'h2' },
        { id: 's3', holeId: 'h3' },
        { id: 's4', holeId: 'h4' },
        { id: 's5', holeId: 'h5' },
        { id: 's6', holeId: 'h6' },
        { id: 's7', holeId: 'h7' },
        { id: 's8', holeId: 'h8' },
        { id: 's9', holeId: 'h9' }
      ]
    },

    // LEVEL 6: Hexa-Wheel Matrix
    {
      id: 6,
      title: 'Level 6: Hexa Wheel',
      timeLimit: 70,
      boardHoles: [
        { id: 'h1', x: 220, y: 140 },
        { id: 'h2', x: 330, y: 200 },
        { id: 'h3', x: 330, y: 340 },
        { id: 'h4', x: 220, y: 400 },
        { id: 'h5', x: 110, y: 340 },
        { id: 'h6', x: 110, y: 200 },
        { id: 'h7', x: 220, y: 270 }, // Hub Center
        { id: 'h8', x: 220, y: 490 }, // Parking
        { id: 'h9', x: 110, y: 490 }  // Parking 2
      ],
      planks: [
        {
          id: 'p1',
          colorTheme: 'golden',
          layer: 1,
          x: 220,
          y: 270,
          width: 38,
          height: 280,
          angle: 0,
          holes: [{ x: 220, y: 140 }, { x: 220, y: 400 }]
        },
        {
          id: 'p2',
          colorTheme: 'blue',
          layer: 2,
          x: 220,
          y: 270,
          width: 38,
          height: 280,
          angle: 1.047, // 60 deg
          holes: [{ x: 330, y: 200 }, { x: 110, y: 340 }]
        },
        {
          id: 'p3',
          colorTheme: 'purple',
          layer: 3,
          x: 220,
          y: 270,
          width: 38,
          height: 280,
          angle: -1.047, // -60 deg
          holes: [{ x: 110, y: 200 }, { x: 330, y: 340 }]
        },
        {
          id: 'p4',
          colorTheme: 'green',
          layer: 4,
          x: 220,
          y: 270,
          width: 260,
          height: 38,
          angle: 0,
          holes: [{ x: 110, y: 270 }, { x: 220, y: 270 }, { x: 330, y: 270 }]
        },
        {
          id: 'p5',
          colorTheme: 'redwood',
          layer: 5,
          x: 220,
          y: 270,
          width: 140,
          height: 38,
          angle: 1.57,
          holes: [{ x: 220, y: 270 }]
        }
      ],
      screws: [
        { id: 's1', holeId: 'h1' },
        { id: 's2', holeId: 'h2' },
        { id: 's3', holeId: 'h3' },
        { id: 's4', holeId: 'h4' },
        { id: 's5', holeId: 'h5' },
        { id: 's6', holeId: 'h6' },
        { id: 's7', holeId: 'h7' }
      ]
    },

    // LEVEL 7: The Master Maze
    {
      id: 7,
      title: 'Level 7: The Labyrinth',
      timeLimit: 65,
      boardHoles: [
        { id: 'h1', x: 110, y: 120 },
        { id: 'h2', x: 220, y: 120 },
        { id: 'h3', x: 330, y: 120 },
        { id: 'h4', x: 110, y: 230 },
        { id: 'h5', x: 330, y: 230 },
        { id: 'h6', x: 110, y: 340 },
        { id: 'h7', x: 220, y: 340 },
        { id: 'h8', x: 330, y: 340 },
        { id: 'h9', x: 110, y: 450 },
        { id: 'h10', x: 330, y: 450 },
        { id: 'h11', x: 220, y: 520 }
      ],
      planks: [
        {
          id: 'p1',
          colorTheme: 'green',
          layer: 1,
          x: 165,
          y: 120,
          width: 140,
          height: 38,
          angle: 0,
          holes: [{ x: 110, y: 120 }, { x: 220, y: 120 }]
        },
        {
          id: 'p2',
          colorTheme: 'blue',
          layer: 2,
          x: 330,
          y: 230,
          width: 38,
          height: 260,
          angle: 0,
          holes: [{ x: 330, y: 120 }, { x: 330, y: 340 }]
        },
        {
          id: 'p3',
          colorTheme: 'golden',
          layer: 3,
          x: 220,
          y: 340,
          width: 260,
          height: 38,
          angle: 0,
          holes: [{ x: 110, y: 340 }, { x: 220, y: 340 }, { x: 330, y: 340 }]
        },
        {
          id: 'p4',
          colorTheme: 'purple',
          layer: 4,
          x: 110,
          y: 285,
          width: 38,
          height: 370,
          angle: 0,
          holes: [{ x: 110, y: 120 }, { x: 110, y: 450 }]
        },
        {
          id: 'p5',
          colorTheme: 'redwood',
          layer: 5,
          x: 220,
          y: 450,
          width: 260,
          height: 38,
          angle: 0,
          holes: [{ x: 110, y: 450 }, { x: 330, y: 450 }]
        },
        {
          id: 'p6',
          colorTheme: 'darkwood',
          layer: 2,
          x: 220,
          y: 230,
          width: 38,
          height: 260,
          angle: 0,
          holes: [{ x: 220, y: 120 }, { x: 220, y: 340 }]
        }
      ],
      screws: [
        { id: 's1', holeId: 'h1' },
        { id: 's2', holeId: 'h2' },
        { id: 's3', holeId: 'h3' },
        { id: 's5', holeId: 'h5' },
        { id: 's6', holeId: 'h6' },
        { id: 's7', holeId: 'h7' },
        { id: 's8', holeId: 'h8' },
        { id: 's9', holeId: 'h9' },
        { id: 's10', holeId: 'h10' }
      ]
    },

    // LEVEL 8: Titan Timber Lock
    {
      id: 8,
      title: 'Level 8: Titan Lock',
      timeLimit: 60,
      boardHoles: [
        { id: 'h1', x: 120, y: 130 },
        { id: 'h2', x: 220, y: 130 },
        { id: 'h3', x: 320, y: 130 },
        { id: 'h4', x: 170, y: 240 },
        { id: 'h5', x: 270, y: 240 },
        { id: 'h6', x: 120, y: 350 },
        { id: 'h7', x: 220, y: 350 },
        { id: 'h8', x: 320, y: 350 },
        { id: 'h9', x: 170, y: 460 },
        { id: 'h10', x: 270, y: 460 },
        { id: 'h11', x: 220, y: 520 }
      ],
      planks: [
        {
          id: 'p1',
          colorTheme: 'golden',
          layer: 1,
          x: 220,
          y: 130,
          width: 240,
          height: 38,
          angle: 0,
          holes: [{ x: 120, y: 130 }, { x: 320, y: 130 }]
        },
        {
          id: 'p2',
          colorTheme: 'blue',
          layer: 2,
          x: 170,
          y: 240,
          width: 38,
          height: 260,
          angle: 0,
          holes: [{ x: 170, y: 240 }, { x: 170, y: 460 }]
        },
        {
          id: 'p3',
          colorTheme: 'blue',
          layer: 2,
          x: 270,
          y: 240,
          width: 38,
          height: 260,
          angle: 0,
          holes: [{ x: 270, y: 240 }, { x: 270, y: 460 }]
        },
        {
          id: 'p4',
          colorTheme: 'redwood',
          layer: 3,
          x: 220,
          y: 350,
          width: 240,
          height: 38,
          angle: 0,
          holes: [{ x: 120, y: 350 }, { x: 220, y: 350 }, { x: 320, y: 350 }]
        },
        {
          id: 'p5',
          colorTheme: 'green',
          layer: 4,
          x: 195,
          y: 295,
          width: 240,
          height: 38,
          angle: 0.785,
          holes: [{ x: 120, y: 130 }, { x: 270, y: 460 }]
        },
        {
          id: 'p6',
          colorTheme: 'purple',
          layer: 4,
          x: 245,
          y: 295,
          width: 240,
          height: 38,
          angle: -0.785,
          holes: [{ x: 320, y: 130 }, { x: 170, y: 460 }]
        }
      ],
      screws: [
        { id: 's1', holeId: 'h1' },
        { id: 's3', holeId: 'h3' },
        { id: 's4', holeId: 'h4' },
        { id: 's5', holeId: 'h5' },
        { id: 's6', holeId: 'h6' },
        { id: 's7', holeId: 'h7' },
        { id: 's8', holeId: 'h8' },
        { id: 's9', holeId: 'h9' },
        { id: 's10', holeId: 'h10' }
      ]
    }
  ];

  // Procedural Infinite Level Generator for Level 9+
  function generateProceduralLevel(levelNum) {
    const plankColors = Object.keys(PLANK_THEMES);
    const timeLimit = Math.max(45, 90 - (levelNum - 1) * 3);
    const rows = 4 + Math.min(2, Math.floor(levelNum / 5));
    const cols = 3;
    const startX = 110;
    const stepX = 110;
    const startY = 130;
    const stepY = 85;

    const boardHoles = [];
    let holeIdx = 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        boardHoles.push({
          id: `h${holeIdx++}`,
          x: startX + c * stepX,
          y: startY + r * stepY
        });
      }
    }
    // Add extra parking hole
    boardHoles.push({ id: `h${holeIdx++}`, x: 220, y: startY + rows * stepY + 30 });

    // Generate 5-8 planks
    const plankCount = Math.min(9, 4 + Math.floor(levelNum / 2));
    const planks = [];
    const usedHolePairs = new Set();
    const activeHoles = new Set();

    for (let i = 0; i < plankCount; i++) {
      const isHorizontal = Math.random() > 0.45;
      const theme = plankColors[i % plankColors.length];
      const layer = (i % 4) + 1;

      if (isHorizontal) {
        const r = Math.floor(Math.random() * rows);
        const c1 = 0;
        const c2 = Math.random() > 0.5 ? 2 : 1;
        const h1 = boardHoles[r * cols + c1];
        const h2 = boardHoles[r * cols + c2];
        const key = `${h1.id}_${h2.id}`;
        if (!usedHolePairs.has(key)) {
          usedHolePairs.add(key);
          activeHoles.add(h1.id);
          activeHoles.add(h2.id);
          const w = (c2 - c1) * stepX + 60;
          planks.push({
            id: `p_${i}`,
            colorTheme: theme,
            layer: layer,
            x: (h1.x + h2.x) / 2,
            y: h1.y,
            width: w,
            height: 38,
            angle: 0,
            holes: [{ x: h1.x, y: h1.y }, { x: h2.x, y: h2.y }]
          });
        }
      } else {
        const c = Math.floor(Math.random() * cols);
        const r1 = Math.floor(Math.random() * (rows - 2));
        const r2 = r1 + 2;
        const h1 = boardHoles[r1 * cols + c];
        const h2 = boardHoles[r2 * cols + c];
        const key = `${h1.id}_${h2.id}`;
        if (!usedHolePairs.has(key)) {
          usedHolePairs.add(key);
          activeHoles.add(h1.id);
          activeHoles.add(h2.id);
          const h = (r2 - r1) * stepY + 60;
          planks.push({
            id: `p_${i}`,
            colorTheme: theme,
            layer: layer,
            x: h1.x,
            y: (h1.y + h2.y) / 2,
            width: 38,
            height: h,
            angle: 0,
            holes: [{ x: h1.x, y: h1.y }, { x: h2.x, y: h2.y }]
          });
        }
      }
    }

    // Allocate screws: Leave 2 holes empty!
    const holeList = Array.from(activeHoles);
    const screws = [];
    const screwCount = Math.max(3, holeList.length - 2);
    for (let s = 0; s < screwCount; s++) {
      screws.push({ id: `s_${s + 1}`, holeId: holeList[s] });
    }

    return {
      id: levelNum,
      title: `Level ${levelNum}: Timber Master`,
      timeLimit: timeLimit,
      boardHoles: boardHoles,
      planks: planks,
      screws: screws
    };
  }

  // --- GAME ENGINE & STATE ---
  class WoodScrewGame {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.logicalWidth = 440;
      this.logicalHeight = 620;

      this.currentLevelIndex = 0;
      this.unlockedLevels = 1;
      this.currentLevelData = null;

      this.boardHoles = [];
      this.planks = [];
      this.screws = [];

      this.selectedScrewId = null;
      this.hoveredHoleId = null;
      this.undoHistory = [];
      this.movesCount = 0;
      this.timeRemaining = 90;
      this.timerInterval = null;
      this.isGameOver = false;
      this.isLevelWon = false;
      this.autoNextInterval = null;

      this.particles = [];
      this.scaleRatio = 1;

      this.initUI();
      this.setupCanvas();
      this.loadLevel(0);
      this.startLoop();
    }

    setupCanvas() {
      const resize = () => {
        const container = document.getElementById('canvas-container');
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        const maxW = rect.width - 8;
        const maxH = rect.height - 8;
        const aspect = this.logicalWidth / this.logicalHeight;

        let renderW = maxW;
        let renderH = maxW / aspect;

        if (renderH > maxH) {
          renderH = maxH;
          renderW = maxH * aspect;
        }

        this.canvas.style.width = `${renderW}px`;
        this.canvas.style.height = `${renderH}px`;
        this.canvas.width = renderW * dpr;
        this.canvas.height = renderH * dpr;

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale((renderW * dpr) / this.logicalWidth, (renderH * dpr) / this.logicalHeight);
        this.scaleRatio = (renderW * dpr) / this.logicalWidth;
      };

      window.addEventListener('resize', resize);
      resize();

      // Click & Touch events
      const handleInput = (e) => {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const canvasX = ((clientX - rect.left) / rect.width) * this.logicalWidth;
        const canvasY = ((clientY - rect.top) / rect.height) * this.logicalHeight;

        this.onCanvasClick(canvasX, canvasY);
      };

      this.canvas.addEventListener('mousedown', handleInput);
      this.canvas.addEventListener('touchstart', handleInput, { passive: false });
    }

    initUI() {
      // Sound toggle
      const btnSound = document.getElementById('btn-sound');
      const iconOn = document.getElementById('icon-sound-on');
      const iconOff = document.getElementById('icon-sound-off');
      btnSound.addEventListener('click', () => {
        sound.muted = !sound.muted;
        iconOn.classList.toggle('hidden', sound.muted);
        iconOff.classList.toggle('hidden', !sound.muted);
      });

      // Restart
      document.getElementById('btn-restart').addEventListener('click', () => {
        this.loadLevel(this.currentLevelIndex);
      });

      // Retry modal
      document.getElementById('btn-retry').addEventListener('click', () => {
        document.getElementById('modal-lose').classList.add('hidden');
        this.loadLevel(this.currentLevelIndex);
      });

      // Replay level
      document.getElementById('btn-replay-level').addEventListener('click', () => {
        this.clearAutoNext();
        document.getElementById('modal-win').classList.add('hidden');
        this.loadLevel(this.currentLevelIndex);
      });

      // Next level button
      document.getElementById('btn-next-level').addEventListener('click', () => {
        this.clearAutoNext();
        document.getElementById('modal-win').classList.add('hidden');
        this.nextLevel();
      });

      // Undo button
      document.getElementById('btn-undo').addEventListener('click', () => {
        this.undoMove();
      });

      // Hint button
      document.getElementById('btn-hint').addEventListener('click', () => {
        this.showHint();
      });

      // Levels drawer
      document.getElementById('btn-levels').addEventListener('click', () => {
        this.openLevelsModal();
      });
      document.getElementById('btn-levels-lose').addEventListener('click', () => {
        document.getElementById('modal-lose').classList.add('hidden');
        this.openLevelsModal();
      });
      document.getElementById('btn-close-levels').addEventListener('click', () => {
        document.getElementById('modal-level-select').classList.add('hidden');
      });
    }

    loadLevel(levelIndex) {
      this.currentLevelIndex = levelIndex;
      this.clearAutoNext();
      clearInterval(this.timerInterval);

      let levelData;
      if (levelIndex < LEVELS.length) {
        levelData = JSON.parse(JSON.stringify(LEVELS[levelIndex]));
      } else {
        levelData = generateProceduralLevel(levelIndex + 1);
      }

      this.currentLevelData = levelData;
      this.isGameOver = false;
      this.isLevelWon = false;
      this.selectedScrewId = null;
      this.undoHistory = [];
      this.movesCount = 0;
      this.timeRemaining = levelData.timeLimit;
      this.particles = [];

      // Deep copy board holes & screws
      this.boardHoles = levelData.boardHoles.map(h => ({ ...h }));
      this.screws = levelData.screws.map(s => ({
        ...s,
        liftProgress: 0,
        isLifting: false
      }));

      // Initialize Planks with physics state
      this.planks = levelData.planks.map(p => {
        const pObj = {
          ...p,
          origX: p.x,
          origY: p.y,
          origAngle: p.angle || 0,
          currentAngle: p.angle || 0,
          angularVel: 0,
          vx: 0,
          vy: 0,
          state: 'pinned', // 'pinned', 'swinging', 'falling'
          fastenedHoles: [],
          pivotHole: null,
          localHoles: [] // relative to plank center
        };

        // Convert absolute hole coords to plank-local offsets
        p.holes.forEach(h => {
          const dx = h.x - p.x;
          const dy = h.y - p.y;
          // Local offset rotated back by original angle
          const cos = Math.cos(-pObj.origAngle);
          const sin = Math.sin(-pObj.origAngle);
          const localX = dx * cos - dy * sin;
          const localY = dx * sin + dy * cos;
          pObj.localHoles.push({ localX, localY, boardHoleX: h.x, boardHoleY: h.y });
        });

        return pObj;
      });

      this.updatePlankAttachments(false);
      this.updateHUD();
      this.startTimer();

      // Show tutorial on Level 1
      const tutorial = document.getElementById('tutorial-hint');
      if (levelIndex === 0) {
        tutorial.classList.remove('hidden');
      } else {
        tutorial.classList.add('hidden');
      }
    }

    startTimer() {
      clearInterval(this.timerInterval);
      const timerPill = document.getElementById('timer-pill');
      const timerText = document.getElementById('timer-text');

      const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
      };

      timerText.textContent = formatTime(this.timeRemaining);
      timerPill.classList.remove('urgent');

      this.timerInterval = setInterval(() => {
        if (this.isGameOver || this.isLevelWon) return;
        this.timeRemaining--;
        timerText.textContent = formatTime(this.timeRemaining);

        if (this.timeRemaining <= 15) {
          timerPill.classList.add('urgent');
        }

        if (this.timeRemaining <= 0) {
          this.triggerGameOver();
        }
      }, 1000);
    }

    triggerGameOver() {
      this.isGameOver = true;
      clearInterval(this.timerInterval);
      sound.playError();
      document.getElementById('modal-lose').classList.remove('hidden');
    }

    updateHUD() {
      document.getElementById('level-title').textContent = `Level ${this.currentLevelIndex + 1}`;
      const activePlanks = this.planks.filter(p => p.state !== 'falling' || p.y < this.logicalHeight + 100);
      document.getElementById('planks-count').textContent = activePlanks.length;
      document.getElementById('undo-count').textContent = this.undoHistory.length;

      // Update level progress dots (10 max)
      const dotsContainer = document.getElementById('level-dots');
      dotsContainer.innerHTML = '';
      const totalDots = 3;
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('span');
        dot.className = `dot ${i <= (this.currentLevelIndex % totalDots) ? 'active' : ''}`;
        dotsContainer.appendChild(dot);
      }
    }

    // --- RE-EVALUATE PLANKS FASTENED TO HOLES ---
    updatePlankAttachments(triggerSounds = true) {
      const activeScrewHoles = new Set(this.screws.map(s => s.holeId));

      this.planks.forEach(plank => {
        if (plank.state === 'falling') return;

        // Find which plank holes currently match an active screw at a board hole
        const matchedScrews = [];
        plank.localHoles.forEach(lh => {
          // Transform local hole coordinate to world space
          const cos = Math.cos(plank.currentAngle);
          const sin = Math.sin(plank.currentAngle);
          const worldX = plank.x + (lh.localX * cos - lh.localY * sin);
          const worldY = plank.y + (lh.localX * sin + lh.localY * cos);

          // Check if close to any board hole with an active screw
          this.boardHoles.forEach(bh => {
            if (activeScrewHoles.has(bh.id)) {
              const dist = Math.hypot(worldX - bh.x, worldY - bh.y);
              if (dist < 18) {
                matchedScrews.push({ holeId: bh.id, worldX: bh.x, worldY: bh.y, localX: lh.localX, localY: lh.localY });
              }
            }
          });
        });

        plank.fastenedHoles = matchedScrews;

        if (matchedScrews.length >= 2) {
          plank.state = 'pinned';
          plank.pivotHole = null;
          plank.angularVel = 0;
        } else if (matchedScrews.length === 1) {
          if (plank.state !== 'swinging') {
            plank.state = 'swinging';
            plank.pivotHole = matchedScrews[0];
            // Give subtle initial rotational impulse
            plank.angularVel = (Math.random() - 0.5) * 0.04;
          }
        } else {
          // 0 screws -> FALLING!
          if (plank.state !== 'falling') {
            plank.state = 'falling';
            plank.pivotHole = null;
            plank.vy = 2.0;
            plank.vx = (Math.random() - 0.5) * 4;
            plank.angularVel = (Math.random() - 0.5) * 0.12;

            if (triggerSounds) {
              sound.playWoodDrop();
              this.spawnWoodParticles(plank.x, plank.y, plank.colorTheme);
            }
          }
        }
      });

      this.updateHUD();
      this.checkWinCondition();
    }

    // --- USER INTERACTION LOGIC ---
    onCanvasClick(x, y) {
      if (this.isGameOver || this.isLevelWon) return;

      // 1. Check if user clicked an active screw
      const clickedScrew = this.getScrewAt(x, y);
      if (clickedScrew) {
        if (this.selectedScrewId === clickedScrew.id) {
          // Deselect screw
          this.selectedScrewId = null;
          sound.playScrewIn();
        } else {
          // Select this screw
          this.selectedScrewId = clickedScrew.id;
          sound.playScrewSelect();
          // Hide tutorial hint if visible
          document.getElementById('tutorial-hint').classList.add('hidden');
        }
        return;
      }

      // 2. If a screw is already selected, check if user clicked an available hole
      if (this.selectedScrewId) {
        const clickedHole = this.getHoleAt(x, y);
        if (clickedHole) {
          const activeScrewAtHole = this.screws.find(s => s.holeId === clickedHole.id);
          if (!activeScrewAtHole) {
            // Hole is empty! Check if hole is physically open / unobstructed
            if (this.isHoleAccessible(clickedHole)) {
              this.moveScrew(this.selectedScrewId, clickedHole.id);
              this.selectedScrewId = null;
            } else {
              sound.playError();
            }
          } else {
            // Clicked another screw's hole -> switch selection
            this.selectedScrewId = activeScrewAtHole.id;
            sound.playScrewSelect();
          }
        } else {
          // Clicked outside -> deselect
          this.selectedScrewId = null;
        }
      }
    }

    getScrewAt(x, y) {
      for (const screw of this.screws) {
        const hole = this.boardHoles.find(h => h.id === screw.holeId);
        if (hole) {
          const dist = Math.hypot(x - hole.x, y - hole.y);
          if (dist <= 24) {
            return screw;
          }
        }
      }
      return null;
    }

    getHoleAt(x, y) {
      for (const hole of this.boardHoles) {
        const dist = Math.hypot(x - hole.x, y - hole.y);
        if (dist <= 26) {
          return hole;
        }
      }
      return null;
    }

    // Check if an empty hole is valid to insert a screw
    isHoleAccessible(boardHole) {
      // A hole is accessible if either:
      // a) No plank body is covering it, OR
      // b) A plank covering it actually has a hole at this position
      for (const plank of this.planks) {
        if (plank.state === 'falling') continue;

        // Check if hole is inside plank bounding box
        const cos = Math.cos(-plank.currentAngle);
        const sin = Math.sin(-plank.currentAngle);
        const dx = boardHole.x - plank.x;
        const dy = boardHole.y - plank.y;
        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;

        const halfW = plank.width / 2;
        const halfH = plank.height / 2;

        if (Math.abs(localX) <= halfW && Math.abs(localY) <= halfH) {
          // It covers this spot! Does this plank have a hole here?
          const hasHole = plank.localHoles.some(lh => {
            return Math.hypot(localX - lh.localX, localY - lh.localY) <= 18;
          });
          if (!hasHole) {
            return false; // Obstructed by solid wood!
          }
        }
      }
      return true;
    }

    moveScrew(screwId, targetHoleId) {
      const screw = this.screws.find(s => s.id === screwId);
      if (!screw) return;

      const fromHoleId = screw.holeId;
      this.undoHistory.push({ screwId, fromHoleId, toHoleId: targetHoleId });
      this.movesCount++;

      screw.holeId = targetHoleId;
      sound.playScrewIn();

      const targetHole = this.boardHoles.find(h => h.id === targetHoleId);
      if (targetHole) {
        this.spawnScrewSparks(targetHole.x, targetHole.y);
      }

      this.updatePlankAttachments(true);
    }

    undoMove() {
      if (this.undoHistory.length === 0 || this.isGameOver || this.isLevelWon) return;

      const lastMove = this.undoHistory.pop();
      const screw = this.screws.find(s => s.id === lastMove.screwId);
      if (screw) {
        screw.holeId = lastMove.fromHoleId;
        sound.playScrewIn();
        this.updatePlankAttachments(true);
      }
    }

    showHint() {
      // Find a screw that is currently holding a plank that can be freed or swung
      for (const screw of this.screws) {
        // Highlight this screw temporarily
        this.selectedScrewId = screw.id;
        sound.playScrewSelect();
        break;
      }
    }

    checkWinCondition() {
      const remaining = this.planks.filter(p => p.state !== 'falling');
      if (remaining.length === 0 && !this.isLevelWon) {
        this.isLevelWon = true;
        clearInterval(this.timerInterval);
        setTimeout(() => this.triggerWin(), 600);
      }
    }

    triggerWin() {
      sound.playWin();
      this.unlockedLevels = Math.max(this.unlockedLevels, this.currentLevelIndex + 2);

      // Score calculation
      const baseScore = 1000;
      const timeBonus = this.timeRemaining * 15;
      const movePenalty = Math.max(0, (this.movesCount - 4) * 20);
      const totalScore = baseScore + timeBonus - movePenalty;

      // Stars
      let stars = 3;
      if (this.timeRemaining < 25) stars = 2;
      if (this.timeRemaining < 10) stars = 1;

      document.getElementById('win-time').textContent = `${this.currentLevelData.timeLimit - this.timeRemaining}s`;
      document.getElementById('win-moves').textContent = this.movesCount;
      document.getElementById('win-score').textContent = `+${totalScore.toLocaleString()}`;

      // Star UI
      const winStars = document.getElementById('win-stars').children;
      for (let i = 0; i < 3; i++) {
        if (i < stars) {
          winStars[i].className = `star star-${i + 1} filled`;
        } else {
          winStars[i].className = `star star-${i + 1}`;
        }
      }

      // Confetti
      this.spawnConfetti();

      // Show win modal
      document.getElementById('modal-win').classList.remove('hidden');

      // Auto next level countdown (3 seconds)
      this.startAutoNextCountdown(3);
    }

    startAutoNextCountdown(seconds) {
      this.clearAutoNext();
      let timeLeft = seconds;
      const secEl = document.getElementById('auto-next-sec');
      const fillEl = document.getElementById('auto-next-fill');

      secEl.textContent = timeLeft;
      fillEl.style.width = '100%';

      const startTime = Date.now();
      const duration = seconds * 1000;

      this.autoNextInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remainingRatio = Math.max(0, 1 - elapsed / duration);
        fillEl.style.width = `${remainingRatio * 100}%`;

        const curSec = Math.ceil((duration - elapsed) / 1000);
        if (curSec >= 0) {
          secEl.textContent = curSec;
        }

        if (elapsed >= duration) {
          this.clearAutoNext();
          document.getElementById('modal-win').classList.add('hidden');
          this.nextLevel();
        }
      }, 50);
    }

    clearAutoNext() {
      if (this.autoNextInterval) {
        clearInterval(this.autoNextInterval);
        this.autoNextInterval = null;
      }
    }

    nextLevel() {
      this.loadLevel(this.currentLevelIndex + 1);
    }

    openLevelsModal() {
      const modal = document.getElementById('modal-level-select');
      const grid = document.getElementById('levels-grid');
      grid.innerHTML = '';

      const totalDisplayLevels = Math.max(12, this.unlockedLevels + 2);
      for (let i = 0; i < totalDisplayLevels; i++) {
        const btn = document.createElement('button');
        const isLocked = i >= this.unlockedLevels;
        const isCurrent = i === this.currentLevelIndex;

        btn.className = `level-btn ${isLocked ? 'locked' : ''} ${isCurrent ? 'current' : ''}`;
        btn.innerHTML = `
          <span class="num">${i + 1}</span>
          <span class="lvl-stars">${!isLocked ? '★★★' : '🔒'}</span>
        `;

        if (!isLocked) {
          btn.addEventListener('click', () => {
            modal.classList.add('hidden');
            this.loadLevel(i);
          });
        }
        grid.appendChild(btn);
      }

      modal.classList.remove('hidden');
    }

    // --- PHYSICS UPDATE LOOP ---
    updatePhysics() {
      const gravity = 0.45;
      const angularGravity = 0.0035;
      const angularDamping = 0.982;

      this.planks.forEach(plank => {
        if (plank.state === 'swinging' && plank.pivotHole) {
          // Pendulum swinging around pivot hole!
          const pivotWorldX = plank.pivotHole.worldX;
          const pivotWorldY = plank.pivotHole.worldY;

          // Vector from pivot to center of mass
          const cos = Math.cos(plank.currentAngle);
          const sin = Math.sin(plank.currentAngle);
          const comOffsetX = - (plank.pivotHole.localX * cos - plank.pivotHole.localY * sin);
          const comOffsetY = - (plank.pivotHole.localX * sin + plank.pivotHole.localY * cos);

          // Pendulum torque: gravity pulls COM downwards
          // Torque = - r_x * g
          const torque = - comOffsetX * angularGravity;

          plank.angularVel += torque;
          plank.angularVel *= angularDamping;
          plank.currentAngle += plank.angularVel;

          // Update plank position so pivot hole stays anchored at worldX, worldY
          const newCos = Math.cos(plank.currentAngle);
          const newSin = Math.sin(plank.currentAngle);
          plank.x = pivotWorldX - (plank.pivotHole.localX * newCos - plank.pivotHole.localY * newSin);
          plank.y = pivotWorldY - (plank.pivotHole.localX * newSin + plank.pivotHole.localY * newCos);
        } else if (plank.state === 'falling') {
          // Free falling with gravity and rotation
          plank.vy += gravity;
          plank.x += plank.vx;
          plank.y += plank.vy;
          plank.currentAngle += plank.angularVel;
        }
      });

      // Update particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity || 0.15;
        p.life -= p.decay || 0.02;
        p.angle += p.vAngle || 0.05;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    // --- RENDER ENGINE ---
    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);

      // 1. Draw Wooden Backboard
      this.drawBackboard(ctx);

      // 2. Draw Board Holes (depth recesses)
      this.drawBoardHoles(ctx);

      // 3. Draw Planks (sorted by layer & state)
      const sortedPlanks = [...this.planks].sort((a, b) => {
        if (a.state === 'falling' && b.state !== 'falling') return 1;
        if (b.state === 'falling' && a.state !== 'falling') return -1;
        return a.layer - b.layer;
      });

      sortedPlanks.forEach(plank => {
        if (plank.y < this.logicalHeight + 150) {
          this.drawPlank(ctx, plank);
        }
      });

      // 4. Draw Screws
      this.drawScrews(ctx);

      // 5. Draw Particles
      this.drawParticles(ctx);
    }

    drawBackboard(ctx) {
      const pad = 18;
      const x = pad;
      const y = pad;
      const w = this.logicalWidth - pad * 2;
      const h = this.logicalHeight - pad * 2;
      const r = 26;

      ctx.save();
      // Drop shadow for the whole board
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 12;

      // Board Base Color (Smooth Sanded Birch Wood)
      const grad = ctx.createLinearGradient(x, y, x + w, y + h);
      grad.addColorStop(0, '#f5d6a2');
      grad.addColorStop(0.5, '#ebd19a');
      grad.addColorStop(1, '#ddbe85');

      ctx.fillStyle = grad;
      this.roundRect(ctx, x, y, w, h, r);
      ctx.fill();
      ctx.restore();

      // Board Border Bevel
      ctx.save();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#c49e63';
      this.roundRect(ctx, x, y, w, h, r);
      ctx.stroke();

      // Inner subtle grain lines on the board
      ctx.strokeStyle = 'rgba(168, 126, 68, 0.12)';
      ctx.lineWidth = 1.5;
      for (let i = 1; i <= 6; i++) {
        const lineX = x + (w / 7) * i;
        ctx.beginPath();
        ctx.moveTo(lineX, y + 6);
        ctx.lineTo(lineX, y + h - 6);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawBoardHoles(ctx) {
      this.boardHoles.forEach(hole => {
        const isSelectedTarget = this.selectedScrewId && !this.screws.some(s => s.holeId === hole.id);
        const accessible = isSelectedTarget && this.isHoleAccessible(hole);

        ctx.save();
        // Hole inner shadow & recess
        ctx.fillStyle = '#221206';
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, 13, 0, Math.PI * 2);
        ctx.fill();

        // Metallic/wood outer rim
        ctx.strokeStyle = '#82562b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, 13, 0, Math.PI * 2);
        ctx.stroke();

        // Highlight ring if selected screw can be placed here
        if (isSelectedTarget) {
          if (accessible) {
            ctx.strokeStyle = '#2ecc71';
            ctx.lineWidth = 3.5;
            ctx.shadowColor = '#2ecc71';
            ctx.shadowBlur = 10;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.arc(hole.x, hole.y, 19, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            // Blocked
            ctx.strokeStyle = 'rgba(231, 76, 60, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(hole.x, hole.y, 17, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        ctx.restore();
      });
    }

    drawPlank(ctx, plank) {
      const theme = PLANK_THEMES[plank.colorTheme] || PLANK_THEMES.brown;
      const w = plank.width;
      const h = plank.height;
      const r = Math.min(w, h) / 2; // Rounded pill ends

      ctx.save();
      ctx.translate(plank.x, plank.y);
      ctx.rotate(plank.currentAngle);

      // Plank Drop Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = plank.state === 'falling' ? 24 : 10;
      ctx.shadowOffsetY = plank.state === 'falling' ? 14 : 5;

      // Base Plank Shape & Gradient
      const grad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      grad.addColorStop(0, theme.light);
      grad.addColorStop(0.5, theme.base);
      grad.addColorStop(1, theme.dark);

      ctx.fillStyle = grad;
      this.roundRect(ctx, -w / 2, -h / 2, w, h, r);
      ctx.fill();

      // Reset shadow for details
      ctx.shadowColor = 'transparent';

      // Wood Grain Texture Lines
      ctx.strokeStyle = theme.grain;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.35;
      const grainCount = Math.floor(h / 7);
      for (let g = 1; g <= grainCount; g++) {
        const yOffset = -h / 2 + g * 7;
        ctx.beginPath();
        ctx.moveTo(-w / 2 + 10, yOffset);
        ctx.bezierCurveTo(-w / 4, yOffset + 2, w / 4, yOffset - 2, w / 2 - 10, yOffset);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Highlight Top Rim & Bevel
      ctx.strokeStyle = theme.highlight;
      ctx.lineWidth = 1.8;
      ctx.globalAlpha = 0.75;
      this.roundRect(ctx, -w / 2 + 1, -h / 2 + 1, w - 2, h - 2, r - 1);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Draw Holes in Plank
      plank.localHoles.forEach(lh => {
        ctx.fillStyle = '#1c0e05';
        ctx.beginPath();
        ctx.arc(lh.localX, lh.localY, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(lh.localX, lh.localY, 12, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.restore();
    }

    drawScrews(ctx) {
      this.screws.forEach(screw => {
        const hole = this.boardHoles.find(h => h.id === screw.holeId);
        if (!hole) return;

        const isSelected = this.selectedScrewId === screw.id;

        ctx.save();
        const drawX = hole.x;
        const drawY = isSelected ? hole.y - 12 : hole.y; // Lifts up when unscrewed

        // Screw Drop Shadow
        ctx.shadowColor = isSelected ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = isSelected ? 18 : 6;
        ctx.shadowOffsetY = isSelected ? 12 : 3;

        // Selection Aura
        if (isSelected) {
          ctx.strokeStyle = '#ffb830';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#ffb830';
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.arc(drawX, drawY, 23, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 3D Metallic Screw Head (Silver/Steel Metallic Gradient)
        const radGrad = ctx.createRadialGradient(
          drawX - 4, drawY - 4, 2,
          drawX, drawY, 17
        );
        radGrad.addColorStop(0, '#ffffff');
        radGrad.addColorStop(0.3, '#d5dbdb');
        radGrad.addColorStop(0.7, '#95a5a6');
        radGrad.addColorStop(1, '#566573');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(drawX, drawY, 16, 0, Math.PI * 2);
        ctx.fill();

        // Metallic Rim
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(drawX, drawY, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Phillips Cross Slot (+)
        ctx.fillStyle = '#2c3e50';
        ctx.shadowColor = 'transparent';

        // Vertical slot bar
        ctx.fillRect(drawX - 2.2, drawY - 9, 4.4, 18);
        // Horizontal slot bar
        ctx.fillRect(drawX - 9, drawY - 2.2, 18, 4.4);

        // Center indentation depth
        ctx.fillStyle = '#1a252f';
        ctx.fillRect(drawX - 3.5, drawY - 3.5, 7, 7);

        ctx.restore();
      });
    }

    drawParticles(ctx) {
      this.particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        if (p.isRect) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
    }

    roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.arcTo(x + width, y, x + width, y + radius, radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
      ctx.lineTo(x + radius, y + height);
      ctx.arcTo(x, y + height, x, y + height - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();
    }

    // --- PARTICLE EMITTERS ---
    spawnScrewSparks(x, y) {
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.1,
          size: 2 + Math.random() * 3,
          color: Math.random() > 0.5 ? '#ffb830' : '#ffffff',
          life: 1.0,
          decay: 0.04,
          angle: 0
        });
      }
    }

    spawnWoodParticles(x, y, colorTheme) {
      const theme = PLANK_THEMES[colorTheme] || PLANK_THEMES.brown;
      for (let i = 0; i < 14; i++) {
        this.particles.push({
          x: x + (Math.random() - 0.5) * 60,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 4,
          vy: -1 - Math.random() * 3,
          gravity: 0.25,
          size: 3 + Math.random() * 5,
          color: Math.random() > 0.5 ? theme.base : theme.light,
          life: 1.0,
          decay: 0.025,
          angle: Math.random() * Math.PI,
          vAngle: (Math.random() - 0.5) * 0.1
        });
      }
    }

    spawnConfetti() {
      const colors = ['#f1c40f', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#e67e22'];
      const container = document.getElementById('confetti-container');
      container.innerHTML = '';

      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 0.8}s`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(confetti);
      }
    }

    startLoop() {
      const loop = () => {
        this.updatePhysics();
        this.render();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  // Launch the game once DOM is fully loaded
  window.addEventListener('DOMContentLoaded', () => {
    window.game = new WoodScrewGame();
  });
})();
