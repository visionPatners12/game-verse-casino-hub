
import { Button } from "@/components/ui/button";
import { Copy, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";
import type { FullScreenHandle } from "react-full-screen";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RoomHeaderProps {
  gameName: string;
  roomId: string;
  fullscreenHandle?: FullScreenHandle;
}

const RoomHeader = ({ gameName, roomId, fullscreenHandle }: RoomHeaderProps) => {
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    
    toast("Code Copié", {
      description: "Le code de la salle a été copié dans le presse-papier!",
    });
  };
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {gameName} Room
        {roomId && (
          <span className="text-sm font-normal text-muted-foreground">
            (Code: <span className="font-mono bg-muted px-1 py-0.5 rounded">{roomId}</span>)
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {fullscreenHandle && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={fullscreenHandle.active ? fullscreenHandle.exit : fullscreenHandle.enter}
                >
                  {fullscreenHandle.active ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {fullscreenHandle.active ? 'Quitter plein écran' : 'Plein écran'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{fullscreenHandle.active ? 'Quitter le mode plein écran' : 'Passer en plein écran'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={copyRoomCode}
              >
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copier le code</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copier le code de la salle</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default RoomHeader;
