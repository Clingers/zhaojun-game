import Phaser from 'phaser';
import { AudioManager } from '../core/AudioManager';
import { DialogueEvent, CollectEvent, TransitionEvent, HotspotConfig, ChoiceOption } from '../types';
import { GameEngine } from '../core/GameEngine';
import { useCollectiblesStore } from '../store/collectiblesStore';
import { useGameStore } from '../store/gameStore';

export default abstract class BaseScene extends Phaser.Scene {
  protected chapterId: string;
  protected audioManager: AudioManager;
  protected background: Phaser.GameObjects.Image | null = null;
  protected hotspots: Phaser.GameObjects.Zone[] = [];
  protected hotspotGlows: Phaser.GameObjects.Graphics[] = [];
  protected hotspotLabels: Phaser.GameObjects.Text[] = [];
  protected narrativeDone: boolean = false;

  // 隐藏式继续按钮相关
  private continueBtnZone: Phaser.GameObjects.Zone | null = null;
  private continueBtnGlow: Phaser.GameObjects.Graphics | null = null;
  private continueBtnLabel: Phaser.GameObjects.Text | null = null;
  private collectedThisChapter: boolean = false;
  private observedThisChapter: Set<string> = new Set();
  private hasCollectibleInChapter: boolean = false;
  private totalObservationCount: number = 0;
  private hintShown: boolean = false;

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
    // 加载所有收集品 SVG 图标
    const items = useCollectiblesStore.getState().items;
    Object.values(items).forEach((item) => {
      if (!this.textures.exists(item.id)) {
        this.load.image(item.id, item.imageUrl);
      }
    });
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

    // 重置章节状态
    this.collectedThisChapter = false;
    this.observedThisChapter = new Set();
    this.hasCollectibleInChapter = false;
    this.totalObservationCount = 0;
    this.hintShown = false;

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
    const isChoice = cfg.type === 'choice';
    const isObservation = cfg.type === 'observation';

    if (isCollectible) {
      this.hasCollectibleInChapter = true;
    }
    if (isObservation) {
      this.totalObservationCount++;
    }

    // 发光指示环
    const glow = this.add.graphics();
    glow.lineStyle(2, isContinue ? 0xffffff : isChoice ? 0x88ccff : 0xffd700, 0.4);
    glow.strokeRoundedRect(
      cfg.x - cfg.width / 2, cfg.y - cfg.height / 2,
      cfg.width, cfg.height, 6
    );
    // 收集品和选择默认可见，继续按钮默认隐藏，观察点默认隐藏
    glow.setAlpha(isCollectible || isChoice ? 0.4 : 0);

    // 标签文字
    const label = this.add.text(cfg.x, cfg.y - cfg.height / 2 - 12, cfg.label || '', {
      fontSize: isContinue ? '18px' : isChoice ? '16px' : '14px',
      color: isContinue ? '#ffffff' : isChoice ? '#88ccff' : '#ffd700',
      fontFamily: 'serif',
      backgroundColor: isContinue ? '#00000099' : isChoice ? '#00336699' : '#00000066',
      padding: { x: 6, y: 2 },
    }).setOrigin(0.5);
    label.setAlpha(isCollectible || isChoice ? 0.6 : 0);

    // 收集品/选择: 脉冲动画让玩家注意到
    if (isCollectible || isChoice) {
      this.tweens.add({
        targets: [glow, label],
        alpha: { from: 0.4, to: 0.8 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // 收集品: 显示物品 SVG 图标
    if (isCollectible && cfg.collectibleId) {
      const icon = this.add.image(cfg.x, cfg.y - cfg.height / 2 - 36, cfg.collectibleId)
        .setScale(0.45)
        .setAlpha(0.9)
        .setDepth(1);
      this.tweens.add({
        targets: icon,
        alpha: { from: 0.7, to: 1 },
        scale: { from: 0.42, to: 0.48 },
        duration: 1800,
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
      if (!isCollectible && !isChoice && !isContinue) {
        glow.setAlpha(0);
        label.setAlpha(0);
      } else if (isContinue) {
        // 继续按钮保持当前可见状态（由 checkContinueUnlock 控制）
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

    // 如果是继续按钮，保存引用并默认隐藏
    if (isContinue) {
      this.continueBtnZone = zone;
      this.continueBtnGlow = glow;
      this.continueBtnLabel = label;
      zone.setVisible(false);
      zone.disableInteractive();
      glow.setAlpha(0);
      label.setAlpha(0);
    }
  }

  /** 检查并解锁继续按钮 */
  protected checkContinueUnlock() {
    if (!this.continueBtnZone || !this.continueBtnGlow || !this.continueBtnLabel) return;

    // 如果本章有收集品但还没收集，不解锁
    if (this.hasCollectibleInChapter && !this.collectedThisChapter) return;

    // 如果本章没有收集品，需要至少点一个观察点才能解锁
    if (!this.hasCollectibleInChapter && this.totalObservationCount > 0 && this.observedThisChapter.size === 0) {
      // 给一次提示
      if (!this.hintShown) {
        this.hintShown = true;
        this.showDialogue('四周似乎还有什么值得一看的地方...', 3000);
      }
      return;
    }

    // 解锁继续按钮
    this.continueBtnZone.setVisible(true);
    this.continueBtnZone.setInteractive({ useHandCursor: true });
    this.continueBtnGlow.setAlpha(0.4);
    this.continueBtnLabel.setAlpha(0.6);

    // 播放出现动画
    this.tweens.add({
      targets: [this.continueBtnGlow, this.continueBtnLabel],
      alpha: { from: 0, to: 0.6 },
      duration: 600,
      ease: 'Power2',
    });
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
        this.observedThisChapter.add(cfg.id);
        if (cfg.narrativeText) {
          this.showDialogue(cfg.narrativeText, 4000);
        }
        // 每次观察后检查是否可以解锁继续按钮
        this.checkContinueUnlock();
        break;
      case 'dialogue':
        if (cfg.narrativeText) {
          this.showDialogue(cfg.narrativeText, 5000);
        }
        break;
      case 'choice':
        if (cfg.choices && cfg.choices.length > 0) {
          this.showChoice(cfg);
        }
        break;
    }
  }

  /** 展示选择界面 */
  private showChoice(cfg: HotspotConfig) {
    const choices = cfg.choices!;

    // 创建半透明背景
    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.6)
      .setInteractive() // 阻止点击穿透
      .setDepth(10);

    // 提示文字
    const prompt = this.add.text(640, 260, cfg.narrativeText || '做出你的选择：', {
      fontSize: '24px', color: '#ffffff', fontFamily: 'serif',
      align: 'center', wordWrap: { width: 800 },
    }).setOrigin(0.5).setDepth(11);

    // 选项按钮
    const buttons: Phaser.GameObjects.Container[] = [];
    const startY = 340;
    const spacing = 90;

    choices.forEach((choice, i) => {
      const y = startY + i * spacing;

      // 按钮背景
      const bg = this.add.rectangle(0, 0, 500, 60, 0x003366, 0.9)
        .setStrokeStyle(2, 0x88ccff, 0.8);

      // 按钮文字
      const txt = this.add.text(0, 0, choice.text, {
        fontSize: '22px', color: '#ffffff', fontFamily: 'serif',
        align: 'center', wordWrap: { width: 460 },
      }).setOrigin(0.5);

      const container = this.add.container(640, y, [bg, txt])
        .setSize(500, 60)
        .setInteractive({ useHandCursor: true })
        .setDepth(11);

      // 悬停效果
      container.on('pointerover', () => bg.setFillStyle(0x005599, 1));
      container.on('pointerout', () => bg.setFillStyle(0x003366, 0.9));

      // 点击选择
      container.on('pointerdown', () => {
        // 记录选择
        useGameStore.getState().makeChoice(cfg.id, choice.id);

        // 销毁所有 UI
        overlay.destroy();
        prompt.destroy();
        buttons.forEach(b => b.destroy(true));

        // 显示选择结果
        if (choice.resultText) {
          this.showDialogue(choice.resultText, 3000);
        }

        // 跳转
        if (cfg.onChoice && cfg.onChoice[choice.id]) {
          this.time.delayedCall(3200, () => {
            this.transitionTo(cfg.onChoice![choice.id]);
          });
        }
      });

      buttons.push(container);
    });
  }

  /** 收集物品 */
  private collectItem(cfg: HotspotConfig) {
    if (!cfg.collectibleId) return;

    const store = useCollectiblesStore.getState();
    const item = store.items[cfg.collectibleId as keyof typeof store.items];
    if (!item || item.unlocked) return;

    // 存入 store
    store.unlock(cfg.collectibleId);
    this.collectedThisChapter = true;

    // 收集动画：光点飞入
    const particle = this.add.circle(cfg.x, cfg.y, 6, 0xffd700);
    this.tweens.add({
      targets: particle,
      x: 1200, y: 60, alpha: 0, scale: 0.3,
      duration: 800, ease: 'Power2',
      onComplete: () => particle.destroy(),
    });

    this.showDialogue(`📖 发现：${item.name}`, 2500);

    // 收集后检查是否可以解锁继续按钮
    this.checkContinueUnlock();
  }

  protected abstract onInteraction(target: string): void;

  /** 展示叙事序列（逐句点击推进） */
  protected showStorySequence(lines: string[], onComplete: () => void) {
    let idx = 0;
    const text = this.add
      .text(640, 360, '', {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'serif',
        align: 'center',
        wordWrap: { width: 900 },
        lineSpacing: 10,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const showNext = () => {
      if (idx >= lines.length) {
        text.destroy();
        onComplete();
        return;
      }
      text.setText(lines[idx]);
      this.tweens.add({
        targets: text,
        alpha: 1,
        duration: 600,
        ease: 'Power2',
      });
      this.input.once('pointerdown', () => {
        idx++;
        showNext();
      });
    };
    showNext();
  }

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
