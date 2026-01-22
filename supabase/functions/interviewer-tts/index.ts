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

async function callSarvamTTS(
  text: string,
  speaker: string,
  targetLanguageCode: string,
  pitch: number,
  pace: number,
  apiKey: string,
  retryCount = 0
): Promise<{ success: boolean; audioData?: string; error?: string }> {
  const maxRetries = 2;
  const baseDelay = 1000;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'API-Subscription-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: targetLanguageCode,
        speaker: speaker,
        pitch: pitch,
        pace: pace,
        loudness: 1.0,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: 'bulbul:v2'
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      
      // Retry on 502, 503, 504 errors
      if ((response.status >= 502 && response.status <= 504) && retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        console.log(`Sarvam TTS ${response.status}, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, delay));
        return callSarvamTTS(text, speaker, targetLanguageCode, pitch, pace, apiKey, retryCount + 1);
      }
      
      return { success: false, error: `Sarvam API ${response.status}: ${errorText.substring(0, 100)}` };
    }

    const result = await response.json();
    const audioData = result?.audios?.[0];
    
    if (!audioData) {
      return { success: false, error: 'No audio data in Sarvam response' };
    }

    return { success: true, audioData };
  } catch (error) {
    if (error.name === 'AbortError') {
      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        console.log(`Sarvam TTS timeout, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, delay));
        return callSarvamTTS(text, speaker, targetLanguageCode, pitch, pace, apiKey, retryCount + 1);
      }
      return { success: false, error: 'Sarvam API timeout after retries' };
    }
    return { success: false, error: error.message };
  }
}

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
    const truncatedText = text.length > 1500 ? text.substring(0, 1500) : text;
    const speaker = VOICE_MAP[voice] || 'anushka';
    
    console.log(`TTS Request - Voice: ${speaker}, Language: ${target_language_code || 'en-IN'}, Text length: ${truncatedText.length}`);

    const result = await callSarvamTTS(
      truncatedText,
      speaker,
      target_language_code || 'en-IN',
      pitch || 1.0,
      pace || 1.0,
      SARVAM_API_KEY
    );

    if (result.success) {
      console.log('TTS successful, audio data length:', result.audioData!.length);
      return new Response(
        JSON.stringify({
          success: true,
          audioData: result.audioData,
          format: 'wav',
          sampleRate: 22050
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return error but with fallback flag for frontend
    console.error('TTS failed:', result.error);
    return new Response(
      JSON.stringify({
        success: false,
        error: result.error,
        audioData: null,
        useBrowserFallback: true
      }),
      { 
        status: 200, // Return 200 so frontend can handle gracefully
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('TTS Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        audioData: null,
        useBrowserFallback: true
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});