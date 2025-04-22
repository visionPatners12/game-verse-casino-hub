
import { Layout } from "@/components/Layout";
import { GameRoomLayout } from "@/components/game/GameRoomLayout";
import { useParams, useNavigate } from "react-router-dom";
import { gameCodeToType, isValidGameType } from "@/lib/gameTypes";
import { useRoomWebSocket } from "@/hooks/room/useRoomWebSocket";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFutId } from "@/hooks/useFutId";
import { FutIdDialog } from "@/components/game/FutIdDialog";

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
    forfeitGame,
    fetchRoomData,
    players // On va checker tous les joueurs ici si besoin
  } = useRoomWebSocket(roomId);

  // --- FUT ID: actif seulement pour FutArena ---
  const isFutArena = roomData?.game_type?.toLowerCase() === "futarena";

  // On surveille TOUS les joueurs connectés qui n’ont pas de futId
  // Pour l’utilisateur courant uniquement :
  const { futId, isLoading: futIdLoading, saveFutId } = useFutId(currentUserId);
  const [showFutIdDialog, setShowFutIdDialog] = useState(false);

  useEffect(() => {
    // Pour FutArena ET si le joueur courant est connecté ET n’a pas de FUT ID ni en chargement, on ouvre la popup
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

  // Forcer un refresh des données de room au montage
  useEffect(() => {
    if (roomId && !isLoading) {
      fetchRoomData();
    }
  }, [roomId, fetchRoomData]);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate("/auth");
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

