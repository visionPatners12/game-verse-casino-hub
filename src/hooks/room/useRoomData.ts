import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RoomData, GamePlayer } from "@/components/game/types";

export const useRoomData = (roomId: string | undefined) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
        
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to join a game room.",
            variant: "destructive"
          });
          navigate("/");
          return;
        }
        
        const { data, error } = await supabase
          .from('game_sessions')
          .select(`
            *,
            game_players (
              id,
              display_name,
              user_id,
              session_id,
              current_score,
              is_connected,
              is_ready,
              created_at,
              updated_at,
              ea_id,
              users:user_id(username, avatar_url)
            )
          `)
          .eq('id', roomId)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          toast({
            title: "Room Not Found",
            description: "The requested game room does not exist.",
            variant: "destructive"
          });
          navigate("/games");
          return;
        }
        
        console.log("Room data:", data);
        
        // Format data to match RoomData type
        const formattedData: RoomData = {
          id: data.id,
          game_type: data.game_type,
          room_id: data.room_id || '',
          max_players: data.max_players,
          current_players: data.current_players,
          entry_fee: data.entry_fee,
          pot: data.pot,
          commission_rate: data.commission_rate,
          status: data.status,
          start_time: data.start_time,
          end_time: data.end_time,
          connected_players: data.connected_players,
          room_type: data.room_type,
          created_at: data.created_at,
          updated_at: data.updated_at,
          ea_id: data.ea_id,
          // Ensure game_players has all the required fields
          game_players: (data.game_players || []).map((player: any) => {
            const gamePlayer: GamePlayer = {
              id: player.id,
              display_name: player.display_name,
              user_id: player.user_id,
              session_id: player.session_id || roomId,
              current_score: player.current_score,
              is_connected: player.is_connected || false,
              is_ready: player.is_ready || false,
              has_submitted_score: false,
              has_submitted_proof: false,
              created_at: player.created_at,
              updated_at: player.updated_at,
              users: player.users,
              ea_id: player.ea_id || null // Ensure ea_id is always set, even if null
            };
            return gamePlayer;
          })
        };
        
        setRoomData(formattedData);
      } catch (error) {
        console.error("Error fetching room data:", error);
        toast({
          title: "Error Loading Room",
          description: "Could not load game room data. Please try again.",
          variant: "destructive"
        });
        navigate("/games");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomData();
  }, [roomId, navigate, toast]);

  return { loading, roomData, currentUserId };
};
