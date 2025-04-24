
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
    console.log(`API Response status: ${response.status}`);
    
    const formattedMatches = [];
    
    if (data && data.data && Array.isArray(data.data)) {
      if (data.data.length === 0) {
        console.log("No matches found in API response. Using mock data.");
        return new Response(
          JSON.stringify(generateMockMatches()),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Process real data
      console.log(`Processing ${data.data.length} real matches from API`);
      
      for (const match of data.data) {
        console.log(`Processing match ID: ${match.id} - ${match.name}`);
        
        // Extract participants with proper checks
        const participants = [];
        if (match.participants && match.participants.data) {
          for (const participant of match.participants.data) {
            participants.push({
              name: participant.name,
              image_path: participant.image_path
            });
            console.log(`  Participant: ${participant.name}, Image: ${participant.image_path}`);
          }
        }
        
        // If we don't have 2 participants, add placeholder
        while (participants.length < 2) {
          participants.push({
            name: "Team " + (participants.length + 1),
            image_path: null
          });
        }
        
        // Extract league/stage image
        let stageData = { name: 'Ligue' };
        let leagueImage = null;
        
        if (match.stage && match.stage.data) {
          stageData = {
            name: match.stage.data.name || 'Ligue'
          };
        }
        
        if (match.league && match.league.data) {
          leagueImage = match.league.data.image_path;
          console.log(`  League: ${match.league.data.name}, Image: ${leagueImage}`);
        }
        
        formattedMatches.push({
          id: match.id,
          name: match.name,
          starting_at: match.starting_at,
          participants: participants,
          stage: { 
            name: stageData.name,
            image_path: leagueImage
          },
          round: { name: match.round?.data?.name || '1' }
        });
      }
      
      console.log(`Returning ${formattedMatches.length} formatted matches`);
    } else {
      console.log("Invalid API response format. Using mock data.");
      return new Response(
        JSON.stringify(generateMockMatches()),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(formattedMatches),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    
    // Return mock data in case of error
    return new Response(
      JSON.stringify(generateMockMatches()),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateMockMatches() {
  const now = new Date();
  const startTime1 = new Date(now);
  startTime1.setHours(now.getHours() + 2);
  const startTime2 = new Date(now);
  startTime2.setHours(now.getHours() + 4);
  const startTime3 = new Date(now);
  startTime3.setHours(now.getHours() + 6);
  
  return [
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
}
