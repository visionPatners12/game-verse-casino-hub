
import { useState, useEffect } from "react";
import { RoomData } from "./types";

interface GameCanvasProps {
  roomData: RoomData;
  currentUserId: string | null;
}

const GameCanvas = ({ roomData, currentUserId }: GameCanvasProps) => {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const players = roomData?.game_players || [];
  const gameParameters = {
    gameType: roomData?.game_type,
    betAmount: roomData?.entry_fee,
    maxPlayers: roomData?.max_players,
    currentPlayers: roomData?.current_players,
    roomId: roomData?.room_id,
    totalPot: roomData ? roomData.entry_fee * roomData.current_players * (1 - roomData.commission_rate/100) : 0
  };

  useEffect(() => {
    // Check if we have enough players to start the game
    if (players.length >= 2) {
      setGameState('playing');
    } else {
      setGameState('waiting');
    }
  }, [players.length]);

  // Determine if current user is in the game
  const currentPlayerInfo = players.find(player => player.user_id === currentUserId);
  const isPlayerInGame = !!currentPlayerInfo;

  return (
    <div className="game-container">
      <div className="bg-accent/10 rounded-lg border border-border aspect-video relative overflow-hidden">
        {gameState === 'waiting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Waiting for Players</h3>
              <p className="text-muted-foreground">Need at least 2 players to start</p>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Game Area</h3>
              <p className="text-muted-foreground">Ici vous pouvez ajouter votre propre implémentation du jeu</p>
              <pre className="mt-4 p-3 bg-black/10 rounded text-xs text-left overflow-auto max-h-40">
                {JSON.stringify({
                  players,
                  currentUserId,
                  gameParameters
                }, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Game Finished</h3>
              <p className="text-muted-foreground">Winner will be announced here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCanvas;
