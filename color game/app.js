const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

let bgMusicInterval;
function startBgMusic() {
    if (bgMusicInterval) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    // Play a gentle, magical celesta-like arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63]; 
    let index = 0;
    
    bgMusicInterval = setInterval(() => {
        // Main tone (sine)
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.value = notes[index];
        gain1.gain.setValueAtTime(0.15, audioCtx.currentTime); 
        gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start();
        osc1.stop(audioCtx.currentTime + 1.2);

        // Harmonic tone (triangle) for a "magical bell" attractive sound
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.value = notes[index] * 2; // octave higher
        gain2.gain.setValueAtTime(0.05, audioCtx.currentTime); 
        gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 1.0);
        
        index = (index + 1) % notes.length;
    }, 400);
}

// Click sound for buttons (attractive xylophone tick)
function playClickSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); 
    
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

// Pop sound when coloring a shape (attractive bubble pop)
window.playPopSound = function() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

// Attractive Human Voice (Text-to-Speech) for color names
const colorNames = {
    '#ff0000': 'Red', '#e91e63': 'Pink', '#f06292': 'Light Pink',
    '#ff9800': 'Orange', '#ff5722': 'Deep Orange', '#ffcc80': 'Peach',
    '#ffeb3b': 'Yellow', '#fbc02d': 'Golden Yellow',
    '#4caf50': 'Green', '#8bc34a': 'Light Green', '#009688': 'Teal', '#aed581': 'Lime',
    '#00bcd4': 'Cyan', '#03a9f4': 'Light Blue', '#2196f3': 'Blue', '#3f51b5': 'Indigo',
    '#9c27b0': 'Purple', '#673ab7': 'Deep Purple', '#ce93d8': 'Light Purple',
    '#795548': 'Brown', '#8d6e63': 'Light Brown',
    '#9e9e9e': 'Gray', '#607d8b': 'Blue Gray', '#000000': 'Black',
    'url(#shine-gold)': 'Shiny Gold',
    'url(#shine-silver)': 'Shiny Silver',
    'url(#shine-bronze)': 'Shiny Bronze',
    'url(#shine-ruby)': 'Shiny Ruby',
    'url(#shine-emerald)': 'Shiny Emerald',
    'url(#shine-sapphire)': 'Shiny Sapphire',
    'url(#shine-amethyst)': 'Shiny Amethyst',
    'url(#shine-rosegold)': 'Shiny Rose Gold',
    'url(#shine-aqua)': 'Shiny Aqua',
    'url(#shine-magic)': 'Magic Rainbow',
    '#ffffff': 'Eraser'
};

// Pre-load voices
let synthVoices = [];
if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = () => {
        synthVoices = speechSynthesis.getVoices();
    };
}

function speakColor(colorStr) {
    const name = colorNames[colorStr];
    if (!name || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(name);
    
    // Try to find an attractive female/sweet voice
    if (synthVoices.length === 0) synthVoices = window.speechSynthesis.getVoices();
    let bestVoice = synthVoices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Google US English') || v.name.includes('Zira') || (v.name.includes('Female') && v.lang.startsWith('en')));
    if (bestVoice) {
        utterance.voice = bestVoice;
    }
    
    utterance.rate = 0.9; // Slightly slower
    utterance.pitch = 1.4; // Higher pitch for a sweeter, more attractive voice
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
}

// Start BG music on first interaction
document.addEventListener('click', () => {
    startBgMusic();
}, { once: true });

// Play sound on click
document.addEventListener('click', (e) => {
    const swatch = e.target.closest('.color-swatch');
    if (swatch && (swatch.classList.contains('locked') || swatch.classList.contains('used'))) {
        return; // Locked: do not play click sound or speak
    }

    if (e.target.closest('button') || swatch || e.target.closest('.card-inner img')) {
        playClickSound();
    }
    
    // If a valid color swatch was clicked, also speak the beautiful voice
    if (swatch) {
        const color = swatch.getAttribute('data-color');
        speakColor(color);
    }
});
