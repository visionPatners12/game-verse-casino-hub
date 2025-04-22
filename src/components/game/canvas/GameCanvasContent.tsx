import { useEffect, useRef, useState, memo } from "react";
import { Loader2 } from "lucide-react";
import { GameData } from "@/game-implementation/Ludo/types";
import { RoomData } from "../types";

declare global {
  interface Window {
    $: any;
    initGameCanvas?: (width: number, height: number) => void;
    buildGameCanvas?: () => void;
    removeGameCanvas?: () => void;
  }
}

interface GameCanvasContentProps {
  roomData: RoomData;
  currentUserId: string | null;
}

export const GameCanvasContent = memo(({ roomData, currentUserId }: GameCanvasContentProps) => {
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'error'>('loading');
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameInitialized = useRef<boolean>(false);
  const lastGameData = useRef<GameData | null>(null);

  useEffect(() => {
    const applyFullscreenStyles = () => {
      const gameCanvas = document.getElementById("gameCanvas");
      if (gameCanvas && document.fullscreenElement === gameCanvas) {
        gameCanvas.style.width = "100vw";
        gameCanvas.style.height = "100vh";
        gameCanvas.style.backgroundColor = "black";
      }
    };

    document.addEventListener('fullscreenchange', applyFullscreenStyles);
    return () => document.removeEventListener('fullscreenchange', applyFullscreenStyles);
  }, []);

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
        console.log("Initialisation du canvas de jeu...");
        
        if (window.$ && typeof window.$.game !== 'undefined') {
          window.$.game = {
            ...window.$.game,
            gameData: gameData,
          };
          lastGameData.current = gameData;
          console.log("Données de jeu définies:", gameData);
        }
        
        if (window.initGameCanvas && window.buildGameCanvas) {
          console.log("Construction du canvas avec les dimensions 1280x768");
          window.initGameCanvas(1280, 768);
          window.buildGameCanvas();
          gameInitialized.current = true;
          setGameState('ready');
          console.log("Canvas initialisé avec succès");
        } else {
          console.error("Les fonctions d'initialisation du canvas sont introuvables");
          setGameState('error');
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation du canvas:", error);
        setGameState('error');
      }
    };

    initializeGame();

    return () => {
      gameInitialized.current = false;
      if (window.removeGameCanvas) {
        console.log("Suppression du canvas");
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
        console.log("Mise à jour des données de jeu:", gameData);
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
          <h3 className="text-2xl font-bold mb-2">Chargement du jeu</h3>
          <p className="text-muted-foreground">Préparation du canvas...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'error') {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-destructive">
          <h3 className="text-2xl font-bold mb-2">Erreur</h3>
          <p>Impossible d'initialiser le jeu. Veuillez rafraîchir la page.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={canvasRef} 
      className="absolute inset-0 flex items-center justify-center [&:fullscreen]:bg-black"
    />
  );
});

GameCanvasContent.displayName = 'GameCanvasContent';
