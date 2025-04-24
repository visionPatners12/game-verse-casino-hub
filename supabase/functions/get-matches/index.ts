
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
    
    const response = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/date/${today}?api_token=${SPORTMONKS_API_KEY}`,
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

    // Transformation des matches au format attendu
    const formattedMatches = data.data.map(match => ({
      id: match.id,
      name: match.name,
      starting_at: match.starting_at,
      // Pour les paris duo, on a besoin d'une structure simplifiée
      participants: match.name.split(' vs ').map(name => ({ name: name.trim() })),
      stage: {
        name: 'Ligue' // Valeur par défaut car pas dans la réponse
      },
      round: {
        name: '1' // Valeur par défaut car pas dans la réponse
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
