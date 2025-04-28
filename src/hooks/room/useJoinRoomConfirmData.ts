
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useJoinRoomConfirmData = (roomId: string | undefined) => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState<any>(null);
  const [hostData, setHostData] = useState<any>(null);
  const [isRoomLoading, setIsRoomLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      
      try {
        setIsRoomLoading(true);
        console.log("Fetching room data for roomId:", roomId);
        
        // First fetch the basic room data
        const { data: room, error } = await supabase
          .from('game_sessions')
          .select(`
            *,
            game_players (*)
          `)
          .eq('room_id', roomId.toUpperCase())
          .single();
          
        if (error) {
          console.error('Error fetching room data:', error);
          toast.error("Erreur lors de la récupération des données de la salle");
          navigate('/games');
          return;
        }
        
        if (!room) {
          toast.error("Salon introuvable");
          navigate('/games');
          return;
        }

        console.log("Room data retrieved:", room);
        
        // If we have players, fetch all their arena data at once
        if (room.game_players && room.game_players.length > 0) {
          const playerIds = room.game_players.map((p: any) => p.user_id);
          
          // Fetch all arena players data in one query
          const { data: arenaPlayers, error: playersError } = await supabase
            .from('arena_players')
            .select('*')
            .in('user_id', playerIds);
            
          if (playersError) {
            console.error('Error fetching arena players:', playersError);
          } else {
            console.log("Arena players data:", arenaPlayers);
            
            // Map arena data to players
            const enrichedPlayers = room.game_players.map((player: any) => {
              const arenaData = arenaPlayers?.find(ap => ap.user_id === player.user_id);
              return {
                ...player,
                users: {
                  username: arenaData?.display_name || player.display_name || 'Player',
                  avatar_url: arenaData?.avatar_url || null,
                  psn_username: arenaData?.psn_username || null,
                  xbox_gamertag: arenaData?.xbox_gamertag || null,
                  ea_id: arenaData?.ea_id || player.ea_id || null
                }
              };
            });
            
            setRoomData({
              ...room,
              game_players: enrichedPlayers
            });
            
            // Set host data (first player)
            if (enrichedPlayers.length > 0) {
              setHostData(enrichedPlayers[0]);
            }
          }
        }
        
        // Fetch additional game configuration if it's a FIFA/EA game
        if (room.game_type?.toLowerCase() === 'eafc25' || room.game_type?.toLowerCase() === 'futarena') {
          const { data: arenaConfig, error: configError } = await supabase
            .from('arena_game_sessions')
            .select('*')
            .eq('id', room.id)
            .maybeSingle();
            
          if (configError) {
            console.error('Error fetching arena configuration:', configError);
          } else if (arenaConfig) {
            console.log("Arena configuration retrieved:", arenaConfig);
            setRoomData(prev => ({
              ...prev,
              ...arenaConfig
            }));
          }
        }
      } catch (error: any) {
        console.error('Error:', error);
        toast.error("Une erreur s'est produite");
        navigate('/games');
      } finally {
        setIsRoomLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId, navigate]);

  return { roomData, hostData, isRoomLoading };
};
