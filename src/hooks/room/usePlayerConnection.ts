
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const usePlayerConnection = (roomId: string | undefined) => {
  const { user } = useAuth();

  useEffect(() => {
    const markUserConnected = async () => {
      if (!user || !roomId) return;
      
      try {
        console.log(`[usePlayerConnection] Marking user ${user.id} as connected in room ${roomId}`);
        
        // Mise à jour directe pour marquer le joueur comme connecté
        const { error } = await supabase
          .from('game_players')
          .update({ is_connected: true })
          .eq('session_id', roomId)
          .eq('user_id', user.id);
        
        if (error) {
          console.error('[usePlayerConnection] Error marking player as connected:', error);
          toast.error('Failed to connect to game room');
          return;
        }

        // Vérifier que l'utilisateur est bien dans connected_players
        console.log('[usePlayerConnection] Checking connected_players array');
        const { data: sessionData, error: sessionError } = await supabase
          .from('game_sessions')
          .select('connected_players')
          .eq('id', roomId)
          .single();
        
        if (sessionError) {
          console.error('[usePlayerConnection] Error fetching session:', sessionError);
          return;
        }

        // Si l'utilisateur n'est pas dans connected_players, l'ajouter manuellement
        const connectedPlayers = sessionData?.connected_players || [];
        if (!connectedPlayers.includes(user.id)) {
          console.log('[usePlayerConnection] Adding user to connected_players array manually');
          const updatedPlayers = [...connectedPlayers, user.id];
          
          const { error: updateError } = await supabase
            .from('game_sessions')
            .update({ 
              connected_players: updatedPlayers,
              current_players: updatedPlayers.length
            })
            .eq('id', roomId);
          
          if (updateError) {
            console.error('[usePlayerConnection] Error updating connected_players:', updateError);
          } else {
            console.log(`[usePlayerConnection] Successfully updated connected_players: ${updatedPlayers.length} players`);
          }
        }
        
        // Mettre également à jour active_room_id dans la table users
        const { error: userError } = await supabase
          .from('users')
          .update({ active_room_id: roomId })
          .eq('id', user.id);
          
        if (userError) {
          console.error('[usePlayerConnection] Error updating active_room_id:', userError);
        } else {
          console.log(`[usePlayerConnection] Successfully set active_room_id=${roomId} for user ${user.id}`);
        }
      } catch (error) {
        console.error('[usePlayerConnection] Unexpected error:', error);
      }
    };
    
    markUserConnected();
    
    return () => {
      const markUserDisconnected = async () => {
        if (user && roomId) {
          console.log(`[usePlayerConnection] Marking user ${user.id} as disconnected from room ${roomId}`);
          
          try {
            // Mettre à jour is_connected à false
            await supabase
              .from('game_players')
              .update({ is_connected: false })
              .eq('session_id', roomId)
              .eq('user_id', user.id);
            
            // Mettre à jour active_room_id à null
            await supabase
              .from('users')
              .update({ active_room_id: null })
              .eq('id', user.id);
            
            // Supprimer l'utilisateur de connected_players
            const { data } = await supabase
              .from('game_sessions')
              .select('connected_players')
              .eq('id', roomId)
              .single();
              
            if (data) {
              const connectedPlayers = data.connected_players || [];
              const updatedPlayers = connectedPlayers.filter(id => id !== user.id);
              
              await supabase
                .from('game_sessions')
                .update({ 
                  connected_players: updatedPlayers,
                  current_players: updatedPlayers.length
                })
                .eq('id', roomId);
            }
          } catch (error) {
            console.error('[usePlayerConnection] Error marking user as disconnected:', error);
          }
        }
      };
      
      markUserDisconnected();
    };
  }, [roomId, user]);
};
