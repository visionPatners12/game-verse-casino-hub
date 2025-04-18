
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
            // Get current room data and merge with new data
            fetchAndUpdateRoomData(payload.new);
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
    
    const fetchAndUpdateRoomData = async (newRoomData: any) => {
      // Fetch current room data to merge with new updates
      const { data: currentRoom } = await supabase
        .from('game_sessions')
        .select(`
          *,
          game_players(
            id,
            display_name,
            user_id,
            current_score,
            is_connected,
            users:user_id(username, avatar_url)
          )
        `)
        .eq('id', roomId)
        .single();

      if (currentRoom) {
        // Create a new RoomData object with merged data
        const updatedRoomData: RoomData = {
          ...currentRoom,
          ...newRoomData
        };
        
        setRoomData(updatedRoomData);
      }
    };
    
    const fetchUpdatedPlayers = async () => {
      const { data, error } = await supabase
        .from('game_players')
        .select('*, users:user_id(username, avatar_url)')
        .eq('session_id', roomId);
      
      if (!error && data) {
        // Fetch the current room data
        const { data: currentRoom } = await supabase
          .from('game_sessions')
          .select('*')
          .eq('id', roomId)
          .single();
          
        if (currentRoom) {
          // Create a new complete room data object
          const updatedRoomData: RoomData = {
            ...currentRoom,
            game_players: data,
            current_players: data.length
          };
          
          setRoomData(updatedRoomData);
        }
      }
    };
    
    // Initial fetch to set room data
    fetchUpdatedPlayers();
    
    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [roomId, setRoomData]);
};
