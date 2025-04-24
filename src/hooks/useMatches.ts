
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addDays, format } from "date-fns";
import { useState } from "react";

export interface MatchParticipant {
  name: string;
  image_path: string | null;
}

export interface Match {
  id: number;
  name: string;
  starting_at: string;
  participants: MatchParticipant[];
  stage: {
    name: string;
    image_path: string | null;
  };
  round: {
    name: string;
  };
}

export function useMatches() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextFiveDays = Array.from({ length: 5 }, (_, i) => 
    addDays(new Date(), i)
  );

  const { data: matches, isLoading, error, refetch } = useQuery<Match[], Error>({
    queryKey: ['matches', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log(`Fetching matches for date: ${formattedDate}`);
      
      try {
        const { data, error } = await supabase.functions.invoke('get-matches', {
          body: { date: formattedDate }
        });
        
        if (error) {
          console.error("Error fetching matches:", error);
          throw new Error(`Failed to fetch matches: ${error.message}`);
        }
        
        if (!data || !Array.isArray(data)) {
          console.error("Invalid response format:", data);
          throw new Error("Invalid response format from API");
        }
        
        console.log(`Received ${data.length} matches`);
        if (data.length > 0) {
          console.log("Sample match data:", data[0]);
        }
        
        // Normalize data to ensure all required fields exist
        const normalizedData = data.map(match => ({
          id: match.id,
          name: match.name || "Match sans nom",
          starting_at: match.starting_at,
          participants: Array.isArray(match.participants) 
            ? match.participants.map(p => ({
                name: p.name || "Équipe inconnue",
                image_path: p.image_path || null
              }))
            : [
                { name: "Équipe A", image_path: null },
                { name: "Équipe B", image_path: null }
              ],
          stage: {
            name: match.stage?.name || "Ligue",
            image_path: match.stage?.image_path || null
          },
          round: {
            name: match.round?.name || "1"
          }
        }));
        
        return normalizedData;
      } catch (error) {
        console.error("Error in matches query:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    matches,
    isLoading,
    error,
    refetch,
    selectedDate,
    setSelectedDate,
    nextFiveDays
  };
}
