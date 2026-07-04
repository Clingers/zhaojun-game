import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameSettings {
  volume: number;
  subtitles: boolean;
}

interface GameState {
  currentChapter: string;
  progress: Record<string, boolean>;
  settings: GameSettings;
  setChapter: (chapterId: string) => void;
  completeChapter: (chapterId: string) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetProgress: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentChapter: 'prologue',
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
