// 暴风雪场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter07Scene extends BaseScene {
  protected ambientTexts: string[] = [
    '风在帐篷外呼啸，像是有一千只狼在嚎叫。',
    '雪粒打在帐篷上，沙沙作响——和秦岭的雨声有点像，但更冷。',
    '她的手已经冻得没有知觉了，捧着热茶碗时才感到刺痛——那是血液重新流动的感觉。',
    '有人在她身边咳嗽了一声，然后是沉默。所有人都沉默着，等暴风雪过去。',
    '帐篷里的火堆发出噼啪声，火星溅到空中，瞬间就熄灭了。',
  ];

  constructor(am: AudioManager) { super('chapter07', am); }
  preload() { super.preload(); this.load.image('chapter07-bg', '/assets/images/chapter-07/bg.jpeg'); }
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
    // 线索：风雪中的光点
    this.addHotspot({
      id: 'snow_clue', x: 510, y: 390, width: 40, height: 30,
      type: 'clue', label: '风中的光',
      narrativeText: '风雪中似乎有细小的光点在闪烁。她伸手去接——一片雪花落在她的掌心里，六角形的，精致得不像真的。然后它融化了。',
      revealsCollectible: 'snowflake',
      oneShot: true,
    });

    // 隐藏收集品：雪花
    this.addHotspot({
      id: 'snowflake', x: 500, y: 380, width: 50, height: 50,
      type: 'collectible', collectibleId: 'snowflake',
      label: '雪花',
      initiallyHidden: true,
      oneShot: true,
    });

    this.addHotspot({ id: 'storm', x: 300, y: 200, width: 200, height: 150, type: 'observation', label: '雪风', narrativeText: '暴风雪中的风有一种奇特的力量——它不冷，但能穿透一切。她裹紧了外衣，把脸埋进领口里。', oneShot: true });
    this.addHotspot({ id: 'tent', x: 800, y: 500, width: 120, height: 80, type: 'observation', label: '营地', narrativeText: '临时搭起的帐篷在风中摇晃。有人递给她一碗热茶，她接过来，手指碰到碗壁时才发现自己已经冻僵了。', oneShot: true });

    // 无标记探索点：帐篷裂缝
    this.addHotspot({
      id: 'crack', x: 700, y: 350, width: 40, height: 50,
      type: 'observation',
      narrativeText: '帐篷的角落有一道裂缝，风从那里灌进来，带着细碎的雪粒。她用袖子堵住了裂缝——但风还是从别的地方钻进来。',
      oneShot: true,
    });

    this.addHotspot({ id: 'continue', x: 640, y: 620, width: 300, height: 60, type: 'continue', label: '继续前行 →', narrativeText: '暴风雪终会过去。', oneShot: true, onContinue: 'chapter08' });
  }
  protected onInteraction(_t: string) {}
}
