
import { useEffect, useRef, useState, memo } from "react";
import { toast } from "sonner";
import { Fullscreen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameTimer } from "./GameTimer";
import { GameCanvasContent } from "./GameCanvasContent";
import { RoomData } from "../types";

interface GameCanvasContainerProps {
  roomData: RoomData;
  currentUserId: string | null;
}

const GameCanvasContainer = memo(({ roomData, currentUserId }: GameCanvasContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!containerRef.current) {
        toast.error("Fullscreen container not found");
        return;
      }
      
      // Important: Get the game canvas container from the DOM
      const gameCanvasElement = containerRef.current.querySelector("#game-canvas-container");
      const targetElement = gameCanvasElement || containerRef.current;

      if (!document.fullscreenElement) {
        await targetElement.requestFullscreen();
        setIsFullscreen(true);
        toast.success("Fullscreen mode enabled");
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        toast.success("Exited fullscreen mode");
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
      toast.error("Could not toggle fullscreen mode. Your browser might not support this feature.");
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
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        <Fullscreen className="h-4 w-4" />
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

// Ajouter un displayName pour faciliter le debugging
GameCanvasContainer.displayName = 'GameCanvasContainer';

export default GameCanvasContainer;

