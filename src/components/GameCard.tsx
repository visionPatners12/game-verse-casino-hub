import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Globe } from "lucide-react";
import { useState } from "react";
import { JoinGameDialog } from "@/components/games/JoinGameDialog";
import { useNavigate } from "react-router-dom";

export type GameType = "ludo" | "checkers" | "tictactoe" | "checkgame";

interface GameCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  type: GameType;
  players: {
    min: number;
    max: number;
  };
  active?: boolean;
}

const GameCard = ({
  id,
  name,
  description,
  image,
  type,
  players,
  active = true,
}: GameCardProps) => {
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handlePublicRoomClick = () => {
    navigate(`/games/${type}/public`);
  };

  return (
    <div className="game-card group relative">
      <Button 
        size="icon" 
        variant="outline" 
        className="absolute top-3 right-3 z-10 bg-background/50 hover:bg-background/80"
        onClick={handlePublicRoomClick}
      >
        <Globe className="h-4 w-4" />
      </Button>

      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="game-card-image group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-background/80 backdrop-blur-sm"
          >
            <Users className="h-3 w-3" />
            {players.min === players.max
              ? players.min
              : `${players.min}-${players.max}`}
          </Badge>
        </div>
      </div>
      
      <div className="game-card-content">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="mt-4 flex gap-2">
          <Button 
            onClick={handlePublicRoomClick} 
            className="w-full"
          >
            Public Room
          </Button>
          <Button 
            onClick={() => setIsJoinDialogOpen(true)} 
            variant="outline"
            className="w-full"
          >
            Join a Room
          </Button>
        </div>
      </div>

      <JoinGameDialog 
        open={isJoinDialogOpen} 
        onOpenChange={setIsJoinDialogOpen} 
      />
    </div>
  );
};

export default GameCard;
