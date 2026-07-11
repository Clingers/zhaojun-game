// 草原场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';
import { useGameStore } from '../store/gameStore';

export default class Chapter06Scene extends BaseScene {
  constructor(am: AudioManager) { super('chapter06', am); }
  preload() { super.preload(); this.load.image('chapter06-bg', '/assets/images/chapter-06/bg.svg'); }
  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter06-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }
  protected setupInteractions() { this.startNarrative(); }
  private startNarrative() {
    // 读取 Ch05 的选择
    const choice = useGameStore.getState().getChoice('ch05_choice');

    const lines: string[] = [];
    if (choice === 'look_back') {
      lines.push(
        '出关之后，天地突然变了。',
        '她眼前是无尽的草原，但脑海中仍然是长安的城门。',
        '天空是钴蓝色的，高得吓人。',
        '她回头望了一眼——雁门关已经小成一个黑点。',
        '草地一望无际，风声里带着陌生的气息。',
        '她摸了摸袖口里藏着的那片树叶。那是长安最后的礼物。',
        '—— 四处看看，再继续前行 ——'
      );
    } else {
      lines.push(
        '出关之后，天地突然变了。',
        '她头也不回地走进了草原。',
        '天空是钴蓝色的，高得吓人。',
        '她第一次感到自由——虽然这自由来得让人害怕。',
        '草地一望无际，马蹄踏过的地方野花被碾碎。',
        '她深呼吸，草原的风灌满她的肺。从今天起，这里是她的家。',
        '—— 四处看看，再继续前行 ——'
      );
    }

    this.showStorySequence(lines, () => { this.narrativeDone = true; this.spawnHotspots(); });
  }
  private spawnHotspots() {
    this.addHotspot({ id: 'eagle_feather', x: 700, y: 280, width: 50, height: 40, type: 'collectible', collectibleId: 'eagle_feather', label: '白羽', oneShot: true });
    this.addHotspot({ id: 'sky', x: 400, y: 200, width: 200, height: 150, type: 'observation', label: '天空', narrativeText: '草原的天空和中原完全不同——蓝得近乎不真实。一只鹰在高空盘旋，它的影子在草地上缓缓移动。', oneShot: true });
    this.addHotspot({ id: 'grass', x: 600, y: 450, width: 200, height: 80, type: 'observation', label: '草地', narrativeText: '风吹过草地，草浪从脚下一直延伸到天边。她从未见过这么开阔的地方——开阔得让人有些害怕。', oneShot: true });
    this.addHotspot({ id: 'continue_btn', x: 640, y: 620, width: 260, height: 50, type: 'continue', label: '继续前行 →', narrativeText: '草原很大，路还很长。', oneShot: true, onContinue: 'chapter07' });
  }
  protected onInteraction(_t: string) {}
}