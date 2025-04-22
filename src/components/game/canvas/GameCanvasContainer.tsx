
import { useRef, memo } from "react";
import { GameTimer } from "./GameTimer";
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

const GameCanvasContainer = memo(({ roomData, currentUserId, gameStatus }: GameCanvasContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const handle = useFullScreenHandle();
  const isMobile = useIsMobile();

  return (
    <FullScreen handle={handle}>
      <div 
        id="game-canvas-container" 
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
