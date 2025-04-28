
import { useState, useEffect } from "react";
import { useRoomDataState } from "./useRoomDataState";
import { useRoomActions } from "./useRoomActions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useEAFC25Match(roomId: string | undefined) {
  const { session } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [matchStartTime, setMatchStartTime] = useState<Date | null>(null);
  const [matchEnded, setMatchEnded] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);
  
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

  // Check if current player is ready when room data loads
  useEffect(() => {
    if (roomData && currentUserId && !isLoading) {
      const currentPlayer = roomData.game_players?.find(player => player.user_id === currentUserId);
      if (currentPlayer) {
        setIsReady(currentPlayer.is_ready || false);
      }
    }
  }, [roomData, currentUserId, isLoading]);

  // Set match start time when game status changes to playing
  useEffect(() => {
    if (gameStatus === 'playing' && !matchStartTime && roomData?.start_time) {
      setMatchStartTime(new Date(roomData.start_time));
    }
  }, [gameStatus, matchStartTime, roomData]);

  // Reset match ended state when room data changes
  useEffect(() => {
    if (gameStatus === 'waiting') {
      setMatchEnded(false);
      setScoreSubmitted(false);
      setProofSubmitted(false);
    }
  }, [gameStatus]);

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
  };

  const startGame = async () => {
    if (!roomId) return;
    
    try {
      await startGameAction();
      setMatchStartTime(new Date());
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
  };
}
