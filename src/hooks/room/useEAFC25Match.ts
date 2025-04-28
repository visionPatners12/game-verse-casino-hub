
import { useState, useEffect } from "react";
import { useRoomDataState } from "./useRoomDataState";
import { useRoomActions } from "./useRoomActions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMatchState } from "./match/useMatchState";
import { useReadyCountdown } from "./match/useReadyCountdown";
import { useMatchSubmissions } from "./match/useMatchSubmissions";

export function useEAFC25Match(roomId: string | undefined) {
  const { session } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  const {
    roomData,
    isLoading,
    currentUserId,
    gameStatus,
    setGameStatus,
  } = useRoomDataState(roomId);

  const { toggleReady: toggleReadyAction, startGame: startGameAction, forfeitGame: forfeitGameAction } = useRoomActions({
    roomId,
    currentUserId,
    isReady,
    setIsReady,
    setGameStatus,
  });

  const {
    matchStartTime,
    matchEnded,
    setMatchEnded,
    scoreSubmitted,
    setScoreSubmitted,
    proofSubmitted,
    setProofSubmitted,
    showMatchInstructions,
    setShowMatchInstructions,
  } = useMatchState({ roomData, gameStatus });

  const {
    readyCountdownActive,
    readyCountdownEndTime,
  } = useReadyCountdown(roomData);

  const {
    submitScore,
    submitProof,
  } = useMatchSubmissions(roomId, currentUserId);

  // Check if current player is ready when room data loads
  useEffect(() => {
    if (roomData && currentUserId && !isLoading) {
      const currentPlayer = roomData.game_players?.find(player => player.user_id === currentUserId);
      if (currentPlayer) {
        setIsReady(currentPlayer.is_ready || false);
      }
    }
  }, [roomData, currentUserId, isLoading]);

  // Listen for real-time updates to room data
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`room_${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_players',
        filter: `session_id=eq.${roomId}`,
      }, payload => {
        console.log('Game player updated:', payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const toggleReady = async () => {
    await toggleReadyAction();
    
    if (!isReady) {
      toast.success("You are now ready! Waiting for other players...");
    }
  };

  const startGame = async () => {
    if (!roomId) return;
    
    try {
      await startGameAction();
      toast.info("Match is starting! Remember to take a screenshot of the final score after the match.", {
        duration: 10000,
      });
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error('Failed to start the game');
    }
  };

  const forfeitGame = async () => {
    if (!roomId || !currentUserId) return;
    
    try {
      await forfeitGameAction();
      toast.info('You have left the match');
    } catch (error) {
      console.error('Error forfeiting game:', error);
      toast.error('Failed to leave the match');
    }
  };

  return {
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
    readyCountdownActive,
    readyCountdownEndTime,
    submitScore,
    submitProof,
    showMatchInstructions,
    setShowMatchInstructions,
  };
}
