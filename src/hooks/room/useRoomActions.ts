import { useCallback } from "react";
import { roomService } from "@/services/room";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

      // Update the database
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
      
      // Log confirmation that database update was successful
      console.log(`Database updated: Player ${currentUserId} marked as forfeited and disconnected in room ${roomId}`);
      
      // Clear storage to prevent automatic reconnection
      roomService.saveActiveRoomToStorage("", "", "");
      console.log("Room storage cleared from memory");
      
      // Clear session storage items
      sessionStorage.removeItem('activeRoomId');
      sessionStorage.removeItem('activeUserId');
      sessionStorage.removeItem('activeGameType');
      console.log("Session storage cleared");
      
      // Disconnect from the room - this should clean up channels and presence
      try {
        await roomService.disconnectFromRoom(roomId, currentUserId);
        console.log(`Successfully disconnected from room ${roomId} websocket`);
      } catch (disconnectError) {
        console.error("Error during room disconnection:", disconnectError);
      }
      
      // Set game status to ended in local state
      setGameStatus('ended');
      
      // Redirect to games page
      toast.success("You left the game");
      console.log("Redirecting to games page");
      navigate('/games');
    } catch (error) {
      console.error("Failed to forfeit game:", error);
      toast.error("Failed to leave the game. Please try again.");
    }
  }, [roomId, currentUserId, setGameStatus, navigate]);

  const updateRoomPot = async (shouldLog: boolean = false) => {
    if (!roomId) return;
    
    try {
      const { data: roomData, error } = await supabase
        .from('game_sessions')
        .select('id, entry_fee, max_players, commission_rate')
        .eq('id', roomId)
        .single();
  
      if (error) throw error;

      const { data: players, error: playersError } = await supabase
        .from('game_players')
        .select('id')
        .eq('session_id', roomId)
        .eq('is_connected', true);
      
      if (playersError) throw playersError;
      
      const connectedPlayers = players?.length || 0;
      const potAmount = roomData.entry_fee * roomData.max_players * (1 - roomData.commission_rate/100);

      const { error: updateError } = await supabase
        .from('game_sessions')
        .update({ 
          current_players: connectedPlayers,
          pot: potAmount
        })
        .eq('id', roomId);
      
      if (updateError) throw updateError;
      
      if (shouldLog) {
        console.log(`Pot calculated for room ${roomId}: ${potAmount}`);
        console.log(`Room ${roomId} updated: ${connectedPlayers} players, pot recalculated`);
      }
    } catch (error) {
      console.error('Error updating room pot:', error);
    }
  };

  return { toggleReady, startGame, broadcastMove, endGame, forfeitGame, updateRoomPot };
}
