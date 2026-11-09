/**
 * Real microphone blow detector using Web Audio AnalyserNode.
 * Detects breath puff turbulent low-frequency noise (50Hz - 400Hz).
 */

export interface MicBlowDetectorCallbacks {
  onLevelChange: (level: number) => void;
  onBlowTrigger: () => void;
  onError: (err: string) => void;
}

export class MicBlowDetector {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private isListening = false;
  private blowAccumulator = 0;
  private callbacks: MicBlowDetectorCallbacks;

  constructor(callbacks: MicBlowDetectorCallbacks) {
    this.callbacks = callbacks;
  }

  public async start(): Promise<boolean> {
    if (this.isListening) return true;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.callbacks.onError('当前浏览器环境不支持麦克风检测，请使用点击吹灭');
        return false;
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      const source = this.audioCtx.createMediaStreamSource(this.stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.3;

      source.connect(this.analyser);
      this.isListening = true;
      this.blowAccumulator = 0;

      this.pollVolume();
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.callbacks.onError(`麦克风权限未开启或不可用(${msg})，可直接点按钮吹灭哦~`);
      return false;
    }
  }

  private pollVolume = () => {
    if (!this.isListening || !this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    // Blowing sounds concentrate in the lower frequencies (bins 1 to 24)
    let lowFreqSum = 0;
    const lowBins = Math.min(24, dataArray.length);
    for (let i = 1; i < lowBins; i++) {
      lowFreqSum += dataArray[i];
    }
    const lowFreqAvg = lowFreqSum / (lowBins - 1);
    const normalizedLevel = Math.min(1, Math.max(0, (lowFreqAvg - 20) / 75));

    this.callbacks.onLevelChange(normalizedLevel);

    // Threshold for a strong blow
    if (normalizedLevel > 0.45) {
      this.blowAccumulator += 0.35;
      if (this.blowAccumulator >= 1.0) {
        this.callbacks.onBlowTrigger();
        this.stop();
        return;
      }
    } else {
      this.blowAccumulator = Math.max(0, this.blowAccumulator - 0.08);
    }

    this.animFrameId = requestAnimationFrame(this.pollVolume);
  };

  public stop() {
    this.isListening = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    this.callbacks.onLevelChange(0);
  }
}
