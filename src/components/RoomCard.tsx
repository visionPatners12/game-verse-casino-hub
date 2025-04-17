
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, Unlock, DollarSign, PlayCircle, Trophy } from "lucide-react";
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
  commissionRate?: number;
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
  commissionRate = 5,
}: RoomCardProps) => {
  // Generate a 6-character room code display (first 6 chars or padded if shorter)
  const roomCode = id.substring(0, 6).toUpperCase().padEnd(6, 'A1B2C3').substring(0, 6);
  
  // Calculate the total pot
  const totalPot = bet * currentPlayers;
  
  // Calculate winner takes amount (total pot minus commission)
  const commissionAmount = (totalPot * commissionRate) / 100;
  const winnerTakes = totalPot - commissionAmount;
  
  return (
    <div className="room-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{gameName}</h3>
          <p className="text-sm text-muted-foreground">
            Created by {createdBy}
            <span className="ml-2 font-mono bg-muted px-1 py-0.5 rounded text-xs">
              {roomCode}
            </span>
          </p>
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
        
        <Badge variant="outline" className="flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          ${winnerTakes.toFixed(2)} Pot
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
