import { useGameStore } from '../store/gameStore';
import { useCollectiblesStore } from '../store/collectiblesStore';
import { useState } from 'react';
import TravelAlbum from './TravelAlbum';

interface HUDProps {
  className?: string;
}

export default function HUD({ className = '' }: HUDProps) {
  const { currentChapter, progress, resetProgress } = useGameStore();
  const { unlocked, getProgress } = useCollectiblesStore();
  const [showAlbum, setShowAlbum] = useState(false);

  const chapterNames: Record<string, string> = {
    prologue: '序章：一只大雁',
    chapter01: '第一章：长安',
    chapter02: '第二章：渭水',
    chapter03: '第三章：秦岭',
    chapter04: '第四章：黄河',
    chapter05: '第五章：雁门关',
    chapter06: '第六章：草原',
    chapter07: '第七章：暴风雪',
    chapter08: '第八章：篝火',
    chapter09: '第九章：王庭',
    chapter10: '终章：二十年后',
  };

  return (
    <div className={`hud-overlay w-full h-full ${className}`}>
      {/* 顶部信息栏 */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg">
          <h1 className="text-white text-lg font-serif tracking-wider">昭君：一路向北</h1>
          <p className="text-[#D4A54A] text-sm font-serif mt-1">
            {chapterNames[currentChapter] || currentChapter}
          </p>
        </div>

        {/* 旅程进度 */}
        <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-white text-sm">📖</span>
            <span className="text-white/80 text-sm">
              {Object.keys(progress).length}/10
            </span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-1">
            <span className="text-white text-sm">✨</span>
            <span className="text-white/80 text-sm">
              {unlocked.length}/8
            </span>
          </div>
        </div>
      </div>

      {/* 左下角提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <p className="text-white/40 text-sm font-serif tracking-wider animate-pulse">
          ◇ 点击屏幕继续 ◇
        </p>
      </div>

      {/* 右下角收集品入口 */}
      <div className="absolute bottom-4 right-4 z-20">
        <button
          onClick={() => setShowAlbum(true)}
          className="bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg text-white/70 text-sm
                     hover:bg-black/60 hover:text-white transition-all duration-300 font-serif"
        >
          ✨ 旅行册 ({getProgress()}%)
        </button>
      </div>

      {/* 右上角设置 */}
      <div className="absolute top-4 right-36 z-20">
        <button
          onClick={() => {
            if (confirm('确定要重置所有进度吗？')) {
              resetProgress();
              localStorage.removeItem('zhaojun_game_save');
              window.location.reload();
            }
          }}
          className="bg-black/30 hover:bg-black/50 backdrop-blur-sm px-2 py-1 rounded
                     text-white/40 hover:text-white/70 text-xs transition-all duration-300"
        >
          ⚙
        </button>
      </div>

      {/* 旅行册弹窗 */}
      {showAlbum && <TravelAlbum onClose={() => setShowAlbum(false)} />}
    </div>
  );
}