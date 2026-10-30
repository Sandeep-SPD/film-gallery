// Web Audio API analog tape hiss & low synth ambient hum
let audioCtx: AudioContext | null = null;
let gainNode: GainNode | null = null;
let oscNode: OscillatorNode | null = null;
let noiseNode: AudioBufferSourceNode | null = null;

export const startAmbientSound = () => {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Main master gain
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.07, audioCtx.currentTime + 2);
    gainNode.connect(audioCtx.destination);

    // Warm deep 55Hz sub drone (analog amplifier hum)
    oscNode = audioCtx.createOscillator();
    oscNode.type = 'sine';
    oscNode.frequency.setValueAtTime(55, audioCtx.currentTime);

    // Filter to soften tone
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, audioCtx.currentTime);

    oscNode.connect(filter);
    filter.connect(gainNode);
    oscNode.start();

    // Subtle vinyl/tape grain noise buffer
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.015;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, audioCtx.currentTime);
    noiseFilter.Q.setValueAtTime(0.8, audioCtx.currentTime);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(gainNode);
    noiseNode.start();
  } catch {
    // AudioContext blocked or not supported
  }
};

export const stopAmbientSound = () => {
  if (gainNode && audioCtx) {
    try {
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        oscNode?.stop();
        noiseNode?.stop();
        oscNode?.disconnect();
        noiseNode?.disconnect();
        gainNode = null;
        oscNode = null;
        noiseNode = null;
      }, 900);
    } catch {
      // ignore
    }
  }
};
