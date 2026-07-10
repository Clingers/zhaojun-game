import { useCollectiblesStore } from '../store/collectiblesStore';

interface TravelAlbumProps {
  onClose: () => void;
}

const collectibleIcons: Record<string, string> = {
  bronze_mirror: '🪞',
  wei_stone: '🪨',
  qin_forest_leaf: '🍂',
  yellow_river_sand: '🏜️',
  wild_goose_feather: '🪶',
  eagle_feather: '🕊️',
  snowflake: '❄️',
  campfire_charcoal: '🔥',
};

export default function TravelAlbum({ onClose }: TravelAlbumProps) {
  const { items, unlocked, getProgress } = useCollectiblesStore();
  const allItems = Object.values(items);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a2e] border border-[#D4A54A]/30 rounded-xl p-6 w-[520px] max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="text-[#D4A54A] text-2xl font-serif tracking-wider mb-1">
            📖 一路向北旅行册
          </h2>
          <p className="text-white/50 text-sm font-serif">
            在旅途中细心观察，收集一路上的记忆碎片
          </p>
          {/* 进度条 */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4A54A] to-[#f0c060] rounded-full transition-all duration-500"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
            <span className="text-white/70 text-sm font-mono">
              {unlocked.length}/{allItems.length}
            </span>
          </div>
        </div>

        {/* 收集品网格 */}
        <div className="grid grid-cols-2 gap-3">
          {allItems.map((item) => {
            const collected = unlocked.includes(item.id);
            return (
              <div
                key={item.id}
                className={`
                  relative rounded-lg p-3 border transition-all duration-300
                  ${collected
                    ? 'bg-white/5 border-[#D4A54A]/40 hover:bg-white/10'
                    : 'bg-white/[0.02] border-white/10 opacity-50'
                  }
                `}
              >
                {/* 图标 */}
                <div className="text-3xl text-center mb-2">
                  {collected
                    ? collectibleIcons[item.id] || '✨'
                    : '❓'
                  }
                </div>
                {/* 名称 */}
                <p className={`
                  text-sm font-serif text-center mb-1
                  ${collected ? 'text-white' : 'text-white/40'}
                `}>
                  {collected ? item.name : '???'}
                </p>
                {/* 描述 */}
                <p className={`
                  text-xs font-serif text-center leading-relaxed
                  ${collected ? 'text-white/60' : 'text-white/20'}
                `}>
                  {collected ? item.description : '尚未发现'}
                </p>
                {/* 已收集标记 */}
                {collected && (
                  <div className="absolute top-1 right-1 text-[10px] text-[#D4A54A]">
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-lg bg-[#D4A54A]/10 hover:bg-[#D4A54A]/20
                     text-[#D4A54A] font-serif transition-all duration-300 border border-[#D4A54A]/30"
        >
          合上旅行册
        </button>
      </div>
    </div>
  );
}