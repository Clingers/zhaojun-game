import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter01Scene extends BaseScene {
  constructor(audioManager: AudioManager) {
    super('chapter01', audioManager);
  }

  preload() {
    this.load.image('chapter01-bg', 'assets/images/chapter-01/bg.png');
  }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter01-bg').setOrigin(0.5);
  }

  protected setupInteractions(): void {
    // 第一章交互
  }

  protected onInteraction(target: string): void {
    // 处理交互逻辑
  }

  protected playAmbientAudio() {
    // 播放环境音
  }
}
