// 篝火场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter08Scene extends BaseScene {
  private textElements: Phaser.GameObjects.Text[] = [];
  private narrativeDone: boolean = false;

  constructor(audioManager: AudioManager) {
    super('chapter08', audioManager);
  }

  preload() {
    this.load.image('chapter08-bg', '/assets/images/chapter-08/bg.svg');
  }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter08-bg').setOrigin(0.5);
    // 添加暗色遮罩增强文字可读性
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }

  protected setupInteractions(): void {
    this.startNarrative();
  }

  private startNarrative() {
    const lines = [
'夜里，大家在篝火旁围坐。',
'火光暖橙色的，映在每个人的脸上。',
'一位匈奴老人闭着眼，唱起古老的歌。',
'她听不懂歌词，但听懂了旋律。',
'那是草原的声音。',
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
