
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

    console.log('ElevenLabs function called with action:', action);

    if (!elevenLabsApiKey) {
      console.error('ElevenLabs API key not configured');
      throw new Error('ElevenLabs API key not configured');
    }

    if (!agentId) {
      console.error('ElevenLabs Agent ID not configured');
      throw new Error('ElevenLabs Agent ID not configured');
    }

    if (action === 'get_signed_url') {
      console.log('Getting signed URL for agent:', agentId);
      
      // Generate signed URL using the exact format from ElevenLabs reference
      const url = `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`;
      console.log('Making request to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'xi-api-key': elevenLabsApiKey,
          'Content-Type': 'application/json',
        },
      });

      console.log('ElevenLabs API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error response:', errorText);
        throw new Error(`Failed to get signed URL: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Successfully received signed URL from ElevenLabs');
      
      // Return the signed URL directly as received from ElevenLabs
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
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
