
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useRoomConnectionStatus(roomId: string | undefined, userId: string | null) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionVerified, setConnectionVerified] = useState(false);

  useEffect(() => {
    if (!roomId || !userId) return;

    const verifyConnection = async () => {
      try {
        setIsConnecting(true);
        
        // First, verify the game_players entry
        const { data: playerData } = await supabase
          .from('game_players')
          .select('is_connected')
          .eq('session_id', roomId)
          .eq('user_id', userId)
          .single();
          
        if (!playerData?.is_connected) {
          console.log(`Player ${userId} not properly connected to room ${roomId}, reconnecting...`);
          
          // Update game_players connection status
          await supabase
            .from('game_players')
            .update({ is_connected: true })
            .eq('session_id', roomId)
            .eq('user_id', userId);
        }

        // Then verify active_room_id
        const { data: userData } = await supabase
          .from('users')
          .select('active_room_id')
          .eq('id', userId)
          .single();
          
        if (userData?.active_room_id !== roomId) {
          console.log(`User ${userId} active_room_id mismatch, fixing...`);
          
          // Update active_room_id directly
          await supabase
            .from('users')
            .update({ active_room_id: roomId })
            .eq('id', userId);
        }

        setConnectionVerified(true);
      } catch (error) {
        console.error("Error verifying room connection:", error);
        toast.error("Error verifying room connection. Please try refreshing the page.");
      } finally {
        setIsConnecting(false);
      }
    };

    verifyConnection();

    // Set up real-time subscription to monitor connection status
    const channel = supabase
      .channel(`room-connection-${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_players',
        filter: `session_id=eq.${roomId}`,
      }, async (payload) => {
        if (payload.new && payload.new.user_id === userId) {
          console.log('Game player status updated:', payload.new);
          await verifyConnection();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, userId]);

  return { isConnecting, connectionVerified };
}
