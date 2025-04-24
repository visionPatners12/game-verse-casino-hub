
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
      `https://api.sportmonks.com/api/v3/football/fixtures/date/${today}?api_token=${SPORTMONKS_API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    // Transform the data to match the expected structure for duo bets
    const formattedMatches = data.map(match => ({
      id: match.id,
      name: match.name,
      starting_at: match.starting_at,
      participants: match.participants.map(team => ({
        name: team.name
      })),
      stage: {
        name: match.stage?.name || 'Unknown Stage'
      },
      round: {
        name: match.round?.name || 'Unknown Round'
      }
    }));

    return new Response(
      JSON.stringify(formattedMatches),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

