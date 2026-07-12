// 秦岭场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter03Scene extends BaseScene {
  protected ambientTexts: string[] = [
    '雨声填满了整个山谷——沙沙的，像是无数人在低语。',
    '车窗上凝了一层薄雾，她用指尖画了一个圈，透过圈看出去，山色朦胧。',
    '空气中有一股潮湿的泥土味，混着松木的香气。',
    '马车在泥泞中艰难前行，车轮时不时打滑一下。',
    '雨滴顺着车檐连成一条线，滴落在石头上，溅起细小的水花。',
  ];

  constructor(audioManager: AudioManager) {
    super('chapter03', audioManager);
  }

  preload() { super.preload(); this.load.image('chapter03-bg', '/assets/images/chapter-03/bg.jpeg'); }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter03-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }

  protected setupInteractions() { this.startNarrative(); }

  private startNarrative() {
    const lines = [
      '秦岭在下雨。',
      '雨打在树叶上，沙沙作响。',
      '山路泥泞，马车走得很慢。',
      '她靠在车窗旁，看雨水在玻璃上画出弯曲的水痕。',
      '手指沿着水痕移动，一上一下。',
      '—— 四处看看，再继续前行 ——'
    ];
    this.showStorySequence(lines, () => { this.narrativeDone = true; this.spawnHotspots(); });
  }

  private spawnHotspots() {
    // 线索：雨中的落叶声
    this.addHotspot({
      id: 'leaf_clue', x: 520, y: 390, width: 50, height: 40,
      type: 'clue', label: '雨中的声音',
      narrativeText: '雨声中似乎有一片叶子被风吹落的声音——和其他雨声不同，更轻，更脆。她循声看去——',
      revealsCollectible: 'qin_forest_leaf',
      oneShot: true,
    });

    // 隐藏收集品：山树叶
    this.addHotspot({
      id: 'qin_forest_leaf', x: 500, y: 380, width: 80, height: 60,
      type: 'collectible', collectibleId: 'qin_forest_leaf',
      label: '一片山树叶',
      initiallyHidden: true,
      oneShot: true,
    });

    // 观察：雨幕
    this.addHotspot({
      id: 'rain', x: 800, y: 300, width: 100, height: 150,
      type: 'observation', label: '雨幕',
      narrativeText: '雨越下越大了。车窗外的山色被雨幕模糊成一团墨绿。她听见雨水顺着车檐滴落的声音——一滴，一滴，像是有人在数着什么。',
      oneShot: true,
    });

    // 观察：远山
    this.addHotspot({
      id: 'mountain', x: 200, y: 350, width: 120, height: 100,
      type: 'observation', label: '远山',
      narrativeText: '秦岭的山脊在雨中若隐若现。翻过这座山，就是另一个世界了。',
      oneShot: true,
    });

    // 无标记探索点：车窗上的水痕
    this.addHotspot({
      id: 'window_trail', x: 650, y: 350, width: 50, height: 60,
      type: 'observation',
      narrativeText: '雨水在车窗上画出一道弯曲的水痕，像是一条小河。她的手指跟着水痕走了一遍——从山顶到山脚。',
      oneShot: true,
    });

    // 继续前行按钮
    this.addHotspot({
      id: 'continue_btn', x: 640, y: 620, width: 260, height: 50,
      type: 'continue', label: '继续前行 →',
      narrativeText: '雨不会停，路还要走。',
      oneShot: true, onContinue: 'chapter04',
    });
  }

  protected onInteraction(_t: string) {}
}
