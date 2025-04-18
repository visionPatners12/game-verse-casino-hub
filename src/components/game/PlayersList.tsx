
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Player {
  id: string;
  display_name: string;
  user_id: string;
  current_score: number;
  is_connected?: boolean;
}

interface PlayerWithUsername extends Player {
  username?: string;
}

interface PlayersListProps {
  players: Player[];
  maxPlayers: number;
  currentUserId: string | null;
}

const PlayersList = ({ players, maxPlayers, currentUserId }: PlayersListProps) => {
  const [playersWithUsernames, setPlayersWithUsernames] = useState<PlayerWithUsername[]>([]);
  
  useEffect(() => {
    // Fetch usernames for each player from the users table
    const fetchUsernames = async () => {
      // Only proceed if we have players
      if (!players?.length) return;
      
      try {
        // Extract unique user IDs to fetch
        const userIds = players
          .map(player => player.user_id)
          .filter(Boolean);
        
        if (userIds.length === 0) {
          // If there are no valid user IDs, just use the original players
          setPlayersWithUsernames(players);
          return;
        }
        
        // Fetch user data from the public.users table (not auth.users)
        const { data, error } = await supabase
          .from('users')
          .select('id, username')
          .in('id', userIds);
          
        if (error) {
          console.error("Error fetching usernames:", error);
          setPlayersWithUsernames(players);
          return;
        }
        
        // Map usernames to players
        const enhancedPlayers = players.map(player => {
          const userData = data?.find(user => user.id === player.user_id);
          return {
            ...player,
            username: userData?.username || player.display_name
          };
        });
        
        setPlayersWithUsernames(enhancedPlayers);
        console.log("Fetched player data:", enhancedPlayers);
      } catch (error) {
        console.error("Error in username fetching:", error);
        setPlayersWithUsernames(players);
      }
    };
    
    fetchUsernames();
  }, [players]);

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
        <Users className="h-4 w-4" />
        Players ({playersWithUsernames.length}/{maxPlayers})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {playersWithUsernames.map(player => (
          <div 
            key={player.id} 
            className={`flex items-center px-3 py-2 rounded-md ${
              player.user_id === currentUserId 
                ? 'bg-primary text-primary-foreground' 
                : player.is_connected === false 
                  ? 'bg-muted/50 text-muted-foreground' 
                  : 'bg-muted'
            }`}
          >
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>
                {player.username 
                  ? player.username.charAt(0).toUpperCase() 
                  : player.display_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <span className="font-medium truncate block">
                {player.username || player.display_name}
                {player.is_connected === false && ' (Disconnected)'}
              </span>
              {player.current_score > 0 && (
                <span className="text-xs">{player.current_score} pts</span>
              )}
            </div>
          </div>
        ))}
        
        {Array.from({ length: maxPlayers - playersWithUsernames.length }).map((_, index) => (
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
