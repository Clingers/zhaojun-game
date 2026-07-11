// 篝火场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';

export default class Chapter08Scene extends BaseScene {
  constructor(audioManager: AudioManager) {
    super('chapter08', audioManager);
  }

  preload() {
    super.preload();
    this.load.image('chapter08-bg', '/assets/images/chapter-08/bg.svg');
  }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter08-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }

  protected setupInteractions(): void {
    // 篝火炭收集品 - 在篝火旁
    this.addHotspot({
      id: 'campfire_charcoal',
      x: 500, y: 450, width: 70, height: 50,
      type: 'collectible',
      collectibleId: 'campfire_charcoal',
      label: '篝火炭',
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
    // 关键选择：与陌生人交流还是独处
    this.addHotspot({
      id: 'ch08_choice',
      x: 640, y: 500, width: 420, height: 60,
      type: 'choice',
      label: '做出选择',
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
    // TODO: 章节特定交互（收集品、对话等）
  }

  protected playAmbientAudio() {
    // TODO: 章节环境音效
  }
}