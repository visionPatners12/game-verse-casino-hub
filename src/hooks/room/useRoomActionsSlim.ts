import { useCallback } from "react";
import { roomService } from "@/services/room";
import { toast } from "sonner";
import { useWalletCheck } from "./useWalletCheck";
import { useRoomDisconnect } from "./useRoomDisconnect";

/**
 * A slimmer version of room actions that focuses on specific room functionality
 */
export function useRoomActionsSlim(
  roomId: string | undefined, 
  currentUserId: string | null
) {
  const { hasSufficientBalance } = useWalletCheck();

  const toggleReady = useCallback(async (isReady: boolean, setIsReady: (isReady: boolean) => void) => {
    if (!roomId || !currentUserId) return;

    try {
      const newReadyState = !isReady;
      await roomService.markPlayerReady(roomId, currentUserId, newReadyState);
      setIsReady(newReadyState);
    } catch (error) {
      console.error("Failed to toggle ready state:", error);
      toast.error("Failed to update ready status. Please try again.");
    }
  }, [roomId, currentUserId]);

  const startGame = useCallback(async (setGameStatus: (status: 'waiting' | 'starting' | 'playing' | 'ended') => void) => {
    if (!roomId) return;

    try {
      await roomService.startGame(roomId);
      setGameStatus('starting');
    } catch (error) {
      console.error("Failed to start game:", error);
      toast.error("Failed to start the game. Please try again.");
    }
  }, [roomId]);

  const forfeitGame = useCallback(async (setGameStatus: (status: 'waiting' | 'starting' | 'playing' | 'ended') => void) => {
    const { disconnectFromRoom } = useRoomDisconnect(roomId, currentUserId, setGameStatus);
    await disconnectFromRoom();
  }, [roomId, currentUserId]);

  return {
    toggleReady,
    startGame,
    forfeitGame,
    hasSufficientBalance
  };
}
