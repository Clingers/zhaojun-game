const SAVE_KEY = 'zhaojun_game_save';
const SAVE_VERSION = '1.0';

interface SaveData {
  saveVersion: string;
  currentChapter: string;
  progress: Record<string, boolean>;
  collectibles: string[];
  settings: {
    volume: number;
    subtitles: boolean;
  };
}

export class SaveManager {
  private storage: Storage;

  constructor() {
    this.storage = localStorage;
  }

  save(data: Omit<SaveData, 'saveVersion'>): void {
    try {
      const saveData: SaveData = {
        ...data,
        saveVersion: SAVE_VERSION,
      };
      this.storage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }

  load(): SaveData | null {
    try {
      const saved = this.storage.getItem(SAVE_KEY);
      if (saved) {
        const data = JSON.parse(saved) as SaveData;
        // 版本兼容性检查
        if (data.saveVersion !== SAVE_VERSION) {
          console.warn(`Save version mismatch: ${data.saveVersion} (current: ${SAVE_VERSION})`);
          // 可以选择返回 null 或尝试转换旧版本数据
          // 这里选择返回 null 强制重新开始
          return null;
        }
        return data;
      }
    } catch (error) {
      console.error('Failed to load save:', error);
    }
    return null;
  }

  clear(): void {
    this.storage.removeItem(SAVE_KEY);
  }

  exportSave(): string {
    const data = this.load();
    if (!data) return '';
    return JSON.stringify(data, null, 2);
  }

  importSave(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString) as SaveData;
      this.save(data);
      return true;
    } catch (error) {
      console.error('Failed to import save:', error);
      return false;
    }
  }

  getVersion(): string {
    return SAVE_VERSION;
  }
}
