
import { useEffect, useRef, useState, memo } from "react";
import { toast } from "sonner";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameTimer } from "./GameTimer";
import { GameCanvasContent } from "./GameCanvasContent";
import { LudoGameScripts } from "./LudoGameScripts";
import { RoomData } from "../types";

interface GameCanvasContainerProps {
  roomData: RoomData;
  currentUserId: string | null;
}

const GameCanvasContainer = memo(({ roomData, currentUserId }: GameCanvasContainerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement;
      setIsFullscreen(!!fullscreenElement);
      
      // Make sure we resize the game canvas when fullscreen changes
      if (window.resizeGameFunc) {
        console.log("Resizing game after fullscreen change via fullscreenchange event");
        setTimeout(window.resizeGameFunc, 100);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (isFullscreen) {
      console.log("Exiting fullscreen mode");
      document.exitFullscreen()
        .then(() => {
          toast.success("Mode plein écran désactivé");
        })
        .catch(err => {
          console.error(`Erreur lors de la sortie du mode plein écran: ${err.message}`);
        });
    } else {
      console.log("Entering fullscreen mode");
      containerRef.current.requestFullscreen()
        .then(() => {
          toast.success("Mode plein écran activé");
        })
        .catch(err => {
          console.error(`Erreur lors du passage en mode plein écran: ${err.message}`);
        });
    }
  };

  return (
    <div 
      id="game-canvas-container" 
      ref={containerRef}
      className={`relative bg-accent/10 rounded-lg overflow-hidden w-full aspect-video ${isFullscreen ? 'fixed inset-0 z-50 aspect-auto bg-black' : ''}`}
    >
      <LudoGameScripts />
      
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
        isFullscreen={isFullscreen}
      />
    </div>
  );
});

GameCanvasContainer.displayName = 'GameCanvasContainer';

export default GameCanvasContainer;
