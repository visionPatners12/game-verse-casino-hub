
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SPORTMONKS_API_KEY = Deno.env.get('SPORTMONKS_API_KEY');
const SPORTMONKS_BASE_URL = 'https://api.sportmonks.com/v3/football';

// Ajout des headers CORS pour permettre les requêtes depuis le frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Edge function called: get-sportmonks-matches");
    
    // Extraire les données de la requête
    const { date } = await req.json();
    console.log("Request received with date:", date);
    
    if (!SPORTMONKS_API_KEY) {
      console.error("SPORTMONKS_API_KEY is not defined");
      throw new Error("API key not configured");
    }
    
    console.log("Calling SportMonks API...");
    const response = await fetch(
      `${SPORTMONKS_BASE_URL}/leagues/date/${date}?include=today.scores;today.participants;today.stage;today.group;today.round&api_token=${SPORTMONKS_API_KEY}`
    );

    if (!response.ok) {
      console.error(`SportMonks API returned ${response.status}`);
      throw new Error(`SportMonks API returned ${response.status}`);
    }

    const data = await response.json();
    console.log("API response received successfully");
    
    return new Response(JSON.stringify(data.data), {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error in get-sportmonks-matches:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
