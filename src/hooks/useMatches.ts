
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-matches');
      
      if (error) throw error;
      
      return data?.data || [];
    },
  });
}
