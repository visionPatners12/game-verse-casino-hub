
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayerConnectionStatus } from "./usePlayerConnectionStatus";
import { useStoredRoomConnection } from "./useStoredRoomConnection";

export function useRoomConnection(roomId: string | undefined) {
  const { gameType } = useParams<{ gameType?: string }>();
  const { user } = useAuth();
  
  // Handle player connection status
  usePlayerConnectionStatus(roomId, user?.id);
  
  // Handle stored room connection checking
  const { hasAttemptedReconnect } = useStoredRoomConnection(user?.id);

  // Early return if we have a roomId
  if (roomId) {
    return { currentUserId: user?.id || null, hasAttemptedReconnect };
  }
  
  // Early return if we've already attempted reconnection
  if (hasAttemptedReconnect) {
    return { currentUserId: user?.id || null, hasAttemptedReconnect };
  }

  return { 
    currentUserId: user?.id || null,
    hasAttemptedReconnect
  };
}
