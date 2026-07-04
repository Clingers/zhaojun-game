import Phaser from 'phaser';
import { AudioManager } from '../core/AudioManager';
import BaseScene from './BaseScene';
import type { DialogueEvent, CollectEvent, TransitionEvent } from '../types';

// 场景工厂类型
type SceneFactory = (audioManager: AudioManager) => Phaser.Scene;

export class SceneManager {
  private audioManager: AudioManager;
  private sceneFactories: SceneFactory[];

  constructor(audioManager: AudioManager) {
    this.audioManager = audioManager;
    this.sceneFactories = [
      (am) => new PrologueScene(am),
      (am) => new Chapter01Scene(am),
      (am) => new Chapter02Scene(am),
      (am) => new Chapter03Scene(am),
      (am) => new Chapter04Scene(am),
      (am) => new Chapter05Scene(am),
      (am) => new Chapter06Scene(am),
      (am) => new Chapter07Scene(am),
      (am) => new Chapter08Scene(am),
      (am) => new Chapter09Scene(am),
      (am) => new Chapter10Scene(am),
    ];
  }

  getScenes(): Phaser.Scene[] {
    return this.sceneFactories.map((factory) => factory(this.audioManager));
  }

  getScene(key: string): Phaser.Scene | undefined {
    const sceneMap: Record<string, SceneFactory> = {
      prologue: (am) => new PrologueScene(am),
      chapter01: (am) => new Chapter01Scene(am),
      chapter02: (am) => new Chapter02Scene(am),
      chapter03: (am) => new Chapter03Scene(am),
      chapter04: (am) => new Chapter04Scene(am),
      chapter05: (am) => new Chapter05Scene(am),
      chapter06: (am) => new Chapter06Scene(am),
      chapter07: (am) => new Chapter07Scene(am),
      chapter08: (am) => new Chapter08Scene(am),
      chapter09: (am) => new Chapter09Scene(am),
      chapter10: (am) => new Chapter10Scene(am),
    };

    const factory = sceneMap[key];
    if (factory) {
      return factory(this.audioManager);
    }
    return undefined;
  }
}
