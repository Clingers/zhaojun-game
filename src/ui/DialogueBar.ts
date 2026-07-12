// DialogueBar - 底部对话栏组件（Visual Novel 风格）
// 固定在屏幕底部 240px 区域，不遮挡场景画面

import Phaser from 'phaser';

export interface DialogueProgress {
  current: number;
  total: number;
}

export class DialogueBar {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private bg: Phaser.GameObjects.Rectangle;
  private topLine: Phaser.GameObjects.Rectangle;
  private speakerText: Phaser.GameObjects.Text;
  private contentText: Phaser.GameObjects.Text;
  private progressText: Phaser.GameObjects.Text;
  private nextIndicator: Phaser.GameObjects.Text;
  private clickZone: Phaser.GameObjects.Zone;
  private nextCallback: (() => void) | null = null;
  private _visible: boolean = false;

  private readonly BAR_Y = 480;
  private readonly BAR_HEIGHT = 240;
  private readonly BAR_WIDTH = 1280;
  private readonly PADDING = 40;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // 背景半透明面板
    this.bg = scene.add.rectangle(
      640, this.BAR_Y + this.BAR_HEIGHT / 2,
      this.BAR_WIDTH, this.BAR_HEIGHT,
      0x000000, 0.88
    ).setOrigin(0.5);

    // 顶部装饰线（金色）
    this.topLine = scene.add.rectangle(
      640, this.BAR_Y,
      this.BAR_WIDTH - 80, 2,
      0xD4A54A, 0.7
    ).setOrigin(0.5);

    // 说话人名称
    this.speakerText = scene.add.text(this.PADDING, this.BAR_Y + 14, '', {
      fontSize: '17px',
      color: '#D4A54A',
      fontFamily: 'serif',
    });

    // 正文
    this.contentText = scene.add.text(this.PADDING, this.BAR_Y + 46, '', {
      fontSize: '22px',
      color: '#ffffff',
      fontFamily: 'serif',
      wordWrap: { width: this.BAR_WIDTH - this.PADDING * 2 - 60 },
      lineSpacing: 6,
    });

    // 进度指示（右上角）
    this.progressText = scene.add.text(
      this.BAR_WIDTH - this.PADDING, this.BAR_Y + 14, '', {
        fontSize: '15px',
        color: '#888888',
        fontFamily: 'serif',
      }
    ).setOrigin(1, 0);

    // 翻页指示器（右下角闪烁 ▼）
    this.nextIndicator = scene.add.text(
      this.BAR_WIDTH - this.PADDING, this.BAR_Y + this.BAR_HEIGHT - 28, '▼', {
        fontSize: '18px',
        color: '#D4A54A',
        fontFamily: 'serif',
      }
    ).setOrigin(0.5).setAlpha(0);

    // 点击区域（整个对话栏）
    this.clickZone = scene.add.zone(
      640, this.BAR_Y + this.BAR_HEIGHT / 2,
      this.BAR_WIDTH, this.BAR_HEIGHT
    ).setOrigin(0.5);

    // 容器统一管理深度
    this.container = scene.add.container(0, 0, [
      this.bg,
      this.topLine,
      this.speakerText,
      this.contentText,
      this.progressText,
      this.nextIndicator,
      this.clickZone,
    ]);
    this.container.setDepth(100);
    this.container.setVisible(false);

    // 点击翻页
    this.clickZone.on('pointerdown', () => {
      if (this.nextCallback) {
        const cb = this.nextCallback;
        this.nextCallback = null; // 防止重复触发
        this.stopBlinking();
        cb();
      }
    });
  }

  /** 显示一段文字 */
  show(text: string, speaker?: string, progress?: DialogueProgress) {
    this._visible = true;
    this.container.setVisible(true);
    this.clickZone.setInteractive({ useHandCursor: true });

    this.contentText.setText(text);
    this.speakerText.setText(speaker ? `— ${speaker} —` : '');
    this.progressText.setText(
      progress ? `${progress.current}/${progress.total}` : ''
    );

    // 入场动画
    this.container.setAlpha(0);
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: 250,
      ease: 'Power2',
    });

    this.startBlinking();
  }

  /** 隐藏对话栏 */
  hide() {
    this._visible = false;
    this.nextCallback = null;
    this.stopBlinking();
    this.clickZone.disableInteractive();

    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.container.setVisible(false);
      },
    });
  }

  /** 注册翻页回调（每次只会有一个活跃） */
  onNext(callback: () => void) {
    this.nextCallback = callback;
  }

  isVisible(): boolean {
    return this._visible;
  }

  destroy() {
    this.stopBlinking();
    this.nextCallback = null;
    this.clickZone.removeAllListeners();
    this.container.destroy();
  }

  private startBlinking() {
    this.nextIndicator.setAlpha(0);
    this.scene.tweens.add({
      targets: this.nextIndicator,
      alpha: { from: 0.2, to: 0.9 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private stopBlinking() {
    this.scene.tweens.killTweensOf(this.nextIndicator);
    this.nextIndicator.setAlpha(0);
  }
}
