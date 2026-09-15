/* ----------------------------------------------------
   Coin Rush Speedway - Core Engine & Game Logic (app.js)
   ---------------------------------------------------- */

// Audio Synthesis Engine using Web Audio API (Zero External Asset Loading)
class SoundFX {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.engineOsc = null;
        this.engineGain = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
            this.setupEngineSound();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setupEngineSound() {
        if (!this.ctx) return;
        try {
            this.engineOsc = this.ctx.createOscillator();
            this.engineGain = this.ctx.createGain();

            this.engineOsc.type = 'sawtooth';
            this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime); // Low rumble idling

            // Lowpass filter to make engine sound deep and realistic
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(220, this.ctx.currentTime);

            this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);

            this.engineOsc.connect(filter);
            filter.connect(this.engineGain);
            this.engineGain.connect(this.ctx.destination);

            this.engineOsc.start();
        } catch (e) {
            console.warn("Audio Context init warning:", e);
        }
    }

    updateEngine(speedRatio, isAccelerating) {
        if (!this.ctx || !this.engineOsc || this.isMuted) return;

        const basePitch = 45;
        const targetPitch = basePitch + (speedRatio * 180) + (isAccelerating ? 30 : 0);
        const targetVolume = this.isMuted ? 0 : Math.min(0.18, 0.03 + (speedRatio * 0.12));

        this.engineOsc.frequency.setTargetAtTime(targetPitch, this.ctx.currentTime, 0.08);
        this.engineGain.gain.setTargetAtTime(targetVolume, this.ctx.currentTime, 0.08);
    }

    playCoinSound(value) {
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Higher coin values produce higher pitch harmonic chimes
        let baseFreq = 440;
        if (value >= 100) baseFreq = 880;
        else if (value >= 50) baseFreq = 740;
        else if (value >= 25) baseFreq = 660;
        else if (value >= 10) baseFreq = 550;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    playNitroSound() {
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.4);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    playCrashSound() {
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
    }

    playShieldSound() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
    }

    playShieldSmash() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.engineGain) {
            this.engineGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx ? this.ctx.currentTime : 0);
        }
        return this.isMuted;
    }
}

// Car Models Database (Real Iconic Supercars)
const CAR_DATABASE = [
    {
        id: 'bugatti_chiron',
        name: 'Bugatti Chiron GT',
        cost: 0,
        unlocked: true,
        topSpeed: 120,
        acceleration: 0.85,
        scoreMultiplier: 1.0,
        primaryColor: '#ef4444',
        secondaryColor: '#0f172a',
        glowColor: '#ef4444'
    },
    {
        id: 'ferrari_laferrari',
        name: 'Ferrari LaFerrari',
        cost: 200,
        unlocked: false,
        topSpeed: 135,
        acceleration: 0.95,
        scoreMultiplier: 1.3,
        primaryColor: '#dc2626',
        secondaryColor: '#facc15',
        glowColor: '#dc2626'
    },
    {
        id: 'porsche_911',
        name: 'Porsche 911 GT3',
        cost: 500,
        unlocked: false,
        topSpeed: 150,
        acceleration: 1.05,
        scoreMultiplier: 1.6,
        primaryColor: '#0284c7',
        secondaryColor: '#f8fafc',
        glowColor: '#0284c7'
    },
    {
        id: 'lambo_aventador',
        name: 'Lamborghini Aventador',
        cost: 1000,
        unlocked: false,
        topSpeed: 165,
        acceleration: 1.15,
        scoreMultiplier: 2.0,
        primaryColor: '#eab308',
        secondaryColor: '#18181b',
        glowColor: '#eab308'
    }
];

// Main Game Engine Class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.sound = new SoundFX();

        // Canvas dimensions & scaling
        this.width = 1000;
        this.height = 650;

        // Player & Game State
        this.state = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER
        this.score = 0;
        this.coins = 0;
        this.totalCoinsBank = parseInt(localStorage.getItem('coin_rush_total_coins') || '0', 10);
        this.highScore = parseInt(localStorage.getItem('coin_rush_highscore') || '0', 10);
        this.combo = 1;
        this.comboTimer = 0;

        // Unlocked Cars Storage
        const savedUnlocked = JSON.parse(localStorage.getItem('coin_rush_unlocked_cars') || '["bugatti_chiron"]');
        CAR_DATABASE.forEach(car => {
            if (savedUnlocked.includes(car.id)) car.unlocked = true;
        });

        this.selectedCarId = localStorage.getItem('coin_rush_selected_car') || 'bugatti_chiron';
        this.selectedCar = CAR_DATABASE.find(c => c.id === this.selectedCarId) || CAR_DATABASE[0];

        // Car Driving Physics State
        this.currentLane = 0; // -1 (Left Lane), 0 (Center Lane), +1 (Right Lane)
        this.carX = 0;
        this.carTargetX = 0;
        this.carY = 480;
        this.speed = 0;
        this.nitroAmount = 100;
        this.isNitroActive = false;

        // Controls input state
        this.input = {
            forward: false,
            left: false,
            right: false,
            nitro: false
        };

        // Track & Environment State
        this.distance = 0;
        this.roadOffset = 0;

        // Shield & Invincibility State (Strict 3 Uses Limit)
        this.maxShields = 3;
        this.shieldUsesLeft = 3;
        this.shieldActive = false;
        this.shieldTimer = 0;

        // Game Entities
        this.coinsList = [];
        this.obstaclesList = [];
        this.particles = [];

        this.initDOM();
        this.initControls();
        this.updateMenuStats();
        this.renderCarPreviews();
        this.updateShieldUI();

        // Start Main Animation Loop
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    initDOM() {
        // Overlay elements
        this.scoreEl = document.getElementById('scoreValue');
        this.coinsEl = document.getElementById('coinsValue');
        this.comboEl = document.getElementById('comboValue');
        this.levelEl = document.getElementById('levelValue');
        this.speedEl = document.getElementById('speedValue');
        this.speedBarFill = document.getElementById('speedBarFill');
        this.nitroBarFill = document.getElementById('nitroBarFill');

        // Shield HUD & Button
        this.shieldCard = document.getElementById('shieldCard');
        this.shieldTimerValue = document.getElementById('shieldTimerValue');
        this.shieldBtn = document.getElementById('shieldBtn');
        this.shieldBtnLabel = document.getElementById('shieldBtnLabel');
        this.shieldPills = document.getElementById('shieldPills');

        // Modals
        this.startModal = document.getElementById('startModal');
        this.garageModal = document.getElementById('garageModal');
        this.pauseModal = document.getElementById('pauseModal');
        this.gameOverModal = document.getElementById('gameOverModal');

        // Buttons
        document.getElementById('startRaceBtn').addEventListener('click', () => this.startGame());
        document.getElementById('openGarageBtn').addEventListener('click', () => this.openGarage());
        document.getElementById('closeGarageBtn').addEventListener('click', () => this.closeGarage());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('resumeBtn').addEventListener('click', () => this.resumeGame());
        document.getElementById('restartPauseBtn').addEventListener('click', () => this.startGame());
        document.getElementById('quitMenuBtn').addEventListener('click', () => this.showMenu());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.startGame());
        document.getElementById('gameOverGarageBtn').addEventListener('click', () => {
            this.showMenu();
            this.openGarage();
        });

        const muteBtn = document.getElementById('muteBtn');
        muteBtn.addEventListener('click', () => {
            const muted = this.sound.toggleMute();
            muteBtn.innerHTML = muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
        });
    }

    spawnCoins() {
        // Spawns coins at periodic z-distances
        const spawnChance = this.score >= 650 ? 0.07 : 0.05;
        if (Math.random() < spawnChance) {
            const laneX = [-0.7, 0, 0.7][Math.floor(Math.random() * 3)];
            
            // Random coin numerical values: 5, 10, 25, 50, 100
            const rand = Math.random();
            let value = 5;
            if (rand > 0.92) value = 100;
            else if (rand > 0.75) value = 50;
            else if (rand > 0.50) value = 25;
            else if (rand > 0.25) value = 10;

            this.coinsList.push({
                x: laneX,
                z: 1.0, // Z perspective ratio: 1.0 (far horizon) -> 0.0 (near car)
                value: value,
                rotation: 0,
                collected: false
            });
        }
    }

    spawnObstacles() {
        // LEVEL 1 (Under 650 Score): Easy mode! Spawns traffic very rarely so player can enjoy driving
        // LEVEL 2 (650+ Score): Challenging mode! High traffic rate with multiple lanes!
        const spawnRate = this.score >= 650 ? 0.035 : 0.006;
        
        if (Math.random() < spawnRate) {
            const laneX = [-0.7, 0, 0.7][Math.floor(Math.random() * 3)];
            
            // Check if there is already an obstacle close by in same lane to prevent overlapping
            const hasNearby = this.obstaclesList.some(obs => obs.x === laneX && obs.z > 0.6);
            if (!hasNearby) {
                const colors = ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                this.obstaclesList.push({
                    x: laneX,
                    z: 1.0,
                    color: randomColor,
                    crashed: false
                });
            }
        }
    }

    initControls() {
        // Steering Buttons (Discrete Lane Switching: Left -0.7, Center 0, Right 0.7)
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');

        const moveLeft = () => {
            if (this.currentLane > -1) {
                this.currentLane--;
                this.carTargetX = this.currentLane * 0.7;
            }
            leftBtn.classList.add('active');
            setTimeout(() => leftBtn.classList.remove('active'), 150);
        };

        const moveRight = () => {
            if (this.currentLane < 1) {
                this.currentLane++;
                this.carTargetX = this.currentLane * 0.7;
            }
            rightBtn.classList.add('active');
            setTimeout(() => rightBtn.classList.remove('active'), 150);
        };

        leftBtn.addEventListener('mousedown', () => moveLeft());
        leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveLeft(); }, { passive: false });

        rightBtn.addEventListener('mousedown', () => moveRight());
        rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveRight(); }, { passive: false });

        // Nitro Button
        const nitroBtn = document.getElementById('nitroBtn');
        const setNitro = (val) => {
            this.input.nitro = val;
            val ? nitroBtn.classList.add('active') : nitroBtn.classList.remove('active');
        };
        nitroBtn.addEventListener('mousedown', () => setNitro(true));
        nitroBtn.addEventListener('mouseup', () => setNitro(false));
        nitroBtn.addEventListener('touchstart', (e) => { e.preventDefault(); setNitro(true); }, { passive: false });
        nitroBtn.addEventListener('touchend', (e) => { e.preventDefault(); setNitro(false); }, { passive: false });

        // Shield Button (Invincible Forcefield)
        const shieldBtn = document.getElementById('shieldBtn');
        if (shieldBtn) {
            const triggerShield = (e) => {
                if (e) e.preventDefault();
                this.activateShield();
            };
            shieldBtn.addEventListener('mousedown', triggerShield);
            shieldBtn.addEventListener('touchstart', triggerShield, { passive: false });
        }

        // Forward input helper
        const setForward = (val) => {
            this.input.forward = val;
        };

        // Keyboard Controls
        window.addEventListener('keydown', (e) => {
            this.sound.init();
            if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') setForward(true);
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') moveLeft();
            if (e.code === 'KeyD' || e.code === 'ArrowRight') moveRight();
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') setNitro(true);
            if (e.code === 'KeyE' || e.code === 'KeyS' || e.code === 'KeyC') this.activateShield();
            if (e.code === 'KeyP') this.pauseGame();
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') setForward(false);
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') setNitro(false);
        });
    }

    updateShieldUI() {
        if (this.shieldPills) {
            const dots = this.shieldPills.querySelectorAll('.shield-dot');
            dots.forEach((dot, index) => {
                if (index < this.shieldUsesLeft) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        if (this.shieldBtn) {
            if (this.shieldUsesLeft <= 0 && !this.shieldActive) {
                this.shieldBtn.classList.add('exhausted');
                if (this.shieldBtnLabel) this.shieldBtnLabel.textContent = 'NO SHIELD (0/3)';
            } else {
                this.shieldBtn.classList.remove('exhausted');
                if (!this.shieldActive) {
                    if (this.shieldBtnLabel) this.shieldBtnLabel.textContent = `SHIELD (${this.shieldUsesLeft}/3)`;
                }
            }
        }

        if (this.shieldCard) {
            if (this.shieldActive) {
                this.shieldCard.style.display = 'flex';
                if (this.shieldTimerValue) this.shieldTimerValue.textContent = `${this.shieldTimer.toFixed(1)}s (${this.shieldUsesLeft} left)`;
            } else {
                this.shieldCard.style.display = 'none';
            }
        }
    }

    activateShield() {
        this.sound.init();
        if (this.state !== 'PLAYING') return;

        const playerScreenX = (this.width / 2) + (this.carX * 220);

        // Check if shield is already active
        if (this.shieldActive) {
            this.triggerFloatingPopup(playerScreenX, this.carY - 40, '🛡️ SHIELD ALREADY ACTIVE!', '#00f0ff');
            return;
        }

        // Check if player has run out of 3 uses
        if (this.shieldUsesLeft <= 0) {
            this.sound.playCrashSound();
            this.triggerFloatingPopup(playerScreenX, this.carY - 40, '⚠️ NO SHIELDS LEFT (0/3 Used)!', '#ff0055');
            return;
        }

        // Deduct 1 shield use
        this.shieldUsesLeft--;
        this.shieldActive = true;
        this.shieldTimer = 10.0; // 10 seconds of full invincibility!
        this.sound.playShieldSound();

        this.triggerFloatingPopup(playerScreenX, this.carY - 40, `🛡️ SHIELD ACTIVE! (${this.shieldUsesLeft}/3 left)`, '#00f0ff');

        // Forcefield burst particles
        for (let p = 0; p < 25; p++) {
            const angle = Math.random() * Math.PI * 2;
            this.particles.push({
                x: playerScreenX + Math.cos(angle) * 50,
                y: this.carY + Math.sin(angle) * 30,
                vx: Math.cos(angle) * 7,
                vy: Math.sin(angle) * 7,
                radius: Math.random() * 6 + 3,
                color: '#00f0ff',
                life: 1.0
            });
        }

        if (this.shieldBtn) this.shieldBtn.classList.add('active');
        this.updateShieldUI();
    }

    updateMenuStats() {
        document.getElementById('menuHighScore').innerText = this.highScore.toLocaleString();
        document.getElementById('menuTotalCoins').innerText = this.totalCoinsBank.toLocaleString();
        document.getElementById('currentCarName').innerText = this.selectedCar.name;
        document.getElementById('previewSpeedBar').style.width = (this.selectedCar.topSpeed / 170 * 100) + '%';
        document.getElementById('previewAccelBar').style.width = (this.selectedCar.acceleration / 1.25 * 100) + '%';

        // Draw preview car canvas
        const pCanvas = document.getElementById('carPreviewCanvas');
        if (pCanvas) {
            const pCtx = pCanvas.getContext('2d');
            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
            this.drawCarSprite(pCtx, 80, 40, 1.1, this.selectedCar);
        }
    }

    renderCarPreviews() {
        const carGrid = document.getElementById('carGrid');
        if (!carGrid) return;
        carGrid.innerHTML = '';

        CAR_DATABASE.forEach(car => {
            const isSelected = car.id === this.selectedCar.id;
            const card = document.createElement('div');
            card.className = `car-card-option ${isSelected ? 'selected' : ''}`;

            card.innerHTML = `
                <canvas id="canvas_${car.id}" class="car-option-canvas" width="140" height="70"></canvas>
                <h4>${car.name}</h4>
                <div class="car-stats-mini">
                    <div>Top Speed: <strong>${car.topSpeed} KM/H</strong></div>
                    <div>Multiplier: <strong>x${car.scoreMultiplier} Score</strong></div>
                </div>
                ${car.unlocked ? `
                    <button class="btn btn-secondary btn-small" ${isSelected ? 'disabled' : ''}>
                        ${isSelected ? 'EQUIPPED' : 'SELECT'}
                    </button>
                ` : `
                    <button class="btn btn-primary btn-small">
                        <i class="fa-solid fa-coins"></i> UNLOCK (${car.cost})
                    </button>
                `}
            `;

            const btn = card.querySelector('button');
            btn.addEventListener('click', () => {
                if (car.unlocked) {
                    this.selectedCar = car;
                    localStorage.setItem('coin_rush_selected_car', car.id);
                    this.updateMenuStats();
                    this.renderCarPreviews();
                } else if (this.totalCoinsBank >= car.cost) {
                    this.totalCoinsBank -= car.cost;
                    car.unlocked = true;
                    this.selectedCar = car;
                    
                    const unlockedList = CAR_DATABASE.filter(c => c.unlocked).map(c => c.id);
                    localStorage.setItem('coin_rush_unlocked_cars', JSON.stringify(unlockedList));
                    localStorage.setItem('coin_rush_total_coins', this.totalCoinsBank);
                    localStorage.setItem('coin_rush_selected_car', car.id);

                    this.sound.playCoinSound(100);
                    this.updateMenuStats();
                    this.renderCarPreviews();
                } else {
                    alert(`Not enough coins! You need ${car.cost} coins to unlock ${car.name}.`);
                }
            });

            carGrid.appendChild(card);

            setTimeout(() => {
                const c = document.getElementById(`canvas_${car.id}`);
                if (c) {
                    const ctx = c.getContext('2d');
                    ctx.clearRect(0, 0, 140, 70);
                    this.drawCarSprite(ctx, 70, 35, 0.9, car);
                }
            }, 10);
        });

        document.getElementById('garageCoinsBank').innerText = this.totalCoinsBank.toLocaleString();
    }

    openGarage() {
        this.renderCarPreviews();
        this.garageModal.classList.add('active');
    }

    closeGarage() {
        this.garageModal.classList.remove('active');
    }

    showMenu() {
        this.state = 'MENU';
        this.startModal.classList.add('active');
        this.pauseModal.classList.remove('active');
        this.gameOverModal.classList.remove('active');
        this.garageModal.classList.remove('active');
        this.updateMenuStats();
    }

    startGame() {
        this.state = 'PLAYING';
        this.score = 0;
        this.coins = 0;
        this.combo = 1;
        this.comboTimer = 0;
        this.speed = 0;
        this.currentLane = 0;
        this.carX = 0;
        this.carTargetX = 0;
        this.nitroAmount = 100;
        this.distance = 0;
        this.shieldUsesLeft = 3;
        this.shieldActive = false;
        this.shieldTimer = 0;
        if (this.shieldBtn) this.shieldBtn.classList.remove('active');
        this.updateShieldUI();

        this.coinsList = [];
        this.obstaclesList = [];
        this.particles = [];

        this.startModal.classList.remove('active');
        this.pauseModal.classList.remove('active');
        this.gameOverModal.classList.remove('active');
        this.garageModal.classList.remove('active');

        this.updateHUD();
    }

    pauseGame() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            this.pauseModal.classList.add('active');
        }
    }

    resumeGame() {
        if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.pauseModal.classList.remove('active');
        }
    }

    gameOver() {
        this.state = 'GAMEOVER';
        this.totalCoinsBank += this.coins;
        localStorage.setItem('coin_rush_total_coins', this.totalCoinsBank);

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('coin_rush_highscore', this.highScore);
        }

        document.getElementById('finalScoreText').innerText = Math.floor(this.score).toLocaleString();
        document.getElementById('finalCoinsText').innerText = this.coins.toLocaleString();
        document.getElementById('finalHighScoreText').innerText = this.highScore.toLocaleString();

        this.gameOverModal.classList.add('active');
    }

    updateHUD() {
        this.scoreEl.innerText = Math.floor(this.score).toLocaleString();
        this.coinsEl.innerText = this.coins.toLocaleString();
        this.comboEl.innerText = `x${this.combo}`;
        
        // Update Level Badge & Check for Level 2 Announcement
        if (this.levelEl) {
            if (this.score >= 650) {
                if (this.levelEl.innerText !== 'LVL 2 🔥') {
                    this.levelEl.innerText = 'LVL 2 🔥';
                    this.levelEl.style.color = '#ff0055';
                    this.triggerFloatingPopup(this.width / 2, 280, 'LEVEL 2 UNLOCKED! 🔥', '#ff0055');
                }
            } else {
                this.levelEl.innerText = 'LVL 1';
                this.levelEl.style.color = '#00ff88';
            }
        }

        const speedKmh = Math.floor(this.speed);
        this.speedEl.innerText = speedKmh;
        this.speedBarFill.style.width = Math.min(100, (this.speed / this.selectedCar.topSpeed * 100)) + '%';
        this.nitroBarFill.style.width = this.nitroAmount + '%';
    }

    triggerFloatingPopup(x, y, text, color = '#ffcc00') {
        const popupsContainer = document.getElementById('floatingPopups');
        if (!popupsContainer) return;

        const popup = document.createElement('div');
        popup.className = 'coin-popup';
        popup.innerText = text;
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        if (color) popup.style.color = color;

        popupsContainer.appendChild(popup);
        setTimeout(() => popup.remove(), 1100);
    }

    update(dt) {
        if (this.state !== 'PLAYING') return;

        // 1. Smooth Lane Interpolation Logic
        // Smoothly move car towards target lane (Left: -0.7, Center: 0, Right: +0.7)
        this.carX += (this.carTargetX - this.carX) * (9 * dt);

        // 2. AUTO-DRIVE & DYNAMIC SCORE-BASED SPEED SCALING (Ideal Medium Speed)
        // Under 650 score: Smooth, normal medium speed (~100-105 KM/H)
        // Over 650 score: Dynamic, exciting yet easily controllable (~115-130 KM/H)
        let baseTopSpeed = this.selectedCar.topSpeed;
        if (this.score < 650) {
            baseTopSpeed = this.selectedCar.topSpeed * 0.85; // Medium normal cruising speed
        } else {
            // Gentle progressive scaling
            const scoreBonusRatio = Math.min(0.20, (this.score - 650) / 3000);
            baseTopSpeed = this.selectedCar.topSpeed * (0.95 + scoreBonusRatio);
        }

        let targetTopSpeed = baseTopSpeed;
        
        // Nitro Boost Check
        if (this.input.nitro && this.nitroAmount > 0) {
            targetTopSpeed *= 1.30;
            this.nitroAmount = Math.max(0, this.nitroAmount - 32 * dt);
            this.isNitroActive = true;
            this.sound.playNitroSound();

            // Spawn nitro exhaust particles
            for (let i = 0; i < 2; i++) {
                this.particles.push({
                    x: this.width / 2 + (this.carX * 220) + (Math.random() * 20 - 10),
                    y: this.carY + 40,
                    vx: (Math.random() - 0.5) * 2,
                    vy: Math.random() * 5 + 4,
                    radius: Math.random() * 6 + 4,
                    color: '#00f0ff',
                    life: 1.0
                });
            }
        } else {
            this.isNitroActive = false;
            // Slowly recharge nitro while driving
            if (this.nitroAmount < 100) {
                this.nitroAmount = Math.min(100, this.nitroAmount + 9 * dt);
            }
        }

        // Smooth Acceleration towards calculated target speed
        const accelRate = this.selectedCar.acceleration * 60 * dt;
        if (this.speed < targetTopSpeed) {
            this.speed = Math.min(targetTopSpeed, this.speed + accelRate);
        } else if (this.speed > targetTopSpeed) {
            this.speed = Math.max(targetTopSpeed, this.speed - 40 * dt);
        }

        // Sound Pitch Update
        this.sound.updateEngine(this.speed / this.selectedCar.topSpeed, this.input.forward);

        // Distance & Track Scrolling (Medium speed)
        const speedRatio = this.speed / 100;
        this.distance += this.speed * dt;
        this.roadOffset = (this.roadOffset + this.speed * dt * 0.28) % 100;

        // Passive score gain by distance
        this.score += this.speed * dt * 0.1 * this.selectedCar.scoreMultiplier;

        // Shield Timer Countdown & Visuals
        if (this.shieldActive) {
            this.shieldTimer -= dt;
            if (this.shieldTimer <= 0) {
                this.shieldActive = false;
                this.shieldTimer = 0;
                if (this.shieldBtn) this.shieldBtn.classList.remove('active');
                this.updateShieldUI();
            } else {
                if (this.shieldCard) {
                    this.shieldCard.style.display = 'flex';
                    if (this.shieldTimerValue) this.shieldTimerValue.textContent = `${this.shieldTimer.toFixed(1)}s (${this.shieldUsesLeft} left)`;
                }
                if (this.shieldBtnLabel) this.shieldBtnLabel.textContent = `${Math.ceil(this.shieldTimer)}s (${this.shieldUsesLeft})`;

                // Emit glowing shield particles around player car
                if (Math.random() < 0.35) {
                    const playerScreenX = (this.width / 2) + (this.carX * 220);
                    this.particles.push({
                        x: playerScreenX + (Math.random() - 0.5) * 80,
                        y: this.carY + (Math.random() - 0.5) * 60,
                        vx: (Math.random() - 0.5) * 4,
                        vy: (Math.random() - 0.5) * 4,
                        radius: Math.random() * 4 + 2,
                        color: '#00f0ff',
                        life: 0.6
                    });
                }
            }
        }

        // Spawn & Update Coins
        this.spawnCoins();

        for (let i = this.coinsList.length - 1; i >= 0; i--) {
            const coin = this.coinsList[i];
            
            // Move coin down the perspective Z plane with balanced medium speed
            coin.z -= (0.22 + speedRatio * 0.15) * dt;
            coin.rotation += 3.5 * dt;

            // Calculate screen coordinates for coin
            const screenY = 220 + (1 - coin.z) * 320;
            const perspectiveScale = 0.2 + (1 - coin.z) * 0.8;
            const screenX = (this.width / 2) + (coin.x * 220 * perspectiveScale);

            // Collision check when coin reaches player's car plane (z around 0.1 - 0.25)
            if (!coin.collected && coin.z <= 0.25 && coin.z >= 0.05) {
                const playerScreenX = (this.width / 2) + (this.carX * 220);
                const dx = Math.abs(screenX - playerScreenX);

                if (dx < 55) {
                    // COIN COLLECTED!
                    coin.collected = true;

                    // Add exact numerical coin value to score!
                    const earnedScore = Math.floor(coin.value * this.selectedCar.scoreMultiplier * this.combo);
                    this.score += earnedScore;
                    this.coins += 1;

                    // Combo increment
                    this.combo = Math.min(5, this.combo + 1);
                    this.comboTimer = 2.5; // Reset combo timer

                    // Audio & Visual Effects
                    this.sound.playCoinSound(coin.value);
                    this.triggerFloatingPopup(screenX, screenY, `+${coin.value}!`, coin.value >= 50 ? '#00f0ff' : '#ffcc00');

                    // Sparkle particles burst
                    for (let p = 0; p < 12; p++) {
                        this.particles.push({
                            x: screenX,
                            y: screenY,
                            vx: (Math.random() - 0.5) * 8,
                            vy: (Math.random() - 0.5) * 8,
                            radius: Math.random() * 5 + 3,
                            color: coin.value >= 50 ? '#00f0ff' : '#ffcc00',
                            life: 1.0
                        });
                    }
                }
            }

            // Remove coins that passed off screen
            if (coin.z <= 0.0 || coin.collected) {
                this.coinsList.splice(i, 1);
            }
        }

        // Spawn & Update Obstacles (Traffic Cars / Hurdles)
        this.spawnObstacles();

        for (let i = this.obstaclesList.length - 1; i >= 0; i--) {
            const obs = this.obstaclesList[i];

            // Move obstacle down the Z perspective plane with balanced medium speed
            obs.z -= (0.20 + speedRatio * 0.12) * dt;

            const screenY = 220 + (1 - obs.z) * 320;
            const perspectiveScale = 0.2 + (1 - obs.z) * 0.8;
            const screenX = (this.width / 2) + (obs.x * 220 * perspectiveScale);

            // CRASH / OUT COLLISION CHECK (Player car plane z between 0.05 and 0.25)
            if (!obs.crashed && obs.z <= 0.28 && obs.z >= 0.05) {
                const playerScreenX = (this.width / 2) + (this.carX * 220);
                const dx = Math.abs(screenX - playerScreenX);

                // If collision occurs (hit traffic car)
                if (dx < 50) {
                    obs.crashed = true;

                    if (this.shieldActive) {
                        // 🛡️ SHIELD IS ACTIVE: IMMUNE TO CRASH! NO GAME OVER!
                        this.sound.playShieldSmash();
                        this.score += 150;
                        this.triggerFloatingPopup(playerScreenX, screenY - 20, '💥 SHIELD SMASH! +150 ⭐', '#00f0ff');

                        // Blast away the traffic car into energy shards
                        for (let p = 0; p < 30; p++) {
                            this.particles.push({
                                x: screenX,
                                y: screenY,
                                vx: (Math.random() - 0.5) * 16,
                                vy: (Math.random() - 0.5) * 16,
                                radius: Math.random() * 8 + 3,
                                color: ['#00f0ff', '#38bdf8', '#ffff00', '#ffffff'][Math.floor(Math.random() * 4)],
                                life: 1.2
                            });
                        }
                    } else {
                        // NORMAL CRASH -> TRIGGER GAME OVER!
                        this.sound.playCrashSound();

                        // Explosive Fire Particles Burst
                        for (let p = 0; p < 35; p++) {
                            this.particles.push({
                                x: screenX,
                                y: screenY,
                                vx: (Math.random() - 0.5) * 14,
                                vy: (Math.random() - 0.5) * 14,
                                radius: Math.random() * 8 + 4,
                                color: ['#ff0055', '#ff9900', '#ffff00', '#ffffff'][Math.floor(Math.random() * 4)],
                                life: 1.2
                            });
                        }

                        // TRIGGER GAME OVER / OUT SYSTEM!
                        this.gameOver();
                        return;
                    }
                }
            }

            // Remove obstacle when it goes off screen
            if (obs.z <= 0.0) {
                this.obstaclesList.splice(i, 1);
            }
        }

        // Combo decay timer
        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                this.combo = 1;
            }
        }

        // Update Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 1.5 * dt;
            if (p.life <= 0) this.particles.splice(i, 1);
        }

        this.updateHUD();
    }

    drawRoad() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        // Sky & Sun Daylight Background
        const skyGradient = ctx.createLinearGradient(0, 0, 0, 220);
        skyGradient.addColorStop(0, '#60a5fa');
        skyGradient.addColorStop(0.7, '#93c5fd');
        skyGradient.addColorStop(1, '#bae6fd');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, this.width, 220);

        // Bright Sun Horizon Glow
        const sunGradient = ctx.createRadialGradient(this.width / 2, 220, 10, this.width / 2, 220, 120);
        sunGradient.addColorStop(0, '#fef08a');
        sunGradient.addColorStop(0.5, 'rgba(253, 224, 71, 0.4)');
        sunGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGradient;
        ctx.fillRect(0, 100, this.width, 120);

        // Horizon Mountains & City Skyline Silhouette
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(0, 220);
        ctx.lineTo(120, 150);
        ctx.lineTo(240, 220);
        ctx.lineTo(400, 160);
        ctx.lineTo(580, 220);
        ctx.lineTo(750, 140);
        ctx.lineTo(1000, 220);
        ctx.closePath();
        ctx.fill();

        // City Skyline Skyscraper Silhouettes with Glowing Windows (Increased Height)
        const cityBuildings = [
            { x: 30, w: 50, h: 140 },
            { x: 90, w: 65, h: 175 },
            { x: 165, w: 45, h: 120 },
            { x: 700, w: 60, h: 185 },
            { x: 770, w: 55, h: 150 },
            { x: 840, w: 70, h: 195 }
        ];

        cityBuildings.forEach(b => {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(b.x, 220 - b.h, b.w, b.h);
            
            // Glowing Windows Grid
            ctx.fillStyle = '#fef08a';
            for (let wx = b.x + 6; wx < b.x + b.w - 6; wx += 10) {
                for (let wy = 220 - b.h + 8; wy < 210; wy += 14) {
                    if ((wx + wy) % 3 !== 0) {
                        ctx.fillRect(wx, wy, 4, 6);
                    }
                }
            }
        });

        // Grass / Side Terrain (Vibrant Green)
        const grassGradient = ctx.createLinearGradient(0, 220, 0, this.height);
        grassGradient.addColorStop(0, '#4ade80');
        grassGradient.addColorStop(1, '#22c55e');
        ctx.fillStyle = grassGradient;
        ctx.fillRect(0, 220, this.width, this.height - 220);

        // Pseudo-3D Road Geometry (Asphalt Grey)
        const horizonY = 220;
        const horizonWidth = 80;
        const bottomWidth = 620;

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo((this.width / 2) - (horizonWidth / 2), horizonY);
        ctx.lineTo((this.width / 2) + (horizonWidth / 2), horizonY);
        ctx.lineTo((this.width / 2) + (bottomWidth / 2), this.height);
        ctx.lineTo((this.width / 2) - (bottomWidth / 2), this.height);
        ctx.closePath();
        ctx.fill();

        // Bright Road Edges
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 5;

        // Left Edge
        ctx.beginPath();
        ctx.moveTo((this.width / 2) - (horizonWidth / 2), horizonY);
        ctx.lineTo((this.width / 2) - (bottomWidth / 2), this.height);
        ctx.stroke();

        // Right Edge
        ctx.beginPath();
        ctx.moveTo((this.width / 2) + (horizonWidth / 2), horizonY);
        ctx.lineTo((this.width / 2) + (bottomWidth / 2), this.height);
        ctx.stroke();

        ctx.shadowBlur = 0; // Reset shadow blur

        // Moving Center Lane Stripes
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;

        const numStripes = 14;
        for (let i = 0; i < numStripes; i++) {
            const stripeZ = ((i * 8 + this.roadOffset) % 100) / 100;
            const y1 = horizonY + (stripeZ * (this.height - horizonY));
            const y2 = horizonY + (Math.min(1.0, stripeZ + 0.04) * (this.height - horizonY));
            const scale = (y1 - horizonY) / (this.height - horizonY);

            // Left & Right Lane Dashes
            const laneOffset = 70 * scale;
            
            ctx.beginPath();
            ctx.moveTo((this.width / 2) - laneOffset, y1);
            ctx.lineTo((this.width / 2) - laneOffset * 1.05, y2);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo((this.width / 2) + laneOffset, y1);
            ctx.lineTo((this.width / 2) + laneOffset * 1.05, y2);
            ctx.stroke();
        }

        // --- ATTRACTIVE ROADSIDE SCENERY (Tall Trees & High Lamp Posts) ---
        const numSideProps = 8;
        for (let i = 0; i < numSideProps; i++) {
            const propZ = ((i * 14 + this.roadOffset) % 100) / 100;
            const y = horizonY + (propZ * (this.height - horizonY));
            const scale = 0.2 + (propZ * 1.15); // Increased scale factor for extra height
            
            // X position offset expanding with perspective
            const roadHalfWidth = (horizonWidth / 2) + propZ * ((bottomWidth - horizonWidth) / 2);
            const leftX = (this.width / 2) - roadHalfWidth - (45 * scale);
            const rightX = (this.width / 2) + roadHalfWidth + (45 * scale);

            // 1. Draw Diverse Roadside Trees with Unique Shapes (Left Side)
            ctx.save();
            ctx.translate(leftX, y);
            ctx.scale(scale, scale);
            
            const treeType = i % 4; // 4 Distinct Natural Tree Varieties

            if (treeType === 0) {
                // TYPE 0: Tropical Tall Palm Tree
                ctx.fillStyle = '#78350f';
                ctx.beginPath();
                ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.lineTo(3, -115); ctx.lineTo(-3, -115);
                ctx.closePath(); ctx.fill();

                ctx.fillStyle = '#15803d';
                ctx.beginPath(); ctx.arc(0, -120, 38, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#22c55e';
                ctx.beginPath();
                ctx.arc(-18, -128, 25, 0, Math.PI * 2);
                ctx.arc(18, -128, 25, 0, Math.PI * 2);
                ctx.arc(0, -138, 22, 0, Math.PI * 2);
                ctx.fill();
            } else if (treeType === 1) {
                // TYPE 1: Triangular Pine / Evergreen Conifer Tree
                ctx.fillStyle = '#451a03';
                ctx.fillRect(-5, -60, 10, 60);

                // Layered Triangular Pine Canopy
                ctx.fillStyle = '#065f46';
                ctx.beginPath(); ctx.moveTo(0, -135); ctx.lineTo(-28, -85); ctx.lineTo(28, -85); ctx.closePath(); ctx.fill();
                ctx.fillStyle = '#047857';
                ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(-34, -60); ctx.lineTo(34, -60); ctx.closePath(); ctx.fill();
                ctx.fillStyle = '#10b981';
                ctx.beginPath(); ctx.moveTo(0, -80); ctx.lineTo(-40, -35); ctx.lineTo(40, -35); ctx.closePath(); ctx.fill();
            } else if (treeType === 2) {
                // TYPE 2: Round Leafy Oak / Deciduous Tree
                ctx.fillStyle = '#78350f';
                ctx.fillRect(-7, -70, 14, 70);

                // Fluffy Round Cloud-like Foliage
                ctx.fillStyle = '#166534';
                ctx.beginPath(); ctx.arc(0, -100, 42, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#15803d';
                ctx.beginPath(); ctx.arc(-20, -110, 26, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(20, -110, 26, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#4ade80';
                ctx.beginPath(); ctx.arc(0, -125, 22, 0, Math.PI * 2); ctx.fill();
            } else {
                // TYPE 3: Tall Slender Italian Cypress Tree
                ctx.fillStyle = '#581c87';
                ctx.fillRect(-4, -40, 8, 40);

                ctx.fillStyle = '#047857';
                ctx.beginPath();
                ctx.ellipse(0, -90, 16, 65, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#34d399';
                ctx.beginPath();
                ctx.ellipse(-4, -95, 10, 45, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();

            // 2. Draw Modern High Street Lamp Posts (Right Side)
            ctx.save();
            ctx.translate(rightX, y);
            ctx.scale(scale, scale);

            // Metallic Tall Pole
            ctx.fillStyle = '#475569';
            ctx.fillRect(-4, -145, 8, 145);
            ctx.fillRect(-22, -145, 26, 6);

            // Glowing Large Lamp Fixture
            ctx.fillStyle = '#fef08a';
            ctx.shadowColor = '#fef08a';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(-22, -142, 11, 0, Math.PI * 2);
            ctx.fill();

            // Soft Light Cone Projection onto Roadside
            const lightCone = ctx.createLinearGradient(0, -142, 0, 0);
            lightCone.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
            lightCone.addColorStop(1, 'transparent');
            ctx.fillStyle = lightCone;
            ctx.beginPath();
            ctx.moveTo(-22, -142);
            ctx.lineTo(-65, 0);
            ctx.lineTo(20, 0);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }

    drawCoins() {
        const ctx = this.ctx;

        // Sort coins so furthest render first
        this.coinsList.sort((a, b) => b.z - a.z);

        this.coinsList.forEach(coin => {
            const screenY = 220 + (1 - coin.z) * 320;
            const perspectiveScale = 0.2 + (1 - coin.z) * 0.8;
            const screenX = (this.width / 2) + (coin.x * 220 * perspectiveScale);
            const radius = 24 * perspectiveScale;

            ctx.save();
            ctx.translate(screenX, screenY);

            // Metallic Coin Color Scheme based on value
            let primaryColor = '#ffd700'; // Default Gold
            let borderColor = '#fff8a6';

            if (coin.value >= 100) {
                primaryColor = '#ff00ff';
                borderColor = '#ffffff';
            } else if (coin.value >= 50) {
                primaryColor = '#00ffcc';
                borderColor = '#ffffff';
            } else if (coin.value >= 25) {
                primaryColor = '#ffd700';
                borderColor = '#fffaac';
            } else if (coin.value >= 10) {
                primaryColor = '#c0c0c0';
                borderColor = '#ffffff';
            } else {
                primaryColor = '#cd7f32';
                borderColor = '#f5b078';
            }

            // 3D Spinning coin effect (ellipse width calculation)
            const scaleX = Math.abs(Math.sin(coin.rotation));

            // Coin outer glow
            ctx.shadowColor = primaryColor;
            ctx.shadowBlur = 12 * perspectiveScale;

            // Outer metallic rim
            ctx.beginPath();
            ctx.ellipse(0, 0, radius * scaleX, radius, 0, 0, Math.PI * 2);
            ctx.fillStyle = primaryColor;
            ctx.fill();
            ctx.lineWidth = 3 * perspectiveScale;
            ctx.strokeStyle = borderColor;
            ctx.stroke();

            // Inner coin face
            ctx.beginPath();
            ctx.ellipse(0, 0, radius * 0.75 * scaleX, radius * 0.75, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fill();

            // Render Exact Coin Number in Center!
            if (scaleX > 0.3) {
                ctx.fillStyle = '#ffffff';
                ctx.font = `900 ${Math.floor(14 * perspectiveScale)}px "Orbitron", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(coin.value, 0, 1);
            }

            ctx.restore();
        });
    }

    drawParticles() {
        const ctx = this.ctx;
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    drawCarSprite(ctx, x, y, scale = 1.0, carData = this.selectedCar) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        // Realistic Ground Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(0, 30, 46, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wide Performance Tires with Rim Detail
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-42, 12, 14, 24);
        ctx.fillRect(28, 12, 14, 24);
        ctx.fillRect(-38, -26, 12, 20);
        ctx.fillRect(26, -26, 12, 20);

        // Alloy Rim Highlights
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(-40, 18, 10, 12);
        ctx.fillRect(30, 18, 10, 12);
        ctx.fillRect(-36, -22, 8, 12);
        ctx.fillRect(28, -22, 8, 12);

        // Aerodynamic Supercar Main Body
        ctx.fillStyle = carData.primaryColor;
        ctx.shadowColor = carData.glowColor;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.moveTo(-30, 32);
        ctx.lineTo(30, 32);
        ctx.quadraticCurveTo(38, 30, 35, 8);
        ctx.lineTo(26, -30);
        ctx.quadraticCurveTo(0, -44, -26, -30);
        ctx.lineTo(-35, 8);
        ctx.quadraticCurveTo(-38, 30, -30, 32);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;

        // Central Carbon Racing Stripe
        ctx.fillStyle = carData.secondaryColor;
        ctx.beginPath();
        ctx.moveTo(-8, -38);
        ctx.lineTo(8, -38);
        ctx.lineTo(12, 32);
        ctx.lineTo(-12, 32);
        ctx.closePath();
        ctx.fill();

        // Panoramic Dark Glass Windshield & Cabin Roof
        const cabinGrad = ctx.createLinearGradient(0, -22, 0, 12);
        cabinGrad.addColorStop(0, '#0f172a');
        cabinGrad.addColorStop(0.5, '#38bdf8');
        cabinGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = cabinGrad;

        ctx.beginPath();
        ctx.moveTo(-18, -20);
        ctx.lineTo(18, -20);
        ctx.lineTo(22, 8);
        ctx.lineTo(-22, 8);
        ctx.closePath();
        ctx.fill();

        // Aerodynamic Side Mirrors
        ctx.fillStyle = carData.primaryColor;
        ctx.fillRect(-42, -10, 8, 5);
        ctx.fillRect(34, -10, 8, 5);

        // Hypercar Rear Carbon Spoiler Wing
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-34, 30, 68, 6);
        ctx.fillStyle = carData.primaryColor;
        ctx.fillRect(-36, 28, 6, 10);
        ctx.fillRect(30, 28, 6, 10);

        // LED Neon Strip Tail Lights
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.fillRect(-28, 27, 20, 3);
        ctx.fillRect(8, 27, 20, 3);

        // Dual Chrome Exhaust Pipes
        ctx.fillStyle = '#cbd5e1';
        ctx.shadowBlur = 0;
        ctx.fillRect(-12, 33, 6, 5);
        ctx.fillRect(6, 33, 6, 5);

        ctx.restore();
    }

    drawPlayerCar() {
        const screenX = (this.width / 2) + (this.carX * 220);
        const screenY = this.carY;
        this.drawCarSprite(this.ctx, screenX, screenY, 1.25, this.selectedCar);

        // Render Active Glowing Forcefield Shield Dome
        if (this.shieldActive) {
            const ctx = this.ctx;
            const now = performance.now() / 1000;
            const pulse = 1 + Math.sin(now * 8) * 0.05;

            ctx.save();
            ctx.translate(screenX, screenY);
            ctx.scale(pulse, pulse);

            // Forcefield Outer Glow
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 25;

            // Translucent glowing cyan energy sphere
            const gradient = ctx.createRadialGradient(0, 0, 15, 0, 0, 75);
            gradient.addColorStop(0, 'rgba(0, 240, 255, 0.05)');
            gradient.addColorStop(0.65, 'rgba(0, 240, 255, 0.28)');
            gradient.addColorStop(1, 'rgba(0, 240, 255, 0.75)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(0, 0, 68, 62, 0, 0, Math.PI * 2);
            ctx.fill();

            // Glowing Outer Forcefield Border
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = '#38bdf8';
            ctx.stroke();

            // Rotating electric energy orbit rings
            ctx.rotate(now * 2.5);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.setLineDash([14, 10]);
            ctx.beginPath();
            ctx.ellipse(0, 0, 64, 58, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.restore();
        }
    }

    drawObstacles() {
        const ctx = this.ctx;
        // Sort obstacles by z so furthest draw first
        this.obstaclesList.sort((a, b) => b.z - a.z);

        this.obstaclesList.forEach(obs => {
            const screenY = 220 + (1 - obs.z) * 320;
            const perspectiveScale = 0.2 + (1 - obs.z) * 0.8;
            const screenX = (this.width / 2) + (obs.x * 220 * perspectiveScale);

            const obsCarData = {
                primaryColor: obs.color,
                secondaryColor: '#1e293b',
                glowColor: obs.color
            };
            this.drawCarSprite(ctx, screenX, screenY, perspectiveScale * 1.1, obsCarData);
        });
    }

    render() {
        this.drawRoad();
        this.drawCoins();
        this.drawObstacles();
        this.drawParticles();
        this.drawPlayerCar();
    }

    gameLoop(now) {
        const dt = Math.min(0.1, (now - this.lastTime) / 1000);
        this.lastTime = now;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.gameLoop(t));
    }
}

// Initialize Game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
