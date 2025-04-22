
import { useState, useCallback, useEffect } from "react";
import { useRoomDataState } from "./useRoomDataState";
import { useRoomSocketEvents } from "./useRoomSocketEvents";
import { useRoomActions } from "./useRoomActions";
import { PresenceData } from "@/components/game/types";
import { roomService } from "@/services/room";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useRoomWebSocket(roomId: string | undefined) {
  const { gameType } = useParams<{ gameType?: string }>();
  const [presenceState, setPresenceState] = useState<Record<string, PresenceData[]>>({});
  const [isReady, setIsReady] = useState(false);
  const [hasAttemptedReconnect, setHasAttemptedReconnect] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    roomData,
    isLoading,
    players,
    currentUserId,
    fetchRoomData,
    gameStatus,
    setGameStatus,
    setRoomData,
    setPlayers,
  } = useRoomDataState(roomId);

  useRoomSocketEvents({
    roomId,
    currentUserId,
    fetchRoomData,
    setGameStatus,
    setIsReady,
    setPresenceState
  });

  const { toggleReady, startGame, broadcastMove, endGame, forfeitGame } = useRoomActions({
    roomId,
    currentUserId,
    isReady,
    setIsReady,
    setGameStatus,
  });

  // Check for stored room connection when no roomId is provided (on other pages)
  useEffect(() => {
    // Early return if we already have a roomId
    if (roomId) {
      return;
    }
    
    // Early return if we've already attempted reconnection
    if (hasAttemptedReconnect) {
      return;
    }

    const checkStoredConnection = async () => {
      const { roomId: storedRoomId, userId: storedUserId, gameType: storedGameType } = roomService.getStoredRoomConnection();
      
      if (storedRoomId && storedUserId && storedGameType) {
        console.log(`Found stored room connection on page load: ${storedRoomId} (${storedGameType}) for user ${storedUserId}, reconnecting without redirect`);
        
        try {
          // Connect to room without navigating
          roomService.connectToRoom(storedRoomId, storedUserId, storedGameType);
          
          // Verify connection was successful through direct DB check
          const { data: sessionData } = await supabase
            .from('game_sessions')
            .select('id, status')
            .eq('id', storedRoomId)
            .single();
            
          if (!sessionData || !sessionData.id) {
            console.log("Room no longer exists, clearing storage");
            roomService.disconnectFromRoom(storedRoomId, storedUserId);
            roomService.saveActiveRoomToStorage("", "", ""); // Clear by passing empty strings
          }
        } catch (error) {
          console.error("Error reconnecting to room:", error);
        }
      }
      
      setHasAttemptedReconnect(true);
    };
    
    checkStoredConnection();
  }, [navigate, roomId, toast, hasAttemptedReconnect]);

  // Setup beforeunload handler to save room data
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (roomId && currentUserId && gameStatus !== 'ended') {
        console.log(`Page is being unloaded, saving room ${roomId} data for user ${currentUserId}...`);
        roomService.saveActiveRoomToStorage(roomId, currentUserId, gameType);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [roomId, currentUserId, gameType, gameStatus]);

  return {
    roomData,
    isLoading,
    players,
    currentUserId,
    presenceState,
    isReady,
    gameStatus,
    toggleReady,
    startGame,
    broadcastMove,
    endGame,
    forfeitGame,
    fetchRoomData
  };
}
