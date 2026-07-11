// 秦岭场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter03Scene extends BaseScene {
  constructor(audioManager: AudioManager) {
    super('chapter03', audioManager);
  }

  preload() { super.preload(); this.load.image('chapter03-bg', '/assets/images/chapter-03/bg.svg'); }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter03-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }

  protected setupInteractions() { this.startNarrative(); }

  private startNarrative() {
    const lines = ['秦岭在下雨。','雨打在树叶上，沙沙作响。','山路泥泞，马车走得很慢。','她靠在车窗旁，看雨水在玻璃上画出弯曲的水痕。','手指沿着水痕移动，一上一下。','—— 四处看看，再继续前行 ——'];
    this.showStorySequence(lines, () => { this.narrativeDone = true; this.spawnHotspots(); });
  }

  private spawnHotspots() {
    this.addHotspot({ id: 'qin_forest_leaf', x: 500, y: 380, width: 80, height: 60, type: 'collectible', collectibleId: 'qin_forest_leaf', label: '落叶', oneShot: true });
    this.addHotspot({ id: 'rain', x: 800, y: 300, width: 100, height: 150, type: 'observation', label: '雨幕', narrativeText: '雨越下越大了。车窗外的山色被雨幕模糊成一团墨绿。她听见雨水顺着车檐滴落的声音——一滴，一滴，像是有人在数着什么。', oneShot: true });
    this.addHotspot({ id: 'mountain', x: 200, y: 350, width: 120, height: 100, type: 'observation', label: '远山', narrativeText: '秦岭的山脊在雨中若隐若现。翻过这座山，就是另一个世界了。', oneShot: true });
    this.addHotspot({ id: 'continue_btn', x: 640, y: 620, width: 260, height: 50, type: 'continue', label: '继续前行 →', narrativeText: '雨不会停，路还要走。', oneShot: true, onContinue: 'chapter04' });
  }

  protected onInteraction(_t: string) {}
  private showStorySequence(lines: string[], onComplete: () => void) {
    let idx = 0;
    const text = this.add.text(640, 360, '', { fontSize: '28px', color: '#ffffff', fontFamily: 'serif', align: 'center', wordWrap: { width: 900 }, lineSpacing: 10 }).setOrigin(0.5).setAlpha(0);
    const showNext = () => { if (idx >= lines.length) { text.destroy(); onComplete(); return; } text.setText(lines[idx]); this.tweens.add({ targets: text, alpha: 1, duration: 600, ease: 'Power2' }); this.input.once('pointerdown', () => { idx++; showNext(); }); };
    showNext();
  }
}