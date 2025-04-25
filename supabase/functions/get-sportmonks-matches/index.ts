
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SPORTMONKS_API_KEY = Deno.env.get('SPORTMONKS_API_KEY');
const SPORTMONKS_BASE_URL = 'https://api.sportmonks.com/v3/football';

serve(async (req) => {
  try {
    const { date } = await req.json();
    
    const response = await fetch(
      `${SPORTMONKS_BASE_URL}/leagues/date/${date}?include=today.scores;today.participants;today.stage;today.group;today.round&api_token=${SPORTMONKS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`SportMonks API returned ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data.data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
