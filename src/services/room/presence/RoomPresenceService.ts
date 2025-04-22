
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
      
      // Après avoir marqué le joueur comme connecté, recalculons le pot
      await this.updateRoomPot(roomId);
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
      
      // Après avoir marqué le joueur comme déconnecté, recalculons le pot
      await this.updateRoomPot(roomId);
    } catch (error) {
      console.error('Error marking player disconnected:', error);
    }
  }
  
  // Nouvelle méthode pour mettre à jour le pot de la partie
  private async updateRoomPot(roomId: string) {
    try {
      // Récupérer le nombre actuel de joueurs connectés
      const { data: players, error: playersError } = await supabase
        .from('game_players')
        .select('id')
        .eq('session_id', roomId)
        .eq('is_connected', true);
        
      if (playersError) throw playersError;
      
      const connectedPlayers = players?.length || 0;
      
      // Mettre à jour le nombre de joueurs et recalculer le pot
      const { error: updateError } = await supabase
        .from('game_sessions')
        .update({ 
          current_players: connectedPlayers,
          pot: await this.calculatePot(roomId, connectedPlayers) 
        })
        .eq('id', roomId);
        
      if (updateError) throw updateError;
      
      console.log(`Room ${roomId} updated: ${connectedPlayers} players, pot recalculated`);
    } catch (error) {
      console.error('Error updating room pot:', error);
    }
  }
  
  // Calculer le pot de la partie
  private async calculatePot(roomId: string, playerCount: number): Promise<number> {
    try {
      // Utiliser la fonction RPC pour calculer le pot
      const { data, error } = await supabase.rpc('calculate_prize_pool', {
        session_id: roomId
      });
      
      if (error) throw error;
      
      console.log(`Pot calculated for room ${roomId}: ${data}`);
      return data || 0;
    } catch (error) {
      console.error('Error calculating pot:', error);
      
      // En cas d'erreur, faire un calcul de secours
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
