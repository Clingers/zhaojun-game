// 长安场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter01Scene extends BaseScene {
  private textElements: Phaser.GameObjects.Text[] = [];

  constructor(audioManager: AudioManager) {
    super('chapter01', audioManager);
  }

  preload() {
    super.preload();
    this.load.image('chapter01-bg', '/assets/images/chapter-01/bg.svg');
  }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter01-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }

  protected setupInteractions(): void {
    this.startNarrative();
  }

  private startNarrative() {
    const lines = [
      '深秋。长安。未央宫的一间偏殿。',
      '她坐在铜镜前，最后一次整理妆容。',
      '镜面上有一道细细的划痕，她用手指轻轻碰了碰。',
      '这面镜子她用了三年。',
      '今天，她要远嫁匈奴。',
      '—— 四处看看，再继续前行 ——'
    ];
    this.showStorySequence(lines, () => {
      this.narrativeDone = true;
      this.spawnHotspots();
    });
  }

  /** 叙事结束后出现可交互热区 */
  private spawnHotspots() {
    // 收集品：铜镜碎片
    this.addHotspot({
      id: 'bronze_mirror',
      x: 400, y: 460,
      width: 80, height: 90,
      type: 'collectible',
      collectibleId: 'bronze_mirror',
      label: '铜镜',
      oneShot: true,
    });

    // 观察：窗外
    this.addHotspot({
      id: 'window',
      x: 900, y: 250,
      width: 120, height: 150,
      type: 'observation',
      label: '窗外',
      narrativeText: '透过窗棂，可以看到长安城的轮廓。晨光中的街巷一如往常——没有人知道今天有一位女子即将离开。',
      oneShot: true,
    });

    // 观察：行囊
    this.addHotspot({
      id: 'luggage',
      x: 250, y: 480,
      width: 70, height: 60,
      type: 'observation',
      label: '行囊',
      narrativeText: '角落里放着一只简朴的行囊。几件换洗衣物，一把木梳，一块手帕——她带不走长安的任何东西。',
      oneShot: true,
    });

    // 继续前行按钮（隐藏式：需收集铜镜 + 至少点一个观察点才出现）
    this.addHotspot({
      id: 'continue_btn',
      x: 640, y: 620, width: 260, height: 50,
      type: 'continue',
      label: '继续前行 →',
      narrativeText: '是时候出发了。',
      oneShot: true,
      onContinue: 'chapter02',
    });
  }

  protected onInteraction(target: string): void {
    // 已废弃，由热区系统处理
  }
}
