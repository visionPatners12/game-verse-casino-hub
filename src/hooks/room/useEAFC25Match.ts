
import { useState, useEffect } from "react";
import { useRoomDataState } from "./useRoomDataState";
import { useRoomActions } from "./useRoomActions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMatchState } from "./match/useMatchState";
import { useReadyCountdown } from "./match/useReadyCountdown";
import { useMatchSubmissions } from "./match/useMatchSubmissions";
import { toast } from "sonner";

interface PlayerUpdatePayload {
  new: {
    user_id: string;
    is_ready: boolean;
  };
  old?: {
    user_id: string;
    is_ready: boolean;
  };
}

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

  // Check if current player is ready when room data loads or changes
  useEffect(() => {
    if (roomData && currentUserId && !isLoading) {
      const currentPlayer = roomData.game_players?.find(player => player.user_id === currentUserId);
      if (currentPlayer) {
        setIsReady(currentPlayer.is_ready || false);
      }
    }
  }, [roomData, currentUserId, isLoading]);

  // Listen for real-time updates to room data and players
  useEffect(() => {
    if (!roomId) return;

    // Subscribe to game_players changes
    const playersChannel = supabase
      .channel(`game_players_${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'game_players',
        filter: `session_id=eq.${roomId}`,
      }, (payload: { new: PlayerUpdatePayload['new']; old?: PlayerUpdatePayload['old'] }) => {
        console.log('Game player updated in real-time:', payload);
        
        if (payload.new && payload.new.user_id === currentUserId) {
          setIsReady(!!payload.new.is_ready);
          
          if (payload.new.is_ready && (!payload.old || !payload.old.is_ready)) {
            toast.success("You are now ready! Waiting for other players...");
          }
        }
      })
      .subscribe();

    // Also listen for room status changes
    const roomChannel = supabase
      .channel(`room_status_${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_sessions',
        filter: `id=eq.${roomId}`,
      }, payload => {
        console.log('Room status updated in real-time:', payload);
        
        if (payload.new && payload.new.status !== payload.old?.status) {
          if (payload.new.status === 'Active') {
            setGameStatus('playing');
            toast.info("Match is starting! Remember to take a screenshot of the final score after the match.", {
              duration: 10000,
            });
          } else if (payload.new.status === 'Finished') {
            setGameStatus('ended');
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(roomChannel);
    };
  }, [roomId, currentUserId, setGameStatus]);

  const toggleReady = async () => {
    try {
      await toggleReadyAction();
    } catch (error) {
      console.error('Error toggling ready state:', error);
      toast.error('Failed to update ready status');
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
