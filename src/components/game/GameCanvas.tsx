
import { memo } from "react";
import { RoomData } from "./types";
import GameCanvasContainer from "./canvas/GameCanvasContainer";

interface GameCanvasProps {
  roomData: RoomData;
  currentUserId: string | null;
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
}

const GameCanvas = memo(({ roomData, currentUserId, gameStatus }: GameCanvasProps) => {
  return <GameCanvasContainer roomData={roomData} currentUserId={currentUserId} gameStatus={gameStatus} />;
});

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
