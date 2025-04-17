
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";

interface Player {
  id: string;
  display_name: string;
  user_id: string;
  current_score: number;
}

interface PlayersListProps {
  players: Player[];
  maxPlayers: number;
  currentUserId: string | null;
}

const PlayersList = ({ players, maxPlayers, currentUserId }: PlayersListProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
        <Users className="h-4 w-4" />
        Players ({players.length}/{maxPlayers})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {players.map(player => (
          <div 
            key={player.id} 
            className={`flex items-center px-3 py-2 rounded-md ${player.user_id === currentUserId ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>
                {player.display_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <span className="font-medium truncate block">{player.display_name}</span>
              {player.current_score > 0 && (
                <span className="text-xs">{player.current_score} pts</span>
              )}
            </div>
          </div>
        ))}
        
        {Array.from({ length: maxPlayers - players.length }).map((_, index) => (
          <div 
            key={`empty-${index}`}
            className="px-3 py-2 rounded-md border border-dashed border-muted-foreground text-muted-foreground text-center"
          >
            Waiting for player...
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersList;
