
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
      // First, get the user's current information (including display_name)
      const { data: userData } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();
      
      if (!userData) {
        throw new Error("User data not found");
      }
      
      // Prepare the update data with display_name included
      const updateData: any = { 
        user_id: user.id,
        display_name: userData.username // Adding the required display_name field
      };
      
      // Add the appropriate gamer tag based on platform
      if (platform === 'ps5') {
        updateData.psn_username = gamerTag;
      } else if (platform === 'xbox_series') {
        updateData.xbox_gamertag = gamerTag;
      } else {
        updateData.ea_id = gamerTag;
      }

      const { error } = await supabase
        .from('arena_players')
        .upsert(updateData);

      if (error) throw error;
      
      toast.success("Gamer tag sauvegardé avec succès");
      return true;
    } catch (error) {
      console.error('Error saving gamer tag:', error);
      toast.error("Erreur lors de la sauvegarde du gamer tag");
      throw error; // Rethrow to let the component handle it
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
