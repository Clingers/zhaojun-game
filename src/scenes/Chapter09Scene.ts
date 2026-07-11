// 王庭场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter09Scene extends BaseScene {
  private textElements: Phaser.GameObjects.Text[] = [];

  constructor(audioManager: AudioManager) {
    super('chapter09', audioManager);
  }

  preload() {
    super.preload();
    this.load.image('chapter09-bg', '/assets/images/chapter-09/bg.svg');
  }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter09-bg').setOrigin(0.5);
    // 添加暗色遮罩增强文字可读性
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }

  protected setupInteractions(): void {
    this.startNarrative();
  }

  private startNarrative() {
    const lines = [
'终于到了。',
'匈奴王庭比想象中安静。',
'没有盛大的庆典，只有风。',
'她下了马车，踩在陌生的土地上。',
'—— 四处看看，再继续前行 ——'
    ];
    this.showStorySequence(lines, () => {
      this.narrativeDone = true;
      this.spawnHotspots();
    });
  }

  private spawnHotspots() {
    this.addHotspot({
      id: 'continue_btn', x: 640, y: 620, width: 260, height: 50,
      type: 'continue', label: '继续前行 →',
      narrativeText: '这就是她以后要生活的地方。',
      oneShot: true, onContinue: 'chapter10',
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
        showNext();
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
