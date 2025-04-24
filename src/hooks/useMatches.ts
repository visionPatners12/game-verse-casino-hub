
import { useState } from "react";
import { addDays, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { SportMonksLeague, SportMonksMatch } from "@/types/sportmonks";
import { supabase } from "@/integrations/supabase/client";

const fetchMatches = async (date: string): Promise<SportMonksMatch[]> => {
  console.log("Fetching matches for date:", date);
  
  try {
    const { data, error } = await supabase.functions.invoke('sportmonks', {
      body: { date }
    });

    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(`Erreur fonction: ${error.message}`);
    }

    if (!data || !data.data) {
      console.error("Invalid data format returned:", data);
      throw new Error("Format de données invalide");
    }

    console.log("Raw API response:", data);
    
    // Flatten all matches from all leagues
    return data.data.reduce((acc: SportMonksMatch[], league: SportMonksLeague) => {
      if (!league.today) {
        console.log("League without matches:", league.name || league.id);
        return acc;
      }
      console.log(`League ${league.name}: ${league.today.length} matches`);
      return [...acc, ...league.today];
    }, []);
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};

export function useMatches() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextFiveDays = Array.from({ length: 5 }, (_, i) => 
    addDays(new Date(), i)
  );

  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  
  const { data: matches, isLoading, error, refetch } = useQuery({
    queryKey: ["matches", formattedDate],
    queryFn: () => fetchMatches(formattedDate),
    retry: 2,
    retryDelay: 1000,
  });

  return {
    matches: matches || [],
    isLoading,
    error,
    selectedDate,
    setSelectedDate,
    nextFiveDays,
    refetch
  };
}
