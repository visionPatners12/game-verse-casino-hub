
import { useEffect, useRef, useState } from "react";
import { RoomData } from "./types";
import { GameData } from "@/game-implementation/Ludo/types";
import { useRoomWebSocket } from "@/hooks/room/useRoomWebSocket";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Add TypeScript declarations for window global properties
declare global {
  interface Window {
    $: {
      game: {
        gameData?: GameData;
        sendMove?: (moveData: any) => void;
        handleMove?: (event: any) => void;
      };
    };
    initGameCanvas: (width: number, height: number) => void;
    buildGameCanvas: () => void;
    removeGameCanvas: () => void;
  }
}

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
  const players = roomData?.game_players?.map(player => ({
    id: player.id,
    display_name: player.display_name,
    user_id: player.user_id,
    current_score: player.current_score,
  })) || [];

  const gameParams = {
    gameType: roomData?.game_type,
    betAmount: roomData?.entry_fee,
    maxPlayers: roomData?.max_players,
    currentPlayers: roomData?.current_players,
    roomId: roomData?.room_id,
    totalPot: roomData ? roomData.entry_fee * roomData.current_players * (1 - roomData.commission_rate/100) : 0
  };

  const gameData: GameData = {
    currentPlayerId: currentUserId,
    allPlayers: players,
    gameParams: gameParams
  };

  // Initialize game canvas
  useEffect(() => {
    if (!canvasRef.current || !currentUserId || gameInitialized.current) return;
    
    const initializeGame = async () => {
      try {
        setGameState('loading');
        console.log('Initializing game canvas with data:', gameData);
        
        // This is where we make the data available to the game implementation
        if (window.$ && typeof window.$.game !== 'undefined') {
          window.$.game = {
            ...window.$.game,
            gameData: gameData,
            sendMove: broadcastMove
          };
        }
        
        // Initialize the canvas game
        if (window.initGameCanvas && window.buildGameCanvas) {
          window.initGameCanvas(1280, 768);
          window.buildGameCanvas();
          gameInitialized.current = true;
          setGameState('ready');
        } else {
          console.error('Game canvas functions not found');
          setGameState('error');
        }
        
      } catch (error) {
        console.error('Error initializing game canvas:', error);
        setGameState('error');
      }
    };
    
    initializeGame();
    
    return () => {
      // Cleanup code for game canvas
      console.log('Cleaning up game canvas');
      gameInitialized.current = false;
      if (window.removeGameCanvas) {
        window.removeGameCanvas();
      }
    };
  }, [canvasRef, currentUserId, gameData, broadcastMove]);
  
  // Listen for game events
  useEffect(() => {
    if (!roomId || !currentUserId || !gameInitialized.current) return;
    
    console.log('Setting up game event listeners');
    
    // When a move is received, update the canvas
    const handleGameMove = (event: any) => {
      console.log('Game move received:', event);
      // Update canvas based on the move
      if (window.$ && window.$.game && typeof window.$.game.handleMove === 'function') {
        window.$.game.handleMove(event);
      }
    };
    
    return () => {
      // Remove event listeners
      if (window.$ && window.$.game) {
        window.$.game = undefined;
      }
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
