
import { useState, useEffect } from "react";
import { roomService } from "@/services/room";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useRoomConnection(roomId: string | undefined) {
  const [hasAttemptedReconnect, setHasAttemptedReconnect] = useState(false);
  const { gameType } = useParams<{ gameType?: string }>();
  const { user } = useAuth();

  // When user connects to a room, mark them as connected in game_players
  useEffect(() => {
    if (roomId && user?.id) {
      const updatePlayerConnection = async () => {
        try {
          console.log(`Marking player ${user.id} as connected in room ${roomId}`);
          const { error } = await supabase
            .from('game_players')
            .update({ is_connected: true })
            .eq('session_id', roomId)
            .eq('user_id', user.id);
            
          if (error) {
            console.error('Failed to update player connection status:', error);
          } else {
            console.log(`Successfully marked player ${user.id} as connected in room ${roomId}`);
          }
        } catch (err) {
          console.error('Error updating player connection status:', err);
        }
      };
      
      updatePlayerConnection();
    }
  }, [roomId, user?.id]);

  // Early return if we have a roomId
  if (roomId) {
    return { currentUserId: user?.id || null, hasAttemptedReconnect };
  }
  
  // Early return if we've already attempted reconnection
  if (hasAttemptedReconnect) {
    return { currentUserId: user?.id || null, hasAttemptedReconnect };
  }

  const checkStoredConnection = async () => {
    if (!user || !user.id) {
      console.log("No authenticated user, clearing any stored room connection");
      roomService.saveActiveRoomToStorage("", "", "");
      setHasAttemptedReconnect(true);
      return;
    }
    
    const { roomId: storedRoomId, userId: storedUserId, gameType: storedGameType } = roomService.getStoredRoomConnection();
    
    if (storedRoomId && storedUserId && storedGameType && storedUserId === user.id) {
      console.log(`Found stored room connection: ${storedRoomId} (${storedGameType}) for user ${storedUserId}`);
      
      try {
        const { data: sessionData } = await supabase
          .from('game_sessions')
          .select('id, status')
          .eq('id', storedRoomId)
          .single();
          
        if (!sessionData || !sessionData.id) {
          console.log("Room no longer exists, clearing storage");
          roomService.saveActiveRoomToStorage("", "", "");
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
          }
        }
      } catch (error) {
        console.error("Error reconnecting to room:", error);
        roomService.saveActiveRoomToStorage("", "", "");
      }
    } else if (storedRoomId || storedUserId || storedGameType) {
      console.log("Invalid stored room data or user mismatch, clearing storage");
      roomService.saveActiveRoomToStorage("", "", "");
    }
    
    setHasAttemptedReconnect(true);
  };
  
  useEffect(() => {
    checkStoredConnection();
  }, [roomId, hasAttemptedReconnect, user]);

  return { 
    currentUserId: user?.id || null,
    hasAttemptedReconnect
  };
}
