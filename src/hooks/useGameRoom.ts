
import { useParams } from "react-router-dom";
import { useRoomWebSocket } from "@/hooks/room/useRoomWebSocket";
import { gameCodeToType, isValidGameType } from "@/lib/gameTypes";

export const useGameRoom = () => {
  const { gameType, roomId } = useParams<{ gameType: string; roomId: string }>();
  
  const {
    roomData,
    isLoading,
    currentUserId,
    gameStatus,
  } = useRoomWebSocket(roomId);
  
  // Safely get the game name from the type
  const gameName = gameType && isValidGameType(gameType)
    ? gameCodeToType[gameType]
    : (gameType ? gameType.charAt(0).toUpperCase() + gameType.slice(1) : "Unknown Game");

  return {
    loading: isLoading,
    roomData,
    currentUserId,
    gameType,
    gameName,
    gameStatus
  };
};
