
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useFutId(userId: string) {
  const [futId, setFutId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFutId = useCallback(async () => {
    // If userId is empty string (default value), treat it as if there's no user
    if (!userId) {
      setFutId(null);
      return;
    }
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('fut_players')
      .select('fut_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (data && data.fut_id) {
      setFutId(data.fut_id);
    } else {
      setFutId(null);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    // Only fetch if we have a real userId
    if (userId) {
      fetchFutId();
    } else {
      // Reset state if userId is empty
      setFutId(null);
      setIsLoading(false);
    }
  }, [fetchFutId, userId]);

  const saveFutId = async (newFutId: string) => {
    if (!userId) return false;
    setIsLoading(true);
    // Correction : onConflict doit être la string 'user_id'
    const { error } = await supabase
      .from('fut_players')
      .upsert(
        { user_id: userId, fut_id: newFutId },
        { onConflict: 'user_id' }
      );
    setIsLoading(false);
    if (!error) {
      setFutId(newFutId);
      return true;
    }
    return false;
  };

  return { futId, isLoading, fetchFutId, saveFutId };
}
