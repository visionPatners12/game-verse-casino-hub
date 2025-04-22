
import { useEffect, useRef, useState, memo } from "react";
import { toast } from "sonner";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameTimer } from "./GameTimer";
import { GameCanvasContent } from "./GameCanvasContent";
import { LudoGameScripts } from "./LudoGameScripts";
import { RoomData } from "../types";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

interface GameCanvasContainerProps {
  roomData: RoomData;
  currentUserId: string | null;
}

const GameCanvasContainer = memo(({ roomData, currentUserId }: GameCanvasContainerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const handle = useFullScreenHandle();

  useEffect(() => {
    const handleChange = (state: boolean) => {
      setIsFullscreen(state);
      if (state) {
        toast.success("Mode plein écran activé");
      } else {
        toast.success("Mode plein écran désactivé");
      }
    };

    handle.node?.current?.addEventListener('fullscreenchange', () => {
      handleChange(!!document.fullscreenElement);
    });

    return () => {
      handle.node?.current?.removeEventListener('fullscreenchange', () => {
        handleChange(!!document.fullscreenElement);
      });
    };
  }, [handle]);

  return (
    <FullScreen handle={handle}>
      <div 
        id="game-canvas-container" 
        className="relative bg-accent/10 rounded-lg overflow-hidden w-full aspect-video"
      >
        <LudoGameScripts />
        
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-50 bg-background/80 hover:bg-background/90"
          onClick={isFullscreen ? handle.exit : handle.enter}
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
    </FullScreen>
  );
});

GameCanvasContainer.displayName = 'GameCanvasContainer';

export default GameCanvasContainer;
