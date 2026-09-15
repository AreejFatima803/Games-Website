/**
 * EMOJI MATCH - Flow Connect Puzzle Game
 * Full game logic, level engine, canvas pipe renderer, and Web Audio SFX
 */

(function () {
  'use strict';

  /* =========================================================
     AUDIO SYNTHESIZER (WEB AUDIO API)
     ========================================================= */
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.enabled = true;
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

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.25, startDelay = 0) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startDelay);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + startDelay);
      gain.gain.linearRampToValueAtTime(gainVal, this.ctx.currentTime + startDelay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startDelay + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startDelay);
      osc.stop(this.ctx.currentTime + startDelay + duration);
    }

    playTap() {
      this.playTone(600, 'sine', 0.08, 0.2);
    }

    playStep(stepIndex) {
      const baseFreq = 380;
      const freq = baseFreq + Math.min(stepIndex * 35, 450);
      this.playTone(freq, 'triangle', 0.09, 0.15);
    }

    playConnect() {
      if (!this.enabled) return;
      this.init();
      this.playTone(523.25, 'sine', 0.2, 0.25, 0);       // C5
      this.playTone(659.25, 'sine', 0.25, 0.25, 0.08);   // E5
      this.playTone(783.99, 'sine', 0.35, 0.3, 0.16);    // G5
    }

    playVictory() {
      if (!this.enabled) return;
      this.init();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        this.playTone(freq, 'triangle', 0.3, 0.3, i * 0.12);
      });
      setTimeout(() => {
        this.playTone(1046.50, 'sine', 0.6, 0.35, 0);
        this.playTone(1318.51, 'sine', 0.6, 0.25, 0);
      }, 500);
    }

    playReset() {
      this.playTone(320, 'sawtooth', 0.15, 0.15);
    }

    playHint() {
      if (!this.enabled) return;
      this.init();
      const sparkles = [784, 987, 1174, 1567];
      sparkles.forEach((f, i) => {
        this.playTone(f, 'sine', 0.2, 0.2, i * 0.08);
      });
    }
  }

  const sound = new SoundManager();

  /* =========================================================
     PALETTE COLORS
     ========================================================= */
  const PALETTE = {
    cyan: '#00d2ff',
    yellow: '#ffb703',
    coral: '#ff4d6d',
    emerald: '#10b981',
    purple: '#a855f7',
    orange: '#fb8500',
    pink: '#f72585',
    blue: '#3a86ff'
  };

  /* =========================================================
     LEVEL DEFINITIONS WITH NATURAL PAIRINGS & REASONS
     ========================================================= */
  const LEVELS = [
    // Level 1 (3x3 - Feelings & Food)
    {
      id: 1,
      name: "Level 1",
      size: 3,
      pairs: [
        {
          id: 1,
          emojiA: "🍨",
          emojiB: "🥶",
          nameA: "Ice Cream",
          nameB: "Cold Face",
          reason: "Ice cream is freezing cold! 🍨❄️",
          color: PALETTE.cyan,
          posA: [0, 0],
          posB: [1, 1],
          solution: [[0, 0], [1, 0], [1, 1]]
        },
        {
          id: 2,
          emojiA: "😭",
          emojiB: "🧅",
          nameA: "Crying",
          nameB: "Onion",
          reason: "Cutting onions makes you cry! 😭🧅",
          color: PALETTE.yellow,
          posA: [2, 0],
          posB: [2, 2],
          solution: [[2, 0], [2, 1], [2, 2]]
        },
        {
          id: 3,
          emojiA: "🥵",
          emojiB: "🌶️",
          nameA: "Hot Face",
          nameB: "Chili Pepper",
          reason: "Spicy chili gives you a hot face! 🥵🌶️",
          color: PALETTE.coral,
          posA: [1, 2],
          posB: [0, 1],
          solution: [[1, 2], [0, 2], [0, 1]]
        }
      ]
    },

    // Level 2 (3x3 - Summer, Fire & Nature)
    {
      id: 2,
      name: "Level 2",
      size: 3,
      pairs: [
        {
          id: 1,
          emojiA: "☀️",
          emojiB: "😎",
          nameA: "Sun",
          nameB: "Sunglasses",
          reason: "Wear sunglasses in the bright sun! ☀️😎",
          color: PALETTE.yellow,
          posA: [0, 0],
          posB: [2, 0],
          solution: [[0, 0], [1, 0], [2, 0]]
        },
        {
          id: 2,
          emojiA: "🔥",
          emojiB: "🚒",
          nameA: "Fire",
          nameB: "Fire Truck",
          reason: "Fire truck rushes to put out fires! 🔥🚒",
          color: PALETTE.coral,
          posA: [0, 1],
          posB: [2, 1],
          solution: [[0, 1], [1, 1], [2, 1]]
        },
        {
          id: 3,
          emojiA: "🐒",
          emojiB: "🍌",
          nameA: "Monkey",
          nameB: "Banana",
          reason: "Monkey loves eating sweet bananas! 🐒🍌",
          color: PALETTE.emerald,
          posA: [0, 2],
          posB: [2, 2],
          solution: [[0, 2], [1, 2], [2, 2]]
        }
      ]
    },

    // Level 3 (3x3 - Craft, Study & Makeup)
    {
      id: 3,
      name: "Level 3",
      size: 3,
      pairs: [
        {
          id: 1,
          emojiA: "🧵",
          emojiB: "🪡",
          nameA: "Thread",
          nameB: "Needle",
          reason: "Needle and thread are used for sewing! 🧵🪡",
          color: PALETTE.coral,
          posA: [0, 0],
          posB: [0, 2],
          solution: [[0, 0], [0, 1], [0, 2]]
        },
        {
          id: 2,
          emojiA: "📖",
          emojiB: "✏️",
          nameA: "Book",
          nameB: "Pencil",
          reason: "Write in the book with a pencil! 📖✏️",
          color: PALETTE.cyan,
          posA: [1, 1],
          posB: [2, 0],
          solution: [[1, 1], [1, 0], [2, 0]]
        },
        {
          id: 3,
          emojiA: "👄",
          emojiB: "💄",
          nameA: "Lips",
          nameB: "Lipstick",
          reason: "Apply lipstick to beautiful lips! 👄💄",
          color: PALETTE.pink,
          posA: [1, 2],
          posB: [2, 1],
          solution: [[1, 2], [2, 2], [2, 1]]
        }
      ]
    },

    // Level 4 (4x4 - Cute Pets & Goodies)
    {
      id: 4,
      name: "Level 4",
      size: 4,
      pairs: [
        {
          id: 1,
          emojiA: "🐶",
          emojiB: "🦴",
          nameA: "Puppy",
          nameB: "Bone",
          reason: "Puppy loves its bone! 🐶🦴",
          color: PALETTE.purple,
          posA: [0, 0],
          posB: [0, 3],
          solution: [[0, 0], [0, 1], [0, 2], [0, 3]]
        },
        {
          id: 2,
          emojiA: "🐝",
          emojiB: "🍯",
          nameA: "Honeybee",
          nameB: "Honey",
          reason: "Honeybees make sweet pure honey! 🐝🍯",
          color: PALETTE.orange,
          posA: [1, 0],
          posB: [3, 0],
          solution: [[1, 0], [2, 0], [3, 0]]
        },
        {
          id: 3,
          emojiA: "🌧️",
          emojiB: "☂️",
          nameA: "Rain",
          nameB: "Umbrella",
          reason: "Open your umbrella when it rains! 🌧️☂️",
          color: PALETTE.cyan,
          posA: [1, 1],
          posB: [3, 1],
          solution: [[1, 1], [2, 1], [3, 1]]
        },
        {
          id: 4,
          emojiA: "🥛",
          emojiB: "🍪",
          nameA: "Milk",
          nameB: "Cookie",
          reason: "Delicious milk and crunchy cookies! 🥛🍪",
          color: PALETTE.pink,
          posA: [1, 3],
          posB: [3, 3],
          solution: [[1, 3], [2, 3], [3, 3], [3, 2], [2, 2], [1, 2]]
        }
      ]
    },

    // Level 5 (4x4 - Vehicles, Sports & Nature)
    {
      id: 5,
      name: "Level 5",
      size: 4,
      pairs: [
        {
          id: 1,
          emojiA: "🚗",
          emojiB: "⛽",
          nameA: "Car",
          nameB: "Fuel Pump",
          reason: "Fill car with fuel at the pump! 🚗⛽",
          color: PALETTE.purple,
          posA: [0, 0],
          posB: [1, 2],
          solution: [[0, 0], [0, 1], [0, 2], [1, 2]]
        },
        {
          id: 2,
          emojiA: "🕷️",
          emojiB: "🕸️",
          nameA: "Spider",
          nameB: "Web",
          reason: "Spider weaves an intricate web! 🕷️🕸️",
          color: PALETTE.cyan,
          posA: [1, 0],
          posB: [3, 0],
          solution: [[1, 0], [2, 0], [3, 0]]
        },
        {
          id: 3,
          emojiA: "🍳",
          emojiB: "🥓",
          nameA: "Egg",
          nameB: "Bacon",
          reason: "Classic morning eggs and bacon! 🍳🥓",
          color: PALETTE.emerald,
          posA: [1, 1],
          posB: [3, 1],
          solution: [[1, 1], [2, 1], [3, 1]]
        },
        {
          id: 4,
          emojiA: "⚽",
          emojiB: "🥅",
          nameA: "Soccer",
          nameB: "Goal Net",
          reason: "Kick the soccer ball into the goal! ⚽🥅",
          color: PALETTE.coral,
          posA: [0, 3],
          posB: [3, 3],
          solution: [[0, 3], [1, 3], [2, 3], [3, 3], [3, 2], [2, 2]]
        }
      ]
    },

    // Level 6 (4x4 - Health, Love & Gadgets)
    {
      id: 6,
      name: "Level 6",
      size: 4,
      pairs: [
        {
          id: 1,
          emojiA: "❤️",
          emojiB: "💌",
          nameA: "Heart",
          nameB: "Love Letter",
          reason: "Heart sealed in a love letter! ❤️💌",
          color: PALETTE.pink,
          posA: [0, 0],
          posB: [2, 0],
          solution: [[0, 0], [1, 0], [2, 0]]
        },
        {
          id: 2,
          emojiA: "🩺",
          emojiB: "🩹",
          nameA: "Doctor",
          nameB: "Bandage",
          reason: "Doctor applies a healing bandage! 🩺🩹",
          color: PALETTE.cyan,
          posA: [0, 1],
          posB: [2, 1],
          solution: [[0, 1], [1, 1], [2, 1]]
        },
        {
          id: 3,
          emojiA: "🐭",
          emojiB: "🧀",
          nameA: "Mouse",
          nameB: "Cheese",
          reason: "Clever little mouse loves cheese! 🐭🧀",
          color: PALETTE.yellow,
          posA: [0, 2],
          posB: [2, 2],
          solution: [[0, 2], [1, 2], [2, 2]]
        },
        {
          id: 4,
          emojiA: "🔋",
          emojiB: "🔦",
          nameA: "Battery",
          nameB: "Flashlight",
          reason: "Battery powers up the flashlight! 🔋🔦",
          color: PALETTE.emerald,
          posA: [3, 0],
          posB: [3, 3],
          solution: [[3, 0], [3, 1], [3, 2], [3, 3], [2, 3], [1, 3], [0, 3]]
        }
      ]
    },

    // Level 7 (5x5 - Royal, Food & Sky)
    {
      id: 7,
      name: "Level 7",
      size: 5,
      pairs: [
        {
          id: 1,
          emojiA: "👑",
          emojiB: "👸",
          nameA: "Crown",
          nameB: "Princess",
          reason: "Princess wears a golden crown! 👑👸",
          color: PALETTE.purple,
          posA: [0, 0],
          posB: [0, 4],
          solution: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]
        },
        {
          id: 2,
          emojiA: "🌲",
          emojiB: "🍎",
          nameA: "Tree",
          nameB: "Apple",
          reason: "Fresh apples grow on apple trees! 🌲🍎",
          color: PALETTE.emerald,
          posA: [1, 0],
          posB: [4, 0],
          solution: [[1, 0], [2, 0], [3, 0], [4, 0]]
        },
        {
          id: 3,
          emojiA: "🍕",
          emojiB: "🥤",
          nameA: "Pizza",
          nameB: "Cold Drink",
          reason: "Tasty hot pizza with cold drink! 🍕🥤",
          color: PALETTE.cyan,
          posA: [1, 1],
          posB: [3, 1],
          solution: [[1, 1], [2, 1], [3, 1]]
        },
        {
          id: 4,
          emojiA: "🌙",
          emojiB: "⭐",
          nameA: "Moon",
          nameB: "Star",
          reason: "Moon and shining stars in the night! 🌙⭐",
          color: PALETTE.yellow,
          posA: [4, 1],
          posB: [4, 4],
          solution: [[4, 1], [4, 2], [4, 3], [4, 4]]
        },
        {
          id: 5,
          emojiA: "🔑",
          emojiB: "🔒",
          nameA: "Key",
          nameB: "Lock",
          reason: "Key unlocks the sturdy padlock! 🔑🔒",
          color: PALETTE.coral,
          posA: [1, 4],
          posB: [3, 3],
          solution: [[1, 4], [2, 4], [3, 4], [3, 3], [2, 3], [1, 3], [1, 2], [2, 2], [3, 2]]
        }
      ]
    },

    // Level 8 (5x5 - Magic, Art & Storms)
    {
      id: 8,
      name: "Level 8",
      size: 5,
      pairs: [
        {
          id: 1,
          emojiA: "🧙",
          emojiB: "🪄",
          nameA: "Wizard",
          nameB: "Magic Wand",
          reason: "Wizard casts spells with a magic wand! 🧙🪄",
          color: PALETTE.purple,
          posA: [0, 0],
          posB: [0, 4],
          solution: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]
        },
        {
          id: 2,
          emojiA: "🐱",
          emojiB: "🐟",
          nameA: "Cat",
          nameB: "Fish",
          reason: "Playful cat loves tasty fish! 🐱🐟",
          color: PALETTE.orange,
          posA: [1, 0],
          posB: [4, 0],
          solution: [[1, 0], [2, 0], [3, 0], [4, 0]]
        },
        {
          id: 3,
          emojiA: "⚡",
          emojiB: "🌩️",
          nameA: "Lightning",
          nameB: "Thunderstorm",
          reason: "Bright lightning from the storm cloud! ⚡🌩️",
          color: PALETTE.cyan,
          posA: [1, 1],
          posB: [3, 1],
          solution: [[1, 1], [2, 1], [3, 1]]
        },
        {
          id: 4,
          emojiA: "🍼",
          emojiB: "👶",
          nameA: "Milk Bottle",
          nameB: "Baby",
          reason: "Feed the cute baby with warm milk! 🍼👶",
          color: PALETTE.pink,
          posA: [4, 1],
          posB: [4, 4],
          solution: [[4, 1], [4, 2], [4, 3], [4, 4]]
        },
        {
          id: 5,
          emojiA: "🎨",
          emojiB: "🖌️",
          nameA: "Palette",
          nameB: "Paintbrush",
          reason: "Paint beautiful artwork with brush! 🎨🖌️",
          color: PALETTE.emerald,
          posA: [1, 4],
          posB: [3, 3],
          solution: [[1, 4], [2, 4], [3, 4], [3, 3], [2, 3], [1, 3], [1, 2], [2, 2], [3, 2]]
        }
      ]
    },

    // Level 9 (5x5 - Space, Music & Safari)
    {
      id: 9,
      name: "Level 9",
      size: 5,
      pairs: [
        {
          id: 1,
          emojiA: "🌍",
          emojiB: "🛸",
          nameA: "Earth",
          nameB: "UFO",
          reason: "UFO visits planet Earth! 🌍🛸",
          color: PALETTE.cyan,
          posA: [0, 0],
          posB: [0, 4],
          solution: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]
        },
        {
          id: 2,
          emojiA: "🎸",
          emojiB: "🎵",
          nameA: "Guitar",
          nameB: "Music Notes",
          reason: "Guitar plays sweet musical notes! 🎸🎵",
          color: PALETTE.purple,
          posA: [1, 0],
          posB: [4, 0],
          solution: [[1, 0], [2, 0], [3, 0], [4, 0]]
        },
        {
          id: 3,
          emojiA: "🤠",
          emojiB: "🐎",
          nameA: "Cowboy",
          nameB: "Horse",
          reason: "Cowboy rides his brave horse! 🤠🐎",
          color: PALETTE.orange,
          posA: [1, 1],
          posB: [3, 1],
          solution: [[1, 1], [2, 1], [3, 1]]
        },
        {
          id: 4,
          emojiA: "😴",
          emojiB: "🛏️",
          nameA: "Sleepy",
          nameB: "Bed",
          reason: "Sleepy person heads to cozy bed! 😴🛏️",
          color: PALETTE.yellow,
          posA: [4, 1],
          posB: [4, 4],
          solution: [[4, 1], [4, 2], [4, 3], [4, 4]]
        },
        {
          id: 5,
          emojiA: "🦁",
          emojiB: "🥩",
          nameA: "Lion",
          nameB: "Meat",
          reason: "King of the jungle enjoys meat! 🦁🥩",
          color: PALETTE.coral,
          posA: [1, 4],
          posB: [3, 3],
          solution: [[1, 4], [2, 4], [3, 4], [3, 3], [2, 3], [1, 3], [1, 2], [2, 2], [3, 2]]
        }
      ]
    },

    // Level 10 (5x5 - Grand Master Challenge)
    {
      id: 10,
      name: "Level 10",
      size: 5,
      pairs: [
        {
          id: 1,
          emojiA: "🚀",
          emojiB: "🪐",
          nameA: "Rocket",
          nameB: "Saturn",
          reason: "Rocket voyages to ringed planet Saturn! 🚀🪐",
          color: PALETTE.coral,
          posA: [0, 0],
          posB: [0, 4],
          solution: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]
        },
        {
          id: 2,
          emojiA: "🏆",
          emojiB: "🥇",
          nameA: "Trophy",
          nameB: "Gold Medal",
          reason: "Champion takes home trophy & gold medal! 🏆🥇",
          color: PALETTE.yellow,
          posA: [1, 0],
          posB: [4, 0],
          solution: [[1, 0], [2, 0], [3, 0], [4, 0]]
        },
        {
          id: 3,
          emojiA: "☕",
          emojiB: "🍩",
          nameA: "Coffee",
          nameB: "Donut",
          reason: "Hot morning coffee and sweet donut! ☕🍩",
          color: PALETTE.orange,
          posA: [1, 1],
          posB: [3, 1],
          solution: [[1, 1], [2, 1], [3, 1]]
        },
        {
          id: 4,
          emojiA: "📸",
          emojiB: "🖼️",
          nameA: "Camera",
          nameB: "Photo Frame",
          reason: "Snap a photo and display in a frame! 📸🖼️",
          color: PALETTE.pink,
          posA: [4, 1],
          posB: [4, 4],
          solution: [[4, 1], [4, 2], [4, 3], [4, 4]]
        },
        {
          id: 5,
          emojiA: "🕵️",
          emojiB: "🔍",
          nameA: "Detective",
          nameB: "Magnifier",
          reason: "Detective investigates with magnifying glass! 🕵️🔍",
          color: PALETTE.emerald,
          posA: [1, 4],
          posB: [3, 3],
          solution: [[1, 4], [2, 4], [3, 4], [3, 3], [2, 3], [1, 3], [1, 2], [2, 2], [3, 2]]
        }
      ]
    }
  ];

  /* =========================================================
     GAME STATE
     ========================================================= */
  const state = {
    currentLevelIdx: 0,
    unlockedLevel: 1,
    levelStars: {},
    paths: {},        // pairId -> array of [row, col]
    activePairId: null,
    isDragging: false,
    activePath: [],
    currentPointerPos: null
  };

  // Load saved progress
  try {
    const savedUnlocked = localStorage.getItem('emoji_match_unlocked');
    if (savedUnlocked) state.unlockedLevel = parseInt(savedUnlocked, 10) || 1;
    const savedStars = localStorage.getItem('emoji_match_stars');
    if (savedStars) state.levelStars = JSON.parse(savedStars) || {};
  } catch (e) {
    console.warn("Storage not available");
  }

  /* =========================================================
     DOM ELEMENTS
     ========================================================= */
  const screenHome = document.getElementById('screenHome');
  const screenLevels = document.getElementById('screenLevels');
  const screenGame = document.getElementById('screenGame');

  const btnPlay = document.getElementById('btnPlay');
  const btnLevels = document.getElementById('btnLevels');
  const btnHowTo = document.getElementById('btnHowTo');
  const btnSoundToggle = document.getElementById('soundIcon');

  const btnLevelsBack = document.getElementById('btnLevelsBack');
  const levelsGrid = document.getElementById('levelsGrid');
  const totalStarsEl = document.getElementById('totalStars');

  const btnGameBack = document.getElementById('btnGameBack');
  const btnReset = document.getElementById('btnReset');
  const btnHint = document.getElementById('btnHint');
  const gameLevelTitle = document.getElementById('gameLevelTitle');
  const gameLevelSub = document.getElementById('gameLevelSub');
  const gridBoard = document.getElementById('gridBoard');
  const pipeCanvas = document.getElementById('pipeCanvas');
  const pairsCount = document.getElementById('pairsCount');
  const pairsDots = document.getElementById('pairsDots');
  const boardWrapper = document.getElementById('boardWrapper');
  const targetsList = document.getElementById('targetsList');
  const pairActionToast = document.getElementById('pairActionToast');
  const pairToastText = document.getElementById('pairToastText');

  const modalHowTo = document.getElementById('modalHowTo');
  const btnCloseHowTo = document.getElementById('btnCloseHowTo');
  const btnGotIt = document.getElementById('btnGotIt');

  const modalVictory = document.getElementById('modalVictory');
  const victoryLevelText = document.getElementById('victoryLevelText');
  const btnNextLevel = document.getElementById('btnNextLevel');
  const btnReplay = document.getElementById('btnReplay');
  const btnSelectLevelFromWin = document.getElementById('btnSelectLevelFromWin');
  const confettiContainer = document.getElementById('confettiContainer');

  /* =========================================================
     BACKGROUND FLOATING EMOJIS
     ========================================================= */
  function initBackground() {
    const bgContainer = document.getElementById('bgEffects');
    if (!bgContainer) return;
    const emojis = ['🍨', '🥶', '😭', '🧅', '🥵', '🌶️', '🐝', '🍯', '☀️', '😎', '🐶', '🦴', '✨', '🎮'];
    
    for (let i = 0; i < 16; i++) {
      const el = document.createElement('div');
      el.className = 'bg-emoji';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = `${Math.random() * 94}%`;
      el.style.animationDelay = `${Math.random() * 12}s`;
      el.style.animationDuration = `${10 + Math.random() * 10}s`;
      el.style.fontSize = `${1.8 + Math.random() * 1.5}rem`;
      bgContainer.appendChild(el);
    }
  }

  /* =========================================================
     SCREEN NAVIGATION
     ========================================================= */
  function showScreen(screen) {
    [screenHome, screenLevels, screenGame].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');

    if (screen === screenLevels) {
      renderLevelSelect();
    }
  }

  /* =========================================================
     LEVEL SELECT RENDERER
     ========================================================= */
  function renderLevelSelect() {
    levelsGrid.innerHTML = '';
    let totalStars = 0;

    LEVELS.forEach((lvl, idx) => {
      const isUnlocked = idx + 1 <= state.unlockedLevel;
      const stars = state.levelStars[lvl.id] || 0;
      totalStars += stars;

      const card = document.createElement('button');
      card.className = 'level-card-btn';
      card.disabled = !isUnlocked;

      const starsText = isUnlocked 
        ? (stars > 0 ? '⭐'.repeat(stars) + '☆'.repeat(3 - stars) : '☆☆☆')
        : '🔒';

      card.innerHTML = `
        <span class="level-num">${lvl.id}</span>
        <span class="level-size-tag">${lvl.size}x${lvl.size}</span>
        <span class="level-stars">${starsText}</span>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          sound.playTap();
          startLevel(idx);
        });
      }

      levelsGrid.appendChild(card);
    });

    totalStarsEl.textContent = totalStars;
  }

  /* =========================================================
     CANVAS PIPE RENDERER
     ========================================================= */
  let ctx = null;

  function resizeCanvas() {
    if (!pipeCanvas) return;
    const rect = boardWrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    pipeCanvas.width = rect.width * dpr;
    pipeCanvas.height = rect.height * dpr;
    ctx = pipeCanvas.getContext('2d');
    ctx.scale(dpr, dpr);
    renderPipes();
  }

  function getCellCenter(row, col, size) {
    const rect = boardWrapper.getBoundingClientRect();
    const padding = 4;
    const gap = 4;
    const availableWidth = rect.width - (padding * 2);
    const cellSize = (availableWidth - (gap * (size - 1))) / size;

    const x = padding + (col * (cellSize + gap)) + (cellSize / 2);
    const y = padding + (row * (cellSize + gap)) + (cellSize / 2);
    return { x, y, cellSize };
  }

  function getBoardRelativePoint(clientX, clientY) {
    const rect = boardWrapper.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(rect.width, clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, clientY - rect.top))
    };
  }

  function renderPipes() {
    if (!ctx) return;
    const rect = boardWrapper.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    const level = LEVELS[state.currentLevelIdx];
    if (!level) return;

    // Draw all completed paths
    level.pairs.forEach(pair => {
      let path = state.paths[pair.id];
      if (state.activePairId === pair.id && state.isDragging) {
        return;
      }

      if (path && path.length > 1) {
        drawPathLine(path, pair.color, level.size, null);
      }
    });

    // Draw actively dragged live path with real-time cursor tail
    if (state.isDragging && state.activePairId) {
      const activePair = level.pairs.find(p => p.id === state.activePairId);
      if (activePair && state.activePath.length >= 1) {
        drawPathLine(state.activePath, activePair.color, level.size, state.currentPointerPos);
      }
    }
  }

  function drawPathLine(path, color, size, livePointer = null) {
    if (!ctx || !path || path.length === 0) return;

    const firstCoord = getCellCenter(path[0][0], path[0][1], size);
    // Slim, clean, elegant thin line (around 6px - 8px)
    const lineWidth = Math.max(5, Math.min(8, firstCoord.cellSize * 0.13));

    const points = path.map(pt => getCellCenter(pt[0], pt[1], size));
    if (livePointer) {
      points.push(livePointer);
    }

    if (points.length < 2) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Subtle Outer Neon Glow
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth + 6;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    points.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // 2. Clean Solid Thin Line Core
    ctx.globalAlpha = 1.0;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.beginPath();
    points.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // 3. Small Clean End Dots
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, lineWidth * 0.9, 0, Math.PI * 2);
    ctx.fill();

    const lastPt = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(lastPt.x, lastPt.y, lineWidth * 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /* =========================================================
     GAME BOARD ENGINE
     ========================================================= */
  function startLevel(levelIdx) {
    state.currentLevelIdx = levelIdx;
    state.paths = {};
    state.activePairId = null;
    state.isDragging = false;
    state.activePath = [];
    state.currentPointerPos = null;

    const level = LEVELS[levelIdx];
    gameLevelTitle.textContent = `${level.name}`;
    gameLevelSub.textContent = `${level.size}x${level.size} Grid`;

    showScreen(screenGame);
    buildGrid(level);
    renderTargetsTray(level);
    updateStatusBar(level);
    resetToast();

    setTimeout(() => {
      resizeCanvas();
    }, 60);
  }

  function renderTargetsTray(level) {
    if (!targetsList) return;
    targetsList.innerHTML = '';

    level.pairs.forEach(pair => {
      const chip = document.createElement('div');
      chip.className = 'target-chip';
      chip.dataset.pairId = pair.id;
      chip.style.borderColor = pair.color;

      const isDone = isPairConnected(pair.id);
      if (isDone) chip.classList.add('completed');

      chip.innerHTML = `
        <span class="chip-emoji">${pair.emojiA}</span>
        <span class="chip-arrow">➔</span>
        <span class="chip-emoji">${pair.emojiB}</span>
        <span class="chip-check">${isDone ? '✅' : ''}</span>
      `;

      chip.title = `${pair.nameA} + ${pair.nameB}: ${pair.reason}`;

      // Tap chip to flash and guide
      chip.addEventListener('click', () => {
        sound.playTap();
        highlightPair(pair.id);
        setToast(`🎯 Goal: Connect ${pair.emojiA} ${pair.nameA} ➔ ${pair.emojiB} ${pair.nameB} (${pair.reason})`, true);
      });

      targetsList.appendChild(chip);
    });

    if (window.twemoji) {
      window.twemoji.parse(targetsList, { folder: 'svg', ext: '.svg' });
    }
  }

  function highlightPair(pairId) {
    const level = LEVELS[state.currentLevelIdx];
    const pair = level.pairs.find(p => p.id === pairId);
    if (!pair) return;

    const cells = gridBoard.querySelectorAll(`.cell[data-pair-id="${pairId}"]`);
    cells.forEach(c => {
      c.classList.remove('flash-highlight');
      void c.offsetWidth; // trigger reflow
      c.classList.add('flash-highlight');
    });
  }

  function setToast(message, isHighlight = false) {
    if (!pairToastText || !pairActionToast) return;
    pairToastText.textContent = message;
    if (isHighlight) {
      pairActionToast.classList.add('highlight');
    } else {
      pairActionToast.classList.remove('highlight');
    }
  }

  function resetToast() {
    const level = LEVELS[state.currentLevelIdx];
    setToast(`Connect all ${level.pairs.length} emoji pairs without overlapping!`);
  }

  function buildGrid(level) {
    gridBoard.className = `grid-board grid-${level.size}x${level.size}`;
    gridBoard.innerHTML = '';

    for (let r = 0; r < level.size; r++) {
      for (let c = 0; c < level.size; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = r;
        cell.dataset.col = c;

        // Check if there is an emoji at this position
        const pairA = level.pairs.find(p => p.posA[0] === r && p.posA[1] === c);
        const pairB = level.pairs.find(p => p.posB[0] === r && p.posB[1] === c);

        if (pairA) {
          cell.classList.add('has-emoji', 'endpoint');
          cell.dataset.pairId = pairA.id;
          cell.dataset.endpoint = 'A';
          cell.style.setProperty('--pair-color', pairA.color);
          cell.innerHTML = `<span class="cell-emoji">${pairA.emojiA}</span>`;
          cell.title = `${pairA.nameA} (Match with ${pairA.emojiB} ${pairA.nameB})`;
        } else if (pairB) {
          cell.classList.add('has-emoji', 'endpoint');
          cell.dataset.pairId = pairB.id;
          cell.dataset.endpoint = 'B';
          cell.style.setProperty('--pair-color', pairB.color);
          cell.innerHTML = `<span class="cell-emoji">${pairB.emojiB}</span>`;
          cell.title = `${pairB.nameB} (Match with ${pairA ? pairA.emojiA : pairB.emojiA} ${pairB.nameA})`;
        }

        gridBoard.appendChild(cell);
      }
    }

    // High resolution authentic Twemoji rendering
    if (window.twemoji) {
      window.twemoji.parse(gridBoard, { folder: 'svg', ext: '.svg' });
    }
  }

  function updateStatusBar(level) {
    const connectedCount = Object.keys(state.paths).filter(k => isPairConnected(parseInt(k, 10))).length;
    pairsCount.textContent = `${connectedCount} / ${level.pairs.length}`;

    // Update target chips
    if (targetsList) {
      const chips = targetsList.querySelectorAll('.target-chip');
      chips.forEach(chip => {
        const pId = parseInt(chip.dataset.pairId, 10);
        const isDone = isPairConnected(pId);
        const checkSpan = chip.querySelector('.chip-check');
        if (isDone) {
          chip.classList.add('completed');
          if (checkSpan) checkSpan.textContent = '✅';
        } else {
          chip.classList.remove('completed');
          if (checkSpan) checkSpan.textContent = '';
        }
      });
    }

    pairsDots.innerHTML = '';
    level.pairs.forEach(pair => {
      const dot = document.createElement('div');
      dot.className = 'pair-dot';
      if (isPairConnected(pair.id)) {
        dot.classList.add('filled');
        dot.style.backgroundColor = pair.color;
        dot.style.borderColor = pair.color;
      }
      pairsDots.appendChild(dot);
    });
  }

  function isPairConnected(pairId) {
    const level = LEVELS[state.currentLevelIdx];
    const pair = level.pairs.find(p => p.id === pairId);
    const path = state.paths[pairId];
    if (!pair || !path || path.length < 2) return false;

    const first = path[0];
    const last = path[path.length - 1];

    const isMatchAtoB = (first[0] === pair.posA[0] && first[1] === pair.posA[1] &&
                        last[0] === pair.posB[0] && last[1] === pair.posB[1]);
    const isMatchBtoA = (first[0] === pair.posB[0] && first[1] === pair.posB[1] &&
                        last[0] === pair.posA[0] && last[1] === pair.posA[1]);

    return isMatchAtoB || isMatchBtoA;
  }

  function coordsMatch(c1, c2) {
    return c1[0] === c2[0] && c1[1] === c2[1];
  }

  function getCellAtPoint(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    return el.closest('.cell');
  }

  /* =========================================================
     POINTER DRAG & HIGHLIGHT INTERACTIONS
     ========================================================= */
  function activatePartnerHighlight(pairId, sourceEndpoint) {
    const level = LEVELS[state.currentLevelIdx];
    const pair = level.pairs.find(p => p.id === pairId);
    if (!pair) return;

    // Toast guide
    const sourceName = sourceEndpoint === 'A' ? pair.nameA : pair.nameB;
    const sourceEmoji = sourceEndpoint === 'A' ? pair.emojiA : pair.emojiB;
    const targetName = sourceEndpoint === 'A' ? pair.nameB : pair.nameA;
    const targetEmoji = sourceEndpoint === 'A' ? pair.emojiB : pair.emojiA;
    
    setToast(`🔗 Match ${sourceEmoji} ${sourceName} ➔ ${targetEmoji} ${targetName}!`, true);

    const allCells = gridBoard.querySelectorAll('.cell');
    allCells.forEach(c => {
      const cPairId = c.dataset.pairId ? parseInt(c.dataset.pairId, 10) : null;
      const cEndpoint = c.dataset.endpoint;

      if (cPairId === pairId) {
        if (cEndpoint !== sourceEndpoint) {
          c.classList.add('target-partner');
        }
      } else {
        c.classList.add('dimmed');
      }
    });
  }

  function clearPartnerHighlights() {
    const allCells = gridBoard.querySelectorAll('.cell');
    allCells.forEach(c => {
      c.classList.remove('target-partner', 'dimmed', 'active-source');
    });
    resetToast();
  }

  function onPointerDown(e) {
    const cell = getCellAtPoint(e.clientX, e.clientY);
    if (!cell) return;

    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);
    const level = LEVELS[state.currentLevelIdx];

    const pairId = cell.dataset.pairId ? parseInt(cell.dataset.pairId, 10) : null;
    const endpoint = cell.dataset.endpoint;

    if (pairId) {
      sound.playTap();
      state.isDragging = true;
      state.activePairId = pairId;
      state.activePath = [[row, col]];
      state.currentPointerPos = getBoardRelativePoint(e.clientX, e.clientY);
      delete state.paths[pairId];

      cell.classList.add('active-source');
      activatePartnerHighlight(pairId, endpoint);

      renderPipes();
      updateStatusBar(level);
      return;
    }

    // Check if user clicked on an existing pipe path
    for (const [pIdStr, path] of Object.entries(state.paths)) {
      const idx = path.findIndex(pt => pt[0] === row && pt[1] === col);
      if (idx !== -1) {
        sound.playTap();
        const pId = parseInt(pIdStr, 10);
        const pair = level.pairs.find(p => p.id === pId);
        state.isDragging = true;
        state.activePairId = pId;
        state.currentPointerPos = getBoardRelativePoint(e.clientX, e.clientY);
        state.activePath = path.slice(0, idx + 1);
        delete state.paths[pId];

        if (pair) {
          const startPt = state.activePath[0];
          const startedFromA = coordsMatch(startPt, pair.posA);
          activatePartnerHighlight(pId, startedFromA ? 'A' : 'B');
        }

        renderPipes();
        updateStatusBar(level);
        return;
      }
    }
  }

  function onPointerMove(e) {
    if (!state.isDragging || !state.activePairId) return;

    state.currentPointerPos = getBoardRelativePoint(e.clientX, e.clientY);
    renderPipes();

    const cell = getCellAtPoint(e.clientX, e.clientY);
    if (!cell) return;

    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);
    const level = LEVELS[state.currentLevelIdx];
    const pair = level.pairs.find(p => p.id === state.activePairId);
    if (!pair) return;

    const currentHead = state.activePath[state.activePath.length - 1];
    if (!currentHead) return;

    if (coordsMatch(currentHead, [row, col])) return;

    const dist = Math.abs(row - currentHead[0]) + Math.abs(col - currentHead[1]);
    if (dist !== 1) return;

    // Check backtrack
    if (state.activePath.length >= 2) {
      const prev = state.activePath[state.activePath.length - 2];
      if (coordsMatch(prev, [row, col])) {
        state.activePath.pop();
        sound.playStep(state.activePath.length);
        renderPipes();
        return;
      }
    }

    // Check endpoint collision
    const cellPairId = cell.dataset.pairId ? parseInt(cell.dataset.pairId, 10) : null;
    if (cellPairId && cellPairId !== state.activePairId) {
      return;
    }

    // Self intersection
    const selfIdx = state.activePath.findIndex(pt => coordsMatch(pt, [row, col]));
    if (selfIdx !== -1) {
      state.activePath = state.activePath.slice(0, selfIdx + 1);
      renderPipes();
      return;
    }

    // Clear overlapping path of other pairs
    for (const [otherIdStr, otherPath] of Object.entries(state.paths)) {
      const otherId = parseInt(otherIdStr, 10);
      if (otherId === state.activePairId) continue;
      const collisionIdx = otherPath.findIndex(pt => coordsMatch(pt, [row, col]));
      if (collisionIdx !== -1) {
        state.paths[otherId] = otherPath.slice(0, collisionIdx);
        if (state.paths[otherId].length < 2) {
          delete state.paths[otherId];
        }
      }
    }

    // Push new point
    state.activePath.push([row, col]);
    sound.playStep(state.activePath.length);
    renderPipes();

    // Check if reached matching endpoint
    const isTargetA = (row === pair.posA[0] && col === pair.posA[1]);
    const isTargetB = (row === pair.posB[0] && col === pair.posB[1]);
    const startPt = state.activePath[0];
    const startedFromA = coordsMatch(startPt, pair.posA);

    if ((startedFromA && isTargetB) || (!startedFromA && isTargetA)) {
      completeConnection(pair);
    }
  }

  function completeConnection(pair) {
    state.paths[pair.id] = [...state.activePath];
    state.isDragging = false;
    state.activePairId = null;
    state.activePath = [];
    state.currentPointerPos = null;

    sound.playConnect();
    clearPartnerHighlights();

    // Animate target cells
    const cells = gridBoard.querySelectorAll(`.cell[data-pair-id="${pair.id}"]`);
    cells.forEach(c => c.classList.add('connected'));
    setTimeout(() => {
      cells.forEach(c => c.classList.remove('connected'));
    }, 600);

    const level = LEVELS[state.currentLevelIdx];
    updateStatusBar(level);
    renderPipes();

    setToast(`🎉 Connected ${pair.emojiA} ➔ ${pair.emojiB}!`, true);
    setTimeout(() => {
      resetToast();
    }, 1800);

    checkLevelCompletion(level);
  }

  function onPointerUp() {
    if (!state.isDragging) return;

    const level = LEVELS[state.currentLevelIdx];
    if (state.activePairId) {
      if (isPairConnected(state.activePairId)) {
        state.paths[state.activePairId] = [...state.activePath];
      } else {
        if (state.activePath.length > 1) {
          state.paths[state.activePairId] = [...state.activePath];
        }
      }
    }

    state.isDragging = false;
    state.activePairId = null;
    state.activePath = [];
    state.currentPointerPos = null;

    clearPartnerHighlights();

    renderPipes();
    updateStatusBar(level);
    checkLevelCompletion(level);
  }

  function checkLevelCompletion(level) {
    const allPairsConnected = level.pairs.every(p => isPairConnected(p.id));

    if (allPairsConnected) {
      setTimeout(() => {
        sound.playVictory();
        triggerVictory(level);
      }, 350);
    }
  }

  /* =========================================================
     VICTORY & REWARDS MODAL
     ========================================================= */
  function triggerVictory(level) {
    victoryLevelText.textContent = `${level.name} Solved! 🎉`;
    modalVictory.classList.add('active');

    state.levelStars[level.id] = 3;
    if (state.unlockedLevel <= level.id) {
      state.unlockedLevel = level.id + 1;
    }

    try {
      localStorage.setItem('emoji_match_unlocked', state.unlockedLevel.toString());
      localStorage.setItem('emoji_match_stars', JSON.stringify(state.levelStars));
    } catch (e) {}

    createConfetti();
  }

  function createConfetti() {
    confettiContainer.innerHTML = '';
    const colors = ['#ff4d6d', '#ffb703', '#00d2ff', '#38b000', '#a855f7', '#fb8500'];

    for (let i = 0; i < 45; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 0.8}s`;
      piece.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confettiContainer.appendChild(piece);
    }
  }

  /* =========================================================
     HINT SYSTEM
     ========================================================= */
  function provideHint() {
    sound.playHint();
    const level = LEVELS[state.currentLevelIdx];
    const unconnected = level.pairs.find(p => !isPairConnected(p.id));
    if (!unconnected) return;

    if (unconnected.solution) {
      state.paths[unconnected.id] = [...unconnected.solution];
      renderPipes();
      updateStatusBar(level);

      highlightPair(unconnected.id);
      setToast(`💡 Hint: Connected ${unconnected.emojiA} ➔ ${unconnected.emojiB}!`, true);

      const cells = gridBoard.querySelectorAll(`.cell[data-pair-id="${unconnected.id}"]`);
      cells.forEach(c => c.classList.add('connected'));
      setTimeout(() => {
        cells.forEach(c => c.classList.remove('connected'));
      }, 600);

      checkLevelCompletion(level);
    }
  }

  /* =========================================================
     EVENT LISTENERS & BINDINGS
     ========================================================= */
  function initEvents() {
    btnPlay.addEventListener('click', () => {
      sound.playTap();
      const targetLvl = Math.min(state.unlockedLevel - 1, LEVELS.length - 1);
      startLevel(targetLvl);
    });

    btnLevels.addEventListener('click', () => {
      sound.playTap();
      showScreen(screenLevels);
    });

    btnHowTo.addEventListener('click', () => {
      sound.playTap();
      modalHowTo.classList.add('active');
    });

    btnSoundToggle.parentElement.addEventListener('click', () => {
      const on = sound.toggle();
      btnSoundToggle.textContent = on ? '🔊' : '🔇';
    });

    btnLevelsBack.addEventListener('click', () => {
      sound.playTap();
      showScreen(screenHome);
    });

    btnGameBack.addEventListener('click', () => {
      sound.playTap();
      showScreen(screenHome);
    });

    const btnGameSound = document.getElementById('btnGameSound');
    const hintBadge = document.getElementById('hintBadge');
    let hintsRemaining = 3;

    if (btnGameSound) {
      btnGameSound.addEventListener('click', () => {
        const on = sound.toggle();
        btnGameSound.textContent = on ? '🔊' : '🔇';
        if (btnSoundToggle) btnSoundToggle.textContent = on ? '🔊' : '🔇';
      });
    }

    btnReset.addEventListener('click', () => {
      sound.playReset();
      state.paths = {};
      state.activePath = [];
      state.activePairId = null;
      renderPipes();
      updateStatusBar(LEVELS[state.currentLevelIdx]);
      resetToast();
    });

    btnHint.addEventListener('click', () => {
      provideHint();
      if (hintsRemaining > 0) {
        hintsRemaining--;
        if (hintBadge) hintBadge.textContent = hintsRemaining;
      }
    });

    btnCloseHowTo.addEventListener('click', () => {
      modalHowTo.classList.remove('active');
    });
    btnGotIt.addEventListener('click', () => {
      sound.playTap();
      modalHowTo.classList.remove('active');
    });

    btnNextLevel.addEventListener('click', () => {
      modalVictory.classList.remove('active');
      const nextIdx = state.currentLevelIdx + 1;
      if (nextIdx < LEVELS.length) {
        startLevel(nextIdx);
      } else {
        showScreen(screenLevels);
      }
    });

    btnReplay.addEventListener('click', () => {
      modalVictory.classList.remove('active');
      startLevel(state.currentLevelIdx);
    });

    btnSelectLevelFromWin.addEventListener('click', () => {
      modalVictory.classList.remove('active');
      showScreen(screenLevels);
    });

    // Board touch & pointer gestures
    boardWrapper.addEventListener('pointerdown', (e) => {
      sound.init();
      onPointerDown(e);
    });

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    window.addEventListener('resize', () => {
      resizeCanvas();
    });
  }

  // Initialize game on load
  window.addEventListener('DOMContentLoaded', () => {
    initBackground();
    initEvents();
    if (window.twemoji) {
      window.twemoji.parse(document.body, { folder: 'svg', ext: '.svg' });
    }
  });

})();
