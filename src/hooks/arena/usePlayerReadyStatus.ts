
import { useState, useEffect, useCallback } from 'react';
import { arenaRoomService, PlayerReadyStatus } from '@/services/arena/ArenaRoomWebSocketService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePlayerReadyStatus(roomId: string | undefined, userId: string | null, autoStartMatch?: () => void) {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allPlayersReady, setAllPlayersReady] = useState<boolean>(false);
  
  // Fetch initial ready status from the database
  useEffect(() => {
    if (!roomId || !userId) return;
    
    const fetchInitialStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('game_players')
          .select('is_ready')
          .eq('session_id', roomId)
          .eq('user_id', userId)
          .single();
          
        if (error) {
          console.error('[usePlayerReadyStatus] Error fetching ready status:', error);
          return;
        }
        
        if (data) {
          console.log(`[usePlayerReadyStatus] Initial ready status for user ${userId}: ${data.is_ready}`);
          setIsReady(!!data.is_ready);
        }
      } catch (error) {
        console.error('[usePlayerReadyStatus] Error in fetchInitialStatus:', error);
      }
    };
    
    fetchInitialStatus();
  }, [roomId, userId]);

  // Connect to the WebSocket channel for real-time updates
  useEffect(() => {
    if (!roomId) return;
    
    console.log(`[usePlayerReadyStatus] Connecting to room ${roomId} for ready status updates`);
    
    // Make sure we're connected to the room channel
    arenaRoomService.connectToRoom(roomId);
    
    // Subscribe to ready status updates
    const unsubscribe = arenaRoomService.onReadyStatusChange(roomId, (statusUpdates) => {
      console.log('[usePlayerReadyStatus] Ready status update received:', statusUpdates);
      
      // Update our local state if the update is for current user
      statusUpdates.forEach(update => {
        if (update.userId === userId) {
          console.log(`[usePlayerReadyStatus] Updating ready status for current user: ${update.isReady}`);
          setIsReady(update.isReady);
        }
      });
    });
    
    // Check for all players ready via database subscription
    const channel = supabase
      .channel(`all-players-ready-${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_players',
        filter: `session_id=eq.${roomId}`
      }, () => {
        checkAllPlayersReady();
      })
      .subscribe();
      
    // Initial check
    checkAllPlayersReady();
      
    return () => {
      unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [roomId, userId]);
  
  // Auto start match when all players are ready
  useEffect(() => {
    if (allPlayersReady && autoStartMatch) {
      console.log('[usePlayerReadyStatus] All players ready, auto-starting match');
      // Small delay to ensure UI updates are visible
      const timer = setTimeout(() => {
        autoStartMatch();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [allPlayersReady, autoStartMatch]);
  
  // Check if all players are ready
  const checkAllPlayersReady = async () => {
    if (!roomId) return;
    
    try {
      const { data, error } = await supabase
        .from('game_players')
        .select('is_ready, is_connected')
        .eq('session_id', roomId);
        
      if (error) {
        console.error('[usePlayerReadyStatus] Error checking all players ready:', error);
        return;
      }
      
      const connectedPlayers = data.filter(player => player.is_connected);
      const readyPlayers = connectedPlayers.filter(player => player.is_ready);
      
      const allReady = connectedPlayers.length > 0 && 
                     connectedPlayers.length === readyPlayers.length &&
                     connectedPlayers.length >= 2; // Ensure at least 2 players
                     
      console.log(`[usePlayerReadyStatus] All players ready check: ${allReady} (${readyPlayers.length}/${connectedPlayers.length})`);
      
      setAllPlayersReady(allReady);
    } catch (error) {
      console.error('[usePlayerReadyStatus] Error in checkAllPlayersReady:', error);
    }
  };

  // Function to toggle ready status
  const toggleReady = useCallback(async () => {
    if (!roomId || !userId) {
      toast.error("Cannot update ready status: missing room or user ID");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log(`[usePlayerReadyStatus] Toggling ready status for user ${userId} to ${!isReady}`);
      
      const success = await arenaRoomService.updatePlayerReadyStatus(
        roomId,
        userId,
        !isReady
      );
      
      if (success) {
        setIsReady(!isReady);
        
        // Show appropriate toast
        if (!isReady) {
          toast.success("You are now ready!");
        } else {
          toast.info("You are no longer ready");
        }
      }
    } catch (error) {
      console.error('[usePlayerReadyStatus] Error toggling ready status:', error);
      toast.error("Failed to update ready status");
    } finally {
      setIsLoading(false);
    }
  }, [roomId, userId, isReady]);

  return {
    isReady,
    isLoading,
    toggleReady,
    allPlayersReady
  };
}
