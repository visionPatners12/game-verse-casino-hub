
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GamePlatform } from "@/types/futarena";
import { toast } from "sonner";

export const useGamerTagCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const { user } = useAuth();

  const checkRequiredGamerTag = async (platform: GamePlatform) => {
    if (!user) return false;

    setIsChecking(true);
    try {
      const { data: arenaPlayer } = await supabase
        .from('arena_players')
        .select('psn_username, xbox_gamertag, ea_id')
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
    if (!user) return false;

    try {
      const updateData = platform === 'ps5' 
        ? { psn_username: gamerTag }
        : platform === 'xbox_series'
        ? { xbox_gamertag: gamerTag }
        : { ea_id: gamerTag };

      const { error } = await supabase
        .from('arena_players')
        .upsert({
          user_id: user.id,
          ...updateData
        });

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error saving gamer tag:', error);
      toast.error("Erreur lors de la sauvegarde du gamer tag");
      return false;
    }
  };

  return {
    isChecking,
    checkRequiredGamerTag,
    saveGamerTag
  };
};
