import Phaser from 'phaser';
import { AudioManager } from '../core/AudioManager';
import type { DialogueEvent, CollectEvent, TransitionEvent } from '../types';

// 场景工厂类型
type SceneFactory = (audioManager: AudioManager) => Phaser.Scene;

export class SceneManager {
  private audioManager: AudioManager;
  private sceneFactories: SceneFactory[];

  constructor(audioManager: AudioManager) {
    this.audioManager = audioManager;
    this.sceneFactories = [
      // TODO: 导入并实例化各个场景
      // 当前为占位，待 HUD 和场景类完善后启用
      (am) => new Phaser.Scene({ key: 'prologue' }),
      (am) => new Phaser.Scene({ key: 'chapter01' }),
      (am) => new Phaser.Scene({ key: 'chapter02' }),
      (am) => new Phaser.Scene({ key: 'chapter03' }),
      (am) => new Phaser.Scene({ key: 'chapter04' }),
      (am) => new Phaser.Scene({ key: 'chapter05' }),
      (am) => new Phaser.Scene({ key: 'chapter06' }),
      (am) => new Phaser.Scene({ key: 'chapter07' }),
      (am) => new Phaser.Scene({ key: 'chapter08' }),
      (am) => new Phaser.Scene({ key: 'chapter09' }),
      (am) => new Phaser.Scene({ key: 'chapter10' }),
    ];
  }

  getScenes(): Phaser.Scene[] {
    return this.sceneFactories.map((factory) => factory(this.audioManager));
  }

  getScene(key: string): Phaser.Scene | undefined {
    const sceneMap: Record<string, SceneFactory> = {
      prologue: (am) => new Phaser.Scene({ key: 'prologue' }),
      chapter01: (am) => new Phaser.Scene({ key: 'chapter01' }),
      chapter02: (am) => new Phaser.Scene({ key: 'chapter02' }),
      chapter03: (am) => new Phaser.Scene({ key: 'chapter03' }),
      chapter04: (am) => new Phaser.Scene({ key: 'chapter04' }),
      chapter05: (am) => new Phaser.Scene({ key: 'chapter05' }),
      chapter06: (am) => new Phaser.Scene({ key: 'chapter06' }),
      chapter07: (am) => new Phaser.Scene({ key: 'chapter07' }),
      chapter08: (am) => new Phaser.Scene({ key: 'chapter08' }),
      chapter09: (am) => new Phaser.Scene({ key: 'chapter09' }),
      chapter10: (am) => new Phaser.Scene({ key: 'chapter10' }),
    };

    const factory = sceneMap[key];
    if (factory) {
      return factory(this.audioManager);
    }
    return undefined;
  }
}
