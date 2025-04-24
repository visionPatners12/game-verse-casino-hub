
import { useState } from "react";
import { addDays, format } from "date-fns";

export interface Score {
  id: number;
  fixture_id: number;
  type_id: number;
  participant_id: number;
  score: {
    goals: number;
    participant: "home" | "away";
  };
  description: string;
}

export interface MatchParticipant {
  id: number;
  name: string;
  image_path: string;
  meta: {
    location: "home" | "away";
    winner: boolean;
    position: number;
  };
}

export interface Match {
  id: number;
  name: string;
  starting_at: string;
  participants: MatchParticipant[];
  scores: Score[];
  stage: {
    name: string;
    image_path?: string | null;
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

  // Exemple de données avec la nouvelle structure
  const staticMatches: Match[] = [
    {
      id: 19135621,
      name: "Leganés vs Girona",
      starting_at: "2025-04-24 17:00:00",
      participants: [
        {
          id: 844,
          name: "Leganés",
          image_path: "https://cdn.sportmonks.com/images/soccer/teams/12/844.png",
          meta: {
            location: "home",
            winner: false,
            position: 19
          }
        },
        {
          id: 231,
          name: "Girona",
          image_path: "https://cdn.sportmonks.com/images/soccer/teams/7/231.png",
          meta: {
            location: "away",
            winner: false,
            position: 17
          }
        }
      ],
      scores: [
        {
          id: 16298337,
          fixture_id: 19135621,
          type_id: 1525,
          participant_id: 844,
          score: {
            goals: 1,
            participant: "home"
          },
          description: "CURRENT"
        },
        {
          id: 16298336,
          fixture_id: 19135621,
          type_id: 1525,
          participant_id: 231,
          score: {
            goals: 1,
            participant: "away"
          },
          description: "CURRENT"
        }
      ],
      stage: {
        name: "La Liga",
        image_path: "https://cdn.sportmonks.com/images/soccer/leagues/20/564.png"
      },
      round: {
        name: "Journée 33"
      }
    }
  ];

  const refetch = () => {
    console.log("Mock refetch called");
    return Promise.resolve();
  };

  return {
    matches: staticMatches,
    isLoading: false,
    error: null,
    selectedDate,
    setSelectedDate,
    nextFiveDays,
    refetch
  };
}
