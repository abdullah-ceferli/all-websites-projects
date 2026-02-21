
// Synthesized Audio Service
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
const audioCtx = new AudioContext();

const ensureContext = () => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

export const playOrderFill = () => {
    ensureContext();
    const t = audioCtx.currentTime;
    
    // Main "Ding" (C6)
    const osc1 = audioCtx.createOscillator();
    const g1 = audioCtx.createGain();
    osc1.connect(g1);
    g1.connect(audioCtx.destination);
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.50, t); 
    g1.gain.setValueAtTime(0.1, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc1.start(t);
    osc1.stop(t + 0.6);

    // Harmony "Sparkle" (E6 delayed)
    const osc2 = audioCtx.createOscillator();
    const g2 = audioCtx.createGain();
    osc2.connect(g2);
    g2.connect(audioCtx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, t + 0.05); 
    g2.gain.setValueAtTime(0.05, t + 0.05);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc2.start(t + 0.05);
    osc2.stop(t + 0.5);
};

export const playTakeProfit = () => {
    ensureContext();
    const t = audioCtx.currentTime;
    
    // Ascending Arpeggio (C Major)
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    freqs.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.connect(g);
        g.connect(audioCtx.destination);
        
        const startTime = t + i * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, startTime);
        g.gain.setValueAtTime(0.08, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        
        osc.start(startTime);
        osc.stop(startTime + 0.4);
    });
};

export const playStopLoss = () => {
    ensureContext();
    const t = audioCtx.currentTime;
    
    // Descending Tone (Sad Triangle)
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.connect(g);
    g.connect(audioCtx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t); // A4
    osc.frequency.linearRampToValueAtTime(220, t + 0.4); // A3
    
    g.gain.setValueAtTime(0.1, t);
    g.gain.linearRampToValueAtTime(0.001, t + 0.4);
    
    osc.start(t);
    osc.stop(t + 0.4);
};

export const playLiquidation = () => {
     ensureContext();
     const t = audioCtx.currentTime;
     
     // Harsh Buzzer (Sawtooth + Low Freq)
     const osc = audioCtx.createOscillator();
     const g = audioCtx.createGain();
     osc.connect(g);
     g.connect(audioCtx.destination);
     
     osc.type = 'sawtooth';
     osc.frequency.setValueAtTime(150, t);
     osc.frequency.exponentialRampToValueAtTime(50, t + 0.8);
     
     // Modulate volume for "alarm" effect
     g.gain.setValueAtTime(0.2, t);
     g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
     
     osc.start(t);
     osc.stop(t + 0.8);
};
