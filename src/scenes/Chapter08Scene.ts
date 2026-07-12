// 篝火场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter08Scene extends BaseScene {
  protected ambientTexts: string[] = [
    '篝火发出噼啪的声响，火星升到空中，和星星混在一起。',
    '老人的歌声还在继续——旋律简单，但有一种说不出的苍凉。',
    '火光照在每个人的脸上，让所有的面孔都变成了暖橙色。',
    '有人往火里添了一根干柴，火焰猛地窜高了一下。',
    '夜空中星星很亮——比中原的星星亮得多，像是有人在天上点了一万盏灯。',
  ];

  constructor(audioManager: AudioManager) {
    super('chapter08', audioManager);
  }

  preload() {
    super.preload();
    this.load.image('chapter08-bg', '/assets/images/chapter-08/bg.jpeg');
  }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter08-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }

  protected setupInteractions(): void {
    // 线索：火堆里的火星
    this.addHotspot({
      id: 'charcoal_clue', x: 520, y: 460, width: 40, height: 30,
      type: 'clue', label: '火星',
      narrativeText: '火堆里迸出一颗火星，落在旁边的地上。火星熄灭后，地上留下了一块暗红色的炭——还在微微发着光。',
      revealsCollectible: 'campfire_charcoal',
      oneShot: true,
    });

    // 隐藏收集品：篝火炭
    this.addHotspot({
      id: 'campfire_charcoal', x: 500, y: 450, width: 70, height: 50,
      type: 'collectible', collectibleId: 'campfire_charcoal',
      label: '篝火炭',
      initiallyHidden: true,
      oneShot: true,
    });

    this.startNarrative();
  }

  private startNarrative() {
    const lines = [
      '夜里，大家在篝火旁围坐。',
      '火光暖橙色的，映在每个人的脸上。',
      '一位匈奴老人闭着眼，唱起古老的歌。',
      '她听不懂歌词，但听懂了旋律。',
      '那是草原的声音。',
      '—— 四处看看，再继续前行 ——'
    ];
    this.showStorySequence(lines, () => {
      this.narrativeDone = true;
      this.spawnHotspots();
    });
  }

  private spawnHotspots() {
    // 无标记探索点：夜空
    this.addHotspot({
      id: 'stars', x: 800, y: 200, width: 100, height: 80,
      type: 'observation',
      narrativeText: '草原的夜空没有一丝云，星星密密麻麻地铺满了整个天穹。她从未见过这么多星星——像是有人在头顶撒了一把碎钻。',
      oneShot: true,
    });

    // 无标记探索点：老人
    this.addHotspot({
      id: 'old_man', x: 350, y: 380, width: 60, height: 70,
      type: 'observation',
      narrativeText: '唱歌的老人闭着眼睛，脸上的皱纹在火光中显得很深。他的手指在膝盖上轻轻打着节拍——那是草原的节奏。',
      oneShot: true,
    });

    // 关键选择
    this.addHotspot({
      id: 'ch08_choice', x: 640, y: 500, width: 420, height: 60,
      type: 'choice', label: '做出选择',
      narrativeText: '火光中，一个匈奴士兵朝你笑了笑。你想怎么做？',
      choices: [
        {
          id: 'talk',
          text: '💬 用刚学的匈奴语打招呼——试着交流',
          resultText: '士兵愣了一下，然后大笑起来。他用生硬的汉语说："你——好！"两人连比带划地聊了很久。她第一次觉得，这些"蛮族"和中原人也没什么不同。',
        },
        {
          id: 'alone',
          text: '🔥 安静地坐在火边——不打扰任何人',
          resultText: '她专注地看着火焰。老人还在唱歌，歌声时而悠扬时而苍凉。她闭上眼睛，让火光照亮她的脸。这一刻没有中原也没有匈奴，只有火。',
        },
      ],
      onChoice: { talk: 'chapter09', alone: 'chapter09' },
      oneShot: true,
    });
  }

  protected onInteraction(target: string): void {
    // TODO: 章节特定交互
  }

  protected playAmbientAudio() {
    // TODO: 章节环境音效
  }
}
