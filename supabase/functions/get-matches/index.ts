
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const SPORTMONKS_API_KEY = Deno.env.get('SPORTMONKS_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    
    // Using the new leagues endpoint
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
    console.log("Raw API response structure:", JSON.stringify(data, null, 2));

    // Pour l'instant, retournons un tableau vide le temps d'analyser la structure
    return new Response(
      JSON.stringify([]),
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
