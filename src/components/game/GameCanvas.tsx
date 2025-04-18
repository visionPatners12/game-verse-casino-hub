
import { useState, useRef } from "react";
import { RoomData } from "./types";

interface GameCanvasProps {
  roomData: RoomData;
  currentUserId: string | null;
}

const GameCanvas = ({ roomData, currentUserId }: GameCanvasProps) => {
  const [gameState, setGameState] = useState<'loading' | 'ready'>('loading');
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Extract game data from roomData
  const players = roomData?.game_players || [];
  const gameParameters = {
    gameType: roomData?.game_type,
    betAmount: roomData?.entry_fee,
    maxPlayers: roomData?.max_players,
    currentPlayers: roomData?.current_players,
    roomId: roomData?.room_id,
    totalPot: roomData ? roomData.entry_fee * roomData.current_players * (1 - roomData.commission_rate/100) : 0
  };

  return (
    <div className="game-container">
      <div className="bg-accent/10 rounded-lg border border-border aspect-video relative overflow-hidden">
        <div 
          ref={canvasRef} 
          id="game-canvas-container" 
          className="absolute inset-0 flex items-center justify-center"
        >
          {gameState === 'loading' && (
            <div className="text-center">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <h3 className="text-2xl font-bold mb-2">Loading Game</h3>
              <p className="text-muted-foreground">Preparing canvas...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCanvas;
