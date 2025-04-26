
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
      const gameTypeEnum = safeGameType === "futarena" ? "FUTArena" : gameCodeToType[safeGameType];

      const insertData: any = {
        game_type: gameTypeEnum,
        room_type: 'private' as 'private' | 'public',
        room_id: Math.random().toString(36).substring(2, 8).toUpperCase(),
        max_players: values.maxPlayers || 2,
        entry_fee: values.bet,
        commission_rate: 5,
      };

      if (gameType === "futarena") {
        insertData["half_length_minutes"] = values.halfLengthMinutes || 12;
        if (values.eaId) {
          insertData["ea_id"] = values.eaId;
        }
      }

      console.log("Creating game session with data:", insertData);

      // Step 1: Create the base game session first
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

      console.log("Game session created:", data);

      // Step 2: If this is a futarena game, create the arena-specific settings
      if (gameType === "futarena") {
        const arenaInsertData = {
          id: data.id,
          platform: values.platform,
          mode: values.mode,
          team_type: values.teamType,
          legacy_defending_allowed: values.legacyDefending,
          custom_formations_allowed: values.customFormations
        };

        console.log("Creating arena game settings:", arenaInsertData);

        const { error: arenaError } = await supabase
          .from('arena_game_sessions')
          .insert(arenaInsertData);

        if (arenaError) {
          toast.error("Error creating arena settings: " + arenaError.message);
          throw arenaError;
        }

        console.log("Arena settings created successfully");
      }

      // Step 3: Add the player to the room
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

      const playerInsert: any = {
        session_id: data.id,
        display_name: userData.username,
        user_id: authData.user.id,
        is_connected: true
      };

      if (gameType === "futarena" && values.eaId) {
        playerInsert.ea_id = values.eaId;
      }

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
