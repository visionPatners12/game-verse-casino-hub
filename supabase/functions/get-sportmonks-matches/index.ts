
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { format, addDays } from "npm:date-fns";

const SPORTMONKS_API_KEY = Deno.env.get('SPORTMONKS_API_KEY');
const SPORTMONKS_BASE_URL = 'https://api.sportmonks.com/v3/football';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Edge function called: get-sportmonks-matches");
    
    const { date } = await req.json();
    console.log("Request received with date:", date);
    
    if (!SPORTMONKS_API_KEY) {
      console.error("SPORTMONKS_API_KEY is not defined");
      throw new Error("API key not configured");
    }

    // Fetch matches for the next 5 days
    const responses = await Promise.all(
      Array.from({ length: 5 }, (_, i) => {
        const currentDate = format(addDays(new Date(date), i), 'yyyy-MM-dd');
        return fetch(
          `${SPORTMONKS_BASE_URL}/leagues/date/${currentDate}?include=today.scores;today.participants;today.stage;today.group;today.round&api_token=${SPORTMONKS_API_KEY}`
        ).then(res => res.json());
      })
    );
    
    // Combine and merge matches from all days into their respective leagues
    const leaguesMap = new Map();
    
    responses.forEach(response => {
      response.data.forEach(league => {
        if (!leaguesMap.has(league.id)) {
          leaguesMap.set(league.id, {
            ...league,
            today: []
          });
        }
        const existingLeague = leaguesMap.get(league.id);
        existingLeague.today = [...existingLeague.today, ...(league.today || [])];
      });
    });
    
    const mergedData = Array.from(leaguesMap.values());
    
    return new Response(JSON.stringify(mergedData), {
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
