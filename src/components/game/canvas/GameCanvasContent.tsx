import { useEffect, useRef, useState, memo } from "react";
import { Loader2 } from "lucide-react";
import { GameTimer } from "./GameTimer";
import { RoomData } from "../types";
import { Button } from "@/components/ui/button";

interface GameCanvasContentProps {
  roomData: RoomData;
  currentUserId: string | null;
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
}

export const GameCanvasContent = memo(({ roomData, currentUserId, gameStatus }: GameCanvasContentProps) => {
  // --- FUTArena Mode ---
  const isFutArena = roomData.game_type === "futarena";
  const connectedPlayers = (roomData.game_players || []).filter(p => p.is_connected);
  const playerCount = connectedPlayers.length;
  const myPlayer = connectedPlayers.find(p => p.user_id === currentUserId);

  // Maintain ready-to-play state for each player locally
  // In a real app, this would be stored/shared via socket presence or server.
  // Here, we'll fake it for demo purposes by using sessionStorage per user.
  const [playReadiness, setPlayReadiness] = useState<{ [userId: string]: boolean }>({});
  const [timerStarted, setTimerStarted] = useState(false);

  // Used as safety so timer only runs once
  const [hasLaunchedTimer, setHasLaunchedTimer] = useState(false);

  // Helper to get both players
  const getFutPlayerIds = () => {
    return connectedPlayers.map((player) => ({
      user_id: player.user_id,
      fut_id: player.ea_id || null // Assuming ea_id is FUT ID
    }));
  };

  // When both players have clicked "Play", launch timer
  useEffect(() => {
    if (
      isFutArena &&
      gameStatus === "playing" &&
      Object.values(playReadiness).filter(v => v).length === 2 &&
      !timerStarted
    ) {
      setTimerStarted(true);
    }
  }, [playReadiness, isFutArena, timerStarted, gameStatus]);

  // Allow both players to set their "ready" state (persist in session storage for demo)
  const handlePlayClick = () => {
    if (!currentUserId) return;
    setPlayReadiness(pr => ({
      ...pr,
      [currentUserId]: true,
    }));
    // Optionally: store in sessionStorage for persistence on page reload (simple demo)
    sessionStorage.setItem(`fut-play-ready-${currentUserId}-${roomData.room_id}`, "true");
  };

  // On mount, hydrate existing readiness (per local player)
  useEffect(() => {
    if (!currentUserId) return;
    const storedReady = sessionStorage.getItem(`fut-play-ready-${currentUserId}-${roomData.room_id}`) === "true";
    if (storedReady) {
      setPlayReadiness(pr => ({
        ...pr,
        [currentUserId]: true
      }));
    }
  }, [currentUserId, roomData.room_id]);

  // If a new player joins, reset their play readiness locally
  useEffect(() => {
    const ids = connectedPlayers.map(p => p.user_id);
    setPlayReadiness(existing => {
      const updated: { [key: string]: boolean } = {};
      ids.forEach(id => {
        updated[id] = existing[id] || false;
      });
      return updated;
    });
  }, [roomData.game_players]);

  // If not in futarena or not playing, fallback to classic canvas logic
  if (!isFutArena || typeof roomData.match_duration !== "number" || (gameStatus !== "playing" && gameStatus !== "starting")) {
    // --- CANVAS LOGIC FOR OTHER MODES ---
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
  }

  // -- FUTARENA: DISPLAY FUT IDS FOR BOTH PLAYERS + PLAY BUTTONS --
  const futPlayerIds = getFutPlayerIds();

  // If timer not started, show both FUT IDs & Play buttons
  if (!timerStarted) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-30">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {futPlayerIds.map((p, idx) => (
            <div key={p.user_id} className="flex flex-col items-center bg-card/70 rounded-lg px-6 py-4 m-2 shadow">
              <span className="font-bold text-lg text-primary mb-2">{`Joueur ${idx + 1}`}</span>
              <span className="text-2xl font-semibold text-foreground mb-1">FUT ID :</span>
              <span className="mb-4 text-xl text-muted-foreground">{p.fut_id ? p.fut_id : <span className="italic text-red-500">Non défini</span>}</span>
              {p.user_id === currentUserId && !playReadiness[p.user_id] && (
                <Button 
                  onClick={handlePlayClick} 
                  variant="default" 
                  size="lg"
                  className="mt-2 font-bold"
                >
                  Play
                </Button>
              )}
              {playReadiness[p.user_id] && (
                <div className="text-green-600 font-semibold flex items-center gap-2">
                  Prêt <span className="ml-1">✔️</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 text-lg font-semibold text-muted-foreground">
          {Object.values(playReadiness).filter(v => v).length === 1
            ? "En attente de l'autre joueur..."
            : "Cliquez sur 'Play' pour démarrer."}
        </div>
      </div>
    );
  }

  // Once both hit Play, launch timer full screen
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-30">
      <div className="flex flex-col items-center animate-fade-in">
        <GameTimer matchDuration={roomData.match_duration!} />
        <p className="mt-6 text-xl text-muted-foreground font-semibold">Match en cours</p>
      </div>
    </div>
  );
});

GameCanvasContent.displayName = 'GameCanvasContent';
