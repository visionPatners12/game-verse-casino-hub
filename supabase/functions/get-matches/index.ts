
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
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/date/${today}?api_token=${SPORTMONKS_API_KEY}&include=participants;stage;round`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data).substring(0, 200) + "...");

    // Check if data.data exists (API might return data in a nested structure)
    const fixtures = data.data || data;
    
    if (!Array.isArray(fixtures)) {
      console.log("Invalid data format received:", typeof fixtures);
      return new Response(
        JSON.stringify({ error: "Invalid data format received from API" }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Transform the data to match the expected structure for duo bets
    const formattedMatches = fixtures.map(match => ({
      id: match.id,
      name: match.name || `${match.participants?.[0]?.name || 'Team A'} vs ${match.participants?.[1]?.name || 'Team B'}`,
      starting_at: match.starting_at,
      participants: Array.isArray(match.participants) ? 
        match.participants.map(team => ({
          name: team.name
        })) : 
        [{ name: 'Team A' }, { name: 'Team B' }],
      stage: {
        name: match.stage?.name || 'Ligue'
      },
      round: {
        name: match.round?.name || '1'
      }
    }));

    console.log(`Returning ${formattedMatches.length} formatted matches`);
    
    return new Response(
      JSON.stringify(formattedMatches),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error fetching matches:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
