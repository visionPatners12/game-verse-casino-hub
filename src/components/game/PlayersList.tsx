
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, CheckCircle2, XCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Player {
  id: string;
  display_name: string;
  user_id: string;
  current_score: number;
  is_connected?: boolean;
  is_ready?: boolean;
  has_forfeited?: boolean;
  users?: {
    username: string;
    avatar_url?: string;
  };
}

interface PlayersListProps {
  players: Player[];
  maxPlayers: number;
  currentUserId: string | null;
}

const PlayersList = ({ players, maxPlayers, currentUserId }: PlayersListProps) => {
  const connectedPlayers = players.filter(player => player.is_connected);

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
        <Users className="h-4 w-4" />
        Players ({connectedPlayers.length}/{maxPlayers})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {players.map(player => (
          <div 
            key={player.id} 
            className={`flex items-center justify-between px-3 py-2 rounded-md ${
              player.user_id === currentUserId 
                ? 'bg-primary text-primary-foreground' 
                : player.is_connected 
                  ? 'bg-muted' 
                  : 'bg-muted/50 text-muted-foreground'
            }`}
          >
            <div className="flex items-center gap-1">
              <Avatar className="h-6 w-6 mr-2">
                {player.users?.avatar_url && (
                  <AvatarImage src={player.users.avatar_url} alt={player.users?.username || player.display_name} />
                )}
                <AvatarFallback>
                  {(player.users?.username || player.display_name).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden flex items-center gap-1">
                <span className={`font-medium truncate block ${player.has_forfeited ? "line-through text-destructive" : ""}`}>
                  {player.users?.username || player.display_name}
                </span>
                {player.has_forfeited && (
                  <X className="w-4 h-4 text-destructive ml-1" aria-label="Forfait" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {player.current_score > 0 && (
                <span className="text-xs mr-1">{player.current_score} pts</span>
              )}
              {player.is_ready && player.is_connected && !player.has_forfeited && (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                </Badge>
              )}
              {!player.is_connected && !player.has_forfeited && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                </Badge>
              )}
              {player.has_forfeited && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <X className="h-3 w-3" /> Abandon
                </Badge>
              )}
            </div>
          </div>
        ))}
        {Array.from({ length: maxPlayers - players.length }).map((_, index) => (
          <div 
            key={`empty-${index}`}
            className="px-3 py-2 rounded-md border border-dashed border-muted-foreground text-muted-foreground text-center"
          >
            En attente de joueur...
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersList;
