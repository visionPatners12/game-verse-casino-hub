
import { Button } from "@/components/ui/button";
import { Copy, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface RoomHeaderProps {
  gameName: string;
  roomId: string;
  onToggleFullscreen?: () => void;
}

const RoomHeader = ({ gameName, roomId, onToggleFullscreen }: RoomHeaderProps) => {
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
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={onToggleFullscreen}
        >
          <ExternalLink className="h-4 w-4" />
          <span className="hidden sm:inline">Fullscreen</span>
        </Button>
      </div>
    </div>
  );
};

export default RoomHeader;
