// 渭水场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter02Scene extends BaseScene {
  protected ambientTexts: string[] = [
    '渭河的水声不大，但很稳——像是一首听不出旋律的歌。',
    '河风吹过，带着水草和泥土的气息。和长安的街巷气味完全不同。',
    '远处有农夫在田间劳作，弓着背，一下一下地挥着锄头。',
    '马车轮子在沙土路上碾出两道深深的车辙，一直延伸到看不见的地方。',
    '铜铃在风中叮当作响，声音清脆而单调。',
  ];

  constructor(audioManager: AudioManager) {
    super('chapter02', audioManager);
  }

  preload() {
    super.preload();
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
    // 线索：河滩上的闪光
    this.addHotspot({
      id: 'stone_clue',
      x: 420, y: 490, width: 50, height: 40,
      type: 'clue',
      label: '水边的闪光',
      narrativeText: '河滩上有什么东西在阳光下闪烁了一下。她弯下腰，拨开碎石——',
      revealsCollectible: 'wei_stone',
      oneShot: true,
    });

    // 隐藏收集品：圆润的石头
    this.addHotspot({
      id: 'wei_stone',
      x: 400, y: 480, width: 60, height: 50,
      type: 'collectible', collectibleId: 'wei_stone',
      label: '圆润的石头',
      initiallyHidden: true,
      oneShot: true,
    });

    // 观察：河面
    this.addHotspot({
      id: 'river_view', x: 750, y: 400, width: 200, height: 120,
      type: 'observation', label: '河面',
      narrativeText: '渭河的水不算太急，在秋日阳光下泛着细碎的光。河对岸的田野已经收割完毕，只剩下茬子。这片土地，她再也回不来了。',
      oneShot: true,
    });

    // 观察：马车
    this.addHotspot({
      id: 'carriage', x: 300, y: 530, width: 100, height: 60,
      type: 'observation', label: '马车',
      narrativeText: '马车在沙土路上颠簸了一下。车辕上的铜铃叮当作响，像是一路在为谁送行。',
      oneShot: true,
    });

    // 无标记探索点：河边的柳树
    this.addHotspot({
      id: 'willow', x: 550, y: 300, width: 60, height: 80,
      type: 'observation',
      narrativeText: '河岸边有一棵老柳树，枝条垂到水面，随着水流轻轻摆动。像是有人在挥手告别。',
      oneShot: true,
    });

    // 继续前行按钮
    this.addHotspot({
      id: 'continue_btn', x: 640, y: 620, width: 260, height: 50,
      type: 'continue', label: '继续前行 →',
      narrativeText: '前面还有很远的路。',
      oneShot: true, onContinue: 'chapter03',
    });
  }

  protected onInteraction(_target: string): void {}
}
