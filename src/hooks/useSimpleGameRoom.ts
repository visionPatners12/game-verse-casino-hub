
import { useParams } from "react-router-dom";
import { useRoomWebSocketSlim } from "@/hooks/room/useRoomWebSocketSlim";
import { gameCodeToType, isValidGameType } from "@/lib/gameTypes";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useActiveRoomGuard } from "@/hooks/useActiveRoomGuard"; // Ajout du hook

/**
 * Hook that provides simplified access to game room data and functionality
 * Handles authentication verification and room connection
 */
export const useSimpleGameRoom = () => {
  // Verify authentication before accessing game data
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  
  // Get game type and room ID from URL params
  const { gameType, roomId } = useParams<{ gameType: string; roomId: string }>();
  
  // Initialize room websocket connection
  const {
    roomData,
    isLoading,
    currentUserId,
    gameStatus,
    fetchRoomData,
    isReady,
    toggleReady,
    startGame,
    forfeitGame,
    players
  } = useRoomWebSocketSlim(roomId);
  
  // Get game name from type
  const gameName = gameType && isValidGameType(gameType)
    ? gameCodeToType[gameType]
    : (gameType ? gameType.charAt(0).toUpperCase() + gameType.slice(1) : "Unknown Game");

  return {
    loading: isLoading || authLoading,
    roomData: isAuthenticated ? roomData : null,
    currentUserId,
    gameType,
    gameName,
    gameStatus,
    isReady,
    toggleReady,
    startGame,
    forfeitGame,
    players,
    fetchRoomData
  };
};
