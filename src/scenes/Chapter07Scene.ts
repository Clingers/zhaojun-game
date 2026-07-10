// \u66b4\u98ce\u96ea\u573a\u666f
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter07Scene extends BaseScene {
  constructor(am: AudioManager) { super('chapter07', am); }
  preload() { this.load.image('chapter07-bg', '/assets/images/chapter-07/bg.svg'); }
  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter07-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }
  protected setupInteractions() { this.startNarrative(); }
  private startNarrative() {
    const lines = [
      '暴风雪突如其来。',
      '天空铅灰色的，什么都看不见。',
      '雪粒打在脸上，像细沙一样疼。',
      '车队停下来，所有人挤在一起。',
      '—— 四处看看，再继续前行 ——'
    ];
    this.showStorySequence(lines, () => { this.narrativeDone = true; this.spawnHotspots(); });
  }
  private spawnHotspots() {
    this.addHotspot({ id: 'snowflake', x: 500, y: 380, width: 50, height: 50, type: 'collectible', collectibleId: 'snowflake', label: '雪花', oneShot: true });
    this.addHotspot({ id: 'storm', x: 300, y: 200, width: 200, height: 150, type: 'observation', label: '雪风', narrativeText: '暴风雪中的风有一种奇特的力量——它不冷，但能穿透一切。她裹紧了外衣，把脸埋进领口里。', oneShot: true });
    this.addHotspot({ id: 'tent', x: 800, y: 500, width: 120, height: 80, type: 'observation', label: '营地', narrativeText: '临时搭起的帐篷在风中摇晃。有人递给她一碗热茶，她接过来，手指碰到碗壁时才发现自己已经冻僵了。', oneShot: true });
    this.addHotspot({ id: 'continue', x: 640, y: 620, width: 300, height: 60, type: 'observation', label: '继续前行', narrativeText: '暴风雪终会过去。', oneShot: true, onContinue: 'chapter08' });
  }
  protected onInteraction(_t: string) {}
  private showStorySequence(lines: string[], onComplete: () => void) {
    let idx = 0;
    const text = this.add.text(640, 360, '', { fontSize: '28px', color: '#ffffff', fontFamily: 'serif', align: 'center', wordWrap: { width: 900 }, lineSpacing: 10 }).setOrigin(0.5).setAlpha(0);
    const next = () => { if (idx >= lines.length) { text.destroy(); onComplete(); return; } text.setText(lines[idx]); this.tweens.add({ targets: text, alpha: 1, duration: 600, ease: 'Power2' }); this.input.once('pointerdown', () => { idx++; next(); }); };
    next();
  }
}
