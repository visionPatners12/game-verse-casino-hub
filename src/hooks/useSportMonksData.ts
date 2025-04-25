
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

// Define types for our data structure to help TypeScript
interface MatchParticipant {
  id: number;
  name: string;
  image_path: string;
  meta: {
    location: string;
  };
}

interface MatchData {
  id: number;
  starting_at: string;
  participants?: MatchParticipant[];
  scores?: any[];
  result_info?: string;
}

interface SportMonksMatch {
  id: number;
  league_id: number;
  league_name: string;
  league_image: string;
  starting_at: string;
  team_a: string;
  team_b: string;
  team_a_image: string;
  team_b_image: string;
  status: string;
  scores: any[];
  match_data: any;
}

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
        
        matches?.forEach((match: SportMonksMatch) => {
          if (!leaguesMap.has(match.league_id)) {
            leaguesMap.set(match.league_id, {
              id: match.league_id,
              name: match.league_name,
              image_path: match.league_image,
              today: []
            });
          }
          
          const league = leaguesMap.get(match.league_id);
          
          // Fix: Create a properly typed match object
          const matchData = typeof match.match_data === 'string' 
            ? JSON.parse(match.match_data) 
            : match.match_data;
            
          league.today.push({
            id: match.id,
            starting_at: match.starting_at,
            participants: Array.isArray(matchData?.participants) ? matchData.participants : [],
            scores: match.scores || [],
            result_info: match.status || 'Scheduled'
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
