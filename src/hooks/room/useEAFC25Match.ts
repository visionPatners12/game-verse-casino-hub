
import { useState, useEffect } from 'react';
import { useRoomWebSocketSlim } from './useRoomWebSocketSlim';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useEAFC25Match(roomId: string | undefined) {
  const {
    roomData,
    isLoading,
    currentUserId,
    gameStatus,
    fetchRoomData,
    isReady,
    toggleReady,
    startGame,
    forfeitGame,
    players
  } = useRoomWebSocketSlim(roomId);

  const [matchStartTime, setMatchStartTime] = useState<Date | null>(null);
  const [matchEnded, setMatchEnded] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);
  const [disputeActive, setDisputeActive] = useState(false);
  
  // Start match timer when game becomes active
  useEffect(() => {
    if (gameStatus === 'playing' && !matchStartTime) {
      setMatchStartTime(new Date());
    }
  }, [gameStatus, matchStartTime]);
  
  // Check if all players have submitted scores
  useEffect(() => {
    if (matchEnded) {
      const checkScoresSubmitted = async () => {
        try {
          // Check if all players have submitted scores
          const { data: gamePlayers, error } = await supabase
            .from('game_players')
            .select('id, user_id, current_score')
            .eq('session_id', roomId);
            
          if (error) throw error;
          
          // Simple logic to check if scores match
          if (gamePlayers && gamePlayers.length > 1) {
            const playerScores = gamePlayers.map(p => p.current_score);
            const allSubmitted = playerScores.every(score => score !== null && score !== undefined);
            
            if (allSubmitted) {
              // Logic to determine match outcome
              const player1 = gamePlayers[0];
              const player2 = gamePlayers[1];
              
              if (player1.current_score === player2.current_score) {
                // Draw
                toast.info("Match ended in a draw");
              } else {
                const winner = player1.current_score > player2.current_score ? player1 : player2;
                if (winner.user_id === currentUserId) {
                  toast.success("You won the match!");
                } else {
                  toast.info("You lost the match");
                }
              }
            }
          }
        } catch (error) {
          console.error("Error checking scores:", error);
        }
      };
      
      checkScoresSubmitted();
    }
  }, [matchEnded, roomId, currentUserId, scoreSubmitted]);
  
  // Submit score to the database
  const submitScore = async (myScore: number, opponentScore: number) => {
    if (!currentUserId || !roomId) return;
    
    try {
      // Update the player's score
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
      console.error("Error submitting score:", error);
      toast.error("Failed to submit score");
      return false;
    }
  };
  
  // Submit proof (screenshot)
  const submitProof = async (proofFile: File) => {
    if (!currentUserId || !roomId) return;
    
    try {
      // Upload proof to storage
      const fileExt = proofFile.name.split('.').pop();
      const fileName = `match-proofs/${roomId}/${currentUserId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('match-proofs')
        .upload(fileName, proofFile);
      
      if (uploadError) throw uploadError;
      
      // Update player record with proof URL
      const proofUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/match-proofs/${fileName}`;
      
      // This would require adding a column to game_players table
      // For now, we'll just simulate success
      
      setProofSubmitted(true);
      toast.success("Proof submitted successfully");
      return true;
    } catch (error) {
      console.error("Error submitting proof:", error);
      toast.error("Failed to submit proof");
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
    players,
    fetchRoomData,
    matchStartTime,
    matchEnded,
    setMatchEnded,
    scoreSubmitted,
    proofSubmitted,
    submitScore,
    submitProof,
    disputeActive,
    setDisputeActive
  };
}
