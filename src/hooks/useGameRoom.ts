
import { useParams } from "react-router-dom";
import { useRoomWebSocket } from "@/hooks/room/useRoomWebSocket";
import { gameCodeToType, isValidGameType } from "@/lib/gameTypes";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useWalletBalanceCheck } from "@/hooks/room/useWalletBalanceCheck";

export const useGameRoom = () => {
  // Vérification de l'authentification avant d'accéder aux données de jeu
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  
  const { gameType, roomId } = useParams<{ gameType: string; roomId: string }>();
  
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
  } = useRoomWebSocket(roomId);

  // Ajout du hook pour la vérification du solde
  const { InsufficientFundsDialog } = useWalletBalanceCheck();
  
  // Safely get the game name from the type
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
    fetchRoomData,
    InsufficientFundsDialog
  };
};
