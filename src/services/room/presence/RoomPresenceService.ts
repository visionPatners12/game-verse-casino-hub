
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
      // Update database first (persistent)
      const { error } = await supabase
        .from('game_players')
        .update({ 
          is_ready: isReady,
          display_name: await this.getUserUsername(userId)
        })
        .eq('session_id', roomId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Then update presence data (realtime)
      if (channel) {
        const presenceData: PresenceData = {
          user_id: userId,
          online_at: new Date().toISOString(),
          is_ready: isReady
        };
        
        try {
          await channel.track(presenceData);
          
          // Broadcast event to all clients
          channel.send({
            type: 'broadcast',
            event: 'player_ready',
            payload: { userId, isReady }
          });
        } catch (presenceError) {
          console.error('Error updating presence:', presenceError);
          // We continue even if presence update fails since database was updated
        }
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
      
      // After marking the player as connected, recalculate the pot without logging
      await this.updateRoomPot(roomId, false);
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
      
      // After marking the player as disconnected, recalculate the pot without logging
      await this.updateRoomPot(roomId, false);
    } catch (error) {
      console.error('Error marking player disconnected:', error);
    }
  }
  
  private async updateRoomPot(roomId: string, shouldLog: boolean = false) {
    try {
      const { data: players, error: playersError } = await supabase
        .from('game_players')
        .select('id')
        .eq('session_id', roomId)
        .eq('is_connected', true);
        
      if (playersError) throw playersError;
      
      const connectedPlayers = players?.length || 0;
      
      const potAmount = await this.calculatePot(roomId, connectedPlayers);
      
      const { error: updateError } = await supabase
        .from('game_sessions')
        .update({ 
          current_players: connectedPlayers,
          pot: potAmount
        })
        .eq('id', roomId);
        
      if (updateError) throw updateError;
      
      if (shouldLog) {
        console.log(`Room ${roomId} updated: ${connectedPlayers} players, pot recalculated`);
      }
    } catch (error) {
      console.error('Error updating room pot:', error);
    }
  }
  
  private async calculatePot(roomId: string, playerCount: number): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('calculate_prize_pool', {
        session_id: roomId
      });
      
      if (error) throw error;
      
      if (data && playerCount === 1) { // Only log during initial room creation
        console.log(`Pot calculated for room ${roomId}: ${data}`);
      }
      
      return data || 0;
    } catch (error) {
      console.error('Error calculating pot:', error);
      
      const { data: roomData } = await supabase
        .from('game_sessions')
        .select('entry_fee, commission_rate')
        .eq('id', roomId)
        .single();
        
      if (roomData) {
        return roomData.entry_fee * playerCount * (1 - roomData.commission_rate/100);
      }
      
      return 0;
    }
  }
}

