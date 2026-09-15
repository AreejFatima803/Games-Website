/**
 * BARBARA & KENT: TOILET RUSH
 * A high-polish cartoon Draw-to-Pee puzzle game
 */

// ==========================================
// AUDIO SYNTHESIZER (Web Audio API)
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    
    // Load mute preference
    const saved = localStorage.getItem('bk_sound_muted');
    if (saved !== null) {
      this.muted = saved === 'true';
    }
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('bk_sound_muted', this.muted);
    if (this.muted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return !this.muted;
  }

  playClick() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playDraw() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220 + Math.random() * 80, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playStep() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160 + Math.random() * 40, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playCrash() {
    if (this.muted) return;
    this.init();
    // Bonk sound + Noise burst
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.35);
  }

  playFlush() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    // White noise swoosh simulation
    const bufferSize = this.ctx.sampleRate * 1.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(200, now + 1.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
    noise.stop(now + 1.2);
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);
      gain.gain.setValueAtTime(0.3, now + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.12 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 0.35);
    });
  }

  playKey() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.15);
  }

  startBGM() {
    if (this.muted || this.bgmPlaying) return;
    this.bgmPlaying = true;
    const melody = [
      261.63, 329.63, 392.00, 523.25,
      392.00, 329.63, 261.63, 329.63,
      293.66, 369.99, 440.00, 587.33,
      440.00, 369.99, 293.66, 261.63
    ];
    let noteIdx = 0;

    const playNext = () => {
      if (!this.bgmPlaying || this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(melody[noteIdx], this.ctx.currentTime);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);

      noteIdx = (noteIdx + 1) % melody.length;
      this.bgmTimer = setTimeout(playNext, 320);
    };
    playNext();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

const sounds = new SoundEngine();

// ==========================================
// LEVEL DEFINITIONS (15 Handcrafted Levels)
// Coordinates are in normalized 0-100 space
// ==========================================
const LEVELS = [
  // Level 1: Warmup - Parallel Lines
  {
    id: 1,
    title: "First Emergency",
    kent: { x: 25, y: 80 },
    barbara: { x: 75, y: 80 },
    blueDoor: { x: 25, y: 15 },
    pinkDoor: { x: 75, y: 15 },
    walls: [],
    hazards: [],
    hintKent: [{x: 25, y: 80}, {x: 25, y: 15}],
    hintBarbara: [{x: 75, y: 80}, {x: 75, y: 15}]
  },

  // Level 2: Intersecting Cross (Timing Challenge!)
  {
    id: 2,
    title: "Crossing Paths",
    kent: { x: 20, y: 80 },
    barbara: { x: 80, y: 80 },
    blueDoor: { x: 80, y: 15 },
    pinkDoor: { x: 20, y: 15 },
    walls: [],
    hazards: [],
    hintKent: [{x: 20, y: 80}, {x: 10, y: 50}, {x: 80, y: 15}],
    hintBarbara: [{x: 80, y: 80}, {x: 50, y: 50}, {x: 20, y: 15}]
  },

  // Level 3: Center Wall Divider
  {
    id: 3,
    title: "The Wall Between Us",
    kent: { x: 20, y: 85 },
    barbara: { x: 80, y: 85 },
    blueDoor: { x: 20, y: 15 },
    pinkDoor: { x: 80, y: 15 },
    walls: [
      { x: 35, y: 40, w: 30, h: 20 }
    ],
    hazards: [],
    hintKent: [{x: 20, y: 85}, {x: 15, y: 50}, {x: 20, y: 15}],
    hintBarbara: [{x: 80, y: 85}, {x: 85, y: 50}, {x: 80, y: 15}]
  },

  // Level 4: Poop Trap Hazards
  {
    id: 4,
    title: "Watch Your Step!",
    kent: { x: 20, y: 80 },
    barbara: { x: 80, y: 80 },
    blueDoor: { x: 80, y: 20 },
    pinkDoor: { x: 20, y: 20 },
    walls: [],
    hazards: [
      { type: 'poop', x: 50, y: 50, r: 8 },
      { type: 'poop', x: 30, y: 40, r: 6 },
      { type: 'poop', x: 70, y: 40, r: 6 }
    ],
    hintKent: [{x: 20, y: 80}, {x: 20, y: 60}, {x: 80, y: 60}, {x: 80, y: 20}],
    hintBarbara: [{x: 80, y: 80}, {x: 85, y: 40}, {x: 50, y: 25}, {x: 20, y: 20}]
  },

  // Level 5: Guard Dog Patrol
  {
    id: 5,
    title: "Barking Trouble",
    kent: { x: 20, y: 85 },
    barbara: { x: 80, y: 85 },
    blueDoor: { x: 20, y: 15 },
    pinkDoor: { x: 80, y: 15 },
    walls: [
      { x: 45, y: 25, w: 10, h: 50 }
    ],
    hazards: [
      { type: 'dog', x: 20, y: 50, minX: 10, maxX: 40, speed: 0.6, dir: 1, r: 9 }
    ],
    hintKent: [{x: 20, y: 85}, {x: 35, y: 50}, {x: 20, y: 15}],
    hintBarbara: [{x: 80, y: 85}, {x: 70, y: 50}, {x: 80, y: 15}]
  },

  // Level 6: Golden Key & Locked Blue Door
  {
    id: 6,
    title: "Find The Key!",
    kent: { x: 20, y: 80 },
    barbara: { x: 80, y: 80 },
    blueDoor: { x: 20, y: 15, locked: true, keyId: 1 },
    pinkDoor: { x: 80, y: 15 },
    keys: [
      { id: 1, x: 50, y: 50, collected: false }
    ],
    walls: [
      { x: 10, y: 35, w: 30, h: 8 }
    ],
    hazards: [],
    hintKent: [{x: 20, y: 80}, {x: 50, y: 50}, {x: 30, y: 25}, {x: 20, y: 15}],
    hintBarbara: [{x: 80, y: 80}, {x: 80, y: 15}]
  },

  // Level 7: Dual Keys for Both
  {
    id: 7,
    title: "Double Lockout",
    kent: { x: 15, y: 85 },
    barbara: { x: 85, y: 85 },
    blueDoor: { x: 15, y: 15, locked: true, keyId: 1 },
    pinkDoor: { x: 85, y: 15, locked: true, keyId: 2 },
    keys: [
      { id: 1, x: 80, y: 50, collected: false }, // Kent key is on Barbara's side!
      { id: 2, x: 20, y: 50, collected: false }  // Barbara key is on Kent's side!
    ],
    walls: [
      { x: 45, y: 35, w: 10, h: 30 }
    ],
    hazards: [],
    hintKent: [{x: 15, y: 85}, {x: 50, y: 75}, {x: 80, y: 50}, {x: 50, y: 25}, {x: 15, y: 15}],
    hintBarbara: [{x: 85, y: 85}, {x: 20, y: 50}, {x: 85, y: 15}]
  },

  // Level 8: Maze Navigation
  {
    id: 8,
    title: "Corridor Rush",
    kent: { x: 15, y: 85 },
    barbara: { x: 85, y: 85 },
    blueDoor: { x: 50, y: 15 },
    pinkDoor: { x: 85, y: 15 },
    walls: [
      { x: 0, y: 65, w: 60, h: 8 },
      { x: 40, y: 40, w: 60, h: 8 }
    ],
    hazards: [],
    hintKent: [{x: 15, y: 85}, {x: 80, y: 85}, {x: 75, y: 55}, {x: 25, y: 55}, {x: 25, y: 25}, {x: 50, y: 15}],
    hintBarbara: [{x: 85, y: 85}, {x: 85, y: 75}, {x: 85, y: 55}, {x: 85, y: 15}]
  },

  // Level 9: Double Patrolling Dogs
  {
    id: 9,
    title: "Double Dog Dare",
    kent: { x: 20, y: 85 },
    barbara: { x: 80, y: 85 },
    blueDoor: { x: 80, y: 15 },
    pinkDoor: { x: 20, y: 15 },
    walls: [
      { x: 30, y: 48, w: 40, h: 6 }
    ],
    hazards: [
      { type: 'dog', x: 20, y: 35, minX: 10, maxX: 45, speed: 0.8, dir: 1, r: 8 },
      { type: 'dog', x: 80, y: 65, minX: 55, maxX: 90, speed: 0.8, dir: -1, r: 8 }
    ],
    hintKent: [{x: 20, y: 85}, {x: 10, y: 50}, {x: 50, y: 25}, {x: 80, y: 15}],
    hintBarbara: [{x: 80, y: 85}, {x: 90, y: 50}, {x: 50, y: 70}, {x: 20, y: 15}]
  },

  // Level 10: The Tight S-Curve
  {
    id: 10,
    title: "S-Bend Sprint",
    kent: { x: 15, y: 85 },
    barbara: { x: 85, y: 85 },
    blueDoor: { x: 15, y: 15 },
    pinkDoor: { x: 85, y: 15 },
    walls: [
      { x: 25, y: 25, w: 50, h: 8 },
      { x: 25, y: 70, w: 50, h: 8 }
    ],
    hazards: [
      { type: 'poop', x: 50, y: 48, r: 8 }
    ],
    hintKent: [{x: 15, y: 85}, {x: 15, y: 50}, {x: 15, y: 15}],
    hintBarbara: [{x: 85, y: 85}, {x: 85, y: 50}, {x: 85, y: 15}]
  },

  // Level 11: Spiral Labyrinth
  {
    id: 11,
    title: "Spiral Chamber",
    kent: { x: 50, y: 85 },
    barbara: { x: 50, y: 55 },
    blueDoor: { x: 20, y: 15 },
    pinkDoor: { x: 80, y: 15 },
    walls: [
      { x: 30, y: 40, w: 40, h: 6 },
      { x: 30, y: 40, w: 6, h: 30 },
      { x: 30, y: 70, w: 25, h: 6 }
    ],
    hazards: [],
    hintKent: [{x: 50, y: 85}, {x: 15, y: 85}, {x: 15, y: 15}, {x: 20, y: 15}],
    hintBarbara: [{x: 50, y: 55}, {x: 75, y: 55}, {x: 80, y: 15}]
  },

  // Level 12: Speed Run & Narrow Gates
  {
    id: 12,
    title: "Need for Speed",
    kent: { x: 20, y: 85 },
    barbara: { x: 80, y: 85 },
    blueDoor: { x: 80, y: 15 },
    pinkDoor: { x: 20, y: 15 },
    walls: [
      { x: 0, y: 50, w: 35, h: 8 },
      { x: 65, y: 50, w: 35, h: 8 }
    ],
    hazards: [
      { type: 'dog', x: 50, y: 50, minX: 38, maxX: 62, speed: 0.5, dir: 1, r: 8 }
    ],
    hintKent: [{x: 20, y: 85}, {x: 40, y: 65}, {x: 60, y: 35}, {x: 80, y: 15}],
    hintBarbara: [{x: 80, y: 85}, {x: 60, y: 65}, {x: 40, y: 35}, {x: 20, y: 15}]
  },

  // Level 13: Hazard Minefield
  {
    id: 13,
    title: "Minefield Marathon",
    kent: { x: 15, y: 85 },
    barbara: { x: 85, y: 85 },
    blueDoor: { x: 15, y: 15 },
    pinkDoor: { x: 85, y: 15 },
    walls: [],
    hazards: [
      { type: 'poop', x: 50, y: 80, r: 8 },
      { type: 'poop', x: 30, y: 55, r: 8 },
      { type: 'poop', x: 70, y: 55, r: 8 },
      { type: 'poop', x: 50, y: 30, r: 8 }
    ],
    hintKent: [{x: 15, y: 85}, {x: 15, y: 55}, {x: 15, y: 15}],
    hintBarbara: [{x: 85, y: 85}, {x: 85, y: 55}, {x: 85, y: 15}]
  },

  // Level 14: The Key Gauntlet
  {
    id: 14,
    title: "Key Gauntlet",
    kent: { x: 20, y: 85 },
    barbara: { x: 80, y: 85 },
    blueDoor: { x: 20, y: 15, locked: true, keyId: 1 },
    pinkDoor: { x: 80, y: 15, locked: true, keyId: 2 },
    keys: [
      { id: 1, x: 50, y: 20, collected: false },
      { id: 2, x: 50, y: 80, collected: false }
    ],
    walls: [
      { x: 35, y: 40, w: 30, h: 20 }
    ],
    hazards: [
      { type: 'dog', x: 50, y: 50, minX: 20, maxX: 80, speed: 0.9, dir: 1, r: 8 }
    ],
    hintKent: [{x: 20, y: 85}, {x: 15, y: 50}, {x: 50, y: 20}, {x: 20, y: 15}],
    hintBarbara: [{x: 80, y: 85}, {x: 50, y: 80}, {x: 85, y: 50}, {x: 80, y: 15}]
  },

  // Level 15: Grand Toilet Showdown
  {
    id: 15,
    title: "The Ultimate Flush!",
    kent: { x: 15, y: 85 },
    barbara: { x: 85, y: 85 },
    blueDoor: { x: 85, y: 15, locked: true, keyId: 1 },
    pinkDoor: { x: 15, y: 15, locked: true, keyId: 2 },
    keys: [
      { id: 1, x: 85, y: 50, collected: false },
      { id: 2, x: 15, y: 50, collected: false }
    ],
    walls: [
      { x: 35, y: 30, w: 30, h: 8 },
      { x: 35, y: 62, w: 30, h: 8 }
    ],
    hazards: [
      { type: 'poop', x: 50, y: 46, r: 7 },
      { type: 'dog', x: 50, y: 78, minX: 30, maxX: 70, speed: 0.7, dir: 1, r: 8 }
    ],
    hintKent: [{x: 15, y: 85}, {x: 50, y: 88}, {x: 85, y: 50}, {x: 85, y: 15}],
    hintBarbara: [{x: 85, y: 85}, {x: 15, y: 50}, {x: 15, y: 15}]
  }
];

// ==========================================
// GAME STATE & ENGINE
// ==========================================
class ToiletRushGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.currentLevelIdx = 0;
    this.level = null;
    
    // Level progress stored in localStorage
    this.unlockedLevels = JSON.parse(localStorage.getItem('bk_unlocked_levels') || '[1]');
    this.levelStars = JSON.parse(localStorage.getItem('bk_stars') || '{}');
    this.hintsLeft = parseInt(localStorage.getItem('bk_hints') || '3');

    // Drawing state
    this.drawingChar = null; // 'kent' or 'barbara'
    this.kentPath = [];      // Array of {x, y} in normalized coords
    this.barbaraPath = [];
    this.isDrawing = false;
    this.showHint = false;

    // Running state
    this.state = 'DRAWING'; // 'DRAWING', 'RUNNING', 'WIN', 'FAIL'
    this.kentRunner = { t: 0, pos: { x: 0, y: 0 }, reached: false };
    this.barbaraRunner = { t: 0, pos: { x: 0, y: 0 }, reached: false };
    this.runSpeed = 0.55; // Normalized units per frame

    // Visual particles
    this.particles = [];
    this.confetti = [];
    this.stars = [];
    this.crashBurst = null;

    // Time & Animation
    this.time = 0;
    this.lastFrame = 0;

    this.initDOM();
    this.setupEvents();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.loadLevel(0);
    this.startLoop();
  }

  initDOM() {
    this.dom = {
      levelNum: document.getElementById('current-level-num'),
      instructionText: document.getElementById('instruction-text'),
      actionBar: document.getElementById('action-bar'),
      btnGo: document.getElementById('btn-go'),
      btnClear: document.getElementById('btn-clear-lines'),
      btnHome: document.getElementById('btn-home'),
      btnLevels: document.getElementById('btn-levels'),
      btnSound: document.getElementById('btn-sound'),
      soundIcon: document.getElementById('sound-icon'),
      btnRestart: document.getElementById('btn-restart'),
      btnHint: document.getElementById('btn-hint'),
      hintCount: document.getElementById('hint-count'),
      
      modalMainMenu: document.getElementById('modal-main-menu'),
      btnMainPlay: document.getElementById('btn-main-play'),
      btnMenuLevels: document.getElementById('btn-menu-levels'),
      btnMenuHow: document.getElementById('btn-menu-how'),

      modalLevelSelect: document.getElementById('modal-level-select'),
      levelGrid: document.getElementById('level-grid'),
      btnCloseLevels: document.getElementById('btn-close-levels'),

      modalHow: document.getElementById('modal-how-to-play'),
      btnCloseHow: document.getElementById('btn-close-how'),
      btnGotIt: document.getElementById('btn-tutorial-gotit'),

      modalWin: document.getElementById('modal-win'),
      winStars: document.getElementById('win-stars'),
      winQuote: document.getElementById('win-quote'),
      btnWinReplay: document.getElementById('btn-win-replay'),
      btnWinNext: document.getElementById('btn-win-next'),

      modalFail: document.getElementById('modal-fail'),
      failEmoji: document.getElementById('fail-emoji'),
      failTitle: document.getElementById('fail-title'),
      failDesc: document.getElementById('fail-desc'),
      btnFailHint: document.getElementById('btn-fail-hint'),
      btnFailRetry: document.getElementById('btn-fail-retry'),
    };

    this.updateSoundIcon();
    this.updateHintCount();
  }

  setupEvents() {
    // Menu Events
    this.dom.btnMainPlay.addEventListener('click', () => {
      sounds.playClick();
      sounds.startBGM();
      this.closeModal(this.dom.modalMainMenu);
    });

    this.dom.btnMenuLevels.addEventListener('click', () => {
      sounds.playClick();
      this.openLevelSelect();
    });

    this.dom.btnMenuHow.addEventListener('click', () => {
      sounds.playClick();
      this.openModal(this.dom.modalHow);
    });

    this.dom.btnHome.addEventListener('click', () => {
      sounds.playClick();
      this.openModal(this.dom.modalMainMenu);
    });

    this.dom.btnLevels.addEventListener('click', () => {
      sounds.playClick();
      this.openLevelSelect();
    });

    this.dom.btnCloseLevels.addEventListener('click', () => {
      sounds.playClick();
      this.closeModal(this.dom.modalLevelSelect);
    });

    this.dom.btnCloseHow.addEventListener('click', () => {
      sounds.playClick();
      this.closeModal(this.dom.modalHow);
    });

    this.dom.btnGotIt.addEventListener('click', () => {
      sounds.playClick();
      this.closeModal(this.dom.modalHow);
    });

    this.dom.btnSound.addEventListener('click', () => {
      const active = sounds.toggleMute();
      this.updateSoundIcon();
    });

    this.dom.btnRestart.addEventListener('click', () => {
      sounds.playClick();
      this.resetLevel();
    });

    this.dom.btnHint.addEventListener('click', () => {
      sounds.playClick();
      this.triggerHint();
    });

    this.dom.btnGo.addEventListener('click', () => {
      sounds.playClick();
      this.startRunning();
    });

    this.dom.btnClear.addEventListener('click', () => {
      sounds.playClick();
      this.clearLines();
    });

    this.dom.btnWinReplay.addEventListener('click', () => {
      sounds.playClick();
      this.closeModal(this.dom.modalWin);
      this.resetLevel();
    });

    this.dom.btnWinNext.addEventListener('click', () => {
      sounds.playClick();
      this.closeModal(this.dom.modalWin);
      this.nextLevel();
    });

    this.dom.btnFailRetry.addEventListener('click', () => {
      sounds.playClick();
      this.closeModal(this.dom.modalFail);
      this.resetLevel();
    });

    this.dom.btnFailHint.addEventListener('click', () => {
      sounds.playClick();
      this.closeModal(this.dom.modalFail);
      this.triggerHint();
    });

    // Pointer / Touch drawing controls on canvas
    this.canvas.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    window.addEventListener('pointercancel', (e) => this.handlePointerUp(e));
  }

  updateSoundIcon() {
    this.dom.soundIcon.textContent = sounds.muted ? '🔇' : '🔊';
  }

  updateHintCount() {
    this.dom.hintCount.textContent = this.hintsLeft;
  }

  openModal(modal) {
    modal.classList.add('active');
  }

  closeModal(modal) {
    modal.classList.remove('active');
  }

  openLevelSelect() {
    this.renderLevelGrid();
    this.openModal(this.dom.modalLevelSelect);
  }

  renderLevelGrid() {
    this.dom.levelGrid.innerHTML = '';
    LEVELS.forEach((lvl, idx) => {
      const card = document.createElement('div');
      const isUnlocked = this.unlockedLevels.includes(lvl.id);
      const isCurrent = this.currentLevelIdx === idx;
      
      card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`;
      
      let starsHtml = '';
      if (isUnlocked) {
        const starCount = this.levelStars[lvl.id] || 0;
        starsHtml = `<div class="level-card-stars">${'⭐'.repeat(starCount)}${'☆'.repeat(3 - starCount)}</div>`;
      } else {
        starsHtml = '<div class="level-card-stars">🔒</div>';
      }

      card.innerHTML = `<span>${lvl.id}</span>${starsHtml}`;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          sounds.playClick();
          this.closeModal(this.dom.modalLevelSelect);
          this.closeModal(this.dom.modalMainMenu);
          this.loadLevel(idx);
        });
      }
      this.dom.levelGrid.appendChild(card);
    });
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.width = rect.width;
    this.height = rect.height;
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
  }

  // Convert 0-100 normalized coordinates to actual screen pixels
  toScreen(pos) {
    return {
      x: (pos.x / 100) * this.width,
      y: (pos.y / 100) * this.height
    };
  }

  // Convert screen pixels to 0-100 normalized coordinates
  toNorm(screenPos) {
    return {
      x: (screenPos.x / this.width) * 100,
      y: (screenPos.y / this.height) * 100
    };
  }

  loadLevel(idx) {
    this.currentLevelIdx = idx % LEVELS.length;
    // Deep clone level
    this.level = JSON.parse(JSON.stringify(LEVELS[this.currentLevelIdx]));
    this.dom.levelNum.textContent = this.level.id;
    this.resetLevel();
  }

  resetLevel() {
    this.state = 'DRAWING';
    this.kentPath = [];
    this.barbaraPath = [];
    this.isDrawing = false;
    this.drawingChar = null;
    this.showHint = false;
    this.crashBurst = null;
    this.particles = [];
    this.confetti = [];

    // Reset keys if any
    if (this.level.keys) {
      this.level.keys.forEach(k => k.collected = false);
    }
    if (this.level.blueDoor) {
      this.level.blueDoor.locked = LEVELS[this.currentLevelIdx].blueDoor.locked || false;
    }
    if (this.level.pinkDoor) {
      this.level.pinkDoor.locked = LEVELS[this.currentLevelIdx].pinkDoor.locked || false;
    }

    this.kentRunner = { t: 0, pos: { ...this.level.kent }, reached: false };
    this.barbaraRunner = { t: 0, pos: { ...this.level.barbara }, reached: false };

    this.dom.actionBar.classList.add('hidden');
    this.dom.instructionText.textContent = "Draw lines from Kent & Barbara to their doors!";
    this.closeModal(this.dom.modalWin);
    this.closeModal(this.dom.modalFail);
  }

  clearLines() {
    this.kentPath = [];
    this.barbaraPath = [];
    this.dom.actionBar.classList.add('hidden');
    this.dom.instructionText.textContent = "Draw lines from Kent & Barbara to their doors!";
  }

  triggerHint() {
    this.showHint = true;
    if (this.hintsLeft > 0) {
      this.hintsLeft--;
      localStorage.setItem('bk_hints', this.hintsLeft);
      this.updateHintCount();
    }
    this.dom.instructionText.textContent = "Follow the golden dashed guide paths!";
  }

  nextLevel() {
    if (this.currentLevelIdx < LEVELS.length - 1) {
      this.loadLevel(this.currentLevelIdx + 1);
    } else {
      this.loadLevel(0); // Loop back or game completed
    }
  }

  // ==========================================
  // POINTER DRAWING HANDLERS
  // ==========================================
  getEventPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  handlePointerDown(e) {
    if (this.state !== 'DRAWING') return;

    sounds.init();
    const sPos = this.getEventPos(e);
    const nPos = this.toNorm(sPos);

    const distKent = Math.hypot(nPos.x - this.level.kent.x, nPos.y - this.level.kent.y);
    const distBarb = Math.hypot(nPos.x - this.level.barbara.x, nPos.y - this.level.barbara.y);

    const touchRadius = 12; // Normalized radius

    if (distKent < touchRadius) {
      this.isDrawing = true;
      this.drawingChar = 'kent';
      this.kentPath = [{ ...this.level.kent }];
      sounds.playDraw();
      this.dom.instructionText.textContent = "Guide Kent to the Blue 🚹 Toilet!";
    } else if (distBarb < touchRadius) {
      this.isDrawing = true;
      this.drawingChar = 'barbara';
      this.barbaraPath = [{ ...this.level.barbara }];
      sounds.playDraw();
      this.dom.instructionText.textContent = "Guide Barbara to the Pink 🚺 Toilet!";
    }
  }

  handlePointerMove(e) {
    if (!this.isDrawing || this.state !== 'DRAWING') return;

    const sPos = this.getEventPos(e);
    const nPos = this.toNorm(sPos);

    // Keep within bounds
    nPos.x = Math.max(2, Math.min(98, nPos.x));
    nPos.y = Math.max(2, Math.min(98, nPos.y));

    const path = this.drawingChar === 'kent' ? this.kentPath : this.barbaraPath;
    const lastPoint = path[path.length - 1];

    if (!lastPoint) return;

    const dist = Math.hypot(nPos.x - lastPoint.x, nPos.y - lastPoint.y);
    if (dist > 1.5) {
      path.push(nPos);
      if (Math.random() < 0.3) sounds.playDraw();

      // Check if reached destination door while drawing
      const targetDoor = this.drawingChar === 'kent' ? this.level.blueDoor : this.level.pinkDoor;
      const distDoor = Math.hypot(nPos.x - targetDoor.x, nPos.y - targetDoor.y);
      if (distDoor < 8) {
        path.push({ ...targetDoor });
        this.isDrawing = false;
        sounds.playClick();
        this.checkBothPathsReady();
      }
    }
  }

  handlePointerUp(e) {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    const path = this.drawingChar === 'kent' ? this.kentPath : this.barbaraPath;
    const targetDoor = this.drawingChar === 'kent' ? this.level.blueDoor : this.level.pinkDoor;
    
    if (path.length > 0) {
      const last = path[path.length - 1];
      const distDoor = Math.hypot(last.x - targetDoor.x, last.y - targetDoor.y);
      if (distDoor < 12) {
        // Snap to door center
        path.push({ ...targetDoor });
      } else {
        // Did not reach door, clear incomplete line
        if (this.drawingChar === 'kent') this.kentPath = [];
        else this.barbaraPath = [];
      }
    }

    this.checkBothPathsReady();
    this.drawingChar = null;
  }

  checkBothPathsReady() {
    const kentReady = this.kentPath.length > 1;
    const barbReady = this.barbaraPath.length > 1;

    if (kentReady && barbReady) {
      this.dom.actionBar.classList.remove('hidden');
      this.dom.instructionText.textContent = "Both paths ready! Tap GO or watch them sprint!";
      // Auto run after small pause or player can tap GO
      setTimeout(() => {
        if (this.state === 'DRAWING' && this.kentPath.length > 1 && this.barbaraPath.length > 1) {
          this.startRunning();
        }
      }, 400);
    } else if (kentReady) {
      this.dom.instructionText.textContent = "Now draw Barbara's path to the Pink 🚺 door!";
    } else if (barbReady) {
      this.dom.instructionText.textContent = "Now draw Kent's path to the Blue 🚹 door!";
    }
  }

  startRunning() {
    if (this.state !== 'DRAWING') return;
    if (this.kentPath.length < 2 || this.barbaraPath.length < 2) return;

    this.state = 'RUNNING';
    this.dom.actionBar.classList.add('hidden');
    this.dom.instructionText.textContent = "Rushing to the toilet! Hold on tight!";

    // Prepare interpolated smooth path distances
    this.kentDistances = this.computePathDistances(this.kentPath);
    this.barbDistances = this.computePathDistances(this.barbaraPath);
    
    this.kentDistanceTravelled = 0;
    this.barbDistanceTravelled = 0;
    this.kentTotalLen = this.kentDistances.total;
    this.barbTotalLen = this.barbDistances.total;
  }

  computePathDistances(path) {
    const cumulative = [0];
    let total = 0;
    for (let i = 1; i < path.length; i++) {
      const d = Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y);
      total += d;
      cumulative.push(total);
    }
    return { cumulative, total };
  }

  getPointAlongPath(path, distInfo, currentDist) {
    if (currentDist >= distInfo.total) {
      return { pos: { ...path[path.length - 1] }, angle: 0, reached: true };
    }
    for (let i = 0; i < distInfo.cumulative.length - 1; i++) {
      if (currentDist >= distInfo.cumulative[i] && currentDist <= distInfo.cumulative[i + 1]) {
        const segLen = distInfo.cumulative[i + 1] - distInfo.cumulative[i];
        const ratio = segLen > 0 ? (currentDist - distInfo.cumulative[i]) / segLen : 0;
        const p1 = path[i];
        const p2 = path[i + 1];
        const x = p1.x + (p2.x - p1.x) * ratio;
        const y = p1.y + (p2.y - p1.y) * ratio;
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return { pos: { x, y }, angle, reached: false };
      }
    }
    return { pos: { ...path[0] }, angle: 0, reached: false };
  }

  // ==========================================
  // PHYSICS & UPDATE LOOP
  // ==========================================
  update(dt) {
    this.time += dt;

    // Update moving hazards (patrolling dogs)
    if (this.level && this.level.hazards) {
      this.level.hazards.forEach(h => {
        if (h.type === 'dog' && h.minX !== undefined) {
          h.x += h.speed * h.dir * (dt * 30);
          if (h.x >= h.maxX) {
            h.x = h.maxX;
            h.dir = -1;
          } else if (h.x <= h.minX) {
            h.x = h.minX;
            h.dir = 1;
          }
        }
      });
    }

    // Running Logic
    if (this.state === 'RUNNING') {
      const speed = this.runSpeed * (dt * 60);

      if (!this.kentRunner.reached) {
        this.kentDistanceTravelled += speed;
        const kData = this.getPointAlongPath(this.kentPath, this.kentDistances, this.kentDistanceTravelled);
        this.kentRunner.pos = kData.pos;
        this.kentRunner.angle = kData.angle;
        this.kentRunner.reached = kData.reached;
        if (Math.random() < 0.2) sounds.playStep();
      }

      if (!this.barbaraRunner.reached) {
        this.barbDistanceTravelled += speed;
        const bData = this.getPointAlongPath(this.barbaraPath, this.barbDistances, this.barbDistanceTravelled);
        this.barbaraRunner.pos = bData.pos;
        this.barbaraRunner.angle = bData.angle;
        this.barbaraRunner.reached = bData.reached;
      }

      // Check Key pickups
      if (this.level.keys) {
        this.level.keys.forEach(k => {
          if (!k.collected) {
            const dK = Math.hypot(this.kentRunner.pos.x - k.x, this.kentRunner.pos.y - k.y);
            const dB = Math.hypot(this.barbaraRunner.pos.x - k.x, this.barbaraRunner.pos.y - k.y);
            if (dK < 6 || dB < 6) {
              k.collected = true;
              sounds.playKey();
              // Unlock corresponding door
              if (this.level.blueDoor.keyId === k.id) this.level.blueDoor.locked = false;
              if (this.level.pinkDoor.keyId === k.id) this.level.pinkDoor.locked = false;
              this.spawnSparkles(k.x, k.y, '#facc15');
            }
          }
        });
      }

      // Check Collision Between Kent and Barbara
      if (!this.kentRunner.reached && !this.barbaraRunner.reached) {
        const charDist = Math.hypot(
          this.kentRunner.pos.x - this.barbaraRunner.pos.x,
          this.kentRunner.pos.y - this.barbaraRunner.pos.y
        );
        if (charDist < 7.0) { // Collision threshold
          this.triggerFail("OUCH! THEY CRASHED!", "Kent and Barbara collided into each other! Make one path curved or longer to adjust their timing!");
          return;
        }
      }

      // Check Collision with Walls
      const checkWallCollision = (pos) => {
        if (!this.level.walls) return false;
        for (let w of this.level.walls) {
          if (pos.x >= w.x - 3 && pos.x <= w.x + w.w + 3 &&
              pos.y >= w.y - 3 && pos.y <= w.y + w.h + 3) {
            return true;
          }
        }
        return false;
      };

      if (!this.kentRunner.reached && checkWallCollision(this.kentRunner.pos)) {
        this.triggerFail("BONK! WALL HIT!", "Kent ran straight into a wall! Draw around the obstacles!");
        return;
      }
      if (!this.barbaraRunner.reached && checkWallCollision(this.barbaraRunner.pos)) {
        this.triggerFail("BONK! WALL HIT!", "Barbara bumped into a wall! Draw around the obstacles!");
        return;
      }

      // Check Collision with Hazards
      if (this.level.hazards) {
        for (let h of this.level.hazards) {
          const dK = Math.hypot(this.kentRunner.pos.x - h.x, this.kentRunner.pos.y - h.y);
          const dB = Math.hypot(this.barbaraRunner.pos.x - h.x, this.barbaraRunner.pos.y - h.y);
          if ((!this.kentRunner.reached && dK < (h.r || 6)) || (!this.barbaraRunner.reached && dB < (h.r || 6))) {
            if (h.type === 'dog') {
              this.triggerFail("RUFF! BARKED AT!", "The guard dog caught you! Stay clear of the dog's patrol zone!");
            } else {
              this.triggerFail("EW! POOP TRAP!", "Slipped on a smelly trap! Guide them around the obstacles!");
            }
            return;
          }
        }
      }

      // Check Door Reach & Locked Door Check
      if (this.kentRunner.reached && this.level.blueDoor.locked) {
        this.triggerFail("DOOR IS LOCKED! 🔒", "The Blue Door was locked! Kent needed to grab the Golden Key first!");
        return;
      }
      if (this.barbaraRunner.reached && this.level.pinkDoor.locked) {
        this.triggerFail("DOOR IS LOCKED! 🔒", "The Pink Door was locked! Barbara needed to grab the Golden Key first!");
        return;
      }

      // Check Victory Condition
      if (this.kentRunner.reached && this.barbaraRunner.reached) {
        this.triggerWin();
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt * 1.5;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  triggerFail(title, desc) {
    this.state = 'FAIL';
    sounds.playCrash();
    
    // Spawn crash star burst
    const midX = (this.kentRunner.pos.x + this.barbaraRunner.pos.x) / 2;
    const midY = (this.kentRunner.pos.y + this.barbaraRunner.pos.y) / 2;
    this.crashBurst = { x: midX, y: midY, time: 0 };

    this.dom.failTitle.textContent = title;
    this.dom.failDesc.textContent = desc;

    setTimeout(() => {
      this.openModal(this.dom.modalFail);
    }, 600);
  }

  triggerWin() {
    this.state = 'WIN';
    sounds.playFlush();
    sounds.playVictory();

    // Spawn victory confetti
    this.spawnConfetti();

    // Unlock next level & calculate stars
    const currentId = this.level.id;
    if (!this.unlockedLevels.includes(currentId + 1) && currentId < LEVELS.length) {
      this.unlockedLevels.push(currentId + 1);
      localStorage.setItem('bk_unlocked_levels', JSON.stringify(this.unlockedLevels));
    }

    const stars = this.showHint ? 2 : 3;
    this.levelStars[currentId] = Math.max(this.levelStars[currentId] || 0, stars);
    localStorage.setItem('bk_stars', JSON.stringify(this.levelStars));

    this.dom.winStars.innerHTML = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const quotes = [
      '"Ahhhhh! Just in the nick of time!"',
      '"What a sweet relief! Toilet saved!"',
      '"Phew! No accidents today!"',
      '"Mission Flushed! Onto the next restroom!"'
    ];
    this.dom.winQuote.textContent = quotes[Math.floor(Math.random() * quotes.length)];

    setTimeout(() => {
      this.openModal(this.dom.modalWin);
    }, 700);
  }

  spawnSparkles(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color || '#facc15',
        size: 3 + Math.random() * 4,
        life: 1.0
      });
    }
  }

  spawnConfetti() {
    const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#34d399', '#a855f7'];
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: 50 + (Math.random() * 20 - 10),
        y: 20,
        vx: (Math.random() - 0.5) * 4,
        vy: -1 - Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 5,
        life: 2.0
      });
    }
  }

  // ==========================================
  // RENDER ENGINE
  // ==========================================
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw subtle grid / bathroom tile pattern
    this.drawBackgroundGrid();

    if (!this.level) return;

    // 2. Draw Hint Lines if active
    if (this.showHint) {
      this.drawHintPaths();
    }

    // 3. Draw Drawn Paths
    this.drawPath(this.kentPath, '#38bdf8', '#0284c7', 'kent');
    this.drawPath(this.barbaraPath, '#f43f5e', '#be123c', 'barbara');

    // 4. Draw Walls & Obstacles
    this.drawWalls();
    this.drawHazards();
    this.drawKeys();

    // 5. Draw Target Toilet Doors
    this.drawToiletDoor(this.level.blueDoor, 'male');
    this.drawToiletDoor(this.level.pinkDoor, 'female');

    // 6. Draw Characters
    if (this.state === 'RUNNING' || this.state === 'FAIL' || this.state === 'WIN') {
      if (!this.kentRunner.reached || this.state === 'WIN') {
        this.drawCharacterKent(this.kentRunner.pos, this.kentRunner.angle || 0, true);
      }
      if (!this.barbaraRunner.reached || this.state === 'WIN') {
        this.drawCharacterBarbara(this.barbaraRunner.pos, this.barbaraRunner.angle || 0, true);
      }
    } else {
      // Idle Urgent State
      this.drawCharacterKent(this.level.kent, 0, false);
      this.drawCharacterBarbara(this.level.barbara, 0, false);
    }

    // 7. Draw Crash Burst if fail
    if (this.crashBurst) {
      this.drawCrashBurst();
    }

    // 8. Draw Particles & Confetti
    this.drawParticles();
  }

  drawBackgroundGrid() {
    this.ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
    this.ctx.lineWidth = 1;
    const tileSize = 24;
    for (let x = 0; x < this.width; x += tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }

  drawHintPaths() {
    this.ctx.save();
    this.ctx.setLineDash([8, 8]);
    this.ctx.lineWidth = 5;

    // Kent Hint
    if (this.level.hintKent) {
      this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      this.ctx.beginPath();
      const p0 = this.toScreen(this.level.hintKent[0]);
      this.ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < this.level.hintKent.length; i++) {
        const p = this.toScreen(this.level.hintKent[i]);
        this.ctx.lineTo(p.x, p.y);
      }
      this.ctx.stroke();
    }

    // Barbara Hint
    if (this.level.hintBarbara) {
      this.ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
      this.ctx.beginPath();
      const p0 = this.toScreen(this.level.hintBarbara[0]);
      this.ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < this.level.hintBarbara.length; i++) {
        const p = this.toScreen(this.level.hintBarbara[i]);
        this.ctx.lineTo(p.x, p.y);
      }
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawPath(path, color, darkColor, type) {
    if (path.length < 2) return;

    this.ctx.save();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // Outer Shadow Glow
    this.ctx.lineWidth = 14;
    this.ctx.strokeStyle = darkColor;
    this.ctx.beginPath();
    const p0 = this.toScreen(path[0]);
    this.ctx.moveTo(p0.x, p0.y);
    for (let i = 1; i < path.length; i++) {
      const p = this.toScreen(path[i]);
      this.ctx.lineTo(p.x, p.y);
    }
    this.ctx.stroke();

    // Inner Vibrant Line
    this.ctx.lineWidth = 8;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();

    // Dotted water droplet effect along the path
    this.ctx.setLineDash([4, 16]);
    this.ctx.lineDashOffset = -this.time * 20;
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawWalls() {
    if (!this.level.walls) return;
    this.level.walls.forEach(w => {
      const p = this.toScreen({ x: w.x, y: w.y });
      const size = {
        w: (w.w / 100) * this.width,
        h: (w.h / 100) * this.height
      };

      this.ctx.save();
      // Drop shadow
      this.ctx.fillStyle = '#64748b';
      this.ctx.fillRect(p.x + 3, p.y + 4, size.w, size.h);

      // Wall Brick Body
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.strokeStyle = '#334155';
      this.ctx.lineWidth = 3;
      this.ctx.fillRect(p.x, p.y, size.w, size.h);
      this.ctx.strokeRect(p.x, p.y, size.w, size.h);

      // Diagonal cartoon stripes
      this.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      this.ctx.lineWidth = 2;
      for (let ox = -size.h; ox < size.w; ox += 14) {
        this.ctx.beginPath();
        this.ctx.moveTo(Math.max(p.x, p.x + ox), p.y);
        this.ctx.lineTo(Math.min(p.x + size.w, p.x + ox + size.h), p.y + size.h);
        this.ctx.stroke();
      }
      this.ctx.restore();
    });
  }

  drawHazards() {
    if (!this.level.hazards) return;
    this.level.hazards.forEach(h => {
      const p = this.toScreen(h);
      this.ctx.save();
      this.ctx.translate(p.x, p.y);

      if (h.type === 'dog') {
        // Guard Dog
        const dir = h.dir || 1;
        this.ctx.scale(dir, 1);

        // Body
        this.ctx.fillStyle = '#854d0e';
        this.ctx.strokeStyle = '#451a03';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Head & Ears
        this.ctx.beginPath();
        this.ctx.arc(10, -8, 10, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Angry Eyebrows & Eyes
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(12, -10, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(12, -10, 2, 2);

        // Dog Spiked Collar
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(3, -4, 4, 10);

        // Bark indicator
        this.ctx.font = 'bold 10px Arial';
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillText("RUFF!", -15, -16);
      } else if (h.type === 'poop') {
        // Funny Poop Trap
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText("💩", 0, 0);

        // Buzzing fly
        const flyAngle = this.time * 6;
        const fx = Math.cos(flyAngle) * 14;
        const fy = Math.sin(flyAngle) * 8 - 10;
        this.ctx.fillStyle = '#1e293b';
        this.ctx.beginPath();
        this.ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    });
  }

  drawKeys() {
    if (!this.level.keys) return;
    this.level.keys.forEach(k => {
      if (k.collected) return;
      const p = this.toScreen(k);
      this.ctx.save();
      this.ctx.translate(p.x, p.y);

      // Floating bounce
      const bob = Math.sin(this.time * 4) * 4;
      this.ctx.translate(0, bob);

      // Glow halo
      this.ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 16, 0, Math.PI * 2);
      this.ctx.fill();

      // Golden Key
      this.ctx.fillStyle = '#eab308';
      this.ctx.strokeStyle = '#78350f';
      this.ctx.lineWidth = 2;
      
      // Key head ring
      this.ctx.beginPath();
      this.ctx.arc(-4, 0, 7, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Key inner hole
      this.ctx.fillStyle = '#fef08a';
      this.ctx.beginPath();
      this.ctx.arc(-4, 0, 3, 0, Math.PI * 2);
      this.ctx.fill();

      // Key shaft & teeth
      this.ctx.fillStyle = '#eab308';
      this.ctx.fillRect(2, -2, 12, 4);
      this.ctx.strokeRect(2, -2, 12, 4);
      this.ctx.fillRect(10, 2, 3, 4);

      this.ctx.restore();
    });
  }

  drawToiletDoor(door, type) {
    const p = this.toScreen(door);
    const w = 46;
    const h = 64;

    this.ctx.save();
    this.ctx.translate(p.x - w / 2, p.y - h / 2);

    const isBlue = type === 'male';
    const mainColor = isBlue ? '#38bdf8' : '#f43f5e';
    const darkColor = isBlue ? '#0284c7' : '#be123c';

    // Door Frame Drop Shadow
    this.ctx.fillStyle = 'rgba(0,0,0,0.15)';
    this.ctx.fillRect(4, 4, w, h);

    // Door Body
    this.ctx.fillStyle = mainColor;
    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, w, h, 8);
    this.ctx.fill();
    this.ctx.stroke();

    // Door Inset Panels
    this.ctx.fillStyle = darkColor;
    this.ctx.beginPath();
    this.ctx.roundRect(6, 6, w - 12, h / 2 - 8, 4);
    this.ctx.roundRect(6, h / 2 + 2, w - 12, h / 2 - 8, 4);
    this.ctx.fill();

    // Golden Handle
    this.ctx.fillStyle = '#facc15';
    this.ctx.strokeStyle = '#854d0e';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(w - 10, h / 2, 4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Toilet Symbol Sign
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(isBlue ? '🚹' : '🚺', w / 2, h / 4 + 2);

    // Locked status badge
    if (door.locked) {
      this.ctx.font = '16px Arial';
      this.ctx.fillText('🔒', w / 2, h * 0.75);
    }

    this.ctx.restore();
  }

  // Draw Kent (Urgent boy, yellow shirt, spiky hair, blue jeans)
  drawCharacterKent(normPos, angle, isRunning) {
    const p = this.toScreen(normPos);
    this.ctx.save();
    this.ctx.translate(p.x, p.y);

    const wiggle = !isRunning ? Math.sin(this.time * 12) * 3 : 0;
    const runBob = isRunning ? Math.abs(Math.sin(this.time * 16)) * 4 : 0;
    this.ctx.translate(wiggle, -runBob);

    // Shadow
    this.ctx.fillStyle = 'rgba(0,0,0,0.18)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 18, 14, 5, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Legs
    this.ctx.strokeStyle = '#2563eb';
    this.ctx.lineWidth = 6;
    this.ctx.lineCap = 'round';
    if (isRunning) {
      const legPhase = Math.sin(this.time * 20);
      this.ctx.beginPath();
      this.ctx.moveTo(-4, 6);
      this.ctx.lineTo(-6 + legPhase * 8, 18);
      this.ctx.moveTo(4, 6);
      this.ctx.lineTo(6 - legPhase * 8, 18);
      this.ctx.stroke();
    } else {
      // Crossed Urgent Legs
      this.ctx.beginPath();
      this.ctx.moveTo(-5, 6);
      this.ctx.lineTo(3, 18);
      this.ctx.moveTo(5, 6);
      this.ctx.lineTo(-3, 18);
      this.ctx.stroke();
    }

    // Yellow T-Shirt Body
    this.ctx.fillStyle = '#eab308';
    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.roundRect(-10, -6, 20, 15, 4);
    this.ctx.fill();
    this.ctx.stroke();

    // Letter 'K' on shirt
    this.ctx.font = 'bold 8px Fredoka, Arial';
    this.ctx.fillStyle = '#1e293b';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("K", 0, 4);

    // Head
    this.ctx.fillStyle = '#fed7aa';
    this.ctx.beginPath();
    this.ctx.arc(0, -14, 11, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Blonde Spiky Hair
    this.ctx.fillStyle = '#facc15';
    this.ctx.beginPath();
    this.ctx.moveTo(-11, -16);
    this.ctx.lineTo(-7, -26);
    this.ctx.lineTo(-2, -22);
    this.ctx.lineTo(4, -27);
    this.ctx.lineTo(8, -20);
    this.ctx.lineTo(11, -14);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Urgent Eyes (squinted) & Ouch Mouth
    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(-6, -15);
    this.ctx.lineTo(-2, -13);
    this.ctx.moveTo(6, -15);
    this.ctx.lineTo(2, -13);
    this.ctx.stroke();

    // Mouth
    this.ctx.beginPath();
    this.ctx.arc(0, -9, 3, Math.PI, 0);
    this.ctx.stroke();

    // Sweat Drop if idle urgent
    if (!isRunning) {
      this.ctx.font = '12px Arial';
      this.ctx.fillText("💦", 10, -20);
    }

    this.ctx.restore();
  }

  // Draw Barbara (Urgent girl, pink sunglasses, blonde wavy hair, pink dress)
  drawCharacterBarbara(normPos, angle, isRunning) {
    const p = this.toScreen(normPos);
    this.ctx.save();
    this.ctx.translate(p.x, p.y);

    const wiggle = !isRunning ? -Math.sin(this.time * 12) * 3 : 0;
    const runBob = isRunning ? Math.abs(Math.sin(this.time * 16 + 1)) * 4 : 0;
    this.ctx.translate(wiggle, -runBob);

    // Shadow
    this.ctx.fillStyle = 'rgba(0,0,0,0.18)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 18, 14, 5, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Long Blonde Hair Backing
    this.ctx.fillStyle = '#fef08a';
    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.roundRect(-14, -22, 28, 26, 8);
    this.ctx.fill();
    this.ctx.stroke();

    // Legs
    this.ctx.strokeStyle = '#fed7aa';
    this.ctx.lineWidth = 5;
    this.ctx.lineCap = 'round';
    if (isRunning) {
      const legPhase = Math.sin(this.time * 20 + Math.PI);
      this.ctx.beginPath();
      this.ctx.moveTo(-4, 8);
      this.ctx.lineTo(-6 + legPhase * 8, 18);
      this.ctx.moveTo(4, 8);
      this.ctx.lineTo(6 - legPhase * 8, 18);
      this.ctx.stroke();
    } else {
      // Crossed Urgent Legs
      this.ctx.beginPath();
      this.ctx.moveTo(-4, 8);
      this.ctx.lineTo(2, 18);
      this.ctx.moveTo(4, 8);
      this.ctx.lineTo(-2, 18);
      this.ctx.stroke();
    }

    // Pink Outfit / Top
    this.ctx.fillStyle = '#f43f5e';
    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.roundRect(-9, -5, 18, 14, 4);
    this.ctx.fill();
    this.ctx.stroke();

    // Head
    this.ctx.fillStyle = '#fed7aa';
    this.ctx.beginPath();
    this.ctx.arc(0, -14, 10, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Pink Sunglasses on Head
    this.ctx.fillStyle = '#ec4899';
    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(-8, -23, 7, 5);
    this.ctx.fillRect(1, -23, 7, 5);
    this.ctx.strokeRect(-8, -23, 7, 5);
    this.ctx.strokeRect(1, -23, 7, 5);

    // Urgent Closed Eyes & Teeth Grit
    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(-5, -15);
    this.ctx.lineTo(-2, -13);
    this.ctx.moveTo(5, -15);
    this.ctx.lineTo(2, -13);
    this.ctx.stroke();

    // Mouth
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(-4, -9, 8, 3);
    this.ctx.strokeRect(-4, -9, 8, 3);

    // Sweat Drop if idle urgent
    if (!isRunning) {
      this.ctx.font = '12px Arial';
      this.ctx.fillText("💦", -14, -20);
    }

    this.ctx.restore();
  }

  drawCrashBurst() {
    const p = this.toScreen(this.crashBurst);
    this.ctx.save();
    this.ctx.translate(p.x, p.y);

    // Comic Comic POW starburst
    this.ctx.fillStyle = '#facc15';
    this.ctx.strokeStyle = '#ef4444';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    const spikes = 10;
    const outerR = 36;
    const innerR = 18;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (i * Math.PI) / spikes + this.time * 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Comic BOOM Text
    this.ctx.font = '900 16px Titan One, Impact, Arial';
    this.ctx.fillStyle = '#dc2626';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText("BONK!", 0, 0);

    // Dizzy spinning stars
    for (let s = 0; s < 3; s++) {
      const sa = this.time * 6 + (s * Math.PI * 2) / 3;
      const sx = Math.cos(sa) * 32;
      const sy = Math.sin(sa) * 20;
      this.ctx.font = '14px Arial';
      this.ctx.fillText("⭐", sx, sy);
    }

    this.ctx.restore();
  }

  drawParticles() {
    this.particles.forEach(p => {
      const screenPos = this.toScreen(p);
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(screenPos.x, screenPos.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  // ==========================================
  // MAIN ANIMATION LOOP
  // ==========================================
  startLoop() {
    const loop = (timestamp) => {
      if (!this.lastFrame) this.lastFrame = timestamp;
      const dt = Math.min(0.1, (timestamp - this.lastFrame) / 1000);
      this.lastFrame = timestamp;

      this.update(dt);
      this.draw();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', () => {
  window.toiletGame = new ToiletRushGame();
});
