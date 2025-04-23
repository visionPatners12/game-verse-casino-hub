
import { useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuthConnectionStatus(session: Session | null) {
  useEffect(() => {
    if (session?.user?.id) {
      const updateConnectionStatus = async () => {
        try {
          const { error } = await supabase
            .from('users')
            .update({ is_connected: true })
            .eq('id', session.user.id);
            
          if (error) {
            console.error('Error updating connection status:', error);
          } else {
            console.log(`User ${session.user.id} marked as connected`);
          }
        } catch (err) {
          console.error('Error in updateConnectionStatus:', err);
        }
      };
      
      updateConnectionStatus();

      const handleBeforeUnload = async () => {
        try {
          await supabase
            .from('users')
            .update({ is_connected: false })
            .eq('id', session.user.id);
        } catch (err) {
          console.error('Error marking user as disconnected:', err);
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      const connectionInterval = setInterval(updateConnectionStatus, 60000);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        clearInterval(connectionInterval);
        handleBeforeUnload();
      };
    }
  }, [session?.user?.id]);
}
