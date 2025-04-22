
import { useEffect, useRef, useState } from "react";
import { RoomData } from "./types";
import { GameData } from "@/game-implementation/Ludo/types";
import { useRoomWebSocket } from "@/hooks/room/useRoomWebSocket";
import { useParams } from "react-router-dom";
import { Loader2, Fullscreen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { toast } from "sonner";

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
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameInitialized = useRef<boolean>(false);
  const { roomId } = useParams<{ roomId: string }>();
  
  const { 
    presenceState, 
    gameStatus, 
    broadcastMove 
  } = useRoomWebSocket(roomId);

  const players = roomData?.game_players?.map(player => ({
    id: player.id,
    display_name: player.display_name,
    user_id: player.user_id,
    current_score: player.current_score,
    ea_id: player.ea_id,
  })) || [];

  const gameParams = {
    gameType: roomData?.game_type,
    betAmount: roomData?.entry_fee,
    maxPlayers: roomData?.max_players,
    currentPlayers: roomData?.current_players,
    roomId: roomData?.room_id,
    totalPot: roomData?.pot || (roomData ? roomData.entry_fee * roomData.current_players * (1 - roomData.commission_rate/100) : 0),
    matchDuration: roomData?.match_duration,
  };

  const gameData: GameData = {
    currentPlayerId: currentUserId,
    allPlayers: players,
    gameParams: gameParams
  };

  const toggleFullscreen = async () => {
    try {
      if (!containerRef.current) {
        toast.error("Fullscreen container not found");
        return;
      }

      if (!document.fullscreenElement) {
        // Enter fullscreen
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
        toast.success("Fullscreen mode enabled");
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
        setIsFullscreen(false);
        toast.success("Exited fullscreen mode");
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
      toast.error("Could not toggle fullscreen mode. Your browser might not support this feature.");
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !currentUserId || gameInitialized.current) return;
    
    const initializeGame = async () => {
      try {
        setGameState('loading');
        console.log("Initializing game canvas...");
        
        if (window.$ && typeof window.$.game !== 'undefined') {
          window.$.game = {
            ...window.$.game,
            gameData: gameData,
            sendMove: broadcastMove
          };
          console.log("Game data set:", gameData);
        }
        
        if (window.initGameCanvas && window.buildGameCanvas) {
          console.log("Building game canvas with dimensions 1280x768");
          window.initGameCanvas(1280, 768);
          window.buildGameCanvas();
          gameInitialized.current = true;
          setGameState('ready');
          console.log("Game canvas initialized successfully");
        } else {
          console.error("Game canvas initialization functions not found");
          setGameState('error');
        }
      } catch (error) {
        console.error("Error initializing game canvas:", error);
        setGameState('error');
      }
    };

    initializeGame();

    return () => {
      gameInitialized.current = false;
      if (window.removeGameCanvas) {
        console.log("Removing game canvas");
        window.removeGameCanvas();
      }
    };
  }, [canvasRef, currentUserId, broadcastMove]);
  
  useEffect(() => {
    if (window.$ && window.$.game && gameInitialized.current) {
      console.log("Updating game data:", gameData);
      window.$.game.gameData = gameData;
    }
  }, [JSON.stringify(gameData)]);
  
  useEffect(() => {
    if (roomData?.game_type !== "futarena" || !roomData.match_duration) {
      setRemainingTime(null);
      if (timerInterval.current) clearInterval(timerInterval.current);
      return;
    }

    if (gameStatus === 'playing' || gameStatus === 'starting') {
      setRemainingTime(roomData.match_duration * 60);
      timerInterval.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev === null) return null;
          if (prev > 0) return prev - 1;
          if (timerInterval.current) clearInterval(timerInterval.current);
          return 0;
        });
      }, 1000);
    } else {
      setRemainingTime(null);
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [roomData?.match_duration, roomData?.game_type, gameStatus]);

  useEffect(() => {
    if (!roomId || !currentUserId || !gameInitialized.current) return;
    
    console.log('Setting up game event listeners');
    
    const handleGameMove = (event: any) => {
      console.log('Game move received:', event);
      if (window.$ && window.$.game && typeof window.$.game.handleMove === 'function') {
        window.$.game.handleMove(event);
      }
    };
    
    return () => {
      if (window.$ && window.$.game) {
        window.$.game = undefined;
      }
    };
  }, [roomId, currentUserId, gameStatus]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative bg-accent/10 rounded-lg overflow-hidden w-full aspect-video"
    >
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-50 bg-background/80 hover:bg-background/90"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        <Fullscreen className="h-4 w-4" />
      </Button>

      {roomData.game_type === "futarena" && remainingTime !== null && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-background/80 rounded px-4 py-2 shadow font-bold text-lg">
          <Timer className="h-5 w-5 mr-2" />
          <span>
            {Math.floor(remainingTime / 60)
              .toString()
              .padStart(2, '0')}:
            {(remainingTime % 60).toString().padStart(2, '0')}
          </span>
        </div>
      )}

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
  );
};

export default GameCanvas;
