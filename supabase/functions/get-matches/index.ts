
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
    
    // Direct URL to get matches with all necessary includes
    const apiUrl = `https://api.sportmonks.com/v3/football/fixtures/date/${date}?api_token=${SPORTMONKS_API_KEY}&include=participants,league,round,stage`;
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
    console.log("API response received. Data structure:", JSON.stringify(data.data ? { count: data.data.length } : {}, null, 2));
    
    if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.error("No matches found or invalid response format");
      return new Response(
        JSON.stringify([]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processing ${data.data.length} matches from API`);
    
    const formattedMatches: MatchOutput[] = data.data.map(match => {
      // Extract participants
      const participants = [];
      if (match.participants && match.participants.data && Array.isArray(match.participants.data)) {
        for (const participant of match.participants.data) {
          participants.push({
            name: participant.name || "Équipe inconnue",
            image_path: participant.image_path || null
          });
        }
      }
      
      // Ensure we have at least two participants (even if data is missing)
      while (participants.length < 2) {
        participants.push({
          name: `Équipe ${participants.length + 1}`,
          image_path: null
        });
      }
      
      // Extract league/stage info
      let stageName = "Ligue";
      let stageImage = null;
      
      if (match.league && match.league.data) {
        stageName = match.league.data.name || stageName;
        stageImage = match.league.data.image_path || null;
      }
      
      // Extract round info
      let roundName = "1";
      if (match.round && match.round.data) {
        roundName = match.round.data.name || roundName;
      }
      
      // Format match data
      return {
        id: match.id,
        name: match.name || `${participants[0].name} vs ${participants[1].name}`,
        starting_at: match.starting_at,
        participants: participants,
        stage: { 
          name: stageName,
          image_path: stageImage
        },
        round: { 
          name: roundName
        }
      };
    });
    
    console.log(`Returning ${formattedMatches.length} formatted matches`);
    
    return new Response(
      JSON.stringify(formattedMatches),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
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
