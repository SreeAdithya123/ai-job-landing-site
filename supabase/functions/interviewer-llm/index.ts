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

function buildSystemMessage(settings: InterviewSettings): string {
  return `${SYSTEM_PROMPT}

Interview Context:
- Role: ${settings.role}
- Interview Type: ${settings.type}
- Difficulty: ${settings.difficulty}
- Duration: ${settings.duration} minutes`;
}

// Sarvam requires: system first, then user/assistant alternating starting with user
function validateMessagesForSarvam(messages: Message[], settings: InterviewSettings): Message[] {
  const systemMsg: Message = { role: 'system', content: buildSystemMessage(settings) };
  
  // Filter to only user and assistant messages
  const conversationMsgs = messages.filter(m => m.role === 'user' || m.role === 'assistant');
  
  // If empty or doesn't start with user, add a starter
  if (conversationMsgs.length === 0 || conversationMsgs[0].role !== 'user') {
    return [
      systemMsg,
      { role: 'user', content: `Please introduce yourself briefly and start the ${settings.type} interview for the ${settings.role} position. Ask your first question.` }
    ];
  }
  
  return [systemMsg, ...conversationMsgs];
}

async function callSarvamLLM(messages: Message[], settings: InterviewSettings): Promise<string> {
  const SARVAM_API_KEY = Deno.env.get('SARVAM_API_KEY');
  if (!SARVAM_API_KEY) {
    throw new Error('SARVAM_API_KEY not configured');
  }

  const sarvamMessages = validateMessagesForSarvam(messages, settings);

  console.log('Calling Sarvam LLM API (sarvam-m)...', { messageCount: sarvamMessages.length });
  
  // Use Sarvam's native chat completions endpoint with api-subscription-key header
  const response = await fetch('https://api.sarvam.ai/chat/completions', {
    method: 'POST',
    headers: {
      'api-subscription-key': SARVAM_API_KEY,
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
    const errorText = await response.text();
    console.error('Sarvam LLM error:', response.status, errorText);
    throw new Error(`Sarvam LLM API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log('Sarvam LLM response received successfully');
  
  const content = result.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No content in Sarvam LLM response');
  }
  
  return content;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, interview_settings, is_initial } = await req.json();

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

    // Use Sarvam LLM exclusively (matching STT and TTS)
    const aiText = await callSarvamLLM(conversationMessages, settings);

    console.log('LLM Response:', aiText.substring(0, 100));

    return new Response(
      JSON.stringify({
        success: true,
        ai_text: aiText,
        provider_used: 'sarvam'
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
