// 序章场景 - 一只大雁
// 玩家扮演一只跟随商队的大雁，陪伴昭君出塞

import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class PrologueScene extends BaseScene {
  private textElements: Phaser.GameObjects.Text[] = [];
  private step: number = 0;

  constructor(audioManager: AudioManager) {
    super('prologue', audioManager);
  }

  preload() {
    super.preload();
    this.load.image('prologue-bg', '/assets/images/prologue/bg.jpeg');
    // 序章分镜图片
    this.load.image('prologue-p1', '/assets/images/prologue/p1-sky.jpeg');
    this.load.image('prologue-p2', '/assets/images/prologue/p2-goose-hover.jpeg');
    this.load.image('prologue-p3', '/assets/images/prologue/p3-changan-wall.jpeg');
    this.load.image('prologue-p4', '/assets/images/prologue/p4-zhaojun.jpeg');
    this.load.image('prologue-p5', '/assets/images/prologue/p5-goose-turn.jpeg');
    this.load.image('prologue-p6', '/assets/images/prologue/p6-wide-landscape.jpeg');
  }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'prologue-bg').setOrigin(0.5);
  }

  protected setupInteractions(): void {
    // 序章叙事：大雁视角，追随车队
    this.showTitle();
  }

  private showTitle() {
    const title = this.add
      .text(640, 300, '昭君：一路向北', {
        fontSize: '64px',
        color: '#ffffff',
        fontFamily: 'serif',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const subtitle = this.add
      .text(640, 380, '—— 序章：一只大雁 ——', {
        fontSize: '28px',
        color: '#D4A54A',
        fontFamily: 'serif',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.textElements = [title, subtitle];

    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 1500,
      ease: 'Power2',
    });

    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 1500,
      delay: 800,
      ease: 'Power2',
    });

    // 点击继续
    this.input.once('pointerdown', () => {
      this.startPrologue();
    });

    const hint = this.add
      .text(640, 600, '点击继续', {
        fontSize: '20px',
        color: '#888888',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: hint,
      alpha: 0.6,
      duration: 1000,
      delay: 2000,
      yoyo: true,
      repeat: -1,
    });

    this.textElements.push(hint);
  }

  private startPrologue() {
    // 清除文字
    this.textElements.forEach((t) => t.destroy());
    this.textElements = [];

    // 序章分镜图片映射
    const panelImages = [
      'prologue-p1', // 深秋。北方。→ 天空大雁南飞
      'prologue-p3', // 马车出发 → 长安城墙
      'prologue-p4', // 车中女子 → 昭君回望
      'prologue-p2', // 大雁跟着 → 大雁悬停
      'prologue-p5', // 它不知道 → 大雁转向
      'prologue-p6', // 她不知道 → 天地苍茫
    ];
    let currentPanel = -1;

    const swapPanel = () => {
      currentPanel++;
      if (currentPanel < panelImages.length) {
        // 淡出旧背景，淡入新背景
        if (this.background) {
          this.tweens.add({
            targets: this.background,
            alpha: 0,
            duration: 300,
          });
        }
        this.background = this.add.image(640, 360, panelImages[currentPanel])
          .setOrigin(0.5)
          .setAlpha(0);
        this.tweens.add({
          targets: this.background,
          alpha: 1,
          duration: 600,
        });
      }
    };

    // 序章叙事序列
    const lines = [
      '深秋。北方。',
      '一列马车从长安出发，向西，再向北。',
      '车中坐着一位女子，没有人知道她的名字。',
      '一只大雁在天上，飞得不高不低，跟着车队。',
      '它不知道为什么要跟，只是跟着。',
      '就像她不知道为什么要去，只是要去。',
      '',
      '—— 点击继续旅程 ——',
    ];

    this.showStorySequence(lines, () => {
      // 序章结束后自动过渡到第一章
      this.showDialogue('大雁振翅，向北飞去...');
      setTimeout(() => {
        this.transitionTo('chapter01');
      }, 2000);
    }, swapPanel);
  }

  protected showStorySequence(lines: string[], onComplete: () => void, onStep?: (step: number) => void) {
    let idx = 0;
    const text = this.add
      .text(640, 360, '', {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'serif',
        align: 'center',
        wordWrap: { width: 900 },
        lineSpacing: 8,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const showNext = () => {
      if (idx >= lines.length) {
        text.destroy();
        onComplete();
        return;
      }

      // 在显示新文字前先切换背景
      if (onStep) onStep(idx);

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
    // 序章无复杂交互
  }

  protected playAmbientAudio() {
    // 播放风声（待音频资源就绪）
  }
}
