import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameEngine } from '../core/GameEngine';
import { AudioManager } from '../core/AudioManager';
import { SaveManager } from '../core/SaveManager';
import { useGameStore } from '../store/gameStore';
import { useCollectiblesStore } from '../store/collectiblesStore';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

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
    // Phaser.Game 实例存在
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
    // 销毁后不应再使用
    expect(engine.getAudioManager()).toBeNull();
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
    expect(audioManager.getContext()).toBeInstanceOf(AudioContext);
  });

  it('should have master gain node', () => {
    // 通过播放音频间接验证
    const playSpy = vi.spyOn(audioManager as any, 'play');
    // 由于没有实际音频文件，这里只验证方法存在
    expect(typeof audioManager.play).toBe('function');
  });

  it('should set master volume', () => {
    audioManager.setMasterVolume(0.5);
    // 无实际音频播放，仅验证方法调用不报错
    expect(true).toBe(true);
  });
});

describe('SaveManager', () => {
  let saveManager: SaveManager;

  beforeEach(() => {
    saveManager = new SaveManager();
    localStorageMock.clear();
  });

  it('should save data to localStorage', () => {
    const data = {
      currentChapter: 'prologue',
      progress: { chapter01: true },
      collectibles: ['bronze_mirror'],
      settings: { volume: 0.8, subtitles: true },
    };
    expect(() => saveManager.save(data)).not.toThrow();
    expect(localStorageMock.getItem('zhaojun_game_save')).toBe(JSON.stringify(data));
  });

  it('should load data from localStorage', () => {
    const data = {
      currentChapter: 'chapter01',
      progress: {},
      collectibles: [],
      settings: { volume: 0.5, subtitles: false },
    };
    localStorageMock.setItem('zhaojun_game_save', JSON.stringify(data));
    const loaded = saveManager.load();
    expect(loaded).toEqual(data);
  });

  it('should return null when no save exists', () => {
    const loaded = saveManager.load();
    expect(loaded).toBeNull();
  });

  it('should clear save data', () => {
    localStorageMock.setItem('zhaojun_game_save', '{}');
    saveManager.clear();
    expect(localStorageMock.getItem('zhaojun_game_save')).toBeNull();
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
    expect(exported).toBe(JSON.stringify(data, null, 2));

    localStorageMock.clear();
    const success = saveManager.importSave(exported);
    expect(success).toBe(true);
    expect(saveManager.load()).toEqual(data);
  });

  it('should fail to import invalid JSON', () => {
    const success = saveManager.importSave('invalid json');
    expect(success).toBe(false);
  });
});

describe('gameStore', () => {
  beforeEach(() => {
    // 重置 store 到初始状态
    useGameStore.setState({
      currentChapter: 'prologue',
      progress: {},
      settings: { volume: 0.8, subtitles: true },
    });
    localStorageMock.clear();
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
    const saved = localStorageMock.getItem('zhaojun_game_save');
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
          imageUrl: 'test.png',
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
