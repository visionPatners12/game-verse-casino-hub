import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GamePlatform } from "@/types/futarena";
import { toast } from "sonner";

export const useGamerTagCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const checkRequiredGamerTag = async (platform: GamePlatform) => {
    if (!user) return false;

    setIsChecking(true);
    try {
      const { data: arenaPlayer } = await supabase
        .from('arena_players')
        .select('psn_username, xbox_gamertag, ea_id, display_name')
        .eq('user_id', user.id)
        .single();

      if (!arenaPlayer) return false;

      switch (platform) {
        case 'ps5':
          return !!arenaPlayer.psn_username;
        case 'xbox_series':
          return !!arenaPlayer.xbox_gamertag;
        case 'cross_play':
          return !!arenaPlayer.ea_id;
        default:
          return true;
      }
    } catch (error) {
      console.error('Error checking gamer tag:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const saveGamerTag = async (platform: GamePlatform, gamerTag: string) => {
    if (!user) throw new Error("No authenticated user");
    
    setIsSaving(true);
    try {
      // Update the user's profile first
      const userUpdateData: any = {};
      if (platform === 'ps5') {
        userUpdateData.psn_username = gamerTag;
      } else if (platform === 'xbox_series') {
        userUpdateData.xbox_gamertag = gamerTag;
      } else {
        userUpdateData.ea_id = gamerTag;
      }

      // Update user profile
      const { error: userError } = await supabase
        .from('users')
        .update(userUpdateData)
        .eq('id', user.id);

      if (userError) throw userError;

      // Get user's current information
      const { data: userData } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();
      
      if (!userData) {
        throw new Error("User data not found");
      }

      // Check if arena player exists
      const { data: existingPlayer } = await supabase
        .from('arena_players')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      // Prepare arena player data
      const playerData: any = {
        display_name: userData.username,
        user_id: user.id,
        ...userUpdateData
      };

      // Update or create arena player
      const { error: playerError } = await supabase
        .from('arena_players')
        .upsert(playerData, { onConflict: 'user_id' });

      if (playerError) throw playerError;
      
      toast.success("Gamer tag sauvegardé avec succès");
      return true;
    } catch (error) {
      console.error('Error saving gamer tag:', error);
      toast.error("Erreur lors de la sauvegarde du gamer tag");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isChecking,
    isSaving,
    checkRequiredGamerTag,
    saveGamerTag
  };
};
