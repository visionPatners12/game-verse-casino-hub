
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = 'https://ipmhknkldybzfmnwcgav.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    console.log('Starting bet settlement check...')
    
    // Call the database function to check and settle bets
    const { data: settledBets, error } = await supabase
      .rpc('check_bets_for_settlement')
    
    if (error) throw error

    return new Response(
      JSON.stringify({
        success: true,
        settled_bets: settledBets || [],
      }), 
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in settle-duo-bets:', error)
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})
