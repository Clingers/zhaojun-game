import { create } from 'zustand';

export interface Collectible {
  id: string;
  name: string;
  description: string;
  chapterId: string;
  imageUrl: string;
  unlocked: boolean;
}

interface CollectiblesState {
  items: Record<string, Collectible>;
  unlocked: string[];
  unlock: (id: string) => void;
  isUnlocked: (id: string) => boolean;
  getProgress: () => number;
  getChapterCollectibles: (chapterId: string) => Collectible[];
}

export const useCollectiblesStore = create<CollectiblesState>((set, get) => ({
  items: {
    bronze_mirror: {
      id: 'bronze_mirror',
      name: '铜镜碎片',
      description: '一面被擦拭得很干净的铜镜，镜面已有划痕。',
      chapterId: 'chapter01',
      imageUrl: '/assets/images/collectibles/bronze_mirror.jpeg',
      unlocked: false,
    },
    wei_stone: {
      id: 'wei_stone',
      name: '圆润的石头',
      description: '被渭河水冲刷得很圆的石头，带着故乡的记忆。',
      chapterId: 'chapter02',
      imageUrl: '/assets/images/collectibles/wei_stone.jpeg',
      unlocked: false,
    },
    qin_forest_leaf: {
      id: 'qin_forest_leaf',
      name: '一片山树叶',
      description: '秦岭雨夜中飘落的树叶，叶脉在火光中清晰可见。',
      chapterId: 'chapter03',
      imageUrl: '/assets/images/collectibles/forest_leaf.jpeg',
      unlocked: false,
    },
    yellow_river_sand: {
      id: 'yellow_river_sand',
      name: '黄河砂',
      description: '黄河河滩上被水冲圆的石头，沾着泥沙。',
      chapterId: 'chapter04',
      imageUrl: '/assets/images/collectibles/yellow_river_sand.jpeg',
      unlocked: false,
    },
    wild_goose_feather: {
      id: 'wild_goose_feather',
      name: '雁羽',
      description: '从大雁身上飘落的羽毛，她接住了它。',
      chapterId: 'chapter05',
      imageUrl: '/assets/images/collectibles/goose_feather.jpeg',
      unlocked: false,
    },
    eagle_feather: {
      id: 'eagle_feather',
      name: '白鹰羽',
      description: '草原雄鹰的羽毛，白色，很软，很轻。',
      chapterId: 'chapter06',
      imageUrl: '/assets/images/collectibles/eagle_feather.jpeg',
      unlocked: false,
    },
    snowflake: {
      id: 'snowflake',
      name: '雪花',
      description: '漠北的雪花，在她掌心融化。',
      chapterId: 'chapter07',
      imageUrl: '/assets/images/collectibles/snowflake.jpeg',
      unlocked: false,
    },
    campfire_charcoal: {
      id: 'campfire_charcoal',
      name: '篝火炭',
      description: '火堆里掉下的烧过的炭，暗红色，带着余温。',
      chapterId: 'chapter08',
      imageUrl: '/assets/images/collectibles/campfire_charcoal.jpeg',
      unlocked: false,
    },
  },
  unlocked: [],
  unlock: (id) => {
    const item = get().items[id];
    if (item && !get().unlocked.includes(id)) {
      set((state) => ({
        items: {
          ...state.items,
          [id]: { ...item, unlocked: true },
        },
        unlocked: [...state.unlocked, id],
      }));
      // 触发收集事件
      window.dispatchEvent(
        new CustomEvent('collectible:unlocked', { detail: item })
      );
    }
  },
  isUnlocked: (id) => get().unlocked.includes(id),
  getProgress: () => {
    const total = Object.keys(get().items).length;
    const collected = get().unlocked.length;
    return Math.round((collected / total) * 100);
  },
  getChapterCollectibles: (chapterId) => {
    return Object.values(get().items).filter(
      (item) => item.chapterId === chapterId
    );
  },
}));
