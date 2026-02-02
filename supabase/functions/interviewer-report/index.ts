import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface Message {
  role: 'ai' | 'user';
  content: string;
  timestamp: string;
}

interface ReportSchema {
  overall_score: number;
  technical_score: number;
  communication_score: number;
  problem_solving_score: number;
  confidence_score: number;
  cultural_fit_score: number;
  decision: 'STRONG_HIRE' | 'HIRE' | 'HOLD' | 'NO_HIRE';
  strengths: string[];
  weaknesses: string[];
  next_steps: string[];
  key_quotes: string[];
}

const EVALUATION_PROMPT = `You are an expert interview evaluator. Analyze the following interview transcript and provide a detailed evaluation.

IMPORTANT: You must respond with ONLY valid JSON matching this exact schema:
{
  "overall_score": <number 0-10>,
  "technical_score": <number 0-10>,
  "communication_score": <number 0-10>,
  "problem_solving_score": <number 0-10>,
  "confidence_score": <number 0-10>,
  "cultural_fit_score": <number 0-10>,
  "decision": "<STRONG_HIRE|HIRE|HOLD|NO_HIRE>",
  "strengths": ["<strength1>", "<strength2>", ...],
  "weaknesses": ["<weakness1>", "<weakness2>", ...],
  "next_steps": ["<recommendation1>", "<recommendation2>", ...],
  "key_quotes": ["<notable quote1>", "<notable quote2>", ...]
}

Scoring Guidelines:
- 0-3: Poor performance, significant concerns
- 4-5: Below average, needs improvement
- 6-7: Average, meets basic requirements
- 8-9: Good to excellent performance
- 10: Exceptional, outstanding performance

Decision Guidelines:
- STRONG_HIRE: Overall score 8+, no major weaknesses
- HIRE: Overall score 6-8, manageable weaknesses
- HOLD: Overall score 5-6, needs more evaluation
- NO_HIRE: Overall score below 5, significant concerns`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Authentication failed');
    }

    const body = await req.json();
    const {
      messages,
      settings,
      duration_minutes,
      user_plan = 'free',
    } = body || {};
    
    if (!messages || messages.length === 0) {
      throw new Error('No messages to analyze');
    }

    // Format transcript for evaluation
    const transcript = messages
      .map((m: Message) => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
      .join('\n\n');

    // Call LLM for evaluation with fallback providers/models
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    const SARVAM_API_KEY = Deno.env.get('SARVAM_API_KEY');
    if (!OPENROUTER_API_KEY && !SARVAM_API_KEY) {
      throw new Error('No LLM providers configured (OPENROUTER_API_KEY / SARVAM_API_KEY)');
    }

    const userPrompt = `Interview Settings:
- Role: ${settings?.role || 'Software Engineer'}
- Type: ${settings?.type || 'Technical'}
- Difficulty: ${settings?.difficulty || 'Medium'}
- Duration: ${duration_minutes || 0} minutes

TRANSCRIPT:
${transcript}

Please evaluate this interview and provide your assessment in the required JSON format.`;

    // Try multiple models with fallback on rate limit
    const models = [
      'google/gemini-2.0-flash-exp:free',
      'deepseek/deepseek-chat-v3-0324:free',
      'meta-llama/llama-3.3-70b-instruct:free'
    ];

    const isPaid = user_plan === 'pro' || user_plan === 'plus' || user_plan === 'beginner';

    const callSarvam = async (): Promise<{ content: string; provider: string }> => {
      if (!SARVAM_API_KEY) throw new Error('SARVAM_API_KEY not configured');

      const res = await fetch('https://api.sarvam.ai/chat/completions', {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sarvam-m',
          messages: [
            { role: 'system', content: EVALUATION_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Sarvam error ${res.status}: ${t}`);
      }

      const j = await res.json();
      return { content: j.choices?.[0]?.message?.content || '', provider: 'sarvam' };
    };

    const callOpenRouter = async (): Promise<{ content: string; provider: string }> => {
      if (!OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY not configured');

      let lastError = '';
      for (const model of models) {
        console.log(`Trying OpenRouter model: ${model}`);

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': Deno.env.get('OPENROUTER_SITE_URL') || 'https://ai-job-landing-site.lovable.app',
            'X-Title': Deno.env.get('OPENROUTER_SITE_NAME') || 'AI Interviewer',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: EVALUATION_PROMPT },
              { role: 'user', content: userPrompt },
            ],
            max_tokens: 1000,
            temperature: 0.3,
          }),
        });

        if (res.ok) {
          const j = await res.json();
          return { content: j.choices?.[0]?.message?.content || '', provider: `openrouter:${model}` };
        }

        if (res.status === 429) {
          lastError = `Rate limited on ${model}`;
          // small backoff to reduce immediate re-rate-limit
          await sleep(350);
          continue;
        }

        const t = await res.text();
        lastError = `${model} error ${res.status}: ${t}`;
      }

      throw new Error(`OpenRouter failed. ${lastError}`);
    };

    let aiContent = '';
    let evaluationProvider = 'fallback';

    // Provider preference: paid => Sarvam first, otherwise OpenRouter first
    try {
      const primary = isPaid ? callSarvam : callOpenRouter;
      const { content, provider } = await primary();
      aiContent = content;
      evaluationProvider = provider;
    } catch (primaryErr) {
      console.error('Primary evaluator failed, trying fallback...', primaryErr);
      try {
        const secondary = isPaid ? callOpenRouter : callSarvam;
        const { content, provider } = await secondary();
        aiContent = content;
        evaluationProvider = provider;
      } catch (secondaryErr) {
        console.error('Both evaluators failed; using default evaluation', secondaryErr);
        aiContent = '';
        evaluationProvider = 'default';
      }
    }

    // Parse the JSON response
    let evaluation: ReportSchema;
    try {
      if (!aiContent) throw new Error('Empty AI content');
      // Extract JSON from potential markdown code blocks
      const jsonMatch = aiContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                        aiContent.match(/```\s*([\s\S]*?)\s*```/) ||
                        [null, aiContent];
      evaluation = JSON.parse(jsonMatch[1] || aiContent);
    } catch (parseError) {
      console.error('Failed to parse evaluation JSON:', parseError);
      // Provide default evaluation
      evaluation = {
        overall_score: 5,
        technical_score: 5,
        communication_score: 5,
        problem_solving_score: 5,
        confidence_score: 5,
        cultural_fit_score: 5,
        decision: 'HOLD',
        strengths: ['Unable to fully evaluate'],
        weaknesses: ['Evaluation parsing error occurred'],
        next_steps: ['Please retry the evaluation'],
        key_quotes: []
      };
    }

    // Save interview session to database
    const sessionId = crypto.randomUUID();
    
    // Save to interview_sessions table
    const { error: sessionError } = await supabase
      .from('interview_sessions')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        interview_type: settings?.type || 'Technical',
        question: messages[0]?.content || 'Voice Interview',
        user_response: messages.filter((m: Message) => m.role === 'user').map((m: Message) => m.content).join(' '),
        transcript: messages,
        duration_minutes: duration_minutes || 0,
        timestamp_start: new Date(messages[0]?.timestamp || Date.now()).toISOString(),
        timestamp_end: new Date().toISOString(),
      });

    if (sessionError) {
      console.error('Session save error:', sessionError);
    }

    // Save to interview_analyses table
    const { data: analysisData, error: analysisError } = await supabase
      .from('interview_analyses')
      .insert({
        user_id: user.id,
        interview_type: settings?.type || 'Technical',
        duration_minutes: duration_minutes || 0,
        overall_score: Math.round(evaluation.overall_score * 10), // Convert to 0-100 scale
        technical_score: Math.round(evaluation.technical_score * 10),
        communication_score: Math.round(evaluation.communication_score * 10),
        problem_solving_score: Math.round(evaluation.problem_solving_score * 10),
        confidence_score: Math.round(evaluation.confidence_score * 10),
        strengths: evaluation.strengths,
        areas_for_improvement: evaluation.weaknesses,
        feedback: `Decision: ${evaluation.decision}\n\nNext Steps:\n${evaluation.next_steps.join('\n')}`,
        transcript_summary: evaluation.key_quotes.join('\n'),
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Analysis save error:', analysisError);
      throw new Error('Failed to save analysis');
    }

    console.log('Interview report generated and saved:', analysisData?.id);

    return new Response(
      JSON.stringify({
        success: true,
        analysis_id: analysisData?.id,
        session_id: sessionId,
        evaluation: evaluation,
        evaluation_provider: evaluationProvider
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Report Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
