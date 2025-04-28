
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, DoorOpen } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, 
  AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, 
  AlertDialogCancel } from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface GameControlsProps {
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
  isReady: boolean;
  canStartGame: boolean;
  onToggleReady: () => void;
  onStartGame: () => void;
  onForfeit: () => void;
}

export function GameControls({
  gameStatus,
  isReady,
  canStartGame,
  onToggleReady,
  onStartGame,
  onForfeit
}: GameControlsProps) {
  const isMobile = useIsMobile();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {gameStatus === 'waiting' && (
        <Button 
          onClick={onToggleReady}
          variant={isReady ? "default" : "outline"}
          className="flex items-center gap-2 text-sm"
          size={isMobile ? "sm" : "default"}
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
      
      {isReady && canStartGame && (
        <Button 
          onClick={onStartGame}
          size={isMobile ? "sm" : "default"}
        >
          Start Match
        </Button>
      )}

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive"
            className="flex items-center gap-2 text-sm"
            size={isMobile ? "sm" : "default"}
          >
            <DoorOpen className="h-4 w-4" />
            {!isMobile && "Leave Match"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Forfeit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave the match? This will be considered a <b>forfeit</b> (<span className="text-destructive">automatic loss</span>) and will be visible to other players.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => {
                setShowLeaveDialog(false);
                onForfeit();
              }}
            >
              Yes, I forfeit the match
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
