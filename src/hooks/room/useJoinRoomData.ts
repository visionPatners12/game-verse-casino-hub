
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GamePlatform, GameMode, TeamType } from "@/types/futarena";

interface GameSettingsType {
  halfLengthMinutes: number;
  legacyDefendingAllowed: boolean;
  customFormationsAllowed: boolean;
  platform: GamePlatform;
  mode: GameMode;
  teamType: TeamType;
  gamerTag?: string;
}

interface RoomDataType {
  roomData: any;
  hostData: any;
  gameSettings: GameSettingsType | null;
}

export function useJoinRoomData(roomId: string | undefined): {
  isLoading: boolean;
  data: RoomDataType | null;
} {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<RoomDataType | null>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      
      try {
        console.log("Fetching room data for:", roomId);
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(roomId);
        
        const { data: roomData, error } = await supabase
          .from('game_sessions')
          .select(`
            *,
            game_players:game_players!game_players_session_id_fkey(
              id,
              user_id,
              display_name,
              users:users(
                username,
                avatar_url,
                psn_username,
                xbox_gamertag,
                ea_id
              )
            ),
            arena_config:arena_game_sessions(*)
          `)
          .eq(isUuid ? 'id' : 'room_id', roomId)
          .single();

        if (error) {
          console.error('Error fetching room data:', error);
          toast.error("Erreur lors de la récupération des données de la salle");
          navigate('/games');
          return;
        }

        if (!roomData) {
          toast.error("Salon introuvable");
          navigate('/games');
          return;
        }

        console.log("Room data retrieved:", roomData);
        const arenaConfig = roomData.arena_config?.[0];
        
        let gameSettings = null;
        let hostData = null;

        if (arenaConfig) {
          gameSettings = {
            halfLengthMinutes: arenaConfig.half_length_minutes || 12,
            legacyDefendingAllowed: arenaConfig.legacy_defending_allowed || false,
            customFormationsAllowed: arenaConfig.custom_formations_allowed || false,
            platform: arenaConfig.platform || 'ps5',
            mode: arenaConfig.mode || 'online_friendlies',
            teamType: arenaConfig.team_type || 'any_teams',
          };
        }
        
        if (roomData.game_players && roomData.game_players.length > 0) {
          const creator = roomData.game_players[0];
          const userData = creator.users;
          
          let gamerTag = userData?.ea_id || "Non spécifié";
          let gamerTagType = "EA ID";
          
          if (arenaConfig?.platform === 'ps5' && userData?.psn_username) {
            gamerTag = userData.psn_username;
            gamerTagType = "PSN Username";
          } else if (arenaConfig?.platform === 'xbox_series' && userData?.xbox_gamertag) {
            gamerTag = userData.xbox_gamertag;
            gamerTagType = "Xbox Gamertag";
          }

          if (gameSettings) {
            gameSettings.gamerTag = gamerTag;
          }
          
          hostData = {
            username: userData?.username || creator.display_name || "Joueur inconnu",
            avatar_url: userData?.avatar_url || null,
            gamer_tag: gamerTag,
            gamer_tag_type: gamerTagType
          };
        }

        setData({ roomData, hostData, gameSettings });
      } catch (error: any) {
        console.error('Error:', error);
        toast.error("Une erreur s'est produite");
        navigate('/games');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId, navigate]);

  return { isLoading, data };
}
