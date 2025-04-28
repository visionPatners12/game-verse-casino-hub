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
import { useAuth } from "@/contexts/AuthContext";

export function useRoomWebSocket(roomId: string | undefined) {
  const { gameType } = useParams<{ gameType?: string }>();
  const [presenceState, setPresenceState] = useState<Record<string, PresenceData[]>>({});
  const [isReady, setIsReady] = useState(false);
  const [hasAttemptedReconnect, setHasAttemptedReconnect] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
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

  const { toggleReady, startGame, forfeitGame } = useRoomActions({
    roomId,
    currentUserId,
    isReady,
    setIsReady,
    setGameStatus,
  });

  useEffect(() => {
    if (roomId) {
      return;
    }
    
    if (hasAttemptedReconnect) {
      return;
    }

    const checkStoredConnection = async () => {
      if (!user || !user.id) {
        console.log("No authenticated user, clearing any stored room connection");
        roomService.saveActiveRoomToStorage("", "", "");
        sessionStorage.removeItem('activeRoomId');
        sessionStorage.removeItem('activeUserId');
        sessionStorage.removeItem('activeGameType');
        setHasAttemptedReconnect(true);
        return;
      }
      
      const { roomId: storedRoomId, userId: storedUserId, gameType: storedGameType } = roomService.getStoredRoomConnection();
      
      if (storedRoomId && storedUserId && storedGameType && storedUserId === user.id) {
        console.log(`Found stored room connection on page load: ${storedRoomId} (${storedGameType}) for user ${storedUserId}, reconnecting without redirect`);
        
        try {
          const { data: sessionData } = await supabase
            .from('game_sessions')
            .select('id, status')
            .eq('id', storedRoomId)
            .single();
            
          if (!sessionData || !sessionData.id) {
            console.log("Room no longer exists, clearing storage");
            roomService.saveActiveRoomToStorage("", "", "");
            sessionStorage.removeItem('activeRoomId');
            sessionStorage.removeItem('activeUserId');
            sessionStorage.removeItem('activeGameType');
          } else {
            const { data: playerData } = await supabase
              .from('game_players')
              .select('id')
              .eq('session_id', storedRoomId)
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (playerData && playerData.id) {
              console.log("User is a valid player in this room, reconnecting");
              roomService.connectToRoom(storedRoomId, storedUserId, storedGameType);
            } else {
              console.log("User is not a player in this room, clearing storage");
              roomService.saveActiveRoomToStorage("", "", "");
              sessionStorage.removeItem('activeRoomId');
              sessionStorage.removeItem('activeUserId');
              sessionStorage.removeItem('activeGameType');
            }
          }
        } catch (error) {
          console.error("Error reconnecting to room:", error);
          roomService.saveActiveRoomToStorage("", "", "");
          sessionStorage.removeItem('activeRoomId');
          sessionStorage.removeItem('activeUserId');
          sessionStorage.removeItem('activeGameType');
        }
      } else if (storedRoomId || storedUserId || storedGameType) {
        console.log("Invalid stored room data or user mismatch, clearing storage");
        roomService.saveActiveRoomToStorage("", "", "");
        sessionStorage.removeItem('activeRoomId');
        sessionStorage.removeItem('activeUserId');
        sessionStorage.removeItem('activeGameType');
      }
      
      setHasAttemptedReconnect(true);
    };
    
    checkStoredConnection();
  }, [navigate, roomId, toast, hasAttemptedReconnect, user]);

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
    forfeitGame,
    fetchRoomData
  };
}
