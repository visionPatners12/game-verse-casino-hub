import { useEffect, useRef, useState, memo } from "react";
import { Loader2 } from "lucide-react";
import { GameTimer } from "./GameTimer";
import { GameData } from "@/game-implementation/Ludo/types";
import { RoomData } from "../types";

interface GameCanvasContentProps {
  roomData: RoomData;
  currentUserId: string | null;
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
}

/**
 * Pour la room FUTArena (=type futarena et status="playing"), 
 * on affiche juste un compte à rebours plein écran.
 * Sinon on garde l'ancien comportement (canvas du jeu classique).
 */
export const GameCanvasContent = memo(({ roomData, currentUserId, gameStatus }: GameCanvasContentProps) => {
  // Si Futarena et gameStatus===playing => juste timer !
  if (
    roomData.game_type === "futarena" && 
    typeof roomData.match_duration === "number" && 
    gameStatus === "playing"
  ) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
        <div className="flex flex-col items-center animate-fade-in">
          <GameTimer matchDuration={roomData.match_duration} />
          <p className="mt-6 text-xl text-muted-foreground font-semibold">Match en cours</p>
        </div>
      </div>
    );
  }

  const [gameState, setGameState] = useState<'loading' | 'ready' | 'error'>('loading');
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameInitialized = useRef<boolean>(false);
  const lastGameData = useRef<GameData | null>(null);

  const gameData: GameData = {
    currentPlayerId: currentUserId,
    allPlayers: roomData.game_players?.map(player => ({
      id: player.id,
      display_name: player.display_name,
      user_id: player.user_id,
      current_score: player.current_score,
      ea_id: player.ea_id,
    })) || [],
    gameParams: {
      gameType: roomData.game_type,
      betAmount: roomData.entry_fee,
      maxPlayers: roomData.max_players,
      currentPlayers: roomData.current_players,
      roomId: roomData.room_id,
      totalPot: roomData.pot || 0,
      matchDuration: roomData.match_duration,
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
          };
          lastGameData.current = gameData;
          console.log("Game data set:", gameData);
        }
        
        if (window.initGameCanvas && window.buildGameCanvas) {
          console.log("Building canvas with dimensions 1280x768");
          window.initGameCanvas(1280, 768);
          window.buildGameCanvas();
          gameInitialized.current = true;
          setGameState('ready');
          console.log("Canvas initialized successfully");
          
          if (window.resizeGameFunc) {
            console.log("Initial resize after canvas initialization");
            setTimeout(window.resizeGameFunc, 200);
          }
        } else {
          console.error("Canvas initialization functions not found");
          setGameState('error');
        }
      } catch (error) {
        console.error("Error initializing canvas:", error);
        setGameState('error');
      }
    };

    initializeGame();

    return () => {
      gameInitialized.current = false;
      if (window.removeGameCanvas) {
        console.log("Removing canvas");
        window.removeGameCanvas();
      }
    };
  }, [canvasRef, currentUserId, gameData]);

  useEffect(() => {
    if (window.$ && window.$.game && gameInitialized.current) {
      const shouldUpdate = !lastGameData.current || 
                          lastGameData.current.gameParams.totalPot !== gameData.gameParams.totalPot ||
                          lastGameData.current.gameParams.currentPlayers !== gameData.gameParams.currentPlayers ||
                          lastGameData.current.allPlayers.length !== gameData.allPlayers.length;
      
      if (shouldUpdate) {
        console.log("Updating game data:", gameData);
        window.$.game.gameData = gameData;
        lastGameData.current = gameData;
      }
    }
  }, [gameData]);

  if (gameState === 'loading') {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Loading Game</h3>
          <p className="text-muted-foreground">Preparing canvas...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'error') {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-destructive">
          <h3 className="text-2xl font-bold mb-2">Error</h3>
          <p>Unable to initialize game. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={canvasRef} 
      className="absolute inset-0 flex items-center justify-center"
    />
  );
});

GameCanvasContent.displayName = 'GameCanvasContent';
