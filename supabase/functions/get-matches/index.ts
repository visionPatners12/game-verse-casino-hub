
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
    console.log(`Fetching matches for date: ${today}`);
    
    // Utilisation du bon endpoint pour les leagues et matches
    const response = await fetch(
      `https://api.sportmonks.com/v3/football/leagues/date/${today}?api_token=${SPORTMONKS_API_KEY}&include=fixtures.participants;fixtures.stage;fixtures.round`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data).substring(0, 200) + "...");
    
    // Vérifier si nous avons des données valides
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.log("Invalid data format received:", data);
      return new Response(
        JSON.stringify({ error: "Format de données invalide reçu de l'API" }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Extraction et transformation des matches depuis les leagues
    const formattedMatches = [];
    
    // Parcourir toutes les leagues
    for (const league of data.data) {
      if (league.fixtures && Array.isArray(league.fixtures.data)) {
        // Parcourir tous les matches de cette league
        for (const match of league.fixtures.data) {
          // Vérifier que le match a toutes les données nécessaires
          if (match) {
            formattedMatches.push({
              id: match.id,
              name: match.name || `Match ${match.id}`,
              starting_at: match.starting_at,
              participants: Array.isArray(match.participants?.data) 
                ? match.participants.data.map(team => ({
                    name: team.name
                  }))
                : [{ name: 'Équipe A' }, { name: 'Équipe B' }],
              stage: {
                name: match.stage?.data?.name || 'Ligue'
              },
              round: {
                name: match.round?.data?.name || '1'
              }
            });
          }
        }
      }
    }

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
