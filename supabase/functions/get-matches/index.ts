
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
    console.log(`Fetching matches for date: ${date}`);
    
    if (!SPORTMONKS_API_KEY) {
      console.error("SPORTMONKS_API_KEY not configured");
      throw new Error("API key not configured.");
    }
    
    // Using the leagues endpoint with semicolons in the include parameter
    const apiUrl = `https://api.sportmonks.com/v3/football/leagues/date/${date}?api_token=${SPORTMONKS_API_KEY}&include=today.scores;today.participants;today.stage;today.group;today.round`;
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
    console.log("Raw API response:", JSON.stringify(data, null, 2));

    // Process the leagues data structure
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.log("No leagues data found or invalid format");
      return new Response(
        JSON.stringify([]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const allMatches: MatchOutput[] = [];
    
    // Process each league
    for (const league of data.data) {
      if (!league.today || !league.today.data || !Array.isArray(league.today.data)) {
        console.log(`League ${league.id} has no matches today`);
        continue;
      }

      // For each match in the league
      for (const match of league.today.data) {
        const participants = [];
        
        // Extract participants
        if (match.participants && match.participants.data && Array.isArray(match.participants.data)) {
          for (const participant of match.participants.data) {
            participants.push({
              name: participant.name || "Équipe inconnue",
              image_path: participant.image_path || null
            });
          }
        }
        
        // Ensure we have at least two participants
        while (participants.length < 2) {
          participants.push({
            name: `Équipe ${participants.length + 1}`,
            image_path: null
          });
        }

        // Extract stage information
        const stage = {
          name: match.stage?.data?.name || league.name || "Ligue",
          image_path: league.image_path || null
        };

        // Extract round information
        const round = {
          name: match.round?.data?.name || "1"
        };

        // Create the match output object
        const matchOutput: MatchOutput = {
          id: match.id,
          name: `${participants[0].name} vs ${participants[1].name}`,
          starting_at: match.starting_at,
          participants,
          stage,
          round
        };

        allMatches.push(matchOutput);
      }
    }

    console.log(`Returning ${allMatches.length} matches`);
    
    return new Response(
      JSON.stringify(allMatches),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
