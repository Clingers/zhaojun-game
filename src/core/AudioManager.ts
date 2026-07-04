export class AudioManager {
  private context: AudioContext;
  private masterGain: GainNode;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private activeSources: Map<string, AudioBufferSourceNode> = new Map();

  constructor() {
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
  }

  async loadAudio(key: string, url: string): Promise<AudioBuffer> {
    if (this.audioBuffers.has(key)) {
      return this.audioBuffers.get(key)!;
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(key, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load audio: ${key}`, error);
      throw error;
    }
  }

  play(key: string, options?: { loop?: boolean; volume?: number; fadeIn?: number }) {
    const buffer = this.audioBuffers.get(key);
    if (!buffer) return;

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = options?.loop || false;

    const gainNode = this.context.createGain();
    gainNode.gain.value = options?.volume ?? 1;

    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start();

    this.activeSources.set(key, source);

    if (options?.fadeIn) {
      gainNode.gain.setValueAtTime(0, this.context.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        options.volume ?? 1,
        this.context.currentTime + options.fadeIn
      );
    }
  }

  stop(key: string, fadeOut?: number) {
    const source = this.activeSources.get(key);
    if (!source) return;

    if (fadeOut) {
      const gainNode = this.context.createGain();
      gainNode.gain.value = 1;
      gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + fadeOut);
      source.disconnect();
      source.connect(gainNode);
      gainNode.connect(this.masterGain);
      setTimeout(() => {
        source.stop();
        this.activeSources.delete(key);
      }, fadeOut * 1000);
    } else {
      source.stop();
      this.activeSources.delete(key);
    }
  }

  setMasterVolume(volume: number) {
    this.masterGain.gain.value = volume;
  }

  getContext(): AudioContext {
    return this.context;
  }
}
