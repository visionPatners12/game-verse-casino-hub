
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RoomData } from "@/components/game/types";

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
              current_score,
              is_connected,
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
        setRoomData(data as RoomData);
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
