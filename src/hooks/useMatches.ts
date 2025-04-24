
import { useState } from "react";
import { addDays, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { SportMonksLeague, SportMonksMatch } from "@/types/sportmonks";

const API_KEY = '9KY9DAbhU8qKaduaf27WBsCRdhRyQ4CWicx5G0V7fMQPj3Ii4YfIBspFdwMy';

const fetchMatches = async (date: string): Promise<SportMonksMatch[]> => {
  try {
    const response = await fetch(`https://api.sportmonks.com/v3/football/leagues/date/${date}?include=today.scores;today.participants;today.stage;today.group;today.round`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Flatten all matches from all leagues
    return data.data.reduce((acc: SportMonksMatch[], league: SportMonksLeague) => {
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

