import { useEffect, useRef, useState } from "react";
import { RoomData } from "./types";
import { GameData } from "@/game-implementation/Ludo/types";
import { useRoomWebSocket } from "@/hooks/room/useRoomWebSocket";
import { useParams } from "react-router-dom";
import { Loader2, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

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
    totalPot: roomData ? roomData.entry_fee * roomData.current_players * (1 - roomData.commission_rate/100) : 0,
    matchDuration: roomData?.match_duration,
  };

  const gameData: GameData = {
    currentPlayerId: currentUserId,
    allPlayers: players,
    gameParams: gameParams
  };

  useEffect(() => {
    if (!canvasRef.current || !currentUserId || gameInitialized.current) return;
    
    const initializeGame = async () => {
      try {
        setGameState('loading');
        if (window.$ && typeof window.$.game !== 'undefined') {
          window.$.game = {
            ...window.$.game,
            gameData: gameData,
            sendMove: broadcastMove
          };
        }
        if (window.initGameCanvas && window.buildGameCanvas) {
          window.initGameCanvas(1280, 768);
          window.buildGameCanvas();
          gameInitialized.current = true;
          setGameState('ready');
        } else {
          setGameState('error');
        }
      } catch (error) {
        setGameState('error');
      }
    };

    initializeGame();

    return () => {
      gameInitialized.current = false;
      if (window.removeGameCanvas) {
        window.removeGameCanvas();
      }
    };
  }, [canvasRef, currentUserId, JSON.stringify(gameData), broadcastMove]);
  
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

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error('Error attempting to enable fullscreen:', err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error('Error attempting to exit fullscreen:', err));
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative bg-accent/10 rounded-lg border border-border aspect-video w-full overflow-hidden"
    >
      <div 
        ref={canvasRef} 
        id="game-canvas-container" 
        className="absolute inset-0 flex items-center justify-center"
      >
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-50"
          onClick={toggleFullscreen}
        >
          <Maximize className="h-4 w-4" />
        </Button>

        {roomData.game_type === "futarena" && remainingTime !== null && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-background bg-opacity-70 rounded px-4 py-2 shadow font-bold text-lg border">
            <Timer className="h-5 w-5 mr-2" />
            <span>
              {Math.floor(remainingTime / 60)
                .toString()
                .padStart(2, '0')}:
              {(remainingTime % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}

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
