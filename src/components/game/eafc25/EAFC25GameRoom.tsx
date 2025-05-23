
import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useEffect } from "react";
import { toast } from "sonner";
import { useActiveRoomGuard } from "@/hooks/useActiveRoomGuard";
import { EAFC25RoomLayout } from "./EAFC25RoomLayout";
import { useRoomDataState } from "@/hooks/room/useRoomDataState";
import { useMatchState } from "@/hooks/room/match/useMatchState";
import { useMatchSubmissions } from "@/hooks/room/match/useMatchSubmissions";
import { usePlayerReadyStatus } from "@/hooks/arena/usePlayerReadyStatus";
import { arenaRoomService } from "@/services/arena/ArenaRoomWebSocketService";
import { supabase } from "@/integrations/supabase/client"; 
import { usePlayerConnection } from "@/hooks/room/usePlayerConnection";

export function EAFC25GameRoom() {
  useActiveRoomGuard();
  const { roomId } = useParams<{ roomId: string }>();
  
  // Ensure player is marked as connected in the database
  usePlayerConnection(roomId);
  
  // Get room data
  const {
    roomData,
    isLoading,
    currentUserId,
    gameStatus,
    setGameStatus,
    fetchRoomData
  } = useRoomDataState(roomId);

  // Define startGame function before using it in hooks
  const startGame = async () => {
    if (!roomId) return;
    
    try {
      console.log('[EAFC25GameRoom] Starting game');
      
      // Update game status in database
      const { data: updateData, error: updateError } = await supabase
        .from('game_sessions')
        .update({ 
          status: 'Active',
          start_time: new Date().toISOString()
        })
        .eq('id', roomId);
        
      if (updateError) {
        console.error('[EAFC25GameRoom] Error starting game:', updateError);
        toast.error('Failed to start the game');
        return;
      }
      
      // Update local state
      setGameStatus('playing');
      
      toast.info("Match is starting! Remember to take a screenshot of the final score after the match.", {
        duration: 10000,
      });
      
      fetchRoomData(); // Refresh room data
    } catch (error) {
      console.error('[EAFC25GameRoom] Error in startGame:', error);
      toast.error('Failed to start the game');
    }
  };
  
  // Player ready status with auto-start function
  const {
    isReady,
    toggleReady,
    allPlayersReady
  } = usePlayerReadyStatus(roomId, currentUserId, startGame);
  
  // Match state
  const {
    matchStartTime,
    setMatchStartTime,
    matchEnded,
    setMatchEnded,
    scoreSubmitted,
    proofSubmitted,
    showMatchInstructions,
    setShowMatchInstructions
  } = useMatchState({ roomData, gameStatus });
  
  // Match submissions
  const {
    submitScore,
    submitProof,
  } = useMatchSubmissions(roomId, currentUserId);

  // Connect to the room's WebSocket channel
  useEffect(() => {
    if (roomId) {
      console.log(`[EAFC25GameRoom] Connecting to room ${roomId}`);
      arenaRoomService.connectToRoom(roomId);
      
      return () => {
        console.log(`[EAFC25GameRoom] Disconnecting from room ${roomId}`);
        arenaRoomService.disconnectFromRoom(roomId);
      };
    }
  }, [roomId]);

  const forfeitGame = async () => {
    if (!roomId || !currentUserId) return;
    
    try {
      console.log('[EAFC25GameRoom] Player forfeiting game');
      
      // Update player status
      const { error: playerError } = await supabase
        .from('game_players')
        .update({ has_forfeited: true })
        .eq('session_id', roomId)
        .eq('user_id', currentUserId);
        
      if (playerError) {
        console.error('[EAFC25GameRoom] Error updating player forfeit status:', playerError);
        toast.error('Failed to leave the match');
        return;
      }
      
      // Navigate user away from the room
      window.location.href = '/games';
      
      toast.info('You have left the match');
    } catch (error) {
      console.error('[EAFC25GameRoom] Error in forfeitGame:', error);
      toast.error('Failed to leave the match');
    }
  };

  const halfLengthMinutes = roomData?.half_length_minutes || 12;
  const matchDuration = (halfLengthMinutes * 2) + 5;
  
  console.log(`[EAFC25GameRoom] Match settings: Half length: ${halfLengthMinutes}min, Total duration: ${matchDuration}min`);
  
  useEffect(() => {
    if (gameStatus === 'playing' && showMatchInstructions) {
      toast.info("Match has started! Play fair and remember to take a screenshot of the final score screen.", {
        duration: 10000,
      });
      setShowMatchInstructions(false);
    }
  }, [gameStatus, showMatchInstructions, setShowMatchInstructions]);

  useEffect(() => {
    if (matchEnded) {
      toast.warning("Match time ended! Please submit your final score and upload proof.", {
        duration: 10000,
      });
    }
  }, [matchEnded]);

  // Calculate if the "Get Ready" button should be shown
  const connectedPlayers = roomData?.game_players?.filter(player => player.is_connected).length || 0;
  const enoughPlayers = connectedPlayers >= 2;
  const showGetReady = enoughPlayers && gameStatus === 'waiting' && !allPlayersReady;

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
        readyCountdownActive={false} 
        readyCountdownEndTime={null} 
        onScoreSubmit={submitScore}
        onProofSubmit={submitProof}
        showMatchInstructions={showMatchInstructions}
        showGetReady={showGetReady}
        allPlayersReady={allPlayersReady}
      />
    </Layout>
  );
}
