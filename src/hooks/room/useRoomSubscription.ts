
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RoomData } from "@/components/game/types";

export const useRoomSubscription = (
  roomId: string | undefined, 
  setRoomData: (data: RoomData | null) => void
) => {
  useEffect(() => {
    if (!roomId) return;
    
    // Canal pour les mises à jour de la salle
    const roomChannel = supabase
      .channel('room-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          console.log('Room updated:', payload);
          if (payload.new) {
            fetchRoomData(roomId);
          }
        }
      )
      .subscribe();

    // Canal pour les mises à jour des joueurs
    const playersChannel = supabase
      .channel('players-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
          filter: `session_id=eq.${roomId}`
        },
        (payload) => {
          console.log('Players updated:', payload);
          fetchRoomData(roomId);
        }
      )
      .subscribe();

    const fetchRoomData = async (sessionId: string) => {
      const { data: room } = await supabase
        .from('game_sessions')
        .select(`
          *,
          game_players:game_players(
            id,
            display_name,
            user_id,
            current_score,
            is_connected,
            users:user_id(username, avatar_url)
          )
        `)
        .eq('id', sessionId)
        .single();

      if (room) {
        // Vérifier si le joueur est connecté en utilisant la liste connected_players
        const roomWithConnectedStatus = {
          ...room,
          game_players: room.game_players.map(player => ({
            ...player,
            is_connected: room.connected_players?.includes(player.user_id) || false
          }))
        };
        
        console.log('Updated room data:', roomWithConnectedStatus);
        setRoomData(roomWithConnectedStatus as RoomData);
      }
    };

    // Récupération initiale des données
    fetchRoomData(roomId);
    
    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [roomId, setRoomData]);
};

