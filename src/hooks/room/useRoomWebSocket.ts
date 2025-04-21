import { useState, useEffect, useCallback } from "react";
import { roomService } from "@/services/room";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RoomData, SessionStatus, PresenceData, DatabaseSessionStatus } from "@/components/game/types";

export function useRoomWebSocket(roomId: string | undefined) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState<any[]>([]);
  const [presenceState, setPresenceState] = useState<Record<string, PresenceData[]>>({});
  const [isReady, setIsReady] = useState(false);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'starting' | 'playing' | 'ended'>('waiting');
  const { toast } = useToast();

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
            ea_id,
            users:user_id(username, avatar_url)
          )
        `)
        .eq('id', roomId)
        .single();
        
      if (roomError) throw roomError;
      
      console.log('Fetched room data:', roomData);
      
      const typedRoomData = roomData as unknown as RoomData;
      setRoomData(typedRoomData);
      setPlayers(typedRoomData.game_players || []);
      
      const dbStatus = roomData.status as DatabaseSessionStatus;
      
      if (dbStatus === 'Active') {
        setGameStatus('playing');
      } else if (dbStatus === 'Finished') {
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

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!roomId) {
      const { roomId: storedRoomId, userId: storedUserId } = roomService.getStoredRoomConnection();
      
      if (storedRoomId && storedUserId) {
        console.log(`Reconnecting to stored room: ${storedRoomId}`);
        window.location.href = `/games/${storedRoomId.split('-')[0]}/room/${storedRoomId}`;
      }
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !currentUserId) return;
    
    console.log(`Setting up WebSocket connection for room ${roomId}`);
    
    roomService.connectToRoom(roomId, currentUserId);
    
    roomService.onEvent('presenceSync', (id: string, state: Record<string, PresenceData[]>) => {
      console.log('Presence state updated:', state);
      setPresenceState(state);
      
      const currentUserPresence = Object.values(state)
        .flat()
        .find((presence) => {
          const typedPresence = presence as PresenceData;
          return typedPresence.user_id === currentUserId;
        });
        
      if (currentUserPresence) {
        setIsReady((currentUserPresence as PresenceData).is_ready === true);
      }
    });
    
    roomService.onEvent('playerJoined', (id: string, data: any) => {
      console.log('Player joined event:', data);
      fetchRoomData();
    });
    
    roomService.onEvent('playerLeft', (id: string, data: any) => {
      console.log('Player left event:', data);
      fetchRoomData();
    });
    
    roomService.onEvent('gameStart', (id: string, data: any) => {
      console.log('Game started:', data);
      setGameStatus('playing');
      fetchRoomData();
    });
    
    roomService.onEvent('gameOver', (id: string, data: any) => {
      console.log('Game over:', data);
      setGameStatus('ended');
      fetchRoomData();
    });
    
    fetchRoomData();
    
    return () => {
      if (roomId && currentUserId) {
        if (window.performance && performance.navigation && performance.navigation.type !== 1) {
          roomService.disconnectFromRoom(roomId, currentUserId);
        }
      }
      
      roomService.offEvent('presenceSync', () => {});
      roomService.offEvent('playerJoined', () => {});
      roomService.offEvent('playerLeft', () => {});
      roomService.offEvent('gameStart', () => {});
      roomService.offEvent('gameOver', () => {});
    };
  }, [roomId, currentUserId, fetchRoomData]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log("Tab/browser closing detected");
      
      if (roomId && currentUserId) {
        roomService.saveActiveRoomToStorage(roomId, currentUserId);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [roomId, currentUserId]);

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

  const broadcastMove = useCallback((moveData: any) => {
    if (!roomId) return;
    
    roomService.broadcastMove(roomId, moveData);
  }, [roomId]);

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
