import Phaser from 'phaser';
import { AudioManager } from '../core/AudioManager';
import { DialogueEvent, CollectEvent, TransitionEvent, HotspotConfig, ChoiceOption } from '../types';
import { GameEngine } from '../core/GameEngine';
import { useCollectiblesStore } from '../store/collectiblesStore';
import { useGameStore } from '../store/gameStore';
import { DialogueBar } from '../ui/DialogueBar';

export default abstract class BaseScene extends Phaser.Scene {
  protected chapterId: string;
  protected audioManager: AudioManager;
  protected background: Phaser.GameObjects.Image | null = null;
  protected hotspots: Phaser.GameObjects.Zone[] = [];
  protected hotspotGlows: Phaser.GameObjects.Graphics[] = [];
  protected hotspotLabels: Phaser.GameObjects.Text[] = [];
  protected narrativeDone: boolean = false;
  protected dialogueBar!: DialogueBar;

  /** 子类可覆写：空白区域点击时随机展示的环境描述 */
  protected ambientTexts: string[] = [];

  // 隐藏式继续按钮相关
  private continueBtnZone: Phaser.GameObjects.Zone | null = null;
  private continueBtnGlow: Phaser.GameObjects.Graphics | null = null;
  private continueBtnLabel: Phaser.GameObjects.Text | null = null;
  private collectedThisChapter: boolean = false;
  private observedThisChapter: Set<string> = new Set();
  private hasCollectibleInChapter: boolean = false;
  private totalObservationCount: number = 0;
  private hintShown: boolean = false;

  // 隐藏收集品相关（initiallyHidden）
  private hiddenCollectibles: Map<string, {
    zone: Phaser.GameObjects.Zone;
    glow: Phaser.GameObjects.Graphics;
    label: Phaser.GameObjects.Text;
    icon?: Phaser.GameObjects.Image;
  }> = new Map();

  // 空白区域点击防刷
  private lastAmbientTime: number = 0;

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
    this.hiddenCollectibles.clear();
    this.lastAmbientTime = 0;

    this.loadBackground();
    this.playAmbientAudio();

    // 创建对话栏（必须在 setupInteractions 之前，因为子类可能立即调用 showStorySequence）
    this.dialogueBar = new DialogueBar(this);

    this.setupInteractions();

    // 注册空白区域点击（延迟一帧避免与热点点击冲突）
    this.time.delayedCall(100, () => {
      this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        this.onAmbientClick(pointer);
      });
    });

    // 发出章节开始事件
    this.events.emit('chapter:start', { chapterId: this.chapterId });
  }

  protected abstract loadBackground(): void;
  protected abstract setupInteractions(): void;

  // ──── 空白区域探索 ────

  /** 空白区域点击处理 */
  private onAmbientClick(pointer: Phaser.Input.Pointer) {
    if (this.dialogueBar.isVisible()) return; // 对话栏活跃时不触发
    if (this.ambientTexts.length === 0) return;
    if (this.narrativeDone === false) return; // 叙事中不触发

    // 检查是否点到了某个热点
    let hitHotspot = false;
    for (const zone of this.hotspots) {
      if (zone.visible && zone.input && zone.input.enabled) {
        const bounds = zone.getBounds();
        if (bounds.contains(pointer.x, pointer.y)) {
          hitHotspot = true;
          break;
        }
      }
    }
    if (hitHotspot) return;

    // 防刷：至少间隔 3 秒
    const now = Date.now();
    if (now - this.lastAmbientTime < 3000) return;
    this.lastAmbientTime = now;

    // 随机选一条环境描述
    const text = this.ambientTexts[Math.floor(Math.random() * this.ambientTexts.length)];
    this.showDialogue(text, 3500);
  }

  // ──── 揭示隐藏收集品 ────

  /** 揭示一个隐藏收集品 */
  protected revealCollectible(hotspotId: string) {
    const hidden = this.hiddenCollectibles.get(hotspotId);
    if (!hidden) return;

    const { zone, glow, label, icon } = hidden;

    // 显示并启用交互
    zone.setVisible(true);
    zone.setInteractive({ useHandCursor: true });
    glow.setAlpha(0);
    label.setAlpha(0);

    // 揭示动画：淡入 + 放大
    this.tweens.add({
      targets: [glow, label],
      alpha: { from: 0, to: 0.8 },
      duration: 600,
      ease: 'Power2',
    });

    if (icon) {
      icon.setVisible(true);
      icon.setScale(0.1);
      icon.setAlpha(0);
      this.tweens.add({
        targets: icon,
        scale: 0.45,
        alpha: 0.9,
        duration: 800,
        ease: 'Back.easeOut',
      });
    }

    // 揭示后启动脉冲动画
    this.tweens.add({
      targets: [glow, label],
      alpha: { from: 0.4, to: 0.8 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 600,
    });
  }

  // ──── 热区交互系统 ────

  /** 创建一个可交互热区 */
  protected addHotspot(cfg: HotspotConfig) {
    const isCollectible = cfg.type === 'collectible';
    const isContinue = cfg.type === 'continue';
    const isChoice = cfg.type === 'choice';
    const isObservation = cfg.type === 'observation';
    const isClue = cfg.type === 'clue';
    const isHidden = cfg.initiallyHidden === true;

    if (isCollectible) {
      this.hasCollectibleInChapter = true;
    }
    if (isObservation) {
      this.totalObservationCount++;
    }

    // 无标记探索点：不显示光晕和标签
    const isUnmarked = isObservation && !cfg.label;

    const zone = this.add.zone(cfg.x, cfg.y, cfg.width, cfg.height);

    // 隐藏收集品初始不可交互
    if (isHidden) {
      zone.setVisible(false);
    } else {
      zone.setInteractive({ useHandCursor: true });
    }

    // 发光指示环 — 极淡，仅悬停时可见
    const glow = this.add.graphics();
    glow.lineStyle(1, isContinue ? 0xffffff : isChoice ? 0x88ccff : isClue ? 0x66ff66 : 0xffd700, 0.2);
    glow.strokeRoundedRect(
      cfg.x - cfg.width / 2, cfg.y - cfg.height / 2,
      cfg.width, cfg.height, 6
    );

    if (isHidden || isUnmarked) {
      glow.setAlpha(0);
    } else {
      glow.setAlpha(isCollectible || isChoice || isClue ? 0.15 : 0);
    }

    // 标签文字
    const labelText = cfg.label || '';
    const label = this.add.text(cfg.x, cfg.y - cfg.height / 2 - 12, labelText, {
      fontSize: isContinue ? '18px' : isChoice ? '16px' : isClue ? '15px' : '14px',
      color: isContinue ? '#ffffff' : isChoice ? '#88ccff' : isClue ? '#88ff88' : '#ffd700',
      fontFamily: 'serif',
      backgroundColor: isContinue ? '#00000099' : isChoice ? '#00336699' : isClue ? '#00330099' : '#00000066',
      padding: { x: 6, y: 2 },
    }).setOrigin(0.5);

    if (isHidden || isUnmarked) {
      label.setAlpha(0);
    } else {
      label.setAlpha(0); // 标签默认隐藏，仅悬停时显示
    }

    // 极淡脉冲动画（非隐藏、非无标记）
    if (!isHidden && !isUnmarked && (isCollectible || isChoice || isClue)) {
      this.tweens.add({
        targets: [glow, label],
        alpha: { from: 0.10, to: 0.25 },
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // 收集品图标
    let icon: Phaser.GameObjects.Image | undefined;
    if (isCollectible && cfg.collectibleId) {
      icon = this.add.image(cfg.x, cfg.y - cfg.height / 2 - 36, cfg.collectibleId)
        .setScale(0.45)
        .setAlpha(0.9)
        .setDepth(1);

      if (isHidden) {
        icon.setVisible(false);
      } else {
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
    }

    // 悬停效果（隐藏收集品和无标记点有不同行为）
    if (!isHidden) {
      zone.on('pointerover', () => {
        glow.setAlpha(0.5);
        if (!isUnmarked) label.setAlpha(0.75);
      });
      zone.on('pointerout', () => {
        if (isUnmarked || isObservation) {
          glow.setAlpha(0);
          label.setAlpha(0);
        } else if (isContinue) {
          // 继续按钮保持当前可见状态
        } else {
          glow.setAlpha(0.15);
          label.setAlpha(0);
        }
      });
    }

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

    // 保存隐藏收集品引用
    if (isHidden && isCollectible) {
      this.hiddenCollectibles.set(cfg.id, { zone, glow, label, icon });
    }

    // 继续按钮默认隐藏
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
      if (!this.hintShown) {
        this.hintShown = true;
        this.showDialogue('四周似乎还有什么值得一看的地方...', 3000);
      }
      return;
    }

    // 有隐藏收集品但还没找到：如果玩家已经把可见的观察点都点了一遍，给更强提示
    if (this.hasCollectibleInChapter && !this.collectedThisChapter &&
        this.totalObservationCount > 0 && this.observedThisChapter.size >= this.totalObservationCount) {
      if (!this.hintShown) {
        this.hintShown = true;
        this.showDialogue('雨声中似乎有一些不寻常的声音，仔细听听...', 4000);
      }
      return;
    }

    // 解锁继续按钮
    this.continueBtnZone.setVisible(true);
    this.continueBtnZone.setInteractive({ useHandCursor: true });
    this.continueBtnGlow.setAlpha(0.4);
    this.continueBtnLabel.setAlpha(0.6);

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
      case 'clue':
        if (cfg.narrativeText) {
          this.showDialogue(cfg.narrativeText, 3000);
        }
        if (cfg.revealsCollectible) {
          this.time.delayedCall(3200, () => {
            this.revealCollectible(cfg.revealsCollectible!);
          });
        }
        break;
    }
  }

  /** 展示选择界面 */
  private showChoice(cfg: HotspotConfig) {
    const choices = cfg.choices!;

    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.6)
      .setInteractive()
      .setDepth(10);

    const prompt = this.add.text(640, 260, cfg.narrativeText || '做出你的选择：', {
      fontSize: '24px', color: '#ffffff', fontFamily: 'serif',
      align: 'center', wordWrap: { width: 800 },
    }).setOrigin(0.5).setDepth(11);

    const buttons: Phaser.GameObjects.Container[] = [];
    const startY = 340;
    const spacing = 90;

    choices.forEach((choice, i) => {
      const y = startY + i * spacing;

      const bg = this.add.rectangle(0, 0, 500, 60, 0x003366, 0.9)
        .setStrokeStyle(2, 0x88ccff, 0.8);

      const txt = this.add.text(0, 0, choice.text, {
        fontSize: '22px', color: '#ffffff', fontFamily: 'serif',
        align: 'center', wordWrap: { width: 460 },
      }).setOrigin(0.5);

      const container = this.add.container(640, y, [bg, txt])
        .setSize(500, 60)
        .setInteractive({ useHandCursor: true })
        .setDepth(11);

      container.on('pointerover', () => bg.setFillStyle(0x005599, 1));
      container.on('pointerout', () => bg.setFillStyle(0x003366, 0.9));

      container.on('pointerdown', () => {
        useGameStore.getState().makeChoice(cfg.id, choice.id);

        overlay.destroy();
        prompt.destroy();
        buttons.forEach(b => b.destroy(true));

        if (choice.resultText) {
          this.showDialogue(choice.resultText, 3000);
        }

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

    store.unlock(cfg.collectibleId);
    this.collectedThisChapter = true;

    const particle = this.add.circle(cfg.x, cfg.y, 6, 0xffd700);
    this.tweens.add({
      targets: particle,
      x: 1200, y: 60, alpha: 0, scale: 0.3,
      duration: 800, ease: 'Power2',
      onComplete: () => particle.destroy(),
    });

    this.showDialogue(`📖 发现：${item.name}`, 2500);

    this.checkContinueUnlock();
  }

  protected abstract onInteraction(target: string): void;

  /** 子类可覆写：每步叙事推进时的回调（用于序章分镜切换等） */
  protected onStoryStep(idx: number): void {
    // 默认不做任何事
  }

  /** 展示叙事序列（逐句点击推进，使用底部对话栏） */
  protected showStorySequence(lines: string[], onComplete: () => void, speaker?: string) {
    let idx = 0;
    const advance = () => {
      if (idx >= lines.length) {
        this.dialogueBar.hide();
        onComplete();
        return;
      }
      this.dialogueBar.show(lines[idx], speaker, { current: idx + 1, total: lines.length });
      idx++;
      this.dialogueBar.onNext(() => {
        if (idx < lines.length) this.onStoryStep(idx);
        advance();
      });
    };
    advance();
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
