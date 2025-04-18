
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Player {
  id: string;
  display_name: string;
  is_connected?: boolean;
  user_id: string;
  users?: {
    username: string;
    avatar_url?: string;
  };
}

interface RoomPlayersListProps {
  players: Player[];
  maxPlayers: number;
  currentPlayers: number;
}

export const RoomPlayersList = ({ players, maxPlayers, currentPlayers }: RoomPlayersListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span>
            {currentPlayers}/{maxPlayers} Players
          </span>
        </div>
        {currentPlayers < maxPlayers ? (
          <span className="text-sm text-muted-foreground">
            Waiting for players...
          </span>
        ) : (
          <span className="text-sm text-destructive">
            Room is full
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {players.map((player: Player) => (
          <div 
            key={player.id}
            className="flex items-center justify-between p-3 rounded-md bg-muted"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {player.users?.avatar_url && (
                  <AvatarImage src={player.users.avatar_url} alt={player.users?.username || player.display_name} />
                )}
                <AvatarFallback>
                  {(player.users?.username || player.display_name).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">
                {player.users?.username || player.display_name}
              </span>
            </div>
            <Badge variant={player.is_connected ? "default" : "destructive"}>
              {player.is_connected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        ))}
        {Array.from({ length: maxPlayers - currentPlayers }).map((_, i) => (
          <div 
            key={`empty-${i}`}
            className="flex items-center gap-2 p-3 rounded-md border border-dashed border-muted-foreground/20"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">Waiting...</span>
          </div>
        ))}
      </div>
    </div>
  );
};
