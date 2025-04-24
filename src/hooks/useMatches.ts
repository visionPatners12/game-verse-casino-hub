
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addDays, format } from "date-fns";
import { useState } from "react";

interface Match {
  id: number;
  name: string;
  starting_at: string;
  participants: { name: string; image_path?: string }[];
  stage: { name: string; image_path?: string };
  round: { name: string };
  image?: string;
}

export function useMatches() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextFiveDays = Array.from({ length: 5 }, (_, i) => 
    addDays(new Date(), i)
  );

  const { data: matches, isLoading, error } = useQuery<Match[], Error>({
    queryKey: ['matches', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log(`Fetching matches for date: ${formattedDate}`);
      
      const { data, error } = await supabase.functions.invoke('get-matches', {
        body: { date: formattedDate }
      });
      
      if (error) {
        console.error("Error fetching matches:", error);
        throw error;
      }
      
      if (!data || !Array.isArray(data)) {
        console.error("Invalid response format:", data);
        throw new Error("Format de réponse invalide");
      }
      
      console.log(`Received ${data.length} matches from API`);
      if (data.length > 0) {
        console.log("First match example:", JSON.stringify(data[0]));
      }
      
      return data;
    },
    retry: 1,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000,
  });

  return {
    matches,
    isLoading,
    error,
    selectedDate,
    setSelectedDate,
    nextFiveDays
  };
}
