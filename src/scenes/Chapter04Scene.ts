// 黄河场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter04Scene extends BaseScene {
  protected ambientTexts: string[] = [
    '黄河水声轰鸣，像是一头巨大的野兽在低吼。',
    '河风吹乱了她的头发，带着泥沙的腥味。',
    '壮汉们的号子声在河面上回荡——嘿——嗬——嘿——嗬——',
    '脚下的船板湿漉漉的，踩上去有些滑。',
    '对岸的轮廓在河雾中若隐若现——那是她从未踏足过的土地。',
  ];

  constructor(am: AudioManager) { super('chapter04', am); }
  preload() { super.preload(); this.load.image('chapter04-bg', '/assets/images/chapter-04/bg.svg'); }
  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter04-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }
  protected setupInteractions() { this.startNarrative(); }
  private startNarrative() {
    const lines = [
      '黄河在面前。',
      '水色浑黄，流速很急。',
      '壮汉们抬着马车过河，喊着号子。',
      '她第一次见到这么宽的河。',
      '车在河心晃了一下，她没有出声。',
      '—— 四处看看，再继续前行 ——'
    ];
    this.showStorySequence(lines, () => { this.narrativeDone = true; this.spawnHotspots(); });
  }
  private spawnHotspots() {
    // 线索：河滩上的脚印
    this.addHotspot({
      id: 'sand_clue', x: 370, y: 510, width: 50, height: 40,
      type: 'clue', label: '河滩上的脚印',
      narrativeText: '岸边有一串脚印通向河滩，脚印的尽头似乎有什么东西被半埋在沙里。她蹲下来，用手拨开泥沙——',
      revealsCollectible: 'yellow_river_sand',
      oneShot: true,
    });

    // 隐藏收集品：黄河砂
    this.addHotspot({
      id: 'yellow_river_sand', x: 350, y: 500, width: 70, height: 50,
      type: 'collectible', collectibleId: 'yellow_river_sand',
      label: '黄河砂',
      initiallyHidden: true,
      oneShot: true,
    });

    // 观察：黄河
    this.addHotspot({
      id: 'river', x: 650, y: 400, width: 160, height: 80,
      type: 'observation', label: '黄河',
      narrativeText: '黄河水浑浊而沉重，像是大地流出的血液。她从未见过如此宽阔的河流——过了黄河，长安就真的在身后了。',
      oneShot: true,
    });

    // 观察：船夫
    this.addHotspot({
      id: 'ferrymen', x: 300, y: 540, width: 90, height: 50,
      type: 'observation', label: '船夫',
      narrativeText: '壮汉们赤着上身，喊着整齐的号子。他们的脊背被太阳晒得黝黑，在河水的反光中发亮。',
      oneShot: true,
    });

    // 无标记探索点：河面上的漩涡
    this.addHotspot({
      id: 'whirlpool', x: 500, y: 350, width: 60, height: 50,
      type: 'observation',
      narrativeText: '河面上有一个小小的漩涡，转了几圈就消失了。她盯着那个地方看了很久——像是什么东西沉下去了。',
      oneShot: true,
    });

    // 继续前行按钮
    this.addHotspot({
      id: 'continue_btn', x: 640, y: 620, width: 260, height: 50,
      type: 'continue', label: '继续前行 →',
      narrativeText: '过了黄河，便是塞外。',
      oneShot: true, onContinue: 'chapter05',
    });
  }
  protected onInteraction(_t: string) {}
}
