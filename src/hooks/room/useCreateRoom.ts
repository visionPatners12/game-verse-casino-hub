
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GameCode, isValidGameType, gameCodeToType } from "@/lib/gameTypes";
import { CreateClassicRoomFormData } from "@/components/room/schemas/createClassicRoomSchema";
import { CreateArenaRoomFormData } from "@/components/room/schemas/createArenaRoomSchema";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";

type RoomFormData = CreateClassicRoomFormData | CreateArenaRoomFormData;

export function useCreateRoom(username: string, gameType: string | undefined) {
  const navigate = useNavigate();
  const { wallet } = useWallet({ enableTransactions: false });

  const createRoom = async (values: RoomFormData) => {
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

      // First create the base game session
      const baseInsertData = {
        game_type: gameTypeEnum as unknown as string, // Cast to string to avoid type error
        room_type: 'private' as 'private' | 'public',
        room_id: Math.random().toString(36).substring(2, 8).toUpperCase(),
        max_players: values.maxPlayers || 2,
        entry_fee: values.bet,
        commission_rate: 5,
      };

      console.log("Creating room with data:", baseInsertData);

      const { data, error } = await supabase
        .from('game_sessions')
        .insert(baseInsertData)
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

      // If it's an arena game, insert the specific settings into arena_game_sessions table
      const isArenaGame = ["eafc25", "madden24", "nba2k24", "nhl24"].includes(safeGameType);
      if (isArenaGame && 'platform' in values) {
        const arenaValues = values as CreateArenaRoomFormData;
        const arenaInsertData = {
          id: data.id, // Use the same ID as the main game session
          platform: arenaValues.platform,
          mode: arenaValues.mode,
          team_type: arenaValues.teamType,
          legacy_defending_allowed: arenaValues.legacyDefending,
          custom_formations_allowed: arenaValues.customFormations,
          half_length_minutes: arenaValues.halfLengthMinutes || 12,
        };

        console.log("Adding arena specific settings:", arenaInsertData);
        
        const { error: arenaError } = await supabase
          .from('arena_game_sessions')
          .insert(arenaInsertData);

        if (arenaError) {
          toast.error("Error creating arena settings: " + arenaError.message);
          throw arenaError;
        }
      }

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
