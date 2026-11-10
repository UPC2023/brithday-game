/**
 * Audio Controller for Birthday Game.
 * Uses real user-provided MP3 tracks from /public/audio/ and user uploaded files.
 * System synthesizer BGM tracks have been completely removed.
 */

import { CANDIDATE_AUDIO_TRACKS, DEFAULT_AUDIO_CONFIG, AudioTrackItem } from '../config/audioConfig';

export type BgmScene = 'game' | 'card';

interface SceneTrackState {
  trackId: string;
  trackName: string;
  url: string;
  audio: HTMLAudioElement | null;
}

class AudioController {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public isMusicPlaying: boolean = false;
  public activeScene: BgmScene = 'game';

  private sceneStates: Record<BgmScene, SceneTrackState> = {
    game: {
      trackId: DEFAULT_AUDIO_CONFIG.game.trackId,
      trackName: DEFAULT_AUDIO_CONFIG.game.name,
      url: DEFAULT_AUDIO_CONFIG.game.url,
      audio: null,
    },
    card: {
      trackId: DEFAULT_AUDIO_CONFIG.card.trackId,
      trackName: DEFAULT_AUDIO_CONFIG.card.name,
      url: DEFAULT_AUDIO_CONFIG.card.url,
      audio: null,
    },
  };

  public onStateChange?: () => void;

  constructor() {
    // Pre-initialize audio elements for both scenes
    this.initSceneAudio('game', DEFAULT_AUDIO_CONFIG.game.url);
    this.initSceneAudio('card', DEFAULT_AUDIO_CONFIG.card.url);
    this.setupInteractionUnlock();
  }

  private setupInteractionUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      if (this.activeScene === 'game' && !this.isMusicPlaying && !this.isMuted) {
        this.playActiveSceneMusic();
      }
    };
    window.addEventListener('click', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private initSceneAudio(scene: BgmScene, url: string) {
    const existing = this.sceneStates[scene].audio;
    if (existing) {
      existing.pause();
      existing.src = '';
    }

    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.8;

    audio.addEventListener('play', () => {
      if (this.activeScene === scene) {
        this.isMusicPlaying = true;
        this.onStateChange?.();
      }
    });

    audio.addEventListener('pause', () => {
      if (this.activeScene === scene) {
        this.isMusicPlaying = false;
        this.onStateChange?.();
      }
    });

    this.sceneStates[scene].audio = audio;
    this.sceneStates[scene].url = url;
  }

  public getTrackName(scene: BgmScene): string {
    return this.sceneStates[scene].trackName;
  }

  public getTrackId(scene: BgmScene): string {
    return this.sceneStates[scene].trackId;
  }

  // Switch between Game and Greeting Card scenes
  public setScene(scene: BgmScene) {
    if (this.activeScene === scene && this.isMusicPlaying) return;

    // Pause old scene audio
    const oldAudio = this.sceneStates[this.activeScene].audio;
    if (oldAudio) {
      oldAudio.pause();
    }

    this.activeScene = scene;

    if (!this.isMuted) {
      this.playActiveSceneMusic();
    } else {
      this.isMusicPlaying = false;
    }
    this.onStateChange?.();
  }

  // Select one of the candidate tracks from /public/audio/
  public selectCandidateTrack(scene: BgmScene, track: AudioTrackItem) {
    const state = this.sceneStates[scene];
    state.trackId = track.id;
    state.trackName = `${track.name} - ${track.artist}`;

    this.initSceneAudio(scene, track.url);

    if (this.activeScene === scene && !this.isMuted) {
      this.playActiveSceneMusic();
    }
    this.onStateChange?.();
  }

  // Set Custom Local Audio File (from <input type="file">)
  public setCustomAudioFile(scene: BgmScene, file: File) {
    const state = this.sceneStates[scene];
    const objectUrl = URL.createObjectURL(file);
    const displayName = file.name.replace(/\.[^/.]+$/, '');

    state.trackId = 'custom_upload';
    state.trackName = `${displayName} (本地上传)`;

    this.initSceneAudio(scene, objectUrl);

    if (this.activeScene === scene && !this.isMuted) {
      this.playActiveSceneMusic();
    }
    this.onStateChange?.();
  }

  // Play Active Scene's music
  public playActiveSceneMusic() {
    if (this.isMuted) return;
    const currentAudio = this.sceneStates[this.activeScene].audio;
    if (!currentAudio) return;

    currentAudio
      .play()
      .then(() => {
        this.isMusicPlaying = true;
        this.onStateChange?.();
      })
      .catch(() => {
        this.isMusicPlaying = false;
        this.onStateChange?.();
      });
  }

  // Ensure game music starts on first user click
  public ensureGameMusicPlaying() {
    if (this.activeScene === 'game' && !this.isMusicPlaying && !this.isMuted) {
      this.playActiveSceneMusic();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.resumeBGM();
    }
    this.onStateChange?.();
    return this.isMuted;
  }

  public resumeBGM() {
    if (this.isMuted) return;
    this.playActiveSceneMusic();
  }

  public stopBGM() {
    const audio = this.sceneStates[this.activeScene].audio;
    if (audio) {
      audio.pause();
    }
    this.isMusicPlaying = false;
    this.onStateChange?.();
  }

  // ==========================================
  // INTERACTIVE SOUND EFFECTS (POPS, CHIMES, ETC.)
  // ==========================================

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
    } catch {}
  }

  public playChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
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
}

export const sound = new AudioController();
