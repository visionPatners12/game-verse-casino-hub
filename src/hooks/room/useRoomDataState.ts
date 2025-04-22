
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

  // Simple hash function to check if there are significant changes in room data
  const hashRoomData = (data: any): string => {
    if (!data) return '';
    // Create a simplified version of the data with only fields we care about for change detection
    const simplified = {
      pot: data.pot,
      current_players: data.current_players,
      status: data.status,
      players: data.game_players ? data.game_players.map((p: any) => ({
        id: p.id,
        is_ready: p.is_ready,
        is_connected: p.is_connected,
        current_score: p.current_score
      })) : []
    };
    return JSON.stringify(simplified);
  };

  const fetchRoomData = useCallback(async () => {
    if (!roomId || !session?.user) return;

    try {
      // Only show loading state on first load
      if (isFirstLoad.current) {
        setIsLoading(true);
      }
      
      // Only log on first load or every 30 seconds to reduce console spam
      const shouldLog = isFirstLoad.current || (Date.now() - lastPollTime.current > 30000);
      if (shouldLog) {
        console.log("Fetching room data for:", roomId);
        lastPollTime.current = Date.now();
      }
      
      // Fetch room data with the new prize pool calculation
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
      
      if (shouldLog) {
        console.log("Fetched room data:", roomData);
      }
      
      // Always recalculate pot using the new function with max_players
      const { data: potData } = await supabase.rpc('calculate_prize_pool', {
        session_id: roomId
      });
      
      if (potData) {
        if (shouldLog) {
          console.log(`Recalculated pot value: ${potData}`);
        }
        roomData.pot = potData;
      }
      
      const typedRoomData = roomData as unknown as RoomData;
      const newDataHash = hashRoomData(typedRoomData);
      
      // Mise à jour sans provoquer de flickering
      setRoomData(prevData => {
        // Si c'est le premier chargement ou s'il y a des changements significatifs
        if (!prevData || isFirstLoad.current || newDataHash !== lastRoomDataHash.current) {
          // Update the hash reference
          lastRoomDataHash.current = newDataHash;
          return typedRoomData;
        }
        
        // Pour les mises à jour régulières, ne mettre à jour que les joueurs
        // tout en conservant la structure générale de roomData
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

  // Update currentUserId when session changes
  useEffect(() => {
    if (session?.user) {
      setCurrentUserId(session.user.id);
    } else {
      setCurrentUserId(null);
    }
  }, [session]);

  // Fetch room data when we have both roomId and session
  useEffect(() => {
    if (roomId && session?.user) {
      fetchRoomData();
      
      // Mise en place d'un actualisation périodique des données de la partie
      const intervalId = setInterval(fetchRoomData, 5000);
      
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
