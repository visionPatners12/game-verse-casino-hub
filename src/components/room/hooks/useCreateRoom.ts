
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GameCode, isValidGameType, gameCodeToType, GameVariant } from "@/lib/gameTypes";
import { CreateRoomFormData } from "../schemas/createRoomSchema";
import { toast } from "sonner";

export function useCreateRoom(username: string, gameType: string | undefined) {
  const navigate = useNavigate();

  const createRoom = async (values: CreateRoomFormData) => {
    try {
      // First, check if user is authenticated
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
      const gameTypeEnum: GameVariant = gameCodeToType[safeGameType];

      const insertData: any = {
        game_type: gameTypeEnum,
        room_type: 'private',
        room_id: Math.random().toString(36).substring(2, 8).toUpperCase(),
        max_players: values.maxPlayers,
        entry_fee: values.bet,
        commission_rate: 5,
      };

      // Ajout des champs spécifiques pour ArenaPlay Football
      if (gameType === "futarena") {
        insertData["match_duration"] = values.matchDuration || 12;
        insertData["ea_id"] = values.eaId;
      }

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

      // Get the username from the users table to ensure it's not null
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

      // Ajout du joueur à la room avec son EA-ID pour FUT Arena
      const playerInsert: any = {
        session_id: data.id,
        display_name: userData.username,
        user_id: authData.user.id
      };

      if (gameType === "futarena" && values.eaId) {
        playerInsert.ea_id = values.eaId;
      }

      const { error: playerError } = await supabase
        .from('game_players')
        .insert(playerInsert);

      if (playerError) {
        toast.error("Error joining room: " + playerError.message);
        throw playerError;
      }

      toast.success("Room created successfully!");
      navigate(`/games/${gameType}/room/${data.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return { createRoom };
}
