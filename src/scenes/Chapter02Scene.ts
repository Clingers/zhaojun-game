import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter02Scene extends BaseScene {
  constructor(audioManager: AudioManager) {
    super('chapter02', audioManager);
  }
  protected loadBackground() {}
  protected setupInteractions(): void {}
  protected onInteraction(target: string): void {}
  protected playAmbientAudio() {}
}
