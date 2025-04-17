
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GameCode, isValidGameType, gameCodeToType, GameVariant } from "@/lib/gameTypes";
import { CreateRoomFormData } from "../schemas/createRoomSchema";
import { toast } from "sonner";

export function useCreateRoom(username: string, gameType: string | undefined) {
  const navigate = useNavigate();

  const createRoom = async (values: CreateRoomFormData) => {
    try {
      if (!isValidGameType(gameType)) {
        toast.error("Invalid game type");
        return;
      }
      
      const safeGameType = gameType as GameCode;
      const gameTypeEnum: GameVariant = gameCodeToType[safeGameType];
      
      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          game_type: gameTypeEnum,
          room_type: 'private',
          room_id: Math.random().toString(36).substring(2, 8).toUpperCase(),
          max_players: values.maxPlayers,
          entry_fee: values.bet,
          commission_rate: 5,
        })
        .select()
        .single();

      if (error) {
        toast.error("Error creating room: " + error.message);
        throw error;
      }

      if (!data || !data.id) {
        toast.error("Failed to create room");
        return;
      }

      const { error: playerError } = await supabase
        .from('game_players')
        .insert({
          session_id: data.id,
          display_name: username,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (playerError) {
        toast.error("Error joining room: " + playerError.message);
        throw playerError;
      }
      
      toast.success("Room created successfully!");

      // Navigate to the game room with the generated room ID
      navigate(`/games/${gameType}/room/${data.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return { createRoom };
}
