
import { useState, useEffect, useRef } from "react";
import { RoomData } from "./types";
import JSZip from "jszip";

interface GameCanvasProps {
  roomData: RoomData;
  currentUserId: string | null;
}

const GameCanvas = ({ roomData, currentUserId }: GameCanvasProps) => {
  const [gameState, setGameState] = useState<'loading' | 'waiting' | 'playing' | 'finished'>('loading');
  const [extractedFiles, setExtractedFiles] = useState<{[key: string]: string}>({});
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

  // Extract all Ludo game files from ZIP completely upfront
  useEffect(() => {
    const extractZipFile = async () => {
      try {
        console.log("Starting to fetch and extract the Ludo zip file...");
        const response = await fetch('/src/game-implementation/ludo.zip');
        const zipData = await response.arrayBuffer();
        const zip = await JSZip.loadAsync(zipData);
        
        const files: {[key: string]: string} = {};
        const filePromises: Promise<void>[] = [];
        
        zip.forEach((relativePath, zipEntry) => {
          if (!zipEntry.dir) {
            const promise = zipEntry.async('text').then(content => {
              files[relativePath] = content;
            });
            filePromises.push(promise);
          }
        });
        
        await Promise.all(filePromises);
        console.log("Successfully extracted all files:", Object.keys(files));
        setExtractedFiles(files);
        setGameState('waiting');
      } catch (error) {
        console.error("Error extracting Ludo game files:", error);
      }
    };
    
    extractZipFile();
  }, []);

  // Load game scripts and initialize game when we have enough players
  useEffect(() => {
    if (gameState === 'waiting' && players.length >= 2) {
      console.log("Ready to play with", players.length, "players");
      setGameState('playing');
    }
  }, [players.length, gameState]);

  // Initialize game when in playing state and files are extracted
  useEffect(() => {
    if (gameState === 'playing' && Object.keys(extractedFiles).length > 0 && canvasRef.current && !gameScriptLoaded.current) {
      try {
        console.log("Initializing game...");
        
        // Create the game container
        const gameContainer = document.createElement('div');
        gameContainer.id = 'ludoGameContainer';
        gameContainer.style.width = '100%';
        gameContainer.style.height = '100%';
        canvasRef.current.appendChild(gameContainer);
        
        // Add CSS styles to the document
        const cssFiles = Object.keys(extractedFiles).filter(file => file.endsWith('.css'));
        if (cssFiles.length > 0) {
          const style = document.createElement('style');
          style.setAttribute('data-ludo-style', 'true');
          cssFiles.forEach(cssFile => {
            console.log("Adding CSS:", cssFile);
            style.textContent += extractedFiles[cssFile];
          });
          document.head.appendChild(style);
        }
        
        // Find all JavaScript files and identify script types
        const jsFiles = Object.keys(extractedFiles).filter(file => file.endsWith('.js'));
        
        // Sort scripts in order of game flow
        const initScript = jsFiles.find(file => file.includes('init.js'));
        const loaderScript = jsFiles.find(file => file.includes('loader.js'));
        const mobileScript = jsFiles.find(file => file.includes('mobile.js'));
        const canvasScript = jsFiles.find(file => file.includes('canvas.js'));
        const mainScript = jsFiles.find(file => file.includes('main.js'));
        const gameScript = jsFiles.find(file => file.includes('game.js'));
        
        console.log("Game flow scripts:", { 
          initScript, loaderScript, mobileScript, canvasScript, mainScript, gameScript 
        });
        
        // Create and inject script elements in correct order
        const createScript = (scriptPath: string | undefined) => {
          if (!scriptPath) return null;
          
          console.log("Creating script:", scriptPath);
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.setAttribute('data-ludo-script', scriptPath);
          
          // Inject player data and game parameters
          const playerData = JSON.stringify({
            currentPlayerId: currentUserId,
            allPlayers: players,
            gameParams: gameParameters
          });
          
          script.text = `
            // Injected game data
            window.LUDO_GAME_DATA = ${playerData};
            
            ${extractedFiles[scriptPath]}
          `;
          
          return script;
        };
        
        // Inject scripts in the correct order following game flow
        const injectScriptsInOrder = async () => {
          // 1. Browser detection
          const init = createScript(initScript);
          if (init) {
            document.body.appendChild(init);
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // 2. Asset loader
          const loader = createScript(loaderScript);
          if (loader) {
            document.body.appendChild(loader);
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // 3. Mobile orientation detection
          const mobile = createScript(mobileScript);
          if (mobile) {
            document.body.appendChild(mobile);
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // 4. Canvas construction
          const canvas = createScript(canvasScript);
          if (canvas) {
            document.body.appendChild(canvas);
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // 5. Main game menu
          const main = createScript(mainScript);
          if (main) {
            document.body.appendChild(main);
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // 6. Game logic
          const game = createScript(gameScript);
          if (game) {
            document.body.appendChild(game);
          }
          
          gameScriptLoaded.current = true;
          console.log("All game scripts loaded successfully!");
        };
        
        injectScriptsInOrder();
        
      } catch (error) {
        console.error("Error initializing Ludo game:", error);
      }
    }
  }, [gameState, extractedFiles, canvasRef, players, currentUserId, gameParameters]);

  // Clean up scripts and styles when component unmounts
  useEffect(() => {
    return () => {
      if (gameScriptLoaded.current) {
        console.log("Cleaning up Ludo game resources...");
        // Remove any injected scripts and styles
        document.querySelectorAll('script[data-ludo-script]').forEach(script => script.remove());
        document.querySelectorAll('style[data-ludo-style]').forEach(style => style.remove());
      }
    };
  }, []);

  return (
    <div className="game-container">
      <div className="bg-accent/10 rounded-lg border border-border aspect-video relative overflow-hidden">
        {gameState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <h3 className="text-2xl font-bold mb-2">Loading Game Files</h3>
              <p className="text-muted-foreground">Extracting the Ludo game...</p>
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
