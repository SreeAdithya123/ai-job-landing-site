import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Material generator function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { text, type } = await req.json();
    console.log('Received text length:', text.length, 'Type:', type);

    const prompts = {
      summary: `Write a clear, readable summary of the following text in plain paragraphs. Use numbered sections like "1.", "2." instead of any special formatting. Do not use any symbols like #, *, **, or markdown. Write naturally as a human would explain it to a student:\n\n${text}`,
      notes: `Convert the following text into student-friendly bullet notes. Use dashes (-) for bullet points. Use numbered labels like "Section 1:" for sections. Do not use any markdown symbols like #, *, **, or code blocks. Write in a clear, natural human tone:\n\n${text}`,
      flashcards: `Create Q&A flashcards from the following text. Format each as:\n\nQ: [question]\nA: [answer]\n\nKeep answers concise and clear. Do not use any markdown formatting like #, *, **, or code blocks:\n\n${text}`,
      qa: `Extract important questions and answers from the following text. Format as numbered pairs:\n\n1. Question: [question]\n   Answer: [answer]\n\nDo not use any markdown formatting like #, *, **, or code blocks. Write in a clear, natural tone:\n\n${text}`
    };

    const prompt = prompts[type as keyof typeof prompts] || prompts.summary;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator. Write in plain text only. Do not use any markdown formatting whatsoever - no hash symbols (#), no asterisks (*), no bold (**), no code blocks (```), no underscores for emphasis. Use natural language with clear paragraph breaks, dashes for bullets, and numbered lists. Write as a friendly, knowledgeable human tutor would.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in material-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
