
import { useCallback } from "react";
import { roomService } from "@/services/room";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useWalletCheck } from "./useWalletCheck";

/**
 * A slimmer version of room actions that focuses on specific room functionality
 */
export function useRoomActionsSlim(
  roomId: string | undefined, 
  currentUserId: string | null
) {
  const navigate = useNavigate();
  const { hasSufficientBalance } = useWalletCheck();

  /**
   * Toggle the ready status of the current player
   */
  const toggleReady = useCallback(async (isReady: boolean, setIsReady: (isReady: boolean) => void) => {
    if (!roomId || !currentUserId) return;

    try {
      const newReadyState = !isReady;
      await roomService.markPlayerReady(roomId, currentUserId, newReadyState);
      setIsReady(newReadyState);
    } catch (error) {
      console.error("Failed to toggle ready state:", error);
      toast.error("Failed to update ready status. Please try again.");
    }
  }, [roomId, currentUserId]);

  /**
   * Start the game
   */
  const startGame = useCallback(async (setGameStatus: (status: 'waiting' | 'starting' | 'playing' | 'ended') => void) => {
    if (!roomId) return;

    try {
      await roomService.startGame(roomId);
      setGameStatus('starting');
    } catch (error) {
      console.error("Failed to start game:", error);
      toast.error("Failed to start the game. Please try again.");
    }
  }, [roomId]);

  /**
   * Leave the current game (forfeit)
   */
  const forfeitGame = useCallback(async (setGameStatus: (status: 'waiting' | 'starting' | 'playing' | 'ended') => void) => {
    if (!roomId || !currentUserId) return;

    try {
      console.log(`Player ${currentUserId} is forfeiting game in room ${roomId}`);
      
      // Mark player as forfeited and disconnected
      const { error } = await supabase
        .from('game_players')
        .update({ 
          has_forfeited: true, 
          is_connected: false 
        })
        .eq('session_id', roomId)
        .eq('user_id', currentUserId);
        
      if (error) {
        console.error("Failed to forfeit game:", error);
        toast.error("Failed to forfeit the game. Please try again.");
        return;
      }
      
      // Clear storage
      roomService.saveActiveRoomToStorage("", "", "");
      sessionStorage.removeItem('activeRoomId');
      sessionStorage.removeItem('activeUserId');
      sessionStorage.removeItem('activeGameType');
      
      // Disconnect from room
      await roomService.disconnectFromRoom(roomId, currentUserId);
      
      // Update game status
      setGameStatus('ended');
      
      // Redirect to games page
      toast.success("You left the game");
      navigate('/games');
    } catch (error) {
      console.error("Failed to forfeit game:", error);
      toast.error("Failed to leave the game. Please try again.");
    }
  }, [roomId, currentUserId, navigate]);

  return {
    toggleReady,
    startGame,
    forfeitGame,
    hasSufficientBalance
  };
}
