
import { useState, useEffect } from "react";
import { roomService } from "@/services/room";
import { supabase } from "@/integrations/supabase/client";

export function useStoredRoomConnection(userId: string | null) {
  const [hasAttemptedReconnect, setHasAttemptedReconnect] = useState(false);

  useEffect(() => {
    const checkStoredConnection = async () => {
      if (!userId) {
        console.log("No authenticated user, clearing any stored room connection");
        roomService.saveActiveRoomToStorage("", "", "");
        setHasAttemptedReconnect(true);
        return;
      }
      
      const { roomId: storedRoomId, userId: storedUserId, gameType: storedGameType } = roomService.getStoredRoomConnection();
      
      if (storedRoomId && storedUserId && storedGameType && storedUserId === userId) {
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
              .eq('user_id', userId)
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
    
    if (!hasAttemptedReconnect) {
      checkStoredConnection();
    }
  }, [userId, hasAttemptedReconnect]);

  return { hasAttemptedReconnect };
}
