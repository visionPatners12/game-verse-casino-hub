import { useState } from "react";
import { useRoomDataState } from "./useRoomDataState";
import { useRoomSocketEvents } from "./useRoomSocketEvents";
import { useRoomActions } from "./useRoomActions";
import { PresenceData } from "@/components/game/types";
import { useRoomConnection } from "./useRoomConnection";

/**
 * A slimmer version of the room websocket hook that separates concerns more cleanly
 */
export function useRoomWebSocketSlim(roomId: string | undefined) {
  const [presenceState, setPresenceState] = useState<Record<string, PresenceData[]>>({});
  const [isReady, setIsReady] = useState(false);
  
  // Get user connection status and currentUserId
  const { currentUserId } = useRoomConnection(roomId);

  // Handle room data state (players, status, etc)
  const {
    roomData,
    isLoading,
    players,
    fetchRoomData,
    gameStatus,
    setGameStatus,
    setRoomData,
    setPlayers,
  } = useRoomDataState(roomId);

  // Set up event listeners for room events
  useRoomSocketEvents({
    roomId,
    currentUserId,
    fetchRoomData,
    setGameStatus,
    setIsReady,
    setPresenceState
  });

  // Set up room actions (toggle ready, start game, etc)
  const { 
    toggleReady, 
    startGame,
    forfeitGame 
  } = useRoomActions({
    roomId,
    currentUserId,
    isReady,
    setIsReady,
    setGameStatus,
  });

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
