
import { Button } from "@/components/ui/button";
import { Copy, Share2, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";
import type { FullScreenHandle } from "react-full-screen";

interface RoomHeaderProps {
  gameName: string;
  roomId: string;
  fullscreenHandle?: FullScreenHandle;
}

const RoomHeader = ({ gameName, roomId, fullscreenHandle }: RoomHeaderProps) => {
  const copyRoomLink = () => {
    const roomUrl = `${window.location.origin}${window.location.pathname}`;
    navigator.clipboard.writeText(roomUrl);
    
    toast("Link Copied", {
      description: "Room link copied to clipboard!",
    });
  };
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {gameName} Room
        {roomId && (
          <span className="text-sm font-normal text-muted-foreground">
            (Room Code: <span className="font-mono bg-muted px-1 py-0.5 rounded">{roomId}</span>)
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {fullscreenHandle && (
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
              {fullscreenHandle.active ? 'Exit Fullscreen' : 'Fullscreen'}
            </span>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={copyRoomLink}
        >
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">Copy Link</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => {
            toast("Sharing", {
              description: "Opening share dialog",
            });
          }}
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>
    </div>
  );
};

export default RoomHeader;
