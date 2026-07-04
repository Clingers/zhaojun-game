import Phaser from 'phaser';
import { AudioManager } from '../../core/AudioManager';
import { DialogueEvent, CollectEvent, TransitionEvent } from '../../types';

export abstract class BaseScene extends Phaser.Scene {
  protected chapterId: string;
  protected audioManager: AudioManager;
  protected background: Phaser.GameObjects.Image | null = null;

  // 事件回调
  private dialogueCallback?: (event: DialogueEvent) => void;
  private collectCallback?: (event: CollectEvent) => void;
  private transitionCallback?: (event: TransitionEvent) => void;

  constructor(chapterId: string, audioManager: AudioManager) {
    super({ key: chapterId });
    this.chapterId = chapterId;
    this.audioManager = audioManager;
  }

  // 设置事件处理器（由 React 侧注入）
  setEventHandlers(
    onDialogue: (event: DialogueEvent) => void,
    onCollect: (event: CollectEvent) => void,
    onTransition: (event: TransitionEvent) => void
  ) {
    this.dialogueCallback = onDialogue;
    this.collectCallback = onCollect;
    this.transitionCallback = onTransition;
  }

  preload() {
    // 子类实现资源加载
  }

  create() {
    this.loadBackground();
    this.setupInteractions();
    this.playAmbientAudio();

    // 发出章节开始事件
    this.events.emit('chapter:start', { chapterId: this.chapterId });
  }

  protected abstract loadBackground(): void;
  protected abstract setupInteractions(): void;
  protected abstract onInteraction(target: string): void;

  protected showDialogue(text: string, duration: number = 3000) {
    const dialogueText = this.add
      .text(640, 600, text, {
        fontSize: '28px',
        color: '#ffffff',
        backgroundColor: '#000000aa',
        padding: { x: 24, y: 12 },
        wordWrap: { width: 1000 },
        align: 'center',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: dialogueText,
      alpha: 1,
      duration: 500,
      ease: 'Power2',
    });

    setTimeout(() => {
      this.tweens.add({
        targets: dialogueText,
        alpha: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => dialogueText.destroy(),
      });
    }, duration);

    // 同时发送事件给 React 侧
    if (this.dialogueCallback) {
      this.dialogueCallback({ type: 'dialogue', text, duration });
    }
  }

  protected playAmbientAudio() {
    // 子类实现
  }

  protected onCollectibleCollected(collectibleId: string, item: any) {
    if (this.collectCallback) {
      this.collectCallback({
        type: 'collectible',
        collectibleId,
        item,
      });
    }
    this.showDialogue(`收集成功：${item.name}`);
  }

  protected transitionTo(nextChapter: string) {
    if (this.transitionCallback) {
      this.transitionCallback({
        type: 'transition',
        from: this.chapterId,
        to: nextChapter,
      });
    }
  }
}
