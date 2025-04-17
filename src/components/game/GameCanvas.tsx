
import { useState, useEffect } from "react";
import { RoomData } from "./types";
import GameStructure from "./GameStructure";
import LudoGame from "./LudoGame";

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

  // Render the game based on the game type
  const renderGame = () => {
    const gameType = roomData?.game_type?.toLowerCase();
    
    if (gameType === 'ludo') {
      return (
        <LudoGame 
          players={players}
          currentUserId={currentUserId}
          gameParameters={gameParameters}
        />
      );
    }
    
    // Default fallback for unsupported game types
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">Game Not Implemented</h3>
          <p className="text-muted-foreground">This game type is not yet available.</p>
        </div>
      </div>
    );
  };

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
          <GameStructure 
            gameComponent={renderGame()}
            gameParameters={gameParameters}
          />
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
