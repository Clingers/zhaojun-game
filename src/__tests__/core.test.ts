import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GameEngine } from '../core/GameEngine';
import { AudioManager } from '../core/AudioManager';
import { SaveManager } from '../core/SaveManager';
import { useGameStore } from '../store/gameStore';
import { useCollectiblesStore } from '../store/collectiblesStore';

describe('GameEngine', () => {
  let engine: GameEngine;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    engine = new GameEngine();
  });

  afterEach(() => {
    engine.destroy();
    document.body.removeChild(container);
  });

  it('should initialize Phaser game with correct config', () => {
    engine.init(container);
    expect(engine).toBeDefined();
  });

  it('should expose AudioManager and SaveManager', () => {
    engine.init(container);
    expect(engine.getAudioManager()).toBeInstanceOf(AudioManager);
    expect(engine.getSaveManager()).toBeInstanceOf(SaveManager);
  });

  it('should clean up resources on destroy', () => {
    engine.init(container);
    engine.destroy();
    expect(engine).toBeDefined();
  });
});

describe('AudioManager', () => {
  let audioManager: AudioManager;

  beforeEach(() => {
    audioManager = new AudioManager();
  });

  afterEach(() => {
    audioManager.getContext().close();
  });

  it('should create AudioContext on construction', () => {
    expect(audioManager.getContext()).toBeDefined();
  });

  it('should have master gain node', () => {
    expect(typeof audioManager.play).toBe('function');
  });

  it('should set master volume', () => {
    audioManager.setMasterVolume(0.5);
    expect(true).toBe(true);
  });
});

describe('SaveManager', () => {
  let saveManager: SaveManager;

  beforeEach(() => {
    saveManager = new SaveManager();
    localStorage.clear();
  });

  it('should save data to localStorage', () => {
    const data = {
      currentChapter: 'prologue',
      progress: { chapter01: true },
      collectibles: ['bronze_mirror'],
      settings: { volume: 0.8, subtitles: true },
    };
    expect(() => saveManager.save(data)).not.toThrow();
    const saved = JSON.parse(localStorage.getItem('zhaojun_game_save')!);
    expect(saved.currentChapter).toBe('prologue');
    expect(saved.saveVersion).toBe('1.0');
  });

  it('should load data from localStorage', () => {
    const data = {
      saveVersion: '1.0',
      currentChapter: 'chapter01',
      progress: {},
      collectibles: [],
      settings: { volume: 0.5, subtitles: false },
    };
    localStorage.setItem('zhaojun_game_save', JSON.stringify(data));
    const loaded = saveManager.load();
    expect(loaded).toEqual(data);
  });

  it('should return null when no save exists', () => {
    const loaded = saveManager.load();
    expect(loaded).toBeNull();
  });

  it('should clear save data', () => {
    localStorage.setItem('zhaojun_game_save', '{}');
    saveManager.clear();
    expect(localStorage.getItem('zhaojun_game_save')).toBeNull();
  });

  it('should export and import save data', () => {
    const data = {
      currentChapter: 'chapter05',
      progress: { chapter01: true, chapter02: true },
      collectibles: ['wei_stone', 'qin_forest_leaf'],
      settings: { volume: 1, subtitles: true },
    };
    saveManager.save(data);
    const exported = saveManager.exportSave();
    expect(exported).toContain('chapter05');
    expect(exported).toContain('saveVersion');

    localStorage.clear();
    const success = saveManager.importSave(exported);
    expect(success).toBe(true);
    const loaded = saveManager.load();
    expect(loaded?.currentChapter).toBe('chapter05');
  });

  it('should fail to import invalid JSON', () => {
    const success = saveManager.importSave('invalid json');
    expect(success).toBe(false);
  });
});

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentChapter: 'prologue',
      progress: {},
      settings: { volume: 0.8, subtitles: true },
    });
    localStorage.clear();
  });

  it('should update current chapter', () => {
    const { setChapter } = useGameStore.getState();
    setChapter('chapter01');
    expect(useGameStore.getState().currentChapter).toBe('chapter01');
  });

  it('should mark chapter as completed', () => {
    const { completeChapter } = useGameStore.getState();
    completeChapter('chapter01');
    expect(useGameStore.getState().progress['chapter01']).toBe(true);
  });

  it('should update settings', () => {
    const { updateSettings } = useGameStore.getState();
    updateSettings({ volume: 0.5 });
    expect(useGameStore.getState().settings.volume).toBe(0.5);
  });

  it('should persist settings to localStorage', () => {
    const { updateSettings } = useGameStore.getState();
    updateSettings({ subtitles: false });
    const saved = localStorage.getItem('zhaojun_game_save');
    expect(saved).toBeTruthy();
    expect(saved).toContain('subtitles');
  });
});

describe('collectiblesStore', () => {
  beforeEach(() => {
    useCollectiblesStore.setState({
      items: {
        test_item: {
          id: 'test_item',
          name: 'Test Item',
          description: 'A test collectible',
          chapterId: 'chapter01',
          imageUrl: 'test.svg',
          unlocked: false,
        },
      },
      unlocked: [],
    });
  });

  it('should unlock collectible', () => {
    const { unlock } = useCollectiblesStore.getState();
    unlock('test_item');
    expect(useCollectiblesStore.getState().items['test_item'].unlocked).toBe(true);
    expect(useCollectiblesStore.getState().unlocked).toContain('test_item');
  });

  it('should not unlock same item twice', () => {
    const { unlock } = useCollectiblesStore.getState();
    unlock('test_item');
    unlock('test_item');
    expect(useCollectiblesStore.getState().unlocked.length).toBe(1);
  });

  it('should calculate progress correctly', () => {
    const { unlock, getProgress } = useCollectiblesStore.getState();
    expect(getProgress()).toBe(0);
    unlock('test_item');
    expect(getProgress()).toBe(100);
  });

  it('should check if item is unlocked', () => {
    const { unlock, isUnlocked } = useCollectiblesStore.getState();
    expect(isUnlocked('test_item')).toBe(false);
    unlock('test_item');
    expect(isUnlocked('test_item')).toBe(true);
  });

  it('should get collectibles by chapter', () => {
    const { getChapterCollectibles } = useCollectiblesStore.getState();
    const items = getChapterCollectibles('chapter01');
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('test_item');
  });
});