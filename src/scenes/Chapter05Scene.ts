// 雁门关场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter05Scene extends BaseScene {
  constructor(am: AudioManager) { super('chapter05', am); }
  preload() { this.load.image('chapter05-bg', '/assets/images/chapter-05/bg.svg'); }
  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter05-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }
  protected setupInteractions() { this.startNarrative(); }
  private startNarrative() {
    const lines = ['雁门关。汉朝的边界。','城门是铁灰色的，又高又厚。','她站在关前，回望南方。','天和地连在一起，什么都没有。','城门缓缓关上。','—— 她再也没有回到长安。','—— 四处看看，再继续前行 ——'];
    this.showStorySequence(lines, () => { this.narrativeDone = true; this.spawnHotspots(); });
  }
  private spawnHotspots() {
    this.addHotspot({ id: 'goose_feather', x: 600, y: 300, width: 50, height: 40, type: 'collectible', collectibleId: 'wild_goose_feather', label: '羽毛', oneShot: true });
    this.addHotspot({ id: 'gate', x: 640, y: 400, width: 200, height: 200, type: 'observation', label: '城门', narrativeText: '城门在她身后缓缓合拢，发出沉重的金属摩擦声。那声音穿过胸腔，比任何告别都更真实。', oneShot: true });
    this.addHotspot({ id: 'south', x: 200, y: 350, width: 150, height: 100, type: 'observation', label: '南方', narrativeText: '她最后看了一眼南方的天空。天和地在远处连成一线，什么也看不见了。那里有长安，有过去，有她所有知道的东西。', oneShot: true });
    this.addHotspot({ id: 'continue_btn', x: 640, y: 620, width: 260, height: 50, type: 'continue', label: '继续前行 →', narrativeText: '出关之后，一切都会不同。', oneShot: true, onContinue: 'chapter06' });
  }
  protected onInteraction(_t: string) {}
  private showStorySequence(lines: string[], onComplete: () => void) {
    let idx = 0;
    const text = this.add.text(640, 360, '', { fontSize: '28px', color: '#ffffff', fontFamily: 'serif', align: 'center', wordWrap: { width: 900 }, lineSpacing: 10 }).setOrigin(0.5).setAlpha(0);
    const showNext = () => { if (idx >= lines.length) { text.destroy(); onComplete(); return; } text.setText(lines[idx]); this.tweens.add({ targets: text, alpha: 1, duration: 600, ease: 'Power2' }); this.input.once('pointerdown', () => { idx++; showNext(); }); };
    showNext();
  }
}