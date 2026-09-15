document.addEventListener('DOMContentLoaded', () => {
    // ---- AUDIO & VOICE SYSTEM ----
    let audioCtx;
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSound(type) {
        try {
            initAudio();
            const now = audioCtx.currentTime;
            
            if (type === 'click') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                // Crisp, modern UI "tick"
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1000, now);
                osc.frequency.exponentialRampToValueAtTime(500, now + 0.05);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                
            } else if (type === 'move') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                // Soft, pleasant "bloop" or "pop"
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
                gain.gain.setValueAtTime(0.7, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                
            } else if (type === 'dice') {
                // Dice rolling: quick consecutive rattles
                for (let i = 0; i < 5; i++) {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    let t = now + i * 0.08 + (Math.random() * 0.02);
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(500 + Math.random()*200, t);
                    gain.gain.setValueAtTime(0.4, t);
                    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
                    
                    osc.start(t);
                    osc.stop(t + 0.05);
                }
                
            } else if (type === 'win') {
                // Happy, victorious arpeggio (chord rolling up)
                const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
                notes.forEach((freq, i) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    let t = now + i * 0.12;
                    let duration = (i === notes.length - 1) ? 1.0 : 0.2;
                    
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, t);
                    gain.gain.setValueAtTime(0.4, t);
                    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
                    
                    osc.start(t);
                    osc.stop(t + duration);
                });
            }
        } catch(e) { console.log('Audio error:', e); }
    }

    function speak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(text);
            msg.rate = 1.1;
            msg.pitch = 1.2;
            window.speechSynthesis.speak(msg);
        }
    }
    // ---- DOM ELEMENTS ----
    const menuScreen = document.getElementById('menu-screen');
    const gameScreen = document.getElementById('game-screen');
    const playerModal = document.getElementById('player-modal');
    const gameOverModal = document.getElementById('game-over-modal');
    const mainBoard = document.getElementById('main-board');
    
    const modeBtns = document.querySelectorAll('.mode-btn');
    const playBtns = document.querySelectorAll('.btn-play-now');
    
    // ---- MENU LOGIC ----
    let selectedMode = null;
    let selectedPlayerCount = 2; // Default 2 players
    let gameConfig = { mode: '', players: [] }; // players: array of {id, color, type: 'user'|'bot'}
    
    playBtns.forEach(btn => btn.disabled = true);
    
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            modeBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedMode = btn.dataset.mode;
            playBtns.forEach(pBtn => pBtn.disabled = false);
        });
    });
    
    playBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            if (!selectedMode) return;
            if (selectedMode === 'computer') {
                startGame(2, 'computer'); // 1 User, 1 Bot
            } else {
                playerModal.classList.add('active'); // Ask for player count
            }
        });
    });
    
    document.querySelectorAll('.btn-player-count').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            selectedPlayerCount = parseInt(btn.dataset.count);
            playerModal.classList.remove('active');
            startGame(selectedPlayerCount, selectedMode);
        });
    });
    
    document.getElementById('btn-close-modal').addEventListener('click', () => {
        playSound('click');
        playerModal.classList.remove('active');
    });
    
    document.getElementById('btn-back-menu').addEventListener('click', () => {
        playSound('click');
        gameScreen.classList.remove('active');
        menuScreen.classList.add('active');
        // Reset game here if needed
    });
    
    document.getElementById('btn-play-again').addEventListener('click', () => {
        playSound('click');
        gameOverModal.classList.remove('active');
        gameScreen.classList.remove('active');
        menuScreen.classList.add('active');
    });
    
    // ---- GAME LOGIC ----
    const CELL_SIZE = 24; // matches CSS --cell-size-game
    // Colors order (clockwise): blue -> red -> green -> yellow
    const COLORS = ['blue', 'red', 'green', 'yellow'];
    const START_INDICES = { blue: 0, red: 13, green: 26, yellow: 39 };
    
    // 52 Path Coordinates (row, col) - 0-indexed
    const PATH = [
        [13,6], [12,6], [11,6], [10,6], [9,6], 
        [8,5], [8,4], [8,3], [8,2], [8,1], [8,0], [7,0], [6,0],
        [6,1], [6,2], [6,3], [6,4], [6,5],
        [5,6], [4,6], [3,6], [2,6], [1,6], [0,6], [0,7], [0,8],
        [1,8], [2,8], [3,8], [4,8], [5,8],
        [6,9], [6,10], [6,11], [6,12], [6,13], [6,14], [7,14], [8,14],
        [8,13], [8,12], [8,11], [8,10], [8,9],
        [9,8], [10,8], [11,8], [12,8], [13,8], [14,8], [14,7], [14,6]
    ];
    
    // Home stretch coordinates
    const HOME_STRETCH = {
        blue: [[13,7], [12,7], [11,7], [10,7], [9,7], [7,7]], // last is center
        red: [[7,1], [7,2], [7,3], [7,4], [7,5], [7,7]],
        green: [[1,7], [2,7], [3,7], [4,7], [5,7], [7,7]],
        yellow: [[7,13], [7,12], [7,11], [7,10], [7,9], [7,7]]
    };
    
    // Base positions (approximate grid row, col for 4 tokens inside inner box)
    const BASE_POSITIONS = {
        blue: [[11,2], [11,4], [13,2], [13,4]],
        red: [[2,2], [2,4], [4,2], [4,4]],
        green: [[2,11], [2,13], [4,11], [4,13]],
        yellow: [[11,11], [11,13], [13,11], [13,13]]
    };
    
    const SAFE_SQUARES = [0, 8, 13, 21, 26, 34, 39, 47]; // Global indices of starts and stars
    
    // Game State
    let players = [];
    let currentPlayerIndex = 0;
    let currentRoll = 0;
    let hasRolled = false;
    let tokens = []; // Array of { id, color, el, state: 'base'|'track'|'home', pos: int }
    
    // Draw static board background
    drawBoard();
    
    function startGame(playerCount, mode) {
        menuScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        mainBoard.innerHTML = ''; // Clear tokens
        drawBoard(); // Redraw grid
        
        // Setup Players based on Mode
        players = [];
        let pColors = ['blue', 'green', 'red', 'yellow']; 
        if (playerCount === 2) pColors = ['blue', 'green'];
        if (playerCount === 3) pColors = ['blue', 'green', 'red'];
        
        for (let i = 0; i < playerCount; i++) {
            let type = 'user';
            // If mode is computer or online, opponents are bots.
            // If mode is friends, user plays all of them themselves (Pass N Play).
            if ((mode === 'computer' || mode === 'online') && i > 0) {
                type = 'bot';
            }
            
            players.push({ id: i, color: pColors[i], type: type });
        }
        
        // Initialize Tokens
        tokens = [];
        let tokenId = 0;
        players.forEach(p => {
            for (let i = 0; i < 4; i++) {
                const el = document.createElement('div');
                el.className = `game-token ${p.color}-token`;
                el.classList.add('pin-wrapper');
                el.innerHTML = `<div class="pin-base"></div><div class="pin-body"></div><div class="pin-dot"></div>`;
                
                const currentId = tokenId;
                el.dataset.id = currentId;
                el.addEventListener('click', () => handleTokenClick(currentId));
                
                mainBoard.appendChild(el);
                
                tokens.push({
                    id: currentId,
                    color: p.color,
                    playerIndex: p.id,
                    state: 'base',
                    pos: i, // index 0-3 for base
                    el: el
                });
                
                updateTokenVisual(currentId);
                tokenId++;
            }
        });
        
        currentPlayerIndex = 0;
        hasRolled = false;
        currentRoll = 0;
        
        // Show only relevant dice boxes
        ['blue', 'green', 'red', 'yellow'].forEach(c => {
            const db = document.getElementById('dice-' + c);
            if (db) db.style.visibility = players.some(p => p.color === c) ? 'visible' : 'hidden';
        });
        
        updateUI();
        
        // If first player is bot (shouldn't happen typically, but just in case)
        if (players[currentPlayerIndex].type === 'bot') {
            setTimeout(playBotTurn, 1000);
        }
    }
    
    function updateTokenVisual(id) {
        const t = tokens[id];
        let row, col;
        
        if (t.state === 'base') {
            const baseStart = { red: [1,1], green: [1,10], blue: [10,1], yellow: [10,10] };
            const [sr, sc] = baseStart[t.color];
            
            // Exact pixel offsets for the 4 circles relative to .home-inner
            const offsets = [
                [26.25, 26.25], // top-left
                [26.25, 72.75], // top-right
                [72.75, 26.25], // bottom-left
                [72.75, 72.75]  // bottom-right
            ];
            const [oy, ox] = offsets[t.pos];
            
            // Calculate absolute center coords for the token
            const cx = sc * 25 + ox;
            const cy = sr * 25 + oy;
            
            const w = 19.2;
            const h = 22.8;
            
            t.el.style.top = `${cy - h/2}px`;
            t.el.style.left = `${cx - w/2}px`;
            t.el.style.setProperty('--token-scale', '1');
            t.el.style.setProperty('--token-x', '0px');
            t.el.style.setProperty('--token-y', '0px');
            t.el.style.zIndex = 100;
        } else if (t.state === 'track') {
            [row, col] = PATH[t.pos];
            applyCellPosition(t, row, col, tokens.filter(tok => tok.state === 'track' && tok.pos === t.pos));
        } else if (t.state === 'home') {
            [row, col] = HOME_STRETCH[t.color][t.pos];
            applyCellPosition(t, row, col, tokens.filter(tok => tok.state === 'home' && tok.color === t.color && tok.pos === t.pos));
        }
    }

    function applyCellPosition(t, row, col, sharing) {
        t.el.style.top = `calc(${row} * (var(--cell-size-game) + 1px) + 1px)`;
        t.el.style.left = `calc(${col} * (var(--cell-size-game) + 1px) + 2.5px)`;
        
        if (sharing.length <= 1) {
            t.el.style.setProperty('--token-scale', '1');
            t.el.style.setProperty('--token-x', '0px');
            t.el.style.setProperty('--token-y', '0px');
            t.el.style.zIndex = 100;
        } else {
            let idx = sharing.findIndex(tok => tok.id === t.id);
            let offsetXY = getOffset(idx, sharing.length);
            t.el.style.setProperty('--token-scale', '0.65');
            t.el.style.setProperty('--token-x', offsetXY.x + 'px');
            t.el.style.setProperty('--token-y', offsetXY.y + 'px');
            t.el.style.zIndex = 100 + idx;
        }
    }

    function getOffset(idx, total) {
        const offset = 6;
        if (total === 2) {
            return idx === 0 ? {x: -offset, y: -offset} : {x: offset, y: offset};
        } else if (total === 3) {
            if (idx === 0) return {x: -offset, y: -offset};
            if (idx === 1) return {x: offset, y: -offset};
            return {x: 0, y: offset};
        } else if (total >= 4) {
            if (idx === 0) return {x: -offset, y: -offset};
            if (idx === 1) return {x: offset, y: -offset};
            if (idx === 2) return {x: -offset, y: offset};
            if (idx === 3) return {x: offset, y: offset};
            return {x: (idx-4)*2, y: (idx-4)*2};
        }
        return {x: 0, y: 0};
    }
    
    function updateUI() {
        const cp = players[currentPlayerIndex];
        
        ['blue', 'green', 'red', 'yellow'].forEach(c => {
            const db = document.getElementById('dice-' + c);
            if(db) db.classList.remove('active-dice', 'can-roll');
            if(db) db.onclick = null;
        });
        
        const hint = document.getElementById('dice-hint');
        hint.style.opacity = '0';
        
        // Remove playable highlights
        tokens.forEach(t => t.el.classList.remove('playable'));
        
        const currentDiceBox = document.getElementById('dice-' + cp.color);
        if (cp.type === 'user' && !hasRolled) {
            currentDiceBox.classList.add('active-dice', 'can-roll');
            if (cp.color === 'blue') hint.style.opacity = '1';
            currentDiceBox.onclick = () => rollDice(currentDiceBox.querySelector('.die'));
        }
        
        if (hasRolled && cp.type === 'user') {
            // Highlight playable tokens
            const movables = getMovableTokens(cp.color, currentRoll);
            if (movables.length === 0) {
                setTimeout(nextTurn, 1000); // No moves possible
            } else {
                movables.forEach(t => t.el.classList.add('playable'));
            }
        }
    }
    
    function getDiceDotsHTML(roll) {
        let dots = '';
        const d = (t, l) => `<div class="die-dot" style="position:absolute; top:${t}px; left:${l}px;"></div>`;
        if (roll === 1) dots += d(8, 8);
        if (roll === 2) dots += d(2, 2) + d(14, 14);
        if (roll === 3) dots += d(2, 2) + d(8, 8) + d(14, 14);
        if (roll === 4) dots += d(2, 2) + d(2, 14) + d(14, 2) + d(14, 14);
        if (roll === 5) dots += d(2, 2) + d(2, 14) + d(8, 8) + d(14, 2) + d(14, 14);
        if (roll === 6) dots += d(2, 2) + d(2, 14) + d(8, 2) + d(8, 14) + d(14, 2) + d(14, 14);
        return `<div style="position:relative; width:24px; height:24px;">${dots}</div>`;
    }

    function rollDice(dieElement) {
        if (hasRolled) return;
        hasRolled = true;
        playSound('dice');
        
        // Animation
        let ticks = 0;
        let interval = setInterval(() => {
            dieElement.innerHTML = getDiceDotsHTML(Math.floor(Math.random()*6)+1);
            ticks++;
            if (ticks > 10) {
                clearInterval(interval);
                currentRoll = Math.floor(Math.random() * 6) + 1; // 1-6
                
                // Bias slightly towards 6 to speed up testing
                if (Math.random() < 0.2) currentRoll = 6;
                
                dieElement.innerHTML = getDiceDotsHTML(currentRoll);
                updateUI();
                
                if (currentRoll === 6 && players[currentPlayerIndex].type === 'user') {
                    speak("Awesome! You got a six!");
                }
                
                if (players[currentPlayerIndex].type === 'bot') {
                    setTimeout(executeBotMove, 1000);
                }
            }
        }, 50);
        
        // Remove can-roll class
        ['blue', 'green', 'red', 'yellow'].forEach(c => {
            const db = document.getElementById('dice-' + c);
            if(db) db.classList.remove('can-roll');
        });
        document.getElementById('dice-hint').style.opacity = '0';
    }
    
    function getMovableTokens(color, roll) {
        const pTokens = tokens.filter(t => t.color === color);
        let movables = [];
        
        pTokens.forEach(t => {
            if (t.state === 'base' && roll === 6) {
                movables.push(t);
            } else if (t.state === 'track') {
                const stepsFromStart = getStepsFromStart(t.pos, color);
                if (stepsFromStart + roll <= 56) {
                    movables.push(t);
                }
            } else if (t.state === 'home') {
                if (t.pos + roll <= 5) { // 5 is center
                    movables.push(t);
                }
            }
        });
        return movables;
    }
    
    function handleTokenClick(tokenId) {
        const cp = players[currentPlayerIndex];
        if (cp.type !== 'user' || !hasRolled) return;
        
        const t = tokens[tokenId];
        if (t.color !== cp.color) return;
        if (!t.el.classList.contains('playable')) return;
        
        moveToken(t, currentRoll);
    }
    
    function moveToken(t, roll) {
        const cp = players[currentPlayerIndex];
        playSound('move');
        // Remove playability highlights immediately
        tokens.forEach(tok => tok.el.classList.remove('playable'));
        
        if (t.state === 'base') {
            t.state = 'track';
            t.pos = START_INDICES[t.color];
        } else if (t.state === 'track') {
            let steps = getStepsFromStart(t.pos, t.color);
            if (steps + roll > 50) {
                // Moving into home stretch
                let remaining = roll - (50 - steps);
                t.state = 'home';
                t.pos = remaining - 1;
            } else {
                t.pos = (t.pos + roll) % 52;
            }
        } else if (t.state === 'home') {
            t.pos += roll;
        }
        
        // Check Capture
        let captured = false;
        if (t.state === 'track' && !SAFE_SQUARES.includes(t.pos)) {
            const hitTokens = tokens.filter(oth => oth.state === 'track' && oth.pos === t.pos && oth.color !== t.color);
            if (hitTokens.length > 0) {
                // Kill them all!
                hitTokens.forEach(hit => {
                    hit.state = 'base';
                    // Find an empty base pos
                    const usedPos = tokens.filter(tt => tt.state === 'base' && tt.color === hit.color).map(tt => tt.pos);
                    hit.pos = [0,1,2,3].find(p => !usedPos.includes(p)) || 0;
                });
                captured = true;
                
                if (cp.type === 'user') {
                    speak("Gotcha! Token captured!");
                } else {
                    speak("Oh no! Your token was captured!");
                }
            }
        }
        
        tokens.forEach(tok => updateTokenVisual(tok.id));
        
        // Check Win Condition
        const myTokens = tokens.filter(tok => tok.color === t.color);
        const won = myTokens.every(tok => tok.state === 'home' && tok.pos === 5); // 5 is center
        
        setTimeout(() => {
            if (won) {
                playSound('win');
                speak(`Congratulations! Player ${cp.id + 1} Wins the game!`);
                document.getElementById('winner-text').innerText = `Player ${cp.id + 1} (${cp.color.toUpperCase()}) Wins!`;
                gameOverModal.classList.add('active');
            } else {
                // Bonus roll if rolled 6 or captured
                if (roll === 6 || captured) {
                    hasRolled = false;
                    updateUI();
                    if (players[currentPlayerIndex].type === 'bot') {
                        setTimeout(playBotTurn, 1000);
                    }
                } else {
                    nextTurn();
                }
            }
        }, 500);
    }
    
    function getStepsFromStart(globalPos, color) {
        let start = START_INDICES[color];
        if (globalPos >= start) return globalPos - start;
        return (52 - start) + globalPos;
    }
    
    function nextTurn() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        hasRolled = false;
        currentRoll = 0;
        
        const cp = players[currentPlayerIndex];
        
        // Reset dice displays
        ['blue', 'green', 'red', 'yellow'].forEach(c => {
            const d = document.querySelector('#dice-' + c + ' .die');
            if (d) d.innerHTML = getDiceDotsHTML(1);
        });
        
        updateUI();
        
        if (cp.type === 'bot') {
            setTimeout(playBotTurn, 1000);
        }
    }
    
    // ---- BOT AI ----
    function playBotTurn() {
        if (!gameScreen.classList.contains('active')) return;
        const cp = players[currentPlayerIndex];
        if (cp.type !== 'bot') return;
        
        // Determine which dice box to use for animation
        const diceBox = document.getElementById('dice-' + cp.color);
        rollDice(diceBox.querySelector('.die'));
    }
    
    function executeBotMove() {
        const cp = players[currentPlayerIndex];
        const movables = getMovableTokens(cp.color, currentRoll);
        
        if (movables.length === 0) {
            setTimeout(nextTurn, 1000);
            return;
        }
        
        // Priority 1: Kill opponent if possible
        let bestToken = null;
        for (let t of movables) {
            if (t.state === 'base') continue;
            let targetPos = -1;
            if (t.state === 'track') {
                let steps = getStepsFromStart(t.pos, t.color);
                if (steps + currentRoll <= 50) {
                    targetPos = (t.pos + currentRoll) % 52;
                }
            }
            if (targetPos !== -1 && !SAFE_SQUARES.includes(targetPos)) {
                let enemies = tokens.some(oth => oth.state === 'track' && oth.pos === targetPos && oth.color !== t.color);
                if (enemies) {
                    bestToken = t;
                    break;
                }
            }
        }
        
        // Priority 2: Take token out of base
        if (!bestToken) {
            let baseTokens = movables.filter(t => t.state === 'base');
            if (baseTokens.length > 0) bestToken = baseTokens[0];
        }
        
        // Priority 3: Move token into home stretch to secure it
        if (!bestToken) {
            for (let t of movables) {
                if (t.state === 'track') {
                    let steps = getStepsFromStart(t.pos, t.color);
                    if (steps + currentRoll > 50) { // Will enter home
                        bestToken = t;
                        break;
                    }
                }
            }
        }
        
        // Priority 4: Just pick the one that's furthest along
        if (!bestToken) {
            movables.sort((a,b) => {
                let scoreA = a.state==='home'? 100 + a.pos : (a.state==='track'? getStepsFromStart(a.pos, a.color) : -1);
                let scoreB = b.state==='home'? 100 + b.pos : (b.state==='track'? getStepsFromStart(b.pos, b.color) : -1);
                return scoreB - scoreA;
            });
            bestToken = movables[0];
        }
        
        moveToken(bestToken, currentRoll);
    }
    
    // ---- BOARD DRAWING (Static) ----
    function drawBoard() {
        const board = document.getElementById('main-board');
        if (!board) return;
        
        // Fill 225 grid cells for the background paths
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.gridRow = `${row + 1}`;
                cell.style.gridColumn = `${col + 1}`;

                // Arrows
                if (row === 7 && col === 0) { cell.classList.add('track-arrow', 'red-text'); cell.innerText = '→'; }
                if (row === 0 && col === 7) { cell.classList.add('track-arrow', 'green-text'); cell.innerText = '↓'; }
                if (row === 7 && col === 14) { cell.classList.add('track-arrow', 'yellow-text'); cell.innerText = '←'; }
                if (row === 14 && col === 7) { cell.classList.add('track-arrow', 'blue-text'); cell.innerText = '↑'; }

                // Starts
                if (row === 6 && col === 1) cell.classList.add('red-bg');
                if (row === 1 && col === 8) cell.classList.add('green-bg');
                if (row === 8 && col === 13) cell.classList.add('yellow-bg');
                if (row === 13 && col === 6) cell.classList.add('blue-bg');

                // Home stretches
                if (row === 7 && col >= 1 && col <= 5) cell.classList.add('red-bg');
                if (col === 7 && row >= 1 && row <= 5) cell.classList.add('green-bg');
                if (row === 7 && col >= 9 && col <= 13) cell.classList.add('yellow-bg');
                if (col === 7 && row >= 9 && row <= 13) cell.classList.add('blue-bg');

                // Stars
                if (row === 8 && col === 2) { cell.classList.add('star'); cell.innerText = '☆'; }
                if (row === 2 && col === 6) { cell.classList.add('star'); cell.innerText = '☆'; }
                if (row === 6 && col === 12) { cell.classList.add('star'); cell.innerText = '☆'; }
                if (row === 12 && col === 8) { cell.classList.add('star'); cell.innerText = '☆'; }

                board.appendChild(cell);
            }
        }

        function createHomeBg(color, rowStart, colStart, text = '', textPos = '') {
            const home = document.createElement('div');
            home.className = `home ${color}-home`;
            const inner = document.createElement('div');
            inner.className = 'home-inner';
            
            // Add 4 base circles
            for (let i = 0; i < 4; i++) {
                let c = document.createElement('div');
                c.className = `base-circle ${color}-base-circle`;
                inner.appendChild(c);
            }
            home.appendChild(inner);
            
            // Add Label
            if (text) {
                const span = document.createElement('span');
                span.className = `home-text ${textPos}`;
                span.innerText = text;
                home.appendChild(span);
            }
            
            board.appendChild(home);
        }

        createHomeBg('red', 1, 1);
        createHomeBg('green', 1, 10, 'Bot', 'top');
        createHomeBg('blue', 10, 1, 'You', 'bottom');
        createHomeBg('yellow', 10, 10);

        const center = document.createElement('div');
        center.className = 'center-area';
        center.innerHTML = `
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <polygon points="0,0 100,0 50,50" fill="var(--color-green)" stroke="#000" stroke-width="0.5"/>
                <polygon points="100,0 100,100 50,50" fill="var(--color-yellow)" stroke="#000" stroke-width="0.5"/>
                <polygon points="0,100 100,100 50,50" fill="var(--color-blue)" stroke="#000" stroke-width="0.5"/>
                <polygon points="0,0 0,100 50,50" fill="var(--color-red)" stroke="#000" stroke-width="0.5"/>
                <line x1="0" y1="0" x2="100" y2="100" stroke="#000" stroke-width="1.5" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="#000" stroke-width="1.5" />
            </svg>
        `;
        board.appendChild(center);
    }
});
