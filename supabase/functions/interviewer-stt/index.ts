import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DEEPGRAM_API_KEY = Deno.env.get('DEEPGRAM_API_KEY');
    if (!DEEPGRAM_API_KEY) {
      throw new Error('DEEPGRAM_API_KEY not configured');
    }

    const { audioData } = await req.json();
    
    if (!audioData) {
      throw new Error('No audio data provided');
    }

    // Decode base64 audio
    const audioBytes = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));

    // Call Deepgram API for transcription
    const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&language=en-IN', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'audio/webm',
      },
      body: audioBytes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Deepgram API error:', errorText);
      throw new Error(`Deepgram API error: ${response.status}`);
    }

    const result = await response.json();
    
    // Extract transcript from Deepgram response
    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    const confidence = result?.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;
    const isFinal = true; // REST API always returns final results

    console.log('Deepgram transcript:', transcript);

    return new Response(
      JSON.stringify({
        success: true,
        transcript,
        confidence,
        is_final: isFinal
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('STT Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        transcript: '',
        confidence: 0,
        is_final: false
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
