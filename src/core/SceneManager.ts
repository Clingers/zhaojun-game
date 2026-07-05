import Phaser from 'phaser';
import { AudioManager } from './AudioManager';
import PrologueScene from '../scenes/PrologueScene';
import Chapter01Scene from '../scenes/Chapter01Scene';
import Chapter02Scene from '../scenes/Chapter02Scene';
import Chapter03Scene from '../scenes/Chapter03Scene';
import Chapter04Scene from '../scenes/Chapter04Scene';
import Chapter05Scene from '../scenes/Chapter05Scene';
import Chapter06Scene from '../scenes/Chapter06Scene';
import Chapter07Scene from '../scenes/Chapter07Scene';
import Chapter08Scene from '../scenes/Chapter08Scene';
import Chapter09Scene from '../scenes/Chapter09Scene';
import Chapter10Scene from '../scenes/Chapter10Scene';

export class SceneManager {
  private audioManager: AudioManager;
  private sceneFactories: ((am: AudioManager) => Phaser.Scene)[];

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
    const sceneMap: Record<string, (am: AudioManager) => Phaser.Scene> = {
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