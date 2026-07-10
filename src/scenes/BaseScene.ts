import Phaser from 'phaser';
import { AudioManager } from '../core/AudioManager';
import { DialogueEvent, CollectEvent, TransitionEvent, HotspotConfig } from '../types';
import { GameEngine } from '../core/GameEngine';
import { useCollectiblesStore } from '../store/collectiblesStore';

export default abstract class BaseScene extends Phaser.Scene {
  protected chapterId: string;
  protected audioManager: AudioManager;
  protected background: Phaser.GameObjects.Image | null = null;
  protected hotspots: Phaser.GameObjects.Zone[] = [];
  protected hotspotGlows: Phaser.GameObjects.Graphics[] = [];
  protected hotspotLabels: Phaser.GameObjects.Text[] = [];
  protected narrativeDone: boolean = false;

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
    // 从 GameEngine 静态属性拉取事件处理器（解决时序问题）
    if (GameEngine.pendingOnTransition && !this.transitionCallback) {
      this.setEventHandlers(
        GameEngine.pendingOnDialogue || (() => {}),
        GameEngine.pendingOnCollect || (() => {}),
        GameEngine.pendingOnTransition
      );
    }

    this.loadBackground();
    this.setupInteractions();
    this.playAmbientAudio();

    // 发出章节开始事件
    this.events.emit('chapter:start', { chapterId: this.chapterId });
  }

  protected abstract loadBackground(): void;
  protected abstract setupInteractions(): void;

  // ──── 热区交互系统 ────

  /** 创建一个可交互热区 */
  protected addHotspot(cfg: HotspotConfig) {
    const zone = this.add.zone(cfg.x, cfg.y, cfg.width, cfg.height)
      .setInteractive({ useHandCursor: true });

    const isCollectible = cfg.type === 'collectible';
    const isContinue = cfg.type === 'continue';

    // 发光指示环
    const glow = this.add.graphics();
    glow.lineStyle(2, isContinue ? 0xffffff : 0xffd700, 0.4);
    glow.strokeRoundedRect(
      cfg.x - cfg.width / 2, cfg.y - cfg.height / 2,
      cfg.width, cfg.height, 6
    );
    // 收集品和继续按钮默认可见，观察点默认隐藏
    glow.setAlpha(isCollectible || isContinue ? 0.4 : 0);

    // 标签文字
    const label = this.add.text(cfg.x, cfg.y - cfg.height / 2 - 12, cfg.label || '', {
      fontSize: isContinue ? '18px' : '14px', color: isContinue ? '#ffffff' : '#ffd700', fontFamily: 'serif',
      backgroundColor: isContinue ? '#00000099' : '#00000066', padding: { x: 6, y: 2 },
    }).setOrigin(0.5);
    label.setAlpha(isCollectible || isContinue ? 0.6 : 0);

    // 收集品: 脉冲动画让玩家注意到
    if (isCollectible) {
      this.tweens.add({
        targets: [glow, label],
        alpha: { from: 0.4, to: 0.8 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // 悬停效果
    zone.on('pointerover', () => {
      glow.setAlpha(1);
      label.setAlpha(1);
    });
    zone.on('pointerout', () => {
      if (!isCollectible && !isContinue) {
        glow.setAlpha(0);
        label.setAlpha(0);
      } else {
        glow.setAlpha(0.4);
        label.setAlpha(0.6);
      }
    });

    // 点击处理
    zone.on('pointerdown', () => {
      glow.setAlpha(0);
      label.setAlpha(0);
      if (cfg.oneShot) {
        zone.disableInteractive();
        zone.setVisible(false);
      }
      this.onHotspotClicked(cfg);
    });

    this.hotspots.push(zone);
    this.hotspotGlows.push(glow);
    this.hotspotLabels.push(label);
  }

  /** 热区点击回调 */
  private onHotspotClicked(cfg: HotspotConfig) {
    switch (cfg.type) {
      case 'collectible':
        this.collectItem(cfg);
        break;
      case 'continue':
        if (cfg.onContinue) {
          this.showDialogue('继续前行...', 1500);
          this.time.delayedCall(1600, () => {
            this.transitionTo(cfg.onContinue!);
          });
        }
        break;
      case 'observation':
        if (cfg.narrativeText) {
          this.showDialogue(cfg.narrativeText, 4000);
        }
        break;
      case 'dialogue':
        if (cfg.narrativeText) {
          this.showDialogue(cfg.narrativeText, 5000);
        }
        break;
    }
  }

  /** 收集物品 */
  private collectItem(cfg: HotspotConfig) {
    if (!cfg.collectibleId) return;

    const store = useCollectiblesStore.getState();
    const item = store.items[cfg.collectibleId as keyof typeof store.items];
    if (!item || item.unlocked) return;

    // 存入 store
    store.unlock(cfg.collectibleId);

    // 收集动画：光点飞入
    const particle = this.add.circle(cfg.x, cfg.y, 6, 0xffd700);
    this.tweens.add({
      targets: particle,
      x: 1200, y: 60, alpha: 0, scale: 0.3,
      duration: 800, ease: 'Power2',
      onComplete: () => particle.destroy(),
    });

    this.showDialogue(`📖 发现：${item.name}`, 2500);
  }

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
