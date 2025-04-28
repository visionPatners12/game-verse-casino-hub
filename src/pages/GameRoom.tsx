
import { Layout } from "@/components/Layout";
import { GameRoomLayout } from "@/components/game/GameRoomLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useGameRoom } from "@/hooks/useGameRoom";
import { useWallet } from "@/hooks/useWallet";
import { useActiveRoomGuard } from "@/hooks/useActiveRoomGuard";
import { useRoomConnectionStatus } from "@/hooks/room/useRoomConnectionStatus";
import { WelcomeMessage } from "@/components/game/WelcomeMessage";

const GameRoom = () => {
  useActiveRoomGuard();
  
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useAuth();
  const { roomId, gameType } = useParams<{ roomId: string; gameType: string }>();
  
  const { wallet } = useWallet({ enableTransactions: false });
  
  const { 
    loading, 
    roomData, 
    currentUserId,
    gameName, 
    gameStatus,
    isReady,
    toggleReady,
    startGame,
    forfeitGame,
    players,
    fetchRoomData
  } = useGameRoom();

  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  
  const { isConnecting, connectionVerified } = useRoomConnectionStatus(roomId, currentUserId);

  useEffect(() => {
    if (!authLoading && !session) {
      console.log("User not authenticated, redirecting to /auth");
      toast.error("You must be logged in to access this page");
      navigate("/auth");
    }
  }, [authLoading, session, navigate]);

  // Redirect to EAFC25 room if this is an EAFC25 game
  useEffect(() => {
    if (!loading && roomData && roomData.game_type?.toLowerCase() === "eafc25") {
      console.log("Redirecting to EAFC25 specialized room");
      navigate(`/games/eafc25/room/${roomId}`);
    }
  }, [loading, roomData, roomId, navigate]);

  useEffect(() => {
    if (roomData?.status === "Active" && gameStatus === "waiting") {
      console.log("Room is active but gameStatus is waiting, updating to playing");
      startGame();
    }
  }, [roomData?.status, gameStatus, startGame]);

  useEffect(() => {
    if (roomId && !loading) {
      fetchRoomData();
      
      const refreshInterval = setInterval(() => {
        fetchRoomData();
      }, 3000);
      
      return () => clearInterval(refreshInterval);
    }
  }, [roomId, fetchRoomData, loading]);

  if (authLoading || loading || isConnecting) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return <Layout><div className="flex items-center justify-center min-h-screen">Redirecting to authentication page...</div></Layout>;
  }

  if (!connectionVerified) {
    return <Layout><div className="flex items-center justify-center min-h-screen">Verifying room connection...</div></Layout>;
  }

  return (
    <Layout>
      <GameRoomLayout
        loading={loading}
        roomData={roomData}
        currentUserId={currentUserId}
        gameName={gameName}
        isReady={isReady}
        gameStatus={gameStatus}
        onToggleReady={toggleReady}
        onStartGame={startGame}
        onForfeit={forfeitGame}
      />
      <WelcomeMessage
        open={showWelcomeMessage}
        onOpenChange={setShowWelcomeMessage}
      />
    </Layout>
  );
};

export default GameRoom;
