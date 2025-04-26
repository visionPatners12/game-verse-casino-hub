
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GameCode, isValidGameType, gameCodeToType } from "@/lib/gameTypes";
import { CreateRoomFormData } from "@/components/room/schemas/createRoomSchema";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";

export function useCreateRoom(username: string, gameType: string | undefined) {
  const navigate = useNavigate();
  const { wallet } = useWallet({ enableTransactions: false });

  const createRoom = async (values: CreateRoomFormData) => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        toast.error("You must be logged in to create a room");
        return;
      }

      if (!isValidGameType(gameType)) {
        toast.error("Invalid game type");
        return;
      }

      const safeGameType = gameType as GameCode;
      const gameTypeEnum = gameCodeToType[safeGameType];

      const insertData = {
        game_type: gameTypeEnum,
        room_type: 'private',
        room_id: Math.random().toString(36).substring(2, 8).toUpperCase(),
        max_players: 2,
        entry_fee: values.bet,
        commission_rate: 5,
      };

      console.log("Creating room with data:", insertData);

      const { data, error } = await supabase
        .from('game_sessions')
        .insert(insertData)
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

      console.log("Room created:", data);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        toast.error("Error joining room: " + userError.message);
        throw userError;
      }

      if (!userData || !userData.username) {
        toast.error("Username not found. Please set up your profile first.");
        return;
      }

      const playerInsert = {
        session_id: data.id,
        display_name: userData.username,
        user_id: authData.user.id,
        is_connected: true
      };

      console.log("Adding player to room:", playerInsert);

      const { error: playerError } = await supabase
        .from('game_players')
        .insert(playerInsert);

      if (playerError) {
        toast.error("Error joining room: " + playerError.message);
        throw playerError;
      }

      toast.success("Room created successfully!");
      navigate(`/games/${gameType}/room/${data.id}`);
    } catch (error: any) {
      console.error('Error creating room:', error);
      toast.error(error.message || "Unexpected error.");
    }
  };

  return { createRoom };
}
