
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
  return useQuery<Match[], Error>({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-matches');
      
      if (error) {
        console.error("Error fetching matches:", error);
        throw error;
      }
      
      if (!data || !Array.isArray(data)) {
        console.error("Invalid response format:", data);
        throw new Error("Format de réponse invalide");
      }
      
      // Ajouter des logs pour diagnostiquer
      console.log(`Received ${data.length} matches from API`);
      if (data.length > 0) {
        console.log("First match example:", JSON.stringify(data[0]));
      }
      
      return data;
    },
    retry: 1,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
