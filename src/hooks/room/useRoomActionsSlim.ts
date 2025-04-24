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
      
      // FIRST: Clear active_room_id
      console.log(`Clearing active room ID for user ${currentUserId}`);
      const { error: activeRoomError } = await supabase
        .from('users')
        .update({ active_room_id: null })
        .eq('id', currentUserId);
      
      if (activeRoomError) {
        console.error("Failed to clear active room ID:", activeRoomError);
      }
      
      // Update the database - mark player as forfeited and disconnected
      console.log("Updating game_players table to mark player as forfeited");
      const { error: playerError } = await supabase
        .from('game_players')
        .update({ 
          has_forfeited: true, 
          is_connected: false 
        })
        .eq('session_id', roomId)
        .eq('user_id', currentUserId);
        
      if (playerError) {
        console.error("Failed to update player status:", playerError);
        toast.error("Failed to leave the game. Please try again.");
        return;
      }
      
      console.log("Game player marked as forfeited and disconnected successfully");
      
      // Clear storage AFTER database updates to prevent automatic reconnection
      console.log("Clearing session storage");
      roomService.saveActiveRoomToStorage("", "", "");
      sessionStorage.removeItem('activeRoomId');
      sessionStorage.removeItem('activeUserId');
      sessionStorage.removeItem('activeGameType');
      localStorage.removeItem('activeRoomId');
      localStorage.removeItem('activeUserId');
      localStorage.removeItem('activeGameType');
      
      console.log("Session and local storage cleared");
      
      // Disconnect from room websocket connection
      try {
        console.log("Disconnecting from room websocket");
        await roomService.disconnectFromRoom(roomId, currentUserId);
        console.log("Room disconnection successful");
      } catch (disconnectError) {
        console.error("Error during room disconnection:", disconnectError);
        // Continue execution even if disconnection fails
      }
      
      // Update UI state
      setGameStatus('ended');
      
      // Show success message and navigate away
      toast.success("Vous avez quitté la partie");
      
      // Force navigation with a slight delay to ensure all cleanup is done
      setTimeout(() => {
        console.log("Navigating to games page");
        navigate('/games', { replace: true });
      }, 100);
      
    } catch (error) {
      console.error("Failed during forfeit process:", error);
      toast.error("Échec lors de l'abandon de la partie. Veuillez réessayer.");
      
      // Try to navigate anyway as a fallback
      navigate('/games');
    }
  }, [roomId, currentUserId, navigate]);

  return {
    toggleReady,
    startGame,
    forfeitGame,
    hasSufficientBalance
  };
}
