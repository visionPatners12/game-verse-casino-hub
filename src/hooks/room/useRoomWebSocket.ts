
import { useState, useEffect, useCallback } from "react";
import { roomService } from "@/services/roomWebSocketService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RoomData } from "@/components/game/types";

export function useRoomWebSocket(roomId: string | undefined) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState<any[]>([]);
  const [presenceState, setPresenceState] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'starting' | 'playing' | 'ended'>('waiting');
  const { toast } = useToast();

  // Fetch initial room data
  const fetchRoomData = useCallback(async () => {
    if (!roomId) return;
    
    try {
      setIsLoading(true);
      
      const { data: roomData, error: roomError } = await supabase
        .from('game_sessions')
        .select(`
          *,
          game_players(
            id,
            display_name,
            user_id,
            current_score,
            is_connected,
            is_ready,
            users:user_id(username, avatar_url)
          )
        `)
        .eq('id', roomId)
        .single();
        
      if (roomError) throw roomError;
      
      console.log('Fetched room data:', roomData);
      setRoomData(roomData as RoomData);
      setPlayers(roomData.game_players || []);
      
      // Set game status based on room status
      if (roomData.status === 'Playing') {
        setGameStatus('playing');
      } else if (roomData.status === 'Completed') {
        setGameStatus('ended');
      } else {
        setGameStatus('waiting');
      }
      
    } catch (error) {
      console.error('Error fetching room data:', error);
      toast({
        title: "Error Loading Room",
        description: "Could not load game room data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [roomId, toast]);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    
    getCurrentUser();
  }, []);

  // Connect to WebSocket when roomId and userId are available
  useEffect(() => {
    if (!roomId || !currentUserId) return;
    
    console.log(`Setting up WebSocket connection for room ${roomId}`);
    
    // Connect to room WebSocket
    roomService.connectToRoom(roomId, currentUserId);
    
    // Set up event listeners
    roomService.onEvent('presenceSync', (id: string, state: any) => {
      console.log('Presence state updated:', state);
      setPresenceState(state);
      
      // Check if current user is ready
      const currentUserPresence = Object.values(state)
        .flat()
        .find((presence: any) => presence.user_id === currentUserId);
        
      if (currentUserPresence) {
        setIsReady(!!currentUserPresence.is_ready);
      }
    });
    
    roomService.onEvent('playerJoined', (id: string, data: any) => {
      console.log('Player joined event:', data);
      fetchRoomData(); // Refresh room data when a player joins
    });
    
    roomService.onEvent('playerLeft', (id: string, data: any) => {
      console.log('Player left event:', data);
      fetchRoomData(); // Refresh room data when a player leaves
    });
    
    roomService.onEvent('gameStart', (id: string, data: any) => {
      console.log('Game started:', data);
      setGameStatus('playing');
      fetchRoomData(); // Refresh room data when game starts
    });
    
    roomService.onEvent('gameOver', (id: string, data: any) => {
      console.log('Game over:', data);
      setGameStatus('ended');
      fetchRoomData(); // Refresh room data when game ends
    });
    
    // Initial data fetch
    fetchRoomData();
    
    // Cleanup function
    return () => {
      if (roomId && currentUserId) {
        roomService.disconnectFromRoom(roomId, currentUserId);
      }
      
      roomService.offEvent('presenceSync', () => {});
      roomService.offEvent('playerJoined', () => {});
      roomService.offEvent('playerLeft', () => {});
      roomService.offEvent('gameStart', () => {});
      roomService.offEvent('gameOver', () => {});
    };
  }, [roomId, currentUserId, fetchRoomData]);

  // Create a function to toggle ready status
  const toggleReady = useCallback(async () => {
    if (!roomId || !currentUserId) return;
    
    const newReadyState = !isReady;
    try {
      await roomService.markPlayerReady(roomId, currentUserId, newReadyState);
      setIsReady(newReadyState);
    } catch (error) {
      console.error('Error toggling ready status:', error);
      toast({
        title: "Error",
        description: "Could not update ready status. Please try again.",
        variant: "destructive"
      });
    }
  }, [roomId, currentUserId, isReady, toast]);

  // Create a function to start the game
  const startGame = useCallback(async () => {
    if (!roomId) return;
    
    try {
      setGameStatus('starting');
      const result = await roomService.startGame(roomId);
      if (result) {
        setGameStatus('playing');
      } else {
        setGameStatus('waiting');
      }
    } catch (error) {
      console.error('Error starting game:', error);
      setGameStatus('waiting');
      toast({
        title: "Error",
        description: "Could not start the game. Please try again.",
        variant: "destructive"
      });
    }
  }, [roomId, toast]);

  // Function to broadcast a move
  const broadcastMove = useCallback((moveData: any) => {
    if (!roomId) return;
    
    roomService.broadcastMove(roomId, moveData);
  }, [roomId]);

  // Function to end the game
  const endGame = useCallback(async (results: any) => {
    if (!roomId) return;
    
    try {
      await roomService.endGame(roomId, results);
      setGameStatus('ended');
    } catch (error) {
      console.error('Error ending game:', error);
      toast({
        title: "Error",
        description: "Could not end the game properly. Please try again.",
        variant: "destructive"
      });
    }
  }, [roomId, toast]);

  return {
    roomData,
    isLoading,
    players,
    currentUserId,
    presenceState,
    isReady,
    gameStatus,
    toggleReady,
    startGame,
    broadcastMove,
    endGame,
    fetchRoomData
  };
}
