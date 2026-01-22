import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map voice names to Sarvam speaker IDs
const VOICE_MAP: Record<string, string> = {
  'Anushka': 'anushka',
  'Manisha': 'manisha', 
  'Vidya': 'vidya',
  'Arjun': 'arjun',
  'Amol': 'amol',
  'Amartya': 'amartya',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SARVAM_API_KEY = Deno.env.get('SARVAM_API_KEY');
    if (!SARVAM_API_KEY) {
      throw new Error('SARVAM_API_KEY not configured');
    }

    const { text, voice, target_language_code, pace, pitch } = await req.json();
    
    if (!text) {
      throw new Error('No text provided');
    }

    // Sarvam TTS has a 1500 character limit per request
    // For longer texts, we'd need to chunk - for now, truncate
    const truncatedText = text.length > 1500 ? text.substring(0, 1500) : text;
    
    // Map voice name to speaker ID
    const speaker = VOICE_MAP[voice] || 'anushka';
    
    console.log(`TTS Request - Voice: ${speaker}, Language: ${target_language_code}, Text length: ${truncatedText.length}`);

    // Call Sarvam TTS API (Bulbul v2 model)
    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'API-Subscription-Key': SARVAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: [truncatedText],
        target_language_code: target_language_code || 'en-IN',
        speaker: speaker,
        pitch: pitch || 1.0,
        pace: pace || 1.0,
        loudness: 1.0,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: 'bulbul:v2'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sarvam TTS API error:', errorText);
      throw new Error(`Sarvam TTS API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // Sarvam returns audio as base64 in the 'audios' array
    const audioData = result?.audios?.[0];
    
    if (!audioData) {
      throw new Error('No audio data in Sarvam response');
    }

    console.log('TTS successful, audio data length:', audioData.length);

    return new Response(
      JSON.stringify({
        success: true,
        audioData: audioData,
        format: 'wav',
        sampleRate: 22050
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('TTS Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        audioData: null
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
