
import { useState, useCallback, useEffect } from "react";
import { useRoomDataState } from "./useRoomDataState";
import { useRoomSocketEvents } from "./useRoomSocketEvents";
import { useRoomActions } from "./useRoomActions";
import { PresenceData } from "@/components/game/types";
import { roomService } from "@/services/room";
import { useToast } from "@/components/ui/use-toast";

export function useRoomWebSocket(roomId: string | undefined) {
  const [presenceState, setPresenceState] = useState<Record<string, PresenceData[]>>({});
  const [isReady, setIsReady] = useState(false);
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

  const { toast } = useToast();

  // Session restore - improved implementation
  useEffect(() => {
    if (!roomId && !currentUserId) {
      const { roomId: storedRoomId, userId: storedUserId } = roomService.getStoredRoomConnection();
      if (storedRoomId && storedUserId) {
        // Navigate to the stored room
        window.location.href = `/games/${storedRoomId.split('-')[0]}/room/${storedRoomId}`;
      }
    }
  }, [roomId, currentUserId]);

  // Handle beforeunload to save state
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (roomId && currentUserId) {
        roomService.saveActiveRoomToStorage(roomId, currentUserId);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [roomId, currentUserId]);

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
