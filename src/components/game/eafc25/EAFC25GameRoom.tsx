
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
import { usePlayerConnection } from "@/hooks/room/usePlayerConnection";
import { useRoomConnectionStatus } from "@/hooks/room/useRoomConnectionStatus";
import { supabase } from "@/integrations/supabase/client";

export function EAFC25GameRoom() {
  useActiveRoomGuard();
  const { roomId } = useParams<{ roomId: string }>();
  
  // Mark user as connected to this room
  usePlayerConnection(roomId);
  
  // Verify connection status
  const { isConnecting, connectionVerified } = useRoomConnectionStatus(roomId, supabase.auth.getSession().then(({ data }) => data?.session?.user?.id || null));
  
  // Get room data
  const {
    roomData,
    isLoading,
    currentUserId,
    gameStatus,
    setGameStatus,
    fetchRoomData
  } = useRoomDataState(roomId);
  
  // Match state
  const {
    matchStartTime,
    matchEnded,
    setMatchEnded,
    scoreSubmitted,
    proofSubmitted,
    showMatchInstructions,
    setShowMatchInstructions
  } = useMatchState({ roomData, gameStatus });
  
  // Player ready status
  const {
    isReady,
    toggleReady,
    isLoading: isReadyLoading,
    allPlayersReady
  } = usePlayerReadyStatus(roomId, currentUserId);
  
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
  
  // Log room data for debugging
  useEffect(() => {
    if (roomData) {
      console.log('[EAFC25GameRoom] Room data updated:', {
        id: roomData.id,
        status: roomData.status,
        current_players: roomData.current_players,
        connected_players: roomData.connected_players,
        players: roomData.game_players?.map(p => ({
          id: p.id,
          user_id: p.user_id,
          is_connected: p.is_connected,
          is_ready: p.is_ready,
          display_name: p.display_name
        }))
      });

      // Check why the "Get Ready" button might not be visible
      if (roomData.game_players) {
        const connectedPlayers = roomData.game_players.filter(p => p.is_connected).length;
        console.log(`[EAFC25GameRoom] Connected players: ${connectedPlayers}, Status: ${gameStatus}`);
        console.log(`[EAFC25GameRoom] ShowGetReady condition: ${connectedPlayers >= 2 && gameStatus === 'waiting'}`);
      }
    }
  }, [roomData, gameStatus]);
  
  // Start game when all players are ready
  useEffect(() => {
    if (allPlayersReady && gameStatus === 'waiting' && roomId) {
      console.log('[EAFC25GameRoom] All players ready, preparing to start game');
      // Short delay to ensure UI updates are visible
      const timer = setTimeout(() => {
        startGame();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [allPlayersReady, gameStatus, roomId]);

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

  // Log explicit button state info
  useEffect(() => {
    console.log('[EAFC25GameRoom] Ready button state:', {
      isReady,
      isReadyLoading,
      currentUserId,
      roomId,
      gameStatus,
      connectionVerified
    });
  }, [isReady, isReadyLoading, currentUserId, roomId, gameStatus, connectionVerified]);

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
        isReadyLoading={isReadyLoading}
      />
    </Layout>
  );
}
