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
