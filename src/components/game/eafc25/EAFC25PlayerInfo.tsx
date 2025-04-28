
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { GamePlatform } from "@/types/futarena";
import { MonitorPlay, Gamepad2, Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Player {
  id: string;
  display_name: string;
  user_id: string;
  current_score: number;
  is_connected?: boolean;
  is_ready?: boolean;
  has_forfeited?: boolean;
  ea_id?: string;
  users?: {
    username: string;
    avatar_url?: string;
    psn_username?: string;
    xbox_gamertag?: string;
    ea_id?: string;
  };
}

interface EAFC25PlayerInfoProps {
  player: Player;
  isCurrentUser: boolean;
  platform: GamePlatform | string;
}

export function EAFC25PlayerInfo({ player, isCurrentUser, platform }: EAFC25PlayerInfoProps) {
  const [arenaPlayerData, setArenaPlayerData] = useState<{
    psn_username?: string;
    xbox_gamertag?: string;
    ea_id?: string;
  } | null>(null);

  useEffect(() => {
    const fetchArenaPlayerData = async () => {
      if (!player.user_id) return;
      
      try {
        const { data, error } = await supabase
          .from('arena_players')
          .select('psn_username, xbox_gamertag, ea_id')
          .eq('user_id', player.user_id)
          .single();
          
        if (error) {
          console.error("Error fetching arena player data:", error);
          return;
        }
        
        if (data) {
          setArenaPlayerData(data);
        }
      } catch (error) {
        console.error("Error in arena player data fetch:", error);
      }
    };
    
    fetchArenaPlayerData();
  }, [player.user_id]);

  const platformIcon = platform === "ps5" ? (
    <MonitorPlay className="h-4 w-4 text-blue-500" />
  ) : platform === "xbox_series" ? (
    <Gamepad2 className="h-4 w-4 text-green-500" />
  ) : (
    <Globe className="h-4 w-4 text-purple-500" />
  );

  const displayName = player.users?.username || player.display_name;
  
  // Get the EA ID from arena_players first, then from player.users, then from player, or fallback
  const eaId = arenaPlayerData?.ea_id || player.ea_id || player.users?.ea_id || "EA ID Not Set";
  
  // Get the console ID from arena_players first, then from player.users, or fallback
  const psnId = arenaPlayerData?.psn_username || player.users?.psn_username || "PSN ID Not Set";
  const xboxId = arenaPlayerData?.xbox_gamertag || player.users?.xbox_gamertag || "Xbox Gamertag Not Set";
  
  const consoleId = platform === "ps5" ? psnId : xboxId;

  return (
    <Card 
      className={cn(
        isCurrentUser ? "border-primary/50" : "border-muted",
        player.is_ready ? "bg-green-500/10 border-green-500/50" : "",
        "transition-colors duration-200"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            {player.users?.avatar_url && (
              <AvatarImage src={player.users.avatar_url} alt={displayName} />
            )}
            <AvatarFallback>
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{displayName}</span>
              {isCurrentUser && <span className="text-xs text-muted-foreground">(You)</span>}
              {player.is_ready && (
                <Badge variant="success" className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Ready
                </Badge>
              )}
            </div>
            
            <div className="text-sm flex items-center gap-1 mt-1">
              {platformIcon}
              <span className="text-muted-foreground">
                {platform === "cross_play" ? "Cross Play" : platform === "ps5" ? "PlayStation 5" : "Xbox Series X|S"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">EA ID:</span>
            <span className="font-mono">{eaId}</span>
          </div>
          
          {platform !== "cross_play" && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {platform === "ps5" ? "PSN ID:" : "Xbox Gamertag:"}
              </span>
              <span className="font-mono">{consoleId}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
