
import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useEAFC25Match } from "@/hooks/room/useEAFC25Match";
import { useActiveRoomGuard } from "@/hooks/useActiveRoomGuard";
import { EAFC25RoomLayout } from "./EAFC25RoomLayout";

export function EAFC25GameRoom() {
  useActiveRoomGuard();
  const { roomId } = useParams<{ roomId: string }>();
  const [showMatchInstructions, setShowMatchInstructions] = useState(true);
  
  const {
    roomData,
    isLoading,
    currentUserId,
    gameStatus,
    isReady,
    toggleReady,
    startGame,
    forfeitGame,
    matchStartTime,
    matchEnded,
    setMatchEnded,
    scoreSubmitted,
    proofSubmitted,
  } = useEAFC25Match(roomId);

  const halfLengthMinutes = roomData?.half_length_minutes || 12;
  const matchDuration = (halfLengthMinutes * 2) + 5;
  
  useEffect(() => {
    if (gameStatus === 'playing' && showMatchInstructions) {
      toast.info("Match has started! Play fair and remember to take a screenshot of the final score screen.");
      setShowMatchInstructions(false);
    }
  }, [gameStatus, showMatchInstructions]);

  useEffect(() => {
    if (matchEnded) {
      toast.warning("Match time ended! Please submit your final score and upload proof.", {
        duration: 10000,
      });
    }
  }, [matchEnded]);

  return (
    <Layout>
      <EAFC25RoomLayout
        loading={isLoading}
        roomData={roomData}
        currentUserId={currentUserId}
        gameStatus={gameStatus}
        isReady={isReady}
        onToggleReady={toggleReady}
        onStartGame={startGame}
        onForfeit={forfeitGame}
        matchStartTime={matchStartTime}
        matchDuration={matchDuration}
        matchEnded={matchEnded}
        setMatchEnded={setMatchEnded}
        scoreSubmitted={scoreSubmitted}
        proofSubmitted={proofSubmitted}
      />
    </Layout>
  );
}
