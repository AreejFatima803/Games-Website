/* =========================================================
   WATER SORT PUZZLE - CORE ENGINE & GAME LOGIC
   ========================================================= */

// Color Palette with 24 vibrant, distinct liquid tones
const PALETTE = [
  { name: 'Red', hex: '#ff4757' },
  { name: 'SkyBlue', hex: '#00d2d3' },
  { name: 'Yellow', hex: '#ffd32a' },
  { name: 'Green', hex: '#2ed573' },
  { name: 'Purple', hex: '#8854d0' },
  { name: 'Orange', hex: '#ff793f' },
  { name: 'Pink', hex: '#ff9ff3' },
  { name: 'RoyalBlue', hex: '#3867d6' },
  { name: 'LimeGreen', hex: '#a3cb38' },
  { name: 'Coral', hex: '#ff6b6b' },
  { name: 'ElectricMint', hex: '#12cbc4' },
  { name: 'Gold', hex: '#f39c12' },
  { name: 'Lavender', hex: '#9980FA' },
  { name: 'Magenta', hex: '#ED4C67' },
  { name: 'Teal', hex: '#009432' },
  { name: 'Indigo', hex: '#5758BB' },
  { name: 'Tangerine', hex: '#EE5A24' },
  { name: 'Rose', hex: '#FDA7DF' },
  { name: 'Cobalt', hex: '#0652DD' },
  { name: 'Midnight', hex: '#1B1464' },
  { name: 'DarkCyan', hex: '#006266' },
  { name: 'Scarlet', hex: '#EA2027' },
  { name: 'Turquoise', hex: '#1289A7' },
  { name: 'Olive', hex: '#C4E538' }
];

// Sound Synthesizer using Web Audio API
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
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

  playSelect() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playPour() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    // Water bubble gurgle sound
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const startTime = now + i * 0.09;
      const baseFreq = 400 + Math.random() * 250;
      osc.frequency.setValueAtTime(baseFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 180, startTime + 0.08);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.09);
    }
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playComplete() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    // Bottle solved chime
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const time = now + idx * 0.07;
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.35);
    });
  }

  playWin() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const time = now + i * 0.1;
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.6);
    });
  }
}

// Confetti Particle System
class ConfettiEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    this.particles = [];
    const colors = ['#ff4757', '#00d2d3', '#ffd32a', '#2ed573', '#8854d0', '#ff793f', '#ff9ff3'];
    for (let i = 0; i < 140; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: this.canvas.height * 0.45 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18 - 4,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.38,
        drag: 0.96,
        opacity: 1
      });
    }

    if (!this.animId) {
      this.animate();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let active = false;

    this.particles.forEach(p => {
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rSpeed;
      if (p.y > this.canvas.height * 0.6) {
        p.opacity -= 0.015;
      }

      if (p.opacity > 0) {
        active = true;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        this.ctx.restore();
      }
    });

    if (active) {
      this.animId = requestAnimationFrame(() => this.animate());
    } else {
      this.animId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// Background Floating Ambient Bubbles
class BackgroundAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.bubbles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initBubbles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initBubbles() {
    this.bubbles = [];
    for (let i = 0; i < 22; i++) {
      this.bubbles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 16 + 6,
        speed: Math.random() * 0.45 + 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.bubbles.forEach(b => {
      b.y -= b.speed;
      b.wobble += b.wobbleSpeed;
      b.x += Math.sin(b.wobble) * 0.3;

      if (b.y < -30) {
        b.y = this.canvas.height + 30;
        b.x = Math.random() * this.canvas.width;
      }

      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      this.ctx.fill();
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
    });

    requestAnimationFrame(() => this.animate());
  }
}

/* =========================================================
   GAME CONTROLLER CLASS
   ========================================================= */

class WaterSortGame {
  constructor() {
    this.maxTotalLevels = 8; // Exactly 8 levels total
    this.currentLevel = 1;
    this.maxUnlockedLevel = 1;
    this.capacity = 5; // Standard 5 units per bottle (20% per unit)
    this.bottles = []; // Array of arrays: e.g. [['#ff4757', '#00d2d3'], ...]
    this.completedBottles = new Set();
    this.selectedBottleIdx = null;
    this.isAnimating = false;
    this.moveHistory = [];
    this.movesCount = 0;
    this.sound = new SoundManager();
    this.confetti = new ConfettiEngine(document.getElementById('confetti-canvas'));
    this.bg = new BackgroundAnimation(document.getElementById('bg-canvas'));

    // DOM Elements
    this.levelTitleEl = document.getElementById('level-title');
    this.movesCountEl = document.getElementById('moves-count');
    this.bottlesCountEl = document.getElementById('bottles-count');
    this.bottlesContainerEl = document.getElementById('bottles-container');
    this.streamSvgEl = document.getElementById('stream-layer');
    this.starsBarEl = document.getElementById('stars-bar');
    this.winModalEl = document.getElementById('win-modal');
    this.levelsModalEl = document.getElementById('levels-modal');
    this.btnUndoEl = document.getElementById('btn-undo');
    this.undoCountBadge = document.getElementById('undo-count');
    this.btnSoundEl = document.getElementById('btn-sound');
    this.btnHomeEl = document.getElementById('btn-home');
    this.startScreenEl = document.getElementById('start-screen');
    this.btnPlayGameEl = document.getElementById('btn-play-game');

    this.loadProgress();
    this.bindEvents();
    this.startLevel(this.currentLevel);
  }

  loadProgress() {
    const savedLevel = localStorage.getItem('watersort_level');
    if (savedLevel) {
      this.currentLevel = Math.min(this.maxTotalLevels, parseInt(savedLevel, 10) || 1);
      this.maxUnlockedLevel = Math.min(this.maxTotalLevels, Math.max(this.currentLevel, parseInt(localStorage.getItem('watersort_max_level') || '1', 10)));
    }
  }

  saveProgress() {
    localStorage.setItem('watersort_level', this.currentLevel);
    this.maxUnlockedLevel = Math.min(this.maxTotalLevels, Math.max(this.maxUnlockedLevel, this.currentLevel));
    localStorage.setItem('watersort_max_level', this.maxUnlockedLevel);
  }

  bindEvents() {
    // Start Screen Play Button (Always start from Level 1)
    if (this.btnPlayGameEl) {
      this.btnPlayGameEl.addEventListener('click', () => {
        this.sound.init();
        this.sound.playSelect();
        if (this.startScreenEl) {
          this.startScreenEl.classList.remove('active');
        }
        this.startLevel(1);
      });
    }

    // Home / Menu Button to open Start Screen
    if (this.btnHomeEl) {
      this.btnHomeEl.addEventListener('click', () => {
        this.sound.playSelect();
        if (this.startScreenEl) {
          this.startScreenEl.classList.add('active');
        }
      });
    }

    // Sound Toggle
    this.btnSoundEl.addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      this.btnSoundEl.innerHTML = this.sound.enabled 
        ? '<i class="fa-solid fa-volume-high"></i>' 
        : '<i class="fa-solid fa-volume-xmark"></i>';
      this.btnSoundEl.classList.toggle('muted', !this.sound.enabled);
    });

    // Undo Move
    this.btnUndoEl.addEventListener('click', () => this.undoMove());

    // Restart Level
    document.getElementById('btn-restart').addEventListener('click', () => {
      this.startLevel(this.currentLevel);
    });

    // Levels Selector
    document.getElementById('btn-levels').addEventListener('click', () => {
      this.openLevelsModal();
    });

    document.getElementById('btn-close-levels').addEventListener('click', () => {
      this.levelsModalEl.classList.remove('show');
    });

    // Win Modal actions
    document.getElementById('btn-win-next').addEventListener('click', () => {
      this.winModalEl.classList.remove('show');
      if (this.currentLevel >= this.maxTotalLevels) {
        this.startLevel(1);
      } else {
        this.startLevel(this.currentLevel + 1);
      }
    });

    document.getElementById('btn-win-replay').addEventListener('click', () => {
      this.winModalEl.classList.remove('show');
      this.startLevel(this.currentLevel);
    });
  }

  /**
   * 8 LEVELS CONFIGURATION:
   * Level 1 = 2 tubes (1 filled with 20%, 1 filled with 80% same color -> solve in 1 move)
   * Level 2 = 4 tubes (2 filled, 2 empty)
   * Level 3 = 6 tubes (4 filled, 2 empty)
   * Level 4 = 8 tubes (6 filled, 2 empty)
   * Level 5 = 10 tubes (8 filled, 2 empty)
   * Level 6 = 12 tubes (10 filled, 2 empty)
   * Level 7 = 12 tubes (10 filled, 2 empty, advanced mix)
   * Level 8 = 12 tubes (10 filled, 2 empty, Grand Finale level!)
   */
  startLevel(lvl) {
    this.currentLevel = Math.min(this.maxTotalLevels, Math.max(1, lvl));
    this.saveProgress();
    this.isAnimating = false;
    this.selectedBottleIdx = null;
    this.moveHistory = [];
    this.movesCount = 0;
    this.completedBottles.clear();

    this.levelTitleEl.textContent = `Level ${this.currentLevel}`;
    this.movesCountEl.textContent = '0';
    this.updateStarsUI(3);
    this.updateUndoBadge();

    // Tubes per level
    let totalBottles;
    if (this.currentLevel === 1) totalBottles = 2;
    else if (this.currentLevel === 2) totalBottles = 4;
    else if (this.currentLevel === 3) totalBottles = 6;
    else if (this.currentLevel === 4) totalBottles = 8;
    else if (this.currentLevel === 5) totalBottles = 10;
    else totalBottles = 12; // Level 6, 7, 8 capped at 12 tubes (2 rows of 6)

    this.bottlesCountEl.textContent = totalBottles;

    let filledCount, emptyCount;
    if (this.currentLevel === 1) {
      filledCount = 1;
      emptyCount = 1;
    } else {
      emptyCount = 2;
      filledCount = totalBottles - emptyCount;
    }

    this.generateSolvableLevel(filledCount, emptyCount);
    this.render();
  }

  generateSolvableLevel(filledCount, emptyCount) {
    // Pick unique colors from palette
    const colors = [];
    for (let i = 0; i < filledCount; i++) {
      colors.push(PALETTE[i % PALETTE.length].hex);
    }

    // Level 1: 1 tube with 20% (1 segment), 1 tube with 80% (4 segments)
    if (this.currentLevel === 1) {
      this.bottles = [
        [colors[0]],
        [colors[0], colors[0], colors[0], colors[0]]
      ];
      return;
    }

    // Level 2: 4 tubes total (2 colors mixed across 2 tubes + 2 empty buffer tubes)
    if (this.currentLevel === 2) {
      const c1 = colors[0];
      const c2 = colors[1];
      this.bottles = [
        [c1, c2, c1, c2, c1],
        [c2, c1, c2, c1, c2],
        [],
        []
      ];
      return;
    }

    // High Level Generator:
    // Attempt random balanced shuffle and verify with BFS solver
    let foundSolvable = false;
    for (let attempt = 0; attempt < 60; attempt++) {
      const allUnits = [];
      colors.forEach(c => {
        for (let i = 0; i < this.capacity; i++) allUnits.push(c);
      });

      // Fisher-Yates shuffle
      for (let i = allUnits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allUnits[i], allUnits[j]] = [allUnits[j], allUnits[i]];
      }

      const testBottles = [];
      for (let i = 0; i < filledCount; i++) {
        testBottles.push(allUnits.slice(i * this.capacity, (i + 1) * this.capacity));
      }
      for (let i = 0; i < emptyCount; i++) {
        testBottles.push([]);
      }

      // Check that no bottle is already 100% solved at start
      const hasPreSolved = testBottles.some(b => b.length === this.capacity && b.every(c => c === b[0]));
      if (hasPreSolved) continue;

      // Verify solvability
      if (this.checkPuzzleSolvability(testBottles)) {
        this.bottles = testBottles;
        foundSolvable = true;
        break;
      }
    }

    // Fallback guaranteed reverse-scramble from solved state if BFS search timed out
    if (!foundSolvable) {
      let solvedState = [];
      for (let i = 0; i < filledCount; i++) {
        solvedState.push(new Array(this.capacity).fill(colors[i]));
      }
      for (let i = 0; i < emptyCount; i++) {
        solvedState.push([]);
      }

      const scrambleSteps = Math.min(20 + this.currentLevel * 8, 70);
      let state = solvedState.map(b => [...b]);
      let lastSource = -1;
      let lastTarget = -1;

      for (let step = 0; step < scrambleSteps; step++) {
        const nonEmpties = state.map((b, idx) => b.length > 0 ? idx : -1).filter(idx => idx !== -1);
        if (nonEmpties.length === 0) break;
        const fromIdx = nonEmpties[Math.floor(Math.random() * nonEmpties.length)];

        const validTargets = state.map((b, idx) => (idx !== fromIdx && b.length < this.capacity) ? idx : -1)
          .filter(idx => idx !== -1 && !(idx === lastSource && fromIdx === lastTarget));
        if (validTargets.length === 0) continue;

        const toIdx = validTargets[Math.floor(Math.random() * validTargets.length)];
        const unit = state[fromIdx].pop();
        state[toIdx].push(unit);
        lastSource = fromIdx;
        lastTarget = toIdx;
      }
      this.bottles = state;
    }
  }

  // Fast BFS Solvability Verifier
  checkPuzzleSolvability(initialBottles) {
    const serialize = (state) => state.map(b => b.join(',')).sort().join('|');
    const isSolved = (state) => state.every(b => b.length === 0 || (b.length === this.capacity && b.every(c => c === b[0])));

    if (isSolved(initialBottles)) return false; // puzzle shouldn't be already solved

    const queue = [initialBottles];
    const visited = new Set([serialize(initialBottles)]);
    let iterations = 0;
    const maxIterations = 2400;

    while (queue.length > 0 && iterations < maxIterations) {
      iterations++;
      const current = queue.shift();

      for (let i = 0; i < current.length; i++) {
        if (current[i].length === 0) continue;
        const srcColor = current[i][current[i].length - 1];

        // If bottle is already complete and uniform, don't move from it
        if (current[i].length === this.capacity && current[i].every(c => c === srcColor)) continue;

        for (let j = 0; j < current.length; j++) {
          if (i === j) continue;
          if (current[j].length >= this.capacity) continue;

          // If target is empty OR top matches
          if (current[j].length === 0 || current[j][current[j].length - 1] === srcColor) {
            // Avoid moving from pure bottle into empty bottle
            if (current[j].length === 0 && current[i].every(c => c === srcColor)) continue;

            const next = current.map(b => [...b]);
            while (next[i].length > 0 && next[i][next[i].length - 1] === srcColor && next[j].length < this.capacity) {
              next[j].push(next[i].pop());
            }

            if (isSolved(next)) return true;

            const key = serialize(next);
            if (!visited.has(key)) {
              visited.add(key);
              queue.push(next);
            }
          }
        }
      }
    }
    return false;
  }

  render() {
    this.bottlesContainerEl.innerHTML = '';

    const count = this.bottles.length;
    const wrapperEl = document.querySelector('.game-wrapper');
    if (wrapperEl) wrapperEl.style.maxWidth = '';

    this.bottlesContainerEl.style.maxWidth = '100%';

    if (count <= 2) {
      this.bottlesContainerEl.style.gridTemplateColumns = 'repeat(2, 1fr)';
      document.documentElement.style.setProperty('--bottle-width', '56px');
      document.documentElement.style.setProperty('--bottle-height', '145px');
      document.documentElement.style.setProperty('--bottle-gap-y', '20px');
    } else if (count <= 4) {
      this.bottlesContainerEl.style.gridTemplateColumns = 'repeat(4, 1fr)';
      document.documentElement.style.setProperty('--bottle-width', '52px');
      document.documentElement.style.setProperty('--bottle-height', '145px');
      document.documentElement.style.setProperty('--bottle-gap-y', '20px');
    } else if (count <= 6) {
      // 1 row of 6 tubes
      this.bottlesContainerEl.style.gridTemplateColumns = 'repeat(6, 1fr)';
      document.documentElement.style.setProperty('--bottle-width', '48px');
      document.documentElement.style.setProperty('--bottle-height', '140px');
      document.documentElement.style.setProperty('--bottle-gap-y', '20px');
    } else if (count <= 12) {
      // 2 rows of 6 tubes
      this.bottlesContainerEl.style.gridTemplateColumns = 'repeat(6, 1fr)';
      document.documentElement.style.setProperty('--bottle-width', '44px');
      document.documentElement.style.setProperty('--bottle-height', '110px');
      document.documentElement.style.setProperty('--bottle-gap-y', '16px');
    } else if (count <= 18) {
      // 3 rows of 6 tubes
      this.bottlesContainerEl.style.gridTemplateColumns = 'repeat(6, 1fr)';
      document.documentElement.style.setProperty('--bottle-width', '38px');
      document.documentElement.style.setProperty('--bottle-height', '85px');
      document.documentElement.style.setProperty('--bottle-gap-y', '12px');
    } else {
      // 4+ rows of 6 tubes
      this.bottlesContainerEl.style.gridTemplateColumns = 'repeat(6, 1fr)';
      document.documentElement.style.setProperty('--bottle-width', '32px');
      document.documentElement.style.setProperty('--bottle-height', '70px');
      document.documentElement.style.setProperty('--bottle-gap-y', '8px');
    }

    this.bottles.forEach((bottle, idx) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'bottle-wrapper';
      wrapper.id = `bottle-${idx}`;
      wrapper.dataset.index = idx;

      if (this.selectedBottleIdx === idx) {
        wrapper.classList.add('selected');
      }

      if (this.isBottleComplete(idx)) {
        wrapper.classList.add('completed');
        this.completedBottles.add(idx);
      }

      // Completed checkmark
      const completeIndicator = document.createElement('div');
      completeIndicator.className = 'bottle-completed-indicator';
      completeIndicator.innerHTML = '<i class="fa-solid fa-check"></i>';
      wrapper.appendChild(completeIndicator);

      // Glass Body
      const glass = document.createElement('div');
      glass.className = 'bottle-glass';

      // Water Segments (stacked from bottom)
      const currentCapacity = Math.max(this.capacity, bottle.length);
      const segmentHeightPercent = (100 / currentCapacity);

      bottle.forEach(color => {
        const segment = document.createElement('div');
        segment.className = 'water-segment';
        segment.style.height = `${segmentHeightPercent}%`;
        segment.style.backgroundColor = color;

        // Add subtle bubble
        const bubble = document.createElement('div');
        bubble.className = 'water-bubble';
        bubble.style.left = `${Math.random() * 60 + 20}%`;
        bubble.style.width = `${Math.random() * 4 + 3}px`;
        bubble.style.height = bubble.style.width;
        bubble.style.animationDelay = `${Math.random() * 2}s`;
        segment.appendChild(bubble);

        glass.appendChild(segment);
      });

      // Glass Highlights & Rim
      const rim = document.createElement('div');
      rim.className = 'bottle-rim';
      wrapper.appendChild(rim);

      const hlLeft = document.createElement('div');
      hlLeft.className = 'bottle-highlight-left';
      wrapper.appendChild(hlLeft);

      const hlRight = document.createElement('div');
      hlRight.className = 'bottle-highlight-right';
      wrapper.appendChild(hlRight);

      wrapper.appendChild(glass);

      // Click Event
      wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleBottleClick(idx);
      });

      this.bottlesContainerEl.appendChild(wrapper);
    });
  }

  handleBottleClick(idx) {
    if (this.isAnimating) return;

    // If nothing selected
    if (this.selectedBottleIdx === null) {
      // Can only select non-empty bottles
      if (this.bottles[idx].length === 0) {
        this.shakeBottle(idx);
        return;
      }
      // If already complete, no need to pour from it
      if (this.isBottleComplete(idx)) {
        this.shakeBottle(idx);
        return;
      }
      this.selectedBottleIdx = idx;
      this.sound.playSelect();
      this.updateSelectionUI();
      return;
    }

    // If tapping the already selected bottle -> Deselect
    if (this.selectedBottleIdx === idx) {
      this.selectedBottleIdx = null;
      this.sound.playSelect();
      this.updateSelectionUI();
      return;
    }

    // Target bottle selected -> Try to Pour
    const sourceIdx = this.selectedBottleIdx;
    const targetIdx = idx;

    if (this.canPour(sourceIdx, targetIdx)) {
      this.executePour(sourceIdx, targetIdx);
    } else {
      // If target is invalid, shake target
      this.sound.playError();
      this.shakeBottle(targetIdx);
      this.selectedBottleIdx = null;
      this.updateSelectionUI();
    }
  }

  canPour(sourceIdx, targetIdx) {
    const source = this.bottles[sourceIdx];
    const target = this.bottles[targetIdx];

    if (!source || source.length === 0) return false;
    if (target.length >= this.capacity) return false;

    // Target is empty -> Always valid
    if (target.length === 0) return true;

    // Target top color must match source top color
    const sourceTop = source[source.length - 1];
    const targetTop = target[target.length - 1];

    return sourceTop === targetTop;
  }

  async executePour(sourceIdx, targetIdx) {
    this.isAnimating = true;
    this.selectedBottleIdx = null;
    this.updateSelectionUI();

    // Save snapshot for Undo
    this.moveHistory.push(JSON.parse(JSON.stringify(this.bottles)));
    this.updateUndoBadge();

    const source = this.bottles[sourceIdx];
    const target = this.bottles[targetIdx];
    const pourColor = source[source.length - 1];

    // Determine how many matching units can pour
    let unitsToPour = 0;
    for (let i = source.length - 1; i >= 0; i--) {
      if (source[i] === pourColor && (target.length + unitsToPour) < this.capacity) {
        unitsToPour++;
      } else {
        break;
      }
    }

    // 1. Calculate positions for tilt animation
    const srcEl = document.getElementById(`bottle-${sourceIdx}`);
    const tgtEl = document.getElementById(`bottle-${targetIdx}`);

    const srcRect = srcEl.getBoundingClientRect();
    const tgtRect = tgtEl.getBoundingClientRect();

    // Position source bottle above target bottle
    const isTargetOnRight = tgtRect.left > srcRect.left;
    const deltaX = (tgtRect.left - srcRect.left) + (isTargetOnRight ? -18 : 18);
    const deltaY = (tgtRect.top - srcRect.top) - (srcRect.height * 0.58);
    const rotateAngle = isTargetOnRight ? 62 : -62;

    // Animate source bottle flying & tilting
    srcEl.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), z-index 0s';
    srcEl.style.zIndex = '50';
    srcEl.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotateAngle}deg)`;

    // Sound
    this.sound.playPour();

    // Wait for tilt position
    await new Promise(r => setTimeout(r, 380));

    // 2. Draw animated pouring stream
    this.drawPourStream(srcEl, tgtEl, pourColor, isTargetOnRight);

    // 3. Liquid transfer animation over time
    for (let u = 0; u < unitsToPour; u++) {
      source.pop();
      target.push(pourColor);
      this.render(); // Keep liquid heights accurate
      // Re-apply tilt transform to source element since render re-creates DOM
      const currentSrcEl = document.getElementById(`bottle-${sourceIdx}`);
      if (currentSrcEl) {
        currentSrcEl.style.transition = 'none';
        currentSrcEl.style.zIndex = '50';
        currentSrcEl.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotateAngle}deg)`;
      }
      await new Promise(r => setTimeout(r, 220));
    }

    // 4. Clear pouring stream
    this.clearPourStream();

    // 5. Return source bottle to position
    const finalSrcEl = document.getElementById(`bottle-${sourceIdx}`);
    if (finalSrcEl) {
      finalSrcEl.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
      finalSrcEl.style.transform = 'translate(0, 0) rotate(0deg)';
      finalSrcEl.style.zIndex = '10';
    }

    await new Promise(r => setTimeout(r, 350));

    this.movesCount++;
    this.movesCountEl.textContent = this.movesCount;
    this.updateStarsUI();

    // Check if target bottle was newly completed
    if (this.isBottleComplete(targetIdx) && !this.completedBottles.has(targetIdx)) {
      this.completedBottles.add(targetIdx);
      this.sound.playComplete();
      const targetWrapper = document.getElementById(`bottle-${targetIdx}`);
      if (targetWrapper) targetWrapper.classList.add('complete-bounce');
    }

    this.render();
    this.isAnimating = false;

    // Check for Level Win
    this.checkWinCondition();
  }

  drawPourStream(srcEl, tgtEl, color, isTargetOnRight) {
    const srcRect = srcEl.getBoundingClientRect();
    const tgtRect = tgtEl.getBoundingClientRect();
    const containerRect = this.bottlesContainerEl.getBoundingClientRect();

    // Lip of tilted source bottle
    const startX = (isTargetOnRight ? srcRect.right - 8 : srcRect.left + 8) - containerRect.left;
    const startY = (srcRect.top + srcRect.height * 0.32) - containerRect.top;

    // Neck of target bottle
    const targetX = (tgtRect.left + tgtRect.width / 2) - containerRect.left;
    const targetY = (tgtRect.top + 6) - containerRect.top;

    this.streamSvgEl.innerHTML = `
      <defs>
        <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="${color}" stop-opacity="0.75" />
        </linearGradient>
      </defs>
      <path d="M ${startX} ${startY} Q ${(startX + targetX) / 2} ${targetY - 24} ${targetX} ${targetY}" 
            stroke="url(#streamGrad)" 
            stroke-width="6" 
            stroke-linecap="round" 
            fill="none" />
    `;
  }

  clearPourStream() {
    this.streamSvgEl.innerHTML = '';
  }

  shakeBottle(idx) {
    const el = document.getElementById(`bottle-${idx}`);
    if (el) {
      el.classList.add('error-shake');
      setTimeout(() => el.classList.remove('error-shake'), 400);
    }
  }

  updateSelectionUI() {
    document.querySelectorAll('.bottle-wrapper').forEach((el, idx) => {
      if (idx === this.selectedBottleIdx) {
        el.classList.add('selected');
      } else {
        el.classList.remove('selected');
      }
    });
  }

  isBottleComplete(idx) {
    const bottle = this.bottles[idx];
    if (!bottle || bottle.length !== this.capacity) return false;
    const firstColor = bottle[0];
    return bottle.every(c => c === firstColor);
  }

  checkWinCondition() {
    // Win if every bottle is either completely empty OR full with uniform color
    const allSorted = this.bottles.every(b => {
      if (b.length === 0) return true;
      if (b.length === this.capacity && b.every(c => c === b[0])) return true;
      return false;
    });

    if (allSorted) {
      setTimeout(() => this.triggerWin(), 400);
    }
  }

  triggerWin() {
    this.sound.playWin();
    this.confetti.start();

    // Populate Win Modal
    document.getElementById('win-level-num').textContent = this.currentLevel;
    document.getElementById('win-moves-num').textContent = this.movesCount;

    const nextBtn = document.getElementById('btn-win-next');
    const bannerTitle = document.querySelector('.win-banner h2');

    if (this.currentLevel >= this.maxTotalLevels) {
      if (bannerTitle) bannerTitle.textContent = 'All 8 Levels Won! 🏆';
      if (nextBtn) nextBtn.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Play Again';
    } else {
      if (bannerTitle) bannerTitle.textContent = 'Level Completed!';
      if (nextBtn) nextBtn.innerHTML = 'Next Level <i class="fa-solid fa-arrow-right"></i>';
    }

    this.winModalEl.classList.add('show');
  }

  undoMove() {
    if (this.isAnimating || this.moveHistory.length === 0) return;
    this.bottles = this.moveHistory.pop();
    this.movesCount++;
    this.movesCountEl.textContent = this.movesCount;
    this.selectedBottleIdx = null;
    this.updateUndoBadge();
    this.sound.playSelect();
    this.render();
  }

  updateUndoBadge() {
    const remaining = this.moveHistory.length;
    this.undoCountBadge.textContent = remaining;
    this.btnUndoEl.disabled = (remaining === 0);
  }

  updateStarsUI(overrideStars = null) {
    let stars = 3;
    if (overrideStars !== null) {
      stars = overrideStars;
    } else {
      // Moves threshold
      const idealMoves = this.currentLevel * 3 + 2;
      if (this.movesCount > idealMoves + 6) stars = 1;
      else if (this.movesCount > idealMoves + 3) stars = 2;
      else stars = 3;
    }

    const starEls = this.starsBarEl.querySelectorAll('.star');
    starEls.forEach((el, idx) => {
      if (idx < stars) el.classList.add('active');
      else el.classList.remove('active');
    });
  }

  openLevelsModal() {
    const grid = document.getElementById('levels-grid');
    grid.innerHTML = '';

    for (let i = 1; i <= this.maxTotalLevels; i++) {
      const card = document.createElement('div');
      card.className = 'level-card';
      if (i === this.currentLevel) card.classList.add('current');
      if (i > this.maxUnlockedLevel) card.classList.add('locked');

      card.innerHTML = `
        <div class="lvl-num">Level ${i}</div>
        <div class="lvl-stars">${i <= this.maxUnlockedLevel ? '★★★' : '<i class="fa-solid fa-lock"></i>'}</div>
      `;

      if (i <= this.maxUnlockedLevel) {
        card.addEventListener('click', () => {
          this.levelsModalEl.classList.remove('show');
          this.startLevel(i);
        });
      }

      grid.appendChild(card);
    }

    this.levelsModalEl.classList.add('show');
  }
}

// Start Game on Page Load
document.addEventListener('DOMContentLoaded', () => {
  window.game = new WaterSortGame();
});
