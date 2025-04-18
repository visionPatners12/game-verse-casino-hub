
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { isValidGameType } from "@/lib/gameTypes";
import { RoomData } from "@/components/game/types";

export const useGameRoom = () => {
  const { gameType, roomId } = useParams<{ gameType: string; roomId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (gameType && !isValidGameType(gameType)) {
      console.error("Invalid game type detected:", gameType);
      toast({
        title: "Invalid Game Type",
        description: "The requested game does not exist.",
        variant: "destructive"
      });
      navigate("/games");
      return;
    }
  }, [gameType, navigate, toast]);

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
              current_score
            )
          `)
          .eq('id', roomId)
          .single();
        
        if (error) {
          throw error;
        }
        
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

  useEffect(() => {
    if (!roomId) return;
    
    const roomChannel = supabase
      .channel('room-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          console.log('Room updated:', payload);
          if (payload.new) {
            setRoomData(prev => ({
              ...prev,
              ...payload.new
            } as RoomData));
          }
        }
      )
      .subscribe();
    
    const playersChannel = supabase
      .channel('players-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
          filter: `session_id=eq.${roomId}`
        },
        (payload) => {
          console.log('Players updated:', payload);
          fetchUpdatedPlayers();
        }
      )
      .subscribe();
    
    const fetchUpdatedPlayers = async () => {
      const { data, error } = await supabase
        .from('game_players')
        .select('*')
        .eq('session_id', roomId);
      
      if (!error && data) {
        setRoomData(prev => prev ? {
          ...prev,
          game_players: data,
          current_players: data.length
        } as RoomData : null);
      }
    };
    
    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [roomId]);

  return {
    loading,
    roomData,
    currentUserId,
    gameType
  };
};
