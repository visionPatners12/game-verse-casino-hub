
import { Layout } from "@/components/Layout";
import { GameRoomLayout } from "@/components/game/GameRoomLayout";
import { useParams, useNavigate } from "react-router-dom";
import { gameCodeToType, isValidGameType } from "@/lib/gameTypes";
import { useRoomWebSocket } from "@/hooks/room/useRoomWebSocket";
import { useEffect } from "react";

const GameRoom = () => {
  const { roomId, gameType } = useParams<{ roomId: string; gameType: string }>();
  const navigate = useNavigate();
  
  const {
    roomData,
    isLoading,
    currentUserId,
    isReady,
    gameStatus,
    toggleReady,
    startGame
  } = useRoomWebSocket(roomId);
  
  // Redirect if room doesn't exist
  useEffect(() => {
    if (!isLoading && !roomData && roomId) {
      // No room data found after loading completed
      navigate("/games");
    }
  }, [isLoading, roomData, roomId, navigate]);
  
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
