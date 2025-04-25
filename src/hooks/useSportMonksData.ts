
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

interface Score {
  goals: number;
  participant: 'home' | 'away';
}

interface Participant {
  id: number;
  name: string;
  image_path: string;
  short_code: string;
  meta: {
    location: 'home' | 'away';
    winner: boolean;
    position: number;
  };
}

interface Stage {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
}

interface Round {
  id: number;
  name: string;
}

interface Match {
  id: number;
  name: string;
  starting_at: string;
  result_info: string;
  participants: Participant[];
  scores: Array<{
    score: Score;
    description: string;
  }>;
  stage?: Stage;
  group?: Group;
  round?: Round;
}

interface LeagueResponse {
  id: number;
  name: string;
  image_path: string;
  today: Match[];
}

export function useSportMonksData() {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  return useQuery({
    queryKey: ['sportmonks-matches', today],
    queryFn: async () => {
      try {
        console.log("Fetching SportMonks data for date:", today);
        
        const { data, error } = await supabase.functions.invoke('get-sportmonks-matches', {
          body: { date: today }
        });

        if (error) {
          console.error("Error fetching SportMonks data:", error);
          toast.error("Erreur lors du chargement des matchs");
          throw error;
        }
        
        console.log("SportMonks data received:", data);
        return data as LeagueResponse[];
      } catch (err) {
        console.error("Exception in useSportMonksData:", err);
        toast.error("Impossible de charger les matchs du jour");
        throw err;
      }
    },
    retry: 2,
    refetchOnWindowFocus: false
  });
}
