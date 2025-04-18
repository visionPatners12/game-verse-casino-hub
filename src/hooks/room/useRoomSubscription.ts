
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
            fetchRoomData(roomId);
          }
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
        setRoomData(room as RoomData);
      }
    };

    // Initial fetch
    fetchRoomData(roomId);
    
    return () => {
      supabase.removeChannel(roomChannel);
    };
  }, [roomId, setRoomData]);
};
