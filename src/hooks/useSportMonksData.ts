
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

// Define types for match participants
interface MatchParticipant {
  id: number;
  name: string;
  image_path: string;
  meta: {
    location: string;
  };
}

// Define types for odds data
interface OddsData {
  value: string;
  probability?: string | null;
  updated_at?: string;
}

// Define matches structure
interface SportMonksMatch {
  id: number;
  starting_at: string;
  participants?: MatchParticipant[];
  scores?: any[];
  result_info?: string;
  odds?: {
    teama?: OddsData;
    teamb?: OddsData;
    draw?: OddsData;
    [key: string]: OddsData | undefined;
  };
}

// Define league structure
interface SportMonksLeague {
  id: number;
  name: string;
  image_path: string;
  today: SportMonksMatch[];
}

export function useSportMonksData(selectedDate: Date = new Date()) {
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  return useQuery({
    queryKey: ['sportmonks-matches', formattedDate],
    queryFn: async () => {
      try {
        console.log("Fetching matches for date:", formattedDate);
        
        // Call the Edge Function directly instead of the RPC
        const { data, error } = await supabase.functions.invoke('get-sportmonks-matches', {
          body: { date: formattedDate, singleDay: true }
        });

        if (error) {
          console.error("Error fetching matches from Edge Function:", error);
          toast.error("Erreur lors du chargement des matchs");
          throw error;
        }

        // Log the response to check if odds data is included
        console.log("Edge function returned data:", data);
        
        if (!data || !Array.isArray(data)) {
          console.error("Invalid data format returned from Edge Function");
          throw new Error("Invalid data format");
        }
        
        return data as SportMonksLeague[];
      } catch (err) {
        console.error("Error in useSportMonksData:", err);
        toast.error("Impossible de charger les matchs du jour");
        throw err;
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds for live updates
    retry: 2
  });
}
