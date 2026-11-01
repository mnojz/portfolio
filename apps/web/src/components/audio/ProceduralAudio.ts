class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private isWindPlaying: boolean = false;
  private chordInterval: any = null;

  private pentatonicScale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]; // C D E G A in Hz

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.startAmbientSoundscape();
    } catch (e) {
      console.warn("Web Audio not available", e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.4, this.ctx.currentTime, 0.05);
    }
  }

  setVolume(vol: number) {
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.05);
    }
  }

  // Play peaceful countryside wind and gentle chords
  private startAmbientSoundscape() {
    if (!this.ctx || !this.ambientGain || this.isWindPlaying) return;
    this.isWindPlaying = true;

    // Generate gentle wind noise buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(220, this.ctx.currentTime);

    // LFO to slowly modulate wind volume
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime); // 10s cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(100, this.ctx.currentTime);

    lfo.connect(filter.frequency);
    whiteNoise.connect(filter);
    filter.connect(this.ambientGain);

    whiteNoise.start();
    lfo.start();

    // Occasional gentle chime chords every 12-18 seconds
    this.chordInterval = setInterval(() => {
      if (!this.isMuted && this.ctx && this.ctx.state === "running") {
        this.playGentleChimeChord();
      }
    }, 14000);
  }

  private playGentleChimeChord() {
    if (!this.ctx || !this.ambientGain || this.isMuted) return;

    const rootIdx = Math.floor(Math.random() * 4);
    const notes = [
      this.pentatonicScale[rootIdx],
      this.pentatonicScale[rootIdx + 2],
      this.pentatonicScale[rootIdx + 4],
    ];

    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || !this.ambientGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 4.5);

        osc.connect(gain);
        gain.connect(this.ambientGain!);

        osc.start();
        osc.stop(this.ctx.currentTime + 5.0);
      }, idx * 250);
    });
  }

  // Soft Footstep Sound
  playFootstep() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    const baseFreq = 90 + Math.random() * 30;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Interaction / Modal Open Chime
  playInteractChime() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.2); // G5

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  // Secret Unlocked Chime
  playDiscoveryChime() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.65);
      }, idx * 100);
    });
  }

  // Chat Notification Sound
  playNotificationSound() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime); // E5
    osc.frequency.setValueAtTime(880.0, this.ctx.currentTime + 0.1); // A5

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.38);
  }
}

export const proceduralAudio = typeof window !== "undefined" ? new ProceduralAudioEngine() : (null as any);

