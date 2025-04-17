
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
          <div className="game-board relative w-full h-full">
            {/* Main game board container */}
            <div className="game-area absolute inset-0 flex items-center justify-center">
              {/* Game implementation will go here */}
              <div className="w-full h-full flex flex-col">
                {/* Top section - typically for opponent or game status */}
                <div className="game-section game-top h-1/4 border-b border-border/20 flex items-center justify-center">
                  <div className="opponent-area flex items-center space-x-4">
                    {/* Opponent display */}
                  </div>
                </div>
                
                {/* Middle section - main game board */}
                <div className="game-section game-middle h-2/4 flex items-center justify-center">
                  <div className="game-board-inner w-3/4 h-3/4 bg-card/50 rounded-lg border border-border flex items-center justify-center">
                    {/* Game board render area */}
                    <div className="game-elements">
                      {/* This is where the main game elements will be rendered */}
                      <div className="text-center">
                        <pre className="text-xs bg-black/10 p-2 rounded text-left">
                          {JSON.stringify({ 
                            players: players.map(p => ({ id: p.id, name: p.display_name, isCurrentUser: p.user_id === currentUserId })),
                            gameParams: gameParameters 
                          }, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom section - player's hand or controls */}
                <div className="game-section game-bottom h-1/4 border-t border-border/20 flex items-center justify-center">
                  <div className="player-area flex items-center space-x-4">
                    {/* Player controls and information */}
                    {isPlayerInGame ? (
                      <div className="player-controls">
                        {/* Game-specific controls will be placed here */}
                        <div className="text-sm font-medium">
                          Your controls will appear here
                        </div>
                      </div>
                    ) : (
                      <div className="spectator-mode text-sm text-muted-foreground">
                        You are in spectator mode
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Overlay elements like modals, notifications, etc. */}
            <div className="game-overlay absolute inset-0 pointer-events-none">
              {/* Dynamic overlay elements */}
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
