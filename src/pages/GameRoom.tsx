import { Layout } from "@/components/Layout";
import { GameRoomLayout } from "@/components/game/GameRoomLayout";
import { useParams, useNavigate } from "react-router-dom";
import { gameCodeToType, isValidGameType } from "@/lib/gameTypes";
import { useRoomWebSocket } from "@/hooks/room/useRoomWebSocket";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const GameRoom = () => {
  const { roomId, gameType } = useParams<{ roomId: string; gameType: string }>();
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useAuth();
  
  const {
    roomData,
    isLoading,
    currentUserId,
    isReady,
    gameStatus,
    toggleReady,
    startGame,
    forfeitGame
  } = useRoomWebSocket(roomId);
  
  useEffect(() => {
    if (!authLoading && !session) {
      console.log("No auth session in GameRoom, redirecting to /auth");
      navigate("/auth");
    } else if (session) {
      console.log("Authenticated user in GameRoom, staying on page");
    }
  }, [authLoading, session, navigate]);
  
  if (authLoading || isLoading) {
    return null;
  }
  
  const gameName = gameType && isValidGameType(gameType) 
    ? gameCodeToType[gameType] 
    : (gameType ? gameType.charAt(0).toUpperCase() + gameType.slice(1) : "Unknown Game");

  return (
    <Layout>
      <GameRoomLayout
        loading={isLoading}
        roomData={roomData}
        currentUserId={currentUserId}
        gameName={gameName}
        isReady={isReady}
        gameStatus={gameStatus}
        onToggleReady={toggleReady}
        onStartGame={startGame}
        onForfeit={forfeitGame}
      />
    </Layout>
  );
};

export default GameRoom;
