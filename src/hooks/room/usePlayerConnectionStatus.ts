
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePlayerConnectionStatus(roomId: string | undefined, userId: string | null) {
  useEffect(() => {
    if (roomId && userId) {
      const updatePlayerConnection = async () => {
        try {
          console.log(`Marking player ${userId} as connected in room ${roomId}`);
          const { error } = await supabase
            .from('game_players')
            .update({ is_connected: true })
            .eq('session_id', roomId)
            .eq('user_id', userId);
            
          if (error) {
            console.error('Failed to update player connection status:', error);
          } else {
            console.log(`Successfully marked player ${userId} as connected in room ${roomId}`);
          }
        } catch (err) {
          console.error('Error updating player connection status:', err);
        }
      };
      
      updatePlayerConnection();
    }
  }, [roomId, userId]);
}
