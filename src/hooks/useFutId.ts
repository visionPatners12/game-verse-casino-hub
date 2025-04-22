
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useFutId(userId: string | null | undefined) {
  const [futId, setFutId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFutId = useCallback(async () => {
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
    fetchFutId();
  }, [fetchFutId]);

  const saveFutId = async (futId: string) => {
    if (!userId) return false;
    setIsLoading(true);
    // Upsert the FUT id (insert if not exists, update if exists)
    const { error } = await supabase
      .from('fut_players')
      .upsert({ user_id: userId, fut_id: futId }, { onConflict: ['user_id'] });
    setIsLoading(false);
    if (!error) {
      setFutId(futId);
      return true;
    }
    return false;
  };

  return { futId, isLoading, fetchFutId, saveFutId };
}
