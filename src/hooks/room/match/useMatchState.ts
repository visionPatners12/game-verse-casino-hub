
import { useState, useEffect } from "react";
import { RoomData } from "@/components/game/types";

interface MatchStateProps {
  roomData: RoomData | null;
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
}

export function useMatchState({ roomData, gameStatus }: MatchStateProps) {
  const [matchStartTime, setMatchStartTime] = useState<Date | null>(null);
  const [matchEnded, setMatchEnded] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);
  const [showMatchInstructions, setShowMatchInstructions] = useState(true);

  // Set match start time when game status changes to playing
  useEffect(() => {
    if (gameStatus === 'playing' && roomData?.start_time) {
      console.log(`[useMatchState] Setting match start time from roomData: ${roomData.start_time}`);
      setMatchStartTime(new Date(roomData.start_time));
    }
  }, [gameStatus, roomData]);

  // Reset match states when room data changes
  useEffect(() => {
    if (gameStatus === 'waiting') {
      setMatchEnded(false);
      setScoreSubmitted(false);
      setProofSubmitted(false);
    }
  }, [gameStatus]);

  return {
    matchStartTime,
    setMatchStartTime,
    matchEnded,
    setMatchEnded,
    scoreSubmitted,
    setScoreSubmitted,
    proofSubmitted,
    setProofSubmitted,
    showMatchInstructions,
    setShowMatchInstructions,
  };
}
