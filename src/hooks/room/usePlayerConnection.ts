
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePlayerConnection = (roomId: string | undefined) => {
  useEffect(() => {
    const markUserConnected = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && roomId) {
        await supabase
          .from('game_players')
          .update({ is_connected: true })
          .eq('session_id', roomId)
          .eq('user_id', user.id);
      }
    };
    
    markUserConnected();
    
    return () => {
      const markUserDisconnected = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && roomId) {
          await supabase
            .from('game_players')
            .update({ is_connected: false })
            .eq('session_id', roomId)
            .eq('user_id', user.id);
        }
      };
      
      markUserDisconnected();
    };
  }, [roomId]);
};
