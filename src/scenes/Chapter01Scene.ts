// 长安场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter01Scene extends BaseScene {
  protected ambientTexts: string[] = [
    '窗外传来街市的嘈杂声——卖糖葫芦的、磨刀的、赶驴车的。长安的早晨和往常一样热闹。',
    '铜镜里映出一张年轻的脸。她盯着镜中的自己，仿佛想记住这一刻的模样。',
    '香炉里的烟袅袅升起，在晨光中泛着淡蓝色的光。',
    '远处传来钟声——是未央宫的早朝钟。她听惯了这声音，以后再也听不到了。',
    '风从窗缝里钻进来，带着深秋的凉意。',
  ];

  constructor(audioManager: AudioManager) {
    super('chapter01', audioManager);
  }

  preload() {
    super.preload();
    this.load.image('chapter01-bg', '/assets/images/chapter-01/bg.jpeg');
  }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter01-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }

  protected setupInteractions(): void {
    this.startNarrative();
  }

  private startNarrative() {
    const lines = [
      '深秋。长安。未央宫的一间偏殿。',
      '她坐在铜镜前，最后一次整理妆容。',
      '镜面上有一道细细的划痕，她用手指轻轻碰了碰。',
      '这面镜子她用了三年。',
      '今天，她要远嫁匈奴。',
      '—— 四处看看，再继续前行 ——'
    ];
    this.showStorySequence(lines, () => {
      this.narrativeDone = true;
      this.spawnHotspots();
    });
  }

  private spawnHotspots() {
    // 线索：桌面划痕
    this.addHotspot({
      id: 'mirror_clue',
      x: 450, y: 460, width: 60, height: 50,
      type: 'clue',
      label: '桌面的痕迹',
      narrativeText: '桌面上有一道细细的划痕，像是被什么锋利的东西反复划过。她用手指沿着划痕走了一遍——那是铜镜边框留下的印记。',
      revealsCollectible: 'bronze_mirror',
      oneShot: true,
    });

    // 隐藏收集品：铜镜碎片
    this.addHotspot({
      id: 'bronze_mirror',
      x: 400, y: 460, width: 80, height: 90,
      type: 'collectible',
      collectibleId: 'bronze_mirror',
      label: '铜镜',
      initiallyHidden: true,
      oneShot: true,
    });

    // 观察：窗外
    this.addHotspot({
      id: 'window',
      x: 900, y: 250, width: 120, height: 150,
      type: 'observation', label: '窗外',
      narrativeText: '透过窗棂，可以看到长安城的轮廓。晨光中的街巷一如往常——没有人知道今天有一位女子即将离开。',
      oneShot: true,
    });

    // 观察：行囊
    this.addHotspot({
      id: 'luggage',
      x: 250, y: 480, width: 70, height: 60,
      type: 'observation', label: '行囊',
      narrativeText: '角落里放着一只简朴的行囊。几件换洗衣物，一把木梳，一块手帕——她带不走长安的任何东西。',
      oneShot: true,
    });

    // 无标记探索点：香炉
    this.addHotspot({
      id: 'incense',
      x: 600, y: 350, width: 50, height: 50,
      type: 'observation',
      narrativeText: '香炉里的烟袅袅升起，在晨光中泛着淡蓝色的光。她深吸了一口气——这是长安的味道。',
      oneShot: true,
    });

    // 无标记探索点：窗台上的花
    this.addHotspot({
      id: 'flower',
      x: 850, y: 400, width: 40, height: 40,
      type: 'observation',
      narrativeText: '窗台上放着一枝快要凋谢的秋菊。花瓣的边缘已经开始卷曲，但颜色依然鲜艳。',
      oneShot: true,
    });

    // 继续前行按钮
    this.addHotspot({
      id: 'continue_btn', x: 640, y: 620, width: 260, height: 50,
      type: 'continue', label: '继续前行 →',
      narrativeText: '是时候出发了。',
      oneShot: true, onContinue: 'chapter02',
    });
  }

  protected onInteraction(target: string): void {
    // 已废弃，由热区系统处理
  }
}
