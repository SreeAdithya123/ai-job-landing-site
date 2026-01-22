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

    const { audioData, mimeType } = await req.json();
    
    if (!audioData) {
      throw new Error('No audio data provided');
    }

    // Decode base64 audio
    const audioBytes = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
    
    // Validate minimum audio size (at least 1KB for meaningful audio)
    if (audioBytes.length < 1000) {
      console.log('Audio too short, skipping:', audioBytes.length, 'bytes');
      return new Response(
        JSON.stringify({
          success: true,
          transcript: '',
          confidence: 0,
          is_final: false
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing audio:', audioBytes.length, 'bytes, mimeType:', mimeType || 'audio/webm');

    // Determine content type - Deepgram supports many formats
    const contentType = mimeType || 'audio/webm';
    
    // Call Deepgram API for transcription
    // Using encoding=linear16 for better compatibility if needed
    const response = await fetch(
      'https://api.deepgram.com/v1/listen?' + new URLSearchParams({
        model: 'nova-2',
        smart_format: 'true',
        language: 'en-IN',
        punctuate: 'true',
        detect_language: 'true'
      }).toString(),
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': contentType,
        },
        body: audioBytes
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Deepgram API error:', errorText);
      
      // If format issue, return empty transcript instead of throwing
      if (response.status === 400) {
        console.log('Audio format issue, returning empty transcript');
        return new Response(
          JSON.stringify({
            success: true,
            transcript: '',
            confidence: 0,
            is_final: false,
            warning: 'Audio format not recognized'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Deepgram API error: ${response.status}`);
    }

    const result = await response.json();
    
    // Extract transcript from Deepgram response
    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    const confidence = result?.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;
    const isFinal = true; // REST API always returns final results

    console.log('Deepgram transcript:', transcript, 'confidence:', confidence);

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
