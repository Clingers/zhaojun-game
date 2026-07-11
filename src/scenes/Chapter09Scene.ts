// 王庭场景
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { AudioManager } from '../core/AudioManager';
import { useGameStore } from '../store/gameStore';

export default class Chapter09Scene extends BaseScene {
  constructor(audioManager: AudioManager) {
    super('chapter09', audioManager);
  }

  preload() {
    super.preload();
    this.load.image('chapter09-bg', '/assets/images/chapter-09/bg.svg');
  }

  protected loadBackground() {
    this.background = this.add.image(640, 360, 'chapter09-bg').setOrigin(0.5);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.3);
  }

  protected setupInteractions(): void {
    this.startNarrative();
  }

  private startNarrative() {
    const choice = useGameStore.getState().getChoice('ch08_choice');

    const lines: string[] = [];
    if (choice === 'talk') {
      lines.push(
        '第二天，队伍到达了匈奴王庭。',
        '那个士兵远远地向她挥手。她笑了笑，也挥了挥手。',
        '王庭比想象中安静——没有盛大的庆典，只有风。',
        '但她不再那么害怕了。',
        '因为她知道这里的人，和中原人一样，会笑会唱歌。',
        '她下了马车，踩在陌生的土地上。',
        '—— 四处看看，再继续前行 ——'
      );
    } else {
      lines.push(
        '第二天，队伍到达了匈奴王庭。',
        '她沉默地走在队伍里，火光中的歌声还在耳边回响。',
        '王庭比想象中安静——没有盛大的庆典，只有风。',
        '她下了马车，踩在陌生的土地上。',
        '这里的一切都是陌生的。',
        '但她知道，自己终究会习惯。',
        '—— 四处看看，再继续前行 ——'
      );
    }

    this.showStorySequence(lines, () => {
      this.narrativeDone = true;
      this.spawnHotspots();
    });
  }

  private spawnHotspots() {
    this.addHotspot({
      id: 'continue_btn', x: 640, y: 620, width: 260, height: 50,
      type: 'continue', label: '继续前行 →',
      narrativeText: '这就是她以后要生活的地方。',
      oneShot: true, onContinue: 'chapter10',
    });
  }

  protected onInteraction(target: string): void {
    // TODO: 章节特定交互
  }

  protected playAmbientAudio() {
    // TODO: 章节环境音效
  }
}