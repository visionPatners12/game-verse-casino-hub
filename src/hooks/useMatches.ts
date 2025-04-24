
import { useState } from "react";
import { addDays, format } from "date-fns";

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

  // Exemple de données statiques
  const staticMatches: Match[] = [
    {
      id: 1,
      name: "PSG vs Marseille",
      starting_at: new Date().toISOString(),
      participants: [
        { name: "PSG", image_path: null },
        { name: "Marseille", image_path: null }
      ],
      stage: {
        name: "Ligue 1",
        image_path: null
      },
      round: {
        name: "Journée 1"
      }
    },
    {
      id: 2,
      name: "Lyon vs Monaco",
      starting_at: new Date().toISOString(),
      participants: [
        { name: "Lyon", image_path: null },
        { name: "Monaco", image_path: null }
      ],
      stage: {
        name: "Ligue 1",
        image_path: null
      },
      round: {
        name: "Journée 1"
      }
    }
  ];

  // Adding a mock refetch function to satisfy the component's expectations
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
    refetch // Add this to fix the error
  };
}
