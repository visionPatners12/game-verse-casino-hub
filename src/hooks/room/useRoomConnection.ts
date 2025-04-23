
import { useState, useEffect } from "react";
import { roomService } from "@/services/room";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for managing room connections including reconnection logic
 */
export function useRoomConnection(roomId: string | undefined) {
  const [hasAttemptedReconnect, setHasAttemptedReconnect] = useState(false);
  const { gameType } = useParams<{ gameType?: string }>();
  const { user } = useAuth();

  // When user connects to a room, explicitly update the active_room_id in the database
  useEffect(() => {
    if (roomId && user?.id) {
      // Update user's active_room_id directly in the database
      const updateActiveRoom = async () => {
        try {
          console.log(`Setting active room ${roomId} for user ${user.id} in database`);
          const { error } = await supabase
            .from('users')
            .update({ active_room_id: roomId })
            .eq('id', user.id);
            
          if (error) {
            console.error('Failed to update active_room_id in database:', error);
          } else {
            console.log(`Successfully set active_room_id=${roomId} for user ${user.id} in database`);
          }
        } catch (err) {
          console.error('Error updating active_room_id:', err);
        }
      };
      
      updateActiveRoom();
    }
  }, [roomId, user?.id]);

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
      setHasAttemptedReconnect(true);
      return;
    }
    
    const { roomId: storedRoomId, userId: storedUserId, gameType: storedGameType } = roomService.getStoredRoomConnection();
    
    // Validate that the stored user ID matches the current user ID
    if (storedRoomId && storedUserId && storedGameType && storedUserId === user.id) {
      console.log(`Found stored room connection: ${storedRoomId} (${storedGameType}) for user ${storedUserId}, reconnecting`);
      
      try {
        // Verify connection was successful through direct DB check
        const { data: sessionData } = await supabase
          .from('game_sessions')
          .select('id, status')
          .eq('id', storedRoomId)
          .single();
          
        if (!sessionData || !sessionData.id) {
          console.log("Room no longer exists, clearing storage");
          roomService.saveActiveRoomToStorage("", "", "");
        } else {
          // Check if player is actually in this room
          const { data: playerData } = await supabase
            .from('game_players')
            .select('id')
            .eq('session_id', storedRoomId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (playerData && playerData.id) {
            // Update user's active_room_id in the database
            const { error } = await supabase
              .from('users')
              .update({ active_room_id: storedRoomId })
              .eq('id', user.id);
              
            if (error) {
              console.error('Failed to update active_room_id on reconnection:', error);
            } else {
              console.log(`Updated active_room_id=${storedRoomId} for user ${user.id} on reconnection`);
            }
            
            // Only connect to room if this user is actually a player in that room
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
      // If there's partial data or user mismatch, clear it all
      console.log("Invalid stored room data or user mismatch, clearing storage");
      roomService.saveActiveRoomToStorage("", "", "");
    }
    
    setHasAttemptedReconnect(true);
  };
  
  checkStoredConnection();

  useEffect(() => {
    // Setup beforeunload handler to save room data
    if (!roomId || !user?.id) return;
    
    const handleBeforeUnload = () => {
      console.log(`Page is being unloaded, saving room ${roomId} data for user ${user.id}...`);
      roomService.saveActiveRoomToStorage(roomId, user.id, gameType);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [roomId, user?.id, gameType]);

  // Connect to the room if we have a roomId and userId
  useEffect(() => {
    if (!roomId || !user?.id) return;
    
    // Setup the channel
    console.log(`Setting up channel for room ${roomId} as user ${user.id}`);
    const channel = roomService.connectToRoom(roomId, user.id, gameType);
    
    // Save room data to storage
    roomService.saveActiveRoomToStorage(roomId, user.id, gameType);
    
    // Clean up when unmounting
    return () => {
      // Only disconnect if component is unmounting
      if (roomId && user?.id) {
        // Don't disconnect on normal page navigation
        // This is handled by the beforeunload handler
      }
    };
  }, [roomId, user?.id, gameType]);
  
  return { 
    currentUserId: user?.id || null,
    hasAttemptedReconnect
  };
}
