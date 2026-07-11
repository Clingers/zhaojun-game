import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameSettings {
  volume: number;
  subtitles: boolean;
}

interface GameState {
  currentChapter: string;
  progress: Record<string, boolean>;
  /** 玩家关键选择记录: hotspotId -> optionId */
  choices: Record<string, string>;
  settings: GameSettings;
  setChapter: (chapterId: string) => void;
  completeChapter: (chapterId: string) => void;
  makeChoice: (hotspotId: string, optionId: string) => void;
  getChoice: (hotspotId: string) => string | undefined;
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetProgress: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentChapter: 'prologue',
      choices: {},
      progress: {},
      settings: {
        volume: 0.8,
        subtitles: true,
      },
      setChapter: (chapterId) => set({ currentChapter: chapterId }),
      completeChapter: (chapterId) =>
        set((state) => ({
          progress: { ...state.progress, [chapterId]: true },
        })),
      makeChoice: (hotspotId, optionId) =>
        set((state) => ({
          choices: { ...state.choices, [hotspotId]: optionId },
        })),
      getChoice: (hotspotId) => get().choices[hotspotId],
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetProgress: () => set({ progress: {} }),
    }),
    {
      name: 'zhaojun_game_save',
      partialize: (state) => ({
        progress: state.progress,
        settings: state.settings,
      }),
    }
  )
);
