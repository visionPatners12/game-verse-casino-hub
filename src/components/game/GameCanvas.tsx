
import { RoomData } from "./types";
import GameCanvasContainer from "./canvas/GameCanvasContainer";

interface GameCanvasProps {
  roomData: RoomData;
  currentUserId: string | null;
}

const GameCanvas = ({ roomData, currentUserId }: GameCanvasProps) => {
  return <GameCanvasContainer roomData={roomData} currentUserId={currentUserId} />;
};

export default GameCanvas;
