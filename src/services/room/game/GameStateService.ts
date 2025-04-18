
import { supabase } from "@/integrations/supabase/client";
import { DatabaseSessionStatus } from "@/components/game/types";
import { toast } from "sonner";

export class GameStateService {
  async startGame(roomId: string, channel: any) {
    if (!roomId || !channel) return null;
    
    try {
      // Update session status and calculate prize pool
      const dbStatus: DatabaseSessionStatus = 'Active';
      const { data, error } = await supabase
        .from('game_sessions')
        .update({ 
          status: dbStatus,
          start_time: new Date().toISOString(),
          pot: supabase.rpc('calculate_prize_pool', { session_id: roomId })
        })
        .eq('id', roomId)
        .select()
        .single();
        
      if (error) throw error;
      
      channel.send({
        type: 'broadcast',
        event: 'game_start',
        payload: data
      });
      
      return data;
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error('Could not start the game. Please try again.');
      return null;
    }
  }

  async endGame(roomId: string, results: any, channel: any) {
    if (!roomId || !channel) return null;
    
    try {
      const dbStatus: DatabaseSessionStatus = 'Finished';
      const { data, error } = await supabase
        .from('game_sessions')
        .update({
          status: dbStatus,
          end_time: new Date().toISOString()
        })
        .eq('id', roomId)
        .select()
        .single();
        
      if (error) throw error;
      
      channel.send({
        type: 'broadcast',
        event: 'game_over',
        payload: { ...data, results }
      });
      
      return data;
    } catch (error) {
      console.error('Error ending game:', error);
      toast.error('Could not end the game properly. Please try again.');
      return null;
    }
  }

  broadcastMove(roomId: string, moveData: any, channel: any) {
    if (!roomId || !channel) return;
    
    channel.send({
      type: 'broadcast',
      event: 'player_move',
      payload: moveData
    });
  }
}
