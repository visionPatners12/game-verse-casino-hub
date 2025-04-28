
import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useEAFC25Match } from "@/hooks/room/useEAFC25Match";
import { useActiveRoomGuard } from "@/hooks/useActiveRoomGuard";
import { RenewedEAFC25Room } from "./RenewedEAFC25Room";

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
    submitScore,
    submitProof,
  } = useEAFC25Match(roomId);

  // Properties with fallback defaults
  const platform = roomData?.platform || "ps5";
  const halfLengthMinutes = roomData?.half_length_minutes || 12;
  const matchDuration = (halfLengthMinutes * 2) + 5; // Game time + 5 min margin
  
  // Show instructions when match starts
  useEffect(() => {
    if (gameStatus === 'playing' && showMatchInstructions) {
      toast.info("Match has started! Play fair and remember to take a screenshot of the final score screen.");
      setShowMatchInstructions(false);
    }
  }, [gameStatus, showMatchInstructions]);

  // Show proof reminder when match is about to end
  useEffect(() => {
    if (matchEnded) {
      toast.warning("Match time ended! Please submit your final score and upload proof.", {
        duration: 10000,
      });
    }
  }, [matchEnded]);

  // Skip loading state to avoid flashing
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-xl font-medium">Loading match room...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <RenewedEAFC25Room
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
        onScoreSubmit={submitScore}
        onProofSubmit={submitProof}
      />
    </Layout>
  );
}
