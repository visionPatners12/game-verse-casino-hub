
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
  const [readyCountdownActive, setReadyCountdownActive] = useState(false);
  const [readyCountdownEndTime, setReadyCountdownEndTime] = useState<Date | null>(null);
  const [showMatchInstructions, setShowMatchInstructions] = useState(true);
  
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
      setReadyCountdownActive(false);
      setReadyCountdownEndTime(null);
    }
  }, [gameStatus]);

  // Handle ready countdown when first player clicks ready
  useEffect(() => {
    if (roomData && roomData.game_players) {
      const readyPlayers = roomData.game_players.filter(player => player.is_ready);
      const connectedPlayers = roomData.game_players.filter(player => player.is_connected);
      
      // If one player is ready and we have enough players, start the ready countdown
      if (readyPlayers.length === 1 && connectedPlayers.length >= 2 && !readyCountdownActive) {
        // Set 5 minute countdown for second player to get ready
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + 5);
        setReadyCountdownEndTime(endTime);
        setReadyCountdownActive(true);
        
        // Notify about countdown
        toast.info("Waiting for all players to get ready. 5 minute countdown started.", {
          duration: 5000,
        });
      }
      
      // If all connected players are ready, clear the countdown
      if (readyPlayers.length === connectedPlayers.length && connectedPlayers.length >= 2) {
        setReadyCountdownActive(false);
      }
    }
  }, [roomData, readyCountdownActive]);

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
      // Show toast when player clicks Get Ready
      toast.success("You are now ready! Waiting for other players...");
    }
  };

  const startGame = async () => {
    if (!roomId) return;
    
    try {
      await startGameAction();
      setMatchStartTime(new Date());
      // Show match instructions toast
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

  const submitScore = async (myScore: number, opponentScore: number) => {
    if (!roomId || !currentUserId) return false;
    
    try {
      // Save score to database
      const { error } = await supabase
        .from('game_players')
        .update({ current_score: myScore })
        .eq('session_id', roomId)
        .eq('user_id', currentUserId);
        
      if (error) throw error;
      
      setScoreSubmitted(true);
      toast.success("Score submitted successfully");
      return true;
    } catch (error) {
      console.error('Error submitting score:', error);
      toast.error('Failed to submit score');
      return false;
    }
  };

  const submitProof = async (file: File) => {
    if (!roomId || !currentUserId) return false;
    
    try {
      // Create storage bucket if it doesn't exist
      const { data: bucketExists } = await supabase
        .storage
        .getBucket('match-proofs');
        
      if (!bucketExists) {
        console.log("Creating match-proofs bucket");
      }
      
      // Upload file to Supabase Storage
      const filePath = `${roomId}/${currentUserId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('match-proofs')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Update player record with proof submitted state
      const { error: updateError } = await supabase
        .from('game_players')
        .update({ 
          proof_submitted: true,
          proof_path: filePath 
        })
        .eq('session_id', roomId)
        .eq('user_id', currentUserId);
        
      if (updateError) throw updateError;
      
      setProofSubmitted(true);
      toast.success("Match proof uploaded successfully");
      return true;
    } catch (error) {
      console.error('Error submitting proof:', error);
      toast.error('Failed to upload match proof');
      return false;
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
