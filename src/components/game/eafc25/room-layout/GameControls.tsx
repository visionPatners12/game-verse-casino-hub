
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, Play, DoorOpen } from "lucide-react";

interface GameControlsProps {
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
  isReady: boolean;
  canStartGame: boolean;
  onToggleReady: () => void;
  onStartGame: () => void;
  onForfeit: () => void;
  showGetReady?: boolean;
  allPlayersReady?: boolean;
  currentPlayerName?: string;
}

export function GameControls({
  gameStatus,
  isReady,
  canStartGame,
  onToggleReady,
  onStartGame,
  onForfeit,
  showGetReady = true,
  allPlayersReady = false,
  currentPlayerName = ""
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {gameStatus === 'waiting' && showGetReady && (
        <Button 
          onClick={onToggleReady}
          variant={isReady ? "default" : "outline"}
          className={`flex items-center gap-2 transition-all duration-300 ${
            isReady 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md" 
              : "border-emerald-500 text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          {isReady ? (
            <>
              <PauseCircle className="h-4 w-4" />
              <span>
                Prêt{currentPlayerName ? ` (${currentPlayerName})` : ""}
              </span>
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4" />
              <span>Se préparer</span>
            </>
          )}
        </Button>
      )}
      
      {allPlayersReady && gameStatus === 'waiting' && (
        <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-pulse">
          Tous les joueurs sont prêts, la partie va démarrer...
        </div>
      )}
      
      {canStartGame && (
        <Button onClick={onStartGame} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Play className="h-4 w-4" />
          Démarrer le match
        </Button>
      )}
      
      <Button 
        variant="destructive"
        onClick={onForfeit}
        className="flex items-center gap-2"
      >
        <DoorOpen className="h-4 w-4" />
        Quitter le match
      </Button>
    </div>
  );
}
