
import { useEffect, useRef, useState } from "react";
import { RoomData } from "./types";
import { useRoomWebSocket } from "@/hooks/room/useRoomWebSocket";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface GameCanvasProps {
  roomData: RoomData;
  currentUserId: string | null;
}

const GameCanvas = ({ roomData, currentUserId }: GameCanvasProps) => {
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'error'>('loading');
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameInitialized = useRef<boolean>(false);
  const { roomId } = useParams<{ roomId: string }>();
  
  const { 
    presenceState, 
    gameStatus, 
    broadcastMove 
  } = useRoomWebSocket(roomId);
  
  // Extract game data
  const players = roomData?.game_players || [];
  const gameParameters = {
    gameType: roomData?.game_type,
    betAmount: roomData?.entry_fee,
    maxPlayers: roomData?.max_players,
    currentPlayers: roomData?.current_players,
    roomId: roomData?.room_id,
    totalPot: roomData ? roomData.entry_fee * roomData.current_players * (1 - roomData.commission_rate/100) : 0
  };

  // Initialize game canvas
  useEffect(() => {
    if (!canvasRef.current || !currentUserId || gameInitialized.current) return;
    
    const initializeGame = async () => {
      try {
        setGameState('loading');
        console.log('Initializing game canvas with data:', { roomData, currentUserId });
        
        // This is where we would initialize the canvas game engine
        // For now, we'll just set a timeout to simulate loading
        setTimeout(() => {
          console.log('Game canvas initialized');
          gameInitialized.current = true;
          setGameState('ready');
        }, 1500);
        
      } catch (error) {
        console.error('Error initializing game canvas:', error);
        setGameState('error');
      }
    };
    
    initializeGame();
    
    return () => {
      // Cleanup code for game canvas (if needed)
      console.log('Cleaning up game canvas');
      gameInitialized.current = false;
    };
  }, [canvasRef, currentUserId, roomData]);
  
  // Listen for game events
  useEffect(() => {
    if (!roomId || !currentUserId || !gameInitialized.current) return;
    
    // This is where we would listen for game events and update the canvas
    console.log('Setting up game event listeners');
    
    // When a move is received, update the canvas
    const handleGameMove = (event: any) => {
      console.log('Game move received:', event);
      // Update canvas based on the move
    };
    
    return () => {
      // Remove event listeners
    };
  }, [roomId, currentUserId, gameStatus]);

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
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Loading Game</h3>
              <p className="text-muted-foreground">Preparing canvas...</p>
            </div>
          )}
          
          {gameState === 'error' && (
            <div className="text-center text-destructive">
              <h3 className="text-2xl font-bold mb-2">Error</h3>
              <p>Failed to initialize game. Please refresh the page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCanvas;
