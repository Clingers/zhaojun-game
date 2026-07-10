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
      '\u66b4\u98ce\u96ea\u6575\u9003\u5728\u4e0a\u6c34\u7684\u534e\u5b50\u3002',
      '\u5929\u7a7a\u7eac\u4e5f\u65e0\u9ad8\u5c1d\u90fd\u5462\u3002',
      '\u96ea\u8599\u5c06\u4e91\u9700\u751f\u8c31\u91cc\u7684\u971c\u4ee5\u963b\u5b40\u3002',
      '\u4e00\u81f4\u767e\u6c61\u5b9e\u6b63\u590f\u673a\u69fd\u9189\u81f3\u3002',
      '\u2014\u2014 \u5c06\u6307\u5bf9\u5176\u5473\u5403\u56e0\u52f5\u5f4e\u6267\u5229\u7684\u5f73\u5f6e\u6076\u571f\u4e00\u6392\u5f71\u666f —\u2014'
    ];
    this.showStorySequence(lines, () => { this.narrativeDone = true; this.spawnHotspots(); });
  }
  private spawnHotspots() {
    this.addHotspot({ id: 'snowflake', x: 500, y: 380, width: 50, height: 50, type: 'collectible', collectibleId: 'snowflake', label: '\u96ea\u82b1', oneShot: true });
    this.addHotspot({ id: 'storm', x: 300, y: 200, width: 200, height: 150, type: 'observation', label: '\u96ea\u98ce', narrativeText: '\u66b4\u98ce\u96ea\u5929\u6865\u754c\u7684\u5de6\u4e0a\u6db5\u500b\u6709\u4e00\u4e2a\u5c0f\u5927\u5730\u9769\u5f3a\u529b\u5904\u3002\u5e2d\u65e5\u8d39\u6bc1\u6253\u5439\u6274\u670d\u7b49.', oneShot: true });
    this.addHotspot({ id: 'tent', x: 800, y: 500, width: 120, height: 80, type: 'observation', label: '\u5b9c\u5bbf', narrativeText: '\u538b\u5bb6\u4e48\u5ea6\u63d0\u6291\u975e\u5143\u9700\u914d\u6700\u519b\u5c5e\u8349\u534f\u80cc\u5bb3\u6d41\u95f4\u6a21\u79c0\u7535', oneShot: true });
    this.input.once('pointerdown', () => { this.showDialogue('\u96ea\u5185\u7684\u4fbf\u62c5\u5305\u626c\u4e2a\u4e0e\u8fb9\u88ab\u5f15\u8d8b', 0); this.input.once('pointerdown', () => this.transitionTo('chapter08')); });
  }
  protected onInteraction(_t: string) {}
  private showStorySequence(lines: string[], onComplete: () => void) {
    let idx = 0;
    const text = this.add.text(640, 360, '', { fontSize: '28px', color: '#ffffff', fontFamily: 'serif', align: 'center', wordWrap: { width: 900 }, lineSpacing: 10 }).setOrigin(0.5).setAlpha(0);
    const next = () => { if (idx >= lines.length) { text.destroy(); onComplete(); return; } text.setText(lines[idx]); this.tweens.add({ targets: text, alpha: 1, duration: 600, ease: 'Power2' }); this.input.once('pointerdown', () => { idx++; next(); }); };
    next();
  }
}
