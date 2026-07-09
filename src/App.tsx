import { useEffect, useRef } from 'react';
import { GameEngine } from './core/GameEngine';
import HUD from './components/HUD';

export default function App() {
  const phaserContainerRef = useRef<HTMLDivElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (phaserContainerRef.current) {
      gameEngineRef.current = new GameEngine();
      gameEngineRef.current.init(phaserContainerRef.current);
      // 注册最基本的事件回调，让场景可以切换章节
      gameEngineRef.current.setEventHandlers(
        // 对话回调（此项目暂未使用）
        () => {},
        // 收集回调（此项目暂未使用）
        () => {},
        // 章节切换回调：直接调用 GameEngine.transitionTo
        (event) => {
          if (event && event.type === 'transition') {
            gameEngineRef.current?.transitionTo(event.to);
          }
        }
      );
    }

    return () => {
      gameEngineRef.current?.destroy();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Phaser 游戏画布容器 */}
      <div
        id="game-container"
        ref={phaserContainerRef}
        className="absolute inset-0 z-1"
      />

      {/* React HUD 覆盖层 */}
      <HUD className="absolute inset-0 z-10 pointer-events-none" />
    </div>
  );
}
