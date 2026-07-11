// 草原场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';
import { useGameStore } from '../store/gameStore';

export default class Chapter06Scene extends BaseScene {
  protected ambientTexts: string[] = [
    '风吹过草原，草浪从脚下一直延伸到天边，像是大地在呼吸。',
    '远处有一群野马在奔跑，马蹄声闷闷的，像远处的雷声。',
    '天空中有鹰在盘旋，它的影子在草地上缓缓移动。',
    '空气中有一股青草的香味，混着泥土的气息。',
    '这里的天空比中原低——或者说是比中原大。',
  ];

  constructor(am: AudioManager) { super('chapter06', am); }
  preload() { super.preload(); this.load.image('chapter06-bg', '/assets/images/chapter-06/bg.svg'); }
  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter06-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }
  protected setupInteractions() { this.startNarrative(); }
  private startNarrative() {
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
    // 线索：鹰的影子
    this.addHotspot({
      id: 'eagle_clue', x: 710, y: 290, width: 40, height: 30,
      type: 'clue', label: '鹰的影子',
      narrativeText: '一只鹰的影子掠过地面，速度很快。她抬头看——鹰的翅膀在阳光下几乎是透明的。在鹰飞过的地方，地上落着一根白色的羽毛。',
      revealsCollectible: 'eagle_feather',
      oneShot: true,
    });

    // 隐藏收集品：白鹰羽
    this.addHotspot({
      id: 'eagle_feather', x: 700, y: 280, width: 50, height: 40,
      type: 'collectible', collectibleId: 'eagle_feather',
      label: '白鹰羽',
      initiallyHidden: true,
      oneShot: true,
    });

    this.addHotspot({ id: 'sky', x: 400, y: 200, width: 200, height: 150, type: 'observation', label: '天空', narrativeText: '草原的天空和中原完全不同——蓝得近乎不真实。一只鹰在高空盘旋，它的影子在草地上缓缓移动。', oneShot: true });
    this.addHotspot({ id: 'grass', x: 600, y: 450, width: 200, height: 80, type: 'observation', label: '草地', narrativeText: '风吹过草地，草浪从脚下一直延伸到天边。她从未见过这么开阔的地方——开阔得让人有些害怕。', oneShot: true });

    // 无标记探索点：野花
    this.addHotspot({
      id: 'wildflower', x: 450, y: 500, width: 40, height: 30,
      type: 'observation',
      narrativeText: '草丛中有一朵不知名的紫色小花，在风中摇摇晃晃。她蹲下来看了很久——这么小的花，是怎么在这片大风中活下来的？',
      oneShot: true,
    });

    this.addHotspot({ id: 'continue_btn', x: 640, y: 620, width: 260, height: 50, type: 'continue', label: '继续前行 →', narrativeText: '草原很大，路还很长。', oneShot: true, onContinue: 'chapter07' });
  }
  protected onInteraction(_t: string) {}
}
