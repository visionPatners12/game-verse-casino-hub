
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
      // Only proceed if there's a logged-in user
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
      
      // Validate that the stored user ID matches the current user ID
      if (storedRoomId && storedUserId && storedGameType && storedUserId === user.id) {
        console.log(`Found stored room connection on page load: ${storedRoomId} (${storedGameType}) for user ${storedUserId}, reconnecting without redirect`);
        
        try {
          // Verify connection was successful through direct DB check
          const { data: sessionData } = await supabase
            .from('game_sessions')
            .select('id, status')
            .eq('id', storedRoomId)
            .single();
            
          if (!sessionData || !sessionData.id) {
            console.log("Room no longer exists, clearing storage");
            roomService.saveActiveRoomToStorage("", "", ""); // Clear by passing empty strings
            sessionStorage.removeItem('activeRoomId');
            sessionStorage.removeItem('activeUserId');
            sessionStorage.removeItem('activeGameType');
          } else {
            // Check if player is actually in this room
            const { data: playerData } = await supabase
              .from('game_players')
              .select('id')
              .eq('session_id', storedRoomId)
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (playerData && playerData.id) {
              // Only connect to room if this user is actually a player in that room
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
        // If there's partial data or user mismatch, clear it all
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
