
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RoomData } from "@/components/game/types";

export const useRoomSubscription = (
  roomId: string | undefined, 
  setRoomData: (data: RoomData | null) => void
) => {
  useEffect(() => {
    if (!roomId) return;
    
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
            setRoomData(prev => ({
              ...prev,
              ...payload.new
            } as RoomData));
          }
        }
      )
      .subscribe();
    
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
          fetchUpdatedPlayers();
        }
      )
      .subscribe();
    
    const fetchUpdatedPlayers = async () => {
      const { data, error } = await supabase
        .from('game_players')
        .select('*, users:user_id(username, avatar_url)')
        .eq('session_id', roomId);
      
      if (!error && data) {
        setRoomData(prev => prev ? {
          ...prev,
          game_players: data,
          current_players: data.length
        } as RoomData : null);
      }
    };
    
    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [roomId, setRoomData]);
};
