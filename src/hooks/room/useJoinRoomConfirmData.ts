
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
        
        // Fetch room data and player information in a single query
        const { data: room, error } = await supabase
          .from('game_sessions')
          .select(`
            *,
            game_players!game_players_session_id_fkey (
              id, 
              user_id,
              display_name,
              ea_id
            )
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

        console.log("Données de la salle récupérées:", room);
        setRoomData(room);
        
        // If we have players, fetch host data
        if (room.game_players && room.game_players.length > 0) {
          const hostPlayer = room.game_players[0];
          console.log("Host player:", hostPlayer);
          
          // Get the host user information
          const { data: hostUserData, error: hostError } = await supabase
            .from('users')
            .select('*')
            .eq('id', hostPlayer.user_id)
            .single();
            
          if (hostError) {
            console.error('Error fetching host user data:', hostError);
          } else {
            console.log("Host user data:", hostUserData);
            setHostData({
              ...hostPlayer,
              users: hostUserData
            });
          }
        }
        
        // Fetch additional game configuration if it's a FIFA/EA game
        if (room.game_type?.toLowerCase() === 'eafc25' || room.game_type?.toLowerCase() === 'futarena') {
          const { data: arenaConfig, error: configError } = await supabase
            .from('arena_game_sessions')
            .select('*')
            .eq('id', room.id)
            .single();
            
          if (configError) {
            console.error('Error fetching arena configuration:', configError);
          } else if (arenaConfig) {
            console.log("Configuration arène récupérée:", arenaConfig);
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
