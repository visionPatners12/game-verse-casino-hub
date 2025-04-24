
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { roomService } from "@/services/room";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Hook to handle room disconnection and forfeit logic
 */
export function useRoomDisconnect(
  roomId: string | undefined,
  currentUserId: string | null,
  setGameStatus: (status: 'waiting' | 'starting' | 'playing' | 'ended') => void
) {
  const navigate = useNavigate();
  
  const disconnectFromRoom = useCallback(async () => {
    if (!roomId || !currentUserId) return;

    try {
      console.log(`Disconnecting player ${currentUserId} from room ${roomId}`);
      
      // FIRST PRIORITY: Clear active_room_id
      console.log(`Clearing active room ID for user ${currentUserId}`);
      const { error: activeRoomError } = await supabase
        .from('users')
        .update({ active_room_id: null })
        .eq('id', currentUserId);
      
      if (activeRoomError) {
        console.error("Failed to clear active room ID:", activeRoomError);
      }
      
      // Update player status in database
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
      
      // Clear storage
      roomService.saveActiveRoomToStorage("", "", "");
      sessionStorage.removeItem('activeRoomId');
      sessionStorage.removeItem('activeUserId');
      sessionStorage.removeItem('activeGameType');
      localStorage.removeItem('activeRoomId');
      localStorage.removeItem('activeUserId');
      localStorage.removeItem('activeGameType');
      
      // Disconnect from websocket
      try {
        await roomService.disconnectFromRoom(roomId, currentUserId);
      } catch (disconnectError) {
        console.error("Error during room disconnection:", disconnectError);
      }
      
      // Update UI state
      setGameStatus('ended');
      toast.success("Vous avez quitté la partie");
      
      // Navigate away
      setTimeout(() => {
        navigate('/games', { replace: true });
      }, 100);
    } catch (error) {
      console.error("Failed during disconnect process:", error);
      toast.error("Échec lors du départ de la partie. Veuillez réessayer.");
      navigate('/games');
    }
  }, [roomId, currentUserId, setGameStatus, navigate]);

  return { disconnectFromRoom };
}
