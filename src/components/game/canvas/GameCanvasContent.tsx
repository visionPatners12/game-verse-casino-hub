
import { memo, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { RoomData } from "../types";
import { FutArenaMatchFlow } from "./FutArenaMatchFlow";

interface GameCanvasContentProps {
  roomData: RoomData;
  currentUserId: string | null;
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
}

export const GameCanvasContent = memo(({ roomData, currentUserId, gameStatus }: GameCanvasContentProps) => {
  // --- Mode FUTArena : affichage IDs, play, timer ---
  const isFutArena = roomData.game_type?.toLowerCase() === "futarena";
  
  // Only show FutArenaMatchFlow for pre-game setup
  if (isFutArena && typeof roomData.match_duration === "number" && 
     (gameStatus === "waiting" || (gameStatus === "starting" && !window.gameInitialized))) {
    return <FutArenaMatchFlow roomData={roomData} currentUserId={currentUserId} gameStatus={gameStatus} />;
  }

  // --- CANVAS LOGIC FOR OTHER MODES OR FUTARENA AFTER GAME STARTED ---
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'error'>('loading');
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameInitialized = useRef<boolean>(false);
  const lastGameData = useRef<any | null>(null);

  const gameData = {
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
    if (!canvasRef.current || !currentUserId) return;
    
    // For FutArena, only initialize in playing status
    if (isFutArena && gameStatus !== "playing") {
      return;
    }
    
    const initializeGame = async () => {
      try {
        if (gameInitialized.current) {
          console.log("Game already initialized, skipping initialization");
          return;
        }

        setGameState('loading');
        console.log("Initializing game canvas...");
        
        // Ensure global game object exists
        if (!window.$) window.$ = { game: {} };
        if (!window.$.game) window.$.game = {};
        
        // Set up global window components
        window.$.game = {
          ...window.$.game,
          gameData: gameData,
        };
        lastGameData.current = gameData;
        console.log("Game data set:", gameData);
        
        if (typeof window.initGameCanvas === 'function' && typeof window.buildGameCanvas === 'function') {
          console.log("Building canvas with dimensions 1280x768");
          window.initGameCanvas(1280, 768);
          window.buildGameCanvas();
          
          // Mark game as initialized globally
          window.gameInitialized = true;
          gameInitialized.current = true;
          
          setGameState('ready');
          console.log("Canvas initialized successfully");
          
          if (typeof window.resizeGameFunc === 'function') {
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
      if (gameInitialized.current && typeof window.removeGameCanvas === 'function') {
        console.log("Removing canvas");
        window.removeGameCanvas();
        window.gameInitialized = false;
        gameInitialized.current = false;
      }
    };
  }, [canvasRef, currentUserId, gameData, gameStatus, isFutArena]);

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

  // Resize canvas on window resize
  useEffect(() => {
    const handleResize = () => {
      if (typeof window.resizeGameFunc === 'function' && gameInitialized.current) {
        window.resizeGameFunc();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      id="game-canvas-container"
      className="absolute inset-0 flex items-center justify-center"
    />
  );
});

GameCanvasContent.displayName = 'GameCanvasContent';
