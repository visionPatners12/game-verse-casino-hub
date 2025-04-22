
import { useRef, memo, useEffect } from "react";
import { GameCanvasContent } from "./GameCanvasContent";
import { LudoGameScripts } from "./LudoGameScripts";
import { RoomData } from "../types";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useIsMobile } from "@/hooks/use-mobile";

interface GameCanvasContainerProps {
  roomData: RoomData;
  currentUserId: string | null;
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
}

// Add global window interface for game functions
declare global {
  interface Window {
    $: any;
    jQuery: any;
    gameInitialized?: boolean;
    initGameCanvas?: (width: number, height: number) => void;
    buildGameCanvas?: () => void;
    removeGameCanvas?: () => void;
    resizeGameFunc?: () => void;
  }
}

const GameCanvasContainer = memo(({ roomData, currentUserId, gameStatus }: GameCanvasContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const handle = useFullScreenHandle();
  const isMobile = useIsMobile();

  // Clear game state when component unmounts
  useEffect(() => {
    return () => {
      // Ensure game is properly cleaned up when the component unmounts
      if (window.gameInitialized && typeof window.removeGameCanvas === 'function') {
        console.log("GameCanvasContainer unmounting, cleaning up game canvas");
        window.removeGameCanvas();
        window.gameInitialized = false;
      }
    };
  }, []);

  return (
    <FullScreen handle={handle}>
      <div 
        id="game-container" 
        ref={containerRef}
        className={`relative bg-accent/10 rounded-lg overflow-hidden w-full ${
          isMobile ? 'aspect-[4/3]' : 'aspect-video'
        }`}
      >
        <LudoGameScripts />

        <GameCanvasContent 
          roomData={roomData}
          currentUserId={currentUserId}
          gameStatus={gameStatus}
        />
      </div>
    </FullScreen>
  );
});

GameCanvasContainer.displayName = 'GameCanvasContainer';

export default GameCanvasContainer;
export { useFullScreenHandle };
