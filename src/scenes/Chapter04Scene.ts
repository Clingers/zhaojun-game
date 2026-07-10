// 黄河场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter04Scene extends BaseScene {
  constructor(am: AudioManager) { super('chapter04', am); }
  preload() { this.load.image('chapter04-bg', '/assets/images/chapter-04/bg.svg'); }
  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter04-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }
  protected setupInteractions() { this.startNarrative(); }
  private startNarrative() {
    const lines = ['黄河在面前。','水色浑黄，流速很急。','壮汉们抬着马车过河，喊着号子。','她第一次见到这么宽的河。','车在河心晃了一下，她没有出声。','—— 四处看看，再继续前行 ——'];
    this.showStorySequence(lines, () => { this.narrativeDone = true; this.spawnHotspots(); });
  }
  private spawnHotspots() {
    this.addHotspot({ id: 'yellow_river_sand', x: 350, y: 500, width: 70, height: 50, type: 'collectible', collectibleId: 'yellow_river_sand', label: '河滩', oneShot: true });
    this.addHotspot({ id: 'river', x: 650, y: 400, width: 160, height: 80, type: 'observation', label: '黄河', narrativeText: '黄河水浑浊而沉重，像是大地流出的血液。她从未见过如此宽阔的河流——过了黄河，长安就真的在身后了。', oneShot: true });
    this.addHotspot({ id: 'ferrymen', x: 300, y: 540, width: 90, height: 50, type: 'observation', label: '船夫', narrativeText: '壮汉们赤着上身，喊着整齐的号子。他们的脊背被太阳晒得黝黑，在河水的反光中发亮。', oneShot: true });
    this.input.once('pointerdown', () => { this.showDialogue('过了黄河，便是塞外。\n—— 点击继续前行', 0); this.input.once('pointerdown', () => this.transitionTo('chapter05')); });
  }
  protected onInteraction(_t: string) {}
  private showStorySequence(lines: string[], onComplete: () => void) {
    let idx = 0;
    const text = this.add.text(640, 360, '', { fontSize: '28px', color: '#ffffff', fontFamily: 'serif', align: 'center', wordWrap: { width: 900 }, lineSpacing: 10 }).setOrigin(0.5).setAlpha(0);
    const showNext = () => { if (idx >= lines.length) { text.destroy(); onComplete(); return; } text.setText(lines[idx]); this.tweens.add({ targets: text, alpha: 1, duration: 600, ease: 'Power2' }); this.input.once('pointerdown', () => { idx++; showNext(); }); };
    showNext();
  }
}