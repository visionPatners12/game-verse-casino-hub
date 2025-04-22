
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RoomData, DatabaseSessionStatus } from "@/components/game/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function useRoomDataState(roomId: string | undefined) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Initialize as false
  const [players, setPlayers] = useState<any[]>([]);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'starting' | 'playing' | 'ended'>('waiting');
  const { toast } = useToast();
  const { session } = useAuth();

  const fetchRoomData = useCallback(async () => {
    if (!roomId || !session?.user) return;

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

      if (roomError) {
        console.error('Error fetching room data:', roomError);
        return;
      }
      
      const typedRoomData = roomData as unknown as RoomData;
      setRoomData(typedRoomData);
      setPlayers(typedRoomData.game_players || []);

      const dbStatus = roomData.status as DatabaseSessionStatus;
      if (dbStatus === 'Active') setGameStatus('playing');
      else if (dbStatus === 'Finished') setGameStatus('ended');
      else setGameStatus('waiting');
      
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
