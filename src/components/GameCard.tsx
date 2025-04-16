
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

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
  onPublicRoomClick?: () => void;
  onCreateRoomClick?: () => void;
}

const GameCard = ({
  id,
  name,
  description,
  image,
  type,
  players,
  active = true,
  onPublicRoomClick,
  onCreateRoomClick,
}: GameCardProps) => {
  return (
    <div className="game-card group">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="game-card-image group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute top-3 right-3">
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
            onClick={onPublicRoomClick} 
            className="w-full"
          >
            Public Room
          </Button>
          <Button 
            onClick={onCreateRoomClick} 
            variant="outline"
            className="w-full"
          >
            Create a Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
