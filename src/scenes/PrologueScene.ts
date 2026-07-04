import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class PrologueScene extends BaseScene {
  constructor(audioManager: AudioManager) {
    super('prologue', audioManager);
  }

  preload() {
    this.load.image('prologue-bg', 'assets/images/prologue/bg.png');
  }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'prologue-bg').setOrigin(0.5);
  }

  protected setupInteractions(): void {
    // 序章交互
  }

  protected onInteraction(target: string): void {
    // 处理交互逻辑
  }

  protected playAmbientAudio() {
    // 播放环境音
  }
}
