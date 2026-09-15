/* ==========================================================================
   WORD SEARCH - CORE GAME CONTROLLER (1:1 SCREENSHOT MATCH)
   ========================================================================== */

// --- Audio Synthesizer (Juicy ASMR Game SFX & Chill Ambient) ---
class SoundController {
  constructor() {
    this.enabled = true;
    this.ctx = null;
    this.bgmRunning = false;
    this.bgmTimer = null;
    this.bgmChordIndex = 0;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startBgm() {
    if (!this.enabled || this.bgmRunning) return;
    this.initContext();
    if (!this.ctx) return;
    this.bgmRunning = true;
    this.playNextChillPad();
  }

  stopBgm() {
    this.bgmRunning = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // Slow, warm, relaxing ambient pad (Chill Coffee Shop / Lofi Vibe, NO ringtone!)
  playNextChillPad() {
    if (!this.bgmRunning || !this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    // Very slow, dreamy jazz/lofi chords (Cmaj9, Am9, Fmaj9, G13)
    const chords = [
      [130.81, 261.63, 329.63, 392.00, 493.88], // Cmaj9
      [110.00, 220.00, 261.63, 329.63, 392.00], // Am9
      [87.31, 174.61, 220.00, 261.63, 329.63],  // Fmaj9
      [98.00, 196.00, 246.94, 293.66, 349.23]   // G9
    ];

    const chord = chords[this.bgmChordIndex % chords.length];
    this.bgmChordIndex = (this.bgmChordIndex + 1) % chords.length;

    const duration = 6.0; // Changes very slowly every 6 seconds
    const now = this.ctx.currentTime;

    chord.forEach((freq, i) => {
      try {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 2.0); // Gentle 2s fade in
        gain.gain.linearRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      } catch (e) {}
    });

    this.bgmTimer = setTimeout(() => {
      this.playNextChillPad();
    }, (duration - 0.5) * 1000);
  }

  // Juicy ASMR Wooden Pop when dragging across letters (Rising pitch per letter!)
  playLetterPop(letterIndex = 1) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const baseFreq = 400 + Math.min(letterIndex * 50, 450); // Rising pitch pop!

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * 1.5, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.04);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch (e) {}
  }

  // Magical Harmonic Harp Chime when word is found
  playFound() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.4);
      });
    } catch (e) {}
  }

  playHint() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const freqs = [880, 1318.51, 1760];
      freqs.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.06);
        osc.stop(this.ctx.currentTime + i * 0.06 + 0.2);
      });
    } catch (e) {}
  }

  playVictory() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const melody = [523.25, 659.25, 783.99, 1046.50, 880, 1046.50];
      let time = this.ctx.currentTime;
      melody.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.25);
        time += 0.12;
      });
    } catch (e) {}
  }

  playClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {}
  }
}

// Screenshot-Accurate Color Palette for Highlight Pills
const PALETTES = [
  { bg: '#fca5a5', stroke: '#f87171' }, // Red/Coral (TREND)
  { bg: '#f472b6', stroke: '#ec4899' }, // Pink/Magenta (CATWALK)
  { bg: '#a78bfa', stroke: '#8b5cf6' }, // Purple (COVER)
  { bg: '#7dd3fc', stroke: '#38bdf8' }, // Cyan/Sky (MODEL)
  { bg: '#93c5fd', stroke: '#60a5fa' }, // Blue (COLLECTION)
  { bg: '#86efac', stroke: '#4ade80' }, // Green
  { bg: '#fed7aa', stroke: '#fb923c' }, // Peach
  { bg: '#fde047', stroke: '#eab308' }, // Yellow
  { bg: '#c4b5fd', stroke: '#a855f7' }  // Lavender
];

// Curated Categories (Fashion matching screenshot, Food, Animals, etc.)
const CATEGORIES = {
  fashion: {
    name: 'Fashion',
    icon: '👗',
    words: [
      'TREND', 'CATWALK', 'COVER', 'MODEL', 'DESIGNER', 'MAGAZINE', 'COLLECTION', 'HYPE',
      'STYLE', 'RUNWAY', 'VOGUE', 'DRESS', 'GLAMOUR', 'OUTFIT', 'BEAUTY', 'FABRIC'
    ]
  },
  food: {
    name: 'Food',
    icon: '🍕',
    words: [
      'EATING', 'PLATE', 'RESTAURANT', 'MENU', 'FORK', 'WAITER', 'COCKTAIL', 'TIP',
      'PIZZA', 'BURGER', 'DESSERT', 'CHEF', 'NAPKIN', 'SALAD', 'CHEESE', 'BREAD'
    ]
  },
  animals: {
    name: 'Animals',
    icon: '🦁',
    words: [
      'LION', 'TIGER', 'ELEPHANT', 'GIRAFFE', 'ZEBRA', 'MONKEY', 'DOLPHIN', 'PENGUIN',
      'KANGAROO', 'PANDA', 'KOALA', 'BEAR', 'WOLF', 'RABBIT', 'CHEETAH', 'LEOPARD'
    ]
  },
  tech: {
    name: 'Tech',
    icon: '💻',
    words: [
      'COMPUTER', 'PYTHON', 'ROBOT', 'INTERNET', 'KEYBOARD', 'SCREEN', 'ALGORITHM',
      'CODING', 'SOFTWARE', 'HARDWARE', 'DATABASE', 'NETWORK', 'BROWSER', 'SERVER'
    ]
  },
  sports: {
    name: 'Sports',
    icon: '⚽',
    words: [
      'FOOTBALL', 'CRICKET', 'BASKETBALL', 'TENNIS', 'SWIMMING', 'RUNNING', 'BASEBALL',
      'VOLLEYBALL', 'BOXING', 'ARCHERY', 'CYCLING', 'GOLF', 'HOCKEY', 'RUGBY'
    ]
  }
};

class WordSearchGame {
  constructor() {
    this.sound = new SoundController();

    this.gridSize = 11; // 11x11 matching screenshot
    this.currentCategoryKey = 'fashion';
    this.hintsRemaining = 3;
    this.hintsUsed = 0;

    this.grid = [];
    this.placedWords = [];
    this.foundWordsCount = 0;

    this.isDragging = false;
    this.startCell = null;
    this.currentHoverCell = null;
    this.selectedCells = [];

    this.timerSeconds = 0;
    this.timerMs = 0;
    this.timerInterval = null;

    this.cacheDom();
    this.bindEvents();
    this.initPuzzle();
  }

  cacheDom() {
    this.dom = {
      settingsBtn: document.getElementById('settingsBtn'),
      categoryTitle: document.getElementById('categoryTitle'),
      wordsList: document.getElementById('wordsList'),
      hintBtn: document.getElementById('hintBtn'),
      hintBadge: document.getElementById('hintBadge'),
      gameTimer: document.getElementById('gameTimer'),

      gridWrapper: document.getElementById('gridWrapper'),
      highlightsSvg: document.getElementById('highlightsSvg'),
      activeSelectionSvg: document.getElementById('activeSelectionSvg'),
      lettersGrid: document.getElementById('lettersGrid'),
      wordToast: document.getElementById('wordToast'),
      toastWord: document.getElementById('toastWord'),

      victoryModal: document.getElementById('victoryModal'),
      vicTime: document.getElementById('vicTime'),
      vicWords: document.getElementById('vicWords'),
      nextLevelBtn: document.getElementById('nextLevelBtn'),

      splashScreen: document.getElementById('splashScreen'),
      splashPlayBtn: document.getElementById('splashPlayBtn'),
      homeMenuBtn: document.getElementById('homeMenuBtn'),

      settingsModal: document.getElementById('settingsModal'),
      closeSettingsModal: document.getElementById('closeSettingsModal'),
      saveSettingsBtn: document.getElementById('saveSettingsBtn'),
      soundToggle: document.getElementById('soundToggle'),
      soundToggleBtn: document.getElementById('soundToggleBtn'),
      soundHeaderIcon: document.getElementById('soundHeaderIcon'),
      categoryList: document.getElementById('categoryList')
    };
  }

  bindEvents() {
    // Splash Play Button Action
    if (this.dom.splashPlayBtn) {
      this.dom.splashPlayBtn.addEventListener('click', () => {
        this.sound.playLetterPop(3);
        if (this.dom.splashScreen) {
          this.dom.splashScreen.classList.add('hidden');
        }
        this.startTimer();
      });
    }

    // Return to Main Menu Button in Settings
    if (this.dom.homeMenuBtn) {
      this.dom.homeMenuBtn.addEventListener('click', () => {
        this.sound.playLetterPop(1);
        if (this.dom.settingsModal) {
          this.dom.settingsModal.classList.remove('active');
        }
        if (this.dom.splashScreen) {
          this.dom.splashScreen.classList.remove('hidden');
        }
      });
    }

    // Start ambient background music on first click / touch
    const startAudioOnInteraction = () => {
      this.sound.startBgm();
      window.removeEventListener('pointerdown', startAudioOnInteraction);
      window.removeEventListener('keydown', startAudioOnInteraction);
    };
    window.addEventListener('pointerdown', startAudioOnInteraction);
    window.addEventListener('keydown', startAudioOnInteraction);

    // Header Sound Toggle Button
    if (this.dom.soundToggleBtn) {
      this.dom.soundToggleBtn.addEventListener('click', () => {
        this.sound.enabled = !this.sound.enabled;
        if (this.dom.soundHeaderIcon) {
          this.dom.soundHeaderIcon.textContent = this.sound.enabled ? '🔊' : '🔇';
        }
        if (this.dom.soundToggle) {
          this.dom.soundToggle.checked = this.sound.enabled;
        }
        if (this.sound.enabled) {
          this.sound.startBgm();
        } else {
          this.sound.stopBgm();
        }
      });
    }

    // Settings modal
    this.dom.settingsBtn.addEventListener('click', () => {
      this.populateCategoryList();
      this.dom.settingsModal.classList.add('active');
    });

    this.dom.closeSettingsModal.addEventListener('click', () => {
      this.dom.settingsModal.classList.remove('active');
    });

    this.dom.saveSettingsBtn.addEventListener('click', () => {
      this.dom.settingsModal.classList.remove('active');
    });

    this.dom.soundToggle.addEventListener('change', (e) => {
      this.sound.enabled = e.target.checked;
      if (this.dom.soundHeaderIcon) {
        this.dom.soundHeaderIcon.textContent = this.sound.enabled ? '🔊' : '🔇';
      }
      if (this.sound.enabled) {
        this.sound.startBgm();
      } else {
        this.sound.stopBgm();
      }
    });

    // Hint
    this.dom.hintBtn.addEventListener('click', () => this.useHint());

    // Victory next level
    this.dom.nextLevelBtn.addEventListener('click', () => {
      this.dom.victoryModal.classList.remove('active');
      const keys = Object.keys(CATEGORIES);
      const nextIdx = (keys.indexOf(this.currentCategoryKey) + 1) % keys.length;
      this.currentCategoryKey = keys[nextIdx];
      this.initPuzzle();
    });

    // Drag interaction on grid
    const gridEl = this.dom.gridWrapper;
    gridEl.addEventListener('pointerdown', (e) => this.handleDragStart(e));
    window.addEventListener('pointermove', (e) => this.handleDragMove(e));
    window.addEventListener('pointerup', (e) => this.handleDragEnd(e));
    window.addEventListener('pointercancel', (e) => this.handleDragEnd(e));

    window.addEventListener('resize', () => {
      this.renderFoundHighlights();
    });
  }

  populateCategoryList() {
    const list = this.dom.categoryList;
    list.innerHTML = '';
    Object.keys(CATEGORIES).forEach(key => {
      const cat = CATEGORIES[key];
      const btn = document.createElement('button');
      btn.className = `cat-btn ${key === this.currentCategoryKey ? 'active' : ''}`;
      btn.innerHTML = `${cat.icon} ${cat.name}`;
      btn.addEventListener('click', () => {
        this.sound.playClick();
        this.currentCategoryKey = key;
        this.dom.settingsModal.classList.remove('active');
        this.initPuzzle();
      });
      list.appendChild(btn);
    });
  }

  // --- Puzzle Initialization ---
  initPuzzle() {
    const cat = CATEGORIES[this.currentCategoryKey] || CATEGORIES.fashion;
    this.hintsUsed = 0;
    this.dom.hintBadge.textContent = `x${this.hintsRemaining}`;

    const targetWordsCount = Math.min(8, cat.words.length);
    const pool = [...cat.words].sort(() => 0.5 - Math.random());

    const { grid, placedWords } = this.generateGrid(pool, targetWordsCount);
    this.grid = grid;
    this.placedWords = placedWords;
    this.foundWordsCount = 0;

    this.updateHeaderProgress();
    this.renderLetters();
    this.renderWordsList();

    this.dom.highlightsSvg.innerHTML = '';
    this.dom.activeSelectionSvg.innerHTML = '';

    this.startTimer();
  }

  generateGrid(wordPool, targetCount) {
    const size = this.gridSize;
    let grid = Array(size).fill(null).map(() => Array(size).fill(''));
    let placedWords = [];

    const directions = [
      [0, 1], [0, -1], [1, 0], [-1, 0],
      [1, 1], [-1, -1], [1, -1], [-1, 1]
    ];

    for (const rawWord of wordPool) {
      if (placedWords.length >= targetCount) break;
      const word = rawWord.toUpperCase().trim();
      if (word.length > size || word.length < 3) continue;

      let placed = false;
      const shuffledDirs = [...directions].sort(() => 0.5 - Math.random());

      for (let attempt = 0; attempt < 250; attempt++) {
        const [dr, dc] = shuffledDirs[Math.floor(Math.random() * shuffledDirs.length)];

        const minR = dr < 0 ? word.length - 1 : 0;
        const maxR = dr > 0 ? size - word.length : size - 1;
        const minC = dc < 0 ? word.length - 1 : 0;
        const maxC = dc > 0 ? size - word.length : size - 1;

        if (minR > maxR || minC > maxC) continue;

        const startR = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
        const startC = Math.floor(Math.random() * (maxC - minC + 1)) + minC;

        let canPlace = true;
        let coords = [];

        for (let i = 0; i < word.length; i++) {
          const r = startR + i * dr;
          const c = startC + i * dc;
          const letter = word[i];
          if (grid[r][c] !== '' && grid[r][c] !== letter) {
            canPlace = false;
            break;
          }
          coords.push({ r, c, letter });
        }

        if (canPlace) {
          coords.forEach(({ r, c, letter }) => { grid[r][c] = letter; });
          const color = PALETTES[placedWords.length % PALETTES.length];

          placedWords.push({
            word,
            start: { r: startR, c: startC },
            end: { r: startR + (word.length - 1) * dr, c: startC + (word.length - 1) * dc },
            coords,
            found: false,
            color
          });
          placed = true;
          break;
        }
      }
    }

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letters = 'EEEEAAAAIIIOOOUUUNNNRRRTTTSSLLDDGGBCFHKMPVWY';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === '') {
          grid[r][c] = letters[Math.floor(Math.random() * letters.length)] || alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    return { grid, placedWords };
  }

  // --- Rendering UI ---
  renderLetters() {
    const container = this.dom.lettersGrid;
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;

    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.textContent = this.grid[r][c];
        container.appendChild(cell);
      }
    }
  }

  renderWordsList() {
    const container = this.dom.wordsList;
    container.innerHTML = '';

    this.placedWords.forEach(pw => {
      const item = document.createElement('div');
      item.className = 'word-item';
      item.id = `word-item-${pw.word}`;
      item.textContent = pw.word;
      if (pw.found) {
        item.classList.add('found');
        item.style.backgroundColor = pw.color.bg;
      }
      container.appendChild(item);
    });
  }

  updateHeaderProgress() {
    const cat = CATEGORIES[this.currentCategoryKey] || CATEGORIES.fashion;
    this.dom.categoryTitle.textContent = `${cat.name} ${this.foundWordsCount}/${this.placedWords.length}`;
  }

  // --- Drag & Angle Snapping ---
  getCellCenter(r, c) {
    const cell = this.dom.lettersGrid.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    if (!cell) return null;
    const boardRect = this.dom.gridWrapper.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    return {
      x: (cellRect.left + cellRect.width / 2) - boardRect.left,
      y: (cellRect.top + cellRect.height / 2) - boardRect.top,
      radius: cellRect.width * 0.44
    };
  }

  getCellFromPoint(clientX, clientY) {
    const el = document.elementFromPoint(clientX, clientY);
    if (!el) return null;
    const cell = el.closest('.grid-cell');
    if (!cell) return null;
    return {
      r: parseInt(cell.dataset.row, 10),
      c: parseInt(cell.dataset.col, 10)
    };
  }

  handleDragStart(e) {
    const pos = this.getCellFromPoint(e.clientX, e.clientY);
    if (!pos) return;
    this.isDragging = true;
    this.startCell = pos;
    this.currentHoverCell = pos;
    this.selectedCells = [pos];
    this.sound.playLetterPop(1);
    this.renderLiveDragPill();
  }

  handleDragMove(e) {
    if (!this.isDragging || !this.startCell) return;
    const pos = this.getCellFromPoint(e.clientX, e.clientY);
    if (!pos) return;

    if (this.currentHoverCell && (pos.r !== this.currentHoverCell.r || pos.c !== this.currentHoverCell.c)) {
      this.currentHoverCell = pos;
      const line = this.getSnappedLine(this.startCell, pos);
      if (line.length !== this.selectedCells.length) {
        this.sound.playLetterPop(line.length);
      }
      this.selectedCells = line;
      this.renderLiveDragPill();
    }
  }

  handleDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.checkSelectedWord();
    this.dom.activeSelectionSvg.innerHTML = '';
    this.selectedCells = [];
    this.startCell = null;
    this.currentHoverCell = null;
  }

  getSnappedLine(start, end) {
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    if (dr === 0 && dc === 0) return [start];

    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);
    let stepR = 0, stepC = 0, length = 0;

    if (dr === 0) {
      stepC = dc > 0 ? 1 : -1;
      length = absDc;
    } else if (dc === 0) {
      stepR = dr > 0 ? 1 : -1;
      length = absDr;
    } else if (Math.abs(absDr - absDc) <= Math.max(1, Math.floor(Math.max(absDr, absDc) * 0.35))) {
      stepR = dr > 0 ? 1 : -1;
      stepC = dc > 0 ? 1 : -1;
      length = Math.min(absDr, absDc);
    } else {
      if (absDr > absDc) { stepR = dr > 0 ? 1 : -1; length = absDr; }
      else { stepC = dc > 0 ? 1 : -1; length = absDc; }
    }

    const cells = [];
    for (let i = 0; i <= length; i++) {
      const r = start.r + i * stepR;
      const c = start.c + i * stepC;
      if (r >= 0 && r < this.gridSize && c >= 0 && c < this.gridSize) {
        cells.push({ r, c });
      }
    }
    return cells;
  }

  renderLiveDragPill() {
    if (this.selectedCells.length === 0) return;
    const start = this.selectedCells[0];
    const end = this.selectedCells[this.selectedCells.length - 1];
    const p1 = this.getCellCenter(start.r, start.c);
    const p2 = this.getCellCenter(end.r, end.c);
    if (!p1 || !p2) return;

    const width = p1.radius * 2.15;
    this.dom.activeSelectionSvg.innerHTML = `
      <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"
            stroke="rgba(147, 197, 253, 0.65)" stroke-width="${width}" stroke-linecap="round" />
    `;
  }

  checkSelectedWord() {
    if (this.selectedCells.length < 2) return;
    const forward = this.selectedCells.map(({ r, c }) => this.grid[r][c]).join('');
    const backward = [...forward].reverse().join('');

    const match = this.placedWords.find(pw =>
      !pw.found && (pw.word === forward || pw.word === backward)
    );

    if (match) {
      const first = this.selectedCells[0];
      const last = this.selectedCells[this.selectedCells.length - 1];
      const matchFwd = (match.start.r === first.r && match.start.c === first.c && match.end.r === last.r && match.end.c === last.c);
      const matchBwd = (match.start.r === last.r && match.start.c === last.c && match.end.r === first.r && match.end.c === first.c);

      if (matchFwd || matchBwd) {
        this.onWordFound(match);
      }
    }
  }

  onWordFound(wordObj) {
    wordObj.found = true;
    this.foundWordsCount++;

    this.sound.playFound();
    this.showToast(wordObj.word);

    // Apply color pill in Word List
    const item = document.getElementById(`word-item-${wordObj.word}`);
    if (item) {
      item.classList.add('found');
      item.style.backgroundColor = wordObj.color.bg;
    }

    this.updateHeaderProgress();
    this.renderFoundHighlights();

    if (this.foundWordsCount >= this.placedWords.length) {
      this.onVictory();
    }
  }

  renderFoundHighlights() {
    const svg = this.dom.highlightsSvg;
    svg.innerHTML = '';

    this.placedWords.filter(pw => pw.found).forEach(pw => {
      const p1 = this.getCellCenter(pw.start.r, pw.start.c);
      const p2 = this.getCellCenter(pw.end.r, pw.end.c);
      if (!p1 || !p2) return;

      const width = p1.radius * 2.15;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', p1.x);
      line.setAttribute('y1', p1.y);
      line.setAttribute('x2', p2.x);
      line.setAttribute('y2', p2.y);
      line.setAttribute('stroke', pw.color.bg);
      line.setAttribute('stroke-width', width);
      line.setAttribute('stroke-linecap', 'round');
      svg.appendChild(line);
    });
  }

  showToast(word) {
    this.dom.toastWord.textContent = word;
    this.dom.wordToast.classList.add('show');
    setTimeout(() => this.dom.wordToast.classList.remove('show'), 1400);
  }

  useHint() {
    if (this.hintsRemaining <= 0) {
      this.showToast('No hints left!');
      return;
    }
    const unrevealed = this.placedWords.find(pw => !pw.found);
    if (!unrevealed) return;

    this.hintsRemaining--;
    this.hintsUsed++;
    this.dom.hintBadge.textContent = `x${this.hintsRemaining}`;
    this.sound.playHint();

    const cell = this.dom.lettersGrid.querySelector(
      `[data-row="${unrevealed.start.r}"][data-col="${unrevealed.start.c}"]`
    );
    if (cell) {
      cell.classList.add('hint-glow');
      setTimeout(() => cell.classList.remove('hint-glow'), 3000);
    }

    const item = document.getElementById(`word-item-${unrevealed.word}`);
    if (item) {
      item.classList.add('hint-pulse');
      setTimeout(() => item.classList.remove('hint-pulse'), 3000);
    }
  }

  onVictory() {
    this.stopTimer();
    this.sound.playVictory();
    if (window.confetti) {
      window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }

    this.dom.vicTime.textContent = this.dom.gameTimer.textContent;
    this.dom.vicWords.textContent = `${this.placedWords.length}/${this.placedWords.length}`;

    setTimeout(() => {
      this.dom.victoryModal.classList.add('active');
    }, 600);
  }

  startTimer() {
    this.stopTimer();
    this.timerSeconds = 0;
    this.timerMs = 0;
    this.updateTimer();

    this.timerInterval = setInterval(() => {
      this.timerMs += 7;
      if (this.timerMs >= 100) {
        this.timerMs = 0;
        this.timerSeconds++;
      }
      this.updateTimer();
    }, 70);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimer() {
    const mins = Math.floor(this.timerSeconds / 60);
    const secs = this.timerSeconds % 60;
    const msStr = this.timerMs.toString().padStart(2, '0');
    this.dom.gameTimer.textContent = `${mins}:${secs.toString().padStart(2, '0')}:${msStr}`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new WordSearchGame();
});
