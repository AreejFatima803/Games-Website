/**
 * MERGE CAFE - GAME ENGINE
 * Full-featured Merge-2 casual restaurant game engine
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.soundEnabled = true;
      this.musicEnabled = true;
      this.musicInterval = null;
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

    playTap() {
      if (!this.soundEnabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    }

    playPop() {
      if (!this.soundEnabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    }

    playMerge() {
      if (!this.soundEnabled) return;
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.04);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.04 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.04);
        osc.stop(this.ctx.currentTime + i * 0.04 + 0.2);
      });
    }

    playCash() {
      if (!this.soundEnabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    }

    playSpawn() {
      if (!this.soundEnabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    }

    playUnlock() {
      if (!this.soundEnabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    }

    playFanfare() {
      if (!this.soundEnabled) return;
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.38);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 0.38);
      });
    }

    startAmbientMusic() {
      if (!this.musicEnabled || this.musicInterval) return;
      const chords = [
        [261.63, 329.63, 392.00], // C
        [220.00, 261.63, 329.63], // Am
        [174.61, 220.00, 261.63], // F
        [196.00, 246.94, 293.66], // G
      ];
      let step = 0;
      this.musicInterval = setInterval(() => {
        if (!this.musicEnabled || !this.ctx) return;
        const currentChord = chords[step % chords.length];
        currentChord.forEach((freq, noteIdx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + noteIdx * 0.12);
          gain.gain.setValueAtTime(0.03, this.ctx.currentTime + noteIdx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + noteIdx * 0.12 + 0.6);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + noteIdx * 0.12);
          osc.stop(this.ctx.currentTime + noteIdx * 0.12 + 0.6);
        });
        step++;
      }, 1600);
    }

    stopAmbientMusic() {
      if (this.musicInterval) {
        clearInterval(this.musicInterval);
        this.musicInterval = null;
      }
    }
  }

  const sound = new SoundEngine();

  // --- ITEM DATABASE & SVG GRAPHICS SYSTEM ---
  const ITEM_CHAINS = {
    toast: {
      name: 'Bread & Toast',
      icon: '🍞',
      items: [
        { id: 'toast_1', level: 1, name: 'Bread Slices', desc: 'Fresh cut white bread slices.', price: 1, svg: createSvgBreadSlice() },
        { id: 'toast_2', level: 2, name: 'Golden Toast', desc: 'Crispy warm browned toast.', price: 2, svg: createSvgToast() },
        { id: 'toast_3', level: 3, name: 'Egg Toast', desc: 'Sunny-side fried egg on hot buttery toast.', price: 4, svg: createSvgEggToast() },
        { id: 'toast_4', level: 4, name: 'Ham Toast', desc: 'Toasted bread with savoury ham slice.', price: 8, svg: createSvgHamToast() },
        { id: 'toast_5', level: 5, name: 'Club Sandwich', desc: 'Triple layer sandwich with veggies and cheese.', price: 16, svg: createSvgClubSandwich() },
        { id: 'toast_6', level: 6, name: 'Gourmet Burger', desc: 'Juicy beef patty in toasted sesame bun.', price: 32, svg: createSvgBurger() },
        { id: 'toast_7', level: 7, name: 'Royal Platter', desc: 'Luxurious full English breakfast.', price: 64, svg: createSvgPlatter() }
      ]
    },
    bakery: {
      name: 'Bakery & Pastries',
      icon: '🥐',
      items: [
        { id: 'bakery_1', level: 1, name: 'Flour Dough', desc: 'Kneaded flour dough ball.', price: 1, svg: createSvgDough() },
        { id: 'bakery_2', level: 2, name: 'Butter Croissant', desc: 'Flaky crescent French pastry.', price: 2, svg: createSvgCroissant() },
        { id: 'bakery_3', level: 3, name: 'Sausage Roll', desc: 'Crispy baked puff pastry hotdog roll.', price: 4, svg: createSvgSausageRoll() },
        { id: 'bakery_4', level: 4, name: 'Pancake Stack', desc: 'Fluffy stack topped with syrup & berries.', price: 8, svg: createSvgPancakes() },
        { id: 'bakery_5', level: 5, name: 'Berry Waffle Plate', desc: 'Belgian waffles with fresh strawberry cream.', price: 16, svg: createSvgWaffle() },
        { id: 'bakery_6', level: 6, name: 'Celebration Cake', desc: 'Grand 3-tier festive strawberry cake.', price: 32, svg: createSvgCake() }
      ]
    },
    drinks: {
      name: 'Cafe Beverages',
      icon: '🍹',
      items: [
        { id: 'drinks_1', level: 1, name: 'Ice Cup', desc: 'Chilled glass with sparkling ice cubes.', price: 1, svg: createSvgIceCup() },
        { id: 'drinks_2', level: 2, name: 'Lemon Water', desc: 'Refreshing citrus infused water.', price: 2, svg: createSvgLemonade() },
        { id: 'drinks_3', level: 3, name: 'Iced Fruit Tea', desc: 'Brewed black tea with berry zest.', price: 4, svg: createSvgIcedTea() },
        { id: 'drinks_4', level: 4, name: 'Mint Mojito Jar', desc: 'Mason jar with fresh lime and mint leaves.', price: 8, svg: createSvgMojito() },
        { id: 'drinks_5', level: 5, name: 'Berry Smoothie', desc: 'Thick blended creamy berry drink.', price: 16, svg: createSvgSmoothie() },
        { id: 'drinks_6', level: 6, name: 'Rainbow Parfait', desc: 'Multi-layer ice cream sundae cup.', price: 32, svg: createSvgParfait() }
      ]
    },
    generators: {
      name: 'Kitchen Appliances',
      icon: '⚡',
      items: [
        { id: 'gen_pan', level: 1, name: 'Frying Pan', desc: '🚫 BANNED CREATOR (یہ کریٹر بین ہے)', isGenerator: true, isBanned: true, spawns: [], svg: createSvgFryingPan() },
        { id: 'gen_toaster', level: 2, name: 'Master Creator', desc: '⚡ Active Creator! Taps to produce ingredients, toasts & drinks! (⚡ 1)', isGenerator: true, isBanned: false, spawns: ['toast_1', 'toast_2', 'bakery_1', 'drinks_1'], svg: createSvgToaster() },
        { id: 'gen_pantry', level: 3, name: 'Ingredient Pantry', desc: '🚫 BANNED CREATOR (یہ کریٹر بین ہے)', isGenerator: true, isBanned: true, spawns: [], svg: createSvgPantry() },
        { id: 'gen_juicer', level: 4, name: 'Beverage Station', desc: '🚫 BANNED CREATOR (یہ کریٹر بین ہے)', isGenerator: true, isBanned: true, spawns: [], svg: createSvgJuicer() }
      ]
    }
  };

  // Helper map for quick ID lookups
  const ITEM_MAP = {};
  Object.values(ITEM_CHAINS).forEach(chain => {
    chain.items.forEach(item => {
      ITEM_MAP[item.id] = { ...item, chainId: chain.name };
    });
  });

  // --- SVG GRAPHIC BUILDERS (Crisp & High Quality Vectors) ---
  function createSvgBreadSlice() {
    return `<svg viewBox="0 0 100 100">
      <rect x="25" y="25" width="50" height="50" rx="14" fill="#d99959" stroke="#965c27" stroke-width="4"/>
      <rect x="30" y="30" width="40" height="40" rx="10" fill="#f8e5c2"/>
      <circle cx="42" cy="45" r="3" fill="#e8c89b"/>
      <circle cx="58" cy="52" r="4" fill="#e8c89b"/>
      <circle cx="48" cy="60" r="2.5" fill="#e8c89b"/>
    </svg>`;
  }

  function createSvgToast() {
    return `<svg viewBox="0 0 100 100">
      <rect x="22" y="20" width="56" height="56" rx="14" fill="#bd7639" stroke="#7a4214" stroke-width="4"/>
      <rect x="28" y="26" width="44" height="44" rx="10" fill="#eab97c"/>
      <path d="M35 38 Q50 30 65 40 Q55 58 35 38" fill="#d1924b" opacity="0.6"/>
      <rect x="42" y="44" width="16" height="12" rx="3" fill="#ffe259" stroke="#dba516" stroke-width="2"/>
    </svg>`;
  }

  function createSvgEggToast() {
    return `<svg viewBox="0 0 100 100">
      <rect x="20" y="22" width="60" height="56" rx="14" fill="#b36d31" stroke="#743e11" stroke-width="4"/>
      <rect x="26" y="28" width="48" height="44" rx="10" fill="#f0c28a"/>
      <!-- Fried Egg -->
      <path d="M34 50 C32 38 48 34 56 38 C68 40 70 55 64 62 C56 70 40 68 34 50 Z" fill="#ffffff" stroke="#e0dedb" stroke-width="2"/>
      <!-- Yolk -->
      <circle cx="50" cy="50" r="11" fill="#ffb703" stroke="#e88900" stroke-width="2.5"/>
      <circle cx="46" cy="46" r="3.5" fill="#fff5cc"/>
      <!-- Garnish -->
      <circle cx="38" cy="56" r="1.5" fill="#2d6a4f"/>
      <circle cx="62" cy="44" r="1.5" fill="#2d6a4f"/>
    </svg>`;
  }

  function createSvgHamToast() {
    return `<svg viewBox="0 0 100 100">
      <rect x="20" y="22" width="60" height="56" rx="14" fill="#b36d31" stroke="#743e11" stroke-width="4"/>
      <rect x="26" y="28" width="48" height="44" rx="10" fill="#f0c28a"/>
      <!-- Ham slice -->
      <rect x="32" y="34" width="36" height="32" rx="8" fill="#f28482" stroke="#d65755" stroke-width="2.5"/>
      <path d="M38 42 Q50 48 62 42" stroke="#e56b69" stroke-width="2" fill="none"/>
      <rect x="42" y="46" width="16" height="8" rx="2" fill="#ffd166" opacity="0.8"/>
    </svg>`;
  }

  function createSvgClubSandwich() {
    return `<svg viewBox="0 0 100 100">
      <!-- Triangle Sandwich Top -->
      <path d="M22 68 L50 24 L78 68 Z" fill="#d49b57" stroke="#87531c" stroke-width="4"/>
      <path d="M28 65 L50 30 L72 65 Z" fill="#fbe3b5"/>
      <!-- Layers: lettuce, tomato, cheese -->
      <path d="M26 56 Q50 62 74 56" stroke="#40916c" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M30 60 Q50 65 70 60" stroke="#e63946" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M34 50 L66 50" stroke="#ffb703" stroke-width="4" stroke-linecap="round"/>
      <!-- Toothpick with olive -->
      <line x1="50" y1="14" x2="50" y2="35" stroke="#99582a" stroke-width="3"/>
      <circle cx="50" cy="14" r="5" fill="#52b788" stroke="#2d6a4f" stroke-width="2"/>
    </svg>`;
  }

  function createSvgBurger() {
    return `<svg viewBox="0 0 100 100">
      <!-- Top Bun -->
      <path d="M24 45 C24 25 76 25 76 45 Z" fill="#e09f3e" stroke="#8c5311" stroke-width="3.5"/>
      <ellipse cx="38" cy="35" rx="2" ry="1.2" fill="#fff3b0"/>
      <ellipse cx="50" cy="30" rx="2" ry="1.2" fill="#fff3b0"/>
      <ellipse cx="62" cy="36" rx="2" ry="1.2" fill="#fff3b0"/>
      <!-- Lettuce -->
      <path d="M20 48 Q35 55 50 48 Q65 55 80 48" stroke="#52b788" stroke-width="5" fill="none" stroke-linecap="round"/>
      <!-- Tomato -->
      <rect x="25" y="52" width="50" height="5" rx="2.5" fill="#e63946"/>
      <!-- Patty -->
      <rect x="22" y="58" width="56" height="10" rx="5" fill="#542e11" stroke="#321704" stroke-width="2"/>
      <!-- Cheese -->
      <path d="M28 58 L45 68 L55 58 L72 58" fill="#ffb703"/>
      <!-- Bottom Bun -->
      <rect x="24" y="69" width="52" height="12" rx="6" fill="#e09f3e" stroke="#8c5311" stroke-width="3"/>
    </svg>`;
  }

  function createSvgPlatter() {
    return `<svg viewBox="0 0 100 100">
      <ellipse cx="50" cy="55" rx="44" ry="34" fill="#edf2f4" stroke="#8d99ae" stroke-width="4"/>
      <ellipse cx="50" cy="53" rx="38" ry="28" fill="#ffffff"/>
      <!-- Bacon strips -->
      <path d="M24 48 Q35 44 46 48 Q35 52 24 48" fill="#9e2a2b"/>
      <path d="M26 56 Q37 52 48 56 Q37 60 26 56" fill="#9e2a2b"/>
      <!-- Two eggs -->
      <circle cx="62" cy="46" r="10" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
      <circle cx="62" cy="46" r="4.5" fill="#ffb703"/>
      <circle cx="66" cy="62" r="10" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
      <circle cx="66" cy="62" r="4.5" fill="#ffb703"/>
      <!-- Sausage -->
      <rect x="36" y="65" width="22" height="8" rx="4" transform="rotate(-15 47 69)" fill="#7209b7" stroke="#480ca8" stroke-width="1.5"/>
    </svg>`;
  }

  function createSvgDough() {
    return `<svg viewBox="0 0 100 100">
      <ellipse cx="50" cy="55" rx="32" ry="26" fill="#faedcd" stroke="#d4a373" stroke-width="4"/>
      <path d="M36 45 Q50 38 64 45" stroke="#e9d8a6" stroke-width="3" fill="none"/>
      <!-- Dust particles -->
      <circle cx="30" cy="35" r="2" fill="#fefae0"/>
      <circle cx="70" cy="40" r="2" fill="#fefae0"/>
      <circle cx="52" cy="28" r="2.5" fill="#fefae0"/>
    </svg>`;
  }

  function createSvgCroissant() {
    return `<svg viewBox="0 0 100 100">
      <path d="M20 62 C25 40 45 30 50 30 C55 30 75 40 80 62 C72 58 60 52 50 52 C40 52 28 58 20 62 Z" fill="#d48b38" stroke="#874e0d" stroke-width="4"/>
      <path d="M34 56 C38 42 46 36 50 36 C54 36 62 42 66 56" stroke="#f6bd60" stroke-width="4" fill="none"/>
      <path d="M42 54 C45 44 48 40 50 40 C52 40 55 44 58 54" stroke="#ffea00" stroke-width="2" fill="none"/>
    </svg>`;
  }

  function createSvgSausageRoll() {
    return `<svg viewBox="0 0 100 100">
      <rect x="22" y="36" width="56" height="28" rx="14" fill="#e09f3e" stroke="#874e0d" stroke-width="4"/>
      <circle cx="26" cy="50" r="10" fill="#a44a3f" stroke="#682d27" stroke-width="3"/>
      <circle cx="26" cy="50" r="4" fill="#f28482"/>
      <path d="M42 38 L48 62" stroke="#fefae0" stroke-width="3"/>
      <path d="M54 38 L60 62" stroke="#fefae0" stroke-width="3"/>
      <path d="M66 38 L72 62" stroke="#fefae0" stroke-width="3"/>
    </svg>`;
  }

  function createSvgPancakes() {
    return `<svg viewBox="0 0 100 100">
      <ellipse cx="50" cy="68" rx="36" ry="12" fill="#d4903b" stroke="#7d4f12" stroke-width="3"/>
      <ellipse cx="50" cy="58" rx="34" ry="11" fill="#e09f3e" stroke="#7d4f12" stroke-width="3"/>
      <ellipse cx="50" cy="48" rx="32" ry="10" fill="#f3b759" stroke="#7d4f12" stroke-width="3"/>
      <!-- Butter cube & syrup -->
      <rect x="44" y="34" width="12" height="9" rx="2" fill="#ffea00" stroke="#cca000" stroke-width="2"/>
      <path d="M48 43 Q46 55 40 65" stroke="#78350f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="62" cy="42" r="4" fill="#e63946"/>
    </svg>`;
  }

  function createSvgWaffle() {
    return `<svg viewBox="0 0 100 100">
      <ellipse cx="50" cy="58" rx="40" ry="28" fill="#ffccd5" stroke="#c9184a" stroke-width="3"/>
      <ellipse cx="50" cy="54" rx="34" ry="22" fill="#e09f3e" stroke="#874e0d" stroke-width="3"/>
      <!-- Grid holes -->
      <rect x="34" y="42" width="8" height="8" rx="2" fill="#a05d1c"/>
      <rect x="46" y="42" width="8" height="8" rx="2" fill="#a05d1c"/>
      <rect x="58" y="42" width="8" height="8" rx="2" fill="#a05d1c"/>
      <rect x="40" y="54" width="8" height="8" rx="2" fill="#a05d1c"/>
      <rect x="52" y="54" width="8" height="8" rx="2" fill="#a05d1c"/>
      <!-- Whipped Cream & Strawberries -->
      <circle cx="50" cy="40" r="10" fill="#ffffff" stroke="#f8edeb" stroke-width="2"/>
      <path d="M48 26 L56 38 L40 38 Z" fill="#e63946" stroke="#9b2226" stroke-width="2"/>
      <circle cx="49" cy="33" r="1" fill="#fff0f3"/>
    </svg>`;
  }

  function createSvgCake() {
    return `<svg viewBox="0 0 100 100">
      <!-- Plate -->
      <ellipse cx="50" cy="80" rx="42" ry="10" fill="#e9ecef" stroke="#adb5bd" stroke-width="3"/>
      <!-- Bottom Layer -->
      <rect x="22" y="55" width="56" height="24" rx="6" fill="#f4acb7" stroke="#9d4edd" stroke-width="3"/>
      <!-- Cream drips -->
      <path d="M22 62 Q30 70 38 62 Q46 70 54 62 Q62 70 70 62 Q78 70 78 62" stroke="#ffffff" stroke-width="4" fill="none"/>
      <!-- Top Layer -->
      <rect x="32" y="38" width="36" height="18" rx="4" fill="#ffccd5" stroke="#9d4edd" stroke-width="3"/>
      <!-- Strawberries / Candies on top -->
      <circle cx="38" cy="34" r="4" fill="#e63946"/>
      <circle cx="50" cy="34" r="4" fill="#e63946"/>
      <circle cx="62" cy="34" r="4" fill="#e63946"/>
      <!-- Candle -->
      <rect x="48" y="20" width="4" height="14" fill="#ffb703"/>
      <circle cx="50" cy="16" r="3" fill="#ff006e"/>
    </svg>`;
  }

  function createSvgIceCup() {
    return `<svg viewBox="0 0 100 100">
      <path d="M30 25 L36 78 L64 78 L70 25 Z" fill="#e0fbfc" stroke="#90e0ef" stroke-width="3.5" opacity="0.85"/>
      <rect x="40" y="45" width="10" height="10" rx="2" fill="#ffffff" stroke="#bde0fe" stroke-width="2"/>
      <rect x="52" y="56" width="10" height="10" rx="2" fill="#ffffff" stroke="#bde0fe" stroke-width="2"/>
      <rect x="42" y="62" width="9" height="9" rx="2" fill="#ffffff" stroke="#bde0fe" stroke-width="2"/>
    </svg>`;
  }

  function createSvgLemonade() {
    return `<svg viewBox="0 0 100 100">
      <path d="M30 25 L36 78 L64 78 L70 25 Z" fill="#fff3b0" stroke="#f6bd60" stroke-width="3.5"/>
      <!-- Lemon wheel on rim -->
      <circle cx="34" cy="26" r="10" fill="#fee440" stroke="#e09f3e" stroke-width="2.5"/>
      <circle cx="34" cy="26" r="6" fill="#ffffff"/>
      <!-- Straw -->
      <line x1="50" y1="80" x2="68" y2="12" stroke="#38b000" stroke-width="4" stroke-linecap="round"/>
    </svg>`;
  }

  function createSvgIcedTea() {
    return `<svg viewBox="0 0 100 100">
      <path d="M30 25 L36 78 L64 78 L70 25 Z" fill="#e76f51" stroke="#9a031e" stroke-width="3.5"/>
      <rect x="42" y="44" width="10" height="10" rx="2" fill="#ffffff" opacity="0.6"/>
      <rect x="50" y="58" width="10" height="10" rx="2" fill="#ffffff" opacity="0.6"/>
      <!-- Berry garnish -->
      <circle cx="38" cy="30" r="5" fill="#7209b7"/>
      <!-- Straw -->
      <line x1="52" y1="80" x2="66" y2="12" stroke="#f72585" stroke-width="4" stroke-linecap="round"/>
    </svg>`;
  }

  function createSvgMojito() {
    return `<svg viewBox="0 0 100 100">
      <!-- Mason Jar (Matching Screenshot) -->
      <rect x="28" y="26" width="44" height="52" rx="8" fill="#d8f3dc" stroke="#52b788" stroke-width="3.5"/>
      <!-- Jar Handle -->
      <path d="M72 38 C84 38 84 62 72 62" stroke="#52b788" stroke-width="4" fill="none"/>
      <!-- Lime & Mint leaves inside -->
      <circle cx="44" cy="50" r="7" fill="#95d5b2" stroke="#2d6a4f" stroke-width="2"/>
      <path d="M48 22 C42 12 56 10 54 22 Z" fill="#40916c"/>
      <path d="M42 22 C34 14 46 12 44 22 Z" fill="#2d6a4f"/>
      <!-- Striped Straw -->
      <line x1="42" y1="70" x2="60" y2="10" stroke="#ff4d6d" stroke-width="4" stroke-linecap="round"/>
      <circle cx="56" cy="58" r="4" fill="#ffffff" opacity="0.7"/>
    </svg>`;
  }

  function createSvgSmoothie() {
    return `<svg viewBox="0 0 100 100">
      <path d="M30 30 L36 82 L64 82 L70 30 Z" fill="#f72585" stroke="#b5179e" stroke-width="3.5"/>
      <!-- Whipped dome -->
      <ellipse cx="50" cy="30" rx="20" ry="10" fill="#ffffff" stroke="#f8edeb" stroke-width="2"/>
      <circle cx="50" cy="22" r="5" fill="#e63946"/>
      <!-- Straw -->
      <line x1="48" y1="80" x2="68" y2="8" stroke="#4cc9f0" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
  }

  function createSvgParfait() {
    return `<svg viewBox="0 0 100 100">
      <!-- Stem Glass -->
      <path d="M28 20 L35 55 L50 62 L65 55 L72 20 Z" fill="#caf0f8" stroke="#48cae4" stroke-width="3"/>
      <line x1="50" y1="62" x2="50" y2="82" stroke="#48cae4" stroke-width="4"/>
      <rect x="36" y="80" width="28" height="5" rx="2.5" fill="#48cae4"/>
      <!-- Rainbow Scoop Layers -->
      <ellipse cx="50" cy="48" rx="14" ry="7" fill="#ffbe0b"/>
      <ellipse cx="50" cy="38" rx="16" ry="8" fill="#fb5607"/>
      <ellipse cx="50" cy="28" rx="18" ry="9" fill="#ff006e"/>
      <circle cx="50" cy="18" r="5" fill="#d90429"/>
      <!-- Wafer stick -->
      <line x1="60" y1="36" x2="76" y2="10" stroke="#7f4f24" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`;
  }

  function createSvgFryingPan() {
    return `<svg viewBox="0 0 100 100">
      <!-- Pan Body -->
      <circle cx="48" cy="48" r="28" fill="#5c677d" stroke="#33415c" stroke-width="4"/>
      <circle cx="48" cy="48" r="22" fill="#7d8597"/>
      <!-- Handle -->
      <path d="M28 68 L14 82" stroke="#936639" stroke-width="7" stroke-linecap="round"/>
      <circle cx="16" cy="80" r="2" fill="#ffffff"/>
      <!-- Cooking egg sizzle -->
      <circle cx="48" cy="48" r="9" fill="#ffffff"/>
      <circle cx="48" cy="48" r="4.5" fill="#ffb703"/>
    </svg>`;
  }

  function createSvgToaster() {
    return `<svg viewBox="0 0 100 100">
      <!-- Sandwich Press / Toaster (Matches Screenshot) -->
      <rect x="24" y="32" width="52" height="38" rx="8" fill="#3a86ff" stroke="#184e77" stroke-width="4"/>
      <rect x="24" y="52" width="52" height="24" rx="6" fill="#1e6091"/>
      <path d="M30 42 L70 42" stroke="#ffb703" stroke-width="4"/>
      <line x1="68" y1="58" x2="80" y2="58" stroke="#ffb703" stroke-width="4" stroke-linecap="round"/>
      <!-- Glowing toast popped up -->
      <rect x="34" y="20" width="32" height="20" rx="4" fill="#e09f3e" stroke="#874e0d" stroke-width="2.5"/>
    </svg>`;
  }

  function createSvgPantry() {
    return `<svg viewBox="0 0 100 100">
      <!-- Wooden Shelf Rack (Matches Screenshot) -->
      <rect x="22" y="24" width="56" height="56" rx="6" fill="#dda15e" stroke="#8c5319" stroke-width="3.5"/>
      <line x1="22" y1="48" x2="78" y2="48" stroke="#8c5319" stroke-width="3.5"/>
      <rect x="30" y="32" width="14" height="14" rx="3" fill="#ffffff" stroke="#adb5bd" stroke-width="2"/>
      <rect x="52" y="30" width="16" height="16" rx="4" fill="#faedcd" stroke="#d4a373" stroke-width="2"/>
      <rect x="28" y="54" width="20" height="20" rx="4" fill="#f28482" stroke="#d65755" stroke-width="2"/>
      <circle cx="62" cy="64" r="8" fill="#90be6d"/>
    </svg>`;
  }

  function createSvgJuicer() {
    return `<svg viewBox="0 0 100 100">
      <!-- Beverage Station Dispenser -->
      <rect x="28" y="22" width="44" height="42" rx="6" fill="#e0fbfc" stroke="#3d5a80" stroke-width="3.5"/>
      <rect x="24" y="64" width="52" height="22" rx="4" fill="#293241"/>
      <circle cx="50" cy="44" r="12" fill="#f72585" opacity="0.8"/>
      <rect x="46" y="58" width="8" height="10" fill="#98c1d9"/>
      <circle cx="50" cy="75" r="4" fill="#06d6a0"/>
    </svg>`;
  }

  // --- CUSTOMER AVATAR SYSTEM (Rich Vector SVGs) ---
  const CUSTOMER_AVATARS = [
    {
      name: 'Chef Mia',
      svg: `<svg viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="38" fill="#ffd166"/>
        <!-- Chef Hat -->
        <path d="M26 32 C20 18 60 18 54 32 Z" fill="#ffffff" stroke="#d4a373" stroke-width="2"/>
        <circle cx="34" cy="20" r="10" fill="#ffffff"/>
        <circle cx="46" cy="20" r="10" fill="#ffffff"/>
        <circle cx="40" cy="14" r="10" fill="#ffffff"/>
        <!-- Face -->
        <circle cx="40" cy="44" r="18" fill="#ffddb0"/>
        <circle cx="34" cy="42" r="2.5" fill="#3d2614"/>
        <circle cx="46" cy="42" r="2.5" fill="#3d2614"/>
        <path d="M36 50 Q40 54 44 50" stroke="#b04224" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- Orange Cap / Band -->
        <rect x="28" y="32" width="24" height="6" rx="2" fill="#ff7b00"/>
      </svg>`
    },
    {
      name: 'Barista Leo',
      svg: `<svg viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="38" fill="#a0c4ff"/>
        <!-- Hair / Cap -->
        <path d="M24 38 C24 22 56 22 56 38 Z" fill="#4a2810"/>
        <circle cx="40" cy="45" r="18" fill="#ffddb0"/>
        <!-- Glasses -->
        <circle cx="33" cy="43" r="5" fill="none" stroke="#222" stroke-width="2"/>
        <circle cx="47" cy="43" r="5" fill="none" stroke="#222" stroke-width="2"/>
        <line x1="38" y1="43" x2="42" y2="43" stroke="#222" stroke-width="2"/>
        <circle cx="33" cy="43" r="2" fill="#222"/>
        <circle cx="47" cy="43" r="2" fill="#222"/>
        <path d="M37 52 Q40 56 43 52" stroke="#b04224" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>`
    },
    {
      name: 'Foodie Emily',
      svg: `<svg viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="38" fill="#ffc6ff"/>
        <!-- Hair -->
        <path d="M22 42 C18 20 62 20 58 42 C64 54 58 64 58 64 C58 64 22 64 22 42 Z" fill="#8338ec"/>
        <circle cx="40" cy="45" r="17" fill="#ffe5d9"/>
        <circle cx="35" cy="44" r="2.5" fill="#3d2614"/>
        <circle cx="45" cy="44" r="2.5" fill="#3d2614"/>
        <ellipse cx="32" cy="49" rx="3" ry="2" fill="#ff85a1"/>
        <ellipse cx="48" cy="49" rx="3" ry="2" fill="#ff85a1"/>
        <path d="M37 53 Q40 57 43 53" stroke="#b04224" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </svg>`
    }
  ];

  // --- 12 LEVELS PROGRESSION SYSTEM ---
  const LEVELS_DATA = [
    { level: 1, title: 'Cafe Trainee', titleUrdu: 'نو آموز شیف', icon: '🍞', reqXp: 30, rewards: { cash: 50, gems: 5, energy: 30, desc: '+50 💵 Cash, +5 💎 Gems, +30 ⚡ Energy' } },
    { level: 2, title: 'Toast Artisan', titleUrdu: 'ٹوست کاریگر', icon: '🥪', reqXp: 60, rewards: { cash: 80, gems: 8, energy: 40, desc: '+80 💵 Cash, +8 💎 Gems, +40 ⚡ Energy' } },
    { level: 3, title: 'Barista Novice', titleUrdu: 'کافی ماسٹر', icon: '☕', reqXp: 100, rewards: { cash: 120, gems: 12, maxEnergy: 5, energy: 50, desc: '+120 💵 Cash, +12 💎 Gems, +5 Max Energy ⚡' } },
    { level: 4, title: 'Pastry Apprentice', titleUrdu: 'بیکری شیف', icon: '🥐', reqXp: 160, rewards: { cash: 160, gems: 15, energy: 50, desc: '+160 💵 Cash, +15 💎 Gems, +50 ⚡ Energy' } },
    { level: 5, title: 'Brunch Specialist', titleUrdu: 'برنچ ماہر', icon: '🥞', reqXp: 240, rewards: { cash: 220, gems: 20, maxEnergy: 5, energy: 60, desc: '+220 💵 Cash, +20 💎 Gems, +5 Max Energy ⚡' } },
    { level: 6, title: 'Cafe Manager', titleUrdu: 'کیفے مینیجر', icon: '📋', reqXp: 340, rewards: { cash: 300, gems: 25, energy: 70, desc: '+300 💵 Cash, +25 💎 Gems, +70 ⚡ Energy' } },
    { level: 7, title: 'Dessert Maestro', titleUrdu: 'ڈیزرٹ ماسٹر', icon: '🍰', reqXp: 460, rewards: { cash: 400, gems: 30, maxEnergy: 5, energy: 80, desc: '+400 💵 Cash, +30 💎 Gems, +5 Max Energy ⚡' } },
    { level: 8, title: 'Beverage Mixologist', titleUrdu: 'شربت ساز', icon: '🍹', reqXp: 600, rewards: { cash: 500, gems: 35, energy: 80, desc: '+500 💵 Cash, +35 💎 Gems, +80 ⚡ Energy' } },
    { level: 9, title: 'Gourmet Chef', titleUrdu: 'شاہی باورچی', icon: '🍔', reqXp: 780, rewards: { cash: 650, gems: 40, maxEnergy: 5, energy: 90, desc: '+650 💵 Cash, +40 💎 Gems, +5 Max Energy ⚡' } },
    { level: 10, title: 'Michelin Starred', titleUrdu: 'میشلین اسٹار کیفے', icon: '⭐', reqXp: 1000, rewards: { cash: 800, gems: 50, energy: 100, desc: '+800 💵 Cash, +50 💎 Gems, +100 ⚡ Energy' } },
    { level: 11, title: 'Celebrity Master', titleUrdu: 'عالمی شیف', icon: '🌟', reqXp: 1300, rewards: { cash: 1000, gems: 70, maxEnergy: 10, energy: 100, desc: '+1000 💵 Cash, +70 💎 Gems, +10 Max Energy ⚡' } },
    { level: 12, title: 'Grand Cafe Legend 👑', titleUrdu: 'کیفے لیجنڈ ماسٹر', icon: '👑', reqXp: 1700, rewards: { cash: 2000, gems: 150, energy: 100, desc: '+2000 💵 Cash, +150 💎 Gems, 👑 Royal Crown' } }
  ];

  // --- GAME STATE MANAGER ---
  const DEFAULT_STATE = {
    level: 1,
    unlockedLevel: 1,
    xp: 0,
    energy: 94,
    maxEnergy: 100,
    cash: 10,
    gems: 25,
    lastEnergyTime: Date.now(),
    grid: [], // 63 tiles (9 cols x 7 rows)
    storage: [null, null, null, null, null, null],
    orders: [],
    quests: [
      { id: 'q_floor', title: 'Clean Cafe Flooring', cost: 15, done: false, icon: '🧹' },
      { id: 'q_walls', title: 'Paint Cozy Wood Walls', cost: 30, done: false, icon: '🎨' },
      { id: 'q_counter', title: 'Install Marble Counter', cost: 50, done: false, icon: '☕' },
      { id: 'q_sign', title: 'Hang Glowing Neon Sign', cost: 80, done: false, icon: '✨' },
      { id: 'q_tables', title: 'Place Customer Dining Tables', cost: 120, done: false, icon: '🪑' }
    ],
    discoveredItems: ['toast_1', 'toast_2', 'toast_3', 'toast_4', 'toast_5', 'gen_toaster', 'gen_pan', 'drinks_4', 'bakery_3', 'bakery_5']
  };

  class MergeCafeGame {
    constructor() {
      this.COLS = 9;
      this.ROWS = 7;
      this.TOTAL_TILES = this.COLS * this.ROWS;
      
      this.state = null;
      this.selectedCellIndex = null;
      this.draggedIndex = null;
      this.draggedFrom = null; // 'grid' or 'storage'
      this.dragGhost = null;

      this.initElements();
      this.loadState();
      this.setupTimers();
      this.bindEvents();
      this.renderAll();
    }

    initElements() {
      this.el = {
        gridBoard: document.getElementById('grid-board'),
        energyCount: document.getElementById('energy-count'),
        energyTimer: document.getElementById('energy-timer'),
        cashCount: document.getElementById('cash-count'),
        gemsCount: document.getElementById('gems-count'),
        ordersList: document.getElementById('orders-list'),
        
        // Level elements
        playerLevel: document.getElementById('player-level'),
        levelBarFill: document.getElementById('level-bar-fill'),
        levelBtn: document.getElementById('level-btn'),

        // Selected card elements
        selThumb: document.getElementById('sel-thumb'),
        selLevel: document.getElementById('sel-level'),
        selName: document.getElementById('sel-name'),
        selDesc: document.getElementById('sel-desc'),
        sellPrice: document.getElementById('sell-price'),
        sellBtn: document.getElementById('sell-btn'),
        itemInfoBtn: document.getElementById('item-info-btn'),
        
        // Float Action buttons
        storageBtn: document.getElementById('storage-btn'),
        storageBadge: document.getElementById('storage-badge'),
        renovateBtn: document.getElementById('renovate-btn'),
        questAlertBadge: document.getElementById('quest-alert-badge'),
        recipeBookBtn: document.getElementById('recipe-book-btn'),
        settingsBtn: document.getElementById('settings-btn'),
        energyBtn: document.getElementById('energy-btn'),
        cashBtn: document.getElementById('cash-btn'),
        gemsBtn: document.getElementById('gems-btn'),
        
        // Level Modal (12 Levels Roadmap)
        levelModal: document.getElementById('level-modal'),
        closeLevelBtn: document.getElementById('close-level-btn'),
        modalCurLvl: document.getElementById('modal-cur-lvl'),
        modalCurTitle: document.getElementById('modal-cur-title'),
        curLvlIcon: document.getElementById('cur-lvl-icon'),
        modalXpText: document.getElementById('modal-xp-text'),
        modalXpFill: document.getElementById('modal-xp-fill'),
        modalCompletedCount: document.getElementById('modal-completed-count'),
        levelMapContainer: document.getElementById('level-map-container'),

        // Level Up Celebration Modal
        levelupModal: document.getElementById('levelup-modal'),
        levelupLvlNum: document.getElementById('levelup-lvl-num'),
        levelupTitleName: document.getElementById('levelup-title-name'),
        levelupRewardsList: document.getElementById('levelup-rewards-list'),
        claimLevelupBtn: document.getElementById('claim-levelup-btn'),

        // Modals
        renovateModal: document.getElementById('renovate-modal'),
        closeRenovateBtn: document.getElementById('close-renovate-btn'),
        renovateTasksList: document.getElementById('renovate-tasks-list'),
        
        storageModal: document.getElementById('storage-modal'),
        closeStorageBtn: document.getElementById('close-storage-btn'),
        storageGrid: document.getElementById('storage-grid'),
        
        recipeModal: document.getElementById('recipe-modal'),
        closeRecipeBtn: document.getElementById('close-recipe-btn'),
        recipeChainContent: document.getElementById('recipe-chain-content'),
        
        energyModal: document.getElementById('energy-modal'),
        closeEnergyBtn: document.getElementById('close-energy-btn'),
        buyEnergyGemsBtn: document.getElementById('buy-energy-gems-btn'),
        buyFullEnergyBtn: document.getElementById('buy-full-energy-btn'),
        claimFreeEnergyBtn: document.getElementById('claim-free-energy-btn'),
        
        settingsModal: document.getElementById('settings-modal'),
        closeSettingsBtn: document.getElementById('close-settings-btn'),
        soundToggle: document.getElementById('sound-toggle'),
        musicToggle: document.getElementById('music-toggle'),
        resetGameBtn: document.getElementById('reset-game-btn'),
        headerRestartBtn: document.getElementById('header-restart-btn'),
        
        // Start Screen
        startScreen: document.getElementById('start-screen'),
        playBtn: document.getElementById('play-btn'),
        
        fxContainer: document.getElementById('fx-container')
      };
    }

    loadState() {
      try {
        const saved = localStorage.getItem('merge_cafe_save');
        if (saved) {
          this.state = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Could not load save, creating fresh game state', e);
      }

      if (!this.state || !this.state.grid || this.state.grid.length !== this.TOTAL_TILES) {
        this.resetToInitialLayout();
      }

      // Ensure level and XP properties are safely set
      if (this.state) {
        if (!this.state.level || this.state.level < 1) this.state.level = 1;
        if (!this.state.unlockedLevel || this.state.unlockedLevel < 1) this.state.unlockedLevel = this.state.level || 1;
        if (this.state.unlockedLevel < this.state.level) this.state.unlockedLevel = this.state.level;
        if (this.state.xp === undefined || isNaN(this.state.xp)) this.state.xp = 0;
      }

      // Ensure customer orders exist
      if (!this.state.orders || this.state.orders.length === 0) {
        this.generateOrders(2);
      }
    }

    saveState() {
      try {
        localStorage.setItem('merge_cafe_save', JSON.stringify(this.state));
      } catch (e) {
        console.warn('Could not save game state', e);
      }
    }

    resetToInitialLayout() {
      this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      this.state.grid = new Array(this.TOTAL_TILES).fill(null);

      // Create an exact board layout replicating the reference screenshot!
      // Row 0-6, Col 0-8. Center is row 3, col 4 (index 31).
      // Fill outer perimeter with Cardboard Boxes & Cobwebs
      for (let r = 0; r < this.ROWS; r++) {
        for (let c = 0; c < this.COLS; c++) {
          const idx = r * this.COLS + c;
          const distFromCenter = Math.abs(r - 3) + Math.abs(c - 4);
          
          if (distFromCenter >= 4) {
            // Cardboard Box
            this.state.grid[idx] = { isBox: true };
          } else if (distFromCenter >= 2) {
            // Cobwebbed Items
            const randomPool = ['toast_1', 'toast_2', 'toast_3', 'bakery_2', 'drinks_2'];
            const randItem = randomPool[Math.floor(Math.random() * randomPool.length)];
            this.state.grid[idx] = { itemId: randItem, isCobweb: true };
          }
        }
      }

      // Active playable center items (matching screenshot!)
      // Center items:
      this.state.grid[3 * this.COLS + 4] = { itemId: 'toast_3' }; // Egg Toast (Center)
      this.state.grid[3 * this.COLS + 3] = { itemId: 'toast_5' }; // Club Sandwich
      this.state.grid[3 * this.COLS + 5] = { itemId: 'toast_4' }; // Ham Toast
      this.state.grid[4 * this.COLS + 4] = { itemId: 'gen_toaster' }; // Sandwich Press Generator
      this.state.grid[4 * this.COLS + 3] = { itemId: 'gen_pan' }; // Frying Pan Generator
      this.state.grid[2 * this.COLS + 4] = { itemId: 'drinks_4' }; // Mint Mojito Jar
      this.state.grid[4 * this.COLS + 5] = { itemId: 'toast_4', isCobweb: true };
      this.state.grid[5 * this.COLS + 5] = { itemId: 'bakery_5' }; // Strawberry Waffle
      this.state.grid[5 * this.COLS + 4] = { itemId: 'toast_2' }; // Toast
      this.state.grid[5 * this.COLS + 6] = { itemId: 'bakery_3' }; // Sausage Roll
      this.state.grid[6 * this.COLS + 4] = { itemId: 'gen_pantry' }; // Pantry Generator

      this.selectedCellIndex = 3 * this.COLS + 4; // Select the Egg Toast
      this.generateOrders(2);
      this.saveState();
    }

    generateOrders(count = 2) {
      if (!this.state.orders) this.state.orders = [];
      const orderableItems = ['toast_2', 'toast_3', 'toast_4', 'toast_5', 'bakery_2', 'bakery_3', 'bakery_4', 'drinks_3', 'drinks_4'];
      
      while (this.state.orders.length < count) {
        const randItem = orderableItems[Math.floor(Math.random() * orderableItems.length)];
        const itemMeta = ITEM_MAP[randItem];
        const custAvatar = CUSTOMER_AVATARS[Math.floor(Math.random() * CUSTOMER_AVATARS.length)];
        const rewardCash = (itemMeta.price || 2) * 3 + 5;
        
        this.state.orders.push({
          id: 'ord_' + Math.random().toString(36).substr(2, 6),
          customerName: custAvatar.name,
          customerSvg: custAvatar.svg,
          reqItemId: randItem,
          rewardCash: rewardCash,
          rewardEnergy: 5
        });
      }
    }

    setupTimers() {
      // Countdown for +1 Energy every 60 seconds
      setInterval(() => {
        if (this.state.energy < this.state.maxEnergy) {
          const now = Date.now();
          const diff = Math.floor((now - this.state.lastEnergyTime) / 1000);
          if (diff >= 60) {
            const energyToAdd = Math.min(Math.floor(diff / 60), this.state.maxEnergy - this.state.energy);
            this.state.energy += energyToAdd;
            this.state.lastEnergyTime = now;
            this.saveState();
            this.renderHeader();
          } else {
            const remSec = 60 - diff;
            const mins = String(Math.floor(remSec / 60)).padStart(2, '0');
            const secs = String(remSec % 60).padStart(2, '0');
            this.el.energyTimer.textContent = `${mins}:${secs}`;
          }
        } else {
          this.el.energyTimer.textContent = 'MAX';
          this.state.lastEnergyTime = Date.now();
        }
      }, 1000);
    }

    // --- RENDERERS ---
    renderAll() {
      this.renderHeader();
      this.renderGrid();
      this.renderSelectedCard();
      this.renderOrders();
      this.renderStorageBadge();
      this.renderQuestAlert();
    }

    renderHeader() {
      const curLvl = Math.min(12, Math.max(1, this.state.level || 1));
      const unlockedLvl = Math.min(12, Math.max(1, this.state.unlockedLevel || curLvl));
      const curLvlData = LEVELS_DATA[curLvl - 1] || LEVELS_DATA[0];
      const nextLvlData = LEVELS_DATA[unlockedLvl - 1] || LEVELS_DATA[0];
      const curXp = this.state.xp || 0;
      const reqXp = nextLvlData.reqXp;

      if (this.el.playerLevel) {
        this.el.playerLevel.textContent = `Lv. ${curLvl}`;
      }

      const isReadyToUpgrade = unlockedLvl < 12 && curXp >= reqXp;

      if (this.el.levelBarFill) {
        const pct = unlockedLvl >= 12 ? 100 : Math.min(100, Math.max(0, Math.round((curXp / reqXp) * 100)));
        this.el.levelBarFill.style.width = `${pct}%`;
      }

      if (this.el.levelBtn) {
        if (isReadyToUpgrade) {
          this.el.levelBtn.classList.add('level-ready-pulse');
          this.el.levelBtn.setAttribute('title', `Level Up Ready! ⭐ Tap to upgrade to Level ${unlockedLvl + 1}`);
        } else {
          this.el.levelBtn.classList.remove('level-ready-pulse');
          this.el.levelBtn.setAttribute('title', `Playing Level ${curLvl} (Unlocked: ${unlockedLvl}/12)`);
        }
      }

      this.el.energyCount.textContent = this.state.energy;
      this.el.cashCount.textContent = this.state.cash;
      this.el.gemsCount.textContent = this.state.gems;
    }

    addXp(amount, sourceCellIndex = null) {
      this.state.xp = (this.state.xp || 0) + amount;

      if (sourceCellIndex !== null && sourceCellIndex >= 0) {
        this.showFloatingText(sourceCellIndex, `+${amount} XP ⭐`, '#f39c12');
      }

      // NOTE: Level does NOT auto-change! User must manually change/upgrade level themselves.
      const unlockedLvl = this.state.unlockedLevel || this.state.level || 1;
      if (unlockedLvl < 12) {
        const reqXp = LEVELS_DATA[unlockedLvl - 1].reqXp;
        if (this.state.xp >= reqXp && sourceCellIndex !== null && sourceCellIndex >= 0) {
          setTimeout(() => {
            this.showFloatingText(sourceCellIndex, `Level ${unlockedLvl + 1} Ready! ⭐`, '#27ae60');
          }, 600);
        }
      }

      this.saveState();
      this.renderHeader();
      if (this.el.levelModal && this.el.levelModal.classList.contains('open')) {
        this.renderLevelMap();
      }
    }

    renderGrid() {
      this.el.gridBoard.innerHTML = '';

      for (let i = 0; i < this.TOTAL_TILES; i++) {
        const cellData = this.state.grid[i];
        const cellEl = document.createElement('div');
        cellEl.className = 'grid-cell';
        cellEl.dataset.index = i;

        if (this.selectedCellIndex === i) {
          cellEl.classList.add('selected');
        }

        if (cellData) {
          if (cellData.isBox) {
            // Cardboard Box
            const boxEl = document.createElement('div');
            boxEl.className = 'cell-box';
            boxEl.innerHTML = '<div class="box-tape"></div>';
            cellEl.appendChild(boxEl);
          } else if (cellData.itemId) {
            const itemMeta = ITEM_MAP[cellData.itemId];
            if (itemMeta) {
              const itemEl = document.createElement('div');
              itemEl.className = 'game-item';
              itemEl.innerHTML = `<div class="game-item-svg">${itemMeta.svg}</div>`;

              // If generator, add lightning or banned badge
              if (itemMeta.isGenerator) {
                if (itemMeta.isBanned) {
                  itemEl.classList.add('banned-item');
                  const badge = document.createElement('div');
                  badge.className = 'banned-badge';
                  badge.textContent = '🚫';
                  badge.title = 'Banned Creator';
                  itemEl.appendChild(badge);
                } else {
                  const badge = document.createElement('div');
                  badge.className = 'generator-badge';
                  badge.textContent = '⚡';
                  itemEl.appendChild(badge);
                }
              }

              // If cobwebbed
              if (cellData.isCobweb) {
                const webEl = document.createElement('div');
                webEl.className = 'cobweb-overlay';
                itemEl.appendChild(webEl);
              }

              cellEl.appendChild(itemEl);
            }
          }
        }

        this.el.gridBoard.appendChild(cellEl);
      }
    }

    renderSelectedCard() {
      const cellData = this.selectedCellIndex !== null ? this.state.grid[this.selectedCellIndex] : null;

      if (cellData && cellData.itemId && ITEM_MAP[cellData.itemId]) {
        const item = ITEM_MAP[cellData.itemId];
        this.el.selThumb.innerHTML = item.svg;
        this.el.selLevel.textContent = item.level || 1;
        this.el.selName.textContent = item.isBanned ? `${item.name} 🚫` : item.name;
        this.el.selDesc.textContent = item.isBanned ? '🚫 BANNED CREATOR (یہ کریٹر بین ہے اور کام نہیں کرے گا)' : (item.desc || 'MERGE to get a higher-level item!');
        this.el.sellPrice.textContent = `+${item.price || 1}`;
        this.el.sellBtn.style.display = item.isGenerator ? 'none' : 'flex';
      } else if (cellData && cellData.isBox) {
        this.el.selThumb.innerHTML = '📦';
        this.el.selLevel.textContent = '1';
        this.el.selName.textContent = 'Cardboard Box';
        this.el.selDesc.textContent = 'Merge adjacent items to unlock this space!';
        this.el.sellBtn.style.display = 'none';
      } else {
        this.el.selThumb.innerHTML = '✨';
        this.el.selLevel.textContent = '-';
        this.el.selName.textContent = 'Empty Spot';
        this.el.selDesc.textContent = 'Tap a generator to spawn items here!';
        this.el.sellBtn.style.display = 'none';
      }
    }

    renderOrders() {
      this.el.ordersList.innerHTML = '';

      this.state.orders.forEach(order => {
        const itemMeta = ITEM_MAP[order.reqItemId];
        const cardEl = document.createElement('div');
        cardEl.className = 'customer-card';

        // Check if player has this item on board
        const hasItem = this.state.grid.some(c => c && c.itemId === order.reqItemId && !c.isCobweb);
        if (hasItem) {
          cardEl.classList.add('can-serve');
        }

        cardEl.innerHTML = `
          <div class="cust-avatar">${order.customerSvg}</div>
          <div class="cust-req-box">
            <div class="req-item-icon">${itemMeta ? itemMeta.svg : '🍽️'}</div>
            <div class="req-info">
              <span class="req-reward-tag">💵 +${order.rewardCash}</span>
            </div>
          </div>
          ${hasItem ? `<button class="serve-order-btn" data-order-id="${order.id}">SERVE</button>` : ''}
        `;

        this.el.ordersList.appendChild(cardEl);
      });
    }

    renderStorageBadge() {
      const count = this.state.storage.filter(x => x !== null).length;
      this.el.storageBadge.textContent = `${count}/${this.state.storage.length}`;
    }

    renderQuestAlert() {
      const affordable = this.state.quests.some(q => !q.done && this.state.cash >= q.cost);
      this.el.questAlertBadge.style.display = affordable ? 'flex' : 'none';
    }

    // --- GAMEPLAY ACTIONS ---
    selectCell(index) {
      this.selectedCellIndex = index;
      sound.playTap();
      this.renderGrid();
      this.renderSelectedCard();
    }

    handleCellClick(index) {
      const cellData = this.state.grid[index];

      // If clicked a generator, spawn item or block if banned!
      if (cellData && cellData.itemId && ITEM_MAP[cellData.itemId] && ITEM_MAP[cellData.itemId].isGenerator) {
        if (!cellData.isCobweb) {
          if (ITEM_MAP[cellData.itemId].isBanned) {
            sound.playPop();
            this.showFloatingText(index, '🚫 Creator Banned!', '#ff3b30');
            this.selectCell(index);
            return;
          }
          this.triggerGenerator(index);
          return;
        }
      }

      // If clicked on a box, check if adjacent has items
      if (cellData && cellData.isBox) {
        sound.playPop();
        this.selectCell(index);
        return;
      }

      // If a cell is already selected and player taps another cell, attempt move or merge!
      if (this.selectedCellIndex !== null && this.selectedCellIndex !== index) {
        const sourceData = this.state.grid[this.selectedCellIndex];
        if (sourceData && !sourceData.isBox) {
          const success = this.attemptMoveOrMerge(this.selectedCellIndex, index);
          if (success) {
            this.selectedCellIndex = index;
            this.renderAll();
            return;
          }
        }
      }

      this.selectCell(index);
    }

    triggerGenerator(genIndex) {
      if (this.state.energy <= 0) {
        sound.playPop();
        this.openEnergyModal();
        return;
      }

      const emptyIndex = this.findNearestEmptySlot(genIndex);
      if (emptyIndex === -1) {
        this.showFloatingText(genIndex, 'Board Full!', '#ff3b30');
        sound.playPop();
        return;
      }

      // Spend energy
      this.state.energy -= 1;
      sound.playSpawn();

      const genMeta = ITEM_MAP[this.state.grid[genIndex].itemId];
      const spawns = genMeta.spawns || ['toast_1'];
      const spawnedId = spawns[Math.floor(Math.random() * spawns.length)];

      this.state.grid[emptyIndex] = { itemId: spawnedId };
      this.markDiscovered(spawnedId);

      this.showSparkles(emptyIndex);
      this.showFloatingText(emptyIndex, '-1 ⚡', '#ffd000');

      this.saveState();
      this.renderAll();
    }

    findNearestEmptySlot(startIndex) {
      const startR = Math.floor(startIndex / this.COLS);
      const startC = startIndex % this.COLS;
      let closestIdx = -1;
      let minDistance = 999;

      for (let i = 0; i < this.TOTAL_TILES; i++) {
        if (!this.state.grid[i]) {
          const r = Math.floor(i / this.COLS);
          const c = i % this.COLS;
          const dist = Math.abs(r - startR) + Math.abs(c - startC);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = i;
          }
        }
      }

      return closestIdx;
    }

    attemptMoveOrMerge(fromIndex, toIndex) {
      const fromCell = this.state.grid[fromIndex];
      const toCell = this.state.grid[toIndex];

      if (!fromCell || fromCell.isBox) return false;

      // Move to empty cell
      if (!toCell) {
        this.state.grid[toIndex] = fromCell;
        this.state.grid[fromIndex] = null;
        sound.playPop();
        this.saveState();
        return true;
      }

      // If target is Box, cannot move into it
      if (toCell.isBox) return false;

      // Check if both items are identical and can merge!
      if (fromCell.itemId && toCell.itemId && fromCell.itemId === toCell.itemId) {
        // Cannot merge two cobwebbed items together
        if (fromCell.isCobweb && toCell.isCobweb) return false;

        const currentMeta = ITEM_MAP[fromCell.itemId];
        if (!currentMeta) return false;

        // Find next item in chain
        const nextItem = this.findNextInChain(fromCell.itemId);
        if (!nextItem) {
          this.showFloatingText(toIndex, 'Max Level!', '#ff9900');
          return false;
        }

        // Merge success!
        this.state.grid[toIndex] = { itemId: nextItem.id };
        this.state.grid[fromIndex] = null;

        // Unlock adjacent cobwebs & boxes!
        this.unlockAdjacent(toIndex);
        this.markDiscovered(nextItem.id);

        sound.playMerge();
        this.showSparkles(toIndex);
        this.showFloatingText(toIndex, `Lv.${nextItem.level} ${nextItem.name}!`, '#ffd000');

        // Award Experience XP for merging!
        const xpEarned = Math.max(4, (nextItem.level || 1) * 3);
        this.addXp(xpEarned, toIndex);

        this.saveState();
        return true;
      }

      // Swap positions if different items
      if (!fromCell.isCobweb && !toCell.isCobweb) {
        this.state.grid[toIndex] = fromCell;
        this.state.grid[fromIndex] = toCell;
        sound.playPop();
        this.saveState();
        return true;
      }

      return false;
    }

    findNextInChain(itemId) {
      for (const chain of Object.values(ITEM_CHAINS)) {
        const idx = chain.items.findIndex(it => it.id === itemId);
        if (idx !== -1 && idx < chain.items.length - 1) {
          return chain.items[idx + 1];
        }
      }
      return null;
    }

    unlockAdjacent(centerIndex) {
      const r = Math.floor(centerIndex / this.COLS);
      const c = centerIndex % this.COLS;
      const neighbors = [
        [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
      ];

      neighbors.forEach(([nr, nc]) => {
        if (nr >= 0 && nr < this.ROWS && nc >= 0 && nc < this.COLS) {
          const nIdx = nr * this.COLS + nc;
          const target = this.state.grid[nIdx];
          if (target) {
            if (target.isBox) {
              // Convert box to empty tile with random low level item
              this.state.grid[nIdx] = { itemId: 'toast_1' };
              sound.playUnlock();
              this.showSparkles(nIdx);
              this.showFloatingText(nIdx, 'Unlocked! 📦', '#48c74a');
              this.addXp(12, nIdx);
            } else if (target.isCobweb) {
              // Clean cobweb
              delete target.isCobweb;
              sound.playUnlock();
              this.showSparkles(nIdx);
              this.addXp(10, nIdx);
            }
          }
        }
      });
    }

    markDiscovered(itemId) {
      if (!this.state.discoveredItems.includes(itemId)) {
        this.state.discoveredItems.push(itemId);
      }
    }

    serveOrder(orderId) {
      const orderIdx = this.state.orders.findIndex(o => o.id === orderId);
      if (orderIdx === -1) return;

      const order = this.state.orders[orderIdx];
      // Find item on board
      const itemCellIdx = this.state.grid.findIndex(c => c && c.itemId === order.reqItemId && !c.isCobweb);
      if (itemCellIdx === -1) return;

      // Consume item
      this.state.grid[itemCellIdx] = null;
      this.state.cash += order.rewardCash;
      this.state.energy = Math.min(this.state.maxEnergy, this.state.energy + order.rewardEnergy);

      sound.playCash();
      this.showSparkles(itemCellIdx);
      this.showFloatingText(itemCellIdx, `+${order.rewardCash} 💵`, '#48c74a');

      // Award generous Order Completion XP!
      const orderXp = (order.rewardCash || 10) + 15;
      this.addXp(orderXp, itemCellIdx);

      // Remove fulfilled order and create new one
      this.state.orders.splice(orderIdx, 1);
      this.generateOrders(2);

      this.saveState();
      this.renderAll();
    }

    sellSelectedItem() {
      if (this.selectedCellIndex === null) return;
      const cellData = this.state.grid[this.selectedCellIndex];
      if (!cellData || !cellData.itemId) return;

      const itemMeta = ITEM_MAP[cellData.itemId];
      if (!itemMeta || itemMeta.isGenerator) return;

      const price = itemMeta.price || 1;
      this.state.cash += price;
      this.state.grid[this.selectedCellIndex] = null;

      sound.playCash();
      this.showFloatingText(this.selectedCellIndex, `+${price} 💵`, '#48c74a');

      this.selectedCellIndex = null;
      this.saveState();
      this.renderAll();
    }

    restartGame() {
      try {
        localStorage.removeItem('merge_cafe_save');
      } catch (e) {
        console.warn('Could not clear save', e);
      }

      this.resetToInitialLayout();
      this.state.level = 1;
      this.state.xp = 0;
      this.renderAll();
      this.closeModals();

      sound.init();
      sound.playMerge();
      if (sound.musicEnabled) {
        sound.startAmbientMusic();
      }

      if (this.el.startScreen) {
        this.el.startScreen.classList.add('hidden');
        setTimeout(() => {
          if (this.el.startScreen) {
            this.el.startScreen.style.display = 'none';
          }
        }, 450);
      }

      // Show floating notification in center of board
      this.showFloatingText(Math.floor(this.TOTAL_TILES / 2), 'Level 1 Started! 🌟', '#48c74a');
    }

    // --- VISUAL FX (Sparkles & Floating text) ---
    showFloatingText(cellIndex, text, color = '#ffd000') {
      const cellEl = this.el.gridBoard.children[cellIndex];
      if (!cellEl) return;
      const rect = cellEl.getBoundingClientRect();

      const floatEl = document.createElement('div');
      floatEl.className = 'floating-text';
      floatEl.textContent = text;
      floatEl.style.color = color;
      floatEl.style.left = `${rect.left + rect.width / 2 - 20}px`;
      floatEl.style.top = `${rect.top}px`;

      this.el.fxContainer.appendChild(floatEl);
      setTimeout(() => floatEl.remove(), 1000);
    }

    showSparkles(cellIndex) {
      const cellEl = this.el.gridBoard.children[cellIndex];
      if (!cellEl) return;
      const rect = cellEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'sparkle-particle';
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;

        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 40;
        particle.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        particle.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);

        this.el.fxContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 600);
      }
    }

    // --- DRAG & DROP POINTER HANDLING ---
    initDragAndDrop() {
      let isDragging = false;
      let startX = 0;
      let startY = 0;

      const onPointerDown = (e) => {
        const target = e.target.closest('.grid-cell, .storage-slot');
        if (!target) return;

        const isGrid = target.classList.contains('grid-cell');
        const index = parseInt(target.dataset.index, 10);
        const cellData = isGrid ? this.state.grid[index] : this.state.storage[index];

        if (!cellData || cellData.isBox || !cellData.itemId) return;

        this.draggedFrom = isGrid ? 'grid' : 'storage';
        this.draggedIndex = index;
        startX = e.clientX;
        startY = e.clientY;
        isDragging = false;

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
      };

      const onPointerMove = (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (!isDragging && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
          isDragging = true;
          const cellData = this.draggedFrom === 'grid' 
            ? this.state.grid[this.draggedIndex] 
            : this.state.storage[this.draggedIndex];
          const itemMeta = ITEM_MAP[cellData.itemId];

          if (itemMeta) {
            this.dragGhost = document.createElement('div');
            this.dragGhost.className = 'drag-ghost';
            this.dragGhost.innerHTML = itemMeta.svg;
            document.body.appendChild(this.dragGhost);
          }
        }

        if (isDragging && this.dragGhost) {
          this.dragGhost.style.left = `${e.clientX}px`;
          this.dragGhost.style.top = `${e.clientY}px`;
        }
      };

      const onPointerUp = (e) => {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);

        if (this.dragGhost) {
          this.dragGhost.remove();
          this.dragGhost = null;
        }

        if (isDragging) {
          const dropTarget = document.elementFromPoint(e.clientX, e.clientY)?.closest('.grid-cell, .storage-slot');
          if (dropTarget) {
            const isTargetGrid = dropTarget.classList.contains('grid-cell');
            const targetIdx = parseInt(dropTarget.dataset.index, 10);

            if (this.draggedFrom === 'grid' && isTargetGrid) {
              this.attemptMoveOrMerge(this.draggedIndex, targetIdx);
            } else if (this.draggedFrom === 'grid' && !isTargetGrid) {
              // Move from grid to storage slot
              this.stashToStorage(this.draggedIndex, targetIdx);
            } else if (this.draggedFrom === 'storage' && isTargetGrid) {
              // Move from storage to grid
              this.unstashFromStorage(this.draggedIndex, targetIdx);
            }
          }
          this.renderAll();
        }

        isDragging = false;
        this.draggedIndex = null;
        this.draggedFrom = null;
      };

      this.el.gridBoard.addEventListener('pointerdown', onPointerDown);
      this.el.storageGrid.addEventListener('pointerdown', onPointerDown);
    }

    stashToStorage(gridIndex, storageIndex) {
      const gridCell = this.state.grid[gridIndex];
      if (!gridCell || gridCell.isBox) return;

      if (!this.state.storage[storageIndex]) {
        this.state.storage[storageIndex] = gridCell;
        this.state.grid[gridIndex] = null;
        sound.playPop();
        this.saveState();
        this.renderStorageModal();
      }
    }

    unstashFromStorage(storageIndex, gridIndex) {
      const storageCell = this.state.storage[storageIndex];
      if (!storageCell) return;

      if (!this.state.grid[gridIndex]) {
        this.state.grid[gridIndex] = storageCell;
        this.state.storage[storageIndex] = null;
        sound.playPop();
        this.saveState();
        this.renderStorageModal();
      }
    }

    // --- MODAL VIEWS ---
    openRenovateModal() {
      this.renderRenovationTasks();
      this.el.renovateModal.classList.add('open');
      sound.playTap();
    }

    renderRenovationTasks() {
      this.el.renovateTasksList.innerHTML = '';
      this.state.quests.forEach(task => {
        const row = document.createElement('div');
        row.className = 'task-card';
        row.innerHTML = `
          <div class="task-info">
            <span class="task-title">${task.icon} ${task.title}</span>
            <span class="task-cost">Cost: 💵 ${task.cost}</span>
          </div>
          <button class="task-btn" ${task.done ? 'disabled' : ''} data-task-id="${task.id}">
            ${task.done ? 'Completed ✅' : 'Upgrade'}
          </button>
        `;
        this.el.renovateTasksList.appendChild(row);
      });
    }

    buyRenovationTask(taskId) {
      const task = this.state.quests.find(q => q.id === taskId);
      if (!task || task.done) return;

      if (this.state.cash >= task.cost) {
        this.state.cash -= task.cost;
        task.done = true;
        sound.playCash();

        // Award big renovation XP!
        const renovXp = task.cost * 2;
        this.addXp(renovXp);

        this.saveState();
        this.renderAll();
        this.renderRenovationTasks();
      } else {
        sound.playPop();
        alert('Not enough Cash! Fulfill customer orders to earn cash 💵');
      }
    }

    switchLevel(targetLevel) {
      if (targetLevel < 1 || targetLevel > 12) return;
      if (targetLevel > (this.state.unlockedLevel || 1)) return;

      this.state.level = targetLevel;
      sound.playPop();
      this.showFloatingText(Math.floor(this.TOTAL_TILES / 2), `Playing Level ${targetLevel}! 🎯`, '#27ae60');
      this.saveState();
      this.renderAll();
      this.renderLevelMap();
    }

    upgradeToLevel(targetLevel) {
      if (targetLevel < 1 || targetLevel > 12) return;
      const curUnlocked = this.state.unlockedLevel || 1;
      if (targetLevel !== curUnlocked + 1) return;

      const curReqXp = LEVELS_DATA[curUnlocked - 1].reqXp;
      if ((this.state.xp || 0) < curReqXp) return;

      // Deduct required XP
      this.state.xp = Math.max(0, (this.state.xp || 0) - curReqXp);
      this.state.unlockedLevel = targetLevel;
      this.state.level = targetLevel;

      // Apply level rewards
      const newLevelData = LEVELS_DATA[targetLevel - 1];
      if (newLevelData && newLevelData.rewards) {
        if (newLevelData.rewards.cash) this.state.cash += newLevelData.rewards.cash;
        if (newLevelData.rewards.gems) this.state.gems += newLevelData.rewards.gems;
        if (newLevelData.rewards.maxEnergy) this.state.maxEnergy += newLevelData.rewards.maxEnergy;
        if (newLevelData.rewards.energy) this.state.energy = Math.min(this.state.maxEnergy, this.state.energy + newLevelData.rewards.energy);
      }

      sound.playFanfare();
      this.openLevelUpModal(targetLevel);
      this.saveState();
      this.renderAll();
      this.renderLevelMap();
    }

    openLevelModal() {
      this.renderLevelMap();
      if (this.el.levelModal) {
        this.el.levelModal.classList.add('open');
      }
      sound.playTap();
    }

    renderLevelMap() {
      const curLvl = Math.min(12, Math.max(1, this.state.level || 1));
      const unlockedLvl = Math.min(12, Math.max(1, this.state.unlockedLevel || curLvl));
      const curLvlData = LEVELS_DATA[curLvl - 1] || LEVELS_DATA[0];
      const nextLvlData = LEVELS_DATA[unlockedLvl - 1] || LEVELS_DATA[0];
      const curXp = this.state.xp || 0;
      const reqXp = nextLvlData.reqXp;

      if (this.el.curLvlIcon) this.el.curLvlIcon.textContent = curLvlData.icon || '⭐';
      if (this.el.modalCurLvl) this.el.modalCurLvl.textContent = `Playing Level ${curLvl} (Unlocked: ${unlockedLvl}/12)`;
      if (this.el.modalCurTitle) this.el.modalCurTitle.textContent = `${curLvlData.title} (${curLvlData.titleUrdu})`;

      if (this.el.modalXpText) {
        if (unlockedLvl >= 12) {
          this.el.modalXpText.textContent = `MAX LEVEL REACHED 👑`;
        } else {
          const readyNote = curXp >= reqXp ? ' ⭐ READY TO UPGRADE!' : '';
          this.el.modalXpText.textContent = `${curXp} / ${reqXp} XP (${Math.round((curXp / reqXp) * 100)}%)${readyNote}`;
        }
      }

      if (this.el.modalXpFill) {
        const pct = unlockedLvl >= 12 ? 100 : Math.min(100, Math.round((curXp / reqXp) * 100));
        this.el.modalXpFill.style.width = `${pct}%`;
      }

      if (this.el.modalCompletedCount) {
        this.el.modalCompletedCount.textContent = `Unlocked: ${unlockedLvl} / 12`;
      }

      if (this.el.levelMapContainer) {
        this.el.levelMapContainer.innerHTML = '';
        LEVELS_DATA.forEach(lvl => {
          const isCurrentPlaying = curLvl === lvl.level;
          const isUnlocked = lvl.level <= unlockedLvl;
          const isReadyToUpgrade = lvl.level === unlockedLvl + 1 && curXp >= reqXp;

          const card = document.createElement('div');
          card.className = `level-card ${isCurrentPlaying ? 'active' : isUnlocked ? 'completed' : isReadyToUpgrade ? 'ready' : 'locked'}`;

          let statusTag = '';
          let actionBtn = '';

          if (isCurrentPlaying) {
            statusTag = '<span class="level-status-pill current-pill">Playing 🎯</span>';
            actionBtn = '<button class="lvl-btn active-lvl-btn" disabled>Currently Active</button>';
          } else if (isUnlocked) {
            statusTag = '<span class="level-status-pill unlocked-pill">Unlocked 🔓</span>';
            actionBtn = `<button class="lvl-btn switch-lvl-btn" data-switch-level="${lvl.level}">▶ Switch Level (لیول کھیلیں)</button>`;
          } else if (isReadyToUpgrade) {
            statusTag = '<span class="level-status-pill ready-pill">Ready ⭐</span>';
            actionBtn = `<button class="lvl-btn upgrade-lvl-btn" data-upgrade-level="${lvl.level}">⚡ UPGRADE NOW (لیول تبدیل کریں)</button>`;
          } else {
            statusTag = '<span class="level-status-pill locked-pill">Locked 🔒</span>';
            actionBtn = `<button class="lvl-btn locked-lvl-btn" disabled>Needs Level ${lvl.level - 1} (${lvl.reqXp} XP)</button>`;
          }

          card.innerHTML = `
            <div class="level-card-top">
              <span class="level-node-num">Level ${lvl.level}</span>
              ${statusTag}
            </div>
            <div class="level-card-body">
              <div class="level-card-icon">${lvl.icon}</div>
              <div class="level-card-info">
                <div class="level-card-name">${lvl.title}</div>
                <div class="level-card-urdu">${lvl.titleUrdu}</div>
                <span class="level-card-xp">${lvl.level < 12 ? `${lvl.reqXp} XP needed` : 'Max Milestone'}</span>
              </div>
            </div>
            <div class="level-reward-row">
              🎁 ${lvl.rewards.desc}
            </div>
            <div class="level-card-footer">
              ${actionBtn}
            </div>
          `;
          this.el.levelMapContainer.appendChild(card);
        });
      }
    }

    openLevelUpModal(lvlNum) {
      const lvlData = LEVELS_DATA[lvlNum - 1];
      if (!lvlData) return;

      if (this.el.levelupLvlNum) this.el.levelupLvlNum.textContent = `Level ${lvlNum}`;
      if (this.el.levelupTitleName) this.el.levelupTitleName.textContent = `${lvlData.title} (${lvlData.titleUrdu})`;

      if (this.el.levelupRewardsList) {
        this.el.levelupRewardsList.innerHTML = '';
        if (lvlData.rewards.cash) {
          const item = document.createElement('div');
          item.className = 'levelup-reward-item';
          item.innerHTML = `💵 +${lvlData.rewards.cash} Cash`;
          this.el.levelupRewardsList.appendChild(item);
        }
        if (lvlData.rewards.gems) {
          const item = document.createElement('div');
          item.className = 'levelup-reward-item';
          item.innerHTML = `💎 +${lvlData.rewards.gems} Gems`;
          this.el.levelupRewardsList.appendChild(item);
        }
        if (lvlData.rewards.energy) {
          const item = document.createElement('div');
          item.className = 'levelup-reward-item';
          item.innerHTML = `⚡ +${lvlData.rewards.energy} Energy`;
          this.el.levelupRewardsList.appendChild(item);
        }
        if (lvlData.rewards.maxEnergy) {
          const item = document.createElement('div');
          item.className = 'levelup-reward-item';
          item.innerHTML = `⚡ +${lvlData.rewards.maxEnergy} Max Energy`;
          this.el.levelupRewardsList.appendChild(item);
        }
      }

      this.showSparkles(Math.floor(this.TOTAL_TILES / 2));
      if (this.el.levelupModal) {
        this.el.levelupModal.classList.add('open');
      }
    }

    openStorageModal() {
      this.renderStorageModal();
      this.el.storageModal.classList.add('open');
      sound.playTap();
    }

    renderStorageModal() {
      this.el.storageGrid.innerHTML = '';
      this.state.storage.forEach((itemData, idx) => {
        const slotEl = document.createElement('div');
        slotEl.className = 'storage-slot';
        slotEl.dataset.index = idx;

        if (itemData && itemData.itemId && ITEM_MAP[itemData.itemId]) {
          slotEl.innerHTML = `<div class="game-item-svg">${ITEM_MAP[itemData.itemId].svg}</div>`;
        } else {
          slotEl.innerHTML = '<span style="color:#b58f62;font-size:24px;">+</span>';
        }

        this.el.storageGrid.appendChild(slotEl);
      });
    }

    openRecipeModal(selectedChain = 'toast') {
      this.renderRecipeBook(selectedChain);
      this.el.recipeModal.classList.add('open');
      sound.playTap();
    }

    renderRecipeBook(chainKey) {
      const chain = ITEM_CHAINS[chainKey];
      if (!chain) return;

      // Update tabs
      document.querySelectorAll('.recipe-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.chain === chainKey);
      });

      this.el.recipeChainContent.innerHTML = '';
      chain.items.forEach(item => {
        const isDiscovered = this.state.discoveredItems.includes(item.id);
        const row = document.createElement('div');
        row.className = 'recipe-chain-row';
        row.innerHTML = `
          <span class="recipe-level-num">Lv.${item.level}</span>
          <div class="recipe-row-icon">
            ${isDiscovered ? item.svg : '<span style="font-size:26px;filter:grayscale(1);opacity:0.4;">🔒</span>'}
          </div>
          <div class="recipe-row-details">
            <div class="recipe-row-name">${isDiscovered ? item.name : '??? Locked'}</div>
            <div class="recipe-row-desc">${isDiscovered ? item.desc : 'Merge items to discover this recipe!'}</div>
          </div>
        `;
        this.el.recipeChainContent.appendChild(row);
      });
    }

    openEnergyModal() {
      this.el.energyModal.classList.add('open');
      sound.playTap();
    }

    openSettingsModal() {
      this.el.settingsModal.classList.add('open');
      sound.playTap();
    }

    closeModals() {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
    }

    // --- EVENT BINDINGS ---
    bindEvents() {
      // Grid click delegation
      this.el.gridBoard.addEventListener('click', (e) => {
        const cell = e.target.closest('.grid-cell');
        if (cell) {
          const idx = parseInt(cell.dataset.index, 10);
          this.handleCellClick(idx);
        }
      });

      // Orders Serve button delegation
      this.el.ordersList.addEventListener('click', (e) => {
        const serveBtn = e.target.closest('.serve-order-btn');
        if (serveBtn) {
          const orderId = serveBtn.dataset.orderId;
          this.serveOrder(orderId);
        }
      });

      // Sell button
      this.el.sellBtn.addEventListener('click', () => this.sellSelectedItem());

      // Info button on selected card
      this.el.itemInfoBtn.addEventListener('click', () => {
        const cellData = this.selectedCellIndex !== null ? this.state.grid[this.selectedCellIndex] : null;
        if (cellData && cellData.itemId && ITEM_MAP[cellData.itemId]) {
          const meta = ITEM_MAP[cellData.itemId];
          let chainKey = 'toast';
          for (const [k, v] of Object.entries(ITEM_CHAINS)) {
            if (v.items.some(it => it.id === meta.id)) {
              chainKey = k;
              break;
            }
          }
          this.openRecipeModal(chainKey);
        } else {
          this.openRecipeModal('toast');
        }
      });

      // Modal openers
      if (this.el.levelBtn) this.el.levelBtn.addEventListener('click', () => this.openLevelModal());
      if (this.el.levelMapContainer) {
        this.el.levelMapContainer.addEventListener('click', (e) => {
          const switchBtn = e.target.closest('[data-switch-level]');
          if (switchBtn) {
            const targetLvl = parseInt(switchBtn.dataset.switchLevel, 10);
            this.switchLevel(targetLvl);
            return;
          }
          const upgradeBtn = e.target.closest('[data-upgrade-level]');
          if (upgradeBtn) {
            const targetLvl = parseInt(upgradeBtn.dataset.upgradeLevel, 10);
            this.upgradeToLevel(targetLvl);
            return;
          }
        });
      }
      this.el.renovateBtn.addEventListener('click', () => this.openRenovateModal());
      this.el.storageBtn.addEventListener('click', () => this.openStorageModal());
      this.el.recipeBookBtn.addEventListener('click', () => this.openRecipeModal('toast'));
      this.el.settingsBtn.addEventListener('click', () => this.openSettingsModal());
      this.el.energyBtn.addEventListener('click', () => this.openEnergyModal());
      this.el.cashBtn.addEventListener('click', () => this.openRenovateModal());
      this.el.gemsBtn.addEventListener('click', () => this.openEnergyModal());

      // Modal closers
      if (this.el.closeLevelBtn) this.el.closeLevelBtn.addEventListener('click', () => this.closeModals());
      if (this.el.claimLevelupBtn) this.el.claimLevelupBtn.addEventListener('click', () => this.closeModals());
      this.el.closeRenovateBtn.addEventListener('click', () => this.closeModals());
      this.el.closeStorageBtn.addEventListener('click', () => this.closeModals());
      this.el.closeRecipeBtn.addEventListener('click', () => this.closeModals());
      this.el.closeEnergyBtn.addEventListener('click', () => this.closeModals());
      this.el.closeSettingsBtn.addEventListener('click', () => this.closeModals());

      // Close modal on backdrop click
      document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) this.closeModals();
        });
      });

      // Renovation task buy delegation
      this.el.renovateTasksList.addEventListener('click', (e) => {
        const btn = e.target.closest('.task-btn');
        if (btn) {
          this.buyRenovationTask(btn.dataset.taskId);
        }
      });

      // Recipe tab switching
      document.querySelectorAll('.recipe-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.renderRecipeBook(btn.dataset.chain);
        });
      });

      // Energy shop buttons
      this.el.buyEnergyGemsBtn.addEventListener('click', () => {
        if (this.state.gems >= 10) {
          this.state.gems -= 10;
          this.state.energy = Math.min(this.state.maxEnergy, this.state.energy + 50);
          sound.playCash();
          this.saveState();
          this.renderAll();
          this.closeModals();
        } else {
          alert('Not enough Gems!');
        }
      });

      this.el.buyFullEnergyBtn.addEventListener('click', () => {
        if (this.state.gems >= 18) {
          this.state.gems -= 18;
          this.state.energy = this.state.maxEnergy;
          sound.playCash();
          this.saveState();
          this.renderAll();
          this.closeModals();
        } else {
          alert('Not enough Gems!');
        }
      });

      this.el.claimFreeEnergyBtn.addEventListener('click', () => {
        this.state.energy = Math.min(this.state.maxEnergy, this.state.energy + 25);
        sound.playCash();
        this.saveState();
        this.renderAll();
        this.closeModals();
      });

      // Settings toggles
      this.el.soundToggle.addEventListener('change', (e) => {
        sound.soundEnabled = e.target.checked;
      });

      this.el.musicToggle.addEventListener('change', (e) => {
        sound.musicEnabled = e.target.checked;
        if (sound.musicEnabled) {
          sound.startAmbientMusic();
        } else {
          sound.stopAmbientMusic();
        }
      });

      // Direct New Game / Restart triggers (No popups)
      if (this.el.resetGameBtn) {
        this.el.resetGameBtn.addEventListener('click', () => this.restartGame());
      }

      if (this.el.headerRestartBtn) {
        this.el.headerRestartBtn.addEventListener('click', () => this.restartGame());
      }

      // Start Screen: Primary Start New Game Button
      if (this.el.playBtn) {
        this.el.playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.restartGame();
        });
      }

      // Drag and drop initializer
      this.initDragAndDrop();

      // Start ambient cafe music on first interaction
      const startMusicOnFirstTouch = () => {
        sound.init();
        if (sound.musicEnabled) {
          sound.startAmbientMusic();
        }
        window.removeEventListener('click', startMusicOnFirstTouch);
        window.removeEventListener('touchstart', startMusicOnFirstTouch);
      };
      window.addEventListener('click', startMusicOnFirstTouch);
      window.addEventListener('touchstart', startMusicOnFirstTouch);
    }
  }

  // Launch Game
  window.addEventListener('DOMContentLoaded', () => {
    new MergeCafeGame();
  });
})();
