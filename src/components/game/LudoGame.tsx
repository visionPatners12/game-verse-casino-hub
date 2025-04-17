
import { useState, useEffect } from "react";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface LudoGameProps {
  players: {
    id: string;
    display_name: string;
    user_id: string;
    current_score: number;
  }[];
  currentUserId: string | null;
  gameParameters: {
    gameType: string;
    betAmount: number;
    maxPlayers: number;
    currentPlayers: number;
    roomId: string;
    totalPot: number;
  };
}

type PlayerPiece = {
  id: number;
  position: number;
  isHome: boolean;
  isFinished: boolean;
};

type PlayerState = {
  id: string;
  name: string;
  color: "red" | "green" | "blue" | "yellow";
  pieces: PlayerPiece[];
  isCurrentTurn: boolean;
};

const BOARD_SIZE = 40; // Standard Ludo board has 40 positions around the track

const LudoGame = ({ players, currentUserId, gameParameters }: LudoGameProps) => {
  const { toast } = useToast();
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(0);
  
  // Map players to colors based on their position
  const colorMap: ("red" | "green" | "blue" | "yellow")[] = ["red", "green", "blue", "yellow"];
  
  // Initialize player states
  const [playerStates, setPlayerStates] = useState<PlayerState[]>([]);
  
  useEffect(() => {
    // Initialize player states with mapped colors and pieces
    const initialStates = players.map((player, index) => ({
      id: player.user_id,
      name: player.display_name,
      color: colorMap[index % colorMap.length],
      pieces: Array.from({ length: 4 }).map((_, pieceIndex) => ({
        id: pieceIndex,
        position: 0,
        isHome: true,
        isFinished: false
      })),
      isCurrentTurn: index === 0 // First player starts
    }));
    
    setPlayerStates(initialStates);
    
    if (players.length >= 2) {
      setGameStarted(true);
    }
  }, [players]);
  
  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Simulate dice roll
    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(newValue);
      setIsRolling(false);
      
      toast({
        title: "Dice Rolled",
        description: `You rolled a ${newValue}!`,
      });
      
      // Here would be the logic to move pieces based on dice roll
      // For now, we'll just pass turn after rolling
      setTimeout(() => {
        passTurn();
      }, 1000);
    }, 1000);
  };
  
  const passTurn = () => {
    setPlayerStates(prev => {
      const nextTurn = (currentTurn + 1) % playerStates.length;
      setCurrentTurn(nextTurn);
      
      return prev.map((player, index) => ({
        ...player,
        isCurrentTurn: index === nextTurn
      }));
    });
  };
  
  const movePiece = (playerIndex: number, pieceIndex: number) => {
    if (!diceValue || playerIndex !== currentTurn) return;
    
    setPlayerStates(prev => {
      const newStates = [...prev];
      const player = newStates[playerIndex];
      const piece = player.pieces[pieceIndex];
      
      // If piece is at home and dice is 6, move to start
      if (piece.isHome && diceValue === 6) {
        piece.isHome = false;
        piece.position = 0; // Starting position for this player's color
      } 
      // If piece is on board, move it forward
      else if (!piece.isHome && !piece.isFinished) {
        piece.position = (piece.position + diceValue) % BOARD_SIZE;
        
        // Check if the piece has completed a full circle and reached home
        if (piece.position >= BOARD_SIZE - 1) {
          piece.isFinished = true;
          toast({
            title: "Piece Finished!",
            description: `${player.name}'s piece has reached home!`,
          });
        }
      }
      
      return newStates;
    });
    
    passTurn();
  };
  
  const renderDice = () => {
    if (isRolling) {
      return <div className="animate-spin h-12 w-12 border-4 border-primary rounded-full border-t-transparent" />;
    }
    
    switch (diceValue) {
      case 1: return <Dice1 className="h-12 w-12" />;
      case 2: return <Dice2 className="h-12 w-12" />;
      case 3: return <Dice3 className="h-12 w-12" />;
      case 4: return <Dice4 className="h-12 w-12" />;
      case 5: return <Dice5 className="h-12 w-12" />;
      case 6: return <Dice6 className="h-12 w-12" />;
      default: return <div className="h-12 w-12 border-2 border-dashed border-muted-foreground rounded flex items-center justify-center">?</div>;
    }
  };
  
  // Get current player
  const currentPlayer = playerStates[currentTurn];
  const isCurrentUserTurn = currentPlayer?.id === currentUserId;
  
  if (!gameStarted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Waiting for Players</h2>
          <p className="text-muted-foreground">Need at least 2 players to start the game.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Top player section */}
      <div className="h-1/6 border-b border-border flex items-center justify-center bg-muted/30">
        <div className="flex items-center gap-4">
          {playerStates.map((player, index) => (
            index !== currentTurn && (
              <div 
                key={player.id} 
                className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                  player.isCurrentTurn ? 'bg-accent text-accent-foreground font-medium' : 'bg-muted'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-${player.color}-500`} />
                <span>{player.name}</span>
              </div>
            )
          ))}
        </div>
      </div>
      
      {/* Main board */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="ludo-board relative aspect-square bg-card/50 rounded-lg border border-border w-full max-w-md overflow-hidden">
          {/* Simplified visualization of the Ludo board */}
          <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-red-500 rounded-br-md"></div>
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-green-500 rounded-bl-md"></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500 rounded-tr-md"></div>
          <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-yellow-500 rounded-tl-md"></div>
          
          {/* Center area */}
          <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-white grid grid-cols-2 grid-rows-2">
            <div className="bg-red-500 rounded-tl-sm"></div>
            <div className="bg-green-500 rounded-tr-sm"></div>
            <div className="bg-blue-500 rounded-bl-sm"></div>
            <div className="bg-yellow-500 rounded-br-sm"></div>
          </div>
          
          {/* Player pieces - simplified visualization */}
          {playerStates.map((player, playerIndex) => (
            player.pieces.map((piece, pieceIndex) => {
              if (piece.isHome) {
                // Render in home base
                const homeBasePositions = [
                  {top: '15%', left: '15%'},
                  {top: '15%', left: '25%'},
                  {top: '25%', left: '15%'},
                  {top: '25%', left: '25%'}
                ];
                
                const position = homeBasePositions[pieceIndex];
                const style = {
                  top: player.color === 'red' || player.color === 'green' ? position.top : '',
                  left: player.color === 'red' || player.color === 'blue' ? position.left : '',
                  right: player.color === 'green' || player.color === 'yellow' ? position.left : '',
                  bottom: player.color === 'blue' || player.color === 'yellow' ? position.top : '',
                };
                
                return (
                  <div 
                    key={`${playerIndex}-${pieceIndex}`}
                    className={`absolute w-[8%] h-[8%] rounded-full bg-${player.color}-600 border-2 border-white cursor-pointer 
                      ${isCurrentUserTurn && playerIndex === currentTurn ? 'animate-pulse' : ''}`}
                    style={style}
                    onClick={() => isCurrentUserTurn && movePiece(playerIndex, pieceIndex)}
                  />
                );
              } else if (piece.isFinished) {
                // Piece has finished the race - not shown on the board
                return null;
              } else {
                // Piece on the track - simplified by just showing at a calculated position
                let posX, posY;
                
                // Very simplified position calculation
                const angle = (piece.position / BOARD_SIZE) * 360;
                const radius = 40; // percentage from center
                posX = 50 + radius * Math.cos(angle * Math.PI / 180);
                posY = 50 + radius * Math.sin(angle * Math.PI / 180);
                
                return (
                  <div 
                    key={`${playerIndex}-${pieceIndex}`}
                    className={`absolute w-[8%] h-[8%] rounded-full bg-${player.color}-600 border-2 border-white cursor-pointer
                      ${isCurrentUserTurn && playerIndex === currentTurn ? 'animate-pulse' : ''}`}
                    style={{
                      top: `${posY}%`,
                      left: `${posX}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => isCurrentUserTurn && movePiece(playerIndex, pieceIndex)}
                  />
                );
              }
            })
          ))}
        </div>
      </div>
      
      {/* Game controls */}
      <div className="h-1/6 border-t border-border flex items-center justify-between px-6 bg-muted/30">
        <div className="flex items-center gap-4">
          {currentPlayer && (
            <div className={`px-4 py-2 rounded-md bg-${currentPlayer.color}-100 border border-${currentPlayer.color}-500`}>
              <p className="text-sm">Current Turn</p>
              <p className="font-bold">{currentPlayer.name}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            {renderDice()}
          </div>
          
          <Button 
            onClick={rollDice}
            disabled={!isCurrentUserTurn || isRolling}
            className={!isCurrentUserTurn ? 'opacity-50' : ''}
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </Button>
        </div>
        
        <div>
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Game Forfeit",
                description: "You have forfeit the game",
              });
            }}
          >
            Forfeit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LudoGame;
