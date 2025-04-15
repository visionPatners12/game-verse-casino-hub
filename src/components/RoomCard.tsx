
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, Unlock, DollarSign, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { GameType } from "./GameCard";

interface RoomCardProps {
  id: string;
  gameType: GameType;
  gameName: string;
  bet: number;
  maxPlayers: number;
  currentPlayers: number;
  isPrivate: boolean;
  createdBy: string;
  winnerCount: number;
}

const RoomCard = ({
  id,
  gameType,
  gameName,
  bet,
  maxPlayers,
  currentPlayers,
  isPrivate,
  createdBy,
  winnerCount,
}: RoomCardProps) => {
  return (
    <div className="room-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{gameName}</h3>
          <p className="text-sm text-muted-foreground">Created by {createdBy}</p>
        </div>
        
        <Badge variant={isPrivate ? "outline" : "secondary"} className="flex items-center gap-1">
          {isPrivate ? (
            <>
              <Lock className="h-3 w-3" />
              Private
            </>
          ) : (
            <>
              <Unlock className="h-3 w-3" />
              Public
            </>
          )}
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-4">
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {currentPlayers}/{maxPlayers} Players
        </Badge>
        
        <Badge variant="outline" className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          ${bet} Bet
        </Badge>
        
        <Badge variant="outline">
          {winnerCount} Winner{winnerCount > 1 ? "s" : ""}
        </Badge>
      </div>
      
      <div className="mt-auto">
        <Button asChild className="w-full">
          <Link to={`/games/${gameType}/room/${id}`}>
            <PlayCircle className="h-4 w-4 mr-2" />
            Join Room
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RoomCard;
