
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RoomData, DatabaseSessionStatus } from "@/components/game/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function useRoomDataState(roomId: string | undefined) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'starting' | 'playing' | 'ended'>('waiting');
  const { toast } = useToast();
  const { session } = useAuth();
  const isFirstLoad = useRef(true);
  const lastPollTime = useRef(Date.now());
  const lastRoomDataHash = useRef<string | null>(null);
  const lastFetchTime = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 500; // Minimum 500ms between fetches pour éviter les requêtes trop fréquentes

  const hashRoomData = (data: any): string => {
    if (!data) return '';
    const simplified = {
      pot: data.pot,
      current_players: data.current_players,
      status: data.status,
      players: data.game_players ? data.game_players.map((p: any) => ({
        id: p.id,
        is_ready: p.is_ready,
        is_connected: p.is_connected,
        current_score: p.current_score,
        ea_id: p.ea_id // Inclure le ea_id dans le hash pour détecter les changements
      })) : []
    };
    return JSON.stringify(simplified);
  };

  const fetchRoomData = useCallback(async () => {
    if (!roomId || !session?.user) return;

    // Éviter les requêtes trop fréquentes
    const now = Date.now();
    if (now - lastFetchTime.current < MIN_FETCH_INTERVAL) {
      return;
    }
    lastFetchTime.current = now;

    try {
      if (isFirstLoad.current) {
        setIsLoading(true);
      }
      
      const shouldLog = isFirstLoad.current || (Date.now() - lastPollTime.current > 30000);
      
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

      if (roomError) {
        console.error('Error fetching room data:', roomError);
        return;
      }
      
      if (isFirstLoad.current) {
        console.log("Fetched room data:", roomData);
      }
      
      const { data: potData } = await supabase.rpc('calculate_prize_pool', {
        session_id: roomId
      });
      
      if (potData && isFirstLoad.current) {
        console.log(`Recalculated pot value: ${potData}`);
        roomData.pot = potData;
      }
      
      const typedRoomData = roomData as unknown as RoomData;
      const newDataHash = hashRoomData(typedRoomData);
      
      setRoomData(prevData => {
        if (!prevData || isFirstLoad.current || newDataHash !== lastRoomDataHash.current) {
          lastRoomDataHash.current = newDataHash;
          
          // Log des changements pour débogage
          if (!isFirstLoad.current && newDataHash !== lastRoomDataHash.current) {
            console.log("Room data updated:", {
              previous: prevData ? {
                pot: prevData.pot,
                current_players: prevData.current_players,
                player_count: prevData.game_players?.length
              } : null,
              current: {
                pot: typedRoomData.pot,
                current_players: typedRoomData.current_players,
                player_count: typedRoomData.game_players?.length
              }
            });
          }
          
          return typedRoomData;
        }
        
        return {
          ...prevData,
          game_players: typedRoomData.game_players,
          pot: typedRoomData.pot,
          current_players: typedRoomData.current_players
        };
      });
      
      setPlayers(typedRoomData.game_players || []);

      const dbStatus = roomData.status as DatabaseSessionStatus;
      if (dbStatus === 'Active') setGameStatus('playing');
      else if (dbStatus === 'Finished') setGameStatus('ended');
      else setGameStatus('waiting');
      
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      }
    } catch (error: any) {
      console.error('Error in room data fetch:', error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, session?.user]);

  useEffect(() => {
    if (session?.user) {
      setCurrentUserId(session.user.id);
    } else {
      setCurrentUserId(null);
    }
  }, [session]);

  useEffect(() => {
    if (roomId && session?.user) {
      fetchRoomData();
      
      const intervalId = setInterval(fetchRoomData, 3000);
      
      return () => clearInterval(intervalId);
    }
  }, [roomId, session?.user, fetchRoomData]);

  return {
    roomData,
    isLoading,
    players,
    currentUserId,
    fetchRoomData,
    gameStatus,
    setGameStatus,
    setRoomData,
    setPlayers,
  };
}
