
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
      
      // Clear storage first to prevent automatic reconnection attempts
      roomService.saveActiveRoomToStorage("", "", "");
      sessionStorage.removeItem('activeRoomId');
      sessionStorage.removeItem('activeUserId');
      sessionStorage.removeItem('activeGameType');
      console.log("Storage cleared");
      
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
        toast.error("Échec lors de l'abandon de la partie. Veuillez réessayer.");
        return;
      }
      
      console.log("Database updated successfully");
      
      // Clear user's active_room_id in the users table
      const { error: userError } = await supabase
        .from('users')
        .update({ active_room_id: null })
        .eq('id', currentUserId);
      
      if (userError) {
        console.error("Failed to clear active room ID:", userError);
        // Continue even if this update fails
      } else {
        console.log("Active room ID cleared successfully");
      }
      
      // Disconnect from room
      try {
        await roomService.disconnectFromRoom(roomId, currentUserId);
        console.log("Room disconnection successful");
      } catch (disconnectError) {
        console.error("Error during room disconnection:", disconnectError);
        // Continue even if disconnection fails
      }
      
      // Update game status
      setGameStatus('ended');
      
      // Redirect to games page
      toast.success("Vous avez quitté la partie");
      navigate('/games');
    } catch (error) {
      console.error("Failed to forfeit game:", error);
      toast.error("Échec lors de l'abandon de la partie. Veuillez réessayer.");
    }
  }, [roomId, currentUserId, navigate]);

  return {
    toggleReady,
    startGame,
    forfeitGame,
    hasSufficientBalance
  };
}
