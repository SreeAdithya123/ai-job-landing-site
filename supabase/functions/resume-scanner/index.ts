import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let { resumeText, targetRole } = await req.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return new Response(JSON.stringify({ error: 'Resume text must be at least 50 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const MAX_CHARS = 100000;
    if (resumeText.length > MAX_CHARS) {
      console.warn(`Resume text truncated from ${resumeText.length} to ${MAX_CHARS} characters`);
      resumeText = resumeText.substring(0, MAX_CHARS);
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume text and provide a detailed ATS compatibility report.

${targetRole ? `The target role is: ${targetRole}` : 'No specific target role provided.'}

Resume Text:
---
${resumeText}
---

Respond with ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "overallScore": <number 0-100>,
  "sections": {
    "contactInfo": { "score": <0-100>, "feedback": "<brief feedback>" },
    "summary": { "score": <0-100>, "feedback": "<brief feedback>" },
    "experience": { "score": <0-100>, "feedback": "<brief feedback>" },
    "skills": { "score": <0-100>, "feedback": "<brief feedback>" },
    "education": { "score": <0-100>, "feedback": "<brief feedback>" },
    "keywords": { "score": <0-100>, "feedback": "<brief feedback>" },
    "formatting": { "score": <0-100>, "feedback": "<brief feedback>" }
  },
  "suggestions": [
    { "priority": "high" | "medium" | "low", "category": "<category>", "text": "<actionable suggestion>" }
  ],
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "strengths": ["<strength1>", "<strength2>"],
  "summary_text": "<2-3 sentence overall assessment>"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error [${response.status}]: ${errorText}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || '';

    const analysisData = JSON.parse(content);

    return new Response(JSON.stringify(analysisData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Resume scanner error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to analyze resume' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
