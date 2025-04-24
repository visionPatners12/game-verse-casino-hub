
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
    
    const apiUrl = `https://api.sportmonks.com/v3/football/fixtures/date/${date}?api_token=${SPORTMONKS_API_KEY}&include=participants;venue;league;stage;round`;
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
    console.log("API Response status:", response.status);
    console.log("API Response preview:", JSON.stringify(data).substring(0, 200) + "...");
    
    let formattedMatches = [];
    
    if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
      formattedMatches = data.data.map(match => {
        // Log individual match details to debug
        console.log(`Processing match: ${match.id} - ${match.name}`);
        console.log(`Match participants:`, JSON.stringify(match.participants?.data || []));
        
        // Extract participant images with checks
        const participants = match.participants?.data?.map(p => ({
          name: p.name,
          image_path: p.image_path || null
        })) || [];
        
        // Extract league/stage image with checks
        const stageData = match.stage?.data || {};
        const leagueData = match.league?.data || {};
        const leagueImage = leagueData.image_path || null;
        
        return {
          id: match.id,
          name: match.name,
          starting_at: match.starting_at,
          participants: participants,
          stage: { 
            name: stageData.name || 'Ligue',
            image_path: leagueImage
          },
          round: { name: match.round?.data?.name || '1' }
        };
      });
      
      console.log(`Returning ${formattedMatches.length} real matches`);
      // Log the first formatted match for verification
      if (formattedMatches.length > 0) {
        console.log("First formatted match:", JSON.stringify(formattedMatches[0]));
      }
    } else {
      console.log("No matches found or API error. Generating mock matches...");
      
      const now = new Date();
      const startTime1 = new Date(now);
      startTime1.setHours(now.getHours() + 2);
      const startTime2 = new Date(now);
      startTime2.setHours(now.getHours() + 4);
      const startTime3 = new Date(now);
      startTime3.setHours(now.getHours() + 6);
      
      formattedMatches = [
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
      
      console.log(`Returning ${formattedMatches.length} mock matches`);
      console.log("First mock match:", JSON.stringify(formattedMatches[0]));
    }
    
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
