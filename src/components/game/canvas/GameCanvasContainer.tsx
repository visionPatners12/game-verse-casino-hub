
import { useEffect, useRef, useState, memo } from "react";
import { toast } from "sonner";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameTimer } from "./GameTimer";
import { GameCanvasContent } from "./GameCanvasContent";
import { RoomData } from "../types";

interface GameCanvasContainerProps {
  roomData: RoomData;
  currentUserId: string | null;
}

const GameCanvasContainer = memo(({ roomData, currentUserId }: GameCanvasContainerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = async () => {
    const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    if (!gameCanvas) {
      toast.error("Canvas non trouvé");
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await gameCanvas.requestFullscreen();
        setIsFullscreen(true);
        toast.success("Mode plein écran activé");
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        toast.success("Mode plein écran désactivé");
      }
    } catch (err) {
      console.error('Erreur lors du passage en plein écran:', err);
      toast.error("Impossible de passer en mode plein écran");
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative bg-accent/10 rounded-lg overflow-hidden w-full aspect-video"
    >
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-50 bg-background/80 hover:bg-background/90"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Quitter le plein écran" : "Passer en plein écran"}
      >
        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </Button>

      {roomData.game_type === "futarena" && roomData.match_duration && (
        <GameTimer matchDuration={roomData.match_duration} />
      )}

      <GameCanvasContent 
        roomData={roomData}
        currentUserId={currentUserId}
      />
    </div>
  );
});

GameCanvasContainer.displayName = 'GameCanvasContainer';

export default GameCanvasContainer;
