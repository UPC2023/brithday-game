/**
 * Audio Controller for Birthday Game.
 * Uses real user-provided MP3 tracks from /public/audio/ and user uploaded files.
 * System synthesizer BGM tracks have been completely removed.
 */

import { CANDIDATE_AUDIO_TRACKS, DEFAULT_AUDIO_CONFIG, AudioTrackItem } from '../config/audioConfig';

export type BgmScene = 'game' | 'card';

export interface AudioCheckResult {
  ok: boolean;
  error?: string;
  duration?: number;
}

interface SceneTrackState {
  trackId: string;
  trackName: string;
  url: string;
  audio: HTMLAudioElement | null;
}

export class AudioController {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public isMusicPlaying: boolean = false;
  public activeScene: BgmScene = 'game';

  // Track errors per scene (decoding failure, invalid path, format not supported)
  public lastErrors: Record<BgmScene, string | null> = {
    game: null,
    card: null,
  };

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
      if (!this.isMusicPlaying && !this.isMuted) {
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

  /**
   * Fast, accurate audio verification check:
   * Uses AudioContext to decode audio headers/stream. If a user extracted a video file
   * and simply renamed it to .mp3, decodeAudioData will catch it immediately within milliseconds.
   */
  public static async checkAudioFilePlayable(file: File): Promise<AudioCheckResult> {
    if (typeof window === 'undefined') return { ok: true };

    const name = file.name.toLowerCase();
    const validExt = /\.(mp3|m4a|aac|wav|ogg)$/i.test(name);
    if (!validExt && !file.type.startsWith('audio/')) {
      return {
        ok: false,
        error: `不支持的文件格式 (${file.name})。请上传标准 MP3、M4A、AAC 或 WAV 音频文件。`,
      };
    }

    // Try testing decoding with AudioContext
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const testCtx = new AudioCtx();
        try {
          const sliceSize = Math.min(file.size, 512 * 1024);
          const slice = file.slice(0, sliceSize);
          const buffer = await slice.arrayBuffer();
          await testCtx.decodeAudioData(buffer);
          testCtx.close();
          return { ok: true };
        } catch {
          // If first slice failed, test full buffer for files < 4MB
          if (file.size < 4 * 1024 * 1024) {
            try {
              const fullBuffer = await file.arrayBuffer();
              await testCtx.decodeAudioData(fullBuffer);
              testCtx.close();
              return { ok: true };
            } catch {
              testCtx.close();
              return {
                ok: false,
                error: '该文件音频解码失败。如果您是从视频提取的音轨，可能仅修改了后缀名而内部仍是视频容器封装，浏览器无法直接播放。建议重新转码为标准 MP3。',
              };
            }
          }
          testCtx.close();
          return {
            ok: false,
            error: '该文件音频解码异常，浏览器无法识别此编码格式。建议转码为标准 MP3 后再上传。',
          };
        }
      }
    } catch {
      // Fallback
    }

    return { ok: true };
  }

  public initSceneAudio(scene: BgmScene, url: string) {
    this.lastErrors[scene] = null;

    // Safely cleanup existing audio without triggering false error events
    const existing = this.sceneStates[scene].audio;
    if (existing) {
      existing.onplay = null;
      existing.onpause = null;
      existing.onerror = null;
      existing.pause();
      existing.src = '';
      // Note: Do NOT call existing.load() after clearing src, as that triggers MEDIA_ERR_SRC_NOT_SUPPORTED
    }

    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.8;
    audio.preload = 'auto';

    audio.onplay = () => {
      if (this.activeScene === scene) {
        this.isMusicPlaying = true;
        this.lastErrors[scene] = null;
        this.onStateChange?.();
      }
    };

    audio.onpause = () => {
      if (this.activeScene === scene) {
        this.isMusicPlaying = false;
        this.onStateChange?.();
      }
    };

    // Error capture handler with active-element verification
    audio.onerror = () => {
      // Guard: ignore if this audio element is no longer the active element for this scene
      if (this.sceneStates[scene].audio !== audio) return;
      // Guard: ignore if src was cleared or empty
      if (!audio.src || audio.src === '' || audio.src === window.location.href) return;

      let message = '音频加载失败或格式不兼容';
      const err = audio.error;
      if (err) {
        switch (err.code) {
          case 1: // MEDIA_ERR_ABORTED
            return; // Normal abort, do not mark as error
          case 2: // MEDIA_ERR_NETWORK
            message = '网络传输错误或音频路径不存在 (404)';
            break;
          case 3: // MEDIA_ERR_DECODE
            message = '音频解码失败：可能是视频提取的伪音频或文件损坏';
            break;
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            message = '当前音频格式不受浏览器支持（请尝试标准 MP3 或恢复默认）';
            break;
          default:
            message = `音频加载异常 (Code: ${err.code})`;
        }
      }
      this.lastErrors[scene] = message;
      if (this.activeScene === scene) {
        this.isMusicPlaying = false;
      }
      this.onStateChange?.();
    };

    this.sceneStates[scene].audio = audio;
    this.sceneStates[scene].url = url;
  }

  public getTrackName(scene: BgmScene): string {
    return this.sceneStates[scene].trackName;
  }

  public getTrackId(scene: BgmScene): string {
    return this.sceneStates[scene].trackId;
  }

  public getLastError(scene: BgmScene): string | null {
    return this.lastErrors[scene];
  }

  public clearError(scene: BgmScene) {
    this.lastErrors[scene] = null;
    this.onStateChange?.();
  }

  /**
   * Reset scene audio to default track and clear any playback errors.
   */
  public resetToDefaultTrack(scene: BgmScene) {
    const defaultConfig = DEFAULT_AUDIO_CONFIG[scene];
    this.lastErrors[scene] = null;

    const state = this.sceneStates[scene];
    state.trackId = defaultConfig.trackId;
    state.trackName = defaultConfig.name;
    state.url = defaultConfig.url;

    this.initSceneAudio(scene, defaultConfig.url);

    if (this.activeScene === scene && !this.isMuted) {
      this.playActiveSceneMusic();
    }
    this.onStateChange?.();
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
        this.lastErrors[this.activeScene] = null;
        this.onStateChange?.();
      })
      .catch((err: unknown) => {
        const error = err as Error | undefined;
        // NotAllowedError (user gesture needed) or AbortError (interrupted by pause / switch)
        // are standard browser playback lifecycles, NOT file corruption!
        if (error && (error.name === 'NotAllowedError' || error.name === 'AbortError')) {
          this.isMusicPlaying = false;
        } else {
          this.isMusicPlaying = false;
          this.lastErrors[this.activeScene] =
            error?.message || '浏览器无法播放此音频，请检查编码格式';
        }
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
