
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Match {
  id: number;
  name: string;
  starting_at: string;
  participants: { name: string }[];
  stage: { name: string };
  round: { name: string };
}

export function useMatches() {
  return useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-matches');
      
      if (error) throw error;
      
      return data || [];
    },
  });
}

