
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, Unlock, DollarSign, PlayCircle, Trophy } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameCode } from "@/lib/gameTypes";
import { JoinRoomConfirmDialog } from "./games/JoinRoomConfirmDialog";
import { useJoinRoom } from "@/hooks/room/useJoinRoom";

interface RoomCardProps {
  id: string;
  gameType: GameCode;
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { joinRoom } = useJoinRoom();
  
  const roomCode = id.substring(0, 6).toUpperCase().padEnd(6, 'A1B2C3').substring(0, 6);
  
  // Calculate total pot with commission taken into account
  const totalPot = bet * currentPlayers * (1 - (commissionRate / 100));
  
  const handleJoinConfirm = async () => {
    setIsJoining(true);
    await joinRoom(roomCode, () => setShowConfirmDialog(false));
    setIsJoining(false);
  };

  return (
    <>
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
            ${totalPot.toFixed(2)} Prize
          </Badge>
          
          <Badge variant="outline">
            {winnerCount} Winner{winnerCount > 1 ? "s" : ""}
          </Badge>
        </div>
        
        <div className="mt-auto">
          <Button 
            className="w-full"
            onClick={() => setShowConfirmDialog(true)}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Join Room
          </Button>
        </div>
      </div>

      <JoinRoomConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleJoinConfirm}
        isLoading={isJoining}
        roomData={{
          game_type: gameType,
          entry_fee: bet,
          max_players: maxPlayers,
          current_players: currentPlayers,
          winner_count: winnerCount,
          commission_rate: commissionRate
        }}
      />
    </>
  );
};

export default RoomCard;
