
import { Layout } from "@/components/Layout";
import { GameRoomLayout } from "@/components/game/GameRoomLayout";
import { useParams, useNavigate } from "react-router-dom";
import { gameCodeToType, isValidGameType } from "@/lib/gameTypes";
import { useRoomWebSocket } from "@/hooks/room/useRoomWebSocket";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

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
    startGame
  } = useRoomWebSocket(roomId);
  
  // Only redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !session) {
      navigate("/auth");
    }
  }, [authLoading, session, navigate]);
  
  // Show nothing while checking auth or loading room data
  if (authLoading || isLoading) {
    return null;
  }
  
  // Safely get the game name from the type
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
      />
    </Layout>
  );
};

export default GameRoom;
