
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GamePlatform } from "@/types/futarena";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useGamerTagCheck() {
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const checkRequiredGamerTag = async (platform: GamePlatform): Promise<boolean> => {
    if (!user) return false;
    
    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          psn_username, 
          xbox_gamertag, 
          ea_id
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Check if the user has the required gamer tag for the specified platform
      if (platform === 'ps5' && !data.psn_username) {
        return false;
      } else if (platform === 'xbox_series' && !data.xbox_gamertag) {
        return false;
      } else if (platform === 'cross_play' && !data.ea_id) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error checking gamer tag:", error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const saveGamerTag = async (platform: GamePlatform, gamerTag: string): Promise<boolean> => {
    if (!user || !gamerTag) return false;
    
    setIsSaving(true);
    try {
      const updateData = platform === 'ps5' 
        ? { psn_username: gamerTag }
        : platform === 'xbox_series'
        ? { xbox_gamertag: gamerTag }
        : { ea_id: gamerTag };

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success("Gamer tag saved successfully!");
      return true;
    } catch (error) {
      console.error("Error saving gamer tag:", error);
      toast.error("Failed to save gamer tag");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { 
    checkRequiredGamerTag, 
    saveGamerTag, 
    isChecking, 
    isSaving 
  };
}
