
import { useState, useEffect, useRef } from "react";
import { RoomData } from "./types";
import JSZip from "jszip";

interface GameCanvasProps {
  roomData: RoomData;
  currentUserId: string | null;
}

const GameCanvas = ({ roomData, currentUserId }: GameCanvasProps) => {
  const [gameState, setGameState] = useState<'loading' | 'waiting' | 'playing' | 'finished'>('loading');
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameScriptLoaded = useRef<boolean>(false);
  
  const players = roomData?.game_players || [];
  const gameParameters = {
    gameType: roomData?.game_type,
    betAmount: roomData?.entry_fee,
    maxPlayers: roomData?.max_players,
    currentPlayers: roomData?.current_players,
    roomId: roomData?.room_id,
    totalPot: roomData ? roomData.entry_fee * roomData.current_players * (1 - roomData.commission_rate/100) : 0
  };

  // Initialiser le jeu Ludo quand il y a assez de joueurs
  useEffect(() => {
    if (gameState === 'waiting' && players.length >= 2) {
      console.log("Ready to play with", players.length, "players");
      setGameState('playing');
    }
  }, [players.length, gameState]);

  // Initialiser le jeu quand on est en état 'playing'
  useEffect(() => {
    const initializeLudoGame = async () => {
      if (gameState === 'playing' && canvasRef.current && !gameScriptLoaded.current) {
        try {
          console.log("Initializing Ludo game...");
          
          // Créer le conteneur de jeu
          const gameContainer = document.createElement('div');
          gameContainer.id = 'mainHolder';
          gameContainer.style.width = '100%';
          gameContainer.style.height = '100%';
          
          // Créer le canvas
          const canvas = document.createElement('canvas');
          canvas.id = 'gameCanvas';
          canvas.width = 1280;
          canvas.height = 768;
          
          // Créer le conteneur de canvas
          const canvasHolder = document.createElement('div');
          canvasHolder.id = 'canvasHolder';
          canvasHolder.appendChild(canvas);
          
          // Ajouter les éléments au DOM
          gameContainer.appendChild(canvasHolder);
          canvasRef.current.appendChild(gameContainer);
          
          // Injecter les scripts nécessaires dans l'ordre
          const scripts = [
            '/src/game-implementation/Ludo/js/vendor/jquery.min.js',
            '/src/game-implementation/Ludo/js/vendor/createjs.min.js',
            '/src/game-implementation/Ludo/js/vendor/TweenMax.min.js',
            '/src/game-implementation/Ludo/js/vendor/proton.min.js',
            '/src/game-implementation/Ludo/js/plugins.js',
            '/src/game-implementation/Ludo/js/sound.js',
            '/src/game-implementation/Ludo/js/canvas.js',
            '/src/game-implementation/Ludo/js/boards.js',
            '/src/game-implementation/Ludo/js/game.js',
            '/src/game-implementation/Ludo/js/mobile.js',
            '/src/game-implementation/Ludo/js/main.js',
            '/src/game-implementation/Ludo/js/loader.js',
            '/src/game-implementation/Ludo/js/init.js'
          ];

          // Ajouter les styles CSS
          const style = document.createElement('style');
          style.textContent = `
            #mainHolder { position: relative; width: 100%; height: 100%; }
            #canvasHolder { width: 100%; height: 100%; }
            #gameCanvas { width: 100%; height: 100%; }
          `;
          document.head.appendChild(style);

          // Injecter les scripts séquentiellement
          for (const scriptSrc of scripts) {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = scriptSrc;
              script.onload = resolve;
              script.onerror = reject;
              document.body.appendChild(script);
            });
          }

          // Configurer les données du jeu
          window.LUDO_GAME_DATA = {
            currentPlayerId: currentUserId,
            allPlayers: players,
            gameParams: gameParameters
          };

          gameScriptLoaded.current = true;
          console.log("Ludo game initialized successfully!");

        } catch (error) {
          console.error("Error initializing Ludo game:", error);
        }
      }
    };

    initializeLudoGame();

    // Nettoyage lors du démontage
    return () => {
      if (gameScriptLoaded.current) {
        console.log("Cleaning up Ludo game...");
        document.querySelectorAll('script[src*="Ludo/js"]').forEach(script => script.remove());
        const style = document.querySelector('style[data-ludo-style]');
        if (style) style.remove();
      }
    };
  }, [gameState, players, currentUserId, gameParameters]);

  return (
    <div className="game-container">
      <div className="bg-accent/10 rounded-lg border border-border aspect-video relative overflow-hidden">
        {gameState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <h3 className="text-2xl font-bold mb-2">Loading Game Files</h3>
              <p className="text-muted-foreground">Initializing the Ludo game...</p>
            </div>
          </div>
        )}

        {gameState === 'waiting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Waiting for Players</h3>
              <p className="text-muted-foreground">Need at least 2 players to start</p>
            </div>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'finished') && (
          <div 
            ref={canvasRef} 
            id="ludo-canvas-container" 
            className="absolute inset-0"
          ></div>
        )}
      </div>
    </div>
  );
};

export default GameCanvas;
