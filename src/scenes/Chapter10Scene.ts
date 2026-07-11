// 北地场景 - 结局
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';
import { useGameStore } from '../store/gameStore';

export default class Chapter10Scene extends BaseScene {
  constructor(audioManager: AudioManager) {
    super('chapter10', audioManager);
  }

  preload() {
    super.preload();
    this.load.image('chapter10-bg', '/assets/images/chapter-10/bg.svg');
  }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter10-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }

  protected setupInteractions(): void {
    this.startNarrative();
  }

  private startNarrative() {
    const ch05choice = useGameStore.getState().getChoice('ch05_choice');
    const ch08choice = useGameStore.getState().getChoice('ch08_choice');

    // 根据两个选择组合出不同的结局文本
    const lines: string[] = [];

    if (ch08choice === 'talk') {
      lines.push(
        '二十年后。',
        '她的孩子已经在草原上奔跑，说着流利的匈奴语。',
        '她偶尔会想起长安——那座遥远的城市。',
        '那些记忆已经模糊得像梦一样。',
        '她站在帐篷外，望着南方。',
        '那里是长安的方向。',
      );
      if (ch05choice === 'look_back') {
        lines.push('她笑了笑。那些回忆，她带了一路，现在终于可以放下了。');
      } else {
        lines.push('她笑了笑。当年那个头也不回的女孩，如今已经是这片草原的人了。');
      }
      lines.push(
        '昭君去世后，葬于大黑河南岸。',
        '墓上青草四季常青，人称青冢。',
        '匈奴人每年都会来祭拜她。',
        '他们称她为——我们的王妃。'
      );
    } else {
      // alone
      lines.push(
        '二十年后。',
        '她的孩子已经在草原上奔跑。',
        '她依然话不多，但眼神安静而坚定。',
        '她学会了匈奴语，学会了骑马，学会了在风雪中生火。',
        '她站在帐篷外，望着南方。',
        '那里是长安的方向。',
      );
      if (ch05choice === 'look_back') {
        lines.push('她偶尔还会想起那座城市——但已经不觉得痛了。');
      } else {
        lines.push('她很少想起长安了。草原才是她的家。');
      }
      lines.push(
        '昭君去世后，葬于大黑河南岸。',
        '墓上青草四季常青，人称青冢。',
        '风从南边吹来，吹过青草。',
        '像是有人在远方，轻轻地叫她的名字。'
      );
    }

    this.showStorySequence(lines, () => {
      this.narrativeDone = true;
    });
  }

  protected onInteraction(target: string): void {
    // TODO: 章节特定交互
  }

  protected playAmbientAudio() {
    // TODO: 章节环境音效
  }
}