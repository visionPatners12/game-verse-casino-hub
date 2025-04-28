
import { Layout } from "@/components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useSimpleGameRoom } from "@/hooks/useSimpleGameRoom";
import { useWallet } from "@/hooks/useWallet";
import { useActiveRoomGuard } from "@/hooks/useActiveRoomGuard";
import { useRoomConnectionStatus } from "@/hooks/room/useRoomConnectionStatus";
import { WelcomeMessage } from "@/components/game/WelcomeMessage";
import { EAFC25RoomLayout } from "./EAFC25RoomLayout";
import { GamePlatform } from "@/types/futarena";

const EAFC25GameRoom = () => {
  useActiveRoomGuard();
  
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useAuth();
  const { roomId } = useParams<{ roomId: string }>();
  
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
  } = useSimpleGameRoom();

  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [matchEnded, setMatchEnded] = useState(false);
  const [matchStartTime, setMatchStartTime] = useState<Date | null>(null);
  
  const { isConnecting, connectionVerified } = useRoomConnectionStatus(roomId, currentUserId);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !session) {
      console.log("User not authenticated, redirecting to /auth");
      toast.error("You must be logged in to access this page");
      navigate("/auth");
    }
  }, [authLoading, session, navigate]);

  // Show welcome message
  useEffect(() => {
    if (roomData?.status === "waiting") {
      setShowWelcomeMessage(true);
    }
  }, [roomData]);

  // Mark game as active when both players are ready
  useEffect(() => {
    if (roomData?.status === "Active" && gameStatus === "waiting") {
      console.log("Room is active but gameStatus is waiting, updating to playing");
      startGame();
      setMatchStartTime(new Date());
    }
  }, [roomData?.status, gameStatus, startGame]);

  // Poll for room data updates
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

  // Get properties with defaults if they don't exist
  const platform = (roomData?.platform || "ps5") as GamePlatform;
  const halfLengthMinutes = roomData?.half_length_minutes || 12;
  const matchDuration = (halfLengthMinutes * 2) + 5; // Game time + 5 min margin

  return (
    <Layout>
      <EAFC25RoomLayout
        loading={loading}
        roomData={roomData}
        currentUserId={currentUserId}
        gameName={gameName}
        isReady={isReady}
        gameStatus={gameStatus}
        onToggleReady={toggleReady}
        onStartGame={startGame}
        onForfeit={forfeitGame}
        matchEnded={matchEnded}
        setMatchEnded={setMatchEnded}
        matchStartTime={matchStartTime}
        matchDuration={matchDuration}
      />
      
      <WelcomeMessage
        open={showWelcomeMessage}
        onOpenChange={setShowWelcomeMessage}
      />
    </Layout>
  );
};

export default EAFC25GameRoom;
