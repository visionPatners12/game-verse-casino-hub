
import { supabase } from "@/integrations/supabase/client";
import { PresenceData } from "@/components/game/types";
import { toast } from "sonner";

export class RoomPresenceService {
  private async getUserUsername(userId: string): Promise<string> {
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data?.username || '';
  }

  async markPlayerReady(roomId: string, userId: string, isReady: boolean = true, channel: any) {
    if (!roomId || !userId) return;
    
    try {
      // Update presence data first (realtime)
      if (channel) {
        const presenceData: PresenceData = {
          user_id: userId,
          online_at: new Date().toISOString(),
          is_ready: isReady
        };
        await channel.track(presenceData);
      }
      
      // Update database (persistent)
      const { error } = await supabase
        .from('game_players')
        .update({ 
          is_ready: isReady,
          display_name: await this.getUserUsername(userId)
        })
        .eq('session_id', roomId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Broadcast event to all clients
      if (channel) {
        channel.send({
          type: 'broadcast',
          event: 'player_ready',
          payload: { userId, isReady }
        });
      }
    } catch (error) {
      console.error('Error marking player ready:', error);
      toast.error('Could not update ready status. Please try again.');
    }
  }

  async markPlayerConnected(roomId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('game_players')
        .update({ is_connected: true })
        .eq('session_id', roomId)
        .eq('user_id', userId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error marking player connected:', error);
    }
  }

  async markPlayerDisconnected(roomId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('game_players')
        .update({ is_connected: false })
        .eq('session_id', roomId)
        .eq('user_id', userId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error marking player disconnected:', error);
    }
  }
}
