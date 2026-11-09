/**
 * Web Audio API synthesizer for Birthday Game.
 * Zero external audio files ensures 100% reliability in all sandbox environments.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private currentTuneTimers: number[] = [];
  public isMusicPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBirthdayTune();
    }
    return this.isMuted;
  }

  public playPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // AudioContext policy catch
    }
  }

  public playChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
      });
    } catch {}
  }

  public playSparkle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const freqs = [784, 880, 987.7, 1174.6, 1318.5];
      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + i * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      });
    } catch {}
  }

  public playLightCandle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Warm whoosh + bell
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.3);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    } catch {}
  }

  public playBlow() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      // Breath whoosh using white noise buffer
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {}
  }

  public playCheer() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      // Fanfare chord: C, E, G, C, E
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.04;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.95);
      });
    } catch {}
  }

  public playFirework() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // gentle pop + sparkle
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);

      setTimeout(() => this.playSparkle(), 120);
    } catch {}
  }

  public playHappyBirthdayTune(loop = true) {
    if (this.isMuted) return;
    this.stopBirthdayTune();
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.isMusicPlaying = true;

      // Note frequencies (Key of C)
      // "Happy Birthday To You..."
      // G4, G4, A4, G4, C5, B4
      // G4, G4, A4, G4, D5, C5
      // G4, G4, G5, E5, C5, B4, A4
      // F5, F5, E5, C5, D5, C5
      const G4 = 392.0;
      const A4 = 440.0;
      const B4 = 493.88;
      const C5 = 523.25;
      const D5 = 587.33;
      const E5 = 659.25;
      const F5 = 698.46;
      const G5 = 783.99;

      const melody: Array<{ note: number; duration: number }> = [
        { note: G4, duration: 0.35 },
        { note: G4, duration: 0.25 },
        { note: A4, duration: 0.6 },
        { note: G4, duration: 0.6 },
        { note: C5, duration: 0.6 },
        { note: B4, duration: 1.1 },

        { note: G4, duration: 0.35 },
        { note: G4, duration: 0.25 },
        { note: A4, duration: 0.6 },
        { note: G4, duration: 0.6 },
        { note: D5, duration: 0.6 },
        { note: C5, duration: 1.1 },

        { note: G4, duration: 0.35 },
        { note: G4, duration: 0.25 },
        { note: G5, duration: 0.6 },
        { note: E5, duration: 0.6 },
        { note: C5, duration: 0.6 },
        { note: B4, duration: 0.6 },
        { note: A4, duration: 0.9 },

        { note: F5, duration: 0.35 },
        { note: F5, duration: 0.25 },
        { note: E5, duration: 0.6 },
        { note: C5, duration: 0.6 },
        { note: D5, duration: 0.6 },
        { note: C5, duration: 1.3 },
      ];

      let elapsed = 0.2;
      melody.forEach(({ note, duration }) => {
        const timer = window.setTimeout(() => {
          if (!this.isMusicPlaying || this.isMuted || !this.ctx) return;
          const noteTime = this.ctx.currentTime;

          // Music box sound: combination of sine and quiet bell overtone
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gainNode = this.ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(note, noteTime);

          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(note * 2, noteTime);

          const vol = 0.09;
          gainNode.gain.setValueAtTime(vol, noteTime);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, noteTime + Math.max(duration * 1.2, 0.4));

          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(this.ctx.destination);

          osc1.start(noteTime);
          osc2.start(noteTime);
          osc1.stop(noteTime + duration * 1.3);
          osc2.stop(noteTime + duration * 1.3);
        }, elapsed * 1000);

        this.currentTuneTimers.push(timer);
        elapsed += duration;
      });

      if (loop) {
        const loopTimer = window.setTimeout(() => {
          if (this.isMusicPlaying && !this.isMuted) {
            this.playHappyBirthdayTune(true);
          }
        }, (elapsed + 1.5) * 1000);
        this.currentTuneTimers.push(loopTimer);
      }
    } catch {}
  }

  public stopBirthdayTune() {
    this.isMusicPlaying = false;
    this.currentTuneTimers.forEach((t) => clearTimeout(t));
    this.currentTuneTimers = [];
  }
}

export const sound = new SoundController();
