
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
}

export function GameControls({
  gameStatus,
  isReady,
  canStartGame,
  onToggleReady,
  onStartGame,
  onForfeit,
  showGetReady = true
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {gameStatus === 'waiting' && showGetReady && (
        <Button 
          onClick={onToggleReady}
          variant={isReady ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          {isReady ? (
            <>
              <PauseCircle className="h-4 w-4" />
              Ready
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4" />
              Get Ready
            </>
          )}
        </Button>
      )}
      
      {canStartGame && (
        <Button onClick={onStartGame} className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Start Match
        </Button>
      )}
      
      <Button 
        variant="destructive"
        onClick={onForfeit}
        className="flex items-center gap-2"
      >
        <DoorOpen className="h-4 w-4" />
        Leave Match
      </Button>
    </div>
  );
}
