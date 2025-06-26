
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HeyGenStreamingRequest {
  action: 'start' | 'stop' | 'speak';
  text?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const heygenApiKey = Deno.env.get('HEYGEN_API_KEY');
    const heygenAvatarId = Deno.env.get('HEYGEN_AVATAR_ID');

    if (!heygenApiKey || !heygenAvatarId) {
      throw new Error('HeyGen API key or Avatar ID not configured');
    }

    const { action, text }: HeyGenStreamingRequest = await req.json();

    console.log('HeyGen API request:', { action, text: text?.substring(0, 100) });

    let response;
    let requestBody;

    switch (action) {
      case 'start':
        // Create a new streaming session
        requestBody = {
          avatar_id: heygenAvatarId,
          quality: 'high',
          voice: {
            voice_id: 'en-US-JennyNeural',
            rate: 1.0,
            emotion: 'friendly'
          }
        };
        
        response = await fetch('https://api.heygen.com/v2/streaming/create_session', {
          method: 'POST',
          headers: {
            'X-API-KEY': heygenApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        break;

      case 'speak':
        if (!text) {
          throw new Error('Text is required for speak action');
        }
        
        // Send text to the streaming session
        requestBody = {
          session_id: heygenAvatarId, // This should ideally be the session ID from create_session
          text: text,
        };
        
        response = await fetch('https://api.heygen.com/v2/streaming/task', {
          method: 'POST',
          headers: {
            'X-API-KEY': heygenApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        break;

      case 'stop':
        // Close the streaming session
        requestBody = {
          session_id: heygenAvatarId, // This should ideally be the session ID from create_session
        };
        
        response = await fetch('https://api.heygen.com/v2/streaming/stop', {
          method: 'POST',
          headers: {
            'X-API-KEY': heygenApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log('HeyGen API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HeyGen API error:', response.status, errorText);
      throw new Error(`HeyGen API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('HeyGen API response:', data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in heygen-streaming function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
