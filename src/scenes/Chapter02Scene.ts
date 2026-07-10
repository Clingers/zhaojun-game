// 渭水场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter02Scene extends BaseScene {
  constructor(audioManager: AudioManager) {
    super('chapter02', audioManager);
  }

  preload() {
    this.load.image('chapter02-bg', '/assets/images/chapter-02/bg.svg');
  }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter02-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }

  protected setupInteractions(): void {
    this.startNarrative();
  }

  private startNarrative() {
    const lines = [
      '车队过了渭河。',
      '她掀开车帘，回头看了一眼。',
      '长安的方向，只有一片灰蓝色的天际线。',
      '她放下帘子。',
      '—— 四处看看，再继续前行 ——'
    ];
    this.showStorySequence(lines, () => {
      this.narrativeDone = true;
      this.spawnHotspots();
    });
  }

  private spawnHotspots() {
    this.addHotspot({
      id: 'wei_stone',
      x: 400, y: 480, width: 60, height: 50,
      type: 'collectible', collectibleId: 'wei_stone',
      label: '河滩', oneShot: true,
    });
    this.addHotspot({
      id: 'river_view',
      x: 750, y: 400, width: 200, height: 120,
      type: 'observation', label: '河面',
      narrativeText: '渭河的水不算太急，在秋日阳光下泛着细碎的光。河对岸的田野已经收割完毕，只剩下茬子。这片土地，她再也回不来了。',
      oneShot: true,
    });
    this.addHotspot({
      id: 'carriage',
      x: 300, y: 530, width: 100, height: 60,
      type: 'observation', label: '马车',
      narrativeText: '马车在沙土路上颠簸了一下。车辕上的铜铃叮当作响，像是一路在为谁送行。',
      oneShot: true,
    });
    this.addHotspot({
      id: 'continue_btn', x: 640, y: 620, width: 260, height: 50,
      type: 'continue', label: '继续前行 →',
      narrativeText: '前面还有很远的路。',
      oneShot: true, onContinue: 'chapter03',
    });
  }

  protected onInteraction(_target: string): void {}

  private showStorySequence(lines: string[], onComplete: () => void) {
    let idx = 0;
    const text = this.add.text(640, 360, '', {
      fontSize: '28px', color: '#ffffff', fontFamily: 'serif',
      align: 'center', wordWrap: { width: 900 }, lineSpacing: 10,
    }).setOrigin(0.5).setAlpha(0);
    const showNext = () => {
      if (idx >= lines.length) { text.destroy(); onComplete(); return; }
      text.setText(lines[idx]);
      this.tweens.add({ targets: text, alpha: 1, duration: 600, ease: 'Power2' });
      this.input.once('pointerdown', () => { idx++; showNext(); });
    };
    showNext();
  }
}