import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const SPORTMONKS_API_KEY = Deno.env.get('SPORTMONKS_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchOutput {
  id: number;
  name: string;
  starting_at: string;
  participants: {
    name: string;
    image_path: string | null;
  }[];
  stage: {
    name: string;
    image_path: string | null;
  };
  round: {
    name: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { date } = await req.json();
    console.log(`Fetching leagues and matches for date: ${date}`);
    
    if (!SPORTMONKS_API_KEY) {
      console.error("SPORTMONKS_API_KEY not configured");
      throw new Error("API key not configured.");
    }
    
    const apiUrl = `https://api.sportmonks.com/v3/football/leagues/date/${date}?api_token=${SPORTMONKS_API_KEY}&include=today.scores,today.participants,today.stage,today.group,today.round`;
    console.log(`API URL: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error body: ${errorText}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Raw SportMonks response:", JSON.stringify(data, null, 2));
    
    const formattedMatches: MatchOutput[] = [];
    
    if (data && data.data && Array.isArray(data.data)) {
      if (data.data.length === 0) {
        console.log("No leagues found in API response. Using mock data.");
        return new Response(
          JSON.stringify(generateMockMatches()),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log(`Processing ${data.data.length} leagues from API`);
      
      for (const league of data.data) {
        if (league.today && Array.isArray(league.today.data)) {
          for (const match of league.today.data) {
            console.log(`Processing match ID: ${match.id} - ${match.name}`);
            
            const participants = [];
            if (match.participants && match.participants.data && Array.isArray(match.participants.data)) {
              for (const participant of match.participants.data) {
                participants.push({
                  name: participant.name || "Équipe inconnue",
                  image_path: participant.image_path || null
                });
              }
            }
            
            while (participants.length < 2) {
              participants.push({
                name: `Équipe ${participants.length + 1}`,
                image_path: null
              });
            }
            
            const formattedMatch: MatchOutput = {
              id: match.id,
              name: match.name || `${participants[0].name} vs ${participants[1].name}`,
              starting_at: match.starting_at,
              participants: participants,
              stage: { 
                name: league.name || "Ligue",
                image_path: league.image_path || null
              },
              round: { 
                name: match.round?.data?.name || "1"
              }
            };
            
            formattedMatches.push(formattedMatch);
          }
        }
      }
      
      console.log(`Returning ${formattedMatches.length} formatted matches`);
      
      return new Response(
        JSON.stringify(formattedMatches),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      console.log("Invalid API response format. Using mock data.");
      return new Response(
        JSON.stringify(generateMockMatches()),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    throw error;
  }
});

function generateMockMatches(): MatchOutput[] {
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
