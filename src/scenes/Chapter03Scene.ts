// 秦岭场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter03Scene extends BaseScene {
  private textElements: Phaser.GameObjects.Text[] = [];
  private narrativeDone: boolean = false;

  constructor(audioManager: AudioManager) {
    super('chapter03', audioManager);
  }

  preload() {
    this.load.image('chapter03-bg', '/assets/images/chapter-03/bg.svg');
  }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter03-bg').setOrigin(0.5);
    // 添加暗色遮罩增强文字可读性
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }

  protected setupInteractions(): void {
    this.startNarrative();
  }

  private startNarrative() {
    const lines = [
'秦岭在下雨。',
'雨打在树叶上，沙沙作响。',
'山路泥泞，马车走得很慢。',
'她靠在车窗旁，看雨水在玻璃上画出弯曲的水痕。',
'手指沿着水痕移动，一上一下。',
'—— 点击继续前行 ——'
    ];
    this.showStorySequence(lines, () => {
      this.narrativeDone = true;
    });
  }

  private showStorySequence(lines: string[], onComplete: () => void) {
    let idx = 0;
    const text = this.add
      .text(640, 360, '', {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'serif',
        align: 'center',
        wordWrap: { width: 900 },
        lineSpacing: 10,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const showNext = () => {
      if (idx >= lines.length) {
        text.destroy();
        onComplete();
        return;
      }
      text.setText(lines[idx]);
      this.tweens.add({
        targets: text,
        alpha: 1,
        duration: 600,
        ease: 'Power2',
      });
      this.input.once('pointerdown', () => {
        idx++;
        if (idx >= lines.length) {
          text.destroy();
          onComplete();
        } else {
          text.setText(lines[idx]);
        }
      });
    };
    showNext();
  }

  protected onInteraction(target: string): void {
    // TODO: 章节特定交互（收集品、对话等）
  }

  protected playAmbientAudio() {
    // TODO: 章节环境音效
  }
}
