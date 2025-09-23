import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SarvamSTTResponse {
  transcript: string;
}

interface SarvamLLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface SarvamTTSResponse {
  audios: string[];
}

async function callSarvamSTT(audioBase64: string): Promise<string> {
  const sarvamApiKey = Deno.env.get('SARVAM_API_KEY');
  
  if (!sarvamApiKey) {
    throw new Error('Sarvam API key not configured');
  }

  // Convert base64 to blob for form data
  const audioData = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
  const audioBlob = new Blob([audioData], { type: 'audio/wav' });
  
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.wav');
  formData.append('model', 'saarika:v2.5');
  formData.append('language_code', 'en-IN');

  const response = await fetch('https://api.sarvam.ai/speech-to-text', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sarvamApiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Sarvam STT error:', response.status, errorText);
    throw new Error(`STT API error: ${response.status}`);
  }

  const data: SarvamSTTResponse = await response.json();
  return data.transcript;
}

async function callSarvamLLM(transcript: string): Promise<string> {
  const sarvamApiKey = Deno.env.get('SARVAM_API_KEY');
  
  if (!sarvamApiKey) {
    throw new Error('Sarvam API key not configured');
  }

  const messages = [
    {
      role: "system",
      content: "You are a professional interviewer. Ask the next question based on the candidate's response."
    },
    {
      role: "user",
      content: transcript || "Please ask me an interview question to start practicing."
    }
  ];

  const response = await fetch('https://api.sarvam.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sarvamApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sarvam-gpt',
      messages: messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Sarvam LLM error:', response.status, errorText);
    throw new Error(`LLM API error: ${response.status}`);
  }

  const data: SarvamLLMResponse = await response.json();
  return data.choices[0]?.message?.content || 'Could not generate response.';
}

async function callSarvamTTS(text: string): Promise<string> {
  const sarvamApiKey = Deno.env.get('SARVAM_API_KEY');
  
  if (!sarvamApiKey) {
    throw new Error('Sarvam API key not configured');
  }

  const response = await fetch('https://api.sarvam.ai/text-to-speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sarvamApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      language_code: 'en-IN',
      voice: 'default',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Sarvam TTS error:', response.status, errorText);
    throw new Error(`TTS API error: ${response.status}`);
  }

  const data: SarvamTTSResponse = await response.json();
  return data.audios[0] || '';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioData, getQuestion } = await req.json();

    // If just getting a question without audio
    if (getQuestion) {
      console.log('Getting new practice question...');
      const aiQuestion = await callSarvamLLM('');
      const aiAudio = await callSarvamTTS(aiQuestion);

      return new Response(JSON.stringify({
        transcript: '',
        aiQuestion,
        aiAudio,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process audio recording
    if (!audioData) {
      return new Response(
        JSON.stringify({ error: 'Audio data is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing audio recording...');

    // Step 1: Speech-to-Text
    console.log('Converting speech to text...');
    const transcript = await callSarvamSTT(audioData);
    console.log('Transcript:', transcript);

    // Step 2: LLM Completion
    console.log('Generating AI response...');
    const aiQuestion = await callSarvamLLM(transcript);
    console.log('AI Response:', aiQuestion);

    // Step 3: Text-to-Speech
    console.log('Converting text to speech...');
    const aiAudio = await callSarvamTTS(aiQuestion);
    console.log('TTS conversion completed');

    return new Response(JSON.stringify({
      transcript,
      aiQuestion,
      aiAudio,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sarvam-practice-interview function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});