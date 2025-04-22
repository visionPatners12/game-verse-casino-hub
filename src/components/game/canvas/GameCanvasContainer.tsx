
import { useRef, memo } from "react";
import { GameTimer } from "./GameTimer";
import { GameCanvasContent } from "./GameCanvasContent";
import { LudoGameScripts } from "./LudoGameScripts";
import { RoomData } from "../types";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

interface GameCanvasContainerProps {
  roomData: RoomData;
  currentUserId: string | null;
}

const GameCanvasContainer = memo(({ roomData, currentUserId }: GameCanvasContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const handle = useFullScreenHandle();

  return (
    <FullScreen handle={handle}>
      <div 
        id="game-canvas-container" 
        ref={containerRef}
        className="relative bg-accent/10 rounded-lg overflow-hidden w-full aspect-video"
      >
        <LudoGameScripts />

        {roomData.game_type === "futarena" && roomData.match_duration && (
          <GameTimer matchDuration={roomData.match_duration} />
        )}

        <GameCanvasContent 
          roomData={roomData}
          currentUserId={currentUserId}
        />
      </div>
    </FullScreen>
  );
});

GameCanvasContainer.displayName = 'GameCanvasContainer';

export default GameCanvasContainer;
export { useFullScreenHandle };
