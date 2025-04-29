
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RoomData, DatabaseSessionStatus, GamePlayer } from "@/components/game/types";
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
        ea_id: p.ea_id
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
      
      // Fetch main game session data
      const { data: roomData, error: roomError } = await supabase
        .from('game_sessions')
        .select(`
          *,
          game_players(
            id,
            display_name,
            user_id,
            session_id,
            current_score,
            is_connected,
            is_ready,
            has_submitted_score,
            has_submitted_proof,
            created_at,
            updated_at,
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
      
      // Fetch EAFC25 specific match settings from arena_game_sessions
      let eafc25Data = null;
      if (roomData.game_type?.toLowerCase() === 'eafc25') {
        const { data: arenaData, error: arenaError } = await supabase
          .from('arena_game_sessions')
          .select('*')
          .eq('id', roomId)
          .single();
          
        if (arenaError) {
          console.error('Error fetching arena game session data:', arenaError);
        } else {
          eafc25Data = arenaData;
          console.log('Fetched EAFC25 specific data:', arenaData);
        }
      }
      
      if (isFirstLoad.current) {
        console.log("Fetched room data:", roomData);
        if (eafc25Data) {
          console.log("Fetched EAFC25 specific data:", eafc25Data);
        }
      }
      
      const { data: potData } = await supabase.rpc('calculate_prize_pool', {
        session_id: roomId
      });
      
      if (potData && isFirstLoad.current) {
        console.log(`Recalculated pot value: ${potData}`);
        roomData.pot = potData;
      }
      
      // Merge the EAFC25 specific data with the main room data
      const mergedRoomData = {
        ...roomData,
        // Add EAFC25 specific fields if available
        ...(eafc25Data && {
          platform: eafc25Data.platform,
          mode: eafc25Data.mode,
          team_type: eafc25Data.team_type,
          half_length_minutes: eafc25Data.half_length_minutes,
          legacy_defending_allowed: eafc25Data.legacy_defending_allowed,
          custom_formations_allowed: eafc25Data.custom_formations_allowed
        })
      };
      
      // Make sure game_players conforms to the expected type
      if (mergedRoomData.game_players) {
        mergedRoomData.game_players = mergedRoomData.game_players.map((player: any) => ({
          id: player.id,
          display_name: player.display_name,
          user_id: player.user_id,
          session_id: player.session_id || roomId, // Ensure session_id is present
          current_score: player.current_score,
          is_connected: player.is_connected,
          is_ready: player.is_ready,
          has_submitted_score: player.has_submitted_score || false,
          has_submitted_proof: player.has_submitted_proof || false,
          created_at: player.created_at,
          updated_at: player.updated_at,
          users: player.users,
          ea_id: player.ea_id
        }));
      }
      
      const typedRoomData = mergedRoomData as RoomData;
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
