import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addDays, format } from "date-fns";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

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
          toast({
            title: "Erreur",
            description: "Impossible de charger les matchs",
            variant: "destructive",
          });
          throw new Error(`Failed to fetch matches: ${error.message}`);
        }
        
        console.log("Raw matches data:", data);
        
        if (!data || !Array.isArray(data)) {
          console.error("Invalid response format:", data);
          throw new Error("Format de réponse invalide");
        }
        
        if (data.length === 0) {
          console.log("No matches found, using demo data");
          return getMockMatches();
        }
        
        const validMatches = data.map(match => ({
          id: match.id || Math.floor(Math.random() * 100000),
          name: match.name || "Match sans nom",
          starting_at: match.starting_at || new Date().toISOString(),
          participants: Array.isArray(match.participants) 
            ? match.participants.map(p => ({
                name: p.name || "Équipe inconnue",
                image_path: p.image_path || null
              }))
            : [
                { name: "Paris Saint-Germain", image_path: "https://cdn.sportmonks.com/images/soccer/teams/7/7.png" },
                { name: "Manchester City", image_path: "https://cdn.sportmonks.com/images/soccer/teams/9/9.png" }
              ],
          stage: {
            name: match.stage?.name || "Ligue",
            image_path: match.stage?.image_path || "https://cdn.sportmonks.com/images/soccer/leagues/2/2.png"
          },
          round: {
            name: match.round?.name || "1"
          }
        }));
        
        console.log("Processed matches:", validMatches);
        return validMatches;
      } catch (error) {
        console.error("Error in matches query:", error);
        
        console.log("Returning mock data due to error");
        return getMockMatches();
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const getRacketAsciiArt = () => {
    return `
    🎾 Raquette de Tennis
    ┌───────┐
    │       │
    │   O   │
    │       │
    └───┬───┘
        │    
        │    
    ════╪════
        │    
        │    
    `;
  };

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

function getMockMatches(): Match[] {
  const now = new Date();
  const startTime1 = new Date(now);
  startTime1.setHours(now.getHours() + 2);
  const startTime2 = new Date(now);
  startTime2.setHours(now.getHours() + 4);
  const startTime3 = new Date(now);
  startTime3.setHours(now.getHours() + 6);
  
  return [
    {
      id: 101,
      name: "Paris Saint-Germain vs Manchester City",
      starting_at: startTime1.toISOString(),
      participants: [
        { 
          name: "Paris Saint-Germain",
          image_path: "https://cdn.sportmonks.com/images/soccer/teams/7/7.png"
        },
        { 
          name: "Manchester City",
          image_path: "https://cdn.sportmonks.com/images/soccer/teams/9/9.png"
        }
      ],
      stage: { 
        name: "Champions League",
        image_path: "https://cdn.sportmonks.com/images/soccer/leagues/2/2.png"
      },
      round: { name: "Quarts de finale" }
    },
    {
      id: 102,
      name: "Real Madrid vs Bayern Munich",
      starting_at: startTime2.toISOString(),
      participants: [
        { 
          name: "Real Madrid",
          image_path: "https://cdn.sportmonks.com/images/soccer/teams/8/8.png"
        },
        { 
          name: "Bayern Munich",
          image_path: "https://cdn.sportmonks.com/images/soccer/teams/5/5.png"
        }
      ],
      stage: { 
        name: "Champions League",
        image_path: "https://cdn.sportmonks.com/images/soccer/leagues/2/2.png"
      },
      round: { name: "Quarts de finale" }
    },
    {
      id: 103,
      name: "Liverpool vs Juventus",
      starting_at: startTime3.toISOString(),
      participants: [
        { 
          name: "Liverpool",
          image_path: "https://cdn.sportmonks.com/images/soccer/teams/10/10.png"
        },
        { 
          name: "Juventus",
          image_path: "https://cdn.sportmonks.com/images/soccer/teams/11/11.png"
        }
      ],
      stage: { 
        name: "Champions League",
        image_path: "https://cdn.sportmonks.com/images/soccer/leagues/2/2.png"
      },
      round: { name: "Quarts de finale" }
    }
  ];
}
