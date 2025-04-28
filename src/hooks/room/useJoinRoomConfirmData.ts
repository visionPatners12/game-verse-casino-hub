
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
          .select('*')
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
        
        // Now fetch players for this room in a separate query
        const { data: players, error: playersError } = await supabase
          .from('game_players')
          .select('*')
          .eq('session_id', room.id);
          
        if (playersError) {
          console.error('Error fetching players:', playersError);
        } else {
          console.log("Players data:", players);
          
          // Add players to room data
          setRoomData({
            ...room,
            game_players: players
          });
          
          // If we have players, fetch host data (first player is considered the host)
          if (players && players.length > 0) {
            const hostPlayer = players[0];
            console.log("Host player:", hostPlayer);
            
            try {
              // Get the host user information - use maybeSingle() to handle potential missing data
              const { data: hostUserData, error: hostError } = await supabase
                .from('users')
                .select('username, avatar_url, psn_username, xbox_gamertag, ea_id')
                .eq('id', hostPlayer.user_id)
                .maybeSingle();
                
              if (hostError) {
                console.error('Error fetching host user data:', hostError);
              } else {
                console.log("Host user data:", hostUserData);
                // Only set host data if we actually found user data
                if (hostUserData) {
                  setHostData({
                    ...hostPlayer,
                    users: hostUserData
                  });
                } else {
                  console.log("No host user data found for ID:", hostPlayer.user_id);
                  // Still set basic host data without user details
                  setHostData({
                    ...hostPlayer,
                    users: null
                  });
                }
              }
            } catch (err) {
              console.error('Exception when fetching host user data:', err);
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
