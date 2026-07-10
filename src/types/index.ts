// 游戏配置相关类型
export interface ChapterConfig {
  id: string;
  title: string;
  theme: string;
  colorPalette: string[];
  duration: number;
  collectible?: CollectibleConfig;
}

export interface SceneConfig {
  id: string;
  type: 'narrative' | 'interaction' | 'dialogue' | 'transition';
  text?: string;
  duration?: number;
  interactionType?: 'click' | 'hover' | 'drag';
  target?: string;
  next?: string;
  audio?: string;
}

export interface CollectibleConfig {
  id: string;
  name: string;
  description: string;
  chapterId: string;
  imageUrl: string;
}

// 音频相关类型
export interface AudioConfig {
  key: string;
  url: string;
  loop?: boolean;
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
}

// 存档相关类型
export interface SaveData {
  currentChapter: string;
  progress: Record<string, boolean>;
  collectibles: string[];
  settings: GameSettings;
  saveVersion?: string;
}

export interface GameSettings {
  volume: number;
  subtitles: boolean;
}

// Phaser 场景相关
export interface SceneData {
  chapterId: string;
  backgroundUrl?: string;
  audioKeys?: string[];
  interactions?: InteractionPoint[];
}

export interface InteractionPoint {
  id: string;
  type: 'dialogue' | 'collectible' | 'transition';
  target: string; // 游戏对象名称或区域
  dialogue?: string;
  collectibleId?: string;
  nextScene?: string;
  position?: { x: number; y: number };
  width?: number;
  height?: number;
}

// 事件相关
export interface DialogueEvent {
  type: 'dialogue';
  text: string;
  duration?: number;
}

export interface CollectEvent {
  type: 'collectible';
  collectibleId: string;
  item: CollectibleConfig;
}

export interface TransitionEvent {
  type: 'transition';
  from: string;
  to: string;
}

export type GameEvent = DialogueEvent | CollectEvent | TransitionEvent;

// 热区交互
export interface HotspotConfig {
  id: string;
  x: number; y: number;
  width: number; height: number;
  type: 'collectible' | 'observation' | 'dialogue';
  label?: string;
  collectibleId?: string;
  narrativeText?: string;
  /** 交互一次后是否消失 */
  oneShot?: boolean;
}

export interface CollectibleItem {
  id: string;
  name: string;
  description: string;
  chapterId: string;
  imageUrl: string;
}
