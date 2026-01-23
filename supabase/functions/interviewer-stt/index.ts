import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SarvamSTTResponse {
  transcript: string;
  language_code?: string;
}

async function callSarvamSTT(
  audioBytes: Uint8Array,
  apiKey: string,
  retryCount = 0
): Promise<{ success: boolean; transcript?: string; error?: string }> {
  const maxRetries = 2;
  const baseDelay = 1000;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    // Create form data with audio file
    const audioBlob = new Blob([audioBytes], { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'saarika:v2.5');
    formData.append('language_code', 'en-IN');

    console.log('Calling Sarvam STT API with', audioBytes.length, 'bytes');

    const response = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': apiKey,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sarvam STT error:', response.status, errorText);

      // Retry on 502, 503, 504 errors
      if ((response.status >= 502 && response.status <= 504) && retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        console.log(`Sarvam STT ${response.status}, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, delay));
        return callSarvamSTT(audioBytes, apiKey, retryCount + 1);
      }

      return { success: false, error: `Sarvam API ${response.status}: ${errorText.substring(0, 200)}` };
    }

    const result: SarvamSTTResponse = await response.json();
    console.log('Sarvam STT result:', result);

    return { 
      success: true, 
      transcript: result.transcript || '' 
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        console.log(`Sarvam STT timeout, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, delay));
        return callSarvamSTT(audioBytes, apiKey, retryCount + 1);
      }
      return { success: false, error: 'Sarvam STT timeout after retries' };
    }
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SARVAM_API_KEY = Deno.env.get('SARVAM_API_KEY');
    if (!SARVAM_API_KEY) {
      throw new Error('SARVAM_API_KEY not configured');
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

    // Call Sarvam STT
    const result = await callSarvamSTT(audioBytes, SARVAM_API_KEY);

    if (!result.success) {
      console.error('Sarvam STT failed:', result.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error,
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

    console.log('Sarvam transcript:', result.transcript);

    return new Response(
      JSON.stringify({
        success: true,
        transcript: result.transcript || '',
        confidence: result.transcript ? 0.9 : 0, // Sarvam doesn't return confidence, estimate based on response
        is_final: true
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
