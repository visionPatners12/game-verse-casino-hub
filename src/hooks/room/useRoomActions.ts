
import { useCallback } from "react";
import { roomService } from "@/services/room";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface RoomActionsProps {
  roomId: string | undefined;
  currentUserId: string | null;
  isReady: boolean;
  setIsReady: (ready: boolean) => void;
  setGameStatus: (status: 'waiting' | 'starting' | 'playing' | 'ended') => void;
}

export function useRoomActions({
  roomId,
  currentUserId,
  isReady,
  setIsReady,
  setGameStatus,
}: RoomActionsProps) {
  const toggleReady = useCallback(async () => {
    if (!roomId || !currentUserId) return false;

    try {
      const newReadyState = !isReady;
      
      // Directly update the database for immediate server-side effect
      const { error } = await supabase
        .from('game_players')
        .update({ is_ready: newReadyState })
        .eq('session_id', roomId)
        .eq('user_id', currentUserId);
        
      if (error) throw error;
      
      // Still call the roomService for any other side effects it might handle
      await roomService.markPlayerReady(roomId, currentUserId, newReadyState);
      
      // Return success
      return true;
    } catch (error) {
      console.error("Failed to toggle ready state:", error);
      toast.error("Failed to update ready status. Please try again.");
      return false;
    }
  }, [roomId, currentUserId, isReady]);

  const startGame = useCallback(async () => {
    if (!roomId) return false;

    try {
      // Directly update the room status in the database
      const { error } = await supabase
        .from('game_sessions')
        .update({ 
          status: 'Active', 
          start_time: new Date().toISOString() 
        })
        .eq('id', roomId);
        
      if (error) throw error;
      
      // Also call the roomService for any other side effects
      await roomService.startGame(roomId);
      
      setGameStatus('starting');
      
      setTimeout(() => {
        setGameStatus('playing');
      }, 1000);
      
      return true;
    } catch (error) {
      console.error("Failed to start game:", error);
      toast.error('Failed to start the game');
      return false;
    }
  }, [roomId, setGameStatus]);

  const forfeitGame = useCallback(async () => {
    if (!roomId || !currentUserId) return false;

    try {
      // Mark player as forfeited in database
      const { error } = await supabase
        .from('game_players')
        .update({ has_forfeited: true, is_ready: false })
        .eq('session_id', roomId)
        .eq('user_id', currentUserId);
        
      if (error) throw error;
      
      // Call roomService for disconnection and other side effects
      await roomService.disconnectFromRoom(roomId, currentUserId);
      
      setGameStatus('ended');
      return true;
    } catch (error) {
      console.error("Failed to forfeit game:", error);
      toast.error('Failed to leave the match');
      return false;
    }
  }, [roomId, currentUserId, setGameStatus]);

  return { 
    toggleReady, 
    startGame, 
    forfeitGame 
  };
}
