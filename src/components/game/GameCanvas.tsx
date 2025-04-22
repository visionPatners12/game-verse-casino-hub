
import { memo } from "react";
import { RoomData } from "./types";
import GameCanvasContainer from "./canvas/GameCanvasContainer";

interface GameCanvasProps {
  roomData: RoomData;
  currentUserId: string | null;
}

const GameCanvas = memo(({ roomData, currentUserId }: GameCanvasProps) => {
  return <GameCanvasContainer roomData={roomData} currentUserId={currentUserId} />;
});

// Ajouter un displayName pour faciliter le debugging
GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
