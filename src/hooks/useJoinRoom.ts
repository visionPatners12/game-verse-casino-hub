
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GameCode, isValidGameType } from "@/lib/gameTypes";

export const useJoinRoom = (roomCode: string, onSuccess: () => void) => {
  const [currentPlayers, setCurrentPlayers] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: room, isLoading } = useQuery({
    queryKey: ['game-session', roomCode],
    queryFn: async () => {
      if (roomCode.length !== 6) return null;
      
      const { data, error } = await supabase
        .from('game_sessions')
        .select(`
          *,
          game_players:game_players(
            id,
            display_name,
            user_id,
            current_score,
            is_connected,
            users:user_id(username, avatar_url)
          )
        `)
        .eq('room_id', roomCode)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            variant: "destructive",
            title: "Room not found",
            description: "Please check the room code and try again."
          });
        }
        throw error;
      }
      
      // Log the user data to ensure it's being properly fetched
      console.log("Room data with user details:", data);
      return data;
    },
    enabled: roomCode.length === 6,
    retry: false
  });

  const handleJoin = async () => {
    if (!room) return;
    
    if (room.current_players >= room.max_players) {
      toast({
        variant: "destructive",
        title: "Room is full",
        description: "Please try another room."
      });
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to join a game room."
        });
        return;
      }
      
      // Update user connection status
      await supabase
        .from('users')
        .update({ is_connected: true })
        .eq('id', user.id);
      
      const { data: userData } = await supabase
        .from('users')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (!userData?.username) {
        toast({
          variant: "destructive",
          title: "Profile incomplete",
          description: "Please set up your username in your profile."
        });
        return;
      }

      // Check if player already exists in this room
      const { data: existingPlayer, error: checkError } = await supabase
        .from('game_players')
        .select('id, is_connected')
        .eq('session_id', room.id)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingPlayer) {
        // Player exists, just update connection status if needed
        if (!existingPlayer.is_connected) {
          await supabase
            .from('game_players')
            .update({ is_connected: true })
            .eq('id', existingPlayer.id);
        }
        console.log("User already in room, navigating...");
      } else {
        // Player doesn't exist, insert new record
        const { error: joinError } = await supabase
          .from('game_players')
          .insert({
            session_id: room.id,
            display_name: userData.username,
            user_id: user.id,
            is_connected: true
          });
          
        if (joinError) {
          console.error("Error joining room:", joinError);
          throw joinError;
        }
      }
      
      const gameType = typeof room.game_type === 'string' 
        ? room.game_type.toLowerCase()
        : String(room.game_type).toLowerCase();
      
      if (!isValidGameType(gameType)) {
        console.error("Invalid game type:", gameType, "Room data:", room);
        toast({
          variant: "destructive",
          title: "Invalid game type",
          description: "This game type is not supported."
        });
        return;
      }
      
      navigate(`/games/${gameType}/room/${room.id}`);
      onSuccess();
    } catch (error) {
      console.error("Join error:", error);
      toast({
        variant: "destructive",
        title: "Failed to join room",
        description: "Please try again later."
      });
    }
  };

  return {
    room,
    isLoading,
    currentPlayers,
    setCurrentPlayers,
    handleJoin
  };
};
