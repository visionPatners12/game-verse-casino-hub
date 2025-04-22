
import { Layout } from "@/components/Layout";
import { GameRoomLayout } from "@/components/game/GameRoomLayout";
import { useParams, useNavigate } from "react-router-dom";
import { gameCodeToType, isValidGameType } from "@/lib/gameTypes";
import { useRoomWebSocket } from "@/hooks/room/useRoomWebSocket";
import { useEffect, useState, useMemo } from "react";
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
    players
  } = useRoomWebSocket(roomId);

  // --- FUT ID: actif seulement pour FutArena ---
  const isFutArena = roomData?.game_type?.toLowerCase() === "futarena";

  // For all connected players, check who needs FUT ID
  const connectedPlayers = useMemo(
    () =>
      (roomData?.game_players ?? []).filter(
        p => p.is_connected && !!p.user_id
      ),
    [roomData]
  );

  // Map of userId -> futId per connected player
  const futIdsMap = {};
  connectedPlayers.forEach(p => {
    // Only check for the current user running this UI (cannot manage others)
    if (p.user_id === currentUserId) {
      // Use the hook to fetch futId for current user
      // The hook is called below
    }
  });

  // Only call useFutId for the current user, but we use roomData to know for others
  const { futId, isLoading: futIdLoading, saveFutId } = useFutId(currentUserId);
  const [showFutIdDialog, setShowFutIdDialog] = useState(false);

  // If the current user's futId is missing and we're in FutArena, open dialog
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
      {/* Only the current user can manage their own FUT ID */}
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
