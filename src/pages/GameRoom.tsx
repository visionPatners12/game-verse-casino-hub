
import { Layout } from "@/components/Layout";
import { GameRoomLayout } from "@/components/game/GameRoomLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFutId } from "@/hooks/useFutId";
import { FutIdDialog } from "@/components/game/FutIdDialog";
import { toast } from "sonner";
import { useGameRoom } from "@/hooks/useGameRoom";
import { useWallet } from "@/hooks/useWallet"; // Import useWallet

const GameRoom = () => {
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useAuth();
  const { roomId } = useParams<{ roomId: string }>();
  
  // Add wallet without transactions
  const { wallet } = useWallet({ enableTransactions: false });
  
  // Utilize the useGameRoom hook - will be called unconditionally
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

  // Always call hooks regardless of conditions - move any conditional logic inside effect callbacks
  const [showFutIdDialog, setShowFutIdDialog] = useState(false);
  
  // Ensure this hook is always called - moved outside of any conditional blocks
  const { futId, isLoading: futIdLoading, saveFutId } = useFutId(currentUserId || "");
  const [isFutArena, setIsFutArena] = useState(false);
  
  // Vérification renforcée de l'authentification
  useEffect(() => {
    if (!authLoading && !session) {
      console.log("Utilisateur non authentifié, redirection vers /auth");
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate("/auth");
    }
  }, [authLoading, session, navigate]);

  // Check if the game is FutArena
  useEffect(() => {
    if (roomData?.game_type) {
      setIsFutArena(roomData.game_type.toLowerCase() === "futarena");
    }
  }, [roomData?.game_type]);

  // If the room is active, mettre à jour l'état du jeu
  useEffect(() => {
    if (roomData?.status === "Active" && gameStatus === "waiting") {
      console.log("Room is active but gameStatus is waiting, updating to playing");
      // Mise à jour automatique de l'état du jeu basée sur le statut de la room
      startGame();
    }
  }, [roomData?.status, gameStatus, startGame]);

  // Handle FutId dialog visibility
  useEffect(() => {
    if (
      isFutArena &&
      !!currentUserId &&
      !futId &&
      !futIdLoading &&
      !showFutIdDialog &&
      !authLoading &&
      session
    ) {
      setShowFutIdDialog(true);
    }
  }, [isFutArena, currentUserId, futId, futIdLoading, showFutIdDialog, authLoading, session]);

  // Forcer un refresh des données de room au montage et sur changement important
  useEffect(() => {
    if (roomId && !loading) {
      fetchRoomData();
      
      // Créer un intervalle de rafraîchissement plus fréquent pour les données importantes
      const refreshInterval = setInterval(() => {
        fetchRoomData();
      }, 3000); // Rafraîchir toutes les 3 secondes
      
      return () => clearInterval(refreshInterval);
    }
  }, [roomId, fetchRoomData, loading]);

  // Early returns with loading indicators instead of conditional rendering that skips hooks
  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!session) {
    return <Layout><div className="flex items-center justify-center min-h-screen">Redirection vers la page d'authentification...</div></Layout>;
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
      {/* Only show FutID dialog for FutArena games */}
      {isFutArena && (
        <FutIdDialog
          open={showFutIdDialog}
          onOpenChange={setShowFutIdDialog}
          onSave={saveFutId}
          isLoading={futIdLoading}
        />
      )}
    </Layout>
  );
};

export default GameRoom;
