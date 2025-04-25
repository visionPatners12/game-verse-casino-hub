
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { format } from 'https://esm.sh/date-fns@3.3.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SPORTMONKS_API_KEY = Deno.env.get('SPORTMONKS_API_KEY');
const SUPABASE_URL = 'https://ipmhknkldybzfmnwcgav.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting SportMonks data sync...');
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const date = format(new Date(), 'yyyy-MM-dd');
    
    const response = await fetch(
      `https://api.sportmonks.com/v3/football/leagues/date/${date}?include=today.scores;today.participants;today.stage;today.group;today.round&api_token=${SPORTMONKS_API_KEY}`
    );
    
    const data = await response.json();
    
    // Traiter et sauvegarder les ligues
    for (const league of data.data) {
      await supabase
        .from('sport_leagues')
        .upsert({
          id: league.id,
          name: league.name,
          image_path: league.image_path,
          data: league,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      // Traiter et sauvegarder les matchs
      const matches = league.today || [];
      for (const match of matches) {
        const participants = match.participants || [];
        const homeTeam = participants.find((p: any) => p.meta.location === 'home');
        const awayTeam = participants.find((p: any) => p.meta.location === 'away');

        await supabase
          .from('sport_matches')
          .upsert({
            id: match.id,
            league_id: league.id,
            starting_at: match.starting_at,
            team_a: homeTeam?.name || 'Unknown Team',
            team_b: awayTeam?.name || 'Unknown Team',
            team_a_id: homeTeam?.id,
            team_b_id: awayTeam?.id,
            team_a_image: homeTeam?.image_path,
            team_b_image: awayTeam?.image_path,
            status: match.result_info,
            scores: match.scores,
            data: match,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
      }
    }

    console.log('SportMonks data sync completed successfully');
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in sync-sportmonks-data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
