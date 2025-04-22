import { useCallback } from "react";
import { roomService } from "@/services/room";
import { toast } from "sonner";

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
    if (!roomId || !currentUserId) return;

    try {
      const newReadyState = !isReady;
      await roomService.markPlayerReady(roomId, currentUserId, newReadyState);
      setIsReady(newReadyState);
    } catch (error) {
      console.error("Failed to toggle ready state:", error);
      toast.error("Failed to update ready status. Please try again.");
    }
  }, [roomId, currentUserId, isReady, setIsReady]);

  const startGame = useCallback(async () => {
    if (!roomId) return;

    try {
      await roomService.startGame(roomId);
      setGameStatus('starting');
    } catch (error) {
      console.error("Failed to start game:", error);
      toast.error("Failed to start the game. Please try again.");
    }
  }, [roomId, setGameStatus]);

  const broadcastMove = useCallback((moveData: any) => {
    if (!roomId) return;
    roomService.broadcastMove(roomId, moveData);
  }, [roomId]);

  const endGame = useCallback(async (results: any) => {
    if (!roomId) return;

    try {
      await roomService.endGame(roomId, results);
      setGameStatus('ended');
    } catch (error) {
      console.error("Failed to end game:", error);
      toast.error("Failed to end the game. Please try again.");
    }
  }, [roomId, setGameStatus]);

  const forfeitGame = useCallback(async () => {
    if (!roomId || !currentUserId) return;

    try {
      // Optimistically update the UI
      setGameStatus('ended');
      
      // Mark player as forfeited in the database
      const { error } = await supabase
        .from('game_players')
        .update({ has_forfeited: true })
        .eq('session_id', roomId)
        .eq('user_id', currentUserId);
        
      if (error) {
        console.error("Failed to forfeit game:", error);
        toast.error("Failed to forfeit the game. Please try again.");
        // Revert UI state if the database update fails
        setGameStatus('playing');
        return;
      }
      
      // Disconnect from the room
      roomService.disconnectFromRoom(roomId, currentUserId);
      
      // Redirect to the games page
      window.location.href = '/games';
    } catch (error) {
      console.error("Failed to forfeit game:", error);
      toast.error("Failed to forfeit the game. Please try again.");
    }
  }, [roomId, currentUserId, setGameStatus]);

  const updateRoomPot = async () => {
    if (!roomId) return;
    
    try {
      // Use shouldLog=true only during room creation
      await roomService.presenceService.updateRoomPot(roomId, true);
    } catch (error) {
      console.error('Error updating room pot:', error);
    }
  };

  return { toggleReady, startGame, broadcastMove, endGame, forfeitGame, updateRoomPot };
}
