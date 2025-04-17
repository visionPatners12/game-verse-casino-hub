
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2, Smartphone, Play, Users } from "lucide-react";

interface GameStructureProps {
  gameComponent: React.ReactNode;
  assetsToLoad?: string[];
  gameParameters: {
    gameType: string;
    betAmount: number;
    maxPlayers: number;
    currentPlayers: number;
    roomId: string;
    totalPot: number;
  };
}

const GameStructure = ({ gameComponent, assetsToLoad = [], gameParameters }: GameStructureProps) => {
  const [gameState, setGameState] = useState<'loading' | 'menu' | 'playerSelection' | 'playing'>('loading');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedPlayers, setSelectedPlayers] = useState(2);
  const [playerIcons, setPlayerIcons] = useState<string[]>(["P1", "P2", "P3", "P4"]);
  const isMobile = useIsMobile();
  const [isPortrait, setIsPortrait] = useState(false);

  // Simulate assets loading
  useEffect(() => {
    let progress = 0;
    const totalAssets = assetsToLoad.length || 10; // Use 10 as default if no assets provided
    
    const interval = setInterval(() => {
      progress += 10;
      setLoadingProgress(Math.min(100, progress));
      
      if (progress >= 100) {
        clearInterval(interval);
        setGameState('menu');
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [assetsToLoad]);
  
  // Detect device orientation
  useEffect(() => {
    const checkOrientation = () => {
      if (window.innerHeight > window.innerWidth) {
        setIsPortrait(true);
      } else {
        setIsPortrait(false);
      }
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);
  
  // Handle player icon change
  const switchPlayerIcon = (playerIndex: number) => {
    const icons = ["P1", "P2", "P3", "P4", "P5", "P6"];
    const currentIconIndex = icons.indexOf(playerIcons[playerIndex]);
    const newIconIndex = (currentIconIndex + 1) % icons.length;
    
    const newPlayerIcons = [...playerIcons];
    newPlayerIcons[playerIndex] = icons[newIconIndex];
    setPlayerIcons(newPlayerIcons);
  };
  
  // Start game with computer opponents
  const startGameWithComputer = () => {
    setGameState('playing');
  };
  
  // Start game with human players
  const startGameWithPlayers = () => {
    setGameState('playing');
  };
  
  if (isMobile && isPortrait) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <Smartphone className="h-16 w-16 mb-4 animate-pulse" />
        <h2 className="text-xl font-bold mb-2">Please Rotate Your Device</h2>
        <p className="text-muted-foreground">This game is best played in landscape mode.</p>
      </div>
    );
  }
  
  if (gameState === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <h2 className="text-xl font-bold mb-2">Loading Game Assets</h2>
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p className="mt-2 text-muted-foreground">{loadingProgress}%</p>
      </div>
    );
  }
  
  if (gameState === 'menu') {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">{gameParameters.gameType} Game</h1>
        <div className="flex flex-col gap-4 w-64">
          <button 
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            onClick={() => setGameState('playerSelection')}
          >
            <Play className="h-5 w-5" />
            Play Game
          </button>
        </div>
      </div>
    );
  }
  
  if (gameState === 'playerSelection') {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-6">Select Players</h2>
        
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <button 
              className={`px-4 py-2 rounded-lg ${selectedPlayers === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              onClick={() => setSelectedPlayers(2)}
            >
              2 Players
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${selectedPlayers === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              onClick={() => setSelectedPlayers(3)}
            >
              3 Players
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${selectedPlayers === 4 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              onClick={() => setSelectedPlayers(4)}
            >
              4 Players
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {Array.from({ length: selectedPlayers }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center cursor-pointer"
                onClick={() => switchPlayerIcon(index)}
              >
                {playerIcons[index]}
              </div>
              <span>Player {index + 1}</span>
            </div>
          ))}
        </div>
        
        <div className="flex gap-4">
          <button 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={startGameWithComputer}
          >
            VS Computer
          </button>
          <button 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={startGameWithPlayers}
          >
            <Users className="h-4 w-4" />
            {selectedPlayers} Players
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full">
      {gameComponent}
    </div>
  );
};

export default GameStructure;
