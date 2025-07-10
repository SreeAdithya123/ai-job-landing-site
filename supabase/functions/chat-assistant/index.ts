import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cohereApiKey = Deno.env.get('COHERE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Chat assistant function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!cohereApiKey) {
      throw new Error('Cohere API key not configured');
    }

    const { message, context } = await req.json();
    console.log('Received message:', message, 'Context:', context);

    const systemPrompts = {
      career: 'You are an expert career coach with years of experience helping professionals advance their careers. Provide personalized, actionable advice on career development, resume optimization, interview preparation, skill development, and job search strategies.',
      recruiter: 'You are a professional recruiter with extensive connections across top companies. Help users connect with recruiters, understand hiring processes, and navigate job opportunities at their target companies.',
      general: 'You are a helpful AI assistant focused on career and professional development.'
    };

    const systemPrompt = systemPrompts[context as keyof typeof systemPrompts] || systemPrompts.general;

    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-r-plus',
        message: message,
        preamble: systemPrompt,
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedResponse = data.text;

    console.log('Generated response:', generatedResponse);

    return new Response(JSON.stringify({ response: generatedResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});