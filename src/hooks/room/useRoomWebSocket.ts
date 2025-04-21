
import { useState, useCallback, useEffect } from "react";
import { useRoomDataState } from "./useRoomDataState";
import { useRoomSocketEvents } from "./useRoomSocketEvents";
import { useRoomActions } from "./useRoomActions";
import { PresenceData } from "@/components/game/types";
import { roomService } from "@/services/room";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

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

  const { toggleReady, startGame, broadcastMove, endGame } = useRoomActions({
    roomId,
    currentUserId,
    isReady,
    setIsReady,
    setGameStatus,
  });

  // Check for stored room connection when no roomId is provided (on other pages)
  useEffect(() => {
    if (roomId || hasAttemptedReconnect) {
      return; // Don't attempt reconnect if we already have a roomId or have tried before
    }

    const { roomId: storedRoomId, userId: storedUserId, gameType: storedGameType } = roomService.getStoredRoomConnection();
    
    if (storedRoomId && storedUserId && storedGameType) {
      console.log(`Found stored room connection on page load: ${storedRoomId} (${storedGameType}) for user ${storedUserId}, redirecting...`);
      
      toast({
        title: "Reconnecting to room",
        description: "You were in an active game room. Reconnecting you...",
      });
      
      // Try to connect to the stored room first before navigating
      roomService.connectToRoom(storedRoomId, storedUserId, storedGameType);
      
      // Then navigate to the stored room
      navigate(`/games/${storedGameType}/room/${storedRoomId}`);
      setHasAttemptedReconnect(true);
    } else {
      setHasAttemptedReconnect(true); // Mark as attempted even if no stored connection
    }
  }, [navigate, roomId, toast, hasAttemptedReconnect]);

  // Setup beforeunload handler to save room data
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (roomId && currentUserId) {
        console.log(`Page is being unloaded, saving room ${roomId} data for user ${currentUserId}...`);
        // Save with explicit gameType from URL params
        roomService.saveActiveRoomToStorage(roomId, currentUserId, gameType);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [roomId, currentUserId, gameType]);

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
    fetchRoomData
  };
}
