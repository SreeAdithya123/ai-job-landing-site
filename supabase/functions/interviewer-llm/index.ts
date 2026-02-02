import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface InterviewSettings {
  role: string;
  type: string;
  difficulty: string;
  duration: number;
  language: string;
}

const SYSTEM_PROMPT = `You are Devi, an expert AI Interview Coach. You are conducting a professional interview.

IMPORTANT RULES:
1. Ask ONLY ONE question at a time
2. Keep responses concise and voice-friendly (max 2-3 sentences)
3. Do NOT evaluate or give feedback during the interview
4. Listen actively and ask relevant follow-up questions
5. Be encouraging but professional
6. Adapt difficulty based on the candidate's responses

Your personality:
- Warm but professional tone
- Clear and articulate speech
- Patient and supportive
- Focuses on bringing out the best in candidates`;

async function callSarvam(messages: Message[], settings: InterviewSettings): Promise<{ text: string; provider: string }> {
  const SARVAM_API_KEY = Deno.env.get('SARVAM_API_KEY');
  if (!SARVAM_API_KEY) {
    throw new Error('SARVAM_API_KEY not configured');
  }

  const systemMessage = `${SYSTEM_PROMPT}

Interview Context:
- Role: ${settings.role}
- Interview Type: ${settings.type}
- Difficulty: ${settings.difficulty}
- Duration: ${settings.duration} minutes`;

  // Sarvam API uses system message as first message in the array
  const sarvamMessages = [
    { role: 'system', content: systemMessage },
    ...messages
  ];

  console.log('Calling Sarvam API with model sarvam-m...');
  
  const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SARVAM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sarvam-m',
      messages: sarvamMessages,
      max_tokens: 300,
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Sarvam API error:', response.status, error);
    throw new Error(`Sarvam API error: ${response.status}`);
  }

  const result = await response.json();
  console.log('Sarvam API response received successfully');
  return {
    text: result.choices?.[0]?.message?.content || '',
    provider: 'sarvam'
  };
}

async function callOpenRouter(messages: Message[], settings: InterviewSettings): Promise<{ text: string; provider: string }> {
  const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const systemMessage = `${SYSTEM_PROMPT}

Interview Context:
- Role: ${settings.role}
- Interview Type: ${settings.type}
- Difficulty: ${settings.difficulty}
- Duration: ${settings.duration} minutes`;

  // Use stable, available models - prioritize paid then free
  const models = [
    'google/gemini-flash-1.5-8b',
    'meta-llama/llama-3.1-8b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
  ];

  let lastError = '';
  
  for (const model of models) {
    console.log(`Trying OpenRouter model: ${model}`);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': Deno.env.get('OPENROUTER_SITE_URL') || 'https://ai-job-landing-site.lovable.app',
        'X-Title': Deno.env.get('OPENROUTER_SITE_NAME') || 'AI Interviewer',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemMessage },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.7,
      })
    });

    if (response.ok) {
      const result = await response.json();
      const text = result.choices?.[0]?.message?.content || '';
      if (text) {
        console.log(`OpenRouter success with model: ${model}`);
        return { text, provider: `openrouter-${model}` };
      }
    } else {
      const errorText = await response.text();
      console.error(`OpenRouter model ${model} failed:`, response.status, errorText);
      lastError = errorText;
      
      // Continue to next model on 404 or 429
      if (response.status === 404 || response.status === 429) {
        continue;
      }
    }
  }

  throw new Error(`OpenRouter API error: all models failed. Last: ${lastError}`);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, interview_settings, user_plan, is_initial } = await req.json();

    const settings: InterviewSettings = {
      role: interview_settings?.role || 'Software Engineer',
      type: interview_settings?.type || 'Technical',
      difficulty: interview_settings?.difficulty || 'Medium',
      duration: interview_settings?.duration || 30,
      language: interview_settings?.language || 'English',
    };

    // Build conversation history
    let conversationMessages: Message[] = messages || [];
    
    // If initial, add a request for opening question
    if (is_initial || conversationMessages.length === 0) {
      conversationMessages = [
        { 
          role: 'user', 
          content: `Please introduce yourself briefly and start the ${settings.type} interview for the ${settings.role} position. Ask your first question.` 
        }
      ];
    }

    let result: { text: string; provider: string };

    // Route based on plan: paid users get Sarvam, free users get OpenRouter
    const isPaid = user_plan === 'pro' || user_plan === 'plus' || user_plan === 'beginner';
    
    try {
      if (isPaid) {
        result = await callSarvam(conversationMessages, settings);
      } else {
        result = await callOpenRouter(conversationMessages, settings);
      }
    } catch (primaryError) {
      console.error('Primary LLM failed, trying fallback:', primaryError);
      // Fallback to the other provider
      try {
        result = isPaid 
          ? await callOpenRouter(conversationMessages, settings)
          : await callSarvam(conversationMessages, settings);
      } catch (fallbackError) {
        throw new Error('Both LLM providers failed');
      }
    }

    console.log(`LLM Response (${result.provider}):`, result.text.substring(0, 100));

    return new Response(
      JSON.stringify({
        success: true,
        ai_text: result.text,
        provider_used: result.provider
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('LLM Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        ai_text: "I apologize, but I'm having trouble processing your response. Could you please repeat that?",
        provider_used: 'fallback'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
