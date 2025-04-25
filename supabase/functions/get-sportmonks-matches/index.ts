
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
    
    const { date, singleDay = false } = await req.json();
    console.log("Request received with date:", date, "singleDay:", singleDay);
    
    if (!SPORTMONKS_API_KEY) {
      console.error("SPORTMONKS_API_KEY is not defined");
      throw new Error("API key not configured");
    }

    let responses = [];
    
    if (singleDay) {
      // Fetch matches for just the single day with odds data included
      const response = await fetch(
        `${SPORTMONKS_BASE_URL}/leagues/date/${date}?include=today.scores;today.participants;today.stage;today.group;today.round;today.odds.bookmaker&filters=markets:1;bookmakers:8&api_token=${SPORTMONKS_API_KEY}`
      );
      
      if (!response.ok) {
        console.error(`Error response from SportMonks API: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error("Error details:", errorText);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      responses = [await response.json()];
      console.log("Successfully fetched data for date:", date);
    } else {
      // Fetch matches for the next 5 days with odds
      console.log("Fetching matches for next 5 days starting from:", date);
      responses = await Promise.all(
        Array.from({ length: 5 }, (_, i) => {
          const currentDate = format(addDays(new Date(date), i), 'yyyy-MM-dd');
          console.log("Fetching matches for date:", currentDate);
          return fetch(
            `${SPORTMONKS_BASE_URL}/leagues/date/${currentDate}?include=today.scores;today.participants;today.stage;today.group;today.round;today.odds.bookmaker&filters=markets:1;bookmakers:8&api_token=${SPORTMONKS_API_KEY}`
          )
          .then(res => {
            if (!res.ok) {
              console.error(`Error for date ${currentDate}: ${res.status} ${res.statusText}`);
              throw new Error(`API request failed for date ${currentDate}`);
            }
            return res.json();
          });
        })
      );
      console.log("Successfully fetched data for all dates");
    }
    
    // Process and transform odds data for each match
    responses.forEach(response => {
      if (response.data) {
        response.data.forEach(league => {
          if (league.today && Array.isArray(league.today)) {
            league.today.forEach(match => {
              if (match.odds && Array.isArray(match.odds)) {
                // Transform odds into a more usable format
                match.odds = transformOdds(match.odds);
                console.log(`Transformed odds for match ID ${match.id}`);
              } else {
                console.log(`No odds data available for match ID ${match.id}`);
                match.odds = {};
              }
            });
          }
        });
      }
    });
    
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
    console.log(`Returning data with ${mergedData.length} leagues`);
    
    return new Response(JSON.stringify(mergedData), {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error in get-sportmonks-matches:", error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Helper function to transform odds from SportMonks format to our app format
function transformOdds(oddsArray) {
  if (!oddsArray || !Array.isArray(oddsArray)) {
    return {};
  }
  
  const transformedOdds = {};
  
  // Process each odds entry
  oddsArray.forEach(odd => {
    if (!odd || !odd.name) return;
    
    // Map SportMonks odds names to our app's format
    let key;
    switch (odd.name.toLowerCase()) {
      case '1':
        key = 'teama';
        break;
      case 'x':
        key = 'draw';
        break;
      case '2':
        key = 'teamb';
        break;
      default:
        return; // Skip unknown odds types
    }
    
    // Extract the value and probability if available
    const value = odd.odds?.[0]?.value || odd.value;
    const probability = odd.odds?.[0]?.probability || odd.probability;
    
    if (value) {
      transformedOdds[key] = {
        value,
        probability: probability || null,
        updated_at: new Date().toISOString()
      };
    }
  });
  
  return transformedOdds;
}
