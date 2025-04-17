
import { useState, useEffect, useRef } from "react";
import { RoomData } from "./types";
import { LudoGameData } from "../../game-implementation/Ludo/types";

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

  // Set game state to 'playing' immediately when component mounts
  useEffect(() => {
    if (gameState === 'loading' && !gameScriptLoaded.current) {
      setGameState('playing');
    }
  }, []);

  // Initialize Ludo game when in 'playing' state
  useEffect(() => {
    const initializeLudoGame = async () => {
      if (gameState === 'playing' && canvasRef.current && !gameScriptLoaded.current) {
        try {
          console.log("Initializing Ludo game...");
          
          // Create game container
          const gameContainer = document.createElement('div');
          gameContainer.id = 'mainHolder';
          gameContainer.style.width = '100%';
          gameContainer.style.height = '100%';
          
          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.id = 'gameCanvas';
          canvas.width = 1280;
          canvas.height = 768;
          
          // Create canvas holder
          const canvasHolder = document.createElement('div');
          canvasHolder.id = 'canvasHolder';
          canvasHolder.appendChild(canvas);
          
          // Add elements to DOM
          gameContainer.appendChild(canvasHolder);
          canvasRef.current.appendChild(gameContainer);
          
          // Add required scripts in sequence
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

          // Add CSS styles
          const style = document.createElement('style');
          style.textContent = `
            #mainHolder { position: relative; width: 100%; height: 100%; }
            #canvasHolder { width: 100%; height: 100%; }
            #gameCanvas { width: 100%; height: 100%; }
          `;
          document.head.appendChild(style);

          // Load scripts sequentially
          for (const scriptSrc of scripts) {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = scriptSrc;
              script.onload = resolve;
              script.onerror = reject;
              document.body.appendChild(script);
            });
          }

          // Configure game data
          window.LUDO_GAME_DATA = {
            currentPlayerId: currentUserId,
            allPlayers: players,
            gameParams: gameParameters
          };

          // Force game to start immediately after initialization
          window.setTimeout(() => {
            if (window.goPage) {
              window.goPage('game');
            }
          }, 500);

          gameScriptLoaded.current = true;
          console.log("Ludo game initialized successfully!");

        } catch (error) {
          console.error("Error initializing Ludo game:", error);
        }
      }
    };

    initializeLudoGame();

    // Cleanup when component unmounts
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

        <div 
          ref={canvasRef} 
          id="ludo-canvas-container" 
          className="absolute inset-0"
        ></div>
      </div>
    </div>
  );
};

export default GameCanvas;
