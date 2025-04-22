
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { GameData } from "@/game-implementation/Ludo/types";
import { RoomData } from "../types";

interface GameCanvasContentProps {
  roomData: RoomData;
  currentUserId: string | null;
}

export const GameCanvasContent = ({ roomData, currentUserId }: GameCanvasContentProps) => {
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'error'>('loading');
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameInitialized = useRef<boolean>(false);

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
      totalPot: roomData.pot || (roomData.entry_fee * roomData.current_players * (1 - roomData.commission_rate/100)),
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
  }, [canvasRef, currentUserId, gameData]);
  
  useEffect(() => {
    if (window.$ && window.$.game && gameInitialized.current) {
      console.log("Updating game data:", gameData);
      window.$.game.gameData = gameData;
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
          <p>Failed to initialize game. Please refresh the page.</p>
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
};
