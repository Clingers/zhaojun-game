import Phaser from 'phaser';
import { SceneManager } from './SceneManager';
import { AudioManager } from './AudioManager';
import { SaveManager } from './SaveManager';
import { DialogueEvent, CollectEvent, TransitionEvent } from '../types';

export class GameEngine {
  private phaserGame: Phaser.Game | null = null;
  private audioManager: AudioManager;
  private saveManager: SaveManager;
  private sceneManager: SceneManager;

  // 事件处理器（static 以便场景在初始化后自行获取）
  static pendingOnDialogue?: (event: DialogueEvent) => void;
  static pendingOnCollect?: (event: CollectEvent) => void;
  static pendingOnTransition?: (event: TransitionEvent) => void;

  private onDialogue?: (event: DialogueEvent) => void;
  private onCollect?: (event: CollectEvent) => void;
  private onTransition?: (event: TransitionEvent) => void;

  constructor() {
    this.audioManager = new AudioManager();
    this.saveManager = new SaveManager();
    this.sceneManager = new SceneManager(this.audioManager);
  }

  init(container: HTMLElement) {
    // 注册全局引用（可选，用于调试）
    (window as any).gameEngine = this;

    this.phaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      parent: container,
      backgroundColor: '#000000',
      scene: this.sceneManager.getScenes(),
      physics: {
        default: 'arcade',
        arcade: { debug: false },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      loader: {
        baseURL: '/',
      },
    });
  }

  // 设置事件处理器（由 React 调用）
  setEventHandlers(
    onDialogue: (event: DialogueEvent) => void,
    onCollect: (event: CollectEvent) => void,
    onTransition: (event: TransitionEvent) => void
  ) {
    this.onDialogue = onDialogue;
    this.onCollect = onCollect;
    this.onTransition = onTransition;

    // 同时存储为 static，供后续初始化的场景自己拉取
    GameEngine.pendingOnDialogue = onDialogue;
    GameEngine.pendingOnCollect = onCollect;
    GameEngine.pendingOnTransition = onTransition;

    // 注入到所有已有场景
    if (this.phaserGame) {
      const allScenes = this.phaserGame.scene.getScenes(true);
      allScenes.forEach((scene) => {
        if (scene && 'setEventHandlers' in scene) {
          (scene as any).setEventHandlers(onDialogue, onCollect, onTransition);
        }
      });
    }
  }

  transitionTo(sceneKey: string, data?: any) {
    if (this.phaserGame) {
      // 停止所有当前场景，启动目标场景
      const currentScenes = this.phaserGame.scene.getScenes(true);
      currentScenes.forEach((s) => {
        if (s.scene.key !== sceneKey) {
          this.phaserGame!.scene.stop(s.scene.key);
        }
      });
      this.phaserGame.scene.start(sceneKey, data);
    }
  }

  getAudioManager(): AudioManager {
    return this.audioManager;
  }

  getSaveManager(): SaveManager {
    return this.saveManager;
  }

  destroy() {
    if (this.phaserGame) {
      this.phaserGame.destroy(true);
      this.phaserGame = null;
    }
    delete (window as any).gameEngine;
  }
}
