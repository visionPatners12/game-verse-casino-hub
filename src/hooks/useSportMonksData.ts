
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

export function useSportMonksData(selectedDate: Date = new Date()) {
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  return useQuery({
    queryKey: ['sportmonks-matches', formattedDate],
    queryFn: async () => {
      try {
        console.log("Fetching matches for date:", formattedDate);
        
        const { data: matches, error } = await supabase
          .rpc('get_matches_by_date', { target_date: formattedDate });

        if (error) {
          console.error("Error fetching matches:", error);
          toast.error("Erreur lors du chargement des matchs");
          throw error;
        }

        // Transformer les données dans le même format que l'API SportMonks
        const leaguesMap = new Map();
        
        matches?.forEach((match) => {
          if (!leaguesMap.has(match.league_id)) {
            leaguesMap.set(match.league_id, {
              id: match.league_id,
              name: match.league_name,
              image_path: match.league_image,
              today: []
            });
          }
          
          const league = leaguesMap.get(match.league_id);
          league.today.push({
            ...match.match_data,
            scores: match.scores,
            result_info: match.status
          });
        });
        
        return Array.from(leaguesMap.values());
      } catch (err) {
        console.error("Error in useSportMonksData:", err);
        toast.error("Impossible de charger les matchs du jour");
        throw err;
      }
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes pour les mises à jour en direct
    retry: 2
  });
}
