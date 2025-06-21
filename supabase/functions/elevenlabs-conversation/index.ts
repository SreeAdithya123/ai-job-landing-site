
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action } = await req.json();
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    const agentId = Deno.env.get('ELEVENLABS_AGENT_ID');

    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    if (!agentId) {
      throw new Error('ElevenLabs Agent ID not configured');
    }

    if (action === 'get_signed_url') {
      console.log('Getting signed URL for agent:', agentId);
      
      // Generate signed URL for ElevenLabs conversation
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
        {
          method: 'GET',
          headers: {
            'xi-api-key': elevenLabsApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', errorText);
        throw new Error(`Failed to get signed URL: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Successfully got signed URL');
      
      return new Response(
        JSON.stringify({ signed_url: data.signed_url }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in elevenlabs-conversation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
