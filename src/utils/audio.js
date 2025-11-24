let audioContext = null;

export const initAudio = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
};

export const playTone = (frequency, volume, pan = 0, duration = 1.5) => {
    const ctx = initAudio();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const panner = ctx.createStereoPanner();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    // Volume is 0.0 to 1.0
    // Smooth attack and release to avoid clicking
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime + duration - 0.1);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    panner.pan.value = pan; // -1 (left) to 1 (right)

    oscillator.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
};
