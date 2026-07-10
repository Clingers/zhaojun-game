// 草原场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter06Scene extends BaseScene {
  constructor(am: AudioManager) { super('chapter06', am); }
  preload() { this.load.image('chapter06-bg', '/assets/images/chapter-06/bg.svg'); }
  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter06-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }
  protected setupInteractions() { this.startNarrative(); }
  private startNarrative() {
    const lines = ['出关之后，天地突然变了。','天空是钴蓝色的，高得吓人。','草地一望无际。','这里的一切都不同了。','—— 四处看看，再继续前行 ——'];
    this.showStorySequence(lines, () => { this.narrativeDone = true; this.spawnHotspots(); });
  }
  private spawnHotspots() {
    this.addHotspot({ id: 'eagle_feather', x: 700, y: 280, width: 50, height: 40, type: 'collectible', collectibleId: 'eagle_feather', label: '白羽', oneShot: true });
    this.addHotspot({ id: 'sky', x: 400, y: 200, width: 200, height: 150, type: 'observation', label: '天空', narrativeText: '草原的天空和中原完全不同——蓝得近乎不真实。一只鹰在高空盘旋，它的影子在草地上缓缓移动。', oneShot: true });
    this.addHotspot({ id: 'grass', x: 600, y: 450, width: 200, height: 80, type: 'observation', label: '草地', narrativeText: '风吹过草地，草浪从脚下一直延伸到天边。她从未见过这么开阔的地方——开阔得让人有些害怕。', oneShot: true });
    this.addHotspot({ id: 'continue_btn', x: 640, y: 620, width: 260, height: 50, type: 'continue', label: '继续前行 →', narrativeText: '草原很大，路还很长。', oneShot: true, onContinue: 'chapter07' });
  }
  protected onInteraction(_t: string) {}
  private showStorySequence(lines: string[], onComplete: () => void) {
    let idx = 0;
    const text = this.add.text(640, 360, '', { fontSize: '28px', color: '#ffffff', fontFamily: 'serif', align: 'center', wordWrap: { width: 900 }, lineSpacing: 10 }).setOrigin(0.5).setAlpha(0);
    const showNext = () => { if (idx >= lines.length) { text.destroy(); onComplete(); return; } text.setText(lines[idx]); this.tweens.add({ targets: text, alpha: 1, duration: 600, ease: 'Power2' }); this.input.once('pointerdown', () => { idx++; showNext(); }); };
    showNext();
  }
}