
import { Button } from "@/components/ui/button";

interface GameControlsProps {
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
  isReady: boolean;
  isReadyLoading?: boolean;
  canStartGame: boolean;
  onToggleReady: () => void;
  onStartGame: () => void;
  onForfeit: () => void;
  showGetReady: boolean;
}

export function GameControls({
  gameStatus,
  isReady,
  isReadyLoading = false,
  canStartGame,
  onToggleReady,
  onStartGame,
  onForfeit,
  showGetReady
}: GameControlsProps) {
  console.log('[GameControls] Props:', { 
    gameStatus, 
    isReady, 
    isReadyLoading, 
    canStartGame, 
    showGetReady 
  });

  if (gameStatus === 'waiting' && showGetReady) {
    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={isReady ? "destructive" : "default"}
          onClick={onToggleReady}
          disabled={isReadyLoading}
          className="relative"
        >
          {isReadyLoading ? (
            <>
              <span className="opacity-0">{isReady ? "Not Ready" : "Get Ready"}</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            </>
          ) : (
            isReady ? "Not Ready" : "Get Ready"
          )}
        </Button>
        
        {canStartGame && (
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={onStartGame}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Start Game
          </Button>
        )}
      </div>
    );
  }
  
  if (gameStatus === 'playing') {
    return (
      <Button 
        size="sm" 
        variant="destructive" 
        onClick={onForfeit}
      >
        Forfeit
      </Button>
    );
  }
  
  return null;
}
