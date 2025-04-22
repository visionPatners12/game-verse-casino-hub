
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isValidGameType, gameCodeToType } from "@/lib/gameTypes";
import { useWalletBalanceCheck } from "@/hooks/room/useWalletBalanceCheck";

export function useJoinRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAndDeductBalance } = useWalletBalanceCheck();

  const joinRoom = async (roomCode: string) => {
    if (roomCode.length !== 6) {
      toast.error("Invalid room code. Please enter a 6-character code.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to join a room");
        navigate("/auth");
        return;
      }
      
      // Find the room first to check entry fee
      const { data: room, error: roomError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('room_id', roomCode)
        .maybeSingle();
        
      if (roomError && roomError.code !== 'PGRST116') {
        throw roomError;
      }
      
      if (!room) {
        toast.error("Room not found. Please check the code and try again.");
        return;
      }

      // Check wallet balance and try to deduct in the DB before proceeding
      const canProceed = await checkAndDeductBalance(room.entry_fee);
      if (!canProceed) {
        return;
      }
      
      // Check if room is full
      if (room.current_players >= room.max_players) {
        toast.error("This room is full. Please try another room.");
        return;
      }

      // Check if user profile is complete
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();
        
      if (userError) {
        console.error("Error fetching user data:", userError);
        throw userError;
      }
      
      if (!userData || !userData.username) {
        toast.error("Please set up your username in your profile.");
        navigate("/profile");
        return;
      }
      
      // Check if player is already in the room
      const { data: existingPlayer, error: playerCheckError } = await supabase
        .from('game_players')
        .select('id, is_connected')
        .eq('session_id', room.id)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (playerCheckError && playerCheckError.code !== 'PGRST116') {
        throw playerCheckError;
      }
      
      if (existingPlayer) {
        // Player already exists, just update connection status
        await supabase
          .from('game_players')
          .update({ is_connected: true })
          .eq('id', existingPlayer.id);
      } else {
        // Add player to the room
        const { error: joinError } = await supabase
          .from('game_players')
          .insert({
            session_id: room.id,
            display_name: userData.username, // Explicitly set display_name to username
            user_id: user.id,
            is_connected: true,
            is_ready: false
          });
          
        if (joinError) {
          console.error("Error joining room:", joinError);
          toast.error("Error joining room: " + joinError.message);
          throw joinError;
        }
      }
      
      // Find game type for navigation
      const gameType = typeof room.game_type === 'string' 
        ? room.game_type.toLowerCase() 
        : String(room.game_type).toLowerCase();
        
      if (!isValidGameType(gameType)) {
        toast.error("Invalid game type. Please contact support.");
        return;
      }
      
      // Navigate to game room
      navigate(`/games/${gameType}/room/${room.id}`);
      toast.success("Joined room successfully!");
      
    } catch (error: any) {
      console.error("Error joining room:", error);
      toast.error(error.message || "Failed to join room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    joinRoom,
    isLoading
  };
}
