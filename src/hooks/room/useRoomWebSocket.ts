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
  const navigate = useNavigate();
  
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

  useEffect(() => {
    if (!roomId) {
      const { roomId: storedRoomId, userId: storedUserId, gameType: storedGameType } = roomService.getStoredRoomConnection();
      
      if (storedRoomId && storedUserId && storedGameType) {
        console.log(`Found stored room: ${storedRoomId} (${storedGameType}) for user ${storedUserId}, redirecting...`);
        
        toast({
          title: "Reconnecting to room",
          description: "You were in an active game room. Reconnecting you...",
        });
        
        navigate(`/games/${storedGameType}/room/${storedRoomId}`);
      }
    }
  }, [navigate, roomId, toast]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (roomId && currentUserId) {
        console.log(`Page is being unloaded, saving room ${roomId} data for user ${currentUserId}...`);
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
